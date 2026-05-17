import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const ArcaFuture = () => {
  const { t } = useLanguage()
  const f = t.arca.future

  return (
    <section id="future" className="relative py-32 px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-foreground/30" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/60">
              {f.eyebrow}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-end">
            <h2
              className="leading-[1.15]"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              <span className="block text-foreground/80">{f.title1}</span>
              <span
                className="block"
                style={{
                  background:
                    'linear-gradient(135deg, #F97316 0%, #F472B6 50%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {f.title2}
              </span>
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-body-text">
              {f.intro}
            </p>
          </div>
        </motion.div>

        {/* Forms timeline */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent hidden md:block" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-3 relative">
            {f.forms.map((form, i) => (
              <motion.div
                key={form.tag}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl border border-foreground/5 p-5 md:p-6 h-full hover:border-primary/30 hover:shadow-card-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-mono text-foreground/30 tracking-wider">
                      {form.tag}
                    </span>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: ['#7C3AED', '#A855F7', '#F472B6', '#F97316', '#10B981'][i],
                      }}
                    />
                  </div>
                  <div className="text-sm md:text-base font-bold text-foreground leading-tight mb-1">
                    {form.label}
                  </div>
                  <div className="text-xs text-body-text leading-relaxed">
                    {form.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArcaFuture
