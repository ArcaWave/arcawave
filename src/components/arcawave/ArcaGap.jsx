import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const ArcaGap = () => {
  const { t } = useLanguage()
  const g = t.arca.gap

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #1E1B4B 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-[1100px] mx-auto relative">
        <div className="bg-foreground rounded-[32px] overflow-hidden relative">
          <div
            className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }}
          />

          <div className="relative p-10 md:p-16 lg:p-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-white/30" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
                  {g.eyebrow}
                </span>
              </div>

              <h2
                className="text-white mb-8 leading-[1.2] whitespace-pre-line"
                style={{
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                {g.title}
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-white/70 max-w-[760px] mb-10">
                {g.body}
              </p>

              <div className="flex flex-wrap gap-2.5">
                {g.items.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white/90 border border-white/15 bg-white/5 backdrop-blur"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArcaGap
