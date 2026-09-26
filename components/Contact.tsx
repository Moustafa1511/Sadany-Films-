"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import styles from "./Contact.module.css";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className={`section ${styles.wrap}`}>
      <div className={styles.inner}>
        <Reveal className={styles.info}>
          <span className="eyebrow">Contact</span>
          <h2 className="sectionHeading">Let&apos;s work together</h2>
          <p>
            Available for cinematography and wedding films across Mansoura, the Nile Delta,
            and beyond. Reach out with your wedding date and a few details about your day.
          </p>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>Abdallah.S@Gmail.com</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Based in</span>
            <span className={styles.infoValue}>Mansoura, Egypt — available across Egypt</span>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="projectType">Project type</label>
              <select id="projectType" name="projectType" defaultValue="Wedding">
                <option>Engagement</option>
                <option>Katb Ketab</option>
                <option>Wedding</option>
                <option>VIP</option>
                <option>Not sure yet</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} required />
            </div>

            <button className={styles.submit} type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>

            {status === "success" && (
              <span className={styles.status}>Thank you — your message has been sent.</span>
            )}
            {status === "error" && (
              <span className={`${styles.status} ${styles.error}`}>
                Something went wrong. Please try again or email directly.
              </span>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
