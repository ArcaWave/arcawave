import React, { useEffect, useMemo, useRef, useState } from 'react'

/**
 * HeroScan — four scanned spaces, one uninterrupted act of understanding.
 *
 * Each scene is a torn "scan fragment" floating on the page. The camera
 * orbits it slowly; the people sit on a nearer layer so the space has depth.
 * On every child: a dashed box with corner handles, a behaviour chip, and a
 * live skeleton. Scenes hard-cut with a two-frame glitch (gradient flash +
 * sliced offsets) and the tracking layer re-acquires on the new scene.
 *
 * Inputs come from tools/track_scene.py:
 *   /assets/scenes/<name>/chunk.webp   background fragment (RGBA)
 *   /assets/scenes/<name>/people.webp  people cutout (RGBA)
 *   /assets/scenes/<name>/track.json   boxes + COCO-17 keypoints + labels
 */

export const SCENES = [
  { name: '01-classroom-desk', title: 'Classroom' },
  { name: '02-classroom-play', title: 'Classroom' },
  { name: '03-playground', title: 'Playground' },
  { name: '04-kids-cafe', title: 'Indoor playground' },
]

const SCENE_MS = 1300 // reference cuts about every 1.3s
const OUT_MS = 90 // glitch on the outgoing scene
const IN_MS = 110 // glitch on the incoming scene

// COCO-17 bones
const BONES = [
  [5, 7], [7, 9], [6, 8], [8, 10], [5, 6], [5, 11], [6, 12], [11, 12],
  [11, 13], [13, 15], [12, 14], [14, 16], [0, 5], [0, 6],
]
const KP_MIN = 0.4

