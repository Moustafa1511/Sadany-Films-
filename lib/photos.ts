// Central image registry. Every image on the site is pulled from here —
// to swap in Abdallah's real stills and film frames later, replace the `src` values
// (or point them at local files in /public) and keep the shape the same.
// Placeholder images come from Picsum (https://picsum.photos), a stable
// no-key-required photo CDN. A uniform grayscale + gold grade is applied
// in CSS (see .photoFrame in globals.css) so every placeholder reads as
// one cinematic, intentional palette rather than random stock.

export type Category = "Weddings" | "Engagements" | "Portraits" | "Films";

export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category?: Category;
  /**
   * Path to a film clip under /public/videos. When set, `src` stops being the
   * subject and becomes the clip's poster — so the two must stay in step: the
   * poster is frame 0 of this exact file, and regenerating one without the other
   * turns the start of playback into a visible jump. Leave it unset and the entry
   * is an ordinary still, which is why Lightbox and the filmstrip can render
   * either without knowing which they were handed.
   */
  video?: string;
}

const picsum = (id: number, w: number, h: number) =>
  `https://picsum.photos/id/${id}/${w}/${h}`;

/**
 * The hero background film: 13.2s of aerial Giza, 1920x1080, H.264/AAC, and
 * faststart (its `moov` box is at byte 24, so the browser knows the dimensions
 * from the first 61 KB rather than after the whole download).
 *
 * At 13.4 MB it is well over the ~8 MB per clip that public/videos/README.md
 * asks for. Nothing on the page waits for it — see the `preload` note in
 * Hero.tsx — but it is still the largest asset on the site by a wide margin.
 */
export const heroVideo = "/videos/Hero/C0015_11.mp4";

/**
 * The frame the film opens on, and therefore the hero's poster.
 *
 * Exported straight out of the video at t=0 rather than being a separate
 * photograph, which is the whole point: when playback starts there is no cut,
 * because the still and the first frame are the same image. It is also what
 * shows while the clip downloads, if autoplay is refused, and for anyone who
 * has asked for reduced motion — three states where it is the only thing on
 * screen, so it is worth the 94 KB it costs.
 *
 * Regenerate it from the video if the clip is ever swapped, or the poster will
 * quietly stop matching and the swap to playback will show as a jump.
 */
export const hero: Photo = {
  id: "hero-poster",
  src: "/images/hero-poster.jpg",
  alt: "The pyramids of Giza from the air, in desert haze",
  width: 1600,
  height: 900,
};

export const aboutPortrait: Photo = {
  id: "about-portrait",
  src: "/images/about-portrait.jpg",
  alt: "Abdallah Al Saadany, photographed at dusk on the shoreline",
  // Client-supplied, downscaled from 2604x3472. The About frame is 4/5 and this
  // is 3/4, so `object-fit: cover` trims about 66px from the top and bottom —
  // worth knowing before swapping in a portrait framed any tighter than this one.
  width: 1600,
  height: 2133,
};

/**
 * Placeholder pool. Nothing renders this any more: Selected work used to be five
 * ids drawn from here, and is now Abdallah's own clips. Kept rather than deleted
 * because this project is not under version control, so a delete is final, and
 * because it is still the only ready-made set if a stills grid ever comes back.
 * It costs a few hundred bytes of strings and no requests.
 */
export const portfolio: Photo[] = [
  { id: "p1", src: picsum(64, 1000, 1250), alt: "Bridal portrait, natural light", width: 1000, height: 1250, category: "Portraits" },
  { id: "p2", src: picsum(91, 1000, 1250), alt: "Cinematic still, wedding film frame", width: 1000, height: 1250, category: "Films" },
  { id: "p3", src: picsum(177, 1000, 1250), alt: "Engagement session, golden hour", width: 1000, height: 1250, category: "Engagements" },
  { id: "p4", src: picsum(203, 1000, 1250), alt: "Seaside wedding, coastal light", width: 1000, height: 1250, category: "Weddings" },
  { id: "p5", src: picsum(342, 1000, 1250), alt: "Wedding procession, zaffa through the crowd", width: 1000, height: 1250, category: "Weddings" },
  { id: "p6", src: picsum(366, 1000, 1250), alt: "Wedding detail — rings and florals", width: 1000, height: 1250, category: "Weddings" },
  { id: "p7", src: picsum(65, 1000, 1250), alt: "Bridal glamour, golden hour", width: 1000, height: 1250, category: "Portraits" },
  { id: "p8", src: picsum(494, 1000, 1250), alt: "Wedding venue, architecture in shadow", width: 1000, height: 1250, category: "Weddings" },
  { id: "p9", src: picsum(519, 1000, 1250), alt: "Engagement session, open road", width: 1000, height: 1250, category: "Engagements" },
  { id: "p10", src: picsum(533, 1000, 1250), alt: "Wedding film, narrative frame", width: 1000, height: 1250, category: "Films" },
  { id: "p11", src: picsum(556, 1000, 1250), alt: "Reception, stillness after dark", width: 1000, height: 1250, category: "Weddings" },
  { id: "p12", src: picsum(585, 1000, 1250), alt: "Wedding reception, first dance", width: 1000, height: 1250, category: "Weddings" },
  { id: "p13", src: picsum(599, 1000, 1250), alt: "Engagement session, above the clouds", width: 1000, height: 1250, category: "Engagements" },
  { id: "p14", src: picsum(628, 1000, 1250), alt: "Behind the scenes, filming with a lens", width: 1000, height: 1250, category: "Films" },
  { id: "p15", src: picsum(338, 1000, 1250), alt: "Bride facing the horizon", width: 1000, height: 1250, category: "Portraits" },
  { id: "p16", src: picsum(823, 1000, 1250), alt: "Behind the scenes, the filmmaker's eye", width: 1000, height: 1250, category: "Films" },
];

