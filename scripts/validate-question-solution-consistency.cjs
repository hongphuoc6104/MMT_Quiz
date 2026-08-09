'use strict';
const fs=require('fs');
const vm=require('vm');
const box={window:{},console};
vm.createContext(box);
function load(path){vm.runInContext(fs.readFileSync(path,'utf8'),box,{filename:path});}
load('questions.js');
load('question_structure_fixes.js');
load('manual_solutions/de04_ch1_a.js');
load('solution_consistency_fixes.js');
load('data_corrections.js');
load('question_consistency_fixes.js');
load('pdf_ocr_hotfixes.js');
load('vietnamese_text_cleanup_20260809.js');
load('vietnamese_text_cleanup_final_20260809.js');
load('source_preserving_ocr_fixes_20260809.js');
load('beginner_theory.js');
load('theory_topic_guard.js');
const data=box.window.QUIZ_DATA;
const theory=box.window.MMT_BEGINNER_THEORY;
const solutions=box.window.MANUAL_SOLUTIONS||{};
const sourceRegistry=JSON.parse(fs.readFileSync('data/question_sources.json','utf8'));
const fail=[];
const warn=[];
const FIGURE_DEPENDENCY_RE=/(?:như|theo|trong|ở|từ)\s+hình|hình\s+(?:sau|dưới|minh họa)|sơ\s*đồ|hình\s+trạng.*sau|topology\)\s+sau|mô\s+hình.*(?:dưới\s+đây|sau\s+đây)/i;
function assert(ok,msg){if(!ok)fail.push(msg);}
assert(Array.isArray(data?.questions),'QUIZ_DATA.questions missing');
assert(data?.questions?.length===314,`Expected 314 questions, got ${data?.questions?.length}`);
assert(theory?.guardVersion==='2026-08-09.3','Guarded beginner theory matcher is not active');
assert(sourceRegistry?.schema_version===2,'question source registry schema missing/unsupported');
const ids=new Set();
for(const q of data.questions||[]){
  assert(q?.id && !ids.has(q.id),`Duplicate/missing question id: ${q?.id}`);
  ids.add(q.id);
  const options=q.options||[];
  assert(options.length>=2 && options.length<=5,`${q.id}: unexpected option count ${options.length}`);
  const optionIds=options.map(o=>o.id);
  assert(new Set(optionIds).size===optionIds.length,`${q.id}: duplicate option ids remain after structural cleanup`);
  assert(optionIds.includes(q.correct_option_id),`${q.id}: correct_option_id ${q.correct_option_id} is not displayed`);
  const qt=String(q.question||'');
  const pureDurations=options.filter(o=>/^\s*\d+(?:[.,]\d+)?\s*(?:giây|s)\s*$/i.test(String(o.text||''))).length;
  if(/phát biểu|mệnh đề/i.test(qt) && pureDurations>=2)fail.push(`${q.id}: conceptual statement question is contaminated by ${pureDurations} duration-only choices`);
  if(FIGURE_DEPENDENCY_RE.test(qt)){
    if(q.image)assert(fs.existsSync(q.image),`${q.id}: referenced figure asset is missing: ${q.image}`);
    else assert(/(?:chưa|không).*ảnh|phụ\s+thuộc\s+hình/i.test(String(q.warning||'')),`${q.id}: figure-dependent question has neither an image nor a missing-source warning`);
  }
  const matchedTheory=theory.matches(q,{},3);
  assert(matchedTheory.length<=1,`${q.id}: more than one related concept is displayed (${matchedTheory.map(c=>c.id).join(',')})`);
  assert(!matchedTheory.some(c=>c.title==='Ethernet, MAC address, switch và collision domain'),`${q.id}: obsolete broad Ethernet concept is still displayed`);
}

