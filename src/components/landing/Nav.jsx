import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ITEMS } from './Build'

/**
 * Nav — logo mark left, three links right.
 * Plain words only: Work / About / Contact. Hovering Work opens a short list
 * of the works; each jumps to its frame in the strip.
 *
 * The header sits in `mix-blend-mode: difference` so it stays legible over
 * paper and photographs. The dropdown is rendered as a sibling, outside the
 * blend layer, so its panel keeps true colours.
 */
const LOGO_W = 44 // 22px tall mark at the SVG's 366:187 ratio
const WORKS = ITEMS.map((it, i) => ({ ...it, index: i })).filter((it) => it.kind === 'work')
const PANEL_W = 340

/** Jump to a section instantly (the page's CSS smooth-scroll would otherwise ride through everything). */
const jumpTo = (id) => (e) => {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  window.scrollTo({ top: el.offsetTop, behavior: 'instant' })
}

const Nav = () => {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState({ left: 0, top: 0 })
  const workRef = useRef(null)
  const closeTimer = useRef(null)

  const show = () => {
    clearTimeout(closeTimer.current)
    const r = workRef.current?.getBoundingClientRect()
    if (r) setAnchor({ left: Math.min(r.left - 12, window.innerWidth - PANEL_W - 24), top: r.bottom })
    setOpen(true)
  }
  const hide = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const go = (index) => {
    setOpen(false)
    window.dispatchEvent(new CustomEvent('arcawave:go', { detail: index }))
  }

  return (
    <>
      <a href="#top" aria-label="Arcawave" className="fixed z-50 left-6 md:left-8 top-[19px]">
        <img src="/assets/logos/Arcawave_Logo_Color.svg" alt="" width={LOGO_W} height={22} className="h-[22px] w-auto" />
      </a>

      <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference text-white">
        <div className="flex items-center justify-between px-6 md:px-8 py-6">
          <span aria-hidden style={{ width: LOGO_W }} />
          <nav className="flex items-center gap-6 md:gap-9 text-[13px] font-medium">
            <a
              ref={workRef}
              href="#build"
              onMouseEnter={show}
              onMouseLeave={hide}
              onFocus={show}
              onBlur={hide}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={jumpTo('build')}
              className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
            >
              Work
            </a>
            <a href="#vision" onClick={jumpTo('vision')} className="opacity-80 hover:opacity-100 transition-opacity">
              About
            </a>
            <a href="mailto:help@arcawave.xyz" className="opacity-100 hover:opacity-70 transition-opacity">
              Contact ↗
            </a>
          </nav>
        </div>
      </header>

      {/* dropdown — outside the blend layer */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            onMouseEnter={show}
            onMouseLeave={hide}
            className="fixed z-50"
            style={{ left: anchor.left, top: anchor.top - 2, paddingTop: 14 }}
          >
            <div className="bg-paper border border-line" style={{ width: PANEL_W }}>
              {WORKS.map((w) => (
                <a
                  key={w.title}
                  href="#build"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault()
                    go(w.index)
                  }}
                  className="group flex items-baseline justify-between gap-8 px-4 py-3 border-b border-line last:border-b-0 hover:bg-white/60 transition-colors"
                >
                  <span className="text-[14px] font-medium text-ink whitespace-nowrap">{w.title}</span>
                  <span className="mono" style={{ color: 'var(--ink-3)' }}>
                    {w.type}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Nav
