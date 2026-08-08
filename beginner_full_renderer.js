// Final teaching renderer. Loaded last so compact/alternative renderers cannot hide required explanations.
// Contract: definition -> example/confusions -> reasoning -> calculation -> manual knowledge -> every option why+when -> mistakes -> memory.
(() => {
  'use strict';
  const correctFor=(question,id)=>typeof isCorrectAnswer==='function'?isCorrectAnswer(question,id):id===question.correct_option_id;
  const e=value=>typeof escapeHtml==='function'?escapeHtml(value):String(value??'');
  const clean=value=>String(value??'').normalize('NFC').replace(/\s+/g,' ').replace(/\s+([,.;:?])/g,'$1').trim();

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
    return `<article class="concept-card">
      <div class="concept-step">${index===0?'BẮT ĐẦU TỪ SỐ 0':'KHÁI NIỆM LIÊN QUAN'}</div>
      <h5>${e(concept.title)}</h5>
      <div class="definition-box"><b>Định nghĩa đầy đủ</b><p>${e(concept.definition)}</p></div>
      ${(concept.points||[]).length?`<div class="concept-points"><b>Hiểu từng ý</b><ul>${concept.points.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`:''}
      ${concept.example?`<div class="concept-example"><b>Ví dụ dễ hình dung</b><p>${e(concept.example)}</p></div>`:''}
      ${concept.distinguish?`<div class="concept-distinguish"><b>Điểm rất dễ nhầm</b><p>${e(concept.distinguish)}</p></div>`:''}
      ${concept.source?`<div class="concept-source">Tham chiếu: ${e(concept.source)}</div>`:''}
    </article>`;
  }

  function theoryHtml(question,s){
    const concepts=window.MMT_BEGINNER_THEORY?.matches?.(question,s,3)||[];
    if(concepts.length){
      return `<section class="explain-block beginner-block">
        <div class="section-intro"><span class="lesson-number">1</span><div><h4>📖 Trước tiên: học khái niệm từ số 0</h4><p>Đọc định nghĩa, từng ý nhỏ, ví dụ và điểm dễ nhầm trước khi nhìn vào lập luận đáp án.</p></div></div>
        <div class="concept-list">${concepts.map(conceptHtml).join('')}</div>
      </section>`;
    }
    return `<section class="explain-block beginner-block fallback-theory">
      <div class="section-intro"><span class="lesson-number">1</span><div><h4>📖 Trước tiên: kiến thức nền</h4><p>Đây là phần phải hiểu trước khi suy ra đáp án.</p></div></div>
      <div class="definition-box"><b>Khái niệm / quy tắc cần biết</b><p>${e(clean(s.knowledge)||'Đọc phần áp dụng bên dưới để nắm quy tắc của câu này.')}</p></div>
    </section>`;
  }

  function optionHtml(question,s,order){
    const rows=(s.options||[]).map(item=>{
      const pos=order.indexOf(item.id);
      const letter=pos>=0?letters[pos]:String(item.id||'').toUpperCase();
      const correct=correctFor(question,item.id);
      return `<article class="option-analysis ${correct?'is-correct':'is-wrong'}">
        <h5>${correct?'✅':'❌'} ${letter}. ${e(item.text)}</h5>
        <p><b>${correct?'Vì sao đây là đáp án đúng':'Vì sao không chọn đáp án này'}:</b> ${e(clean(item.why))}</p>
        <p class="when-line"><b>${correct?'Điều kiện để kết luận này đúng':'Khi nào ý của phương án này có thể đúng'}:</b> ${e(clean(item.when))}</p>
      </article>`;
    }).join('');
    return `<section class="explain-block options-explanation">
      <div class="section-intro"><span class="lesson-number">${s.calculation?'5':'4'}</span><div><h4>🧩 Phân tích đầy đủ từng đáp án A/B/C/D</h4><p>Đọc cả đáp án sai để biết nó sai ở đâu và trường hợp nào ý đó lại đúng.</p></div></div>
      <div class="option-analysis-list">${rows}</div>
    </section>`;
  }

  function fullSolutionHtml(question,s,order){
    if(!s)return '';
    const calc=s.calculation?`<section class="explain-block calculation-block">
      <div class="section-intro"><span class="lesson-number">3</span><div><h4>🧮 Bài giải / công thức từng bước</h4><p>Đi từng bước để hiểu công thức, cách thay số và ý nghĩa kết quả.</p></div></div>
      ${s.calculation.title?`<h5>${e(s.calculation.title)}</h5>`:''}
      <ol>${(s.calculation.steps||[]).map((step,i)=>`<li><b>Bước ${i+1}:</b> ${e(step)}</li>`).join('')}</ol>
      ${s.calculation.result?`<p class="calc-result"><b>Kết quả / đối chiếu:</b> ${e(s.calculation.result)}</p>`:''}
    </section>`:'';

    const mistakes=(s.commonMistakes||[]);
    const sources=question.sources?.length?`<div class="source-note"><b>Nguồn / đối chiếu trong dữ liệu:</b> ${question.sources.map(e).join(', ')}</div>`:'';

    return `<div class="solution tthcm-solution beginner-solution final-beginner-renderer">
      ${auditHtml(question)}
      ${theoryHtml(question,s)}
      <section class="explain-block reasoning-block">
        <div class="section-intro"><span class="lesson-number">2</span><div><h4>🎯 Áp dụng kiến thức vào chính câu hỏi</h4><p>Nối từ khóa trong đề với định nghĩa vừa học rồi mới kết luận.</p></div></div>
        <p>${e(clean(s.reasoning))}</p>
      </section>
      ${calc}
      <section class="explain-block knowledge-block">
        <div class="section-intro"><span class="lesson-number">${s.calculation?'4':'3'}</span><div><h4>📘 Kiến thức nền riêng của câu</h4><p>Giữ phần kiến thức thủ công được viết riêng cho chính câu này để bổ sung cho định nghĩa tổng quát.</p></div></div>
        <p>${e(clean(s.knowledge))}</p>
      </section>
      ${optionHtml(question,s,order)}
      <section class="explain-block mistakes-block"><h4>⚠️ Lỗi người mới rất dễ mắc</h4>${mistakes.length?`<ul>${mistakes.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:'<p>Không có ghi chú lỗi riêng; hãy tập trung vào định nghĩa và điều kiện áp dụng.</p>'}</section>
      <section class="explain-block memory-block"><h4>🧠 Sau cùng: điều cần nhớ</h4><p>${e(clean(s.summary))}</p></section>
      ${sources}
    </div>`;
  }

  window.solutionHtml=fullSolutionHtml;
  try{solutionHtml=fullSolutionHtml;}catch(err){}
  window.MMT_BEGINNER_FULL_RENDERER=Object.freeze({fullSolutionHtml,clean});
})();
