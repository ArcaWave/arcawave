import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'
import HeroBackdrop from './HeroBackdrop'

const ArcaHero = () => {
  const { t } = useLanguage()
  const h = t.arca.hero

  return (
    <section
      id="top"
      className="relative min-h-[88vh] flex items-center px-6 overflow-hidden"
    >
      <HeroBackdrop />

      <div className="relative z-10 max-w-[1100px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex flex-col items-center text-center"
        >
          <h1
            className="leading-[1.1] mb-7"
            style={{
              fontSize: 'clamp(40px, 6.4vw, 84px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              wordBreak: 'keep-all',
              maxWidth: '20ch',
            }}
          >
            <span className="block text-foreground/85">{h.title1}</span>
            <span
              className="block"
              style={{
                background:
                  'linear-gradient(135deg, #7C3AED 0%, #F97316 60%, #F472B6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {h.title2}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg text-body-text max-w-[560px]"
            style={{ wordBreak: 'keep-all' }}
          >
            {h.subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default ArcaHero
