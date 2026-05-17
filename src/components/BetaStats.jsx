import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export default function BetaStats() {
  const { t } = useLanguage()
  const s = t.betaStats

  const stats = [
    { value: s.stat1Value, label: s.stat1Label },
    { value: s.stat2Value, label: s.stat2Label },
    { value: s.stat3Value, label: s.stat3Label },
    { value: s.stat4Value, label: s.stat4Label },
  ]

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 20%, #f59e0b 45%, #f97316 60%, #ec4899 85%, #f472b6 100%)',
          }}
        >
          {/* Badge */}
          <div className="flex justify-center pt-8 pb-4">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
              📈 {s.badge}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 px-6 md:px-12 pb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center py-4"
              >
                <div className="text-white text-4xl md:text-5xl lg:text-6xl font-black mb-2 drop-shadow-lg">
                  {stat.value}
                </div>
                <div className="text-white/90 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-8 md:mx-16 border-t border-white/20"></div>

          {/* Footnote */}
          <div className="text-center py-5 px-4">
            <p className="text-white/70 text-xs md:text-sm">
              {s.footnote}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
