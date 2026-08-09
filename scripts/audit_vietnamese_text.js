const fs = require('fs');
const vm = require('vm');

const box = { window: {}, console };
box.window.window = box.window;
vm.createContext(box);

const runtimeFiles = [
  'questions.js',
  'question_structure_fixes.js',
  'data_corrections.js',
  'pdf_ocr_hotfixes.js',
  'vietnamese_text_cleanup_20260809.js',
  'vietnamese_text_cleanup_final_20260809.js'
];
for (const file of runtimeFiles) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), box, { filename: file });
}

const data = box.window.QUIZ_DATA;
if (!data || !Array.isArray(data.questions)) throw new Error('QUIZ_DATA unavailable');
if (data.questions.length !== 314) throw new Error(`Expected 314 questions, got ${data.questions.length}`);

const highConfidenceAsciiTokens = new Set([
  'khong','mot','bon','cua','truyen','lieu','dieu','khien','nghen','dia','dich','phan','chuyen','mach',
  'mien','tram','gui','goi','kenh','vat','lien','ket','dien','thoai','duong','cuc','giam','phat','bieu',
  'tren','duoi','vao','thoi','tan','may','khach','thong','diep','tien','trinh','tuyen','tinh','dam'
]);

const explicitPatterns = [
  ['fractured-ocr', /(?:cu\s+a|mie\s+n|tra\s+m|ca\s+c|tie\s+n|thong\s+die\s+p|truye\s+n|du\s+lie\s+u)/i],
  ['known-missing-diacritics', /(?:tac nghen|dieu khien|du lieu|dia chi|dich vu|chuyen mach|su dung|vi tri|nhan dang|tin hieu|vat ly|lien ket|dien thoai|duong truyen|mang cuc bo|khong can co che|bang phuong phap)/i],
  ['known-ocr-shape', /(?:Tin hiệu tuần ty|Tín hiệu s6|Có thé|Mệnh dé|mệnh dé|liên kiết|Giảm chỉ phí|vậng lý|vận lý|tuyén tinh|dam may)/i],
  // Periods are intentionally excluded because ellipses and Morse notation are valid study content.
  ['spacing-before-punctuation', /\s+[?,;:]/],
  ['double-space', /[ \t]{2,}/],
  ['replacement-glyph', /[€�]/]
];

function asciiMissingAccentTokens(value) {
  const tokens = String(value || '').match(/\p{L}+/gu) || [];
  return [...new Set(tokens
    .filter(t => /^[A-Za-z]+$/.test(t))
    .map(t => t.toLowerCase())
    .filter(t => highConfidenceAsciiTokens.has(t)))];
}

function inspect(q, field, value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const rules = [];
  const tokens = asciiMissingAccentTokens(value);
  if (tokens.length) rules.push(`ascii-token:${tokens.join('|')}`);
  for (const [name, pattern] of explicitPatterns) if (pattern.test(value)) rules.push(name);
  if (!rules.length) return null;
  return { id:q.id, set:q.set, source_number:q.source_number, source_page:q.source_page, field, rules, text:value };
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

const focusIds = ['De04-5-198', 'De02-20-63', 'De04-7-115'];
const focus = Object.fromEntries(focusIds.map(id => {
  const q = data.questions.find(item => item.id === id);
  return [id, q ? {
    question:q.question,
    options:q.options,
    correct_option_id:q.correct_option_id,
    file_answer_option_id:q.file_answer_option_id,
    explanation:q.explanation,
    warning:q.warning
  } : null];
}));

const uniqueQuestions = new Set(findings.map(x => x.id));
const report = {
  audited_question_count: data.questions.length,
  suspicious_question_count: uniqueQuestions.size,
  finding_count: findings.length,
  runtime_files: runtimeFiles,
  findings,
  focus
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
for (const id of focusIds) {
  const q = focus[id];
  lines.push(`===== FOCUS ${id} =====`);
  lines.push(q ? JSON.stringify(q, null, 2) : 'NOT FOUND');
  lines.push('');
}
fs.writeFileSync('vietnamese_text_audit.txt', lines.join('\n'));
console.log(lines.slice(0, 3).join('\n'));
