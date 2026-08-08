from pathlib import Path
import json

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "crops"
OUT.mkdir(parents=True, exist_ok=True)

# Percent boxes measured from the actual 1190x1540 source-page PNGs.
# They intentionally target only the diagram/figure, never the following questions.
SPECS = {
    "De01-5-4":    {"page": 1,  "x": 5.0, "y": 72.8, "w": 26.5, "h": 12.5},
    "De01-50-47":  {"page": 10, "x": 5.7, "y": 7.2,  "w": 22.5, "h": 18.5},
    "De03-4-95":   {"page": 19, "x": 17.0,"y": 14.5, "w": 40.0, "h": 8.8},
    "De03-12-101": {"page": 21, "x": 5.0, "y": 32.8, "w": 19.5, "h": 14.5},
    "De04-5-198":  {"page": 49, "x": 7.0, "y": 53.0, "w": 66.0, "h": 25.5},
    "De04-4-228":  {"page": 56, "x": 6.8, "y": 25.8, "w": 61.5, "h": 23.0},
}


def crop_box(spec, width, height):
    x0 = round(spec["x"] / 100 * width)
    y0 = round(spec["y"] / 100 * height)
    x1 = round((spec["x"] + spec["w"]) / 100 * width)
    y1 = round((spec["y"] + spec["h"]) / 100 * height)
    return (x0, y0, x1, y1)


def trim_white(im, pad=8):
    a = np.asarray(im.convert("RGB"))
    ink = np.min(a, axis=2) < 248
    ys, xs = np.where(ink)
    if len(xs) == 0:
        return im, (0, 0, im.width, im.height)
    x0 = max(0, int(xs.min()) - pad)
    y0 = max(0, int(ys.min()) - pad)
    x1 = min(im.width, int(xs.max()) + 1 + pad)
    y1 = min(im.height, int(ys.max()) + 1 + pad)
    return im.crop((x0, y0, x1, y1)), (x0, y0, x1, y1)


def preview(im, cols=78):
    # Density preview: readable in a text-only GitHub tool response.
    gray = np.asarray(im.convert("L"))
    ratio = im.height / max(1, im.width)
    rows = max(8, round(cols * ratio * 0.45))
    lines = []
    chars = " .:-=+*#%@"
    for gy in range(rows):
        y0 = gy * gray.shape[0] // rows
        y1 = max(y0 + 1, (gy + 1) * gray.shape[0] // rows)
        row = []
        for gx in range(cols):
            x0 = gx * gray.shape[1] // cols
            x1 = max(x0 + 1, (gx + 1) * gray.shape[1] // cols)
            darkness = 1.0 - float(gray[y0:y1, x0:x1].mean()) / 255.0
            if darkness < 0.015:
                row.append(" ")
            else:
                row.append(chars[min(len(chars)-1, max(1, round(darkness * (len(chars)-1) * 2.0)))])
        lines.append("".join(row).rstrip())
    return lines


report = {}
report_lines = []
for qid, spec in SPECS.items():
    src = ROOT / "assets" / f"source-page-{spec['page']:02d}.png"
    im = Image.open(src).convert("RGB")
    box = crop_box(spec, im.width, im.height)
    candidate = im.crop(box)
    cropped, local_trim = trim_white(candidate, pad=8)

    out_path = OUT / f"{qid}.png"
    cropped.save(out_path, format="PNG", optimize=True)

    arr = np.asarray(cropped)
    ink = np.min(arr, axis=2) < 242
    row_density = ink.mean(axis=1)
    edge = max(1, round(cropped.height * 0.06))
    info = {
        "page": spec["page"],
        "source_size": [im.width, im.height],
        "source_box_px": list(box),
        "source_box_pct": [spec["x"], spec["y"], spec["w"], spec["h"]],
        "trim_inside_candidate_px": list(local_trim),
        "output_size": [cropped.width, cropped.height],
        "top_edge_ink": round(float(row_density[:edge].mean()), 5),
        "bottom_edge_ink": round(float(row_density[-edge:].mean()), 5),
        "overall_ink": round(float(ink.mean()), 5),
        "file": str(out_path.relative_to(ROOT)).replace('\\', '/'),
    }
    report[qid] = info

    report_lines.append(f"\n===== {qid} | page {spec['page']:02d} | {cropped.width}x{cropped.height} =====")
    report_lines.append("source box %: " + json.dumps(info["source_box_pct"]))
    report_lines.append(f"ink top={info['top_edge_ink']} bottom={info['bottom_edge_ink']} overall={info['overall_ink']}")
    report_lines.extend(preview(cropped))

(ROOT / "question_crop_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT / "question_crop_report.txt").write_text("\n".join(report_lines) + "\n", encoding="utf-8")
print("Generated", len(SPECS), "dedicated crop images")
