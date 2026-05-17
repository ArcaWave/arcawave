import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const tagColors = {
  Science: 'bg-blue-100 text-blue-700',
  Art: 'bg-purple-100 text-purple-700',
  Math: 'bg-orange-100 text-orange-700',
  Engineering: 'bg-green-100 text-green-700',
  Technology: 'bg-pink-100 text-pink-700',
}

const WeeklyContent = () => {
  const { t } = useLanguage()
  const [activeArtist, setActiveArtist] = useState(0)
  const artist = t.weeklyContent.artists[activeArtist]

  return (
    <>
      <div style={{ height: '120px' }}></div>
      <section className="relative py-20 px-4 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4">{t.weeklyContent.title}</h2>
            <p className="text-lg text-body-text">
              {t.weeklyContent.desc}
            </p>
          </motion.div>
          {/* Artist Tabs */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-10 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.weeklyContent.artists.map((a, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveArtist(index)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all text-sm ${
                  activeArtist === index
                    ? 'bg-[#1E1B4B] text-white shadow-lg'
                    : 'bg-white text-foreground hover:bg-gray-50'
                }`}
                style={activeArtist !== index ? { boxShadow: 'rgba(0,0,0,0.08) 0px 1px 4px' } : {}}
                whileTap={{ scale: 0.97 }}
              >
                <span>{a.emoji}</span>
                <span>{a.name}</span>
              </motion.button>
            ))}
          </motion.div>
          {/* Content Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeArtist}
              className="bg-white rounded-[20px] p-8 lg:p-10 max-w-[1000px] mx-auto"
              style={{ boxShadow: 'rgba(124, 58, 237, 0.1) 0px 4px 20px' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Artist Info + Image Placeholder */}
                <div>
                  <div className="text-5xl mb-4">{artist.emoji}</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{artist.name}</h3>
                  <p className="text-primary font-semibold mb-6">{artist.theme}</p>
                  <div
                    className="bg-[#F5F0FF] rounded-[16px] aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-primary/20"
                  >
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-sm text-foreground font-medium">{t.weeklyContent.imageLabel}</p>
                    <p className="text-xs text-caption">{t.weeklyContent.imageSub}</p>
                  </div>
                </div>
                {/* Right: Episodes */}
                <div>
                  <p className="text-sm font-semibold text-caption mb-4">{t.weeklyContent.episodeLabel}</p>
                  <div className="space-y-3">
                    {artist.episodes.map((ep, i) => (
                      <motion.div
                        key={ep.num}
                        className={`flex items-center gap-4 p-4 rounded-[12px] ${
                          ep.isFinal
                            ? 'bg-primary/5 border-2 border-primary'
                            : 'bg-gray-50'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                            ep.isFinal
                              ? 'bg-primary text-white'
                              : 'text-caption'
                          }`}
                        >
                          {ep.num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground text-sm">
                            {ep.isFinal && '★ '}{ep.title}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {ep.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tagColors[tag] || 'bg-card-sub text-body-text'}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {ep.isFinal && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full flex-shrink-0">
                            {t.weeklyContent.finalLabel}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}

export default WeeklyContent
