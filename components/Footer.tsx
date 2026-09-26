import styles from "./Footer.module.css";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <span className={styles.wordmark}>Abdallah Al Saadany</span>
        <nav className={styles.links}>
          <a href="#about">About</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#featured">Featured</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <div className={styles.bottom}>
        <span>© {YEAR} Abdallah Al Saadany. All rights reserved.</span>
        <a className={styles.toTop} href="#top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
