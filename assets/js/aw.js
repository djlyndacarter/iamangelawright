document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var target=document.querySelector(this.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});document.getElementById('aw-nav')?.classList.remove('aw-open')}})});})
document.addEventListener('DOMContentLoaded',function(){var f=document.getElementById('aw-form-feedback');if(!f)return;var s=new URLSearchParams(window.location.search).get('aw_inquiry');var messages={sent:'Thank you. Your inquiry has been received.',invalid:'Please complete all required fields with a valid email address.',security:'Security check failed. Refresh and try again.',error:'We could not save your inquiry. Please try again.'};if(messages[s]){f.textContent=messages[s];f.style.color=s==='sent'?'#36ce7f':'#ffadad';}});


(function(){
let overlay,booking,preorder,step=1,lastFocus;
function showStep(n){step=n;booking.querySelectorAll('[data-step]').forEach(x=>x.hidden=Number(x.dataset.step)!==step);booking.querySelectorAll('.aw-steps span').forEach((x,i)=>x.classList.toggle('is-active',i+1===step));booking.querySelector('.aw-back').hidden=step===1;booking.querySelector('.aw-next').hidden=step===4;booking.querySelector('.aw-submit').hidden=step!==4;document.getElementById('aw-modal-title').textContent=['SELECT A SERVICE','CHOOSE A TIMELINE','YOUR DETAILS','CONFIRM & SEND'][n-1];}
function openModal(type,product){lastFocus=document.activeElement;overlay.hidden=false;document.body.classList.add('aw-modal-open');booking.hidden=type!=='booking';preorder.hidden=type!=='preorder';if(type==='booking'){showStep(1)}else{document.getElementById('aw-product-title').textContent=product;document.getElementById('aw-product-value').value=product;}overlay.querySelector('.aw-modal-close').focus();}
function closeModal(){overlay.hidden=true;document.body.classList.remove('aw-modal-open');lastFocus?.focus();}
function validateSection(n){let section=booking.querySelector('[data-step="'+n+'"]');if(n===1&&!booking.querySelector('input[name=service]:checked'))return false;if(n===2&&!booking.querySelector('input[name=timeline]:checked'))return false;if(n===3){for(let el of section.querySelectorAll('[required]'))if(!el.reportValidity())return false;}return true;}
document.addEventListener('DOMContentLoaded',function(){overlay=document.getElementById('aw-modal-backdrop');booking=document.getElementById('aw-booking');preorder=document.getElementById('aw-preorder');if(!overlay)return;
document.addEventListener('click',function(e){let link=e.target.closest('[data-aw-modal]');if(link){e.preventDefault();openModal(link.dataset.awModal,link.dataset.product||'');return;}let a=e.target.closest('a,button');if(!a)return;let label=(a.textContent||'').trim().toLowerCase();if(label==='pre-order now'||label==='reserve your copy'){e.preventDefault();let section=a.closest('.group,.relative');let t=section?.textContent||'';openModal('preorder',/sold my car/i.test(t)?'I Sold My Car to Open a Bar':'The Bar Boss Blueprint™');}});
overlay.querySelector('.aw-modal-close').addEventListener('click',closeModal);overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closeModal();});
booking.querySelector('.aw-next').addEventListener('click',function(){if(!validateSection(step))return;if(step===3){let d=new FormData(booking.querySelector('form'));document.getElementById('aw-booking-review').textContent=[d.get('service'),d.get('topic'),d.get('timeline'),d.get('full_name'),d.get('email'),d.get('message')].filter(Boolean).join(' · ');}showStep(Math.min(4,step+1))});booking.querySelector('.aw-back').addEventListener('click',()=>showStep(Math.max(1,step-1)));
let p=new URLSearchParams(location.search).get('aw_modal_status');if(p){let notice=document.createElement('div');notice.style.cssText='position:fixed;z-index:999999;right:20px;bottom:20px;padding:18px;background:#123e26;color:white;box-shadow:0 5px 25px #000';notice.textContent=p==='sent'?'Your request was received. Angela’s team will follow up.':'Submission could not be completed. Please check your details and try again.';document.body.appendChild(notice);setTimeout(()=>notice.remove(),12000);}
});
})();


/* Accessible scroll-to-top control; shown on both desktop and mobile */
(function(){
 function ready(){
  if(document.getElementById('aw-back-to-top'))return;
  var btn=document.createElement('button');btn.type='button';btn.id='aw-back-to-top';btn.setAttribute('aria-label','Scroll to top');btn.title='Back to top';btn.innerHTML='↑';
  document.body.appendChild(btn);
  function refresh(){btn.classList.toggle('aw-back-to-top-visible',(window.scrollY||document.documentElement.scrollTop)>350);}
  btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  window.addEventListener('scroll',refresh,{passive:true});refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();

/* Upgrade legacy Speaking CTA in existing WP pages without overwriting saved design edits. */
(function(){
 function upgrade(){document.querySelectorAll('#aw-page button').forEach(function(b){
  if(b.textContent.trim().toLowerCase()!=='book angela to speak')return;
  var a=document.createElement('a');Array.from(b.attributes).forEach(function(attr){
   if(!['type','onclick','data-aw-modal','data-aw-href'].includes(attr.name))a.setAttribute(attr.name,attr.value);
  });a.setAttribute('href',b.dataset.awHref||'#contact');a.innerHTML=b.innerHTML;b.replaceWith(a);
 });}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgrade);else upgrade();
 document.addEventListener('click',function(e){
  var el=e.target.closest('a');if(!el||el.textContent.trim().toLowerCase()!=='book angela to speak')return;
  var href=el.getAttribute('href')||'';if(!href.startsWith('#'))return;
  var target=document.getElementById(href.substring(1));if(!target)return;
  e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});
  if(history.replaceState)history.replaceState(null,'',href);
 });
})();
