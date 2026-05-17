import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const ArcaManifesto = () => {
  const { t } = useLanguage()
  const m = t.arca.manifesto

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Soft gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, #DDD6FE 0%, #FED7AA 40%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-[920px] mx-auto relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-foreground/30" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/60">
              {m.eyebrow}
            </span>
            <div className="w-8 h-px bg-foreground/30" />
          </div>

          <h2
            className="leading-[1.2] mb-12 whitespace-pre-line"
            style={{
              fontSize: 'clamp(28px, 4.2vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            <span className="text-foreground">{m.title.split('\n')[0]}</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {m.title.split('\n')[1]}
            </span>
          </h2>

          <p className="text-base md:text-lg leading-[1.8] text-body-text max-w-[720px] mx-auto mb-10">
            {m.body}
          </p>

          <div className="inline-block">
            <div className="text-base md:text-lg font-bold text-foreground border-t border-foreground/20 pt-6 px-2 max-w-[680px]">
              {m.sign}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ArcaManifesto
