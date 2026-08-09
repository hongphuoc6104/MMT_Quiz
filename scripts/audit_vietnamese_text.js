'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');

const box={window:{},console};
box.window.window=box.window;
vm.createContext(box);
function load(file){vm.runInContext(fs.readFileSync(file,'utf8'),box,{filename:file});}

const manualFiles=fs.readdirSync('manual_solutions')
  .filter(name=>name.endsWith('.js'))
  .sort()
  .map(name=>path.join('manual_solutions',name));
const runtimeFiles=[
  'questions.js','question_structure_fixes.js',...manualFiles,
  'solution_consistency_fixes.js','data_corrections.js','question_consistency_fixes.js',
  'pdf_ocr_hotfixes.js','vietnamese_text_cleanup_20260809.js',
  'vietnamese_text_cleanup_final_20260809.js','source_preserving_ocr_fixes_20260809.js',
  'manual_to_static.js'
];
for(const file of runtimeFiles)load(file);

const data=box.window.QUIZ_DATA;
const solutions=box.window.STATIC_SOLUTION_DATA?.solutions||{};
if(!data||!Array.isArray(data.questions))throw new Error('QUIZ_DATA unavailable');
if(data.questions.length!==314)throw new Error(`Expected 314 questions, got ${data.questions.length}`);

const highConfidenceAsciiTokens=new Set([
  'khong','mot','bon','cua','truyen','lieu','dieu','khien','nghen','dia','dich','phan','chuyen',
  'mien','tram','gui','goi','kenh','vat','lien','ket','dien','thoai','duong','cuc','giam','phat',
  'bieu','tren','duoi','vao','thoi','tan','may','khach','thong','diep','tien','trinh','tuyen','dam'
  ,'chon','cau','chan','ding','hon','va','can','tat','cum','bang','nang','tang','la','ma'
]);

const patterns=[
  ['high','replacement-glyph',/[€¥�]/],
  ['high','extraction-debris',/(?:GTP\d+|Hình\s+đâu|Tự\s+luận|-{10,}|\b(?:Broadcasrt|RECIEVE|COMA|EDBCIC|MINE|ASCH|Liunx|FPTS)\b)/i],
  ['high','fractured-ocr',/(?:thong\s+die\s+p|truye\s+n|du\s+lie\s+u|cho\s+n\s+duong|be\s+n\s+nhan)/i],
  ['high','known-missing-diacritics',/(?:tac nghen|dieu khien|du lieu|dia chi|dich vu|chuyen mach|su dung|vi tri|nhan dang|tin hieu|vat ly|lien ket|dien thoai|duong truyen|mang cuc bo|bang phuong phap)/i],
  ['high','known-ocr-shape',/(?:Tin hiệu tuần ty|Tín hiệu s6|Có thé|không thé|điện thé|thé hiện|Mệnh dé|mệnh dé|liên kiết|Giảm chỉ phí|vậng lý|tuyén tinh|(?<!\p{L})d[éể](?!\p{L})|để dàng|dấy byte|day byte|phận đoạn|tối da|thu điện tử|dòng luồng)/iu],
  ['high','source-page-fragment',/(?:^|\s)[pP]\d{2,3}(?=\s|$|[.;,])/],
  ['high','broken-choice-marker',/(?:^|\s)[€¥]\.|\bCau\s+\d+/i],
  ['medium','spacing-before-punctuation',/\s+[?,;:]/],
  ['medium','double-space',/[ \t]{2,}/],
  ['medium','double-final-period',/(?<!\.)\.{2}(?!\.)\s*$/]
];

