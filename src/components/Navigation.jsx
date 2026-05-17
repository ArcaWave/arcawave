import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { lang, t, toggleLang } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-[12px] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette w-6 h-6 text-white">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
            </svg>
          </div>
          <div>
            <div className="font-bold text-xl text-foreground" style={{fontFamily: 'var(--font-display)'}}>Jellying</div>
            <div className="text-xs text-body-text">{t.nav.subtitle}</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-body-text hover:text-foreground transition-colors">{t.nav.features}</a>
          <a href="#pricing" className="text-body-text hover:text-foreground transition-colors">{t.nav.pricing}</a>
          <a href="#about" className="text-body-text hover:text-foreground transition-colors">{t.nav.about}</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="px-3 py-2 rounded-full text-sm font-semibold border border-primary/20 text-primary hover:bg-primary/5 transition-all"
          >
            {lang === 'ko' ? 'EN' : '한'}
          </button>
          <button
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all"
            tabIndex="0"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.nav.cta}
          </button>
        </div>
      </div>
      </motion.header>
    </AnimatePresence>
  )
}

export default Navigation
