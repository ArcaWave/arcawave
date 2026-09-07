import React, { useEffect, useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import useScrollProgress from '../../hooks/useScrollProgress'
import { BONES, KP_MIN } from './Track'

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
  const p = useScrollProgress(ref)

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
    <section id="core" ref={ref} className="relative" style={{ height: '460vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: '#0B0B0C' }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

        <Word p={p} range={SEE}>See.</Word>
        <Word p={p} range={UNDERSTAND}>Understand.</Word>
        <Word p={p} range={RESPOND}>Respond.</Word>

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: finalOpacity, y: finalY }}
        >
          <p className="display text-white" style={{ fontSize: 'clamp(30px, 5.2vw, 76px)' }}>
            See. Understand. Respond.
          </p>
          <motion.p className="mono mt-8" style={{ opacity: creditOpacity, color: 'rgba(255,255,255,0.45)' }}>
            Powered by Computer Vision &amp; AI
          </motion.p>
        </motion.div>
      </div>
    </section>
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