// Provenance rule: source_exact is forbidden unless a preserved evidence artifact exists.
for(const [id,source] of Object.entries(sourceRegistry?.questions||{})){
  const status=source.verification_status;
  assert(['awaiting_source_artifact','source_exact'].includes(status),`${id}: unsupported verification_status ${status}`);
  if(status==='source_exact'){
    const evidencePath=source?.evidence?.path;
    assert(typeof evidencePath==='string' && evidencePath.length>0,`${id}: source_exact requires evidence.path`);
    if(evidencePath)assert(fs.existsSync(evidencePath),`${id}: source_exact evidence file missing: ${evidencePath}`);
    const q=data.questions.find(x=>x.id===id);
    assert(q,`${id}: source registry record has no runtime question`);
    if(!q)continue;
    assert(q.question===source.question,`${id}: runtime question text differs from verified source registry`);
    assert(JSON.stringify(q.options)===JSON.stringify(source.options),`${id}: runtime option text/order differs from verified source registry`);
    assert(q.correct_option_id===source.correct_option_id,`${id}: runtime correct answer differs from verified source registry`);
    assert(q.verification==='source_exact',`${id}: verified source record must be marked source_exact at runtime`);
    assert(q.source_exact?.status===true,`${id}: runtime source_exact status must be true`);
  }
  if(status==='awaiting_source_artifact'){
    const q=data.questions.find(x=>x.id===id);
    if(q){
      assert(q.verification!=='source_exact',`${id}: runtime may not claim source_exact while source artifact is missing`);
      assert(q.source_exact?.status!==true,`${id}: runtime source_exact flag must not be true while source artifact is missing`);
    }
  }
}

const packet=data.questions.find(q=>q.id==='De04-7-115');
const packetSource=sourceRegistry.questions['De04-7-115'];
assert(packet,'Missing packet-switching regression question De04-7-115');
assert(packetSource,'Missing provenance record for De04-7-115');
if(packet && packetSource){
  assert(packet.options.length===4,'De04-7-115 must have four conceptual choices');
  assert(packet.correct_option_id==='d','De04-7-115 candidate correct answer must remain d until source verification');
  assert(packetSource.verification_status==='awaiting_source_artifact','De04-7-115 must remain awaiting_source_artifact until page 23 source is preserved');
  assert(packet.verification==='awaiting_source_artifact','De04-7-115 runtime verification must reflect missing source artifact');
  assert(packet.source_exact?.status===false,'De04-7-115 must not claim source_exact without source evidence');
  assert(!packet.options.some(o=>/giây/i.test(o.text)),'De04-7-115 still contains timing choices from the next question');
  const solution=solutions['De04-7-115'];
  assert(solution,'De04-7-115 manual solution missing');
  assert(solution && ['a','b','c','d'].every(id=>solution.options?.[id]?.why && solution.options?.[id]?.when),'De04-7-115 solution must explain all current candidate options');
  assert(solution && /A mô tả đơn vị truyền là gói tin/.test(solution.reasoning),'De04-7-115 solution option mapping is not aligned to the current candidate A/B/C/D');
  assert(solution && /khó bảo đảm|khó đảm bảo/i.test([solution.options?.b?.why,solution.commonMistakes?.join(' ')].join(' ')),'De04-7-115 solution must preserve the candidate nuance “Khó đảm bảo”');
  assert(solution && !/mảnh OCR|2 giây|3,5 giây|3 giây/i.test([solution.knowledge,solution.reasoning,solution.summary,...Object.values(solution.options||{}).flatMap(x=>[x.why,x.when])].join(' ')),'De04-7-115 solution still describes the obsolete timing choices');
  const dirtySolution={knowledge:'Repeater Hub Bridge Switch Router Gateway '.repeat(20),reasoning:'router switch hub',summary:'gateway'};
  const concepts=theory.matches(packet,dirtySolution,3);
  const conceptIds=concepts.map(c=>c.id);
  assert(conceptIds.includes('packetswitching'),`De04-7-115 must match packet-switching theory; got ${conceptIds.join(',')||'(none)'}`);
  assert(!conceptIds.includes('devices'),`De04-7-115 leaked into device theory: ${conceptIds.join(',')}`);
}
const dns={question:'Trong DNS, MX record cho biết gì?',options:[{id:'a',text:'Mail server của miền'}]};
const clean=theory.matches(dns,{},3).map(c=>c.id).join(',');
const polluted=theory.matches(dns,{knowledge:'router hub repeater switch gateway '.repeat(50)},3).map(c=>c.id).join(',');
assert(clean===polluted,`Theory selection depends on solution prose: clean=${clean}, polluted=${polluted}`);

