#!/usr/bin/env python3
"""
Turn one scene photo into the layers the hero needs.

  .venv/bin/python tools/track_scene.py public/assets/images/scenes/01-classroom-desk.jpg [--label sitting]

Writes next to the image, under public/assets/scenes/<name>/:
  track.json   people: bbox, 17 COCO keypoints, behaviour label
  chunk.webp   background with people removed, ragged "scan fragment" alpha edge
  people.webp  RGBA cutout of the people (parallax layer)
"""
import argparse, json, sys
from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO

ROOT = Path(__file__).resolve().parent.parent
POSE_W = ROOT / 'tools' / 'yolov8m-pose.pt'
SEG_W = ROOT / 'tools' / 'yolov8m-seg.pt'

# COCO-17 keypoint order used by YOLO-pose
KP = ['nose', 'l_eye', 'r_eye', 'l_ear', 'r_ear', 'l_sho', 'r_sho', 'l_elb', 'r_elb',
      'l_wri', 'r_wri', 'l_hip', 'r_hip', 'l_knee', 'r_knee', 'l_ank', 'r_ank']


def angle(a, b, c):
    ba, bc = a - b, c - b
    d = np.linalg.norm(ba) * np.linalg.norm(bc)
    if d == 0:
        return 180.0
    return float(np.degrees(np.arccos(np.clip(np.dot(ba, bc) / d, -1, 1))))


def behaviour(kp, conf, box):
    """Very small heuristic: sitting / running / standing. Scene-level --label overrides."""
    def ok(*idx):
        return all(conf[i] > 0.4 for i in idx)
    h = box[3] - box[1]
    knee = []
    if ok(11, 13, 15):
        knee.append(angle(kp[11], kp[13], kp[15]))
    if ok(12, 14, 16):
        knee.append(angle(kp[12], kp[14], kp[16]))
    if knee and min(knee) < 125:
        # bent knees: sitting if hips are low in the box, otherwise mid-stride
        if ok(11, 12) and (kp[11][1] + kp[12][1]) / 2 > box[1] + h * 0.55:
            return 'sitting'
        return 'running'
    if ok(15, 16) and abs(kp[15][1] - kp[16][1]) > h * 0.12:
        return 'running'
    if ok(9, 10, 5, 6) and (kp[9][1] < kp[5][1] or kp[10][1] < kp[6][1]):
        return 'reaching'
    return 'standing'


