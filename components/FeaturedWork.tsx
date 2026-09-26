"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import styles from "./FeaturedWork.module.css";
import { featuredWork } from "@/lib/photos";
import { useAutoRotate } from "@/lib/useAutoRotate";

/** How long each chapter is held. Longer than the rail — there is a caption to read. */
const ROTATE_MS = 7000;

export default function FeaturedWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [held, setHeld] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const active = featuredWork[activeIndex];

  const { running, restart, cycle } = useAutoRotate({
    onTick: () => setActiveIndex((i) => (i + 1) % featuredWork.length),
    interval: ROTATE_MS,
    // Sound on means someone is watching that film, not browsing the showreel —
    // cutting away from it on a timer would be the wrong call.
    enabled: !held && muted,
    targetRef: sectionRef,
  });

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    // Autoplay only survives while muted, so unmuting has to re-issue play().
    if (!next) void videoRef.current?.play();
  };

  const pick = (i: number) => {
    setActiveIndex(i);
    restart();
  };

  return (
    <section id="featured" className={`section ${styles.wrap}`} ref={sectionRef}>
      <Reveal className={styles.intro}>
        <span className="eyebrow">Featured Work</span>
        <h2 className="sectionHeading">Signature projects</h2>
      </Reveal>

      <div
        className={styles.layout}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
      >
        <Reveal className={styles.selector}>
          <ul>
            {featuredWork.map((project, i) => (
              <li key={project.id}>
                <button
                  className={`${styles.chapter} ${i === activeIndex ? styles.chapterActive : ""}`}
                  onClick={() => pick(i)}
                  aria-current={i === activeIndex}
                >
                  <span className={styles.chapterNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.chapterTitle}>{project.title}</span>
                  <span className={styles.chapterDate}>{project.date}</span>
                  {/* The only cue that the section will move on its own. Keyed on
                      the cycle so it restarts in step with the timer, and absolutely
                      positioned so appearing and vanishing never shifts the list. */}
                  {i === activeIndex && running && (
                    <motion.span
                      key={cycle}
                      className={styles.progress}
                      aria-hidden="true"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15} className={styles.stageCol}>
          <div className={`${styles.stage} photoFrame`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className={styles.stageInner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {active.video ? (
                  <video
                    ref={videoRef}
                    className={styles.video}
                    src={active.video}
                    poster={active.photo.src}
                    autoPlay
                    loop
                    muted={muted}
                    playsInline
                    preload="metadata"
                    aria-label={`${active.title} — wedding film`}
                  />
                ) : (
                  <Image
                    src={active.photo.src}
                    alt={active.photo.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                    className={styles.still}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {active.video && (
              <button className={styles.sound} onClick={toggleSound}>
                {muted ? "Sound off" : "Sound on"}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className={styles.caption}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.meta}>
                <span>{active.tag}</span>
                <span>·</span>
                <span>{active.date}</span>
              </div>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
