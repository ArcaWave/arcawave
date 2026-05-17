import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export default function MidCTA() {
  const { t } = useLanguage()
  const s = t.midCTA

  return (
    <section className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-8 md:p-12 text-center">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium mb-3">{s.badge}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight whitespace-pre-line">
              {s.title}
            </h3>
            <p className="text-white/70 text-base mb-8 max-w-lg mx-auto">
              {s.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-white text-purple-700 px-8 py-3.5 rounded-full font-bold text-base hover:bg-purple-50 transition-colors shadow-lg">
                {s.ctaPrimary}
              </button>
              <button className="bg-white/15 text-white px-8 py-3.5 rounded-full font-semibold text-base border border-white/20 hover:bg-white/25 transition-colors backdrop-blur-sm">
                {s.ctaSecondary}
              </button>
            </div>
            <p className="text-white/50 text-xs mt-4">{s.note}</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