// Regression coverage for every question that renders a dedicated figure.
// Generic “giao thức/domain/server/router” words must never beat the actual topic.
const expectedFigureTheory=new Map([
  ['De01-5-4','tcp'],
  ['De01-50-47','tcp'],
  ['De03-4-95','arq'],
  ['De03-12-101','arq'],
  ['De04-5-198','collisiondomains'],
  ['De04-4-228','collisiondomains']
]);
for(const [id,expected] of expectedFigureTheory){
  const q=data.questions.find(item=>item.id===id);
  assert(q,`Missing figure regression question ${id}`);
  if(!q)continue;
  const matched=theory.matches(q,{},3).map(c=>c.id);
  assert(matched.includes(expected),`${id}: expected theory ${expected}; got ${matched.join(',')||'(manual fallback)'}`);
  assert(!matched.includes('protocol'),`${id}: generic Protocol/Service/Interface card must not be shown`);
}

const handshake=data.questions.find(q=>q.id==='De01-5-4');
assert(handshake?.options?.find(o=>o.id==='d')?.text==='A1=6, A2=8','De01-5-4 option D still contains merged explanation text');
const handshakeCrop='assets/crops/De01-5-4.png';
assert(fs.existsSync(handshakeCrop),'De01-5-4 dedicated crop is missing');
if(fs.existsSync(handshakeCrop)){
  const png=fs.readFileSync(handshakeCrop);
  assert(png.length>=24 && png.toString('ascii',1,4)==='PNG','De01-5-4 crop is not a valid PNG');
  if(png.length>=24){
    const width=png.readUInt32BE(16);
    const height=png.readUInt32BE(20);
    assert(width>=250 && height>=280,`De01-5-4 crop is too short (${width}x${height}); final ACK/A2 may be missing`);
  }
}

const tokenRing=data.questions.find(q=>q.id==='De01-40-38');
const tokenTheory=tokenRing?theory.matches(tokenRing,{},3).map(c=>c.id):[];
assert(tokenRing,'Missing Token Ring regression question De01-40-38');
assert(tokenTheory.includes('macaccess'),`De01-40-38 must show media-access theory; got ${tokenTheory.join(',')||'(none)'}`);
assert(!tokenTheory.includes('protocol'),'De01-40-38 must not show Protocol/Service/Interface theory');

const serviceQuestion=data.questions.find(q=>q.id==='De01-19-18');
const serviceTheory=serviceQuestion?theory.matches(serviceQuestion,{},3).map(c=>c.id):[];
assert(serviceTheory.length===1 && serviceTheory[0]==='protocol',`De01-19-18 should show only Protocol/Service/Interface; got ${serviceTheory.join(',')||'(none)'}`);

const focusedTheoryRegressions=[
  ['De01-39-37','macaddress','MAC-address question'],
  ['De02-24-67','ethernetframe','Ethernet MTU question'],
  ['De01-42-40','macsublayer','MAC-sublayer question'],
  ['De01-11-10','circuitswitching','circuit-switching question'],
  ['De03-18-106','packetswitching','packet-switching question']
];
for(const [id,expected,label] of focusedTheoryRegressions){
  const q=data.questions.find(item=>item.id===id);
  assert(q,`Missing focused theory regression question ${id}`);
  const matched=q?theory.matches(q,{},3).map(c=>c.id):[];
  assert(matched.length===1&&matched[0]===expected,`${id}: ${label} should show ${expected}; got ${matched.join(',')||'(none)'}`);
}

