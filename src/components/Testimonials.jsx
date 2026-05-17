import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const cardColors = [
  { icon: 'rgb(124, 58, 237)', iconBg: 'rgba(124, 58, 237, 0.082)', avatar: 'rgb(124, 58, 237)' },
  { icon: 'rgb(249, 115, 22)', iconBg: 'rgba(249, 115, 22, 0.082)', avatar: 'rgb(249, 115, 22)' },
  { icon: 'rgb(16, 185, 129)', iconBg: 'rgba(16, 185, 129, 0.082)', avatar: 'rgb(16, 185, 129)' },
]

const Testimonials = () => {
  const { t } = useLanguage()

  return (
    <>
      <div style={{height: '120px'}}></div>
      <section className="relative py-20 px-4 bg-card-sub">
        <div className="w-full absolute top-0 left-0 rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20" style={{display: 'block'}}>
            <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill="#F5F0FF"></path>
          </svg>
        </div>
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4">{t.testimonials.title}</h2>
            <p className="text-lg text-body-text">{t.testimonials.desc}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.testimonials.items.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl border border-border/50 p-8 relative shadow-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{backgroundColor: cardColors[index].iconBg}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote w-6 h-6" style={{color: cardColors[index].icon}}>
                    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                  </svg>
                </div>
                <p className="text-base leading-relaxed mb-6 text-foreground">
                  {item.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{backgroundColor: cardColors[index].avatar}}>{item.initial}</div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{item.name}</div>
                    <div className="text-xs text-body-text">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="w-full absolute bottom-0 left-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20" style={{display: 'block'}}>
            <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill="#FFFBF5"></path>
          </svg>
        </div>
      </section>
    </>
  )
}

export default Testimonials
