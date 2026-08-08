const DATA=window.QUIZ_DATA;
const STATIC_DATA=window.STATIC_SOLUTION_DATA;
const SOLUTIONS=STATIC_DATA?.solutions||{};
const $=s=>document.querySelector(s);
const state={pool:[],idx:0,answered:{},score:0,mode:'normal',reviewSet:null};
const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SOURCE_PAGE_IMAGES={1:'assets/source-page-01.png',10:'assets/source-page-10.png',19:'assets/source-page-19.png',21:'assets/source-page-21.png',49:'assets/source-page-49.png',56:'assets/source-page-56.png'};
const WRONG_STORAGE_KEY='networkQuizWrongV1';
let quizShellHtml='';

function shuffle(a){
  const b=[...a];
  for(let i=b.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [b[i],b[j]]=[b[j],b[i]];
  }
  return b;
}

function validateStaticSolutions(){
  if(!STATIC_DATA||STATIC_DATA.metadata?.question_count!==DATA.metadata.question_count){
    throw new Error(`Thiếu dữ liệu lời giải tĩnh: cần ${DATA.metadata.question_count} câu.`);
  }
  const missing=DATA.questions.filter(q=>!SOLUTIONS[q.id]).map(q=>q.id);
  if(missing.length)throw new Error(`Thiếu lời giải tĩnh cho ${missing.length} câu: ${missing.slice(0,10).join(', ')}`);
  for(const q of DATA.questions){
    const s=SOLUTIONS[q.id];
    if(!Array.isArray(s.options)||s.options.length!==q.options.length){
      throw new Error(`Lời giải tĩnh không đủ phương án: ${q.id}`);
    }
  }
}

function setup(){
  try{
    validateStaticSolutions();
  }catch(e){
    document.body.innerHTML=`<main class="wrap"><div class="card"><h2>Không thể mở bộ đề</h2><p>${escapeHtml(e.message)}</p><p>Trang không tự sinh lời giải thay thế. Hãy sửa dữ liệu tĩnh trước khi học.</p></div></main>`;
    throw e;
  }

  quizShellHtml=$('#quizArea').innerHTML;

  const set=$('#setSelect');
  DATA.metadata.sets.forEach(s=>set.add(new Option(`${s.name} (${s.count} câu)`,s.id)));
  set.add(new Option(`Tất cả (${DATA.metadata.question_count} câu)`,'ALL'),0);
  set.value=DATA.metadata.sets[0].id;
  set.onchange=buildChapters;

  buildChapters();
  bindTabs();
  bindQuizControls();
  $('#startBtn').onclick=start;
  $('#resetBtn').onclick=resetProgress;
  renderWrongBank();
  switchTab('study');
}

function bindTabs(){
  $('#tabStudy').onclick=()=>switchTab('study');
  $('#tabWrong').onclick=()=>{
    renderWrongBank();
    switchTab('wrong');
  };
}

function switchTab(tab){
  const isStudy=tab==='study';
  $('#studyTabPanel').classList.toggle('hidden',!isStudy);
  $('#wrongTabPanel').classList.toggle('hidden',isStudy);
  $('#tabStudy').classList.toggle('active',isStudy);
  $('#tabWrong').classList.toggle('active',!isStudy);
  $('#tabStudy').setAttribute('aria-selected',String(isStudy));
  $('#tabWrong').setAttribute('aria-selected',String(!isStudy));
}

function bindQuizControls(){
  const prev=$('#prevBtn');
  const next=$('#nextBtn');
  if(prev)prev.onclick=()=>move(-1);
  if(next)next.onclick=()=>move(1);
}

function ensureQuizShell(){
  if($('#qPos'))return;
  $('#quizArea').innerHTML=quizShellHtml;
  bindQuizControls();
}

function buildChapters(){
  const s=$('#setSelect').value;
  const ch=$('#chapterSelect');
  ch.innerHTML='<option value="ALL">Tất cả chương</option>';
  const vals=[...new Set(DATA.questions.filter(q=>s==='ALL'||q.set===s).map(q=>q.chapter).filter(Boolean))];
  vals.forEach(v=>ch.add(new Option(v,v)));
}

