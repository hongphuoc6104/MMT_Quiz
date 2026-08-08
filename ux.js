(() => {
  let paletteHidden=false;
  let toastTimer=null;

  const q=id=>document.getElementById(id);

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
    window.scrollTo({top:Math.max(0,el.getBoundingClientRect().top+window.scrollY-8),behavior:'smooth'});
  }

  function decorateOptions(){
    document.querySelectorAll('#options .option').forEach((btn,i)=>{
      const key=document.createElement('span');
      key.className='answer-key-hint';
      key.textContent=i+1;
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
      if(answer?.selected){
        btn.classList.add(answer.selected===question.correct_option_id?'done':'wrong');
      }
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
    btn.textContent=paletteHidden?'Hiện danh sách câu':'Ẩn danh sách câu';
    btn.setAttribute('aria-expanded',String(!paletteHidden));
  }

  function toggleQuestionList(){
    paletteHidden=!paletteHidden;
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
      return answer?.selected&&answer.selected!==question.correct_option_id;
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
    paletteHidden=false;
    q('quizArea')?.classList.remove('hidden');
    switchTab('study');
    render();
    scrollToQuiz();
  }

  function openShortcuts(){q('shortcutOverlay')?.classList.remove('hidden')}
  function closeShortcuts(){q('shortcutOverlay')?.classList.add('hidden')}

  function bindExtraControls(){
    const unanswered=q('nextUnansweredBtn');
    const toggle=q('toggleQuestionListBtn');
    const retry=q('retryWrongBtn');
    const help=q('shortcutHelpBtn');
    const close=q('closeShortcutBtn');
    if(unanswered)unanswered.onclick=goToNextUnanswered;
    if(toggle)toggle.onclick=toggleQuestionList;
    if(retry)retry.onclick=retryWrongCurrent;
    if(help)help.onclick=openShortcuts;
    if(close)close.onclick=closeShortcuts;
    applyPaletteVisibility();
  }

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
    const next=q('nextBtn');
    if(next&&state.idx===state.pool.length-1)next.textContent='Xem kết quả';
  };

  const baseStart=start;
  start=function(){
    paletteHidden=false;
    baseStart();
  };

  const baseStartWrongSet=startWrongSet;
  startWrongSet=function(setId){
    paletteHidden=false;
    baseStartWrongSet(setId);
  };

  document.addEventListener('keydown',event=>{
    const overlay=q('shortcutOverlay');
    if(event.key==='Escape'&&!overlay?.classList.contains('hidden')){
      event.preventDefault();
      closeShortcuts();
      return;
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
      switchTab('study');
      q('searchInput')?.focus();
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
  });
})();
