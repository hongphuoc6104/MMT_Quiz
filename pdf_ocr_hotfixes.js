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

  // Several PDF rows were extracted as: "choice 1 €. choice 2", while choice 2 also
  // appears again in another option without Vietnamese diacritics. Only split when the
  // duplicated right-hand text can be matched unambiguously, so legitimate euro symbols
  // or unrelated text are never changed.
  function comparisonKey(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  function repairMergedOptions(q) {
    if (!q || !Array.isArray(q.options)) return;
    for (const opt of q.options) {
      if (typeof opt.text !== 'string' || !opt.text.includes('€')) continue;
      const parts = opt.text.split(/\s*€\.?\s*/).map(s => s.trim()).filter(Boolean);
      if (parts.length !== 2) continue;

      const [left, right] = parts;
      const rightKey = comparisonKey(right);
      if (!rightKey) continue;

      const matches = q.options.filter(other => other !== opt && comparisonKey(other.text) === rightKey);
      if (matches.length !== 1) continue;

      opt.text = left;
      matches[0].text = right;
    }
  }

  for (const q of data.questions) repairMergedOptions(q);

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
  // The tail "4 2 ao" is OCR debris from the diagram. The choices also lost Vietnamese diacritics.
  // A clean vector reconstruction is attached so the learner can actually identify the topology.
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
      q.image = 'assets/crops/De04-23-146.svg';
      q.verification = 'corrected';
      q.warning = 'Hình minh họa này được phục dựng sạch để thay phần hình bị mất khi trích PDF; nội dung thể hiện đúng đặc trưng Ring topology và đáp án đã được đối chiếu với tài liệu nguồn.';
      q.explanation = 'Đáp án là Ring (vòng). Dấu hiệu nhận biết: mỗi nút nối với hai nút lân cận và toàn bộ các liên kết tạo thành một vòng khép kín. Star có một thiết bị trung tâm, Bus dùng một đường trục chung, còn Tree phân nhánh theo dạng cây.';
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
