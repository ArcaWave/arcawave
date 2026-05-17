import React, { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const screenImages = [
  '/assets/images/screens/1.svg',
  '/assets/images/screens/2.svg',
  '/assets/images/screens/3.svg',
  '/assets/images/screens/4.svg',
  '/assets/images/screens/5.svg',
  '/assets/images/screens/6.svg',
  '/assets/images/screens/7.svg',
]

const AppPreview = () => {
  const { t } = useLanguage()
  const d = t.appPreview
  const [currentIndex, setCurrentIndex] = useState(0)
  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3
  const screens = d.screens.map((s, i) => ({ ...s, src: screenImages[i] || screenImages[0] }))
  const maxIndex = Math.max(0, screens.length - visibleCount)

  const scrollTo = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }

  return (
    <>
      <div style={{ height: '120px' }}></div>
      <section className="relative py-20 px-4 bg-background overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="text-center mb-6">
            <span className="badge badge-secondary">
              ✨ {d.badge}
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ lineHeight: 1.3 }}
              dangerouslySetInnerHTML={{ __html: d.title }}
            />
            <p className="text-lg text-body-text">
              {d.desc}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => scrollTo(currentIndex - 1)}
              className="absolute left-[-20px] md:left-[-28px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', opacity: currentIndex === 0 ? 0.3 : 1 }}
              disabled={currentIndex === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Right arrow */}
            <button
              onClick={() => scrollTo(currentIndex + 1)}
              className="absolute right-[-20px] md:right-[-28px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', opacity: currentIndex >= maxIndex ? 0.3 : 1 }}
              disabled={currentIndex >= maxIndex}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Track */}
            <div className="overflow-hidden mx-4 md:mx-6">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                  gap: '24px',
                }}
              >
                {screens.map((screen, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 px-2"
                    style={{ width: `calc(${100 / visibleCount}% - ${24 * (visibleCount - 1) / visibleCount}px)` }}
                  >
                    <div className="rounded-2xl overflow-hidden border-2 border-border bg-white"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
                    >
                      <img
                        src={screen.src}
                        alt={screen.label}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </div>

                    {/* Label */}
                    <div className="text-center mt-5">
                      <p className="font-bold text-foreground text-base mb-1">{screen.label}</p>
                      <p className="text-sm text-caption">{screen.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentIndex ? '24px' : '10px',
                  height: '10px',
                  backgroundColor: i === currentIndex ? '#7C3AED' : 'rgba(124, 58, 237, 0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default AppPreview
