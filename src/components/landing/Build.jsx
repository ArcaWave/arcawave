import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Build — the two faces of the company.
 *
 * 50:50 at rest. Lean the cursor into a side and it opens to 70:30.
 * Left: real spaces, real people, real response.
 * Right: the same kind of scene, with behavior made legible — three quiet
 * markers, no dashboard.
 */

// TODO: replace the stand-in photos with real project stills in public/assets/images/work/
const PANELS = [
  {
    key: 'experience',
    eyebrow: 'Experience',
    title: 'Spaces that respond.',
    items: [
      {
        label: 'MongleKids',
        sub: 'AI creative mentor · ages 5–9',
        href: 'https://monglekids.com',
        external: true,
        works: [
          { src: '/assets/images/work/monglekids-01.jpg', caption: '2025 · Mongle Kids · at home', pos: '60% 40%' },
        ],
      },
      {
        label: 'Pop-ups',
        sub: 'Responsive pop-up spaces',
        href: 'mailto:help@arcawave.xyz?subject=Pop-up%20inquiry',
        works: [
          { src: '/assets/images/work/popup-01.jpg', caption: '2025 · Pop-up · Seoul', pos: '50% 60%' },
        ],
      },
      {
        label: 'Exhibitions',
        sub: 'Interactive exhibitions',
        href: 'mailto:help@arcawave.xyz?subject=Exhibition%20inquiry',
        works: [
          { src: '/assets/images/work/exhibition-01.jpg', caption: '2024 · Media wall · Seoul', pos: '78% 50%' },
        ],
      },
    ],
    href: 'mailto:help@arcawave.xyz?subject=Experience%20inquiry',
    external: false,
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

const CYCLE_MS = 3200
const CUT_MS = 220

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

  // flatten the rows' works into one reel; remember which row each belongs to
  const reel = useMemo(
    () =>
      (panel.items || []).flatMap((item, row) => (item.works || []).map((w) => ({ ...w, row }))),
    [panel],
  )
  const hasReel = reel.length > 0
  const [active, setActive] = useState(0)
  const [cut, setCut] = useState(false)
  const [rowHover, setRowHover] = useState(null)
  const cutTimer = useRef(null)

  const goTo = (i) => {
    if (i === active) return
    clearTimeout(cutTimer.current)
    setCut(true)
    setActive(i)
    cutTimer.current = setTimeout(() => setCut(false), CUT_MS)
  }

  // auto-cycle when no row is being pointed at
  useEffect(() => {
    if (!hasReel || rowHover != null) return
    const t = setInterval(() => {
      setActive((i) => {
        const n = (i + 1) % reel.length
        setCut(true)
        clearTimeout(cutTimer.current)
        cutTimer.current = setTimeout(() => setCut(false), CUT_MS)
        return n
      })
    }, CYCLE_MS)
    return () => clearInterval(t)
  }, [hasReel, rowHover, reel.length])

  // preload the reel
  useEffect(() => {
    reel.forEach((w) => {
      const im = new Image()
      im.src = w.src
    })
  }, [reel])

  const current = hasReel ? reel[active] : null
  const bgSrc = current ? current.src : panel.img
  const bgPos = current ? current.pos : panel.imgPos
  const years = useMemo(() => {
    const ys = reel.map((w) => parseInt(w.caption, 10)).filter(Boolean)
    if (!ys.length) return ''
    const a = Math.min(...ys)
    const b = Math.max(...ys)
    return a === b ? `${a}` : `${a}–${b}`
  }, [reel])

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
    setRowHover(null)
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
        src={bgSrc}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover will-change-transform transition-transform duration-700 ease-out-expo ${cut ? 'work-cut' : ''}`}
        style={{ objectPosition: bgPos, transform: 'scale(1.03)' }}
      />
      {/* the cut: a beat of accent + sliced offsets, same vocabulary as the hero */}
      {cut && (
        <>
          <div className="absolute inset-0 work-flash" />
          {[0, 1, 2].map((i) => (
            <img
              key={i}
              src={bgSrc}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover scan-slice scan-slice-${i}`}
              style={{ objectPosition: bgPos, clipPath: `inset(${i * 33.4}% 0 ${(2 - i) * 33.3}% 0)` }}
            />
          ))}
        </>
      )}
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

      {/* work caption — top-left, like the hero's scene caption */}
      {current && (
        <div
          key={active}
          className="mono work-caption absolute left-6 md:left-10 top-24 md:top-28 flex items-center gap-3"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>
            {String(active + 1).padStart(2, '0')} / {String(reel.length).padStart(2, '0')}
          </span>
          <span>{current.caption}</span>
        </div>
      )}

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
        {hasReel && (
          <p className="mono mt-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {reel.length} {reel.length === 1 ? 'project' : 'projects'}
            {years ? ` · ${years}` : ''}
          </p>
        )}

        <ul className="mt-8 md:mt-10 max-w-[400px]">
          {panel.items.map((item, row) => {
            const isRow = current && current.row === row
            const firstOfRow = reel.findIndex((w) => w.row === row)
            return (
              <li
                key={item.label}
                className="border-t"
                style={{ borderColor: isRow ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.22)' }}
                onMouseEnter={() => {
                  if (firstOfRow >= 0) {
                    setRowHover(row)
                    goTo(firstOfRow)
                  }
                }}
                onMouseLeave={() => setRowHover(null)}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="group/row flex items-baseline justify-between gap-6 py-3 transition-opacity hover:opacity-100"
                    style={{ color: isRow ? '#fff' : 'rgba(255,255,255,0.85)' }}
                  >
                    <span className="mono flex items-center gap-2" style={{ fontSize: 12 }}>
                      {hasReel && (
                        <span
                          className="block rounded-full transition-opacity duration-300"
                          style={{ width: 5, height: 5, background: 'var(--accent)', opacity: isRow ? 1 : 0 }}
                        />
                      )}
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
            )
          })}
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
