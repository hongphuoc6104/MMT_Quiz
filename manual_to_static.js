// Adapter for the existing app.js UI. The source of truth is the 23 manually written
// solution files; this converts them to the shape app.js already consumes.
(function(){
  const data=window.QUIZ_DATA;
  const manual=window.MANUAL_SOLUTIONS||{};
  if(!data||!Array.isArray(data.questions))throw new Error('Không có dữ liệu câu hỏi.');

  const solutions={};
  for(const q of data.questions){
    const s=manual[q.id];
    if(!s)throw new Error(`Thiếu lời giải thủ công: ${q.id}`);
    const correctIds=Array.isArray(s.correct_option_ids)&&s.correct_option_ids.length
      ? [...new Set(s.correct_option_ids)]
      : [s.correct_option_id||q.correct_option_id];

    const options=(q.options||[]).map(o=>{
      const a=s.options?.[o.id];
      if(!a)throw new Error(`Thiếu phân tích phương án ${q.id}/${o.id}`);
      const text=s.option_text_overrides?.[o.id]??s.extraOptions?.[o.id]??o.text;
      return {id:o.id,text,correct:correctIds.includes(o.id),why:a.why,when:a.when};
    });

    solutions[q.id]={
      knowledge:s.knowledge,
      reasoning:s.reasoning,
      options,
      calculation:s.calculation||null,
      commonMistakes:Array.isArray(s.commonMistakes)?s.commonMistakes:[],
      summary:s.summary
    };
  }

  window.STATIC_SOLUTION_DATA={
    metadata:{question_count:data.metadata?.question_count||data.questions.length,source:'manual_solutions'},
    solutions
  };
})();
