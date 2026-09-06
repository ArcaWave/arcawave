import React, { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import useScrollProgress from '../../hooks/useScrollProgress'

/**
 * Core — See. Understand. Respond.
 *
 * The scroll itself performs the process. A thin frame is the space.
 * A person crosses it (See). They dissolve into four signals (Understand).
 * The frame turns on — the one accent moment (Respond). Then only the three
 * words remain.
 */

const INK = 'rgba(15,15,15,0.16)'
const ACCENT = 'rgba(55,76,193,1)'

const Word = ({ p, range, children }) => {
  const [a, b] = range
  const opacity = useTransform(p, [a, a + 0.05, b - 0.05, b], [0, 1, 1, 0])
  const y = useTransform(p, [a, b], [14, -14])
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <span className="display" style={{ fontSize: 'clamp(52px, 10vw, 150px)' }}>
        {children}
      </span>
    </motion.div>
  )
}

const DOT_OFFSETS = [-108, -36, 36, 108]

const Core = () => {
  const ref = useRef(null)
  const p = useScrollProgress(ref)

  // the space (frame)
  const frameOpacity = useTransform(p, [0, 0.04, 0.8, 0.86], [0, 1, 1, 0])
  const frameBorder = useTransform(p, [0.57, 0.66], [INK, ACCENT])
  const frameScale = useTransform(p, [0.57, 0.8], [1, 1.035])
  const washOpacity = useTransform(p, [0.58, 0.7, 0.8, 0.86], [0, 1, 1, 0])

  // the person (See)
  const figLeft = useTransform(p, [0.04, 0.27], ['20%', '64%'])
  const figOpacity = useTransform(p, [0.02, 0.07, 0.27, 0.33], [0, 1, 1, 0])

  // the signals (Understand → Respond)
  const dotsOpacity = useTransform(p, [0.3, 0.36, 0.8, 0.86], [0, 1, 1, 0])
  const dotSpread = useTransform(p, [0.3, 0.44], [0, 1])
  const dotRise = useTransform(p, [0.3, 0.44], [0, -56])
  const dotColor = useTransform(p, [0.57, 0.64], ['rgba(15,15,15,1)', ACCENT])

  // the words
  const finalOpacity = useTransform(p, [0.85, 0.91], [0, 1])
  const finalY = useTransform(p, [0.85, 0.91], [10, 0])
  const creditOpacity = useTransform(p, [0.92, 0.98], [0, 1])

  return (
    <section id="core" ref={ref} className="relative" style={{ height: '460vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* frame = the space */}
        <motion.div
          className="absolute"
          style={{
            inset: '12vh 8vw 14vh',
            border: '1px solid',
            borderColor: frameBorder,
            opacity: frameOpacity,
            scale: frameScale,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: washOpacity,
              background:
                'radial-gradient(70% 60% at 50% 100%, rgba(55,76,193,0.12) 0%, rgba(55,76,193,0) 70%)',
            }}
          />

          {/* person crossing the floor line */}
          <motion.div
            className="absolute bottom-0"
            style={{ left: figLeft, opacity: figOpacity, width: 0, height: 0 }}
          >
            <svg
              viewBox="0 0 54 150"
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: '18vh',
                transform: 'translateX(-50%)',
                filter: 'blur(1.6px)',
                opacity: 0.55,
              }}
            >
              <circle cx="27" cy="18" r="13" fill="#0F0F0F" />
              <path
                d="M13 44 Q27 30 41 44 L44 100 Q44 108 38 108 L36 148 L29 148 L27 112 L25 148 L18 148 L16 108 Q10 108 10 100 Z"
                fill="#0F0F0F"
              />
            </svg>
          </motion.div>

          {/* four signals rising out of where the person stood */}
          <motion.div
            className="absolute bottom-0"
            style={{ left: '64%', opacity: dotsOpacity, width: 0, height: 0 }}
          >
            {DOT_OFFSETS.map((off, i) => (
              <Dot key={i} off={off} spread={dotSpread} rise={dotRise} color={dotColor} />
            ))}
          </motion.div>
        </motion.div>

        <Word p={p} range={[0.02, 0.3]}>
          See.
        </Word>
        <Word p={p} range={[0.32, 0.56]}>
          Understand.
        </Word>
        <Word p={p} range={[0.58, 0.82]}>
          Respond.
        </Word>

        {/* what remains */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: finalOpacity, y: finalY }}
        >
          <p className="display" style={{ fontSize: 'clamp(30px, 5.2vw, 76px)' }}>
            See. Understand. Respond.
          </p>
          <motion.p className="mono mt-8" style={{ opacity: creditOpacity, color: 'var(--ink-3)' }}>
            Powered by Computer Vision &amp; AI
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

const Dot = ({ off, spread, rise, color }) => {
  const x = useTransform(spread, (s) => off * s)
  return (
    <motion.span
      className="absolute block rounded-full"
      style={{
        width: 6,
        height: 6,
        left: -3,
        bottom: 0,
        x,
        y: rise,
        backgroundColor: color,
      }}
    />
  )
}

export default Core
