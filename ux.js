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

  const baseSolutionHtml=solutionHtml;
  solutionHtml=function(question,s,order){
    if(!s)return baseSolutionHtml(question,s,order);

    const calc=s.calculation?`
      <details class="solution-details calculation-details" open>
        <summary>🧮 Bài giải / công thức</summary>
        <div class="solution-details-body">
          <h5 class="calc-title">${escapeHtml(s.calculation.title)}</h5>
          <ol>${s.calculation.steps.map(step=>`<li>${escapeHtml(step)}</li>`).join('')}</ol>
          ${s.calculation.result?`<p class="calc-result"><b>Kết quả:</b> ${escapeHtml(s.calculation.result)}</p>`:''}
        </div>
      </details>`:'';

    const optionRows=s.options.map(item=>{
      const letter=letters[order.indexOf(item.id)];
      const correct=answerIsCorrect(question,item.id);
      return `<article class="option-analysis ${correct?'is-correct':'is-wrong'}">
        <h5>${correct?'✅':'❌'} ${letter}. ${escapeHtml(item.text)}</h5>
        <p><b>Vì sao ${correct?'chọn':'không chọn'}:</b> ${escapeHtml(item.why)}</p>
        <p><b>Khi nào phương án này đúng / dùng được:</b> ${escapeHtml(item.when)}</p>
      </article>`;
    }).join('');

    const mistakes=(s.commonMistakes||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('');
    const sources=question.sources?.length?`<div class="source-note"><b>Nguồn/đối chiếu:</b> ${question.sources.map(escapeHtml).join(', ')}</div>`:'';

    return `<div class="solution">
      <div class="solution-quick">
        <section class="quick-explanation">
          <h4>💡 Giải thích nhanh</h4>
          <p>${escapeHtml(s.reasoning)}</p>
        </section>
        <section class="memory-card">
          <h4>🧠 Ghi nhớ</h4>
          <p>${escapeHtml(s.summary)}</p>
        </section>
      </div>
      ${calc}
      <details class="solution-details">
        <summary>📘 Kiến thức nền</summary>
        <div class="solution-details-body"><p>${escapeHtml(s.knowledge)}</p></div>
      </details>
      <details class="solution-details">
        <summary>🧩 Phân tích từng đáp án A/B/C/D</summary>
        <div class="solution-details-body"><div class="option-analysis-list">${optionRows}</div></div>
      </details>
      <details class="solution-details">
        <summary>⚠️ Lỗi dễ mắc và nguồn đối chiếu</summary>
        <div class="solution-details-body">${mistakes?`<ul>${mistakes}</ul>`:'<p>Không có ghi chú lỗi riêng cho câu này.</p>'}${sources}</div>
      </details>
    </div>`;
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
