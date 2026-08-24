# Going live with your own domain

The site is live at **https://zedex77.github.io/vaalan-parturi/** (GitHub Pages,
free hosting with SSL). This guide connects your own domain to it.

## Step 1 — Register the domain ✅ DONE

**vaalanparturi.fi** was registered via Zoner on 24.8.2026
(6.60 € first year, renewal 26.40 €/year — a transfer to a cheaper
registrar is possible later if wanted). Zoner processes the
registration within 1–3 days (usually hours); a confirmation email
arrives when it is active.

## Step 2 — Point the domain at the site (in Oma Zoner → DNS-hallinta)

Once the domain is active, add these records:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | zedex77.github.io |

## Step 3 — Tell GitHub Pages about the domain

Easiest: ask Claude — "attach vaalanparturi.fi to the site" — and it runs:

```bash
gh api -X PUT repos/ZEDEX77/vaalan-parturi/pages -f cname=vaalanparturi.fi
```

Then in the repo settings (Settings → Pages) tick **Enforce HTTPS** once the
certificate is issued (can take up to an hour after DNS propagates).

After the domain is live, also ask Claude to add the final SEO touches
(canonical URL, og:url, sitemap.xml) — they are left out on purpose while the
site lives on the temporary github.io address.

## Updating the site later

Edit the files, then:

```bash
git add -A && git commit -m "update" && git push
```

The live site updates automatically in about a minute.
