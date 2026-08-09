// Focused runtime corrections for OCR/PDF extraction defects that escaped the first cleanup pass.
// Keep these fixes explicit and conservative: only repair text when the intended wording is unambiguous.
(function () {
  'use strict';

  const data = window.QUIZ_DATA;
  if (!data || !Array.isArray(data.questions)) return;

  const byId = new Map(data.questions.map(q => [q.id, q]));

  function setOption(q, id, text) {
    if (!q || !Array.isArray(q.options)) return;
    const opt = q.options.find(o => o.id === id);
    if (opt) opt.text = text;
  }

  // De04 - câu gốc 15 - trang 28.
  // OCR read "vậng lý" and merged two different layer descriptions into one choice.
  // Restore the four OSI-layer functions as separate, grammatical choices.
  {
    const q = byId.get('De04-15-138');
    if (q) {
      q.question = 'Chức năng chính của tầng vật lý là gì?';
      setOption(q, 'a', 'Truyền tải các bit trên một kênh truyền vật lý');
      setOption(q, 'b', 'Truyền tải các gói tin (packet) qua một mạng hoặc một liên mạng');
      setOption(q, 'c', 'Truyền tải các khung (frame) trên một kênh truyền vật lý');
      setOption(q, 'd', 'Truyền tải các thông điệp (message) từ tiến trình đến tiến trình');
      q.correct_option_id = 'a';
      q.file_answer_option_id = 'a';
      q.verification = 'corrected';
      q.warning = null;
      q.explanation = 'Tầng vật lý (Physical layer) chịu trách nhiệm truyền chuỗi bit thô qua môi trường truyền vật lý. Gói tin thuộc tầng mạng, khung thuộc tầng liên kết dữ liệu, còn thông điệp giữa các tiến trình thuộc tầng vận chuyển.';
    }
  }

  // De04 - câu gốc 23 - trang 29.
  // The tail "4 2 ao" is OCR debris from the diagram. The original choices also lost Vietnamese diacritics.
  {
    const q = byId.get('De04-23-146');
    if (q) {
      q.question = 'Hãy cho biết tên gọi của hình trạng mạng (topology) sau là gì?';
      setOption(q, 'a', 'Star (sao)');
      setOption(q, 'b', 'Bus (tuyến tính)');
      setOption(q, 'c', 'Tree (cây)');
      setOption(q, 'd', 'Ring (vòng)');
      q.correct_option_id = 'd';
      q.file_answer_option_id = 'd';
      q.verification = q.image ? 'corrected' : 'warning';
      q.warning = q.image ? null : 'Câu hỏi phụ thuộc hình minh họa ở trang 29. Ký tự rác OCR đã được xóa; ảnh gốc cần được trích lại để người học tự nhận dạng topology.';
      q.explanation = 'Đáp án theo khóa của đề là Ring (vòng). Mạng vòng nối các nút thành một vòng khép kín; khi ảnh gốc được hiển thị, hãy kiểm tra đặc điểm này thay vì chỉ học thuộc đáp án.';
    }
  }

  // Safe typo cleanup for already-readable Vietnamese. Avoid guessing heavily damaged OCR strings here.
  const replacements = [
    [/vậng lý/g, 'vật lý'],
    [/liên mang/g, 'liên mạng'],
    [/tuyén tinh/g, 'tuyến tính'],
    [/Ring \(vong\)/g, 'Ring (vòng)'],
    [/Tree \(cay\)/g, 'Tree (cây)'],
    [/cloud \(dam may\)/g, 'Cloud (đám mây)']
  ];

  function safeClean(value) {
    if (typeof value !== 'string') return value;
    let out = value.normalize('NFC');
    for (const [pattern, replacement] of replacements) out = out.replace(pattern, replacement);
    return out.replace(/\s+\?/g, '?').replace(/[ \t]{2,}/g, ' ').trim();
  }

  for (const q of data.questions) {
    q.question = safeClean(q.question);
    if (Array.isArray(q.options)) {
      for (const opt of q.options) opt.text = safeClean(opt.text);
    }
    q.explanation = safeClean(q.explanation);
    if (typeof q.warning === 'string') q.warning = safeClean(q.warning);
  }
})();
