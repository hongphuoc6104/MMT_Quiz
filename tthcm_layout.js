// TTHCM-style reading flow: question -> answers -> beginner lesson -> full explanation below.
(() => {
  const correctFor=(question,id)=>typeof isCorrectAnswer==='function'
    ? isCorrectAnswer(question,id)
    : id===question.correct_option_id;

  const e=value=>typeof escapeHtml==='function'?escapeHtml(value):String(value??'');

  function auditHtml(question){
    const audit=window.MMT_ANSWER_AUDIT?.noteFor?.(question);
    if(!audit)return '';
    return `<section class="answer-audit ${e(audit.kind||'caution')}">
      <div class="audit-kicker">${audit.kind==='corrected'?'✅ ĐÃ KIỂM TRA LẠI':audit.kind==='source-problem'?'⚠️ LƯU Ý VỀ ĐỀ GỐC':'🔎 CẦN ĐỌC KÈM ĐIỀU KIỆN'}</div>
      <h4>${e(audit.title)}</h4>
      <p>${e(audit.text)}</p>
      ${audit.basis?`<p class="audit-basis"><b>Căn cứ:</b> ${e(audit.basis)}</p>`:''}
    </section>`;
  }

  function conceptHtml(concept,index){
    const points=(concept.points||[]).map(item=>`<li>${e(item)}</li>`).join('');
    return `<article class="concept-card">
      <div class="concept-step">${index===0?'BẮT ĐẦU TỪ SỐ 0':'KHÁI NIỆM LIÊN QUAN'}</div>
      <h5>${e(concept.title)}</h5>
      <div class="definition-box"><b>Định nghĩa đầy đủ:</b><p>${e(concept.definition)}</p></div>
      ${points?`<div class="concept-points"><b>Hiểu từng ý:</b><ul>${points}</ul></div>`:''}
      ${concept.example?`<div class="concept-example"><b>Ví dụ dễ hình dung:</b><p>${e(concept.example)}</p></div>`:''}
      ${concept.distinguish?`<div class="concept-distinguish"><b>Điểm rất dễ nhầm:</b><p>${e(concept.distinguish)}</p></div>`:''}
      ${concept.source?`<div class="concept-source">Tham chiếu: ${e(concept.source)}</div>`:''}
    </article>`;
  }

  function beginnerHtml(question,s){
    const concepts=window.MMT_BEGINNER_THEORY?.matches?.(question,s,3)||[];
    if(concepts.length){
      return `<section class="explain-block beginner-block">
        <div class="section-intro">
          <span class="lesson-number">1</span>
          <div><h4>📖 Trước tiên: cần biết khái niệm gì?</h4><p>Phần này giải thích như bạn đang học chủ đề này lần đầu. Đọc định nghĩa và ví dụ trước, rồi mới xem tại sao đáp án đúng.</p></div>
        </div>
        <div class="concept-list">${concepts.map(conceptHtml).join('')}</div>
      </section>`;
    }
    return `<section class="explain-block beginner-block fallback-theory">
      <div class="section-intro">
        <span class="lesson-number">1</span>
        <div><h4>📖 Trước tiên: kiến thức nền của câu</h4><p>Hãy hiểu phần này trước khi nhìn vào đáp án.</p></div>
      </div>
      <div class="definition-box"><b>Khái niệm / quy tắc cần biết:</b><p>${e(s.knowledge||'Câu này dựa trên kiến thức cụ thể được giải thích ở phần lập luận bên dưới.')}</p></div>
    </section>`;
  }

  function fullSolutionHtml(question,s,order){
    if(!s)return '';
    const optionRows=(s.options||[]).map(item=>{
      const pos=order.indexOf(item.id);
      const letter=pos>=0?letters[pos]:item.id;
      const correct=correctFor(question,item.id);
      return `<article class="option-analysis ${correct?'is-correct':'is-wrong'}">
        <h5>${correct?'✅':'❌'} ${letter}. ${e(item.text)}</h5>
        <p><b>${correct?'Vì sao đây là đáp án đúng':'Vì sao không chọn phương án này'}:</b> ${e(item.why)}</p>
        <p><b>Khi nào ý của phương án này đúng / dùng được:</b> ${e(item.when)}</p>
      </article>`;
    }).join('');

    const calc=s.calculation?`
      <section class="explain-block calculation-block">
        <div class="section-intro">
          <span class="lesson-number">3</span>
          <div><h4>🧮 Bài giải / công thức từng bước</h4><p>Không nhảy thẳng đến kết quả: đọc từng bước để biết vì sao dùng công thức đó.</p></div>
        </div>
        <h5>${e(s.calculation.title||'Các bước giải')}</h5>
        <ol>${(s.calculation.steps||[]).map(step=>`<li>${e(step)}</li>`).join('')}</ol>
        ${s.calculation.result?`<p class="calc-result"><b>Kết quả / đối chiếu:</b> ${e(s.calculation.result)}</p>`:''}
      </section>`:'';

    const mistakes=(s.commonMistakes||[]).length
      ? `<ul>${s.commonMistakes.map(item=>`<li>${e(item)}</li>`).join('')}</ul>`
      : '<p>Không có ghi chú lỗi riêng cho câu này.</p>';

    const sources=question.sources?.length
      ? `<div class="source-note"><b>Nguồn / đối chiếu trong dữ liệu:</b> ${question.sources.map(e).join(', ')}</div>`
      : '';

    const reasoningStep=calc?'2':'2';
    const optionStep=calc?'5':'4';
    const knowledgeStep=calc?'4':'3';

    return `<div class="solution tthcm-solution beginner-solution">
      ${auditHtml(question)}
      ${beginnerHtml(question,s)}

      <section class="explain-block reasoning-block">
        <div class="section-intro">
          <span class="lesson-number">${reasoningStep}</span>
          <div><h4>🎯 Áp dụng định nghĩa vào chính câu hỏi này</h4><p>Bây giờ nối từ khóa trong đề với kiến thức vừa học để thấy vì sao đáp án được chọn.</p></div>
        </div>
        <p>${e(s.reasoning||'')}</p>
      </section>

      ${calc}

      <section class="explain-block knowledge-block">
        <div class="section-intro">
          <span class="lesson-number">${knowledgeStep}</span>
          <div><h4>📘 Kiến thức nền bổ sung</h4><p>Phần manual riêng của câu giúp bạn hiểu thêm các chi tiết mà định nghĩa tổng quát chưa bao phủ.</p></div>
        </div>
        <p>${e(s.knowledge||'')}</p>
      </section>

      <section class="explain-block options-explanation">
        <div class="section-intro">
          <span class="lesson-number">${optionStep}</span>
          <div><h4>🧩 Phân tích từng đáp án A/B/C/D</h4><p>Không chỉ nhớ đáp án đúng. Hãy đọc cả phương án sai để biết nó sai ở đâu và trong trường hợp nào ý đó lại đúng.</p></div>
        </div>
        <div class="option-analysis-list">${optionRows}</div>
      </section>

      <section class="explain-block mistakes-block">
        <h4>⚠️ Lỗi người mới rất dễ mắc</h4>
        ${mistakes}
      </section>

      <section class="explain-block memory-block">
        <h4>🧠 Sau cùng chỉ cần nhớ điều này</h4>
        <p>${e(s.summary||'')}</p>
      </section>
      ${sources}
    </div>`;
  }

  window.solutionHtml=fullSolutionHtml;
  try{solutionHtml=fullSolutionHtml;}catch(e){}
})();
