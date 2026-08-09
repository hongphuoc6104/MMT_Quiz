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
load('beginner_theory.js');
load('theory_topic_guard.js');

const data=box.window.QUIZ_DATA;
const theory=box.window.MMT_BEGINNER_THEORY;
const solutions=box.window.MANUAL_SOLUTIONS||{};
const fail=[];
const warn=[];
function assert(ok,msg){if(!ok)fail.push(msg);}

assert(Array.isArray(data?.questions),'QUIZ_DATA.questions missing');
assert(data?.questions?.length===314,`Expected 314 questions, got ${data?.questions?.length}`);
assert(theory?.guardVersion==='2026-08-09','Guarded beginner theory matcher is not active');

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
  if(/phát biểu|mệnh đề/i.test(qt) && pureDurations>=2){
    fail.push(`${q.id}: conceptual statement question is contaminated by ${pureDurations} duration-only choices`);
  }
  if(/hình|sơ đồ/i.test(qt) && !q.image)warn.push(`${q.id}: mentions an image/diagram but image is null`);
}

const packet=data.questions.find(q=>q.id==='De04-7-115');
assert(packet,'Missing packet-switching regression question De04-7-115');
if(packet){
  const expected=[
    'Thích hợp cho mạng có thông lượng dữ liệu lớn',
    'Thông tin được truyền đi trong những đơn vị là gói tin',
    'Không đảm bảo được chất lượng dịch vụ',
    'Không cần cơ chế điều khiển tắc nghẽn'
  ];
  assert(packet.options.length===4,'De04-7-115 must have four conceptual choices');
  expected.forEach((text,i)=>assert(packet.options[i]?.text===text,`De04-7-115 option ${i+1} not restored correctly`));
  assert(packet.correct_option_id==='d','De04-7-115 correct answer must remain d');
  assert(!packet.options.some(o=>/giây/i.test(o.text)),'De04-7-115 still contains timing choices from the next question');

  const solution=solutions['De04-7-115'];
  assert(solution,'De04-7-115 manual solution missing');
  assert(solution && ['a','b','c','d'].every(id=>solution.options?.[id]?.why && solution.options?.[id]?.when),'De04-7-115 solution must explain all restored options');
  assert(solution && !/mảnh OCR|2 giây|3,5 giây|3 giây/i.test([solution.knowledge,solution.reasoning,solution.summary,...Object.values(solution.options||{}).flatMap(x=>[x.why,x.when])].join(' ')),'De04-7-115 solution still describes the obsolete timing choices');

  const dirtySolution={knowledge:'Repeater Hub Bridge Switch Router Gateway '.repeat(20),reasoning:'router switch hub',summary:'gateway'};
  const concepts=theory.matches(packet,dirtySolution,3);
  const conceptIds=concepts.map(c=>c.id);
  const titles=concepts.map(c=>c.title).join(' | ');
  assert(conceptIds.includes('flowcongestion'),`De04-7-115 must match flowcongestion; got ${conceptIds.join(',')||'(none)'}`);
  assert(!/Repeater|Hub|Bridge|Switch|Router|Gateway/i.test(titles),`De04-7-115 leaked into device theory: ${titles}`);
}

// Solution prose must never be able to change the selected theory topic.
const dns={question:'Trong DNS, MX record cho biết gì?',options:[{id:'a',text:'Mail server của miền'}]};
const clean=theory.matches(dns,{},3).map(c=>c.id).join(',');
const polluted=theory.matches(dns,{knowledge:'router hub repeater switch gateway '.repeat(50)},3).map(c=>c.id).join(',');
assert(clean===polluted,`Theory selection depends on solution prose: clean=${clean}, polluted=${polluted}`);

if(warn.length){
  console.log(`Consistency warnings (${warn.length}, non-blocking):`);
  for(const w of warn.slice(0,25))console.log('  WARN',w);
  if(warn.length>25)console.log(`  ... ${warn.length-25} more warnings`);
}
if(fail.length){
  console.error(`Consistency validation failed (${fail.length}):`);
  for(const f of fail)console.error('  FAIL',f);
  process.exit(1);
}
console.log(`question/solution/theory consistency ok: ${data.questions.length} questions; packet regression restored; theory guard active`);
