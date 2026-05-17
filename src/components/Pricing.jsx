import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const Pricing = () => {
  const { t } = useLanguage()

  return (
    <>
      <div style={{height: '120px'}}></div>
      <section className="relative py-20 px-4 bg-white">
        <div className="w-full absolute top-0 left-0 rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20" style={{display: 'block'}}>
            <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill="#FFFFFF"></path>
          </svg>
        </div>
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-24">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4">{t.pricing.whyTitle}</h2>
              <p className="text-xl text-body-text">{t.pricing.whyDesc}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  bgClass: 'bg-card-sub',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette w-8 h-8 text-primary">
                      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                    </svg>
                  ),
                  title: t.pricing.whyCard1Title,
                  desc: t.pricing.whyCard1Desc,
                },
                {
                  bgClass: 'bg-secondary/10',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-8 h-8 text-secondary">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                      <path d="M20 3v4"></path>
                      <path d="M22 5h-4"></path>
                      <path d="M4 17v2"></path>
                      <path d="M5 18H3"></path>
                    </svg>
                  ),
                  title: t.pricing.whyCard2Title,
                  desc: t.pricing.whyCard2Desc,
                },
                {
                  bgClass: 'bg-success/10',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-8 h-8 text-success">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                  ),
                  title: t.pricing.whyCard3Title,
                  desc: t.pricing.whyCard3Desc,
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-8 relative overflow-hidden shadow-card-sm border border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${card.bgClass}`}>
                    {card.icon}
                  </div>
                  <h3 className="mb-3 text-foreground">{card.title}</h3>
                  <p className="text-body-text leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4">{t.pricing.howTitle}</h2>
              <p className="text-xl text-body-text">{t.pricing.howDesc}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: '01', color: 'primary', title: t.pricing.step1Title, desc: t.pricing.step1Desc },
                { num: '02', color: 'secondary', title: t.pricing.step2Title, desc: t.pricing.step2Desc },
                { num: '03', color: 'success', title: t.pricing.step3Title, desc: t.pricing.step3Desc },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="relative text-center md:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto md:mx-0 ${step.color === 'primary' ? 'bg-card-sub' : `bg-${step.color}/10`}`}>
                    <div className={`text-2xl font-bold text-${step.color}`} style={{fontFamily: 'var(--font-display)'}}>{step.num}</div>
                  </div>
                  <h4 className="mb-3 text-foreground">{step.title}</h4>
                  <p className="text-body-text">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full absolute bottom-0 left-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20" style={{display: 'block'}}>
            <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill="#FFFBF5"></path>
          </svg>
        </div>
      </section>
      <div style={{height: '120px'}}></div>
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge badge-success mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award w-4 h-4 text-success">
                <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                <circle cx="12" cy="8" r="6"></circle>
              </svg>
              <span className="text-success font-semibold">{t.pricing.badge}</span>
            </div>
            <h2 className="mb-4">{t.pricing.title}</h2>
            <p className="text-xl max-w-[600px] mx-auto text-body-text">{t.pricing.desc}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
            {/* Free tier */}
            <motion.div
              className="relative rounded-2xl p-8 bg-white shadow-card-sm border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <div className="text-center mb-8 text-foreground">
                <h3 className="mb-2">{t.pricing.freeName}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-5xl" style={{fontFamily: 'var(--font-display)', fontWeight: 800}}>{t.pricing.freePrice}</span>
                  <span className="text-body-text">{t.pricing.freePeriod}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-success/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-3 h-3 text-success">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span className="text-body-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                className="w-full py-4 rounded-full font-semibold transition-all bg-primary text-white hover:bg-primary/90"
                whileTap={{ scale: 0.97 }}
              >
                {t.pricing.freeCta}
              </motion.button>
            </motion.div>
            {/* Premium tier (highlighted) */}
            <motion.div
              className="relative rounded-2xl p-8 bg-primary"
              style={{boxShadow: 'rgba(124, 58, 237, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px'}}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary px-6 py-2 rounded-full">
                <span className="text-white text-sm font-semibold">{t.pricing.popular}</span>
              </div>
              <div className="text-center mb-8 text-white">
                <h3 className="mb-2 text-white">{t.pricing.premiumName}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-5xl" style={{fontFamily: 'var(--font-display)', fontWeight: 800}}>{t.pricing.premiumPrice}</span>
                  <span className="text-white/80">{t.pricing.premiumPeriod}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-3 h-3 text-white">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                className="w-full py-4 rounded-full font-semibold transition-all bg-white text-primary hover:bg-white/90"
                whileTap={{ scale: 0.97 }}
              >
                {t.pricing.premiumCta}
              </motion.button>
            </motion.div>
            {/* Family tier */}
            <motion.div
              className="relative rounded-2xl p-8 bg-white shadow-card-sm border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center mb-8 text-foreground">
                <h3 className="mb-2">{t.pricing.familyName}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-5xl" style={{fontFamily: 'var(--font-display)', fontWeight: 800}}>{t.pricing.familyPrice}</span>
                  <span className="text-body-text">{t.pricing.familyPeriod}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.familyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-success/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-3 h-3 text-success">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span className="text-body-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                className="w-full py-4 rounded-full font-semibold transition-all bg-primary text-white hover:bg-primary/90"
                whileTap={{ scale: 0.97 }}
              >
                {t.pricing.familyCta}
              </motion.button>
            </motion.div>
          </div>
          <p className="text-center mt-12 text-body-text">{t.pricing.earlybird}</p>
        </div>
      </section>
    </>
  )
}

export default Pricing
