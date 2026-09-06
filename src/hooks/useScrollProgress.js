import { useEffect } from 'react'
import { useMotionValue } from 'framer-motion'

/**
 * 0 → 1 as a tall section scrolls through the viewport
 * (0 when its top hits the viewport top, 1 when its bottom hits the viewport bottom).
 *
 * Measures fresh on every scroll/resize instead of caching layout at mount,
 * so late layout shifts (fonts, images, viewport emulation) never desync it.
 */
export default function useScrollProgress(ref) {
  const progress = useMotionValue(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const measure = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return
      const p = Math.min(1, Math.max(0, -rect.top / travel))
      progress.set(p)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    ro?.observe(document.documentElement)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro?.disconnect()
    }
  }, [ref, progress])

  return progress
}