/**
 * The clips shown in the Selected work filmstrip, in the order they pass by.
 *
 * All eight are Abdallah's own footage, transcoded down from the masters, which
 * now live outside public/ in footage/"Selected work" so they do not deploy —
 * see public/videos/README.md for the settings and the measurements behind them. Every one is 1080x1080, because the masters
 * are: these were cut square for the feed, and cropping an already-cropped frame
 * to fit a wider box would throw away another 44% of the picture. The strip and
 * the lightbox are shaped around the footage instead.
 *
 * `src` is each clip's own frame 0, so the poster and the first played frame are
 * the same image and focusing a frame starts it without a cut. Regenerate both
 * together if a clip is ever swapped.
 *
 * Ordered for rhythm rather than chronology, because the strip is seen two or
 * three frames at a time and never as a list: wide and tight alternate, and the
 * one clip from the seaside wedding — cool teal against seven warm desert frames
 * — sits late, after the hazy skyline has already cooled the run down, so the
 * palette shift reads as a turn rather than a mistake.
 */
export const selectedWork: Photo[] = [
  {
    id: "sw1",
    src: "/images/selected/veil-courtyard.jpg",
    video: "/videos/selected/veil-courtyard.mp4",
    alt: "A bride crossing a stone courtyard, her veil trailing behind her",
    width: 1080,
    height: 1080,
    category: "Films",
  },
  {
    id: "sw2",
    src: "/images/selected/bridal-portrait.jpg",
    video: "/videos/selected/bridal-portrait.mp4",
    alt: "Close bridal portrait, bouquet held at her waist",
    width: 1080,
    height: 1080,
    category: "Films",
  },
  {
    id: "sw3",
    src: "/images/selected/mashrabiya-arch.jpg",
    video: "/videos/selected/mashrabiya-arch.mp4",
    alt: "A bride framed in a carved wooden arch, the pyramids beyond",
    width: 1080,
    height: 1080,
    category: "Films",
  },
  {
    id: "sw4",
    src: "/images/selected/veil-turn.jpg",
    video: "/videos/selected/veil-turn.mp4",
    alt: "A bride seen from behind, turning to look back over her shoulder",
    width: 1080,
    height: 1080,
    category: "Films",
  },
  {
    id: "sw5",
    src: "/images/selected/groom-and-horse.jpg",
    video: "/videos/selected/groom-and-horse.mp4",
    alt: "The groom leading a white horse across the sand at sunset",
    width: 1080,
    height: 1080,
    category: "Films",
  },
  {
    id: "sw6",
    src: "/images/selected/cairo-skyline.jpg",
    video: "/videos/selected/cairo-skyline.mp4",
    alt: "A bird on a stone parapet, the city hazy behind it",
    width: 1080,
    height: 1080,
    category: "Films",
  },
  {
    id: "sw7",
    src: "/images/selected/shoreline-walk.jpg",
    video: "/videos/selected/shoreline-walk.mp4",
    alt: "The couple walking away down the shoreline, her dress caught by the wind",
    width: 1080,
    height: 1080,
    category: "Films",
  },
  {
    id: "sw8",
    src: "/images/selected/pyramids-profile.jpg",
    video: "/videos/selected/pyramids-profile.mp4",
    alt: "A bride in profile, the pyramids of Giza behind her",
    width: 1080,
    height: 1080,
    category: "Films",
  },
];

export interface FeaturedProject {
  id: string;
  title: string;
  tag: string;
  date: string;
  description: string;
  /** Poster frame — also the fallback when no clip has been supplied yet. */
  photo: Photo;
  /**
   * Path to the film clip under /public/videos. Leave it unset and the chapter
   * falls back to its poster frame, so the section still looks complete.
   * See public/videos/README.md for the file spec.
   */
  video?: string;
}

