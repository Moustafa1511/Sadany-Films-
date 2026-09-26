import Image from "next/image";
import Reveal from "./Reveal";
import styles from "./InstagramGrid.module.css";
import { instagram } from "@/lib/photos";

const HANDLE = "@sadany.films";

export default function InstagramGrid() {
  return (
    <section id="instagram" className="section">
      <div className={styles.header}>
        <Reveal>
          <div>
            <span className="eyebrow">Instagram</span>
            <h2 className="sectionHeading">{HANDLE}</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            className={styles.followLink}
            href={`https://instagram.com/${HANDLE.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
          >
            Follow on Instagram
          </a>
        </Reveal>
      </div>

      <div className={styles.grid}>
        {instagram.map((photo, i) => (
          <Reveal key={photo.id} delay={(i % 6) * 0.05} className={`${styles.tile} photoFrame`}>
            <a
              href={`https://instagram.com/${HANDLE.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: "block", position: "relative", width: "100%", height: "100%" }}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 33vw, 16vw" />
              <span className={styles.tileIcon}>♥</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
