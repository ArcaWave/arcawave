import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import useScrollProgress from '../../hooks/useScrollProgress'
import Track from './Track'

/**
 * Build — a film strip of what we make.
 *
 * The section pins; scrolling walks along a row of large scan fragments,
 * one centred at a time, like moving through an exhibition. Works first,
 * then three capability frames where the same fragments carry real
 * tracking overlays. Counter and progress bars always say how many.
 *
 * On phones it is a plain horizontal swipe strip.
 */

// TODO: replace the stand-in photos with real project stills in public/assets/images/work/
const ITEMS = [
  {
    kind: 'work',
    title: 'Mongle Kids',
    type: 'Product',
    caption: '2025 · Mongle Kids · at home',
    img: '/assets/images/work/monglekids-01.jpg',
    pos: '60% 40%',
    href: 'https://monglekids.com',
    external: true,
  },
  {
    kind: 'work',
    title: 'Responsive pop-up',
    type: 'Pop-up',
    caption: '2025 · Pop-up · Seoul',
    img: '/assets/images/work/popup-01.jpg',
    pos: '50% 60%',
    href: 'mailto:help@arcawave.xyz?subject=Pop-up%20inquiry',
  },
  {
    kind: 'work',
    title: 'Interactive media wall',
    type: 'Exhibition',
    caption: '2024 · Media wall · Seoul',
    img: '/assets/images/work/exhibition-01.jpg',
    pos: '78% 50%',
    href: 'mailto:help@arcawave.xyz?subject=Exhibition%20inquiry',
  },
  {
    kind: 'tech',
    id: 'intelligence',
    title: 'Computer Vision',
    sub: 'Sees people in real spaces',
    caption: 'computer vision · 5 tracked',
    scene: '04-kids-cafe',
  },
  {
    kind: 'tech',
    title: 'Behavior Data',
    sub: 'Turns movement into meaning',
    caption: 'behavior data · playground',
    scene: '03-playground',
  },
  {
    kind: 'tech',
    title: 'Personalization',
    sub: 'Adapts the space to each person',
    caption: 'personalization · classroom',
    scene: '02-classroom-play',
  },
]

const GAP = 40
const PER_ITEM_VH = 70 // scroll distance per card on desktop