/**
 * The five films in the Featured work section.
 *
 * NOTE — chapters 4 and 5 are byte-identical to two clips already playing in the
 * Selected work filmstrip: "Featured work/C0015_2.mp4" is the same file as
 * "Selected work/C0015_2.mp4" (sw1, veil-courtyard), and C0015_7.mp4 the same as
 * sw4 (veil-turn). Confirmed by sha256. They were put in this folder deliberately
 * and are shown here as asked, but the consequence is that two of these five
 * films also run in the strip above. Dropping sw1 and sw4 from `selectedWork`
 * would give each film one home; that is a content call, not a code one.
 *
 * NOTE — these two point at the originals, still in public/videos/"Featured work"
 * because they are served, while f1-f3 point at re-encoded copies under featured/.
 * That split is not deliberate design: there are no re-encoded copies of these two
 * clips, and the request was to use the files as delivered.
 *
 * f1-f3 are transcoded from the masters — now in footage/"Featured work", outside
 * public/ so they do not deploy — at a higher bitrate than the filmstrip clips,
 * because the stage shows them several times larger. Square, like everything else.
 *
 * TODO — the `date` on all five is still a placeholder and is the one thing on
 * this section that is presented as fact and isn't. The files' own metadata is no
 * help: every clip's creation time is the day they were exported, not the day
 * they were shot. Get the real months from Abdallah before launch, or drop the
 * field — a wrong date on a wedding film is the kind of error a couple notices.
 * Five invented months is worse than three: they now read as a chronology.
 */
export const featuredWork: FeaturedProject[] = [
  {
    id: "f1",
    title: "Golden Hour",
    // Both of them in plain white, no gown and no suit, water behind — this is a
    // couple's session rather than a wedding day, and the tag says so instead of
    // flattening all three into "Wedding Film".
    tag: "Couple Session",
    date: "September 2026",
    description:
      "The two of them close and laughing, low sun coming off the water — the unguarded minute between the frames anyone asked for.",
    photo: {
      id: "fw1",
      src: "/images/featured/golden-hour-couple.jpg",
      alt: "A couple close together, laughing, low sun off the water behind them",
      width: 1080,
      height: 1080,
    },
    video: "/videos/featured/golden-hour-couple.mp4",
  },
  {
    id: "f2",
    title: "White on White",
    tag: "Wedding Film",
    date: "August 2026",
    description:
      "White suit, white gown, a white mare on pale sand — the styling carried the whole way through, and walked out into the desert at sunset.",
    photo: {
      id: "fw2",
      src: "/images/featured/desert-horse.jpg",
      alt: "The couple walking a white horse across the sand at sunset",
      width: 1080,
      height: 1080,
    },
    video: "/videos/featured/desert-horse.mp4",
  },
  {
    id: "f3",
    title: "At the Water's Edge",
    tag: "Wedding Film",
    date: "July 2026",
    // The longest clip on the site after the hero: 34.6s and 10 MB. It only
    // downloads if someone actually opens this chapter, which is why it is left
    // at full length — but it is the first place to look if the section ever
    // needs to get lighter.
    description:
      "A first dance with no floor and no audience — just the two of them turning at the edge of the water, the train dragging through wet sand.",
    photo: {
      id: "fw3",
      src: "/images/featured/shoreline-dance.jpg",
      alt: "The couple dancing at the water's edge, her train across the wet sand",
      width: 1080,
      height: 1080,
    },
    video: "/videos/featured/shoreline-dance.mp4",
  },
  {
    id: "f4",
    title: "Stone and Silk",
    tag: "Wedding Film",
    date: "June 2026",
    description:
      "One unbroken walk the length of a carved stone arcade, low sun raking across it, a cathedral veil dragging the whole way.",
    photo: {
      id: "fw4",
      // 1080x1080 here against the filmstrip's 640x640 of the same frame, because
      // the stage shows it several times larger. Same footage, two sizes.
      src: "/images/featured/veil-courtyard.jpg",
      alt: "A bride walking a stone courtyard in low sun, her cathedral veil trailing behind her",
      width: 1080,
      height: 1080,
    },
    video: "/videos/Featured%20work/C0015_2.mp4",
  },
  {
    id: "f5",
    title: "The Turn",
    tag: "Wedding Film",
    date: "May 2026",
    description:
      "Her back to the camera and the plateau behind her, then the turn — and the last seconds go to the beadwork rather than the view.",
    photo: {
      id: "fw5",
      src: "/images/featured/veil-turn.jpg",
      alt: "A bride on a terrace above the Giza plateau, turning to look back over her shoulder",
      width: 1080,
      height: 1080,
    },
    video: "/videos/Featured%20work/C0015_7.mp4",
  },
];

export const instagram: Photo[] = [
  { id: "ig1", src: picsum(1050, 900, 900), alt: "Instagram post 1", width: 900, height: 900 },
  { id: "ig2", src: picsum(1039, 900, 900), alt: "Instagram post 2", width: 900, height: 900 },
  { id: "ig3", src: picsum(1041, 900, 900), alt: "Instagram post 3", width: 900, height: 900 },
  { id: "ig4", src: picsum(1043, 900, 900), alt: "Instagram post 4", width: 900, height: 900 },
  { id: "ig5", src: picsum(1053, 900, 900), alt: "Instagram post 5", width: 900, height: 900 },
  { id: "ig6", src: picsum(1060, 900, 900), alt: "Instagram post 6", width: 900, height: 900 },
];
