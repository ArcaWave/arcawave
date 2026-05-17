import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const pillarAccents = [
  { bg: '#F5F0FF', text: '#7C3AED', dot: '#7C3AED' },
  { bg: '#FFF7ED', text: '#F97316', dot: '#F97316' },
  { bg: '#ECFDF5', text: '#10B981', dot: '#10B981' },
  { bg: '#FDF2F8', text: '#DB2777', dot: '#F472B6' },
]

const ArcaApproach = () => {
  const { t } = useLanguage()
  const a = t.arca.approach

  return (
    <section id="approach" className="relative py-32 px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-foreground/30" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/60">
              {a.eyebrow}
            </span>
            <div className="w-8 h-px bg-foreground/30" />
          </div>

          <h2
            className="leading-[1.2] mb-7"
            style={{
              fontSize: 'clamp(28px, 4.2vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            <span className="block text-foreground/70">{a.title1}</span>
            <span className="block text-foreground">{a.title2}</span>
          </h2>

          <p className="text-base md:text-lg leading-relaxed text-body-text max-w-[700px] mx-auto">
            {a.intro}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {a.pillars.map((p, i) => {
            const c = pillarAccents[i]
            return (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative bg-white rounded-3xl p-8 lg:p-10 border border-foreground/5 hover:shadow-card-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-7">
                  <span className="text-xs font-mono text-foreground/30 tracking-wider">
                    {p.num}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                    style={{ backgroundColor: c.bg, color: c.text }}
                  >
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                  {p.title}
                </h3>

                <p className="text-[15px] leading-relaxed text-body-text">
                  {p.body}
                </p>

                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${c.dot}, transparent)`,
                  }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ArcaApproach
