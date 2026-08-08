// TTHCM-style reading flow: question -> answers -> full explanation below.
(() => {
  const correctFor=(question,id)=>typeof isCorrectAnswer==='function'
    ? isCorrectAnswer(question,id)
    : id===question.correct_option_id;

  function fullSolutionHtml(question,s,order){
    if(!s)return '';
    const optionRows=(s.options||[]).map(item=>{
      const pos=order.indexOf(item.id);
      const letter=pos>=0?letters[pos]:item.id;
      const correct=correctFor(question,item.id);
      return `<article class="option-analysis ${correct?'is-correct':'is-wrong'}">
        <h5>${correct?'✅':'❌'} ${letter}. ${escapeHtml(item.text)}</h5>
        <p><b>${correct?'Vì sao chọn':'Vì sao không chọn'}:</b> ${escapeHtml(item.why)}</p>
        <p><b>Khi nào phương án này đúng / dùng được:</b> ${escapeHtml(item.when)}</p>
      </article>`;
    }).join('');

    const calc=s.calculation?`
      <section class="explain-block calculation-block">
        <h4>🧮 Bài giải / công thức</h4>
        <h5>${escapeHtml(s.calculation.title||'Các bước giải')}</h5>
        <ol>${(s.calculation.steps||[]).map(step=>`<li>${escapeHtml(step)}</li>`).join('')}</ol>
        ${s.calculation.result?`<p class="calc-result"><b>Kết quả / đối chiếu:</b> ${escapeHtml(s.calculation.result)}</p>`:''}
      </section>`:'';

    const mistakes=(s.commonMistakes||[]).length
      ? `<ul>${s.commonMistakes.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '<p>Không có ghi chú lỗi riêng cho câu này.</p>';

    const sources=question.sources?.length
      ? `<div class="source-note"><b>Nguồn / đối chiếu:</b> ${question.sources.map(escapeHtml).join(', ')}</div>`
      : '';

    return `<div class="solution tthcm-solution">
      <section class="explain-block">
        <h4>💡 Giải thích chi tiết</h4>
        <p>${escapeHtml(s.reasoning||'')}</p>
      </section>

      ${calc}

      <section class="explain-block">
        <h4>📘 Kiến thức nền</h4>
        <p>${escapeHtml(s.knowledge||'')}</p>
      </section>

      <section class="explain-block">
        <h4>🧩 Phân tích từng đáp án</h4>
        <div class="option-analysis-list">${optionRows}</div>
      </section>

      <section class="explain-block">
        <h4>⚠️ Lỗi dễ mắc</h4>
        ${mistakes}
      </section>

      <section class="explain-block memory-block">
        <h4>🧠 Ghi nhớ</h4>
        <p>${escapeHtml(s.summary||'')}</p>
      </section>
      ${sources}
    </div>`;
  }

  window.solutionHtml=fullSolutionHtml;
  try{solutionHtml=fullSolutionHtml;}catch(e){}
})();
