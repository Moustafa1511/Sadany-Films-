# Abdallah Al Saadany — Photography Portfolio

A luxury, minimal, editorial-style portfolio built with Next.js, TypeScript, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Swapping in real photography

Every image on the site is registered in [`lib/photos.ts`](lib/photos.ts). Placeholder
images currently come from [Picsum](https://picsum.photos) with a uniform grayscale + gold
grade applied in `app/globals.css` (`.photoFrame`) so the placeholders read as one
consistent palette.

To use real photos:
1. Drop image files into `public/images/`.
2. In `lib/photos.ts`, change the relevant `src` values to `/images/your-file.jpg`.
3. Remove or adjust the `.photoFrame` filter in `app/globals.css` if you want the real
   photos shown at full color/contrast instead of the current grayscale + gold grade.

## Wiring up the contact form

`app/api/contact/route.ts` currently validates the submission and logs it to the server
console. To actually deliver emails, add a provider such as [Resend](https://resend.com)
or SendGrid: install their SDK, add an API key as an environment variable, and call the
provider inside that route handler in place of the `console.log`.

## Instagram section

The Instagram section (`components/InstagramGrid.tsx`) is a static curated grid linking
out to the real Instagram profile — no API keys or tokens required. Update the handle
constant and swap in real post images as they're published.
