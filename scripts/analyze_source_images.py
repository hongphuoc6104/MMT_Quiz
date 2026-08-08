from pathlib import Path
from collections import deque
import json
import math

import numpy as np
from PIL import Image

PAGES = [1, 10, 19, 21, 49, 56]
ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / "source_image_analysis.json"
OUT_TXT = ROOT / "source_image_analysis.txt"


def intervals(values, threshold, max_gap=0, min_len=1):
    active = [i for i, v in enumerate(values) if v >= threshold]
    if not active:
        return []
    groups = []
    start = prev = active[0]
    for i in active[1:]:
        if i - prev <= max_gap + 1:
            prev = i
            continue
        if prev - start + 1 >= min_len:
            groups.append((start, prev + 1))
        start = prev = i
    if prev - start + 1 >= min_len:
        groups.append((start, prev + 1))
    return groups


def components(mask, min_pixels=8):
    h, w = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    out = []
    for y in range(h):
        for x in range(w):
            if not mask[y, x] or seen[y, x]:
                continue
            q = deque([(x, y)])
            seen[y, x] = True
            xs, ys = [], []
            while q:
                cx, cy = q.popleft()
                xs.append(cx); ys.append(cy)
                for nx, ny in ((cx-1,cy),(cx+1,cy),(cx,cy-1),(cx,cy+1),(cx-1,cy-1),(cx+1,cy-1),(cx-1,cy+1),(cx+1,cy+1)):
                    if 0 <= nx < w and 0 <= ny < h and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        q.append((nx, ny))
            if len(xs) >= min_pixels:
                out.append({
                    "x": min(xs), "y": min(ys),
                    "w": max(xs)-min(xs)+1, "h": max(ys)-min(ys)+1,
                    "pixels": len(xs)
                })
    out.sort(key=lambda c: c["pixels"], reverse=True)
    return out


def ascii_map(ink, color, cols=48, rows=64):
    h, w = ink.shape
    lines = []
    chars = " .:-=+*#%@"
    for gy in range(rows):
        y0 = gy * h // rows
        y1 = max(y0 + 1, (gy + 1) * h // rows)
        row = []
        for gx in range(cols):
            x0 = gx * w // cols
            x1 = max(x0 + 1, (gx + 1) * w // cols)
            d = float(ink[y0:y1, x0:x1].mean())
            cd = float(color[y0:y1, x0:x1].mean())
            if cd > 0.04:
                row.append("C")
            elif d < 0.01:
                row.append(" ")
            else:
                idx = min(len(chars)-1, max(1, int(round(d * 18))))
                row.append(chars[idx])
        lines.append("".join(row).rstrip())
    return lines


def pct_box(box, w, h, scale=1):
    return {
        "x_pct": round(box["x"] * scale / w * 100, 2),
        "y_pct": round(box["y"] * scale / h * 100, 2),
        "w_pct": round(box["w"] * scale / w * 100, 2),
        "h_pct": round(box["h"] * scale / h * 100, 2),
        "pixels": box["pixels"],
    }


report = {}
text = []
for page in PAGES:
    path = ROOT / "assets" / f"source-page-{page:02d}.png"
    im = Image.open(path).convert("RGB")
    a = np.asarray(im)
    h, w, _ = a.shape
    ink = np.min(a, axis=2) < 242
    chroma = np.max(a, axis=2) - np.min(a, axis=2)
    color = (chroma > 24) & (np.min(a, axis=2) < 235)

    row_ink = ink.mean(axis=1)
    row_color = color.mean(axis=1)
    col_ink = ink.mean(axis=0)

    # Work on a 1/4 image and dilate color slightly so one illustration becomes one region.
    small = im.resize((max(1, w // 4), max(1, h // 4)), Image.Resampling.BILINEAR)
    sa = np.asarray(small)
    sm_chroma = np.max(sa, axis=2) - np.min(sa, axis=2)
    sm_color = (sm_chroma > 22) & (np.min(sa, axis=2) < 238)
    for _ in range(3):
        p = np.pad(sm_color, 1, constant_values=False)
        sm_color = (
            p[1:-1,1:-1] | p[:-2,1:-1] | p[2:,1:-1] |
            p[1:-1,:-2] | p[1:-1,2:] | p[:-2,:-2] |
            p[:-2,2:] | p[2:,:-2] | p[2:,2:]
        )
    comps = components(sm_color, min_pixels=18)[:12]

    info = {
        "width": w,
        "height": h,
        "ink_row_bands_pct": [
            [round(y0/h*100,2), round(y1/h*100,2)]
            for y0,y1 in intervals(row_ink, 0.004, max_gap=7, min_len=2)
        ],
        "color_row_bands_pct": [
            [round(y0/h*100,2), round(y1/h*100,2)]
            for y0,y1 in intervals(row_color, 0.001, max_gap=10, min_len=2)
        ],
        "color_components_pct": [pct_box(c, w, h, scale=4) for c in comps],
        "peak_ink_rows_pct": [round(int(i)/h*100,2) for i in np.argsort(row_ink)[-12:][::-1]],
    }
    report[str(page)] = info

    text.append(f"\n===== PAGE {page:02d}  {w}x{h} =====")
    text.append("Ink bands (% y): " + json.dumps(info["ink_row_bands_pct"], ensure_ascii=False))
    text.append("Color bands (% y): " + json.dumps(info["color_row_bands_pct"], ensure_ascii=False))
    text.append("Largest color components (%): " + json.dumps(info["color_components_pct"], ensure_ascii=False))
    text.append("ASCII map: C = colored illustration; symbols = dark ink density")
    text.extend(ascii_map(ink, color))

OUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
OUT_TXT.write_text("\n".join(text) + "\n", encoding="utf-8")
print(f"Wrote {OUT_JSON.name} and {OUT_TXT.name}")
