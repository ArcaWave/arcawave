import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const ArcaContact = () => {
  const { t } = useLanguage()
  const c = t.arca.contact

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[36px] overflow-hidden"
          style={{ background: '#1E1B4B' }}
        >
          {/* Single soft accent wash — top-right only, much subtler than before */}
          <div
            className="absolute top-0 right-0 w-[640px] h-[640px] blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at top right, rgba(244, 114, 182, 0.16) 0%, rgba(124, 58, 237, 0.08) 40%, transparent 70%)',
            }}
          />
          {/* Faint horizontal hairline — subtle editorial cue */}
          <div
            className="absolute left-10 right-10 top-0 h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
            }}
          />

          <div className="relative p-10 md:p-16 lg:p-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-white/30" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
                {c.eyebrow}
              </span>
            </div>

            <h2
              className="text-white mb-7 leading-[1.15]"
              style={{
                fontSize: 'clamp(32px, 5vw, 60px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              <span className="block">{c.title1}</span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #FB923C 0%, #F472B6 50%, #C4B5FD 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {c.title2}
              </span>
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-white/70 max-w-[620px] mb-10 whitespace-pre-line">
              {c.body}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <motion.a
                href={`mailto:${c.email}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-foreground px-7 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {c.ctaPrimary}
              </motion.a>

              <a
                href={`mailto:${c.email}`}
                className="text-sm text-white/60 hover:text-white transition-colors font-mono sm:ml-2"
              >
                {c.email}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ArcaContact
