import React, { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import useScrollProgress from '../../hooks/useScrollProgress'

/**
 * Vision — back to nothing. Two sentences, one after the other, then the
 * smallest possible sign-off.
 */
// TODO: draft copy — replace with the company's own words
const ABOUT = {
  title: 'Spatial intelligence for real places.',
  body:
    'Arcawave builds spaces that respond to the people inside them. With computer vision and AI we read behavior in real environments like classrooms, playgrounds and exhibitions, and turn it into experiences that adapt. Our first product, Mongle Kids, brings this to children aged 5 to 9.',
  facts: ['Seoul', 'Emeryville, CA', 'Founded 2026'],
}

// TODO: confirm the list — these came from the previous site's partner cards
const PARTNERS = [
  { name: 'Seoul National University', src: '/assets/images/partners/snu.svg', h: 96 },
  { name: 'KAIST', src: '/assets/images/partners/kaist.png', h: 90 },
  { name: 'UC Berkeley', src: '/assets/images/partners/berkeley.svg', h: 96 },
]

/** small entrance: rise + fade, re-plays whenever it scrolls into view */
const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ amount: 0.6 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

const Vision = () => {
  const ref = useRef(null)
  const p = useScrollProgress(ref)

  const partnersOpacity = useTransform(p, [0, 0.16, 0.24], [1, 1, 0])
  const partnersY = useTransform(p, [0, 0.24], [0, -16])
  const oneOpacity = useTransform(p, [0.26, 0.36, 0.5, 0.58], [0, 1, 1, 0])
  const oneY = useTransform(p, [0.26, 0.58], [16, -24])
  const twoOpacity = useTransform(p, [0.62, 0.74], [0, 1])
  const twoY = useTransform(p, [0.62, 0.74], [16, 0])
  const signOpacity = useTransform(p, [0.78, 0.9], [0, 1])

  return (
    <>
      <section id="vision" ref={ref} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* About landing: who we are (left) · who we work with (right) · scroll on (bottom) */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-6 md:px-8"
            style={{ opacity: partnersOpacity, y: partnersY }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start max-w-[1240px] w-full mx-auto">
              {/* left — about */}
              <div>
                <Reveal>
                  <p className="mono-caps" style={{ color: 'var(--ink-3)' }}>
                    About
                  </p>
                </Reveal>
                <Reveal delay={0.08}>
                  <h2 className="display mt-6" style={{ fontSize: 'clamp(28px, 3.6vw, 52px)', maxWidth: '16ch' }}>
                    {ABOUT.title}
                  </h2>
                </Reveal>
                <Reveal delay={0.16}>
                  <p
                    className="mt-6 text-[15px] md:text-[17px] leading-relaxed"
                    style={{ color: 'var(--ink-2)', maxWidth: '46ch' }}
                  >
                    {ABOUT.body}
                  </p>
                </Reveal>
                <Reveal delay={0.24}>
                  <ul className="mono mt-8 flex flex-wrap gap-x-6 gap-y-2" style={{ color: 'var(--ink-3)' }}>
                    {ABOUT.facts.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              {/* right — partners */}
              <div className="md:pl-8">
                <Reveal delay={0.1}>
                  <p className="mono-caps" style={{ color: 'var(--ink-3)' }}>
                    Partners &amp; collaborators
                  </p>
                </Reveal>
                <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-12 gap-y-10 md:gap-x-16">
                  {PARTNERS.map((pt, i) => (
                    <motion.div
                      key={pt.name}
                      initial={{ opacity: 0, y: 28, scale: 0.9, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      viewport={{ amount: 0.6 }}
                      transition={{ duration: 0.8, delay: 0.25 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img
                        src={pt.src}
                        alt={pt.name}
                        title={pt.name}
                        className="partner-logo"
                        style={{ height: pt.h || 96 }}
                        draggable={false}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* bottom — keep going */}
            <motion.div
              className="absolute inset-x-0 bottom-[6vh] flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <span className="mono flex items-center gap-2" style={{ color: 'var(--ink-3)' }}>
                scroll
                <motion.span
                  aria-hidden
                  className="inline-block"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ↓
                </motion.span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center text-center px-6"
            style={{ opacity: oneOpacity, y: oneY }}
          >
            <p className="display" style={{ fontSize: 'clamp(30px, 4.6vw, 72px)', maxWidth: '16ch' }}>
              The next interface
              <br />
              is the world around us.
            </p>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center text-center px-6"
            style={{ opacity: twoOpacity, y: twoY }}
          >
            <p className="display" style={{ fontSize: 'clamp(26px, 3.6vw, 56px)', maxWidth: '22ch' }}>
              Building the intelligence layer
              <br />
              between people and the physical world.
            </p>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-[10vh] flex flex-col items-center gap-4"
            style={{ opacity: signOpacity }}
          >
            <span className="mono-caps" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
              Arcawave
            </span>
            <div className="flex items-center gap-7 text-[13px] font-medium">
              <a href="mailto:help@arcawave.xyz" className="hover:opacity-60 transition-opacity">
                Work with us →
              </a>
              <a
                href="https://www.linkedin.com/company/arcawave/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                LinkedIn ↗
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="px-6 md:px-8 py-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="mono" style={{ color: 'var(--ink-3)' }}>
          © 2026 Arcawave Inc.
        </span>
        <div className="flex items-center gap-6 mono" style={{ color: 'var(--ink-3)' }}>
          <a href="mailto:help@arcawave.xyz" className="hover:text-ink transition-colors">
            help@arcawave.xyz
          </a>
          <a
            href="https://www.linkedin.com/company/arcawave/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </>
  )
}

export default Vision
