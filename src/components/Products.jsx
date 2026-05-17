import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const Products = () => {
  const { t } = useLanguage()

  return (
    <>
      <div style={{height: '120px'}}></div>
      <section className="relative py-20 px-4 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 px-6 py-3 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-4 h-4 text-secondary">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="text-secondary font-semibold">{t.products.badge2}</span>
            </div>
            <h2 className="mb-4">{t.products.title2}</h2>
            <p className="text-lg max-w-[700px] mx-auto leading-relaxed text-body-text">
              {t.products.desc2}
            </p>
          </motion.div>
          {/* Team - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-[1100px] mx-auto">
            {t.products.team.map((member, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl border border-border/50 p-8 text-center relative shadow-card-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {/* Avatar placeholder */}
                <div className="relative mx-auto mb-5 w-24 h-24">
                  <div className="w-full h-full rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center bg-primary/5 overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-primary/30">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
                {/* Role badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 mb-3">
                  <span className="text-xs font-bold text-primary">{member.role}</span>
                </div>
                {/* Name */}
                <h4 className="text-xl font-bold text-foreground mb-3">{member.name}</h4>
                {/* School */}
                <div className="text-sm font-semibold text-foreground/80 mb-4 leading-relaxed whitespace-pre-line">{member.school}</div>
                {/* Highlights */}
                <div className="text-left space-y-2 mb-4">
                  {member.highlights?.map((item, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0"></span>
                      <span className="text-xs leading-relaxed text-body-text">{item}</span>
                    </div>
                  ))}
                </div>
                {/* Paper/Note */}
                {member.paper && (
                  <p className="text-xs leading-relaxed text-caption italic border-t border-border/30 pt-3 mt-3">{member.paper}</p>
                )}
              </motion.div>
            ))}
          </div>
          {/* Advisory Board with tags */}
          <motion.div
            className="max-w-[900px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#F5F0FF] rounded-2xl p-8 border border-primary/10 text-center">
              <h4 className="mb-4 text-foreground font-bold">{t.products.advisorTitle}</h4>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                {t.products.advisorTags.map((tag, index) => (
                  <span key={index} className="bg-white px-4 py-2 rounded-full text-sm font-medium text-foreground border border-primary/10">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-body-text">{t.products.advisorNote}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Products