function start(){
  ensureQuizShell();
  let p=DATA.questions.filter(q=>(
    $('#setSelect').value==='ALL'||q.set===$('#setSelect').value)&&(
    $('#chapterSelect').value==='ALL'||q.chapter===$('#chapterSelect').value
  ));
  const term=$('#searchInput').value.trim().toLowerCase();
  if(term)p=p.filter(q=>(q.question+' '+q.options.map(o=>o.text).join(' ')).toLowerCase().includes(term));
  if($('#shuffleQ').checked)p=shuffle(p);

  state.pool=p;
  state.idx=0;
  state.answered={};
  state.score=0;
  state.mode='normal';
  state.reviewSet=null;

  switchTab('study');
  $('#quizArea').classList.remove('hidden');
  render();
}

function optionOrder(q){
  if(!state.answered[q.id]?.order){
    state.answered[q.id]=state.answered[q.id]||{};
    state.answered[q.id].order=$('#shuffleA').checked?shuffle(q.options.map(o=>o.id)):q.options.map(o=>o.id);
  }
  return state.answered[q.id].order;
}

function render(){
  const q=state.pool[state.idx];
  if(!q){
    $('#quizArea').innerHTML='<div class="card"><h2>Không tìm thấy câu hỏi phù hợp.</h2></div>';
    return;
  }

  const ans=state.answered[q.id];
  $('#qPos').textContent=`Câu ${state.idx+1}/${state.pool.length}`;
  $('#qSource').textContent=`${state.mode==='wrongReview'?'Ôn câu sai • ':''}${q.set} • câu gốc ${q.source_number} • trang ${q.source_page}`;
  $('#qText').textContent=q.question;

  const badge=$('#statusBadge');
  badge.className='badge '+q.verification;
  badge.textContent=q.verification==='corrected'?'Đã sửa đáp án':q.verification==='warning'?'Cần lưu ý':'Đã đối chiếu';

  const warn=$('#warningBox');
  warn.textContent=q.warning||'';
  warn.classList.toggle('hidden',!q.warning);

  renderSourceImage(q);

  const byId=Object.fromEntries(q.options.map(o=>[o.id,o]));
  const box=$('#options');
  box.innerHTML='';
  optionOrder(q).forEach((id,i)=>{
    const o=byId[id];
    const b=document.createElement('button');
    b.className='option';
    b.innerHTML=`<span class="letter">${letters[i]}</span><span>${escapeHtml(o.text)}</span>`;
    b.onclick=()=>choose(q,id);
    if(ans?.selected){
      b.disabled=true;
      if(id===q.correct_option_id)b.classList.add('correct');
      if(id===ans.selected&&id!==q.correct_option_id)b.classList.add('wrong');
    }
    box.appendChild(b);
  });

  showFeedback(q,ans);
  updateStats();
  $('#prevBtn').disabled=state.idx===0;
  $('#nextBtn').textContent=state.idx===state.pool.length-1?'Kết thúc':'Câu tiếp →';
}

function sourceImageFor(q){
  if(q.image)return q.image;
  const dependsOnVisual=/hình|sơ đồ|cửa sổ|diagram|figure/i.test(q.warning||'');
  return dependsOnVisual?SOURCE_PAGE_IMAGES[q.source_page]||null:null;
}

function renderSourceImage(q){
  const wrap=$('#sourceImageWrap');
  const img=$('#sourceImage');
  const link=$('#sourceImageLink');
  const src=sourceImageFor(q);
  if(src){
    img.src=src;
    img.alt=`Ảnh/trang đề gốc - ${q.set}, câu ${q.source_number}, trang ${q.source_page}`;
    link.href=src;
    wrap.classList.remove('hidden');
  }else{
    wrap.classList.add('hidden');
    img.removeAttribute('src');
    link.removeAttribute('href');
  }
}

function choose(q,id){
  if(state.answered[q.id]?.selected)return;
  state.answered[q.id].selected=id;
  const correct=id===q.correct_option_id;
  if(correct)state.score++;
  updateWrongBank(q,correct);
  render();
  saveProgress();
}

