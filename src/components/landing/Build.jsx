import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Build — the two faces of the company.
 *
 * 50:50 at rest. Lean the cursor into a side and it opens to 70:30.
 * Left: real spaces, real people, real response.
 * Right: the same kind of scene, with behavior made legible — three quiet
 * markers, no dashboard.
 */

const PANELS = [
  {
    key: 'experience',
    eyebrow: 'Experience',
    title: 'Spaces that respond.',
    items: [
      { label: 'MongleKids', sub: 'AI creative mentor · ages 5–9', href: 'https://monglekids.com', external: true },
      // TODO: point these at the portfolio (/work) once the project list is in
      { label: 'Pop-ups', sub: 'Responsive pop-up spaces', href: 'mailto:help@arcawave.xyz?subject=Pop-up%20inquiry' },
      { label: 'Exhibitions', sub: 'Interactive exhibitions', href: 'mailto:help@arcawave.xyz?subject=Exhibition%20inquiry' },
    ],
    href: 'mailto:help@arcawave.xyz?subject=Experience%20inquiry',
    external: false,
    img: '/assets/images/spaces/experience.jpg',
    imgPos: '78% 50%',
    markers: [],
  },
  {
    key: 'intelligence',
    eyebrow: 'Intelligence',
    title: 'Behavior made visible.',
    items: [{ label: 'Computer Vision' }, { label: 'Behavior Data' }, { label: 'Personalization' }],
    href: 'mailto:help@arcawave.xyz?subject=Intelligence%20inquiry',
    external: false,
    img: '/assets/images/spaces/intelligence.jpg',
    imgPos: '50% 60%',
    markers: [
      { x: 13, y: 54, label: 'participation' },
      { x: 45, y: 50, label: 'interaction' },
      { x: 84, y: 58, label: 'movement' },
    ],
  },
]

const basisFor = (bias, key) => {
  if (!bias) return '50%'
  return bias === key ? '70%' : '30%'
}

const Build = () => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState(null)

  // Nav links can open a side for a moment
  useEffect(() => {
    let timer
    const onFocus = (e) => {
      setPinned(e.detail)
      clearTimeout(timer)
      timer = setTimeout(() => setPinned(null), 2200)
    }
    window.addEventListener('arcawave:focus', onFocus)
    return () => {
      window.removeEventListener('arcawave:focus', onFocus)
      clearTimeout(timer)
    }
  }, [])

  const bias = hover || pinned

  return (
    <section id="build" className="relative flex flex-col md:flex-row md:h-screen md:min-h-[640px]">
      {PANELS.map((panel) => (
        <Panel
          key={panel.key}
          panel={panel}
          open={bias === panel.key}
          basis={basisFor(bias, panel.key)}
          onEnter={() => setHover(panel.key)}
          onLeave={() => setHover(null)}
        />
      ))}
    </section>
  )
}

const Panel = ({ panel, open, basis, onEnter, onLeave }) => {
  const imgRef = useRef(null)

  const onMove = (e) => {
    const el = imgRef.current
    if (!el) return
    const r = e.currentTarget.getBoundingClientRect()
    const dx = (e.clientX - r.left) / r.width - 0.5
    const dy = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `translate(${(-dx * 14).toFixed(1)}px, ${(-dy * 10).toFixed(1)}px) scale(${
      open ? 1.06 : 1.03
    })`
  }
  const onLeaveAll = () => {
    if (imgRef.current) imgRef.current.style.transform = 'translate(0,0) scale(1.03)'
    onLeave()
  }

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeaveAll}
      onMouseMove={onMove}
      className="relative block overflow-hidden text-white min-h-[62vh] md:min-h-0 md:h-full transition-[flex-basis] duration-700 ease-out-expo"
      style={{ flexBasis: basis, flexGrow: 0, flexShrink: 0 }}
    >
      {/* scene */}
      <img
        ref={imgRef}
        src={panel.img}
        alt=""
        className="absolute inset-0 w-full h-full object-cover will-change-transform transition-transform duration-700 ease-out-expo"
        style={{ objectPosition: panel.imgPos, transform: 'scale(1.03)' }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ background: 'rgba(8,8,10,1)', opacity: open ? 0.22 : 0.42 }}
      />
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: '58%',
          background: 'linear-gradient(to top, rgba(8,8,10,0.72) 0%, rgba(8,8,10,0) 100%)',
        }}
      />

      {/* behavior markers (Intelligence only) — hidden while the panel is squeezed */}
      {panel.markers.map((m, i) => (
        <motion.div
          key={m.label}
          className="absolute mono flex items-center gap-2 transition-opacity duration-500"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            color: 'rgba(255,255,255,0.85)',
            visibility: basis === '30%' ? 'hidden' : 'visible',
          }}
          animate={{ opacity: [0.15, 1, 1, 0.15] }}
          transition={{ duration: 5, times: [0, 0.2, 0.7, 1], repeat: Infinity, delay: i * 1.6, ease: 'easeInOut' }}
        >
          <span className="block rounded-full" style={{ width: 6, height: 6, background: 'var(--accent)' }} />
          <span style={{ width: 22, height: 1, background: 'rgba(255,255,255,0.45)' }} />
          <span>{m.label}</span>
        </motion.div>
      ))}

      {/* copy */}
      <div className="relative min-h-[62vh] md:min-h-0 md:h-full flex flex-col justify-end p-6 pt-24 md:p-10">
        <p className="mono-caps" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {panel.eyebrow}
        </p>
        <h2 className="display mt-4" style={{ fontSize: 'clamp(30px, 3.6vw, 52px)', letterSpacing: '-0.025em' }}>
          {panel.title}
        </h2>

        <ul className="mt-8 md:mt-10 max-w-[400px]">
          {panel.items.map((item) => (
            <li
              key={item.label}
              className="border-t"
              style={{ borderColor: 'rgba(255,255,255,0.22)' }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="group/row flex items-baseline justify-between gap-6 py-3 transition-opacity hover:opacity-100"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                >
                  <span className="mono" style={{ fontSize: 12 }}>
                    {item.label}
                  </span>
                  <span className="flex items-baseline gap-3 min-w-0">
                    {item.sub && (
                      <span
                        className="mono hidden lg:inline truncate"
                        style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}
                      >
                        {item.sub}
                      </span>
                    )}
                    <span
                      aria-hidden
                      className="text-[13px] transition-transform duration-500 ease-out-expo group-hover/row:translate-x-1"
                    >
                      {item.external ? '↗' : '→'}
                    </span>
                  </span>
                </a>
              ) : (
                <span
                  className="mono block py-3"
                  style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>

        <a
          href={panel.href}
          target={panel.external ? '_blank' : undefined}
          rel={panel.external ? 'noopener noreferrer' : undefined}
          className="group/cta mt-8 md:mt-10 self-start text-[13px] font-medium inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          Explore
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-1"
          >
            →
          </span>
        </a>
      </div>
    </div>
  )
}

export default Build
