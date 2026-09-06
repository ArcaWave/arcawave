import React, { useEffect, useRef } from 'react'

/**
 * HeroSpace — an empty room that notices a person.
 *
 * Nothing at first. A figure walks in. Small signals (`movement`, `gesture`,
 * `interaction`) settle around them, and the wall — a row of thin vertical
 * lines — brightens ahead of where they are heading. The cursor becomes the
 * person: move it and the room follows, a beat behind.
 *
 * Deliberately NOT a CV demo: no boxes, no numbers, no scan lines. The room
 * should feel like it senses, not surveils.
 *
 * Drop real footage in via `videoSrc` — the wall/floor become an overlay
 * on top of it and the reactive layer stays.
 */

const LINES = 56
const INK = [15, 15, 15]
const ACCENT = [55, 76, 193]
const HORIZON = 0.62 // where the wall meets the floor (fraction of height)

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const rgba = (from, to, k, a) =>
  `rgba(${Math.round(lerp(from[0], to[0], k))},${Math.round(lerp(from[1], to[1], k))},${Math.round(
    lerp(from[2], to[2], k),
  )},${a.toFixed(3)})`

const HeroSpace = ({ videoSrc }) => {
  const stageRef = useRef(null)
  const lineRefs = useRef([])
  const groupRef = useRef(null)
  const figureRef = useRef(null)
  const lightRef = useRef(null)
  const labelRefs = useRef([])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ENTER_FROM = -14
    const HOME = 58
    let x = reduce ? HOME : ENTER_FROM
    let dir = 1
    let speedS = 0
    let lead = 0
    let mouseX = null
    let stageW = stage.clientWidth
    const start = performance.now()
    let raf = 0

    const onMove = (e) => {
      const r = stage.getBoundingClientRect()
      mouseX = ((e.clientX - r.left) / r.width) * 100
    }
    const onLeave = () => {
      mouseX = null
    }
    const onResize = () => {
      stageW = stage.clientWidth
    }
    stage.addEventListener('mousemove', onMove)
    stage.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onResize)

    const frame = (now) => {
      const t = (now - start) / 1000
      const prev = x

      if (!reduce && t < 3.2) {
        // scripted entrance: walk in from the left
        x = lerp(ENTER_FROM, HOME, easeInOut(clamp((t - 0.4) / 2.8, 0, 1)))
      } else {
        const target =
          mouseX != null ? clamp(mouseX, 14, 86) : HOME + (reduce ? 0 : 9 * Math.sin(t * 0.22))
        x = lerp(x, target, 0.045)
      }

      const vx = x - prev
      const speedNorm = clamp(Math.abs(vx) / 0.32, 0, 1)
      speedS = lerp(speedS, speedNorm, 0.08)
      if (vx > 0.003) dir = 1
      else if (vx < -0.003) dir = -1
      lead = lerp(lead, dir * (3 + 7 * speedS), 0.06)

      const presence = reduce ? 1 : clamp((t - 1.0) / 1.6, 0, 1)
      const focus = x + lead

      // wall: thin lines brighten (and rise) ahead of the person
      for (let i = 0; i < LINES; i++) {
        const el = lineRefs.current[i]
        if (!el) continue
        const lx = ((i + 0.5) / LINES) * 100
        const d = lx - focus
        const g = Math.exp(-(d * d) / (2 * 7 * 7)) * presence
        el.style.background = rgba(INK, ACCENT, g, 0.07 + 0.55 * g)
        el.style.transform = `scaleY(${(0.55 + 0.45 * g).toFixed(3)})`
      }

      // wall light
      if (lightRef.current) {
        lightRef.current.style.transform = `translateX(${((focus / 100) * stageW).toFixed(1)}px)`
        lightRef.current.style.opacity = (presence * (0.35 + 0.65 * speedS)).toFixed(3)
      }

      // person
      if (groupRef.current) {
        groupRef.current.style.transform = `translateX(${((x / 100) * stageW).toFixed(1)}px)`
        groupRef.current.style.opacity = presence.toFixed(3)
      }
      if (figureRef.current) {
        const bob = Math.sin(t * 7) * 2 * speedS
        figureRef.current.style.transform = `translateX(-50%) translateY(${bob.toFixed(2)}px) rotate(${(
          dir * speedS * 2.5
        ).toFixed(2)}deg)`
      }

      // signals
      const [mv, ge, it] = labelRefs.current
      if (mv) mv.style.opacity = (presence * (0.18 + 0.82 * speedS)).toFixed(3)
      if (ge) ge.style.opacity = (presence * (0.55 + 0.45 * Math.sin(t * 0.9))).toFixed(3)
      if (it) it.style.opacity = (presence * (0.3 + 0.7 * (1 - speedS))).toFixed(3)

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      stage.removeEventListener('mousemove', onMove)
      stage.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const horizon = `${HORIZON * 100}%`

  return (
    <div ref={stageRef} className="absolute inset-0 overflow-hidden select-none" aria-hidden>
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* wall */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: horizon,
          background: videoSrc
            ? 'linear-gradient(180deg, rgba(243,241,236,0.55), rgba(243,241,236,0.35))'
            : 'linear-gradient(180deg, #F6F4EF 0%, #EFECE5 100%)',
        }}
      />
      {/* window light on the wall */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: horizon,
          background:
            'radial-gradient(60% 70% at 18% 30%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      {/* floor */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: horizon,
          background: videoSrc
            ? 'linear-gradient(180deg, rgba(228,224,216,0.5), rgba(236,233,226,0.6))'
            : 'linear-gradient(180deg, #E3DFD7 0%, #ECE9E2 100%)',
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{ top: horizon, height: 1, background: 'rgba(15,15,15,0.09)' }}
      />

      {/* wall response light — sits behind the lines, leads the person */}
      <div
        ref={lightRef}
        className="absolute left-0"
        style={{
          top: '6%',
          width: '34vw',
          height: `${HORIZON * 100 - 6}%`,
          marginLeft: '-17vw',
          background:
            'radial-gradient(50% 60% at 50% 70%, rgba(55,76,193,0.16) 0%, rgba(55,76,193,0) 70%)',
          filter: 'blur(24px)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* wall lines */}
      <div
        className="absolute left-0 right-0 top-0 flex justify-between px-[2vw]"
        style={{ height: horizon }}
      >
        {Array.from({ length: LINES }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
            style={{
              width: 1,
              height: '100%',
              transformOrigin: 'bottom',
              background: 'rgba(15,15,15,0.07)',
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* the person — anchored at the floor line */}
      <div
        ref={groupRef}
        className="absolute left-0"
        style={{ top: horizon, width: 0, height: 0, opacity: 0, willChange: 'transform, opacity' }}
      >
        {/* contact shadow */}
        <div
          style={{
            position: 'absolute',
            left: -48,
            top: -6,
            width: 96,
            height: 14,
            borderRadius: '50%',
            background: 'rgba(15,15,15,0.45)',
            filter: 'blur(8px)',
          }}
        />
        {/* out-of-focus silhouette */}
        <svg
          ref={figureRef}
          viewBox="0 0 54 150"
          style={{
            position: 'absolute',
            left: 0,
            bottom: -2,
            height: '26vh',
            width: 'auto',
            filter: 'blur(2.6px)',
            opacity: 0.6,
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%)',
          }}
        >
          <circle cx="27" cy="18" r="13" fill="#0F0F0F" />
          <path
            d="M13 44 Q27 30 41 44 L44 100 Q44 108 38 108 L36 148 L29 148 L27 112 L25 148 L18 148 L16 108 Q10 108 10 100 Z"
            fill="#0F0F0F"
          />
        </svg>

        {/* signals — tiny, quiet, near the person; never a box */}
        <Signal ref={(el) => (labelRefs.current[0] = el)} style={{ left: 44, top: '-25vh' }}>
          movement
        </Signal>
        <Signal
          ref={(el) => (labelRefs.current[1] = el)}
          side="left"
          style={{ right: 44, top: '-15vh' }}
        >
          gesture
        </Signal>
        <Signal ref={(el) => (labelRefs.current[2] = el)} style={{ left: 40, top: '-7vh' }}>
          interaction
        </Signal>
      </div>
    </div>
  )
}

const Signal = React.forwardRef(({ children, side = 'right', style }, ref) => (
  <div
    ref={ref}
    className="mono"
    style={{
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap',
      color: 'rgba(15,15,15,0.62)',
      flexDirection: side === 'left' ? 'row-reverse' : 'row',
      opacity: 0,
      ...style,
    }}
  >
    <span style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(15,15,15,0.5)' }} />
    <span style={{ width: 22, height: 1, background: 'rgba(15,15,15,0.28)' }} />
    <span>{children}</span>
  </div>
))
Signal.displayName = 'Signal'

export default HeroSpace
