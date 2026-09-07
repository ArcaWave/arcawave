# tools/

## track_scene.py — hero scene layers

Turns one scene photo into what `src/components/landing/HeroScan.jsx` needs:
`chunk.webp` (background as a torn scan fragment), `people.webp` (people cutout)
and `track.json` (boxes, COCO-17 keypoints, behaviour labels).

One-time setup (downloads torch + ultralytics, ~1 GB; weights land in `tools/*.pt`):

```bash
python3 -m venv .venv && .venv/bin/pip install -U pip ultralytics
```

Per scene (labels are applied left → right; `--label` sets one for everyone):

```bash
.venv/bin/python tools/track_scene.py public/assets/images/scenes/01-classroom-desk.png --label sitting
.venv/bin/python tools/track_scene.py public/assets/images/scenes/03-playground.png --labels swinging,running,climbing,sliding,climbing
```

Then add the scene to `SCENES` in `HeroScan.jsx`.
