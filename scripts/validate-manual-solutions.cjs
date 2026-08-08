const fs=require('fs'),vm=require('vm');
const mode=process.argv[2]||'all';
const questions=JSON.parse(fs.readFileSync('questions.json','utf8'));
const files=[
  'manual_solutions/de01_a.js','manual_solutions/de01_b.js','manual_solutions/de01_ver2.js',
  'manual_solutions/de02_a.js','manual_solutions/de02_b.js','manual_solutions/de03_a.js','manual_solutions/de03_b.js',
  'manual_solutions/de04_ch1_a.js','manual_solutions/de04_ch1_b.js','manual_solutions/de04_ch1_c.js',
  'manual_solutions/de04_ch3_a.js','manual_solutions/de04_ch3_b.js','manual_solutions/de04_ch4.js',
  'manual_solutions/de04_ch5_a.js','manual_solutions/de04_ch5_b.js','manual_solutions/de04_ch6_a.js','manual_solutions/de04_ch6_b.js',
  'manual_solutions/de04_ch7_a.js','manual_solutions/de04_ch7_b.js','manual_solutions/de04_ch8_a.js','manual_solutions/de04_ch8_b.js',
  'manual_solutions/de07.js','manual_solutions/de08.js'
];
const box={window:{}};vm.createContext(box);
for(const f of files){
  if(!fs.existsSync(f))throw new Error('Missing manual file: '+f);
  try{vm.runInContext(fs.readFileSync(f,'utf8'),box,{filename:f})}catch(e){throw new Error(`Cannot load ${f}: ${e.message}`)}
}
const sols=box.window.MANUAL_SOLUTIONS||{};
const qlist=questions.questions||[];
function uniqueOptionIds(q,s){const seen=new Set(),ids=[];for(const o of q.options||[]){if(o&&o.id&&!seen.has(o.id)){seen.add(o.id);ids.push(o.id)}}for(const id of Object.keys(s.extraOptions||{})){if(!seen.has(id)){seen.add(id);ids.push(id)}}return ids}
function fail(msg){throw new Error(msg)}
function count(){
  if(questions.metadata?.question_count!==314)fail(`metadata count=${questions.metadata?.question_count}, expected 314`);
  if(qlist.length!==314)fail(`question array count=${qlist.length}, expected 314`);
  const ids=Object.keys(sols);if(ids.length!==314)fail(`manual solution count=${ids.length}, expected 314`);
  const qids=new Set(qlist.map(q=>q.id));for(const id of ids)if(!qids.has(id))fail(`unknown manual ID ${id}`);for(const q of qlist)if(!sols[q.id])fail(`missing manual ID ${q.id}`);
  console.log('count ok: 314 questions / 314 manual solutions / '+files.length+' files');
}
function sections(){for(const q of qlist){const s=sols[q.id];if(!s)fail(`missing solution ${q.id}`);for(const k of ['knowledge','reasoning','summary'])if(!s[k]||!String(s[k]).trim())fail(`missing ${k}: ${q.id}`)}console.log('sections ok')}
function options(){for(const q of qlist){const s=sols[q.id];if(!s)fail(`missing solution ${q.id}`);const ids=uniqueOptionIds(q,s);if(!ids.length)fail(`no options: ${q.id}`);for(const id of ids){const a=s.options?.[id];if(!a?.why||!a?.when)fail(`incomplete option analysis: ${q.id}/${id}; manual keys=${Object.keys(s.options||{}).join(',')}`)}}console.log('option analyses ok')}
function correct(){for(const q of qlist){const s=sols[q.id];if(!s)fail(`missing solution ${q.id}`);const ids=new Set(uniqueOptionIds(q,s));const corr=Array.isArray(s.correct_option_ids)&&s.correct_option_ids.length?s.correct_option_ids:[s.correct_option_id||q.correct_option_id];if(!corr.length||corr.some(x=>!x))fail(`empty correct answer: ${q.id}`);for(const id of corr)if(!ids.has(id))fail(`correct option missing: ${q.id}/${id}; options=${[...ids].join(',')}`)}console.log('correct answers ok')}
function calc(){for(const q of qlist){const s=sols[q.id];if(s?.calculation&&(!s.calculation.title||!Array.isArray(s.calculation.steps)||!s.calculation.steps.length||!s.calculation.result))fail(`incomplete calculation: ${q.id}`)}console.log('calculations ok')}
const checks={count,sections,options,correct,calc};if(mode==='all'){for(const fn of Object.values(checks))fn()}else if(checks[mode])checks[mode]();else fail('unknown mode '+mode);