function showFeedback(q,ans){
  const f=$('#feedback');
  if(!ans?.selected){
    f.className='feedback';
    f.innerHTML='<div class="pre-solution-note">Chọn một đáp án để mở lời giải tĩnh đã lưu sẵn cho chính câu này.</div>';
    return;
  }
  const correct=ans.selected===q.correct_option_id;
  const order=optionOrder(q);
  const pos=order.indexOf(q.correct_option_id);
  const text=q.options.find(o=>o.id===q.correct_option_id).text;
  const solution=SOLUTIONS[q.id];
  if(!solution)throw new Error(`Không có lời giải tĩnh cho ${q.id}`);
  f.className='feedback show '+(correct?'ok':'bad');
  f.innerHTML=`<h3>${correct?'✅ Chính xác':'❌ Chưa đúng'}</h3><div class="answer-line"><b>Đáp án:</b> ${letters[pos]}. ${escapeHtml(text)}</div>${solutionHtml(q,solution,order)}`;
}

function solutionHtml(q,s,order){
  const calc=s.calculation
    ?`<section class="solution-section calculation"><h4>🧮 Bài giải / công thức</h4><h5>${escapeHtml(s.calculation.title)}</h5><ol>${s.calculation.steps.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol>${s.calculation.result?`<p class="calc-result"><b>Kết quả/đối chiếu:</b> ${escapeHtml(s.calculation.result)}</p>`:''}</section>`
    :'';

  const optionRows=s.options.map(x=>{
    const letter=letters[order.indexOf(x.id)];
    return `<article class="option-analysis ${x.correct?'is-correct':'is-wrong'}"><h5>${x.correct?'✅':'❌'} ${letter}. ${escapeHtml(x.text)} — ${x.correct?'Đáp án của câu':'Không chọn trong câu này'}</h5><p><b>Vì sao ${x.correct?'chọn':'không chọn'}:</b> ${escapeHtml(x.why)}</p><p><b>Khi nào phương án này đúng / dùng được:</b> ${escapeHtml(x.when)}</p></article>`;
  }).join('');

  return `<div class="solution"><section class="solution-section"><h4>📘 Kiến thức nền</h4><p>${escapeHtml(s.knowledge)}</p></section><section class="solution-section"><h4>🔎 Lập luận cho câu này</h4><p>${escapeHtml(s.reasoning)}</p></section>${calc}<section class="solution-section"><h4>🧩 Phân tích tất cả phương án</h4><div class="option-analysis-list">${optionRows}</div></section><section class="solution-section"><h4>⚠️ Lỗi dễ mắc</h4><ul>${s.commonMistakes.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></section><section class="solution-section summary-box"><h4>🧠 Ghi nhớ</h4><p>${escapeHtml(s.summary)}</p></section>${q.sources?.length?`<div class="source-note">Nguồn/đối chiếu trong dữ liệu: ${q.sources.map(escapeHtml).join(', ')}</div>`:''}</div>`;
}

function move(d){
  if(state.idx===state.pool.length-1&&d>0){
    summary();
    return;
  }
  state.idx=Math.max(0,Math.min(state.pool.length-1,state.idx+d));
  render();
  window.scrollTo({top:$('#appTabs').offsetTop,behavior:'smooth'});
}

function updateStats(){
  const done=Object.values(state.answered).filter(x=>x.selected).length;
  $('#statTotal').textContent=state.pool.length;
  $('#statDone').textContent=done;
  $('#statScore').textContent=state.score;
  $('#statWrong').textContent=done-state.score;
  $('#progressBar').style.width=(state.pool.length?done/state.pool.length*100:0)+'%';
}

function summary(){
  const done=Object.values(state.answered).filter(x=>x.selected).length;
  const pct=done?Math.round(state.score/done*100):0;
  const reviewName=state.reviewSet?setName(state.reviewSet):'';
  const remaining=state.reviewSet?wrongIdsForSet(state.reviewSet).length:null;

  $('#quizArea').innerHTML=`<div class="card completion-card"><div><h2>Hoàn thành lượt học</h2><p>Bạn trả lời đúng <b>${state.score}/${done}</b> câu (${pct}%).</p>${remaining!==null?`<p>Trong <b>${escapeHtml(reviewName)}</b> còn <b>${remaining}</b> câu cần ôn lại.</p>`:''}<p class="completion-hint">Các câu còn sai luôn nằm trong tab <b>❌ Câu đã sai</b> ở phía trên.</p><button id="again" class="btn primary">${state.mode==='wrongReview'?'Làm lại các câu sai còn lại':'Làm lại bộ này'}</button></div></div>`;
  $('#again').onclick=()=>state.mode==='wrongReview'&&state.reviewSet?startWrongSet(state.reviewSet):start();
  renderWrongBank();
}

