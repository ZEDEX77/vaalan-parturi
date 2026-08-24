# Going live with your own domain

The site is live at **https://vaalanparturi.fi** (GitHub Pages, free hosting
with SSL). The old address https://zedex77.github.io/vaalan-parturi/ now
redirects there. This document records how it was connected.

## Step 1 — Register the domain ✅ DONE

**vaalanparturi.fi** was registered via Zoner on 24.8.2026 (6.60 € first year,
renewal 26.40 €/year). Zoner confirmed the domain on 25.8.2026 — it is active
and resolving.

## Step 2 — Point the domain at the site ✅ DONE 25.8.2026

Done in Oma Zoner → vaalanparturi.fi → DNS-hallinta
(https://home.zoner.fi/domains/4262100/dns). Five custom records:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | *(empty = root)* | 185.199.108.153 | 600 |
| A | *(empty = root)* | 185.199.109.153 | 600 |
| A | *(empty = root)* | 185.199.110.153 | 600 |
| A | *(empty = root)* | 185.199.111.153 | 600 |
| CNAME | www | zedex77.github.io | 600 |

Zoner quirks worth remembering:
- Zoner's own default records are hidden. Adding a custom record of the **same
  type** automatically switches the matching default off — the old parking
  address (84.34.166.69) disappeared on its own, nothing had to be deleted.
- The CNAME **Alias** field rejects a trailing dot. Use `zedex77.github.io`.
- Leave the **Nimi** field empty to mean the root domain.

## Step 3 — Attach the domain to GitHub Pages ✅ DONE 25.8.2026

```bash
gh api -X PUT repos/ZEDEX77/vaalan-parturi/pages -f cname=vaalanparturi.fi
gh api -X PUT repos/ZEDEX77/vaalan-parturi/pages -F https_enforced=true
```

This created a **CNAME** file in the repository root containing
`vaalanparturi.fi`. **Do not delete that file** — it is what binds the domain to
the site.

GitHub issued a free SSL certificate covering both `vaalanparturi.fi` and
`www.vaalanparturi.fi`, and *Enforce HTTPS* is on: plain http now 301-redirects
to https.

Verified working: apex and www both return HTTP 200 over HTTPS with a valid
certificate, serving the real site.

## Step 4 — After the domain works

- Test-scan the QR codes on the business cards / A5 flyers / banner **before**
  sending anything to the printer.
- The site's canonical URL, og:url, sitemap.xml and JSON-LD already point at
  https://vaalanparturi.fi/ — nothing to change there.

## Updating the site later

Edit the files, then:

```bash
git add -A && git commit -m "update" && git push
```

The live site updates automatically in about a minute.