const HeroScan = () => {
  const [data, setData] = useState(null) // [{...scene, track}]
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('in') // 'in' | 'stable' | 'out'
  const [tick, setTick] = useState(0) // bumps per scene so animations restart
  const stageRef = useRef(null)
  const [k, setK] = useState(1.6) // viewBox units per CSS pixel, so overlay sizes stay screen-true
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // load tracking data + preload images once
  useEffect(() => {
    let alive = true
    Promise.all(
      SCENES.map(async (s) => {
        const track = await fetch(`/assets/scenes/${s.name}/track.json`).then((r) => r.json())
        await Promise.all(
          ['chunk', 'people'].map(
            (k) =>
              new Promise((res) => {
                const im = new Image()
                im.onload = im.onerror = res
                im.src = `/assets/scenes/${s.name}/${k}.webp`
              }),
          ),
        )
        return { ...s, track }
      }),
    ).then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [])

  // scene clock: stable → out → (switch) in → stable
  useEffect(() => {
    if (!data) return
    let t1, t2, t3
    const settle = setTimeout(() => setPhase('stable'), IN_MS)
    t1 = setTimeout(() => {
      setPhase('out')
      t2 = setTimeout(() => {
        setIndex((i) => (i + 1) % data.length)
        setTick((t) => t + 1)
        setPhase('in')
      }, OUT_MS)
    }, reduce ? SCENE_MS * 1.6 : SCENE_MS)
    return () => {
      clearTimeout(settle)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [data, tick, reduce])

  // measure the stage so chips, handles and dashes are sized in CSS pixels
  useEffect(() => {
    const el = stageRef.current
    if (!el || !data) return
    const W0 = data[0].track.width
    const measure = () => setK(W0 / Math.max(1, el.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [data])

  if (!data) return <div className="absolute inset-0" aria-hidden />

  const scene = data[index]
  const { width: W, height: H, people } = scene.track
  const base = `/assets/scenes/${scene.name}`
  const glitch = phase !== 'stable'

  return (
    <div className="absolute inset-0 overflow-hidden select-none" aria-hidden>
      <div
        ref={stageRef}
        className="scan-stage absolute"
        style={{ aspectRatio: `${W} / ${H}`, perspective: 1600 }}
      >
        {/* orbiting group — restarts per scene via key */}
        <div
          key={tick}
          className={`scan-orbit absolute inset-0 ${reduce ? '' : 'scan-orbit-anim'}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* the space */}
          <div
            className={`absolute inset-0 ${glitch ? 'scan-glitch' : ''}`}
            style={{ transform: 'translateZ(0px)' }}
          >
            <img src={`${base}/chunk.webp`} alt="" className="absolute inset-0 w-full h-full" draggable={false} />
            {/* glitch: gradient "normal map" flash masked by the fragment, plus sliced offsets */}
            {glitch && (
              <>
                <div
                  className="absolute inset-0 scan-flash"
                  style={{
                    WebkitMaskImage: `url(${base}/chunk.webp)`,
                    maskImage: `url(${base}/chunk.webp)`,
                    WebkitMaskSize: '100% 100%',
                    maskSize: '100% 100%',
                  }}
                />
                {[0, 1, 2].map((i) => (
                  <img
                    key={i}
                    src={`${base}/chunk.webp`}
                    alt=""
                    className={`absolute inset-0 w-full h-full scan-slice scan-slice-${i}`}
                    style={{ clipPath: `inset(${i * 33.4}% 0 ${(2 - i) * 33.3}% 0)` }}
                    draggable={false}
                  />
                ))}
              </>
            )}
          </div>

          {/* the people — nearer layer for parallax */}
          <img
            src={`${base}/people.webp`}
            alt=""
            className={`absolute inset-0 w-full h-full ${glitch ? 'scan-people-glitch' : ''}`}
            style={{ transform: 'translateZ(34px)' }}
            draggable={false}
          />

          {/* tracking layer */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
            style={{ transform: 'translateZ(36px)' }}
          >
            {people.map((p, i) => (
              <Track key={`${scene.name}-${p.id}`} p={p} W={W} H={H} k={k} delay={i * 35} reduce={reduce} />
            ))}
          </svg>
        </div>

        {/* scene caption — tiny, under the fragment */}
        <div
          key={`cap-${tick}`}
          className="mono scan-caption absolute right-[3%] flex items-center gap-3"
          style={{ top: 'calc(100% + 12px)', color: 'var(--ink-3)' }}
        >
          <span style={{ color: 'var(--ink-2)' }}>
            {String(index + 1).padStart(2, '0')} / {String(data.length).padStart(2, '0')}
          </span>
          <span>{scene.title.toLowerCase()}</span>
          <span>·</span>
          <span>{people.length} tracked</span>
        </div>
      </div>
    </div>
  )
}

/** Box + handles + chip + skeleton for one person. */
const Track = ({ p, W, H, k, delay, reduce }) => {
  const [x0, y0, x1, y1] = [p.box[0] * W, p.box[1] * H, p.box[2] * W, p.box[3] * H]
  const w = x1 - x0
  const h = y1 - y0
  const hs = 9 * k // handle size (9px)
  const pts = p.kp.map(([x, y, c]) => [x * W, y * H, c])
  const chipH = 15 * k
  const chipW = (p.label.length * 6.4 + 38) * k
  const chipY = y0 - chipH - 4 * k
  const jr = 2 * k // joint half-size (2px)

  return (
    <g
      className={reduce ? '' : 'trk-acquire'}
      style={{ animationDelay: `${delay}ms`, transformOrigin: `${x0 + w / 2}px ${y0 + h / 2}px` }}
    >
      {/* skeleton */}
      <g className="trk-skel" style={{ animationDelay: `${delay + 60}ms` }}>
        {BONES.map(([a, b]) =>
          pts[a][2] > KP_MIN && pts[b][2] > KP_MIN ? (
            <line
              key={`${a}-${b}`}
              x1={pts[a][0]}
              y1={pts[a][1]}
              x2={pts[b][0]}
              y2={pts[b][1]}
              stroke="var(--accent)"
              strokeWidth="1"
              strokeOpacity="0.7"
              vectorEffect="non-scaling-stroke"
            />
          ) : null,
        )}
        {pts.map(([x, y, c], i) =>
          c > KP_MIN ? (
            <rect
              key={i}
              x={x - jr}
              y={y - jr}
              width={jr * 2}
              height={jr * 2}
              fill="#fff"
              stroke="var(--accent)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="trk-joint"
              style={{ animationDelay: `${(i * 137) % 900}ms` }}
            />
          ) : null,
        )}
      </g>

      {/* dashed box */}
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeDasharray={`${4 * k} ${3 * k}`}
        strokeOpacity="0.85"
        vectorEffect="non-scaling-stroke"
      />
      {/* corner handles */}
      {[
        [x0, y0, 1, 1],
        [x1, y0, -1, 1],
        [x0, y1, 1, -1],
        [x1, y1, -1, -1],
      ].map(([cx, cy, sx, sy], i) => (
        <path
          key={i}
          d={`M ${cx} ${cy + sy * hs} L ${cx} ${cy} L ${cx + sx * hs} ${cy}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* behaviour chip */}
      <g transform={`translate(${x0} ${chipY})`}>
        <rect width={chipW} height={chipH} fill="var(--accent)" />
        <text
          x={6 * k}
          y={chipH * 0.72}
          fontFamily="var(--font-mono)"
          fontSize={9.5 * k}
          letterSpacing="0.05em"
          fill="#fff"
        >
          {p.label}
        </text>
        <text
          x={chipW - 6 * k}
          y={chipH * 0.72}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={8 * k}
          fill="rgba(255,255,255,0.72)"
        >
          {p.conf.toFixed(2)}
        </text>
      </g>
    </g>
  )
}

export default HeroScan
