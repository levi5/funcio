import { heroExample } from '../../content'

import { Button } from '../Button'
import { Install } from '../Install'
import { Playground } from '../Playground'
import styles from './styles.css'

export const Hero = () => (
  <section className={styles.hero} id="top">
    <div className={styles.glow} aria-hidden="true" />

    <p className={styles.eyebrow}>
      <span className={styles.dot} aria-hidden="true" />
      v0.0.32 · MIT · 0 dependencies
    </p>

    <h1 className={styles.title}>
      Functional programming
      <br />
      <span className={styles.accent}>for Node and the browser.</span>
    </h1>

    <p className={styles.lead}>
      Maybe, Either, <code>pipe</code>, <code>curry</code> and pattern matching for TypeScript. Zero dependencies, no
      platform assumptions — the same code on your server and in the browser. Every example below is a real editor wired
      to the real library, so you can edit one and press Run.
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
