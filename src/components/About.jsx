import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const About = () => {
  const { t } = useLanguage()

  return (
    <>
      <div style={{height: '120px'}}></div>
      <section id="about" className="relative py-20 px-4 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="mb-6">
              <span className="badge badge-success">
                ♡ {t.about.badge}
              </span>
            </div>
            <h2 className="mb-6" style={{ lineHeight: 1.3 }}>{t.about.title}<br />{t.about.titleBr}</h2>
            <p className="text-lg max-w-[800px] mx-auto leading-relaxed font-bold text-primary">
              {t.about.desc}
            </p>
          </motion.div>

          {/* iPhone Mockup with scrollable SVG */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mx-auto" style={{width: '290px'}}>
              {/* iPhone frame */}
              <div className="relative bg-[#1E1B4B] rounded-[44px] p-[10px] shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#1E1B4B] rounded-b-2xl z-10"></div>
                {/* Screen - iPhone 15 ratio roughly 393x852 → scaled to 270 width = 270x585 */}
                <div
                  className="relative bg-white rounded-[36px] overflow-hidden"
                  style={{width: '270px', height: '550px'}}
                >
                  {/* Scrollable content - crop SVG padding via scale+translate */}
                  <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide" style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}>
                    <img
                      src="/assets/images/screens/report.svg"
                      alt="성장 리포트 화면"
                      style={{
                        display: 'block',
                        width: '317.94px',
                        minWidth: '317.94px',
                        marginLeft: '-24px',
                        marginTop: '-8px',
                        marginBottom: '0px',
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Home indicator */}
              <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-gray-400/30 rounded-full z-10"></div>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            {[t.about.check1, t.about.check2, t.about.check3].map((check, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check w-5 h-5 text-success">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                <span className="text-sm font-semibold text-foreground">{check}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-body-text">{t.about.note}</p>
        </div>
      </section>
      {/* Hide scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}

export default About
