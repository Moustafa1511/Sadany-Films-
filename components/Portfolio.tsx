"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import styles from "./Portfolio.module.css";
import { selectedWork } from "@/lib/photos";
import type { Photo } from "@/lib/photos";

/**
 * How far the page scrolls to move the focus on by one frame. The section stays
 * pinned for (frames - 1) x this, so it is the one number that decides how much
 * of the page this gallery occupies.
 *
 * Dropped from 52 when the strip went from five stills to eight clips: 7 steps at
 * 34vh is 238vh of pinned scroll, against the 208vh that four steps at 52 used to
 * cost. Keeping the old value would have pinned the page for 364vh — three and a
 * half screens of a section that cannot be scrolled past.
 */
const STEP_VH = 34;

/**
 * Horizontal spacing between frame centres, as a percentage of a frame's own
 * width. Under 100 so the scaled-down neighbours tuck in behind the focused
 * frame rather than floating away from it.
 */
const SLOT = 82;

/** How much each step away from focus shrinks and fades a frame. */
const SCALE_FALLOFF = 0.17;
const OPACITY_FALLOFF = 0.25;

interface FrameProps {
  photo: Photo;
  index: number;
  /** Scroll progress through the pinned section, 0 to 1. */
  progress: MotionValue<number>;
  count: number;
  lastIndex: number;
  focused: boolean;
  onOpen: () => void;
  onFocus: () => void;
}

function Frame({ photo, index, progress, count, lastIndex, focused, onOpen, onFocus }: FrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  // One clip plays at a time — the focused one. Eight squares of 1080p all
  // decoding at once would cost far more than it showed, since the neighbours are
  // scaled down, faded to 0.14, and mostly off the edge of the mask anyway.
  //
  // Leaving focus rewinds as well as pauses, which is what makes the poster
  // honest: it is this clip's frame 0, so a parked frame and its poster are the
  // same picture, and coming back to a clip starts it again rather than resuming
  // it halfway through a movement.
  //
  // Started from an effect rather than an `autoPlay` attribute because
  // `useReducedMotion` is read during render — it is `null` on the server and the
  // real boolean on the client, so branching an attribute on it would put
  // `autoplay` in one tree and not the other. An effect never runs on the server,
  // so both sides render identical markup. Same reasoning as Hero.tsx.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (focused && !reduceMotion) {
      void video.play().catch(() => {});
      return;
    }
    video.pause();
    // Guarded: seeking before any metadata has arrived is an error in some
    // browsers, and with preload="none" that is the normal state here.
    if (video.readyState > 0) video.currentTime = 0;
  }, [focused, reduceMotion]);

  // Signed distance from the focused position: 0 is centre, +1 one slot right.
  //
  // Wrapped into (-count/2, count/2] so a frame leaving one end of the strip
  // comes back at the other. Without that, focusing the first or last frame
  // leaves half the strip empty — and the first frame is the state the section
  // opens on, so the lopsided version is the one everybody would see. Wrapping
  // means the frames always fill the slots.
  //
  // The seam, where a frame jumps from one end to the other, sits at
  // |d| = count / 2 = 4 — which at SLOT 82% is 328% of a frame's width out from
  // the centre line, or about 1180px at desktop size. A frame is fully outside
  // the strip past roughly 830px, so the jump happens well off screen. Re-check
  // this if SLOT, the frame count, or the strip height changes.
  const distance = useTransform(progress, (p) => {
    const d = index - p * lastIndex;
    return d - count * Math.round(d / count);
  });

  // Percentage translations resolve against the element's own width, so the
  // whole strip stays responsive with nothing measured in JavaScript. The -50
  // is the centring offset, folded into the same transform.
  const x = useTransform(distance, (d) => `${d * SLOT - 50}%`);
  const scale = useTransform(distance, (d) => 1 - Math.min(Math.abs(d), 3) * SCALE_FALLOFF);
  const opacity = useTransform(distance, (d) =>
    Math.max(0.14, 1 - Math.min(Math.abs(d), 3) * OPACITY_FALLOFF),
  );
  // Integer and monotonic, so the focused frame always stacks on top.
  const zIndex = useTransform(distance, (d) => 20 - Math.round(Math.abs(d) * 10));

  const act = () => (focused ? onOpen() : onFocus());

  return (
    <motion.div
      className={`${styles.frame} ${focused ? styles.frameFocused : ""} photoFrame`}
      style={{ x, scale, opacity, zIndex }}
      onClick={act}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && act()}
      aria-label={
        focused
          ? `${photo.alt} — open this film full screen, with sound`
          : `Bring ${photo.alt} into focus`
      }
    >
      {/* `preload="none"` is the whole bandwidth story for this section. Eight
          clips asking even for metadata would cost about a megabyte before anyone
          has scrolled this far; this way nothing is fetched until a frame is
          focused, and the poster — frame 0 of the same file — is what stands in
          until then, so the wait is invisible rather than blank.

          Decorative: the wrapper above is the labelled control, and a second
          accessible name on the media inside it would only be read twice. */}
      <video
        ref={videoRef}
        src={photo.video}
        poster={photo.src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
    </motion.div>
  );
}

