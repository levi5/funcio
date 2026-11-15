import { Button } from '@/components/Button'
import { Install } from '@/components/Install'
import { Playground } from '@/components/Playground'
import { heroExample } from '@/content'
import { VERSION } from '@/version'
import styles from './styles.css'

export const Hero = () => (
  <section className={styles.hero} id="top">
    <div className={styles.glow} aria-hidden="true" />

    <p className={styles.eyebrow}>
      <span className={styles.dot} aria-hidden="true" />v{VERSION} · MIT · 0 dependencies
    </p>

    <h1 className={styles.title}>
      Functional programming
      <br />
      <span className={styles.accent}>for Node and the browser.</span>
    </h1>

    <p className={styles.lead}>
      Maybe, Either, <code>pipe</code>, <code>curry</code>, tasks and validation for TypeScript and JavaScript, with no
      runtime dependencies. Edit the examples below and press Run to try them.
    </p>

    <Install />

    <div className={styles.demo} data-hero-demo="">
      <Playground code={heroExample} expected="no email" compact />
    </div>

    <div className={styles.links}>
      <Button variant="primary" href="#playground">
        Open the playground
      </Button>
      <Button variant="ghost" href="#pipe">
        Browse the API
      </Button>
    </div>
  </section>
)
