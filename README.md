# Vaalan Parturi — website

Modern one-page site with scroll animation for Vaalan Parturi (Vaala, Finland).
Multilingual, with light + dark mode matching the brand badge. Fonts and
animation libraries are vendored locally. Online booking connects to Cal.com.

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
| Prices | `index.html` (service cards + hinnasto list) | confirmed: adults €25, students €20, kids €20, beard €15, cut + beard €35 |
| ~~Social links~~ | done — @vaalanparturi (IG, FB, TikTok, WhatsApp) | real links |

## Upgrade slots (auto-detected, no code changes)

- `assets/video/hero.mp4` — cinematic hero background video (fades in automatically)
- `assets/img/gallery/1.jpg … 4.jpg` — photos for the four style cards

## Booking

The five Services cards follow the same order, names, and prices as the price
list. Their headings share the price list's translation keys.

The "Varaa aika" buttons focus the service dropdown in the availability board.
All five services use one shared Cal.com event, `vaalanparturi/ajanvaraus`
(event ID `7065614`), with a fixed **60-minute duration**. Service selection changes
the required `palvelu` booking answer, not the calendar. Keep the English
`providerValue` strings in `assets/js/main.js` aligned with the Cal.com options,
independently of the language used for the website labels.

The availability board, booking requests, and fallback embed use
`Europe/Helsinki`, including Finnish daylight saving time. The shared event uses
the Working hours schedule and checks the barber's calendar for conflicts.
Manual confirmation is enabled with **Unconfirmed bookings still block calendar
slots**, so pending requests hold the hour for every dropdown choice. Seats are
disabled. These provider settings were verified on 14 September 2026.

Cal.com General → Timezone controls organizer confirmation emails. The account,
availability schedule, and event's Appearance → Lock timezone on booking page
all use `Europe/Helsinki`. Fallback links also include `cal.tz=Europe/Helsinki`.

Organizer notification emails use the account's General → Language setting,
which is **English**. The shared event is titled **Barber appointment**, and its
Service options and Phone number label are English too. The website's language
selector only changes displayed labels and the customer's email language
(`attendee.language`); it does not change the organizer's notification language.
Customer-entered notes and names are preserved as entered, not translated.

Use `ajanvaraus` for all production booking entry points. After verifying the
website deployment, retire the six legacy service links from the public Cal.com
profile. Check pending requests first and preserve all existing appointments;
retiring public links must not delete or cancel their bookings.

Booking regression tests: with Node.js and Playwright available, run
`node tests/booking.test.cjs`. Set `PLAYWRIGHT_BROWSER_EXECUTABLE` to a Brave
executable to test with Brave. All external traffic is intercepted and booking
responses are mocked; the tests do not create real appointments.

Run `node tests/scroll.test.cjs` with the same environment for full-animation
regressions covering window-focus refreshes, pinned sections, and back-to-top.
Native CSS smooth scrolling stays disabled whenever Lenis is active so layout
measurements remain immediate. Availability refreshes preserve the visible grid
and selection while the window regains focus.
