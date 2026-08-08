const fs=require('fs');
const vm=require('vm');
const crypto=require('crypto');

const data=JSON.parse(fs.readFileSync('questions.json','utf8'));
const engineCode=fs.readFileSync('solution_engine.js','utf8');
const sandbox={window:{},console};
vm.createContext(sandbox);
vm.runInContext(engineCode,sandbox,{filename:'solution_engine.js'});
if(!sandbox.window.NETWORK_SOLUTION?.build) throw new Error('NETWORK_SOLUTION.build not found');

const solutions={};
for(const q of data.questions){
  const s=sandbox.window.NETWORK_SOLUTION.build(q);
  // Materialize all display text now. The website will not derive explanations at runtime.
  solutions[q.id]={
    question:q.question,
    correct_option_id:q.correct_option_id,
    knowledge:s.knowledge,
    reasoning:s.reasoning,
    finalAnswer:s.finalAnswer,
    options:s.options,
    calculation:s.calculation,
    commonMistakes:s.commonMistakes,
    summary:s.summary,
    source_page:q.source_page,
    image:q.image||null,
    warning:q.warning||null
  };
}

if(Object.keys(solutions).length!==data.metadata.question_count){
  throw new Error(`Expected ${data.metadata.question_count} solutions, got ${Object.keys(solutions).length}`);
}
for(const q of data.questions){
  const s=solutions[q.id];
  if(!s||!Array.isArray(s.options)||s.options.length!==q.options.length){
    throw new Error(`Incomplete solution for ${q.id}`);
  }
  const ids=new Set(s.options.map(o=>o.id));
  for(const o of q.options) if(!ids.has(o.id)) throw new Error(`Missing option ${o.id} in ${q.id}`);
}

const sourceHash=crypto.createHash('sha256').update(fs.readFileSync('questions.json')).digest('hex');
const payload={metadata:{question_count:Object.keys(solutions).length,source_sha256:sourceHash,mode:'STATIC_PRECOMPUTED'},solutions};
const out='// AUTO-MATERIALIZED: static per-question solutions. No runtime solution generation.\nwindow.STATIC_SOLUTION_DATA='+JSON.stringify(payload,null,2)+';\n';
fs.writeFileSync('static_solutions.js',out);
console.log(`Wrote ${Object.keys(solutions).length} static solutions (${out.length} bytes)`);
