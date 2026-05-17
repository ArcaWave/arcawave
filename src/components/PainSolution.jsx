import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export default function PainSolution() {
  const { t } = useLanguage()
  const s = t.painSolution

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Pain Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-50/60 via-orange-50/40 to-pink-50/30 p-6 md:p-10"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
            {/* Left - Text */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-lg">
                  ⚠️
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  {s.painTitle}
                </h3>
              </div>
              <ul className="space-y-4 ml-2">
                {s.pains.map((pain, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>
                    <span className="text-body-text text-base md:text-lg leading-relaxed">
                      {(() => {
                        const parts = pain.split('  ')
                        if (parts.length >= 2) {
                          return <><strong className="text-foreground">{parts[0]}</strong>{' '}<span className="text-caption">{parts[1]}</span></>
                        }
                        return pain
                      })()}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-center py-6"
        >
          <span className="text-3xl text-caption">↓</span>
        </motion.div>

        {/* Solution Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/60 via-violet-50/30 to-blue-50/20 p-8 md:p-10"
        >
          {/* Solution Header */}
          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug mb-6">
            {s.solutionTitle} <span className="text-primary">{s.solutionTitleBr}</span>
          </h3>

          {/* Solution Items - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {s.solutions.map((sol, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3.5 flex items-center gap-2.5"
              >
                <span className="text-xl flex-shrink-0">{sol.icon}</span>
                <span className="font-semibold text-foreground text-sm md:text-base">{sol.title}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-primary/10 rounded-xl px-6 py-3 text-center"
          >
            <p className="text-primary font-semibold text-sm md:text-base">
              📊 {s.solutionStats}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
