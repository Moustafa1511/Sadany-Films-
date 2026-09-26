"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { RefObject } from "react";

interface AutoRotateOptions {
  /** Moves the carousel on by one. Called once per interval. */
  onTick: () => void;
  /** How long each item is held, in milliseconds. */
  interval: number;
  /**
   * Caller-owned reasons to hold — pointer over the rail, a lightbox open, a
   * film playing with its sound on. Rotation picks back up when this is true.
   */
  enabled?: boolean;
  /** The section itself. Rotation only runs while it is actually on screen. */
  targetRef: RefObject<HTMLElement>;
}

/**
 * Advances a carousel on a timer, and — more to the point — knows when not to.
 *
 * Content that moves while you are reading it is the whole reason carousels
 * have a bad name, so this holds still for all four of: a reduced-motion
 * preference, the section being scrolled past, a backgrounded tab, and
 * whatever the caller passes as `enabled`.
 *
 * `restart` resets the countdown, so pressing an arrow doesn't get overridden
 * by a tick that was already half-elapsed. `cycle` increments on every tick and
 * every restart, for keying a progress indicator that has to match the timer.
 */
export function useAutoRotate({
  onTick,
  interval,
  enabled = true,
  targetRef,
}: AutoRotateOptions) {
  const reduceMotion = useReducedMotion();
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [cycle, setCycle] = useState(0);

  // Held in a ref so a fresh closure on every render doesn't reset the timer.
  const tick = useRef(onTick);
  tick.current = onTick;

  const restart = useCallback(() => setCycle((n) => n + 1), []);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetRef]);

  useEffect(() => {
    const read = () => setTabVisible(document.visibilityState === "visible");
    read();
    document.addEventListener("visibilitychange", read);
    return () => document.removeEventListener("visibilitychange", read);
  }, []);

  const running = enabled && onScreen && tabVisible && !reduceMotion;

  // One timeout per step rather than a repeating interval: each tick bumps
  // `cycle`, which re-runs this effect and starts the next countdown from zero.
  // That keeps the timer and the progress indicator on exactly one clock.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      tick.current();
      setCycle((n) => n + 1);
    }, interval);
    return () => window.clearTimeout(id);
  }, [running, interval, cycle]);

  return { running, restart, cycle };
}