const examOnlyPatterns=[
  ['high','exam-ocr-token',/(?<!\p{L})(?:chon|cau|chan|ding|hon|va|can|tat|cum|bang)(?!\p{L})/iu],
  ['high','exam-ocr-context',/(?:La\s+địa\s+chỉ|Chức\s+nang|Tang\s+TCP|người\s+dung|mạng\s+ma\s+ở|Brigde|Server!|cấp\s+mạng\s+thuộc\s+về\s+tầng|đường\s+di(?!\p{L})|gián\s+địa\s+chỉ|Tín\s+hiệu\s+tuần\s+tự\s+là)/iu],
  ['high','editorial-or-answer-debris',/(?:Có\s+thể\s+vào\s+câu|thiếu\s+đề|thiếu\s+dữ\s+kiện|PDF\s+nguồn|Giáo\s+trình(?:\s+trang\s+\d+)?|Hình\s+đâu|aA\s*$|\?\s*(?:->|→|\d+[\d.*^ =~-]*=))/i],
  ['high','broken-url-spacing',/https:\s+\/\//i]
];

function asciiMissingAccentTokens(value){
  const text=String(value||'');
  // Only inspect exam text that is otherwise Vietnamese; this avoids treating
  // ordinary English prose or protocol names as missing-diacritic Vietnamese.
  if(!/[à-ỹđ]/iu.test(text))return [];
  const tokens=text.match(/\p{L}+/gu)||[];
  return [...new Set(tokens
    .filter(token=>/^[A-Za-z]+$/.test(token))
    .map(token=>token.toLowerCase())
    .filter(token=>highConfidenceAsciiTokens.has(token)))];
}

const findings=[];
function inspect(id,field,value,scope){
  if(typeof value!=='string'||!value.trim())return;
  if(scope.startsWith('exam')){
    const tokens=asciiMissingAccentTokens(value);
    if(tokens.length)findings.push({severity:'high',id,field,rule:`ascii-token:${tokens.join('|')}`,text:value});
  }
  for(const [severity,rule,re] of patterns){
    re.lastIndex=0;
    if(re.test(value))findings.push({severity,id,field,rule,text:value});
  }
  if(scope==='exam-question'||scope==='exam-option')for(const [severity,rule,re] of examOnlyPatterns){
    re.lastIndex=0;
    if(re.test(value))findings.push({severity,id,field,rule,text:value});
  }
  if(scope==='exam-option' && value.length>220){
    findings.push({severity:'medium',id,field,rule:'very-long-option-review',text:value});
  }
}

function walkSolution(id,value,field){
  if(typeof value==='string'){inspect(id,field,value,'solution');return;}
  if(Array.isArray(value)){value.forEach((item,index)=>walkSolution(id,item,`${field}[${index}]`));return;}
  if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))walkSolution(id,item,`${field}.${key}`);
}

for(const q of data.questions){
  inspect(q.id,'question',q.question,'exam-question');
  inspect(q.id,'chapter',q.chapter,'exam-meta');
  inspect(q.id,'explanation',q.explanation,'exam-meta');
  inspect(q.id,'warning',q.warning,'exam-meta');
  for(const option of q.options||[])inspect(q.id,`option.${option.id}`,option.text,'exam-option');
  walkSolution(q.id,solutions[q.id],`solution`);
  const rendered=solutions[q.id];
  for(const option of q.options||[]){
    const renderedOption=rendered?.options?.find(item=>item.id===option.id);
    if(!renderedOption){
      findings.push({severity:'high',id:q.id,field:`solution.option.${option.id}`,rule:'missing-rendered-option',text:option.text});
    }else if(option.id!=='x'&&renderedOption.text!==option.text){
      findings.push({severity:'high',id:q.id,field:`solution.option.${option.id}`,rule:'solution-option-text-mismatch',text:`Question: ${option.text}\nSolution: ${renderedOption.text}`});
    }
  }
}

const severityCounts=findings.reduce((out,item)=>{out[item.severity]=(out[item.severity]||0)+1;return out;},{});
const high=findings.filter(item=>item.severity==='high');
const suspiciousQuestions=new Set(findings.map(item=>item.id));
const report={
  audited_question_count:data.questions.length,
  audited_solution_count:Object.keys(solutions).length,
  suspicious_question_count:suspiciousQuestions.size,
  finding_count:findings.length,
  severity_counts:severityCounts,
  runtime_files:runtimeFiles,
  findings
};
fs.writeFileSync('vietnamese_text_audit.json',JSON.stringify(report,null,2)+'\n');

const lines=[
  `Audited questions: ${data.questions.length}`,
  `Audited solutions: ${Object.keys(solutions).length}`,
  `Questions with findings: ${suspiciousQuestions.size}`,
  `High-confidence findings: ${high.length}`,
  `All findings: ${findings.length}`,
  ''
];
for(const item of findings){
  lines.push(`===== ${item.severity.toUpperCase()} | ${item.id} | ${item.field} | ${item.rule} =====`);
  lines.push(item.text,'');
}
fs.writeFileSync('vietnamese_text_audit.txt',lines.join('\n').trimEnd()+'\n');
console.log(lines.slice(0,5).join('\n'));
if(high.length)process.exitCode=1;
