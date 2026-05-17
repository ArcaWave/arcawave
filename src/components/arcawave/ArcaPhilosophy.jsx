import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const ArcaPhilosophy = () => {
  const { t } = useLanguage()
  const p = t.arca.philosophy

  return (
    <section id="philosophy" className="relative py-32 px-6">
      <div className="max-w-[860px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-foreground/30" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/60">
              {p.eyebrow}
            </span>
          </div>

          {/* Headline — simple, direct */}
          <h2
            className="leading-[1.1] mb-12"
            style={{
              fontSize: 'clamp(36px, 5.6vw, 68px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              wordBreak: 'keep-all',
            }}
          >
            <span className="block text-foreground/85">{p.title1}</span>
            <span
              className="block"
              style={{
                background:
                  'linear-gradient(135deg, #7C3AED 0%, #F472B6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {p.title2}
            </span>
          </h2>

          {/* Body — two short paragraphs, generous line-height */}
          <div className="space-y-5 max-w-[640px]">
            <p
              className="text-lg md:text-xl leading-[1.7] text-foreground/75"
              style={{ wordBreak: 'keep-all' }}
            >
              {p.body1}
            </p>
            <p
              className="text-lg md:text-xl leading-[1.7] text-foreground/75"
              style={{ wordBreak: 'keep-all' }}
            >
              {p.body2}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ArcaPhilosophy
