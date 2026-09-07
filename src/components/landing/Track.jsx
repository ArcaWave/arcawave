import React from 'react'

/** COCO-17 bones */
export const BONES = [
  [5, 7], [7, 9], [6, 8], [8, 10], [5, 6], [5, 11], [6, 12], [11, 12],
  [11, 13], [13, 15], [12, 14], [14, 16], [0, 5], [0, 6],
]
export const KP_MIN = 0.4

/**
 * Box + corner handles + behaviour chip + skeleton for one tracked person.
 * Coordinates are in the scene's pixel space (viewBox = W×H);
 * `k` is viewBox units per CSS pixel so strokes, chips and handles stay screen-true.
 */
const Track = ({ p, W, H, k, delay = 0, animate = true, showChip = true }) => {
  const [x0, y0, x1, y1] = [p.box[0] * W, p.box[1] * H, p.box[2] * W, p.box[3] * H]
  const w = x1 - x0
  const h = y1 - y0
  const hs = 9 * k
  const pts = p.kp.map(([x, y, c]) => [x * W, y * H, c])
  const chipH = 15 * k
  const chipW = (p.label.length * 6.4 + 38) * k
  const chipY = y0 - chipH - 4 * k
  const jr = 2 * k

  return (
    <g
      className={animate ? 'trk-acquire' : ''}
      style={{ animationDelay: `${delay}ms`, transformOrigin: `${x0 + w / 2}px ${y0 + h / 2}px` }}
    >
      <g className={animate ? 'trk-skel' : ''} style={{ animationDelay: `${delay + 60}ms` }}>
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

      {showChip && (
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
      )}
    </g>
  )
}

export default Track