const Build = () => {
  const ref = useRef(null)
  const p = useScrollProgress(ref)
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440)
  const [tracks, setTracks] = useState({})
  const [active, setActive] = useState(0)
  const desktop = vw >= 1024
  const N = ITEMS.length

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // tracking data for the capability frames
  useEffect(() => {
    let alive = true
    Promise.all(
      ITEMS.filter((i) => i.scene).map((i) =>
        fetch(`/assets/scenes/${i.scene}/track.json`)
          .then((r) => r.json())
          .then((t) => [i.scene, t]),
      ),
    ).then((pairs) => alive && setTracks(Object.fromEntries(pairs)))
    return () => {
      alive = false
    }
  }, [])

  // card geometry
  const cardW = desktop ? Math.min(760, vw * 0.54) : Math.round(vw * 0.84)
  const step = cardW + GAP
  const x = useTransform(p, (v) => -v * (N - 1) * step)

  useEffect(() => {
    const unsub = p.on('change', (v) => setActive(Math.round(v * (N - 1))))
    return unsub
  }, [p, N])

  // nav: "Technology" jumps to the first capability frame
  useEffect(() => {
    const onFocus = (e) => {
      const el = ref.current
      if (!el || e.detail !== 'intelligence') return
      const i = ITEMS.findIndex((it) => it.kind === 'tech')
      const travel = el.offsetHeight - window.innerHeight
      const top = el.offsetTop + (travel * i) / (N - 1)
      window.scrollTo({ top, behavior: 'smooth' })
    }
    window.addEventListener('arcawave:focus', onFocus)
    return () => window.removeEventListener('arcawave:focus', onFocus)
  }, [N])

  const current = ITEMS[active]

  // ---- phones: plain swipe strip ----
  if (!desktop) {
    return (
      <section id="build" className="relative bg-paper py-[14vh]">
        <div className="px-6 flex items-baseline justify-between mb-8">
          <p className="mono-caps" style={{ color: 'var(--ink-3)' }}>
            What we build
          </p>
          <p className="mono" style={{ color: 'var(--ink-3)' }}>
            {N} frames
          </p>
        </div>
        <div className="flex gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {ITEMS.map((it, i) => (
            <div key={it.title} className="snap-center shrink-0" style={{ width: cardW }}>
              <Card item={it} i={i} width={cardW} track={it.scene ? tracks[it.scene] : null} active />
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ---- desktop: pinned, scroll-driven ----
  return (
    <section id="build" ref={ref} className="relative bg-paper" style={{ height: `${100 + PER_ITEM_VH * (N - 1)}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* header */}
        <div className="absolute top-[12vh] left-8 right-8 flex items-baseline justify-between">
          <p className="mono-caps" style={{ color: 'var(--ink-3)' }}>
            What we build
          </p>
          <p className="mono" style={{ color: 'var(--ink-3)' }}>
            <span style={{ color: 'var(--ink)' }}>{String(active + 1).padStart(2, '0')}</span> / {String(N).padStart(2, '0')}
          </p>
        </div>

        {/* strip */}
        <motion.div
          className="absolute top-1/2 left-0 flex items-start"
          style={{ x, gap: GAP, paddingLeft: (vw - cardW) / 2, y: '-54%' }}
        >
          {ITEMS.map((it, i) => (
            <Card
              key={it.title}
              item={it}
              i={i}
              width={cardW}
              track={it.scene ? tracks[it.scene] : null}
              active={i === active}
            />
          ))}
        </motion.div>

        {/* footer: progress + cue + link */}
        <div className="absolute bottom-[7vh] left-8 right-8 flex items-end justify-between">
          <div>
            <p className="mono mb-3" style={{ color: 'var(--ink-3)' }}>
              {current.kind === 'tech' ? 'capabilities' : 'work'} · scroll to move along →
            </p>
            <div className="flex gap-1.5">
              {ITEMS.map((it, i) => (
                <span
                  key={it.title}
                  className="block h-[2px] transition-colors duration-300"
                  style={{ width: 28, background: i === active ? 'var(--ink)' : 'rgba(15,15,15,0.18)' }}
                />
              ))}
            </div>
          </div>
          <a
            href="mailto:help@arcawave.xyz?subject=Project%20inquiry"
            className="group text-[13px] font-medium inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            Start a project
            <span aria-hidden className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

/** One frame of the strip: a torn fragment + caption + title. */
const Card = ({ item, i, width, track, active }) => {
  const mask = `url(/assets/masks/torn-${(i % 3) + 1}.png)`
  const isTech = item.kind === 'tech'
  const base = item.scene ? `/assets/scenes/${item.scene}` : null
  const stageRef = useRef(null)
  const [k, setK] = useState(2)
  useEffect(() => {
    if (!track || !stageRef.current) return
    const el = stageRef.current
    const measure = () => setK(track.width / Math.max(1, el.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [track])

  const Wrap = item.href ? 'a' : 'div'

  return (
    <Wrap
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      className="block shrink-0 transition-[opacity,transform] duration-700 ease-out-expo"
      style={{ width, opacity: active ? 1 : 0.4, transform: active ? 'scale(1)' : 'scale(0.96)' }}
    >
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '36 / 23',
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }}
      >
        {isTech ? (
          <>
            <img src={`${base}/chunk.webp`} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(1) brightness(0.55) contrast(1.1)' }} draggable={false} />
            <img src={`${base}/people.webp`} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(0.6) brightness(0.8)' }} draggable={false} />
            {track && (
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox={`0 0 ${track.width} ${track.height}`}>
                {track.people.map((q) => (
                  <Track key={q.id} p={q} W={track.width} H={track.height} k={k} animate={false} />
                ))}
              </svg>
            )}
          </>
        ) : (
          <img src={item.img} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: item.pos }} draggable={false} />
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 pl-[3%]">
        <span className="mono" style={{ background: 'var(--accent)', color: '#fff', padding: '4px 7px' }}>
          {item.caption}
        </span>
        <span className="mono" style={{ color: 'var(--ink-3)' }}>
          {item.type || 'Capability'}
        </span>
      </div>
      <div className="mt-3 pl-[3%] flex items-baseline justify-between gap-6">
        <span className="display" style={{ fontSize: 'clamp(22px, 2.2vw, 30px)', letterSpacing: '-0.02em' }}>
          {item.title}
        </span>
        {item.sub && (
          <span className="text-[14px] shrink-0" style={{ color: 'var(--ink-2)' }}>
            {item.sub}
          </span>
        )}
        {item.href && (
          <span aria-hidden className="text-[14px] shrink-0">
            {item.external ? '↗' : '→'}
          </span>
        )}
      </div>
    </Wrap>
  )
}

export default Build
