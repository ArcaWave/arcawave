import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const starSvgPath = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"

const Contact = () => {
  const { t } = useLanguage()

  return (
    <>
      <div style={{height: '120px'}}></div>
      <section className="relative py-20 px-4 bg-primary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute rounded-full opacity-40" style={{backgroundColor: 'rgb(124, 58, 237)', width: '8px', height: '8px', top: '10%', left: '15%'}}></div>
          <div className="absolute rounded-full opacity-40" style={{backgroundColor: 'rgb(249, 115, 22)', width: '12px', height: '12px', top: '25%', left: '85%'}}></div>
          <div className="absolute rounded-full opacity-40" style={{backgroundColor: 'rgb(244, 114, 182)', width: '10px', height: '10px', top: '60%', left: '10%'}}></div>
          <div className="absolute rounded-full opacity-40" style={{backgroundColor: 'rgb(16, 185, 129)', width: '8px', height: '8px', top: '75%', left: '90%'}}></div>
          <div className="absolute rounded-full opacity-40" style={{backgroundColor: 'rgb(124, 58, 237)', width: '6px', height: '6px', top: '40%', left: '5%'}}></div>
          <div className="absolute rounded-full opacity-40" style={{backgroundColor: 'rgb(249, 115, 22)', width: '10px', height: '10px', top: '85%', left: '20%'}}></div>
        </div>
        <motion.div
          className="max-w-[800px] mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-6 text-white">{t.contact.title}<br />{t.contact.titleBr}</h2>
          <p className="text-xl mb-10 text-white/90">
            {t.contact.desc}<br />{t.contact.descBr}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              className="bg-white text-primary px-8 py-4 rounded-full flex items-center gap-2 text-lg font-semibold"
              tabIndex="0"
              style={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 16px'}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {t.contact.ctaPrimary}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </motion.button>
            <motion.button
              className="bg-transparent text-white px-8 py-4 rounded-full border-2 border-white/30 text-lg font-semibold"
              tabIndex="0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {t.contact.ctaSecondary}
            </motion.button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-star w-5 h-5 text-secondary fill-secondary"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
              >
                <path d={starSvgPath}></path>
              </motion.svg>
            ))}
            <span className="ml-2 text-white/90">{t.contact.rating}</span>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-white/80 text-sm">{t.contact.email}</p>
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default Contact