function loadWrongBank(){
  try{
    const parsed=JSON.parse(localStorage.getItem(WRONG_STORAGE_KEY)||'{}');
    return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
  }catch(e){
    return {};
  }
}

function saveWrongBank(bank){
  try{
    localStorage.setItem(WRONG_STORAGE_KEY,JSON.stringify(bank));
  }catch(e){}
}

function wrongIdsForSet(setId){
  const valid=new Set(DATA.questions.filter(q=>q.set===setId).map(q=>q.id));
  return [...new Set(loadWrongBank()[setId]||[])].filter(id=>valid.has(id));
}

function updateWrongBank(q,correct){
  const bank=loadWrongBank();
  const ids=new Set(bank[q.set]||[]);
  if(correct)ids.delete(q.id);
  else ids.add(q.id);

  if(ids.size)bank[q.set]=[...ids];
  else delete bank[q.set];

  saveWrongBank(bank);
  renderWrongBank();
}

function setName(setId){
  return DATA.metadata.sets.find(s=>s.id===setId)?.name||setId;
}

function renderWrongBank(){
  const list=$('#wrongReviewList');
  const totalEl=$('#wrongReviewTotal');
  const tabBadge=$('#wrongTabBadge');
  if(!list||!totalEl||!tabBadge)return;

  const byId=Object.fromEntries(DATA.questions.map(q=>[q.id,q]));
  const groups=[];
  let total=0;

  for(const s of DATA.metadata.sets){
    const ids=wrongIdsForSet(s.id);
    const qs=ids.map(id=>byId[id]).filter(Boolean).sort((a,b)=>a.source_number-b.source_number);
    if(!qs.length)continue;
    total+=qs.length;
    groups.push({set:s,qs});
  }

  totalEl.textContent=`${total} câu cần ôn`;
  tabBadge.textContent=total;
  tabBadge.classList.toggle('empty',total===0);

  if(!groups.length){
    list.innerHTML='<div class="wrong-empty"><b>🎉 Chưa có câu sai cần ôn.</b><span>Khi bạn chọn sai, câu đó sẽ tự xuất hiện ở tab này theo đúng bộ đề.</span></div>';
    return;
  }

  list.innerHTML=groups.map(({set,qs})=>`
    <article class="wrong-set-card">
      <div class="wrong-set-head">
        <div class="wrong-set-title">
          <b>${escapeHtml(set.name)}</b>
          <small>${qs.length} câu cần ôn lại</small>
        </div>
        <button class="btn primary wrong-set-start" data-set="${escapeHtml(set.id)}">Ôn lại ${qs.length} câu →</button>
      </div>
      <div class="wrong-question-chips">${qs.map(q=>`<span class="wrong-question-chip">Câu ${q.source_number}</span>`).join('')}</div>
    </article>
  `).join('');

  list.querySelectorAll('.wrong-set-start').forEach(btn=>{
    btn.onclick=()=>startWrongSet(btn.dataset.set);
  });
}

function startWrongSet(setId){
  const ids=new Set(wrongIdsForSet(setId));
  let p=DATA.questions.filter(q=>q.set===setId&&ids.has(q.id));
  if(!p.length){
    alert(`${setName(setId)} hiện không còn câu sai cần ôn.`);
    renderWrongBank();
    return;
  }

  ensureQuizShell();
  if($('#shuffleQ').checked)p=shuffle(p);

  state.pool=p;
  state.idx=0;
  state.answered={};
  state.score=0;
  state.mode='wrongReview';
  state.reviewSet=setId;

  switchTab('study');
  $('#quizArea').classList.remove('hidden');
  render();
  window.scrollTo({top:$('#appTabs').offsetTop,behavior:'smooth'});
}

function saveProgress(){
  try{
    localStorage.setItem('networkQuizLast',JSON.stringify({set:$('#setSelect').value,at:Date.now()}));
  }catch(e){}
}

function resetProgress(){
  state.answered={};
  state.score=0;
  if(state.pool.length){
    ensureQuizShell();
    render();
  }
}

function escapeHtml(s){
  return String(s==null?'':s).replace(/[&<>'"]/g,c=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    "'":'&#39;',
    '"':'&quot;'
  }[c]));
}

document.addEventListener('DOMContentLoaded',setup);
