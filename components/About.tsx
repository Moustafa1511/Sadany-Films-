import Image from "next/image";
import styles from "./About.module.css";
import Reveal from "./Reveal";
import { aboutPortrait } from "@/lib/photos";

const STATS = [
  { number: "12+", label: "Years Shooting" },
  { number: "300+", label: "Weddings Filmed" },
  { number: "600+", label: "Happy Couples" },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className={styles.about}>
        <Reveal>
          <div className={`${styles.imageCol} photoFrame`}>
            <Image
              src={aboutPortrait.src}
              alt={aboutPortrait.alt}
              fill
              sizes="(max-width: 860px) 100vw, 45vw"
            />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className={styles.textCol}>
            <span className="eyebrow">About</span>
            <h2 className="sectionHeading">The story behind the frame</h2>
            <p>
              Abdallah Al Saadany is a wedding cinematographer based in Mansoura, Egypt,
              drawn to the quiet moment before or after the obvious one.
              His work spans wedding-day coverage, engagement sessions, and cinematic
              wedding films — always with an eye for restraint, texture, and the discipline
              of natural light.
            </p>
            <p>
              Trained first as a painter, Abdallah brings a painter&apos;s patience to every
              wedding: fewer frames, more intention. Couples return — and refer friends — for
              the same reason: a consistent, cinematic point of view that never overwhelms
              the day.
            </p>
            <div className={styles.stats}>
              {STATS.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
