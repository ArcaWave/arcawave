import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WorkModal from './WorkModal'

/**
 * Build — what we're doing, side by side.
 *
 * No pinning, no scroll-jacking: the page scrolls as usual and the works sit
 * next to each other as large torn fragments. Each card rises into view once.
 * A category with several works opens a full-screen view on click.
 */

// TODO: replace the stand-in photos with real project stills in public/assets/images/work/
export const ITEMS = [
  {
    kind: 'work',
    title: 'Mongle Kids',
    type: 'Product',
    caption: '2025 · Mongle Kids · at home',
    img: '/assets/images/work/monglekids-01.jpg',
    pos: '60% 40%',
    href: 'https://monglekids.com',
    external: true,
  },
  {
    kind: 'work',
    title: 'Exhibitions',
    type: 'Exhibition',
    caption: '2 exhibitions · 2024–2025',
    img: '/assets/images/work/exhibition-01.jpg',
    pos: '78% 50%',
    // clicking opens these in a full-screen view
    works: [
      {
        title: 'Interactive media wall',
        caption: '2024 · Media wall · Seoul',
        img: '/assets/images/work/exhibition-01.jpg',
        pos: '78% 50%',
        desc: 'A wall of screens that notices who is in front of it and answers with light and motion.',
      },
      {
        title: 'Responsive pop-up',
        caption: '2025 · Pop-up · Seoul',
        img: '/assets/images/work/popup-01.jpg',
        pos: '50% 60%',
        desc: 'A temporary space that changes its pace with the people moving through it.',
      },
    ],
  },
  {
    kind: 'work',
    title: 'Gamani : Classroom Vision',
    type: 'Device',
    caption: '2026 · Gamani · classroom',
    img: '/assets/images/work/gamani-01.jpg',
    pos: '50% 50%',
    // TODO: link or works list once there is somewhere to go
  },
]

const ease = [0.22, 1, 0.36, 1]

const Build = () => {
  const [openItem, setOpenItem] = useState(null)

  // nav dropdown: categories with a works list open their full-screen view
  useEffect(() => {
    const onGo = (e) => {
      const i = e.detail
      if (typeof i !== 'number') return
      const el = document.getElementById('build')
      if (el) window.scrollTo({ top: el.offsetTop, behavior: 'instant' })
      if (ITEMS[i].works) setOpenItem(ITEMS[i])
    }
    window.addEventListener('arcawave:go', onGo)
    return () => window.removeEventListener('arcawave:go', onGo)
  }, [])

  return (
    <section id="build" className="relative bg-paper build-pin">
      {/* on desktop the section pins for a beat so it does not flick past; phones scroll normally */}
      <div className="build-inner px-6 md:px-8">
      <div className="max-w-[1400px] mx-auto w-full">
        <p className="mono-caps mb-12 md:mb-16" style={{ color: 'var(--ink-3)' }}>
          What we're doing
        </p>

        {/* columns follow the count: 2 → halves, 3 → thirds, more → wraps */}
        <div
          className="grid gap-x-10 gap-y-16 lg:gap-x-14"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' }}
        >
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              className={i % 2 === 1 ? 'md:mt-[9vh]' : ''}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
            >
              <Card item={it} i={i} onOpen={it.works ? () => setOpenItem(it) : undefined} />
            </motion.div>
          ))}
        </div>

      </div>
      </div>

      <WorkModal item={openItem} onClose={() => setOpenItem(null)} />
    </section>
  )
}

/** One work: a torn fragment + caption + title. */
const Card = ({ item, i, onOpen }) => {
  const mask = `url(/assets/masks/torn-${(i % 3) + 1}.png)`
  const Wrap = item.href ? 'a' : onOpen ? 'button' : 'div'

  return (
    <Wrap
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      type={onOpen ? 'button' : undefined}
      onClick={onOpen}
      className="group block w-full text-left"
    >
      <div
        className="relative w-full overflow-hidden fragment"
        style={{
          aspectRatio: '36 / 23',
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }}
      >
        <img
          src={item.img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover fragment-img"
          style={{ objectPosition: item.pos }}
          draggable={false}
        />
      </div>

      <div className="mt-4 flex items-center gap-3 pl-[3%]">
        <span className="mono" style={{ background: 'var(--accent)', color: '#fff', padding: '4px 7px' }}>
          {item.caption}
        </span>
        <span className="mono" style={{ color: 'var(--ink-3)' }}>
          {item.type}
        </span>
      </div>
      <div className="mt-3 pl-[3%] flex items-baseline justify-between gap-6">
        <span className="display" style={{ fontSize: 'clamp(22px, 2.2vw, 30px)', letterSpacing: '-0.02em' }}>
          {item.title}
        </span>
        {(item.href || onOpen) && (
          <span
            aria-hidden
            className="text-[14px] shrink-0 inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
          >
            {item.external ? '↗' : onOpen ? '+' : '→'}
          </span>
        )}
      </div>
    </Wrap>
  )
}

export default Build
