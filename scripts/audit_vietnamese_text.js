const fs = require('fs');
const vm = require('vm');

const box = { window: {}, console };
box.window.window = box.window;
vm.createContext(box);

const runtimeFiles = [
  'questions.js',
  'question_structure_fixes.js',
  'data_corrections.js',
  'pdf_ocr_hotfixes.js'
];
for (const file of runtimeFiles) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), box, { filename: file });
}

const data = box.window.QUIZ_DATA;
if (!data || !Array.isArray(data.questions)) throw new Error('QUIZ_DATA unavailable');
if (data.questions.length !== 314) throw new Error(`Expected 314 questions, got ${data.questions.length}`);

// These are intentionally conservative indicators. They do not change data; they only
// surface text for human review. English networking terms are not automatically errors.
const asciiVietnameseWords = new RegExp(
  String.raw`\b(?:khong|dung|mot|hai|ba|bon|nam|sau|bay|tam|chin|muoi|cua|mang|truyen|du|lieu|dieu|khien|tac|nghen|dia|chi|dich|vu|thanh|phan|chuyen|mach|su|dung|vi|tri|nhan|dang|tin|hieu|tuong|tu|mien|tram|tra|gui|goi|khung|kenh|vat|ly|lien|ket|dien|thoai|duong|cuc|bo|giam|phi|phat|bieu|can|co|che|cac|qua|tren|duoi|vao|ra|theo|thoi|gian|tan|so|may|chu|khach|hang|thong|diep|tien|trinh)\b`,
  'i'
);

const suspiciousRules = [
  ['ascii-vietnamese', s => asciiVietnameseWords.test(s)],
  ['fractured-ocr', s => /\b(?:cu\s+a|mie\s+n|tra\s+m|ca\s+c|tie\s+n|thong\s+die\s+p|truye\s+n|du\s+lie\s+u)\b/i.test(s)],
  ['letter-digit-ocr', s => /\b\p{L}+[0-9]+\p{L}*\b/u.test(s) && !/\b(?:IPv[46]|802\.\d|10BASE|100BASE|1000BASE|RJ\d+|CAT\d+)\b/i.test(s)],
  ['spacing-before-punctuation', s => /\s+[?,.;:]/.test(s)],
  ['double-space', s => /[ \t]{2,}/.test(s)],
  ['replacement-glyph', s => /[€�]/.test(s)],
  ['known-ocr-shape', s => /\b(?:s6|ty|thé|dé|kiết|chỉ phí|vậng|vận lý|tuyén|dam may)\b/i.test(s)]
];

function inspect(q, field, value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const rules = suspiciousRules.filter(([, test]) => test(value)).map(([name]) => name);
  if (!rules.length) return null;
  return {
    id: q.id,
    set: q.set,
    source_number: q.source_number,
    source_page: q.source_page,
    field,
    rules,
    text: value
  };
}

const findings = [];
for (const q of data.questions) {
  for (const field of ['question', 'chapter', 'explanation', 'warning']) {
    const hit = inspect(q, field, q[field]);
    if (hit) findings.push(hit);
  }
  for (const opt of q.options || []) {
    const hit = inspect(q, `option.${opt.id}`, opt.text);
    if (hit) findings.push(hit);
  }
}

const uniqueQuestions = new Set(findings.map(x => x.id));
const report = {
  audited_question_count: data.questions.length,
  suspicious_question_count: uniqueQuestions.size,
  finding_count: findings.length,
  runtime_files: runtimeFiles,
  findings
};
fs.writeFileSync('vietnamese_text_audit.json', JSON.stringify(report, null, 2) + '\n');

const lines = [
  `Audited questions: ${data.questions.length}`,
  `Questions with suspicious text: ${uniqueQuestions.size}`,
  `Findings: ${findings.length}`,
  ''
];
for (const x of findings) {
  lines.push(`===== ${x.id} | ${x.set} câu ${x.source_number} | trang ${x.source_page} | ${x.field} | ${x.rules.join(',')} =====`);
  lines.push(x.text);
  lines.push('');
}
fs.writeFileSync('vietnamese_text_audit.txt', lines.join('\n'));
console.log(lines.slice(0, 3).join('\n'));
