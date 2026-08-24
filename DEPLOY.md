# Going live with your own domain

The site is live at **https://zedex77.github.io/vaalan-parturi/** (GitHub Pages,
free hosting with SSL). This guide connects your own domain to it.

## Step 1 — Register the domain ✅ DONE

**vaalanparturi.fi** was registered via Zoner on 24.8.2026 (6.60 € first year,
renewal 26.40 €/year). Zoner confirmed the domain on 25.8.2026 — it is active
and resolving.

## Step 2 — Point the domain at the site ⬅️ YOU ARE HERE

Right now vaalanparturi.fi shows Zoner's **"Domainparkki"** placeholder page
(IP 84.34.166.69). That is Zoner's default parking, not our site. It has to be
replaced with GitHub's addresses.

In **Oma Zoner** (my.zoner.fi) → *Omat palvelut / Verkkotunnukset* →
**vaalanparturi.fi** → **DNS-hallinta** (or *DNS-asetukset*):

1. If a **Domainparkki / pysäköinti** service is switched on, switch it off first
   — otherwise it keeps re-adding its own A record.
2. **Delete** the existing A record(s) pointing at `84.34.166.69` (both for `@`
   and for `www`, if the `www` record is an A record).
3. **Add** these five records:

| Type | Name (Nimi) | Value (Arvo / Kohde) |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | zedex77.github.io |

Notes:
- Some panels use an empty name field or the domain itself instead of `@` —
  they all mean the same thing: the bare domain.
- The CNAME value must end with a dot in some panels: `zedex77.github.io.`
- Leave TTL at the default (usually 3600).
- Do **not** touch the nameservers (zoner.g1-dns.com / .one) — those stay.

Changes usually take 15 minutes to a few hours to spread across the internet.

## Step 3 — Attach the domain to GitHub Pages (Claude does this)

Only **after** step 2 has spread. Check with:

```bash
nslookup vaalanparturi.fi 8.8.8.8
```

When that answers 185.199.10x.153 instead of 84.34.166.69, ask Claude
"attach the domain now" and it runs:

```bash
gh api -X PUT repos/ZEDEX77/vaalan-parturi/pages -f cname=vaalanparturi.fi
```

Then, once GitHub has issued the free SSL certificate (up to an hour):

```bash
gh api -X PUT repos/ZEDEX77/vaalan-parturi/pages -F https_enforced=true
```

**Important:** this must not be done before step 2 is live — attaching the domain
makes the github.io address redirect to vaalanparturi.fi, so if the domain still
pointed at the parking page, the site would be unreachable in the meantime.

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
