import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

/**
 * Panel accents — each member gets a distinct gradient and matching tonal text.
 * Background uses a duotone wash + a soft grid pattern (different motion
 * vocabulary from the hero's pulse rings).
 */
// Paper with a hint of accent — each panel is mostly cream with a soft tint
// radiating from one corner. The accent only sings on the role chip + number.
const accents = [
  {
    bg: 'radial-gradient(ellipse at 100% 0%, rgba(124, 58, 237, 0.14) 0%, rgba(124, 58, 237, 0.04) 35%, transparent 65%), #FBF7F0',
    chip: { bg: '#7C3AED', text: '#FFFFFF' },
    accent: '#7C3AED',
    inkOn: '#1E1B4B',
    inkSoft: '#5C5878',
  },
  {
    bg: 'radial-gradient(ellipse at 100% 0%, rgba(249, 115, 22, 0.14) 0%, rgba(249, 115, 22, 0.04) 35%, transparent 65%), #FBF7F0',
    chip: { bg: '#F97316', text: '#FFFFFF' },
    accent: '#F97316',
    inkOn: '#1E1B4B',
    inkSoft: '#5C5878',
  },
  {
    bg: 'radial-gradient(ellipse at 100% 0%, rgba(219, 39, 119, 0.14) 0%, rgba(219, 39, 119, 0.04) 35%, transparent 65%), #FBF7F0',
    chip: { bg: '#DB2777', text: '#FFFFFF' },
    accent: '#DB2777',
    inkOn: '#1E1B4B',
    inkSoft: '#5C5878',
  },
]

const DEFAULT_OPEN = 0

const ArcaTeam = () => {
  const { t } = useLanguage()
  const team = t.arca.team
  const members = t.products.team
  const [hovered, setHovered] = useState(DEFAULT_OPEN)

  return (
    <section id="team" className="relative py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-[640px]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-foreground/30" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/60">
              {team.eyebrow}
            </span>
          </div>
          <h2
            className="leading-[1.15] mb-3"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              wordBreak: 'keep-all',
            }}
          >
            {team.title}
          </h2>
          <p className="text-base text-body-text leading-relaxed">
            {team.subtitle}
          </p>
        </motion.div>

        {/* Mobile / sm — simple stacked cards (no accordion) */}
        <div className="lg:hidden grid grid-cols-1 gap-4">
          {members.map((m, i) => {
            const a = accents[i % accents.length]
            return (
              <div
                key={m.name}
                className="rounded-3xl p-7 border border-foreground/5 relative overflow-hidden"
                style={{ background: a.bg }}
              >
                <span
                  className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3 inline-block px-3 py-1 rounded-full"
                  style={{ background: a.chip.bg, color: a.chip.text }}
                >
                  {m.role}
                </span>
                <div className="text-3xl font-extrabold mb-2" style={{ color: a.inkOn }}>
                  {m.name}
                </div>
                <div className="text-xs font-mono mb-4" style={{ color: a.inkSoft }}>
                  {m.credits}
                </div>
                <p className="text-base font-medium leading-snug" style={{ color: a.inkOn, wordBreak: 'keep-all' }}>
                  {m.tagline}
                </p>
              </div>
            )
          })}
        </div>

        {/* Desktop accordion */}
        <div
          className="hidden lg:flex gap-3 h-[440px]"
          onMouseLeave={() => setHovered(DEFAULT_OPEN)}
        >
          {members.map((m, i) => {
            const a = accents[i % accents.length]
            const isOpen = hovered === i
            return (
              <motion.button
                type="button"
                key={m.name}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                animate={{ flex: isOpen ? 3 : 1 }}
                transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
                className="relative overflow-hidden rounded-3xl border border-foreground/5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                style={{ background: a.bg }}
                aria-label={`${m.name}, ${m.role}`}
              >
                {/* Subtle dot grid texture — different vocabulary from hero */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.08]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                    color: a.accent,
                  }}
                />

                {/* Index marker — large outlined number, magazine-style */}
                <div
                  className="absolute top-6 right-7 text-[110px] font-black leading-none select-none"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: `2px ${a.accent}`,
                    opacity: 0.18,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top: role chip */}
                  <div>
                    <span
                      className="inline-block text-[10px] font-bold tracking-[0.22em] uppercase px-3 py-1.5 rounded-full"
                      style={{ background: a.chip.bg, color: a.chip.text }}
                    >
                      {m.role}
                    </span>
                  </div>

                  {/* Bottom: name + (animated) tagline */}
                  <div>
                    <div
                      className="text-[34px] font-extrabold leading-tight mb-1.5"
                      style={{ color: a.inkOn, letterSpacing: '-0.015em' }}
                    >
                      {m.name}
                    </div>

                    {/* Credits line — always visible, small */}
                    <div
                      className="text-[11px] font-mono mb-4"
                      style={{ color: a.inkSoft }}
                    >
                      {m.credits}
                    </div>

                    {/* Tagline — fades + slides in only when expanded */}
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.p
                          key="tagline"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.35, delay: 0.1 }}
                          className="text-lg leading-snug font-semibold max-w-[460px]"
                          style={{ color: a.inkOn, wordBreak: 'keep-all' }}
                        >
                          {m.tagline}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom-right hover hint — only on collapsed panels */}
                {!isOpen && (
                  <div
                    className="absolute bottom-6 right-6 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      boxShadow: '0 1px 6px rgba(30, 27, 75, 0.06)',
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: a.accent }}
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Advisors */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-card-sub/40 rounded-3xl border border-foreground/5 p-7 md:p-9 text-center"
        >
          <h3 className="text-sm font-bold text-foreground/70 mb-4 tracking-wide">
            {team.advisorTitle}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            {team.advisorTags.map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-foreground/70 border border-foreground/10"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-caption">{team.advisorNote}</p>
        </motion.div>
      </div>
    </section>
  )
}

export default ArcaTeam
