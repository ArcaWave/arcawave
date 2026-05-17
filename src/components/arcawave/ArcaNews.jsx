import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

// Magazine-style accents: thumbnail is mostly paper with a soft corner glow.
// The accent only sings on the chip + the typographic numeral.
const accentMap = {
  purple: {
    chip: { bg: '#F5F0FF', text: '#7C3AED' },
    grad:
      'radial-gradient(ellipse at 30% 30%, rgba(124, 58, 237, 0.22) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 75%), #FBF7F0',
    ink: '#1E1B4B',
    accent: '#7C3AED',
  },
  orange: {
    chip: { bg: '#FFF7ED', text: '#F97316' },
    grad:
      'radial-gradient(ellipse at 30% 30%, rgba(249, 115, 22, 0.22) 0%, rgba(249, 115, 22, 0.05) 50%, transparent 75%), #FBF7F0',
    ink: '#1E1B4B',
    accent: '#F97316',
  },
  pink: {
    chip: { bg: '#FDF2F8', text: '#DB2777' },
    grad:
      'radial-gradient(ellipse at 30% 30%, rgba(219, 39, 119, 0.22) 0%, rgba(219, 39, 119, 0.05) 50%, transparent 75%), #FBF7F0',
    ink: '#1E1B4B',
    accent: '#DB2777',
  },
  green: {
    chip: { bg: '#ECFDF5', text: '#059669' },
    grad:
      'radial-gradient(ellipse at 30% 30%, rgba(16, 185, 129, 0.20) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 75%), #FBF7F0',
    ink: '#1E1B4B',
    accent: '#10B981',
  },
}

const GAP_PX = 20 // matches Tailwind gap-5

/**
 * ArcaNews — transform-based carousel.
 *
 * Why not overflow-x:auto? It captures vertical wheel events on hover and
 * interferes with page scroll (Safari especially). We use a translateX'd
 * track inside an overflow:hidden viewport instead — the viewport just clips,
 * it doesn't scroll. Vertical wheel naturally bubbles to the page.
 * Navigation is via the prev/next buttons.
 */
const ArcaNews = () => {
  const { t } = useLanguage()
  const news = t.arca.news

  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [offset, setOffset] = useState(0)         // current translateX in px (≤ 0)
  const [maxOffset, setMaxOffset] = useState(0)   // most-negative allowed offset

  // Measure how far the track can travel.
  const recalcBounds = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const overflowPx = Math.max(0, track.scrollWidth - viewport.clientWidth)
    const newMax = -overflowPx
    setMaxOffset(newMax)
    // Clamp current offset if window resized smaller
    setOffset((prev) => Math.max(newMax, Math.min(0, prev)))
  }, [])

  useEffect(() => {
    recalcBounds()
    window.addEventListener('resize', recalcBounds)
    return () => window.removeEventListener('resize', recalcBounds)
  }, [recalcBounds])

  const stepBy = (direction) => {
    const card = trackRef.current?.querySelector('[data-news-card]')
    const cardWidth = card ? card.offsetWidth + GAP_PX : 340
    setOffset((prev) => {
      const next = prev + direction * -cardWidth
      // Clamp [maxOffset, 0]
      return Math.max(maxOffset, Math.min(0, next))
    })
  }

  const canPrev = offset < 0
  const canNext = offset > maxOffset

  return (
    <section id="news" className="relative py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-foreground/30" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/60">
                {news.eyebrow}
              </span>
            </div>
            <h2
              className="leading-[1.2] mb-4 whitespace-pre-line"
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {news.title}
            </h2>
            <p className="text-base text-body-text leading-relaxed">
              {news.subtitle}
            </p>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              type="button"
              onClick={() => stepBy(-1)}
              disabled={!canPrev}
              aria-label={news.prev}
              className="w-11 h-11 rounded-full border border-foreground/15 bg-white text-foreground hover:border-foreground/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => stepBy(1)}
              disabled={!canNext}
              aria-label={news.next}
              className="w-11 h-11 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Viewport (clips, doesn't scroll) — vertical wheel passes through to page */}
        <div
          ref={viewportRef}
          className="relative -mx-6 px-6 overflow-hidden"
        >
          {/* Edge fades */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
            style={{
              background: 'linear-gradient(to right, var(--paper, #FBF7F0), transparent)',
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10"
            style={{
              background: 'linear-gradient(to left, var(--paper, #FBF7F0), transparent)',
            }}
          />

          {/* Track — transformed, not scrolled */}
          <div
            ref={trackRef}
            className="flex gap-5 pb-3 will-change-transform"
            style={{
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: 'transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1)',
            }}
          >
            {news.items.map((item, i) => {
              const accent = accentMap[item.accent] || accentMap.purple
              return (
                <motion.a
                  key={i}
                  href={item.href}
                  target={item.href !== '#' ? '_blank' : undefined}
                  rel={item.href !== '#' ? 'noopener noreferrer' : undefined}
                  data-news-card
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group flex-shrink-0 w-[320px] md:w-[360px] bg-white rounded-3xl border border-foreground/5 overflow-hidden hover:shadow-card-lg transition-shadow duration-300"
                >
                  {/* Thumbnail — paper with a soft accent corner glow */}
                  <div
                    className="relative h-[180px] overflow-hidden"
                    style={{ background: accent.grad }}
                  >
                    {/* Big magazine-style numeral as the typographic anchor */}
                    <div
                      className="absolute right-5 bottom-2 select-none leading-none"
                      style={{
                        fontSize: 96,
                        fontWeight: 800,
                        color: 'transparent',
                        WebkitTextStroke: `1.5px ${accent.accent}`,
                        opacity: 0.22,
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    {/* Type chip */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                        style={{ background: accent.chip.bg, color: accent.chip.text }}
                      >
                        {item.type}
                      </span>
                    </div>

                    {/* Tag (source / issue) + date */}
                    <div
                      className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
                      style={{ color: accent.ink }}
                    >
                      <span className="text-xs font-semibold tracking-wide">
                        {item.tag}
                      </span>
                      <span className="text-[11px] font-mono opacity-60">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="text-base font-bold text-foreground leading-snug mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-body-text leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

export default ArcaNews
