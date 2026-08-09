// Final Vietnamese OCR/spelling cleanup pass.
// Runs after data_corrections.js and before app.js.
(function () {
  'use strict';
  const data = window.QUIZ_DATA;
  if (!data || !Array.isArray(data.questions)) return;

  const fixes = [
    [/tầng vận lý/gi, 'tầng vật lý'],
    [/\btruyen ta i ca c thong die p \(message\) tu tie n trinh de n tie n trinh\b/gi, 'Truyền tải các thông điệp (message) từ tiến trình đến tiến trình'],
    [/\btruyen ta i ca c goi tin \(packet\) qua mot mang hoac mot lien mang\b/gi, 'Truyền tải các gói tin (packet) qua một mạng hoặc một liên mạng'],
    [/\btruyen ta i ca c goi tin \(packet\) qua mot lien mang\b/gi, 'Truyền tải các gói tin (packet) qua một liên mạng'],
    [/\btruyen ta i ca c khung \(frame\) tren mot kenh truyen vat ly\b/gi, 'Truyền tải các khung (frame) trên một kênh truyền vật lý'],
    [/\btruyen ta i ca c bit tren mot kenh truyen vat ly\b/gi, 'Truyền tải các bit trên một kênh truyền vật lý'],
    [/\bđơn vi\b/gi, 'đơn vị'],
    [/\btang cao hơn\b/gi, 'tầng cao hơn'],
    [/\btai một thời điểm\b/gi, 'tại một thời điểm'],
    [/\bgởi\b/gi, 'gửi'],
    [/\bDich vu\b/gi, 'Dịch vụ'],
    [/\bThanh phần\b/gi, 'Thành phần'],
    [/\bchuyển mach\b/gi, 'chuyển mạch'],
    [/\bsử dung\b/gi, 'sử dụng'],
    [/\bvi trí\b/gi, 'vị trí'],
    [/\bđịa chi\b/gi, 'địa chỉ'],
    [/\bnhận dang\b/gi, 'nhận dạng'],
    [/\bCó thé\b/g, 'Có thể'],
    [/\bMệnh dé\b/g, 'Mệnh đề'],
    [/\bmệnh dé\b/g, 'mệnh đề'],
    [/\bliên kiết\b/gi, 'liên kết'],
    [/\bGiảm chỉ phí\b/g, 'Giảm chi phí'],
    [/\bTin hiệu tuần ty \(analog\)/g, 'Tín hiệu tương tự (analog)'],
    [/\bTín hiệu s6 \(digital\)/g, 'Tín hiệu số (digital)'],
    [/\bname Server cu a mie n\b/gi, 'Name Server của miền'],
    [/\bmail Server cu a mie n\b/gi, 'Mail Server của miền'],
    [/\bmang cuc bo\b/gi, 'mạng cục bộ'],
    [/\bIP dich\b/g, 'IP đích'],
    [/\bDia chi MAC\b/gi, 'Địa chỉ MAC'],
    [/\bDuong truyén ADSL\b/gi, 'Đường truyền ADSL'],
    [/\bDuong dial qua mang dién thoai\b/gi, 'Đường dial qua mạng điện thoại'],
    [/\s+\?/g, '?'],
    [/\s+,/g, ','],
    [/[ \t]{2,}/g, ' ']
  ];

  function clean(value) {
    if (typeof value !== 'string') return value;
    let s = value.normalize('NFC');
    for (const [pattern, replacement] of fixes) s = s.replace(pattern, replacement);
    // OCR sometimes injected a currency glyph between two otherwise complete clauses.
    s = s.replace(/\s*€\.?\s*/g, '. ');
    return s.trim();
  }

  for (const q of data.questions) {
    q.question = clean(q.question);
    q.chapter = clean(q.chapter);
    q.explanation = clean(q.explanation);
    q.warning = clean(q.warning);
    if (Array.isArray(q.options)) {
      for (const opt of q.options) opt.text = clean(opt.text);
    }
  }

  // PDF De04, câu gốc 15, trang 28: repair the known OCR-damaged wording explicitly.
  const q = data.questions.find(item => item.set === 'De04' && item.source_number === 15 && item.source_page === 28);
  if (q) {
    q.question = 'Chức năng chính của tầng vật lý là gì?';
    const canonical = {
      a: 'Truyền tải các thông điệp (message) từ tiến trình đến tiến trình',
      b: 'Truyền tải các gói tin (packet) qua một mạng hoặc một liên mạng',
      c: 'Truyền tải các khung (frame) trên một kênh truyền vật lý',
      d: 'Truyền tải các bit trên một kênh truyền vật lý'
    };
    if (Array.isArray(q.options)) {
      for (const opt of q.options) if (canonical[opt.id]) opt.text = canonical[opt.id];
    }
    q.correct_option_id = 'd';
  }
})();
