import Reveal from "./Reveal";
import styles from "./Pricing.module.css";

/**
 * PLACEHOLDER PRICING — the figures below are stand-ins so the section can be
 * designed and reviewed. Replace `price` (and the deliverables, if they differ)
 * with Abdallah's real numbers before the site goes live.
 */
const PACKAGES = [
  {
    id: "engagement",
    name: "Engagement",
    summary: "El Shabka and the celebration around it.",
    price: "12,000",
    duration: "4 hours of coverage",
    features: [
      "One cinematographer",
      "2–3 minute highlight film",
      "Ring exchange in full",
      "Colour-graded 4K delivery",
      "Online gallery within 6 weeks",
    ],
  },
  {
    id: "katb-ketab",
    name: "Katb Ketab",
    summary: "The contract signing, and the gathering it draws.",
    price: "16,000",
    duration: "5 hours of coverage",
    features: [
      "One cinematographer",
      "3–4 minute highlight film",
      "Signing and blessings in full",
      "Family portrait session",
      "Colour-graded 4K delivery",
    ],
  },
  {
    id: "wedding",
    name: "Wedding",
    summary: "The full day, from preparations to the last dance.",
    price: "32,000",
    duration: "10 hours of coverage",
    features: [
      "Two cinematographers",
      "5–7 minute highlight film",
      "Zaffa, ceremony and speeches in full",
      "Drone coverage where permitted",
      "Online gallery within 4 weeks",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    summary: "Every event of the celebration, start to finish.",
    price: "58,000",
    duration: "Two days, unlimited hours",
    features: [
      "Three cinematographers",
      "12–15 minute feature film",
      "Engagement and Katb Ketab included",
      "Drone and second-angle coverage",
      "Licensed music and sound design",
      "Priority delivery within 3 weeks",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className={`section ${styles.wrap}`}>
      <Reveal className={styles.intro}>
        <span className="eyebrow">Investment</span>
        <h2 className="sectionHeading">Packages</h2>
        <p>Four ways to have your celebration filmed — Choose your celebration!</p>
      </Reveal>

      <div className={styles.grid}>
        {PACKAGES.map((pkg, i) => (
          <Reveal key={pkg.id} delay={i * 0.08}>
            <article className={styles.card}>
              <header className={styles.cardHead}>
                <h3>{pkg.name}</h3>
                <p className={styles.summary}>{pkg.summary}</p>
              </header>

              <div className={styles.priceRow}>
                <span className={styles.from}>From</span>
                <span className={styles.price}>{pkg.price}</span>
                <span className={styles.currency}>EGP</span>
              </div>
              <span className={styles.duration}>{pkg.duration}</span>

              <ul className={styles.features}>
                {pkg.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
