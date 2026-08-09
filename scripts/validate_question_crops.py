from pathlib import Path
import json
import re

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REPORT = json.loads((ROOT / 'question_crop_report.json').read_text(encoding='utf-8'))

EXPECTED = {
    'De01-5-4',
    'De01-50-47',
    'De03-4-95',
    'De03-12-101',
    'De04-5-198',
    'De04-4-228',
}

if set(REPORT) != EXPECTED:
    raise SystemExit(f'Crop report mismatch: expected {sorted(EXPECTED)}, got {sorted(REPORT)}')

for qid in sorted(EXPECTED):
    info = REPORT[qid]
    path = ROOT / info['file']
    if not path.exists() or path.stat().st_size < 1000:
        raise SystemExit(f'Missing/empty dedicated crop: {qid}: {path}')

    with Image.open(path) as im:
        w, h = im.size
    if [w, h] != info['output_size']:
        raise SystemExit(f'Crop dimensions disagree with report: {qid}')
    if w < 80 or h < 50:
        raise SystemExit(f'Crop suspiciously small: {qid}: {w}x{h}')

    sw, sh = info['source_size']
    x0, y0, x1, y1 = info['source_box_px']
    if not (0 <= x0 < x1 <= sw and 0 <= y0 < y1 <= sh):
        raise SystemExit(f'Crop escapes source page: {qid}: {info["source_box_px"]}')
    if (x1 - x0) >= sw * .9 or (y1 - y0) >= sh * .9:
        raise SystemExit(f'Crop is effectively a full source page: {qid}')

# Regression test for the exact issue reported by the user: q50's required TCP
# diagram is near the top of page 10; De01-ver2 and following questions begin
# below it. The dedicated crop must end before 26% of the source page height.
q50 = REPORT['De01-50-47']
q50_y_end_pct = (q50['source_box_px'][3] / q50['source_size'][1]) * 100
if q50_y_end_pct > 26.0:
    raise SystemExit(f'De01-50-47 crop extends too far down page 10: {q50_y_end_pct:.2f}%')
if q50['output_size'][1] > 320:
    raise SystemExit(f'De01-50-47 output is too tall: {q50["output_size"]}')

# Regression for q5: all three arrows of the TCP handshake must be present.
# The old crop ended at 85.3% of page 1 and had height 193, cutting off ACK/A2.
q5 = REPORT['De01-5-4']
q5_y_end_pct = (q5['source_box_px'][3] / q5['source_size'][1]) * 100
if q5_y_end_pct < 90.0 or q5['output_size'][1] < 280:
    raise SystemExit(
        f'De01-5-4 crop may omit final ACK/A2: end={q5_y_end_pct:.2f}%, '
        f'output={q5["output_size"]}'
    )

# HDLC was the tightest crop. It must have clean blank margins after trimming;
# otherwise text from the question above/below is probably leaking into it.
hdlc = REPORT['De03-4-95']
if hdlc['top_edge_ink'] > .01 or hdlc['bottom_edge_ink'] > .01:
    raise SystemExit(f'HDLC crop touches surrounding content: top={hdlc["top_edge_ink"]}, bottom={hdlc["bottom_edge_ink"]}')

image_js = (ROOT / 'image-crops.js').read_text(encoding='utf-8')
for qid in EXPECTED:
    expected_path = f'assets/crops/{qid}.png'
    if expected_path not in image_js:
        raise SystemExit(f'Dedicated image is not wired into image-crops.js: {qid}')
if 'DIAGRAM_CROPS' in image_js or '10000 / crop.w' in image_js:
    raise SystemExit('Legacy full-page CSS/JS crop mechanism has returned')
if "link.href = cropSrc" not in image_js:
    raise SystemExit('Clicking the question figure no longer targets the isolated crop')
if 'Đối chiếu toàn trang gốc' not in image_js:
    raise SystemExit('Explicit full-page verification link is missing')

bootstrap = (ROOT / 'manual_bootstrap.js').read_text(encoding='utf-8')
if 'image-crops.js?v=20260809-figure-2' not in bootstrap:
    raise SystemExit('Bootstrap does not force-load the dedicated image renderer')
ux_script = re.search(r"'ux\.js(?:\?[^']*)?'", bootstrap)
if not ux_script:
    raise SystemExit('Bootstrap does not load ux.js')
if bootstrap.index('image-crops.js') > ux_script.start():
    raise SystemExit('Dedicated image renderer must load before UX/lightbox binding')

index = (ROOT / 'index.html').read_text(encoding='utf-8')
if 'image-crops.css?v=20260808-dedicated-1' not in index:
    raise SystemExit('Dedicated image CSS cache-bust link is missing')
if 'manual_bootstrap.js?v=20260810-teaching-1' not in index:
    raise SystemExit('Bootstrap cache-bust link is missing')

print('Dedicated question-image validation passed for 6 figure-dependent questions.')
print(f'De01-5-4 ends at {q5_y_end_pct:.2f}% of page 1 and is {q5["output_size"][0]}x{q5["output_size"][1]}.')
print(f'De01-50-47 ends at {q50_y_end_pct:.2f}% of page 10 and is {q50["output_size"][0]}x{q50["output_size"][1]}.')
print(f'De03-4-95 clean margins: top={hdlc["top_edge_ink"]}, bottom={hdlc["bottom_edge_ink"]}.')
