import React, { useEffect, useRef, useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import useScrollProgress from '../../hooks/useScrollProgress'
import Track, { BONES, KP_MIN } from './Track'

/**
 * Core — See. Understand. Respond.
 *
 * The hero showed what the camera sees. This is what the system sees.
 * The page flips to black and the photograph is gone: the room is a point
 * cloud, the children are skeletons, and the scroll performs the process.
 *
 *   See        — a scan line sweeps the room into points.
 *   Understand — the room sinks back; skeletons condense, trails grow out of
 *                each child's motion (the vertical reference: joints + lines
 *                growing on black).
 *   Respond    — rings spread from every child, the cloud around them lights.
 *   Then only the three words remain.
 *
 * Everything is drawn on one canvas from the same track.json the hero uses.
 */

const SCENE = '04-kids-cafe'
const COLS = 168 // point grid resolution across the scene
const ACCENT = [55, 76, 193]

const SPLIT = 0.72 // share of the section used by the animation; the remainder holds the final screen
const SEE = [0.02, 0.3]
const UNDERSTAND = [0.3, 0.57]
const RESPOND = [0.57, 0.82]

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (t) => (t = clamp01(t), t * t * (3 - 2 * t))
const ramp = (p, a, b) => smooth((p - a) / (b - a))
const lerp = (a, b, t) => a + (b - a) * t

// how a child's trail leaves them, by behaviour (unit-ish vectors in scene space)
const TRAIL_DIR = {
  running: [-1, 0.05],
  jumping: [0, 0.9],
  climbing: [0.1, 1],
  sliding: [-0.7, -0.7],
  swinging: [0.9, 0.2],
  sitting: [-0.25, 0.1],
  standing: [-0.3, 0.1],
  reaching: [-0.3, 0.3],
}

const Core = () => {
  const ref = useRef(null)
  const canvasRef = useRef(null)
  const raw = useScrollProgress(ref)
  // the choreography plays over the first SPLIT of the section; the rest is a hold
  // on the two-track screen so it does not flick past
  const p = useTransform(raw, (v) => Math.min(1, v / SPLIT))

  // the hold (after SPLIT) plays two beats: Safety first, then Learning
  const hold = useTransform(raw, (v) => Math.max(0, Math.min(1, (v - SPLIT) / (1 - SPLIT))))
  const beatSafety = useTransform(hold, [0.04, 0.46], [0, 1])
  const beatLearning = useTransform(hold, [0.54, 0.96], [0, 1])
  const safetyDim = useTransform(hold, [0.46, 0.56], [1, 0.35])
  const learningDim = useTransform(hold, [0, 0.46, 0.56], [0.35, 0.35, 1])

  // words + final block (DOM, on top of the canvas)
  const finalOpacity = useTransform(p, [0.85, 0.91], [0, 1])
  const finalY = useTransform(p, [0.85, 0.91], [10, 0])
  const creditOpacity = useTransform(p, [0.92, 0.98], [0, 1])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let alive = true
    let scene = null // { W, H, points, people }

    const loadImage = (src) =>
      new Promise((res, rej) => {
        const im = new Image()
        im.onload = () => res(im)
        im.onerror = rej
        im.src = src
      })

    // ---- build the point cloud from the fragment + the people cutout ----
    ;(async () => {
      const base = `/assets/scenes/${SCENE}`
      const [track, chunk, people] = await Promise.all([
        fetch(`${base}/track.json`).then((r) => r.json()),
        loadImage(`${base}/chunk.webp`),
        loadImage(`${base}/people.webp`),
      ])
      if (!alive) return
      const W = track.width
      const H = track.height
      const rows = Math.round((COLS * H) / W)
      const off = document.createElement('canvas')
      off.width = COLS
      off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      octx.drawImage(chunk, 0, 0, COLS, rows)
      const c = octx.getImageData(0, 0, COLS, rows).data
      octx.clearRect(0, 0, COLS, rows)
      octx.drawImage(people, 0, 0, COLS, rows)
      const pp = octx.getImageData(0, 0, COLS, rows).data

      const persons = track.people.map((q) => ({
        ...q,
        cx: (q.box[0] + q.box[2]) / 2,
        cy: (q.box[1] + q.box[3]) / 2,
        h: q.box[3] - q.box[1],
        dir: TRAIL_DIR[q.label] || TRAIL_DIR.standing,
        seed: Math.random() * 1000,
      }))

      const points = []
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < COLS; i++) {
          const k = (j * COLS + i) * 4
          const a = c[k + 3] / 255
          if (a < 0.35) continue
          const lum = (0.2126 * c[k] + 0.7152 * c[k + 1] + 0.0722 * c[k + 2]) / 255
          const x = (i + 0.5) / COLS
          const y = (j + 0.5) / rows
          const person = pp[k + 3] > 120
          // distance to the nearest child, in units of that child's height
          let near = 9
          for (const q of persons) {
            const d = Math.hypot((x - q.cx) * (W / H), y - q.cy) / Math.max(0.12, q.h)
            if (d < near) near = d
          }
          points.push({ x, y, lum, person, near, r: Math.random() })
        }
      }
      scene = { W, H, points, people: persons }
    })()

    // ---- draw ----
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr
        canvas.height = ch * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      if (!scene) return

      const t = now / 1000
      const pr = p.get()
      const { W, H, points, people } = scene

      // scene box: contained under the word, centred
      const maxW = cw * 0.86
      const maxH = ch * 0.62
      const sw = Math.min(maxW, maxH * (W / H))
      const sh = sw * (H / W)
      const sx = (cw - sw) / 2
      const sy = (cw < 768 ? ch * 0.22 : ch * 0.3) + (maxH - sh) / 2
      const X = (u) => sx + u * sw
      const Y = (v) => sy + v * sh

      // phase envelopes
      const reveal = ramp(pr, SEE[0], SEE[0] + 0.2) // scan sweep
      const inSee = pr < UNDERSTAND[0]
      const cloud = pr < 0.82 ? lerp(1, 0.22, ramp(pr, UNDERSTAND[0], UNDERSTAND[0] + 0.06)) : lerp(0.22, 0, ramp(pr, 0.82, 0.86))
      const skel = pr < 0.82 ? ramp(pr, UNDERSTAND[0] + 0.01, UNDERSTAND[0] + 0.07) : 1 - ramp(pr, 0.82, 0.86)
      const trail = ramp(pr, UNDERSTAND[0] + 0.05, UNDERSTAND[1] - 0.02)
      const respond = pr < 0.82 ? ramp(pr, RESPOND[0], RESPOND[0] + 0.06) : 1 - ramp(pr, 0.82, 0.86)
      const gone = ramp(pr, 0.82, 0.86)
      if (gone >= 1) return

      // ---- point cloud ----
      const cell = sw / COLS
      for (const q of points) {
        if (inSee && q.x > reveal) continue
        let a = q.lum * 0.55 * cloud
        if (q.person) a = Math.max(a, 0.5 * cloud + 0.35 * skel)
        // Understand: non-person points settle, person points hum
        let jx = 0
        let jy = 0
        if (q.person && skel > 0 && respond < 1) {
          jx = Math.sin(t * 3 + q.r * 40) * 0.6 * skel
          jy = Math.cos(t * 2.6 + q.r * 30) * 0.6 * skel
        }
        // Respond: the room near each child turns accent, pulsing outward
        let rr = 255
        let gg = 255
        let bb = 255
        if (respond > 0 && !q.person) {
          const wave = 0.5 + 0.5 * Math.sin(t * 2.2 - q.near * 3.2)
          const k = clamp01(1 - q.near / 2.6) * respond * (0.55 + 0.45 * wave)
          rr = lerp(255, ACCENT[0], k)
          gg = lerp(255, ACCENT[1], k)
          bb = lerp(255, ACCENT[2], k)
          a = Math.max(a, k * 0.5)
        }
        if (a < 0.02) continue
        const size = q.person ? Math.max(1.4, cell * 0.5) : Math.max(1, cell * 0.38)
        ctx.fillStyle = `rgba(${rr | 0},${gg | 0},${bb | 0},${a.toFixed(3)})`
        ctx.fillRect(X(q.x) + jx - size / 2, Y(q.y) + jy - size / 2, size, size)
      }

      // ---- See: scan line ----
      if (inSee && reveal > 0 && reveal < 1) {
        const lx = X(reveal)
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.fillRect(lx, sy - 12, 1, sh + 24)
        ctx.font = '10px IBM Plex Mono, ui-monospace, monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.fillText(`scanning  ${Math.round(reveal * 100)}%`, lx + 8, sy - 14)
      }

      // ---- Respond: rings from every child ----
      if (respond > 0) {
        ctx.lineWidth = 1
        for (const q of people) {
          const cx = X(q.cx)
          const cy = Y(q.cy)
          const maxR = q.h * sh * 1.05
          for (let j = 0; j < 3; j++) {
            const ph = (t * 0.45 + j / 3 + q.seed) % 1
            const r = ph * maxR
            const a = (1 - ph) * 0.55 * respond
            ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${a.toFixed(3)})`
            ctx.beginPath()
            ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, Math.PI * 2)
            ctx.stroke()
          }
        }
      }

      // ---- Understand: trails + skeletons + boxes ----
      if (skel > 0) {
        for (const q of people) {
          const kp = q.kp
          const [dx, dy] = q.dir
          const N = 9
          const step = q.h * 0.075 // per ghost, in scene units
          // ghosts, far to near
          for (let g = N; g >= 1; g--) {
            const f = g / N
            if (f > trail) continue
            const amp = q.h * 0.06 * Math.sin(g * 0.75 + q.seed)
            const ox = dx * step * g + -dy * amp
            const oy = dy * step * g * (W / H) + dx * amp
            const a = (1 - f) * 0.48 * skel
            drawSkeleton(ctx, kp, W, H, (u) => X(u + ox), (v) => Y(v + oy), a, false)
          }
          // the child now
          drawSkeleton(ctx, kp, W, H, X, Y, skel, true)

          // box + chip
          const x0 = X(q.box[0])
          const y0 = Y(q.box[1])
          const bw = (q.box[2] - q.box[0]) * sw
          const bh = (q.box[3] - q.box[1]) * sh
          ctx.setLineDash([4, 3])
          ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${(0.85 * skel).toFixed(3)})`
          ctx.lineWidth = 1
          ctx.strokeRect(x0 + 0.5, y0 + 0.5, bw, bh)
          ctx.setLineDash([])
          const label = respond > 0.5 ? RESPONSES[(q.id - 1) % RESPONSES.length] : q.label
          ctx.font = '9.5px IBM Plex Mono, ui-monospace, monospace'
          const tw = ctx.measureText(label).width + 12
          ctx.globalAlpha = skel
          ctx.fillStyle = `rgb(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]})`
          const lx = Math.min(x0, sx + sw - tw)
          ctx.fillRect(lx, y0 - 19, tw, 15)
          ctx.fillStyle = '#fff'
          ctx.fillText(label, lx + 6, y0 - 8)
          ctx.globalAlpha = 1
        }
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [p])

  return (
    <section id="core" ref={ref} className="relative" style={{ height: '600vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: '#0B0B0C' }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

        <Word p={p} range={SEE}>See.</Word>
        <Word p={p} range={UNDERSTAND}>Understand.</Word>
        <Word p={p} range={RESPOND}>Respond.</Word>

        {/* what it becomes: two tracks on the same intelligence */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center px-6 md:px-8 pt-14 md:pt-0"
          style={{ opacity: finalOpacity, y: finalY }}
        >
          <div className="max-w-[1240px] w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-16">
              {TRACKS.map((t) => (
                <motion.div key={t.title} style={{ opacity: t.mode === 'safety' ? safetyDim : learningDim }}>
                  <TrackVisual mode={t.mode} scene={t.scene} beat={t.mode === 'safety' ? beatSafety : beatLearning} />
                  <h3 className="display text-white mt-4 md:mt-8" style={{ fontSize: 'clamp(26px, 4.6vw, 64px)' }}>
                    {t.title}
                  </h3>
                  <p className="mt-3 md:mt-5 text-[13px] md:text-[17px] leading-relaxed max-w-[38ch]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {t.body}
                  </p>
                  <div className="mt-4 md:mt-6 hidden md:flex flex-wrap gap-2">
                    {t.tags.map((g) => (
                      <span key={g} className="mono" style={{ border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.8)', padding: '5px 8px' }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// TODO: draft copy — replace with the company's own words
const TRACKS = [
  {
    title: 'Safety',
    mode: 'safety',
    scene: '03-playground',
    body: 'Falls, collisions, a child alone too long. The space alerts in the moment and writes the safety report afterwards.',
    tags: ['real-time alerts', 'incident detection', 'safety reports'],
  },
  {
    title: 'Learning',
    mode: 'learning',
    scene: '01-classroom-desk',
    body: 'Focus, activity, who plays with whom. The same eyes read how each child engages, and turn it into reports teachers and parents can act on.',
    tags: ['focus & activity', 'participation', 'learning reports'],
  },
]

/**
 * TrackVisual — a small live sample of one track, drawn on a real scene.
 *   safety:   one child is flagged; rings spread from them, an alert chip pulses.
 *   learning: every child gets a small focus meter that fills up.
 */
const TrackVisual = ({ mode, scene, beat }) => {
  const [track, setTrack] = useState(null)
  const stageRef = useRef(null)
  const [k, setK] = useState(2)
  const [t, setT] = useState(0) // 0..1 within this track's beat
  useEffect(() => {
    let alive = true
    fetch(`/assets/scenes/${scene}/track.json`).then((r) => r.json()).then((d) => alive && setTrack(d))
    return () => {
      alive = false
    }
  }, [scene])
  useEffect(() => {
    const el = stageRef.current
    if (!el || !track) return
    const measure = () => setK(track.width / Math.max(1, el.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [track])
  useEffect(() => {
    if (!beat) return
    setT(beat.get())
    return beat.on('change', (v) => setT(v))
  }, [beat])

  const base = `/assets/scenes/${scene}`
  const flagged = mode === 'safety' ? 2 : -1 // the child climbing the rope ladder
  const focus = [0.82, 0.64, 0.91, 0.47, 0.73]

  // safety: time passes with scroll; the alert fires at ALERT_AT
  const ALERT_AT = 0.55
  const height = (2.2 * Math.min(1, t / ALERT_AT)).toFixed(1) // metres climbed
  const alert = mode === 'safety' && t >= ALERT_AT
  const logged = t >= 0.82

  // learning: meters fill with scroll
  const fill = Math.min(1, t / 0.7)
  const avg = Math.round((focus.reduce((a, b) => a + b, 0) / focus.length) * 100 * fill)

  const chipFor = (q, i) => {
    if (mode === 'learning') return { ...q, label: `focus ${Math.round(focus[i % focus.length] * 100 * fill)}%` }
    return q
  }

  return (
    <div className="relative">
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: 'var(--sv-ratio, 16 / 9)',
          WebkitMaskImage: 'url(/assets/masks/torn-2.png)',
          maskImage: 'url(/assets/masks/torn-2.png)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }}
      >
        <img src={`${base}/chunk.webp`} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(1) brightness(0.5) contrast(1.1)' }} draggable={false} />
        <img src={`${base}/people.webp`} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(0.7) brightness(0.85)' }} draggable={false} />
        {track && (
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox={`0 0 ${track.width} ${track.height}`}>
            {track.people.map((q, i) => {
              const W = track.width
              const H = track.height
              const [x0, y0, x1, y1] = [q.box[0] * W, q.box[1] * H, q.box[2] * W, q.box[3] * H]
              const cx = (x0 + x1) / 2
              const isFlag = i === flagged
              const color = isFlag && alert ? '#FF4D4D' : 'var(--accent)'
              return (
                <g key={q.id}>
                  {isFlag && alert &&
                    [0, 1, 2].map((r) => (
                      <ellipse
                        key={r}
                        cx={cx}
                        cy={y1}
                        rx={(x1 - x0) * 0.9}
                        ry={(x1 - x0) * 0.32}
                        fill="none"
                        stroke="#FF4D4D"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                        className="sv-ring"
                        style={{ animationDelay: `${r * 0.7}s`, transformOrigin: `${cx}px ${y1}px` }}
                      />
                    ))}
                  <Track p={chipFor(q, i)} W={W} H={H} k={k} animate={false} showChip={!isFlag && mode === 'learning'} />
                  {isFlag && (
                    <g>
                      <rect x={x0} y={y0 - 19 * k} width={(alert ? 17 * 6.4 + 14 : 14 * 6.4 + 14) * k} height={15 * k} fill={color} className={alert ? 'sv-pulse' : ''} />
                      <text x={x0 + 6 * k} y={y0 - 19 * k + 15 * k * 0.72} fontFamily="var(--font-mono)" fontSize={9.5 * k} letterSpacing="0.05em" fill="#fff">
                        {alert ? 'alert · fall risk' : `climbing · ${height} m`}
                      </text>
                    </g>
                  )}
                  {mode === 'learning' && (
                    <>
                      <rect x={x0} y={y1 + 6 * k} width={x1 - x0} height={3 * k} fill="rgba(255,255,255,0.18)" />
                      <rect x={x0} y={y1 + 6 * k} width={(x1 - x0) * focus[i % focus.length] * fill} height={3 * k} fill="var(--accent)" />
                    </>
                  )}
                </g>
              )
            })}
          </svg>
        )}
        <div className="absolute left-[4%] top-[6%] mono" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {mode === 'safety' ? 'safety · live' : 'learning · this week'}
        </div>
      </div>
        {/* below the visual: outcome line (left) and, on phones, the big number (right) */}
      <div className="mt-3 flex items-end justify-between gap-4">
      {/* the outcome line, written once the event has played out */}
      <div
        className="mono pl-[3%] transition-opacity duration-500 text-[10px] md:text-[11px] leading-snug"
        style={{ color: mode === 'safety' ? '#FF4D4D' : 'var(--accent)', opacity: logged ? 1 : 0 }}
      >
        {mode === 'safety' ? (
          <>
            <span className="hidden md:inline">fall risk logged · 14:32 · playground · 2 staff notified</span>
            <span className="md:hidden">fall risk logged · 2 staff notified</span>
          </>
        ) : (
          <>
            <span className="hidden md:inline">weekly report ready · focus ↑12% · participation 4 / 5</span>
            <span className="md:hidden">weekly report ready · focus ↑12%</span>
          </>
        )}
      </div>
      {/* the big number: what you actually watch move */}
        <div className="shrink-0 text-right md:absolute md:right-[3%] md:bottom-[12%]" style={{ color: alert ? '#FF4D4D' : '#fff' }}>
          <div className="display" style={{ fontSize: 'clamp(26px, 4.2vw, 60px)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {mode === 'safety' ? `${height} m` : `${avg}%`}
          </div>
          <div className="mono mt-2" style={{ color: alert ? '#FF4D4D' : 'rgba(255,255,255,0.65)' }}>
            {mode === 'safety' ? (alert ? 'above safe height' : 'climbing height') : 'avg focus'}
          </div>
        </div>

      </div>
    </div>
  )
}

const RESPONSES = ['light → warm', 'sound → soft', 'wall → follow', 'floor → glow', 'guide → next']

function drawSkeleton(ctx, kp, W, H, X, Y, alpha, joints) {
  const pts = kp.map(([x, y, c]) => [X(x), Y(y), c])
  ctx.lineWidth = 1
  ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${(0.9 * alpha).toFixed(3)})`
  ctx.beginPath()
  for (const [a, b] of BONES) {
    if (pts[a][2] > KP_MIN && pts[b][2] > KP_MIN) {
      ctx.moveTo(pts[a][0], pts[a][1])
      ctx.lineTo(pts[b][0], pts[b][1])
    }
  }
  ctx.stroke()
  const s = joints ? 4 : 2.5
  ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
  for (const [x, y, c] of pts) {
    if (c > KP_MIN) ctx.fillRect(x - s / 2, y - s / 2, s, s)
  }
}

const Word = ({ p, range, children }) => {
  const [a, b] = range
  const opacity = useTransform(p, [a, a + 0.03, b - 0.02, b], [0, 1, 1, 0])
  const y = useTransform(p, [a, b], [8, -8])
  return (
    <motion.div
      style={{ opacity, y, top: '9vh' }}
      className="absolute inset-x-0 flex justify-center pointer-events-none"
    >
      <span className="display text-white" style={{ fontSize: 'clamp(44px, 7.4vw, 108px)' }}>
        {children}
      </span>
    </motion.div>
  )
}

export default Core
