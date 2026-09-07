import React, { useEffect, useMemo, useRef, useState } from 'react'
import Track from './Track'

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
              <Track key={`${scene.name}-${p.id}`} p={p} W={W} H={H} k={k} delay={i * 35} animate={!reduce} />
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

export default HeroScan
