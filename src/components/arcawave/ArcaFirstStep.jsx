import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const ArcaFirstStep = () => {
  const { t, lang } = useLanguage()
  const f = t.arca.firstStep

  return (
    <section id="product" className="relative py-32 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(245, 240, 255, 0.4) 30%, rgba(255, 247, 237, 0.4) 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1100px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-foreground/30" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/60">
                {f.eyebrow}
              </span>
            </div>

            <h2
              className="leading-[1.15] mb-8"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              <span className="block text-foreground/80">{f.title1}</span>
              <span className="block text-foreground">{f.title2}</span>
            </h2>

            <div className="inline-flex items-center gap-3 mb-5">
              <span
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #F472B6 100%)',
                  color: 'white',
                }}
              >
                Mongle Kids
              </span>
              <span className="text-sm font-semibold text-foreground/70">
                {lang === 'ko' ? f.productNameKo : `· ${f.productNameKo}`}
              </span>
            </div>

            <p className="text-base md:text-lg leading-relaxed text-body-text mb-6">
              {f.productDesc}
            </p>

            <p className="text-sm font-medium text-foreground/60 italic border-l-2 border-primary/30 pl-4">
              "{f.note}"
            </p>
          </div>

          {/* Right: visual */}
          <div className="relative">
            <div className="relative aspect-[4/5] max-w-[420px] mx-auto">
              <div
                className="absolute inset-0 rounded-[40px] -rotate-3"
                style={{
                  background:
                    'linear-gradient(135deg, #FED7AA 0%, #FBCFE8 50%, #DDD6FE 100%)',
                }}
              />
              <div className="absolute inset-0 rounded-[40px] bg-white/40 backdrop-blur-sm rotate-2 border border-white/60" />
              <div className="relative h-full rounded-[40px] bg-white border border-foreground/5 shadow-card-lg overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-pink flex items-center justify-center">
                      <span className="text-white text-sm font-black">M</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">Mongle Kids</span>
                  </div>
                  <span className="text-[10px] font-mono text-foreground/40">v0.1</span>
                </div>

                <div className="flex-1 px-6 pb-6 flex flex-col gap-3 overflow-hidden">
                  <div className="bg-card-sub rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-primary mb-1.5 tracking-wider">
                      AI MENTOR
                    </div>
                    <div className="text-sm font-medium text-foreground leading-snug">
                      {lang === 'ko'
                        ? '오늘은 어떤 색이 가장 신기했어?'
                        : 'Which color surprised you the most today?'}
                    </div>
                  </div>

                  <div className="self-end max-w-[80%] bg-foreground rounded-2xl px-4 py-3">
                    <div className="text-sm font-medium text-white leading-snug">
                      {lang === 'ko'
                        ? '파랑이랑 노랑 섞었더니 초록이 됐어요!'
                        : 'When I mixed blue and yellow, green appeared!'}
                    </div>
                  </div>

                  <div className="bg-card-sub rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-primary mb-1.5 tracking-wider">
                      AI MENTOR
                    </div>
                    <div className="text-sm font-medium text-foreground leading-snug">
                      {lang === 'ko'
                        ? '왜 초록이 나왔을까? 같이 그려볼까?'
                        : "Why did green show up? Let's draw it together?"}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-3 border-t border-foreground/5">
                    <div className="flex -space-x-1.5">
                      {['#F472B6', '#F97316', '#7C3AED'].map((c) => (
                        <div key={c} className="w-5 h-5 rounded-full border-2 border-white" style={{ background: c }} />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-foreground/50">
                      {lang === 'ko' ? '함께 자라는 5~9세' : 'Growing together · ages 5–9'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why kids */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="border-t border-foreground/10 pt-16"
        >
          <h3 className="text-lg md:text-xl font-bold text-foreground/80 mb-10 text-center">
            {f.whyKidsTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {f.whyKids.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative bg-white rounded-2xl p-7 border border-foreground/5"
              >
                <span className="text-3xl font-black text-foreground/10 absolute top-5 right-5">
                  0{i + 1}
                </span>
                <h4 className="text-base font-bold text-foreground mb-3 leading-snug pr-8">
                  {w.title}
                </h4>
                <p className="text-sm leading-relaxed text-body-text">
                  {w.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ArcaFirstStep