def ragged_mask(h, w, seed=7, inset=0.05, roughness=0.42):
    """Alpha for the scan-fragment look: an irregular slab whose edge is shredded
    into thin slivers, like photogrammetry that ran out of coverage."""
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = w / 2, h / 2
    d = np.sqrt(((xx - cx) / (w * 0.5)) ** 2 + ((yy - cy) / (h * 0.5)) ** 2)

    def noise(scale, aniso=1.0):
        small = rng.random((max(2, int(h / scale)), max(2, int(h / scale * aniso)))).astype(np.float32)
        up = cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC)
        return cv2.GaussianBlur(up, (0, 0), max(1.0, scale * 0.25))

    def norm(n):
        return (n - n.min()) / (n.max() - n.min() + 1e-6)

    # large-scale wobble of the outline + fine streaky detail
    outline = norm(noise(220) * 0.6 + noise(70) * 0.4)
    streaks = norm(noise(18, aniso=6.0))          # long thin horizontal slivers
    grain = norm(noise(9))
    field = d + (outline - 0.5) * roughness + (streaks - 0.5) * 0.10
    edge = 1.0 - inset
    a = np.clip((edge - field) / 0.02, 0, 1)
    # shred a band just inside the edge: streaks and grain punch thin gaps
    band = np.clip((field - (edge - 0.22)) / 0.22, 0, 1)   # 0 deep inside -> 1 at edge
    cut = (streaks * 0.65 + grain * 0.35) < band * 0.62
    a = np.where(cut, 0.0, a)
    # soften a touch so the alpha does not alias
    a = cv2.GaussianBlur(a.astype(np.float32), (0, 0), 0.8)
    return (np.clip(a, 0, 1) * 255).astype(np.uint8)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('image')
    ap.add_argument('--label', help='behaviour label for everyone in the scene (overrides heuristic)')
    ap.add_argument('--labels', help='comma list of labels, applied left-to-right (overrides heuristic)')
    ap.add_argument('--out', help='output dir (default public/assets/scenes/<name>)')
    ap.add_argument('--seed', type=int, default=7)
    ap.add_argument('--max-side', type=int, default=1600)
    args = ap.parse_args()

    src = Path(args.image)
    name = src.stem
    out = Path(args.out) if args.out else ROOT / 'public' / 'assets' / 'scenes' / name
    out.mkdir(parents=True, exist_ok=True)

    img = cv2.imread(str(src))
    if img is None:
        sys.exit(f'cannot read {src}')
    h0, w0 = img.shape[:2]
    s = min(1.0, args.max_side / max(h0, w0))
    if s < 1:
        img = cv2.resize(img, (int(w0 * s), int(h0 * s)), interpolation=cv2.INTER_AREA)
    h, w = img.shape[:2]

    # --- pose ---
    pose = YOLO(str(POSE_W))
    pr = pose.predict(img, conf=0.35, verbose=False, imgsz=1280)[0]
    people = []
    if pr.keypoints is not None and pr.boxes is not None:
        xy = pr.keypoints.xy.cpu().numpy()
        kc = pr.keypoints.conf.cpu().numpy() if pr.keypoints.conf is not None else np.ones(xy.shape[:2])
        bx = pr.boxes.xyxy.cpu().numpy()
        bc = pr.boxes.conf.cpu().numpy()
        for i in range(len(bx)):
            box = bx[i].tolist()
            lab = args.label or behaviour(xy[i], kc[i], box)
            people.append({
                'id': i + 1,
                'box': [round(v / w if j % 2 == 0 else v / h, 4) for j, v in enumerate(box)],
                'conf': round(float(bc[i]), 3),
                'label': lab,
                'kp': [[round(float(x) / w, 4), round(float(y) / h, 4), round(float(c), 2)]
                       for (x, y), c in zip(xy[i], kc[i])],
            })
    # drop duplicate detections (a body box plus a body+furniture box for the same child)
    def overlap(a, b):
        ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
        inter = ix * iy
        area = lambda r: (r[2] - r[0]) * (r[3] - r[1])
        return inter / max(1e-6, min(area(a), area(b)))
    people.sort(key=lambda p: -p['conf'])
    kept = []
    for p in people:
        if all(overlap(p['box'], k['box']) < 0.8 for k in kept):
            kept.append(p)
    people = kept
    people.sort(key=lambda p: p['box'][0])
    labels = [x.strip() for x in args.labels.split(',')] if args.labels else []
    for i, p in enumerate(people):
        p['id'] = i + 1
        if i < len(labels) and labels[i]:
            p['label'] = labels[i]

    # --- segmentation: person cutout + inpainted background ---
    seg = YOLO(str(SEG_W))
    sr = seg.predict(img, conf=0.3, verbose=False, imgsz=1280, classes=[0])[0]
    mask = np.zeros((h, w), np.uint8)
    if sr.masks is not None:
        for m in sr.masks.data.cpu().numpy():
            mask |= (cv2.resize(m, (w, h)) > 0.5).astype(np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    soft = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.2)
    people_rgba = np.dstack([img, (np.clip(soft, 0, 1) * 255).astype(np.uint8)])
    cv2.imwrite(str(out / 'people.webp'), people_rgba, [cv2.IMWRITE_WEBP_QUALITY, 88])

    hole = cv2.dilate(mask, np.ones((15, 15), np.uint8)) * 255
    bg = cv2.inpaint(img, hole, 7, cv2.INPAINT_TELEA)
    alpha = ragged_mask(h, w, seed=args.seed)
    # never tear through a person: keep the fragment solid around every detection,
    # with a noisy (not rectangular) margin so the protection itself looks torn
    keep = cv2.dilate(mask, np.ones((91, 91), np.uint8)).astype(np.float32)
    keep = cv2.GaussianBlur(keep, (0, 0), 16)
    rng3 = np.random.default_rng(args.seed + 2)
    kn = cv2.GaussianBlur(cv2.resize(rng3.random((h // 20, w // 20)).astype(np.float32), (w, h)), (0, 0), 6)
    kn = (kn - kn.min()) / (kn.max() - kn.min() + 1e-6)
    keep = np.clip((keep - 0.5) * 3 + (kn - 0.5) * 1.2 + 0.5, 0, 1)
    keep = cv2.GaussianBlur(keep, (0, 0), 3)
    # ...but tear the image border too, so the fragment never ends on a straight edge
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    to_edge = np.minimum(np.minimum(xx, w - 1 - xx) / w, np.minimum(yy, h - 1 - yy) / h)
    rng2 = np.random.default_rng(args.seed + 1)
    bn = cv2.GaussianBlur(cv2.resize(rng2.random((h // 12, w // 12)).astype(np.float32), (w, h)), (0, 0), 3)
    bn = (bn - bn.min()) / (bn.max() - bn.min() + 1e-6)
    torn = np.clip(to_edge / 0.045 + (bn - 0.5) * 0.9, 0, 1)
    keep = np.clip(keep, 0, 1) * torn
    alpha = np.minimum(np.maximum(alpha, (keep * 255).astype(np.uint8)), (np.clip(to_edge / 0.02 + (bn - 0.5) * 0.6, 0, 1) * 255).astype(np.uint8))
    cv2.imwrite(str(out / 'chunk.webp'), np.dstack([bg, alpha]), [cv2.IMWRITE_WEBP_QUALITY, 88])

    # thumbnail-sized preview of the chunk for quick checks
    (out / 'track.json').write_text(json.dumps({
        'name': name, 'width': w, 'height': h, 'people': people,
    }, indent=1))
    print(f'{name}: {len(people)} people -> {out.relative_to(ROOT)}')
    for p in people:
        print(f"  #{p['id']} {p['label']:9s} conf={p['conf']} box={p['box']}")


if __name__ == '__main__':
    main()
