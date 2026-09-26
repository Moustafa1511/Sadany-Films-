# Image credits

## hero-cairo-haze.jpg — UNUSED (was the hero backdrop)

Supplied by the client. Original: 2560x1440 PNG (2.7 MB), resized to 2400x1350
and saved as a progressive JPEG (q86, 354 KB) for the web. No other changes.

**Rights not verified.** This file was provided to us as a background image, and
we have no record of its photographer or licence. Before the site goes live,
confirm the client either owns it or holds a licence covering commercial use on
a business website. If neither, replace it — an unlicensed stock or editorial
photograph on a paid-services site is a real liability, not a technicality.

Note for whoever edits the hero next: this frame is tonally inverted compared to
a normal hero. It runs bright through the middle (luminance ~236 at 40-50% of
frame height) and near-black at the foot (~1). That is why the hero uses
`logo-dark.png` and ink-coloured type, why `.hero` carries `padding-bottom: 26vh`
to lift the lockup into the bright band, and why `.scrim` is clear through the
middle. Swapping in a conventional dark image means reversing all four.

The 26vh is also doing compositional work, not just tonal: at 16vh the tagline
landed across the pyramid apex. If you change it, check the pyramid still has
clear space below the type.

## hero-giza-sunset.jpg — UNUSED

Previous hero, no longer referenced. Client-supplied, rights likewise
unverified. Safe to delete.

## hero-pyramids.jpg — UNUSED

Earlier placeholder hero, no longer referenced. Safe to delete.

- Source: "The Giza Plateau - Flickr - Mustang Joe", Wikimedia Commons
- File page: https://commons.wikimedia.org/wiki/File:The_Giza_Plateau_-_Flickr_-_Mustang_Joe.jpg
- Licence: CC0 1.0 (public-domain dedication) — no attribution required,
  commercial use permitted
- Only change from the original: resized from 4982x3326 to 2400x1602

Re-downloadable from the file page above if it is ever wanted back.

## about-portrait.jpg

Supplied by the client on 24 September 2026 as a 2604x3472 PNG (5.3 MB);
downscaled to 1600x2133 and re-encoded as progressive JPEG at q88 (437 KB),
which is comfortably above what the frame ever requests (45vw, so ~1300px on a
2x 1440 screen). Already monochrome, so the site-wide grade in `.photoFrame`
only warms it rather than desaturating it.

Rights not verified — assumed to be the client's own photograph. Confirm before
launch, as with the hero.

The old 150x150 `profile.jpg` it replaced is left on disk and unreferenced; safe
to delete.

## hero-poster.jpg

Not a photograph — frame 0 of `public/videos/Hero/C0015_11.mp4`, exported at its
native 1920x1080 through a canvas, downscaled to 1600x900 and saved as
progressive JPEG q80 (94 KB).

It is the hero's `poster`, so it is what shows while the clip downloads, if
autoplay is refused, and for anyone who has asked for reduced motion. Being the
clip's own first frame is the point: playback begins with nothing visibly
happening. If the hero clip is ever swapped, regenerate this from the new file —
otherwise the poster stops matching and the handoff to playback shows as a jump.

Rights follow the video: client-supplied, not verified.

`hero-cairo-haze.jpg` (2400x1350), which this replaced as the hero backdrop, is
now unreferenced and left on disk.

## selected/*.jpg and featured/*.jpg — the eleven film posters

Not photographs. Each one is **frame 0 of the clip it sits next to**, exported
through a canvas in a real Chrome (Playwright's bundled Chromium cannot decode
H.264, so it hands back blank frames) and downscaled with LANCZOS:

- `selected/` — 8 files, 640x640, progressive JPEG q75, 11.6-52.5 KB
- `featured/` — 3 files, 1200x1200, progressive JPEG q78, 58.8-85.8 KB
- 466.4 KB for all eleven

Being the clip's own first frame is the whole point, and it does four jobs with
one file: it is what shows while the clip downloads, what shows if autoplay is
refused, what shows under reduced motion, and — because it is byte-for-byte the
frame playback begins on — it means starting a clip produces no visible cut.

The filmstrip leans on this harder than the hero does. Those eight clips are
`preload="none"`, so nothing is fetched until a frame is focused; the matching
poster is what makes that wait invisible.

**Regenerate a poster and its clip together, or neither.** `lib/photos.ts` pairs
them by name (`src` is the poster, `video` is the clip) and there is nothing in
the code that can notice they have drifted apart — the only symptom is a jump at
the start of playback.

Rights follow the footage: client-supplied, not verified. Same check needed
before launch as the hero and the portrait.

## featured-first-look.jpg, featured-zaffa.jpg, featured-vow.jpg — UNUSED

Placeholder stills for the three Featured work chapters, replaced by the posters
above when the section became real footage. No longer referenced; safe to delete.
