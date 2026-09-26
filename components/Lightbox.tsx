"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Lightbox.module.css";
import type { Photo } from "@/lib/photos";

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = photos[index];
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFilm = Boolean(photo?.video);

  const goPrev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // A focused <video controls> already uses the arrow keys, to scrub and to
      // change volume. Acting on them here as well would skip to the next film
      // the moment someone tried to seek within this one, so the player keeps
      // them whenever it is the thing being typed at.
      if (e.target instanceof HTMLMediaElement) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  // Sound on, because this view is opened by a click on a film and hearing it is
  // the point — the strip already covers the silent, glanceable version.
  //
  // Browsers only allow that off the back of a user gesture, and the rules differ
  // between them, so a refusal is expected rather than exceptional: the fallback
  // mutes and plays again, which leaves a running film and a controls bar one
  // click away from sound, instead of a stalled poster.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {
      video.muted = true;
      void video.play().catch(() => {});
    });
  }, [photo?.id]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <button className={styles.close} onClick={onClose} aria-label="Close">
          Close ✕
        </button>
        <button
          className={`${styles.arrow} ${styles.prev}`}
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label={isFilm ? "Previous film" : "Previous image"}
        >
          ‹
        </button>

        <motion.div
          key={photo.id}
          className={`${styles.stage} ${isFilm ? styles.stageFilm : ""}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {photo.video ? (
            /* Deliberately ungraded, and the only place on the site that is. Every
               other frame gets a filter so the page reads as one palette; here the
               film is the product rather than the furniture, and Abdallah has
               already graded it. Tinting his colour work in the view built for
               watching it would be the wrong call. */
            <video
              ref={videoRef}
              src={photo.video}
              poster={photo.src}
              controls
              loop
              playsInline
              preload="metadata"
              aria-label={photo.alt}
            />
          ) : (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="90vw"
              style={{ filter: "grayscale(92%) contrast(1.12) brightness(0.94) sepia(16%)" }}
            />
          )}
          <span className={styles.caption}>
            {photo.category ? `${photo.category} — ` : ""}
            {photo.alt}
          </span>
        </motion.div>

        <button
          className={`${styles.arrow} ${styles.next}`}
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label={isFilm ? "Next film" : "Next image"}
        >
          ›
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
