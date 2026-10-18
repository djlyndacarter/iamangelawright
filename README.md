# iamangelawright.com

Angela Wright's personal brand site, as plain HTML/CSS/JS hosted on Netlify (no build step).

- `index.html` is the home page. Sections are anchored (`#about`, `#services`, `#portfolio`, `#recognition`, `#speaking`, `#contact`).
- `assets/css/site.css` holds the design (Tailwind output from the original Base44 build), `theme.css` the header/nav and modals, `info.css` the bio and brand pop-ups.
- `assets/js/aw.js` runs smooth scrolling, the mobile menu and the pre-order pop-up; `aw-info.js` the bio/brand pop-ups; `forms.js` sends the forms to Netlify Forms.
- `assets/images/` holds every photo and logo.

To add a page, copy `index.html` to `new-page.html` (served at `/new-page`), keep the `<head>`, nav and footer, and replace what's inside `<main id="aw-page">`. Add a link to it in the nav.

Forms (`inquiry`, `book-preorder`, `booking-request`) are Netlify Forms; submissions show under Forms in the Netlify project.

"Book Angela" buttons open the booking page: https://calendar.app.google/bNt4V9HfeRj3hD4s8