export default function Portfolio() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const count = selectedWork.length;
  const lastIndex = count - 1;

  // Progress runs 0 at the moment the section pins, 1 when it releases.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const syncFocus = useCallback(
    (p: number) => {
      const next = Math.round(Math.min(1, Math.max(0, p)) * lastIndex);
      setFocusIndex((current) => (current === next ? current : next));
    },
    [lastIndex],
  );

  useMotionValueEvent(scrollYProgress, "change", syncFocus);

  // A reload restores the previous scroll position, and a #portfolio link jumps
  // straight in. Either can land mid-section with no scroll event to follow, so
  // the readout is seeded from wherever the page actually starts.
  useEffect(() => {
    syncFocus(scrollYProgress.get());
  }, [syncFocus, scrollYProgress]);

  // Scroll position is the single source of truth for which frame is focused,
  // so the arrows and the side frames move the page rather than setting state
  // directly — otherwise the next scroll event would immediately overrule them.
  const scrollToIndex = useCallback(
    (i: number) => {
      const el = sectionRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(lastIndex, i));
      const top = window.scrollY + el.getBoundingClientRect().top;
      const span = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + (span * clamped) / lastIndex, behavior: "smooth" });
    },
    [lastIndex],
  );

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className={styles.scroller}
      // Drives the section's height in CSS. Set as a custom property rather than
      // a computed pixel height so it renders identically on server and client.
      style={{ ["--steps" as string]: lastIndex, ["--step-vh" as string]: STEP_VH }}
    >
      <div className={styles.viewport}>
        <div className={styles.header}>
          <Reveal>
            <div>
              <span className="eyebrow">Portfolio</span>
              <h2 className="sectionHeading">Selected work</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className={styles.controls}>
              <button
                className={styles.arrow}
                onClick={() => scrollToIndex(focusIndex - 1)}
                disabled={focusIndex === 0}
                aria-label="Previous work"
              >
                &#8592;
              </button>
              <button
                className={styles.arrow}
                onClick={() => scrollToIndex(focusIndex + 1)}
                disabled={focusIndex === lastIndex}
                aria-label="Next work"
              >
                &#8594;
              </button>
            </div>
          </Reveal>
        </div>

        <div className={styles.strip}>
          {selectedWork.map((photo, i) => (
            <Frame
              key={photo.id}
              photo={photo}
              index={i}
              progress={scrollYProgress}
              count={count}
              lastIndex={lastIndex}
              focused={i === focusIndex}
              onOpen={() => setOpenIndex(i)}
              onFocus={() => scrollToIndex(i)}
            />
          ))}
        </div>

        {/* The page is pinned here, so it has to be legible that scrolling is
            doing something and that there is an end to it. Without this the
            section just reads as the page having stopped responding. */}
        <div className={styles.counter}>
          <span className={styles.counterNum}>
            {String(focusIndex + 1).padStart(2, "0")}
          </span>
          <div className={styles.rule}>
            <motion.div
              className={styles.ruleFill}
              style={{ scaleX: scrollYProgress }}
              aria-hidden="true"
            />
          </div>
          <span className={styles.counterTotal}>{String(count).padStart(2, "0")}</span>
        </div>
      </div>

      {openIndex !== null && (
        <Lightbox
          photos={selectedWork}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  );
}
