(() => {
  let paletteHidden=true;
  let toastTimer=null;

  const q=id=>document.getElementById(id);
  const answerIsCorrect=(question,selected)=>typeof isCorrectAnswer==='function'?isCorrectAnswer(question,selected):selected===question.correct_option_id;

  function showToast(message){
    const el=q('uxToast');
    if(!el)return;
    clearTimeout(toastTimer);
    el.textContent=message;
    el.classList.remove('hidden');
    toastTimer=setTimeout(()=>el.classList.add('hidden'),2200);
  }

  function scrollToQuiz(){
    const el=q('quizArea');
    if(!el)return;
    window.scrollTo({top:Math.max(0,el.getBoundingClientRect().top+window.scrollY-72),behavior:'smooth'});
  }

  function showSetup(){
    document.body.classList.remove('learning-active');
    paletteHidden=true;
    applyPaletteVisibility();
    switchTab('study');
    requestAnimationFrame(()=>q('setupPanel')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  function decorateOptions(){
    document.querySelectorAll('#options .option').forEach((btn,i)=>{
      const key=document.createElement('span');
      key.className='answer-key-hint';
      key.textContent=i+1;
      key.setAttribute('aria-hidden','true');
      btn.appendChild(key);
    });
  }

  function renderQuestionPalette(){
    const box=q('questionPalette');
    if(!box||!state.pool?.length)return;
    box.innerHTML='';
    state.pool.forEach((question,index)=>{
      const answer=state.answered[question.id];
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='question-jump';
      btn.textContent=index+1;
      btn.title=`Câu ${index+1} • ${question.set} • câu gốc ${question.source_number}`;
      if(index===state.idx)btn.classList.add('current');
      if(answer?.selected)btn.classList.add(answerIsCorrect(question,answer.selected)?'done':'wrong');
      btn.onclick=()=>{
        state.idx=index;
        render();
        scrollToQuiz();
      };
      box.appendChild(btn);
    });
    requestAnimationFrame(()=>box.querySelector('.question-jump.current')?.scrollIntoView({block:'nearest',inline:'nearest'}));
  }

  function applyPaletteVisibility(){
    const sidebar=q('questionSidebar');
    const layout=document.querySelector('.quiz-layout');
    const btn=q('toggleQuestionListBtn');
    if(!sidebar||!layout||!btn)return;
    sidebar.classList.toggle('hidden',paletteHidden);
    layout.classList.toggle('question-list-hidden',paletteHidden);
    btn.textContent=paletteHidden?'Danh sách câu':'Ẩn danh sách';
    btn.setAttribute('aria-expanded',String(!paletteHidden));
  }

  function toggleQuestionList(){
    paletteHidden=!paletteHidden;
    applyPaletteVisibility();
    if(!paletteHidden)requestAnimationFrame(()=>q('questionSidebar')?.scrollIntoView({behavior:'smooth',block:'nearest'}));
  }

  function closeQuestionList(){
    paletteHidden=true;
    applyPaletteVisibility();
  }

  function goToNextUnanswered(){
    if(!state.pool?.length)return;
    for(let step=1;step<=state.pool.length;step++){
      const index=(state.idx+step)%state.pool.length;
      const question=state.pool[index];
      if(!state.answered[question.id]?.selected){
        state.idx=index;
        render();
        scrollToQuiz();
        return;
      }
    }
    showToast('Bạn đã trả lời tất cả câu trong lượt này.');
  }

  function retryWrongCurrent(){
    const wrong=state.pool.filter(question=>{
      const answer=state.answered[question.id];
      return answer?.selected&&!answerIsCorrect(question,answer.selected);
    });
    if(!wrong.length){
      showToast('Chưa có câu sai trong lượt hiện tại để ôn.');
      return;
    }
    ensureQuizShell();
    state.pool=q('shuffleQ')?.checked?shuffle(wrong):wrong;
    state.idx=0;
    state.answered={};
    state.score=0;
    state.mode='wrongReview';
    state.reviewSet=wrong.every(item=>item.set===wrong[0].set)?wrong[0].set:null;
    paletteHidden=true;
    q('quizArea')?.classList.remove('hidden');
    document.body.classList.add('learning-active');
    switchTab('study');
    render();
    scrollToQuiz();
  }

  function openShortcuts(){q('shortcutOverlay')?.classList.remove('hidden')}
  function closeShortcuts(){q('shortcutOverlay')?.classList.add('hidden')}

  function openImageLightbox(){
    const src=q('sourceImage')?.getAttribute('src');
    if(!src)return;
    q('lightboxImage').src=src;
    q('imageLightbox')?.classList.remove('hidden');
    document.body.style.overflow='hidden';
  }

  function closeImageLightbox(){
    q('imageLightbox')?.classList.add('hidden');
    q('lightboxImage')?.removeAttribute('src');
    document.body.style.removeProperty('overflow');
  }

  function bindImageLightbox(){
    const link=q('sourceImageLink');
    if(!link)return;
    link.onclick=event=>{
      event.preventDefault();
      openImageLightbox();
    };
  }

  function bindExtraControls(){
    const unanswered=q('nextUnansweredBtn');
    const toggle=q('toggleQuestionListBtn');
    const closeList=q('closeQuestionListBtn');
    const retry=q('retryWrongBtn');
    const change=q('changeSetBtn');
    const help=q('shortcutHelpBtn');
    const close=q('closeShortcutBtn');
    if(unanswered)unanswered.onclick=goToNextUnanswered;
    if(toggle)toggle.onclick=toggleQuestionList;
    if(closeList)closeList.onclick=closeQuestionList;
    if(retry)retry.onclick=retryWrongCurrent;
    if(change)change.onclick=showSetup;
    if(help)help.onclick=openShortcuts;
    if(close)close.onclick=closeShortcuts;
    bindImageLightbox();
    applyPaletteVisibility();
  }

  function teachingAuditHtml(question){
    const audit=window.MMT_ANSWER_AUDIT?.noteFor?.(question);
    if(!audit)return '';
    return `<section class="answer-audit ${escapeHtml(audit.kind||'caution')}">
      <div class="audit-kicker">${audit.kind==='corrected'?'✅ ĐÃ KIỂM TRA LẠI':audit.kind==='source-problem'?'⚠️ LƯU Ý VỀ ĐỀ GỐC':'🔎 CẦN ĐỌC KÈM ĐIỀU KIỆN'}</div>
      <h4>${escapeHtml(audit.title)}</h4>
      <p>${escapeHtml(audit.text)}</p>
      ${audit.basis?`<p class="audit-basis"><b>Căn cứ:</b> ${escapeHtml(audit.basis)}</p>`:''}
    </section>`;
  }

  function teachingConceptHtml(concept,index){
    const points=(concept.points||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('');
    return `<article class="concept-card">
      <div class="concept-step">${index===0?'BẮT ĐẦU TỪ SỐ 0':'KHÁI NIỆM LIÊN QUAN'}</div>
      <h5>${escapeHtml(concept.title)}</h5>
      <div class="definition-box"><b>Định nghĩa đầy đủ</b><p>${escapeHtml(concept.definition)}</p></div>
      ${points?`<div class="concept-points"><b>Hiểu từng ý</b><ul>${points}</ul></div>`:''}
      ${concept.example?`<div class="concept-example"><b>Ví dụ dễ hình dung</b><p>${escapeHtml(concept.example)}</p></div>`:''}
      ${concept.distinguish?`<div class="concept-distinguish"><b>Điểm rất dễ nhầm</b><p>${escapeHtml(concept.distinguish)}</p></div>`:''}
      ${concept.source?`<div class="concept-source">Tham chiếu: ${escapeHtml(concept.source)}</div>`:''}
    </article>`;
  }

  function fullTeachingSolutionHtml(question,s,order){
    if(!s)return '';
    const concepts=window.MMT_BEGINNER_THEORY?.matches?.(question,s,3)||[];
    const theory=concepts.length
      ? `<section class="explain-block beginner-block"><div class="section-intro"><span class="lesson-number">1</span><div><h4>📖 Trước tiên: học khái niệm từ số 0</h4><p>Đọc định nghĩa, từng ý nhỏ, ví dụ và điểm dễ nhầm trước khi kết luận đáp án.</p></div></div><div class="concept-list">${concepts.map(teachingConceptHtml).join('')}</div></section>`
      : `<section class="explain-block beginner-block fallback-theory"><div class="section-intro"><span class="lesson-number">1</span><div><h4>📖 Trước tiên: kiến thức nền</h4><p>Đây là phần phải hiểu trước khi suy ra đáp án.</p></div></div><div class="definition-box"><b>Khái niệm / quy tắc cần biết</b><p>${escapeHtml(s.knowledge)}</p></div></section>`;

    const calc=s.calculation?`<section class="explain-block calculation-block"><div class="section-intro"><span class="lesson-number">3</span><div><h4>🧮 Bài giải / công thức từng bước</h4><p>Đi từng bước để hiểu công thức, cách thay số và ý nghĩa kết quả.</p></div></div>${s.calculation.title?`<h5>${escapeHtml(s.calculation.title)}</h5>`:''}<ol>${(s.calculation.steps||[]).map((step,i)=>`<li><b>Bước ${i+1}:</b> ${escapeHtml(step)}</li>`).join('')}</ol>${s.calculation.result?`<p class="calc-result"><b>Kết quả / đối chiếu:</b> ${escapeHtml(s.calculation.result)}</p>`:''}</section>`:'';

    const optionRows=(s.options||[]).map(item=>{
      const pos=order.indexOf(item.id);
      const letter=pos>=0?letters[pos]:String(item.id||'').toUpperCase();
      const correct=answerIsCorrect(question,item.id);
      return `<article class="option-analysis ${correct?'is-correct':'is-wrong'}"><h5>${correct?'✅':'❌'} ${letter}. ${escapeHtml(item.text)}</h5><p><b>${correct?'Vì sao đây là đáp án đúng':'Vì sao không chọn đáp án này'}:</b> ${escapeHtml(item.why)}</p><p class="when-line"><b>${correct?'Điều kiện để kết luận này đúng':'Khi nào ý của phương án này có thể đúng'}:</b> ${escapeHtml(item.when)}</p></article>`;
    }).join('');

    const mistakes=(s.commonMistakes||[]);
    const sources=question.sources?.length?`<div class="source-note"><b>Nguồn / đối chiếu trong dữ liệu:</b> ${question.sources.map(escapeHtml).join(', ')}</div>`:'';

    return `<div class="solution tthcm-solution beginner-solution enforced-full-teaching">
      ${teachingAuditHtml(question)}
      ${theory}
      <section class="explain-block reasoning-block"><div class="section-intro"><span class="lesson-number">2</span><div><h4>🎯 Áp dụng kiến thức vào chính câu hỏi</h4><p>Nối từ khóa trong đề với định nghĩa vừa học rồi mới kết luận.</p></div></div><p>${escapeHtml(s.reasoning)}</p></section>
      ${calc}
      <section class="explain-block knowledge-block"><div class="section-intro"><span class="lesson-number">${s.calculation?'4':'3'}</span><div><h4>📘 Kiến thức nền riêng của câu</h4><p>Phần thủ công được viết riêng cho câu này để bổ sung cho định nghĩa tổng quát.</p></div></div><p>${escapeHtml(s.knowledge)}</p></section>
      <section class="explain-block options-explanation"><div class="section-intro"><span class="lesson-number">${s.calculation?'5':'4'}</span><div><h4>🧩 Phân tích đầy đủ từng đáp án A/B/C/D</h4><p>Đọc cả đáp án sai để biết nó sai ở đâu và khi nào ý đó có thể đúng.</p></div></div><div class="option-analysis-list">${optionRows}</div></section>
      <section class="explain-block mistakes-block"><h4>⚠️ Lỗi người mới rất dễ mắc</h4>${mistakes.length?`<ul>${mistakes.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`:'<p>Không có ghi chú lỗi riêng; hãy tập trung vào định nghĩa và điều kiện áp dụng.</p>'}</section>
      <section class="explain-block memory-block"><h4>🧠 Sau cùng: điều cần nhớ</h4><p>${escapeHtml(s.summary)}</p></section>
      ${sources}
    </div>`;
  }

  function enforceFullTeachingFeedback(){
    const question=state.pool?.[state.idx];
    if(!question)return;
    const answer=state.answered?.[question.id];
    if(!answer?.selected)return;
    const feedback=q('feedback');
    const s=SOLUTIONS?.[question.id];
    if(!feedback||!s)return;
    const order=optionOrder(question);
    const correct=answerIsCorrect(question,answer.selected);
    const correctId=question.correct_option_id;
    const correctPos=order.indexOf(correctId);
    const correctText=question.options.find(item=>item.id===correctId)?.text||'';
    feedback.className='feedback show '+(correct?'ok':'bad');
    feedback.innerHTML=`<h3>${correct?'✅ Chính xác':'❌ Chưa đúng'}</h3><div class="answer-line"><b>Đáp án:</b> ${correctPos>=0?letters[correctPos]+'. ':''}${escapeHtml(correctText)}</div>${fullTeachingSolutionHtml(question,s,order)}`;
  }

  window.MMT_FULL_TEACHING_UI=Object.freeze({fullTeachingSolutionHtml,enforceFullTeachingFeedback});

  const baseSolutionHtml=solutionHtml;
  solutionHtml=function(question,s,order){
    if(!s)return baseSolutionHtml(question,s,order);
    return fullTeachingSolutionHtml(question,s,order);
  };

  const baseUpdateStats=updateStats;
  updateStats=function(){
    baseUpdateStats();
    const done=Object.values(state.answered).filter(item=>item.selected).length;
    const total=state.pool.length;
    const percent=total?Math.round(done/total*100):0;
    const label=q('qProgressLabel');
    const value=q('qProgressPercent');
    if(label)label.textContent=`Tiến độ • ${done}/${total} câu`;
    if(value)value.textContent=`${percent}%`;
  };

  const baseBindQuizControls=bindQuizControls;
  bindQuizControls=function(){
    baseBindQuizControls();
    bindExtraControls();
  };

  const baseRender=render;
  render=function(){
    baseRender();
    enforceFullTeachingFeedback();
    if(!q('qPos'))return;
    decorateOptions();
    renderQuestionPalette();
    applyPaletteVisibility();
    bindImageLightbox();
    const next=q('nextBtn');
    if(next&&state.idx===state.pool.length-1)next.textContent='Xem kết quả';
  };

  const baseStart=start;
  start=function(){
    paletteHidden=true;
    baseStart();
    if(state.pool?.length){
      document.body.classList.add('learning-active');
      scrollToQuiz();
    }else{
      document.body.classList.remove('learning-active');
    }
  };

  const baseStartWrongSet=startWrongSet;
  startWrongSet=function(setId){
    paletteHidden=true;
    baseStartWrongSet(setId);
    if(state.pool?.length){
      document.body.classList.add('learning-active');
      scrollToQuiz();
    }
  };

  const baseSummary=summary;
  summary=function(){
    baseSummary();
    const card=document.querySelector('#quizArea .completion-card>div');
    if(!card)return;
    const change=document.createElement('button');
    change.type='button';
    change.className='btn ghost';
    change.style.marginLeft='8px';
    change.textContent='Đổi bộ đề';
    change.onclick=showSetup;
    card.appendChild(change);
  };

  document.addEventListener('keydown',event=>{
    const shortcut=q('shortcutOverlay');
    const lightbox=q('imageLightbox');
    if(event.key==='Escape'){
      if(shortcut&&!shortcut.classList.contains('hidden')){
        event.preventDefault();
        closeShortcuts();
        return;
      }
      if(lightbox&&!lightbox.classList.contains('hidden')){
        event.preventDefault();
        closeImageLightbox();
        return;
      }
    }

    const active=document.activeElement;
    const typing=['INPUT','TEXTAREA','SELECT'].includes(active?.tagName)||active?.isContentEditable;
    if(typing)return;

    if(event.key==='?'){
      event.preventDefault();
      openShortcuts();
      return;
    }
    if(event.key.toLowerCase()==='f'){
      event.preventDefault();
      showSetup();
      const advanced=document.querySelector('.setup-advanced');
      if(advanced)advanced.open=true;
      setTimeout(()=>q('searchInput')?.focus(),250);
      return;
    }

    if(!q('qPos')||q('studyTabPanel')?.classList.contains('hidden'))return;
    if(['1','2','3','4'].includes(event.key)){
      const option=document.querySelectorAll('#options .option')[Number(event.key)-1];
      if(option&&!option.disabled){
        event.preventDefault();
        option.click();
      }
      return;
    }
    if(event.key==='ArrowLeft'){
      event.preventDefault();
      move(-1);
      return;
    }
    if(event.key==='ArrowRight'){
      event.preventDefault();
      move(1);
      return;
    }
    if(event.key.toLowerCase()==='u'){
      event.preventDefault();
      goToNextUnanswered();
      return;
    }
    if(event.key.toLowerCase()==='r'){
      event.preventDefault();
      retryWrongCurrent();
    }
  });

  document.addEventListener('DOMContentLoaded',()=>{
    bindExtraControls();
    q('shortcutOverlay')?.addEventListener('click',event=>{
      if(event.target===q('shortcutOverlay'))closeShortcuts();
    });
    q('imageLightbox')?.addEventListener('click',event=>{
      if(event.target===q('imageLightbox'))closeImageLightbox();
    });
    q('closeImageLightbox')?.addEventListener('click',closeImageLightbox);
  });
})();
