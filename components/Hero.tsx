"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./Hero.module.css";
import { hero, heroVideo } from "@/lib/photos";

/**
 * The opening wipe. WIPE_S is the one number to change to make the wordmark
 * write on faster or slower; the other two follow from it.
 *
 * The easing is near-symmetric rather than the sharp ease-out used elsewhere on
 * the site, and that matters more than it looks: an ease-out covers ~96% of the
 * distance in the first half of its duration, so lengthening one doesn't slow
 * the movement down — it just adds a stall on the last invisible sliver. This
 * curve is at ~51% halfway, so the pen moves at a near-steady rate the whole way
 * and the extra duration is actually spent writing.
 */
const WIPE_DELAY_S = 0.6;
const WIPE_S = 2.6;
const WIPE_EASE = [0.65, 0.05, 0.36, 1] as const;
/** 0.9 is where the curve above reaches 99% — so the tagline lands as the
 *  wordmark settles, with neither a dead beat nor an overlap. */
const SUB_DELAY_S = WIPE_DELAY_S + WIPE_S * 0.9;

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Playback is started here rather than with an `autoPlay` attribute, for the
  // same reason `initial` below must not branch on `reduceMotion`: the hook reads
  // the media query during render, so it is the real boolean on the client and
  // `null` on the server. Branching an attribute on it would put `autoplay` in
  // the client tree and not the server's — a hydration mismatch. An effect never
  // runs on the server, so both sides render the same markup and the decision
  // still gets made before anyone sees a frame move.
  //
  // Muted playback needs no user gesture, but it can still be refused (a data
  // saver, a strict policy). The `.catch` swallows that on purpose: what's left
  // is the poster, which is this clip's own first frame, so a hero that never
  // plays still looks deliberate rather than broken.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    void video.play().catch(() => {});
  }, [reduceMotion]);

  return (
    <section id="top" className={styles.hero}>
      {/* The clip is a slow aerial push, which is why the Ken Burns scale that
          used to be on this wrapper is gone: two drifts at once fought each
          other, and the footage does the job on its own.

          `preload="metadata"` matters more than it looks. The clip is 13.4 MB,
          and pairing a light preload with playback started from the effect below
          means the poster paints first and the download starts after it, instead
          of 13 MB racing the fonts and the wordmark for bandwidth.

          Decorative, so it is hidden from assistive tech — the <h1> wordmark
          carries the meaning here, and a background film has nothing to add to
          it that a caption would. */}
      <div className={styles.imageWrap}>
        <video
          ref={videoRef}
          className={styles.video}
          src={heroVideo}
          poster={hero.src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
      <div className={styles.scrim} />

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* The wordmark leads, tagline sits under it. Dark print, because the
            lockup sits on the bright haze band of the footage — measured at
            161-200 of 255 across the whole clip, so it never darkens under it.

            On open it wipes on left to right, so the script reads as being
            written rather than simply appearing. The tagline is held back until
            the wipe has all but finished — the two arriving together would read
            as a fade, which is the thing being avoided. */}
        <h1 className={styles.title}>
          <motion.span
            className={styles.logoWipe}
            /* `initial` must not branch on a client-only value: the server has no
               media query, so a reduced-motion branch here renders one clip-path
               on the server and another on the client — a hydration mismatch, and
               a blank hero until it resolves. The reduced-motion case is handled
               in CSS instead, where both sides agree from the first paint. */
            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{
              duration: reduceMotion ? 0 : WIPE_S,
              delay: reduceMotion ? 0 : WIPE_DELAY_S,
              ease: WIPE_EASE,
            }}
          >
            <Image
              src="/images/logo-dark.png"
              alt="Sadany Films"
              width={1264}
              height={239}
              priority
              className={styles.logo}
            />
          </motion.span>
        </h1>
        <motion.span
          className={styles.sub}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.9,
            delay: reduceMotion ? 0 : SUB_DELAY_S,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Cinematography &amp; Wedding Films
        </motion.span>
      </motion.div>

      <div className={styles.scrollCue}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
