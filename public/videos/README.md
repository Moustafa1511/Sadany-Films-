# Film clips

Everything in here is served — `public/` deploys in full, so this folder's size is
upload size. It is currently 62 MB across 14 clips.

The camera masters are **not** in here. They live in `footage/` at the project
root, one level above `public/`, where Next.js cannot serve them; see
`footage/README.md`. They were moved out because 197 MB of originals were
deploying for files no visitor ever requested.

| Folder            | Used by                      | Files | Total   | What they are |
| ----------------- | ---------------------------- | ----- | ------- | ------------- |
| `selected/`       | Selected work filmstrip      | 8     | 17.5 MB | transcodes |
| `featured/`       | Featured chapters 1-3        | 3     | 13.8 MB | transcodes |
| `Featured work/`  | Featured chapters 4-5        | 2     | 13.1 MB | originals, as delivered |
| `Hero/`           | Hero background              | 1     | 13.4 MB | original, as delivered |

## The mixed state, which is not deliberate design

Chapters 4 and 5 and the hero play the client's files exactly as delivered. The
other eleven clips play H.264 re-encodes at 1080x1080 (faststart, 38.5-40.3 dB
PSNR against their originals — visually transparent for web delivery).

That split is an accident of history, not a decision. The standing instruction is
to serve the originals unmodified everywhere; the change that did so across the
whole site was written and then rolled back, and only chapters 4 and 5 — added
afterwards, and with no transcodes ever built for them — still follow it. **If a
clip looks warmer or more cropped than the file does, that is why:** a
`sepia(26%)` filter, the `.photoFrame::after` tint and `object-fit: cover` are all
still in place for the eleven.

`Featured work/` keeps its capital and its space, so its URLs in `lib/photos.ts`
are percent-encoded (`/videos/Featured%20work/C0015_2.mp4`). That points at the
original in place rather than at a copy, so there is no second version to drift.

Those two files are also byte-identical (sha256) to two clips in the filmstrip —
`selected/veil-courtyard.mp4` and `veil-turn.mp4` came from the same masters. Two
of the five featured films therefore also run in the strip above.

## Going back to originals everywhere

Move the wanted file from `footage/` into `public/videos/`, then point the
matching `video:` field in `lib/photos.ts` at its percent-encoded path. Posters
need no regenerating — each is frame 0 of the master, so it is correct for either
version. Two risks come with it, neither a matter of taste:

**1. `29.mov` and `11.mov` are HEVC, not H.264.** They decode in Chrome and Safari
on Apple Silicon, which do it in hardware. But `canPlayType('video/mp4;
codecs="hvc1"')` returns an empty string even where playback works, so it cannot
be feature-detected, and **Firefox ships no HEVC decoder at all**. Chrome on
Windows needs OS-level support, which is not universal. These two back
`shoreline-walk` in the filmstrip and `shoreline-dance` (chapter 3); both would
fall back to their poster rather than break the page, so on Firefox those become
still photographs, silently.

**2. `11.mov` is 71 MB and its `moov` box sits after `mdat`.** Without faststart a
browser cannot begin playing until the whole file has arrived.

Serving all the originals would take this folder from 62 MB to roughly 240 MB.

## If a clip is ever swapped

Each clip is paired with a poster in `public/images/selected/` or
`public/images/featured/` that is *frame 0 of that exact file*. Regenerate both
together or neither, or the start of playback shows as a jump — see
`public/images/CREDITS.md`.

## Hero/C0015_11.mp4

Aerial Giza, 13.19s, 1920x1080, H.264 + AAC, faststart (`moov` at byte 24, so
dimensions are known from the first 61 KB). 13.4 MB, the largest single asset on
the site. Nothing on the page waits for it: the poster paints first, and
`preload="metadata"` plus effect-driven playback keeps the download behind first
paint.

Two measured notes, in case it is re-cut:

- It loops without a crossfade. The cut from last frame back to first measures
  20.3 mean abs luminance difference, against 17.0 for the largest ordinary
  one-second step inside the clip — so the seam is no bigger than movement the
  footage already contains, and reads as camera motion rather than a glitch.
- The lockup sits over 30-52% of frame height, and that band stays bright for the
  whole clip (161-200 of 255, dimming ~38 levels as the camera descends). That is
  what lets the hero carry a *dark* wordmark. A darker replacement clip would need
  `logo.png` instead of `logo-dark.png`, plus inverted treatments on `.logo`'s
  drop-shadow, `.sub`, `.scrollCue` and `.nav`.

## Verifying in a headless browser

Playwright's bundled Chromium has **no H.264 decoder** — clips silently never
reach `loadedmetadata` and you see only posters. Use
`chromium.launch({ channel: "chrome" })`.

## The transcoder, if it is ever needed again

There is no ffmpeg on this machine, but there is `/usr/bin/swiftc`.
`/tmp/tx/tx.swift` is a ~100-line `AVAssetReader` -> `AVAssetWriter` pass
(`tx <in> <out> <bitrateKbps> <maxDim> [startSec] [durSec]`) that sets
`AVVideoAverageBitRateKey` explicitly and `shouldOptimizeForNetworkUse = true` for
faststart. Hardware-accelerated: 65 MB of HEVC became 4.4 MB in about six seconds.
It produced the eleven copies in `selected/` and `featured/`. Note `/tmp` does not
survive a reboot.
