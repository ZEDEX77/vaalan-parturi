# Vaalan Parturi — website

Modern one-page site with scroll animation for Vaalan Parturi (Vaala, Finland).
Finnish-language, light + dark mode matching the brand badge, fully self-contained
(fonts and animation libraries are vendored locally — works offline, GDPR-friendly:
no Google Fonts calls, no external requests at all).

## Run it

Open `index.html` directly, or serve the folder:

```
python -m http.server 8137
```

then visit http://localhost:8137

## Structure

- `index.html` — all content and copy (edit texts/prices here)
- `assets/css/style.css` — design system; brand colors are CSS variables at the top
- `assets/css/fonts.css` + `assets/fonts/` — self-hosted Fraunces & Manrope
- `assets/js/main.js` — scroll choreography (GSAP ScrollTrigger + Lenis, vendored in `assets/js/vendor/`)
- `assets/img/` — logos + circular badge crops (`badge-light/dark.png`, favicon)
- `higgsfield-prompts.md` — ready prompts for the video/photo slots

## Placeholders to replace before going live

| What | Where | Currently |
|---|---|---|
| ~~Phone number~~ | done — real number in place | `046 637 91 31` |
| Email | `index.html` | `info@vaalanparturi.fi` |
| ~~Street address~~ | done — real address in place | `Asematie 1, 91700 Vaala` |
| Opening hours | `index.html` (contact + JSON-LD) | Ma–Pe 9–17, La 10–15 |
| Prices | `index.html` (service cards + hinnasto list) | realistic defaults |
| ~~Social links~~ | done — @vaalanparturi (IG, FB, TikTok, WhatsApp) | real links |

## Upgrade slots (auto-detected, no code changes)

- `assets/video/hero.mp4` — cinematic hero background video (fades in automatically)
- `assets/img/gallery/1.jpg … 4.jpg` — photos for the four style cards

Booking: the "Varaa aika" buttons use `tel:`. If you take a booking system into use
(e.g. Timma), point the buttons' `href` to your booking page.
