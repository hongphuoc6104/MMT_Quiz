// Knowledge-first reading flow: show theory and reasoning; keep option comparisons concise and optional.
(() => {
  const correctFor=(question,id)=>typeof isCorrectAnswer==='function'
    ? isCorrectAnswer(question,id)
    : id===question.correct_option_id;

  const e=value=>typeof escapeHtml==='function'?escapeHtml(value):String(value??'');

  function cleanExplanation(value){
    let s=String(value??'').normalize('NFC').replace(/\s+/g,' ').trim();
    // Remove grading/meta-language. The card icon/color already tells correct vs wrong.
    s=s.replace(/^(?:Đúng|Sai|Correct|Wrong)\b[.!,:;\-]?\s*/i,'');
    s=s.replace(/^(?:Phương án|Lựa chọn)\s+này\s+(?:đúng|sai)\b[.!,:;\-]?\s*/i,'');
    s=s.replace(/^Đây\s+là\s+đáp\s+án\s+đúng\b[.!,:;\-]?\s*/i,'');
    // Old/manual copy sometimes stored UI labels inside the explanation itself.
    s=s.replace(/\bVì\s+sao\s+(?:đây\s+là\s+đáp\s+án\s+đúng|không\s+chọn(?:\s+(?:đáp\s+án|phương\s+án)\s+này)?|chọn)\s*:?\s*/gi,'');
    s=s.replace(/\bKhi\s+nào\s+(?:ý\s+của\s+)?(?:đáp\s+án|phương\s+án)\s+này\s+(?:có\s+thể\s+)?đúng(?:\s*\/\s*dùng\s+được)?\s*:?\s*/gi,'');
    s=s.replace(/\bĐiều\s+kiện\s+để\s+kết\s+luận\s+này\s+đúng\s*:?\s*/gi,'');
    return s.replace(/\s+([,.;:?])/g,'$1').trim();
  }

  function auditHtml(question){
    const audit=window.MMT_ANSWER_AUDIT?.noteFor?.(question);
    if(!audit)return '';
    return `<section class="answer-audit ${e(audit.kind||'caution')}">
      <div class="audit-kicker">${audit.kind==='corrected'?'✅ ĐÃ KIỂM TRA LẠI':audit.kind==='source-problem'?'⚠️ LƯU Ý VỀ ĐỀ GỐC':'🔎 CẦN ĐỌC KÈM ĐIỀU KIỆN'}</div>
      <h4>${e(audit.title)}</h4>
      <p>${e(cleanExplanation(audit.text))}</p>
      ${audit.basis?`<p class="audit-basis">Căn cứ: ${e(cleanExplanation(audit.basis))}</p>`:''}
    </section>`;
  }

  function conceptHtml(concept){
    const points=(concept.points||[]).map(item=>`<li>${e(cleanExplanation(item))}</li>`).join('');
    return `<article class="concept-card">
      <h5>${e(concept.title)}</h5>
      <p class="concept-definition">${e(cleanExplanation(concept.definition))}</p>
      ${points?`<ul class="concept-points">${points}</ul>`:''}
      ${concept.example?`<p class="concept-example">${e(cleanExplanation(concept.example))}</p>`:''}
      ${concept.distinguish?`<p class="concept-distinguish">${e(cleanExplanation(concept.distinguish))}</p>`:''}
      ${concept.source?`<div class="concept-source">${e(concept.source)}</div>`:''}
    </article>`;
  }

  function theoryHtml(question,s){
    const concepts=window.MMT_BEGINNER_THEORY?.matches?.(question,s,3)||[];
    if(concepts.length){
      const extra=cleanExplanation(s.knowledge||'');
      return `<section class="explain-block beginner-block">
        <h4>📘 Kiến thức cần nhớ</h4>
        <div class="concept-list">${concepts.map(conceptHtml).join('')}</div>
        ${extra?`<details class="study-details compact-details"><summary>Kiến thức bổ sung</summary><div class="details-body"><p>${e(extra)}</p></div></details>`:''}
      </section>`;
    }
    const knowledge=cleanExplanation(s.knowledge||'');
    return knowledge?`<section class="explain-block beginner-block">
      <h4>📘 Kiến thức cần nhớ</h4>
      <p>${e(knowledge)}</p>
    </section>`:'';
  }

  function optionComparisonHtml(question,s,order){
    const rows=(s.options||[]).map(item=>{
      const pos=order.indexOf(item.id);
      const letter=pos>=0?letters[pos]:String(item.id||'').toUpperCase();
      const correct=correctFor(question,item.id);
      const reason=cleanExplanation(item.why);
      return `<article class="option-analysis ${correct?'is-correct':'is-wrong'}">
        <h5>${correct?'✅':'❌'} ${letter}. ${e(item.text)}</h5>
        ${reason?`<p>${e(reason)}</p>`:''}
      </article>`;
    }).join('');

    return rows?`<details class="study-details option-study-details">
      <summary>🧩 Phân biệt các phương án</summary>
      <div class="details-body"><div class="option-analysis-list">${rows}</div></div>
    </details>`:'';
  }

  function fullSolutionHtml(question,s,order){
    if(!s)return '';

    const reasoning=cleanExplanation(s.reasoning||'');
    const summary=cleanExplanation(s.summary||'');

    const calc=s.calculation?`
      <section class="explain-block calculation-block">
        <h4>🧮 Cách tính</h4>
        ${s.calculation.title?`<h5>${e(cleanExplanation(s.calculation.title))}</h5>`:''}
        <ol>${(s.calculation.steps||[]).map(step=>`<li>${e(cleanExplanation(step))}</li>`).join('')}</ol>
        ${s.calculation.result?`<p class="calc-result">${e(cleanExplanation(s.calculation.result))}</p>`:''}
      </section>`:'';

    const mistakes=(s.commonMistakes||[]).map(cleanExplanation).filter(Boolean);
    const mistakesHtml=mistakes.length?`<details class="study-details compact-details">
      <summary>⚠️ Lỗi dễ nhầm</summary>
      <div class="details-body"><ul>${mistakes.map(item=>`<li>${e(item)}</li>`).join('')}</ul></div>
    </details>`:'';

    const sources=question.sources?.length
      ? `<div class="source-note">Nguồn đối chiếu: ${question.sources.map(e).join(', ')}</div>`
      : '';

    return `<div class="solution tthcm-solution knowledge-first-solution">
      ${auditHtml(question)}
      ${theoryHtml(question,s)}
      ${reasoning?`<section class="explain-block reasoning-block"><h4>🎯 Áp dụng vào câu hỏi</h4><p>${e(reasoning)}</p></section>`:''}
      ${calc}
      ${summary?`<section class="explain-block memory-block"><h4>🧠 Ghi nhớ</h4><p>${e(summary)}</p></section>`:''}
      ${optionComparisonHtml(question,s,order)}
      ${mistakesHtml}
      ${sources}
    </div>`;
  }

  window.solutionHtml=fullSolutionHtml;
  try{solutionHtml=fullSolutionHtml;}catch(e){}
  window.MMT_TTHCM_LAYOUT={cleanExplanation,fullSolutionHtml};
})();
