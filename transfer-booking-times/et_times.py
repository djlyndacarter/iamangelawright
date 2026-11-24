#!/usr/bin/env python3
"""Replace <input type="time" name="time_start|time_end"> fields with easy
Eastern-time dropdowns (30-minute steps, each option marked ET).
Usage: python3 et_times.py FILE [FILE...]   (edits in place, prints changes)
Events/booking forms: start 11:00 AM-1:30 AM, end 11:30 AM-2:00 AM.
Catering forms (field label 'Food ready by'/'Serving until'): 7:00 AM-11:30 PM."""
import re, sys

def times(start_min, end_min):
    out, m = [], start_min
    while m <= end_min:
        h, mm = divmod(m % 1440, 60)
        ap = 'AM' if h < 12 else 'PM'
        h12 = h % 12 or 12
        out.append(f'{h12}:{mm:02d} {ap} ET')
        m += 30
    return out

EV_START = times(11*60, 25*60+30)      # 11:00 AM .. 1:30 AM
EV_END   = times(11*60+30, 26*60)      # 11:30 AM .. 2:00 AM
CAT      = times(7*60, 23*60+30)       # 7:00 AM .. 11:30 PM

def select(name, opts, required, cls):
    o = ''.join(f'<option>{t}</option>' for t in opts)
    req = ' required' if required else ''
    c = f' class="{cls}"' if cls else ''
    return f'<select name="{name}"{req}{c}><option value="">Choose a time (ET)</option>{o}</select>'

INPUT = re.compile(r'<input\b(?=[^>]*\btype="time")[^>]*>')

def patch(html, catering):
    n = 0
    def rep(m):
        nonlocal n
        tag = m.group(0)
        name = re.search(r'\bname="([^"]+)"', tag).group(1)
        req = re.search(r'\brequired\b', tag) is not None
        cls = (re.search(r'\bclass="([^"]+)"', tag) or [None, None])[1]
        opts = CAT if catering else (EV_END if name.endswith('end') else EV_START)
        n += 1
        return select(name, opts, req, cls)
    html = INPUT.sub(rep, html)
    # Label text: add "(Eastern)" after the time labels
    for lab in ['Start time', 'End time', 'Arrival time', 'Food ready by', 'Serving until']:
        html = re.sub(r'(?<![\w(])' + re.escape(lab) + r'(?! \(Eastern\))(?=\s*(<i>|</em>|</span>|\*))',
                      lab + ' (Eastern)', html)
    return html, n

CSS = ('<style id="et-time-css">select[name="time_start"],select[name="time_end"]'
       '{cursor:pointer}</style>')

if __name__ == '__main__':
    for f in sys.argv[1:]:
        s = open(f, encoding='utf-8').read()
        cat = 'Food ready by' in s
        s2, n = patch(s, cat)
        if n and 'et-time-css' not in s2:
            s2 = s2.replace('</head>', CSS + '</head>', 1)
        if s2 != s:
            open(f, 'w', encoding='utf-8').write(s2)
        print(f'{f}: {n} time field(s) changed' + (' [catering]' if cat else ''))
