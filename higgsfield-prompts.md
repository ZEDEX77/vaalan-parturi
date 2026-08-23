# Higgsfield — video & image prompts for vaalanparturi site

The site is fully designed to work **without** any video. But it has ready slots that
upgrade automatically the moment you drop renders into the right folders — no code
changes needed.

Brand look for every prompt: warm espresso-black shadows, cream highlights,
one deep red accent (#C22F23 light / #E0523F dark). Moody, cinematic, film grain.
No text or logos inside the video (the site draws those on top).

---

## 1. Hero background loop → save as `assets/video/hero.mp4`

The site auto-detects this file and fades it in behind the hero at ~30 % opacity.

- **Motion preset:** Dolly In (slow)
- **Duration:** 5–7 s, seamless loop if possible, 1920×1080, H.264, keep under ~6 MB
- **Prompt:**
  > Slow cinematic dolly-in through the doorway of a small Finnish barbershop at dusk,
  > a single leather barber chair lit by one warm tungsten spotlight, dust motes in the
  > light beam, dark espresso wood interior, deep shadows, faint red neon glow from a
  > barber pole reflected on the floor, 35mm film grain, shallow depth of field,
  > photorealistic, moody, no people, no text

Alternative preset that also works beautifully: **Robo-arm orbit** slowly circling
the empty chair.

## 2. Style gallery photos → save as `assets/img/gallery/1.jpg` … `4.jpg`

The four style cards (Klassikko, Häivytys, Tekstuuri, Täysparta) auto-load these
as backgrounds and switch to photo mode.

Use Higgsfield **image** (Soul preset, photoreal) — portrait crop ~1200×1500:

1. `1.jpg` — > Studio portrait of a man with a classic side-part haircut, scissor-finished,
   warm cream backdrop, espresso-toned styling, soft key light from the left, film grain
2. `2.jpg` — > Close-up profile of a fresh skin fade haircut, sharp gradient, barbershop
   interior bokeh in background, warm tungsten light, cinematic
3. `3.jpg` — > Textured medium-length men's haircut, natural movement, backlit with warm
   rim light, dark backdrop, editorial barbershop photography
4. `4.jpg` — > Well-groomed full beard with sharp cheek line, barber applying beard oil,
   macro detail, warm cinematic grade, shallow depth of field

## 3. Optional extra clips (future sections)

- **Crash zoom** onto clipper blades starting up — good for a campaign page.
- **Bullet-time** cape snap around the chair — hero alternative.
- **FPV fly-through** of the shop front in snow — great for a winter Instagram teaser
  reusing the site palette.

## Tips

- Grade clips warm (tungsten ~3200 K), crush the blacks slightly — they will sit
  behind cream/espresso UI in light *and* dark mode.
- Loop trick: generate 5 s, then reverse-append in any editor for a perfect A-B-A loop.
- Keep the hero clip calm. The site's typography carries the drama; the video is texture.