// Production renderer must lead with the question-specific application, then
// show the manual knowledge, at most one related concept and every option.
box.letters=['A','B','C','D','E'];
box.escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
box.isCorrectAnswer=(question,id)=>id===question.correct_option_id;
load('tthcm_layout.js');
const renderer=box.window.MMT_TTHCM_LAYOUT?.fullSolutionHtml;
assert(typeof renderer==='function','Production teaching renderer is unavailable');
if(typeof renderer==='function'&&serviceQuestion){
  const sampleSolution={
    knowledge:'Kiến thức riêng của câu.',
    reasoning:'Dấu hiệu quyết định trong câu.',
    summary:'Điểm cần nhớ.',
    commonMistakes:[],
    options:serviceQuestion.options.map(option=>({id:option.id,text:option.text,why:`Giải thích ${option.id}.`,when:`Điều kiện ${option.id}.`}))
  };
  const order=serviceQuestion.options.map(option=>option.id);
  const html=renderer(serviceQuestion,sampleSolution,order);
  const applyAt=html.indexOf('🎯 Áp dụng kiến thức vào chính câu hỏi');
  const knowledgeAt=html.indexOf('📘 Kiến thức nền riêng của câu');
  const relatedAt=html.indexOf('📖 Khái niệm liên quan trực tiếp');
  const optionsAt=html.indexOf('🧩 Phân tích đầy đủ từng đáp án A/B/C/D');
  assert(applyAt>=0&&applyAt<knowledgeAt&&knowledgeAt<relatedAt&&relatedAt<optionsAt,'Teaching sections are not ordered application → question knowledge → related concept → option analysis');
  assert((html.match(/class="concept-card"/g)||[]).length===1,'Production renderer must display exactly one focused concept for the service sample');
  assert(!html.includes('Ethernet, MAC address, switch và collision domain'),'Production renderer still contains the obsolete broad Ethernet card');
  for(const option of serviceQuestion.options){
    assert(html.includes(`Giải thích ${option.id}.`)&&html.includes(`Điều kiện ${option.id}.`),`Production renderer omits full analysis for option ${option.id}`);
  }
}

const genericTheoryRegressions=[
  ['De01-11-10','devices','“Circuit switching” must not be interpreted as a switch device'],
  ['De04-4-127','tcp','The TCP/IP model question must not show TCP segment/handshake theory'],
  ['De04-2-150','application','A URL in the Aruba switch-capacity question must not trigger application-protocol theory']
];
for(const [id,forbidden,reason] of genericTheoryRegressions){
  const q=data.questions.find(item=>item.id===id);
  assert(q,`Missing generic-keyword regression question ${id}`);
  const matched=q?theory.matches(q,{},3).map(c=>c.id):[];
  assert(!matched.includes(forbidden),`${id}: ${reason}; got ${matched.join(',')||'(manual fallback)'}`);
}
if(warn.length){console.log(`Consistency warnings (${warn.length}, non-blocking):`);for(const w of warn.slice(0,25))console.log('  WARN',w);if(warn.length>25)console.log(`  ... ${warn.length-25} more warnings`);}
if(fail.length){console.error(`Consistency validation failed (${fail.length}):`);for(const f of fail)console.error('  FAIL',f);process.exit(1);}
const exact=Object.values(sourceRegistry.questions||{}).filter(x=>x.verification_status==='source_exact').length;
const pending=Object.values(sourceRegistry.questions||{}).filter(x=>x.verification_status==='awaiting_source_artifact').length;
console.log(`question/solution/theory consistency ok: ${data.questions.length} questions; provenance exact=${exact}, awaiting_source_artifact=${pending}; theory guard active`);
