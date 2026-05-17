import React, { useRef, useState, useEffect } from 'react'
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

const ArcaNews = () => {
  const { t } = useLanguage()
  const news = t.arca.news
  const trackRef = useRef(null)
  const [scrollState, setScrollState] = useState({ canPrev: false, canNext: true })

  const updateScrollState = () => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setScrollState({
      canPrev: el.scrollLeft > 8,
      canNext: el.scrollLeft < maxScroll - 8,
    })
  }

  useEffect(() => {
    updateScrollState()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  const scrollByAmount = (direction) => {
    const el = trackRef.current
    if (!el) return
    // Scroll ~ one card width including gap so we land on a snap point
    const card = el.querySelector('[data-news-card]')
    const cardWidth = card ? card.offsetWidth + 20 /* gap */ : 340
    el.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
  }

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
              onClick={() => scrollByAmount(-1)}
              disabled={!scrollState.canPrev}
              aria-label={news.prev}
              className="w-11 h-11 rounded-full border border-foreground/15 bg-white text-foreground hover:border-foreground/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              disabled={!scrollState.canNext}
              aria-label={news.next}
              className="w-11 h-11 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Carousel track */}
        <div className="relative -mx-6 px-6">
          {/* Edge fades */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-3 w-12 z-10"
            style={{
              background: 'linear-gradient(to right, var(--background, #FFFBF5), transparent)',
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-3 w-12 z-10"
            style={{
              background: 'linear-gradient(to left, var(--background, #FFFBF5), transparent)',
            }}
          />

          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
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
                  className="group flex-shrink-0 w-[320px] md:w-[360px] bg-white rounded-3xl border border-foreground/5 overflow-hidden snap-start hover:shadow-card-lg transition-shadow duration-300"
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

            {/* Trailing spacer so the last card can snap fully */}
            <div className="flex-shrink-0 w-1" aria-hidden />
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
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
