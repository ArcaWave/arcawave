import React from 'react'

/**
 * HeroBackdrop — calm horizontal wave currents.
 *
 * Brand metaphor: "Arca·wave" — environments flow around us.
 * Visual idiom:   thin, slow, layered horizontal curves drifting sideways.
 *                 No demanding focal points; ambient like wind on water.
 *
 * Implementation: SVG sine paths animated via translateX. Each wave's path
 *                 spans more than one viewport so a translate of one period
 *                 produces a seamless infinite loop.
 */

const VIEW_W = 1600
const VIEW_H = 900

// Each wave: vertical position (% of height), amplitude, wavelength period,
// drift duration (s), stroke color, base opacity.
const WAVES = [
  { yPct: 18, amp: 14, period: 360, dur: 26, color: '#7C3AED', op: 0.13 },
  { yPct: 32, amp: 22, period: 460, dur: 38, color: '#F472B6', op: 0.10 },
  { yPct: 46, amp: 18, period: 420, dur: 32, color: '#F97316', op: 0.12 },
  { yPct: 60, amp: 26, period: 520, dur: 44, color: '#7C3AED', op: 0.08 },
  { yPct: 74, amp: 14, period: 380, dur: 28, color: '#F472B6', op: 0.10 },
  { yPct: 88, amp: 20, period: 480, dur: 36, color: '#F97316', op: 0.07 },
]

const buildPath = (yPx, amp, period, viewW) => {
  // Start one period to the left, end one period past the right.
  // Translate by -period over duration → seamless loop.
  const startX = -period
  const endX = viewW + period
  const step = period / 48
  const points = []
  for (let x = startX; x <= endX; x += step) {
    const y = yPx + amp * Math.sin((x / period) * 2 * Math.PI)
    points.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return 'M ' + points.join(' L ')
}

const HeroBackdrop = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft wash — sits behind everything */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 65%, rgba(196, 181, 253, 0.14) 0%, rgba(254, 215, 170, 0.07) 35%, transparent 65%)',
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {WAVES.map((w, i) => {
          const yPx = (VIEW_H * w.yPct) / 100
          const d = buildPath(yPx, w.amp, w.period, VIEW_W)
          return (
            <path
              key={i}
              d={d}
              stroke={w.color}
              strokeWidth={1.1}
              fill="none"
              strokeLinecap="round"
              opacity={w.op}
              style={{
                animation: `arca-wave-${i} ${w.dur}s linear infinite`,
                animationDirection: i % 2 ? 'reverse' : 'normal',
              }}
            />
          )
        })}
      </svg>

      {/* Top + bottom fades — blend into adjacent sections */}
      <div
        className="absolute top-0 left-0 right-0 h-28"
        style={{
          background:
            'linear-gradient(to bottom, var(--paper, #FBF7F0), transparent)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-28"
        style={{
          background:
            'linear-gradient(to top, var(--paper, #FBF7F0), transparent)',
        }}
      />

      <style>{`
        ${WAVES.map(
          (w, i) => `
          @keyframes arca-wave-${i} {
            from { transform: translateX(0); }
            to   { transform: translateX(-${w.period}px); }
          }
        `,
        ).join('')}

        @media (prefers-reduced-motion: reduce) {
          svg path { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

export default HeroBackdrop
