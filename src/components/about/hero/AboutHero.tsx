import { WaveRing } from "./WaveRing";
import styles from "./aboutHero.module.css";

export function AboutHero() {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <div className={styles.media} aria-hidden="true">
        <WaveRing className={styles.ring} />
      </div>
      <div className={styles.content}>
        <h1 id="about-hero-title" className={styles.title}>
          Moving commerce.<br />
          <span>Building markets.</span>
        </h1>
        <p className={styles.description}>
          Shri Maa Group is a global commerce, distribution and trade company. For nearly three decades we have built the infrastructure, technology and networks that move products from the world&apos;s leading brands into the hands of millions of consumers.
        </p>      </div>
      <div className={styles.rule} aria-hidden="true" />
    </section>
  );
}
