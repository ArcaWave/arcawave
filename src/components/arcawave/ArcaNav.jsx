import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const ArcaNav = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProductOpen, setIsProductOpen] = useState(false)
  const closeTimer = useRef(null)
  const { lang, t, toggleLang } = useLanguage()
  const n = t.arca.nav

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Small delay on close so cursor can travel from trigger to panel without flicker
  const openDropdown = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setIsProductOpen(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setIsProductOpen(false), 120)
  }

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/90 backdrop-blur-xl border-b border-foreground/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <img
              src="/assets/logos/Arcawave_Logo_Color.svg"
              alt="Arcawave"
              className="h-7 w-auto transition-transform group-hover:scale-105"
            />
          </a>

          <nav className="hidden md:flex items-center gap-9">
            <a
              href="#philosophy"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {n.about}
            </a>

            {/* Products dropdown */}
            <div
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={scheduleClose}
              onFocus={openDropdown}
              onBlur={scheduleClose}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isProductOpen}
                onClick={() => setIsProductOpen((v) => !v)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors py-2"
              >
                {n.product}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isProductOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <AnimatePresence>
                {isProductOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    // Framer Motion drives `transform` for the y animation, so we can't
                    // also use Tailwind's `-translate-x-1/2` (it would get clobbered).
                    // Center horizontally via left:50% + negative margin-left of half the panel width.
                    className="absolute top-full pt-3 w-[300px]"
                    style={{ left: '50%', marginLeft: -150 }}
                  >
                    <div
                      role="menu"
                      className="bg-white rounded-2xl border border-foreground/5 shadow-card-lg p-2"
                    >
                      {n.productItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                          role="menuitem"
                          className="group grid grid-cols-[36px_minmax(0,1fr)] gap-x-3 gap-y-1 p-3 rounded-xl hover:bg-card-sub transition-colors"
                        >
                          {/* Col 1 / Row 1: badge */}
                          <div
                            className="w-9 h-9 rounded-[10px] flex items-center justify-center self-center"
                            style={{
                              background:
                                'linear-gradient(135deg, #7C3AED 0%, #F472B6 100%)',
                            }}
                          >
                            <span className="text-white text-sm font-black leading-none">
                              M
                            </span>
                          </div>
                          {/* Col 2 / Row 1: title (vertically centered in the badge row) */}
                          <div className="self-center flex items-center gap-1.5 min-w-0">
                            <span className="text-sm font-bold text-foreground">
                              {item.name}
                            </span>
                            {item.external && (
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-foreground/40 group-hover:text-foreground/70 transition-colors flex-shrink-0"
                              >
                                <path d="M7 7h10v10" />
                                <path d="M7 17 17 7" />
                              </svg>
                            )}
                          </div>
                          {/* Col 2 / Row 2: subtitle — automatically aligned with title via shared grid column */}
                          <div className="col-start-2 text-xs text-body-text leading-snug">
                            {item.sub}
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#news"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {n.news}
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              {lang === 'ko' ? 'EN' : '한'}
            </button>
            <a
              href="#contact"
              className="bg-foreground text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground/90 transition-all"
            >
              {n.cta}
            </a>
          </div>
        </div>
      </motion.header>
    </AnimatePresence>
  )
}

export default ArcaNav
