'use strict';

const fs = require('fs');
const vm = require('vm');

const manualFiles = [
  'manual_solutions/de01_a.js', 'manual_solutions/de01_b.js', 'manual_solutions/de01_ver2.js',
  'manual_solutions/de02_a.js', 'manual_solutions/de02_b.js',
  'manual_solutions/de03_a.js', 'manual_solutions/de03_b.js',
  'manual_solutions/de04_ch1_a.js', 'manual_solutions/de04_ch1_b.js', 'manual_solutions/de04_ch1_c.js',
  'manual_solutions/de04_ch3_a.js', 'manual_solutions/de04_ch3_b.js', 'manual_solutions/de04_ch4.js',
  'manual_solutions/de04_ch5_a.js', 'manual_solutions/de04_ch5_b.js',
  'manual_solutions/de04_ch6_a.js', 'manual_solutions/de04_ch6_b.js',
  'manual_solutions/de04_ch7_a.js', 'manual_solutions/de04_ch7_b.js',
  'manual_solutions/de04_ch8_a.js', 'manual_solutions/de04_ch8_b.js',
  'manual_solutions/de07.js', 'manual_solutions/de08.js'
];

const runtimeFiles = [
  'questions.js',
  'question_structure_fixes.js',
  ...manualFiles,
  'solution_consistency_fixes.js',
  'data_corrections.js',
  'question_consistency_fixes.js',
  'pdf_ocr_hotfixes.js',
  'vietnamese_text_cleanup_20260809.js',
  'vietnamese_text_cleanup_final_20260809.js',
  'source_preserving_ocr_fixes_20260809.js',
  'manual_to_static.js'
];

const box = { window: {}, console };
box.window.window = box.window;
vm.createContext(box);

for (const file of runtimeFiles) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), box, { filename: file });
}

const data = box.window.QUIZ_DATA;
const solutions = box.window.STATIC_SOLUTION_DATA?.solutions || {};
if (!data || !Array.isArray(data.questions)) throw new Error('QUIZ_DATA unavailable');
if (data.questions.length !== 314) throw new Error(`Expected 314 questions, got ${data.questions.length}`);

const mode = process.argv[2] || 'questions';
const start = Math.max(1, Number.parseInt(process.argv[3] || '1', 10));
const end = Math.min(data.questions.length, Number.parseInt(process.argv[4] || String(data.questions.length), 10));
const selected = data.questions.slice(start - 1, end);

function printQuestion(q, index) {
  const correctIds = new Set(
    (solutions[q.id]?.options || []).filter(option => option.correct).map(option => option.id)
  );
  console.log(`===== ${index}. ${q.id} | ${q.set} câu ${q.source_number} | trang ${q.source_page} =====`);
  console.log(`Q: ${q.question}`);
  for (const option of q.options || []) {
    const marker = correctIds.has(option.id) || option.id === q.correct_option_id ? '*' : ' ';
    console.log(`${marker}${option.id.toUpperCase()}: ${option.text}`);
  }
  if (q.warning) console.log(`WARNING: ${q.warning}`);
  if (q.explanation) console.log(`EXPLANATION: ${q.explanation}`);
  console.log('');
}

function printSolution(q, index) {
  const solution = solutions[q.id];
  console.log(`===== ${index}. ${q.id} | ${q.set} câu ${q.source_number} | trang ${q.source_page} =====`);
  console.log(`Q: ${q.question}`);
  console.log(`KNOWLEDGE: ${solution?.knowledge || ''}`);
  console.log(`REASONING: ${solution?.reasoning || ''}`);
  for (const option of solution?.options || []) {
    console.log(`${option.id.toUpperCase()} [${option.text}] WHY: ${option.why}`);
    console.log(`${option.id.toUpperCase()} WHEN: ${option.when}`);
  }
  if (solution?.calculation) console.log(`CALCULATION: ${JSON.stringify(solution.calculation)}`);
  for (const item of solution?.commonMistakes || []) console.log(`MISTAKE: ${item}`);
  console.log(`SUMMARY: ${solution?.summary || ''}`);
  console.log('');
}

if (mode === 'json') {
  console.log(JSON.stringify({
    runtimeFiles,
    questionCount: data.questions.length,
    questions: selected.map((q, offset) => ({
      index: start + offset,
      ...q,
      renderedSolution: solutions[q.id]
    }))
  }, null, 2));
} else if (mode === 'solutions') {
  selected.forEach((q, offset) => printSolution(q, start + offset));
} else if (mode === 'questions') {
  selected.forEach((q, offset) => printQuestion(q, start + offset));
} else {
  throw new Error(`Unknown mode: ${mode}`);
}
