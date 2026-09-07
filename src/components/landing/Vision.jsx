import React, { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import useScrollProgress from '../../hooks/useScrollProgress'

/**
 * Vision — back to nothing. Two sentences, one after the other, then the
 * smallest possible sign-off.
 */
// TODO: confirm the list — these came from the previous site's partner cards
const PARTNERS = [
  { name: 'Seoul National University', src: '/assets/images/partners/snu.svg', h: 120 },
  { name: 'KAIST', src: '/assets/images/partners/kaist.png', h: 112 },
  { name: 'UC Berkeley', src: '/assets/images/partners/berkeley.svg', h: 120 },
]

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
          {/* About landing: who we work with — quiet, monochrome */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{ opacity: partnersOpacity, y: partnersY }}
          >
            <motion.p
              className="display text-center"
              style={{ fontSize: 'clamp(28px, 3.6vw, 52px)' }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Partners &amp; collaborators
            </motion.p>
            <div className="mt-14 md:mt-20 flex flex-wrap items-center justify-center gap-x-16 gap-y-12 md:gap-x-28">
              {PARTNERS.map((pt, i) => (
                <motion.div
                  key={pt.name}
                  initial={{ opacity: 0, y: 28, scale: 0.9, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  viewport={{ amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={pt.src}
                    alt={pt.name}
                    title={pt.name}
                    className="partner-logo"
                    style={{ height: pt.h || 110 }}
                    draggable={false}
                  />
                </motion.div>
              ))}
            </div>
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
