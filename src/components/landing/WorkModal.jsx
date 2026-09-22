import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * WorkModal — one category, all its works, full screen.
 *
 * Paper sheet over the page. Left: the list of works in this category.
 * Right: the selected work as a large torn fragment with caption and a
 * short line. Esc / × closes, ← → move, clicking a row selects it.
 */
const ease = [0.22, 1, 0.36, 1]

const WorkModal = ({ item, onClose }) => {
  const works = item?.works || []
  const [i, setI] = useState(0)
  const w = works[i]

  useEffect(() => {
    setI(0)
  }, [item])

  useEffect(() => {
    if (!item) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % works.length)
      if (e.key === 'ArrowLeft') setI((v) => (v - 1 + works.length) % works.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [item, works.length, onClose])

  return (
    <AnimatePresence>
      {item && w && (
        <motion.div
          key="work-modal"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="fixed inset-0 z-[60] bg-paper text-ink overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-end px-6 md:px-8 py-6 bg-paper/90 backdrop-blur-sm">
            <button
              type="button"
              onClick={onClose}
              className="text-[13px] font-medium hover:opacity-60 transition-opacity"
              aria-label="Close"
            >
              Close ×
            </button>
          </div>

          <div className="px-6 md:px-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-[1400px] mx-auto">
            {/* list */}
            <ul className="lg:col-span-4 border-t border-line order-2 lg:order-1">
              {works.map((x, j) => {
                const on = j === i
                return (
                  <li key={x.title} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setI(j)}
                      onMouseEnter={() => setI(j)}
                      className="w-full text-left py-4 flex items-start justify-between gap-6 transition-colors"
                      style={{ color: on ? 'var(--ink)' : 'rgba(15,15,15,0.55)' }}
                    >
                      <span>
                        <span className="display block" style={{ fontSize: 'clamp(20px, 1.8vw, 26px)', letterSpacing: '-0.02em' }}>
                          {x.title}
                        </span>
                        <span className="mono block mt-1.5" style={{ color: on ? 'var(--ink-2)' : 'var(--ink-3)' }}>
                          {x.caption}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="block rounded-full mt-2 shrink-0 transition-opacity duration-300"
                        style={{ width: 6, height: 6, background: 'var(--accent)', opacity: on ? 1 : 0 }}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* selected work */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: '16 / 10',
                      WebkitMaskImage: `url(/assets/masks/torn-${(i % 3) + 1}.png)`,
                      maskImage: `url(/assets/masks/torn-${(i % 3) + 1}.png)`,
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                    }}
                  >
                    <img src={w.img} alt={w.title} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: w.pos }} draggable={false} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 pl-[3%]">
                    <span className="mono" style={{ background: 'var(--accent)', color: '#fff', padding: '4px 7px' }}>
                      {w.caption}
                    </span>
                  </div>
                  <div className="mt-4 pl-[3%] flex flex-col md:flex-row md:items-baseline gap-3 md:gap-10">
                    <h3 className="display md:whitespace-nowrap" style={{ fontSize: 'clamp(26px, 2.6vw, 38px)', letterSpacing: '-0.02em' }}>
                      {w.title}
                    </h3>
                    {w.desc && (
                      <p className="text-[15px] leading-relaxed max-w-[46ch]" style={{ color: 'var(--ink-2)' }}>
                        {w.desc}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* prev / next */}
              {works.length > 1 && (
                <div className="mt-8 pl-[3%] flex items-center gap-6 text-[13px] font-medium">
                  <button type="button" onClick={() => setI((v) => (v - 1 + works.length) % works.length)} className="hover:opacity-60 transition-opacity">
                    ← Prev
                  </button>
                  <button type="button" onClick={() => setI((v) => (v + 1) % works.length)} className="hover:opacity-60 transition-opacity">
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WorkModal
