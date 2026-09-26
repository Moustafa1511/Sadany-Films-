"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#featured", label: "Featured" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

const INSTAGRAM = "https://www.instagram.com/sadany.films/";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={`${styles.nav} ${solid || open ? styles.solid : ""}`}>
        <a href="#top" className={styles.wordmark} aria-label="Sadany Films — home">
          {/* Two prints of the wordmark, cross-faded: the white one reads over the
              hero image, the dark one over the parchment header. */}
          <Image
            src="/images/logo.png"
            alt="Sadany Films"
            width={1264}
            height={239}
            priority
            className={`${styles.logoImg} ${styles.logoLight}`}
          />
          <Image
            src="/images/logo-dark.png"
            alt=""
            aria-hidden
            width={1264}
            height={239}
            priority
            className={`${styles.logoImg} ${styles.logoDark}`}
          />
        </a>
        <nav className={styles.links}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a
            className={styles.instagram}
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </nav>
        <button
          className={styles.menuButton}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span style={{ transform: open ? "translateY(3px) rotate(45deg)" : "none" }} />
          <span style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : "none" }} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              Instagram
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
