'use strict';

const DATA=window.QUIZ_DATA;
const SOLUTIONS=window.MANUAL_SOLUTIONS||{};
const $=s=>document.querySelector(s);
const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const state={pool:[],idx:0,answered:{},score:0,mode:'study',reviewSet:null};
const SOURCE_PAGE_IMAGES={1:'assets/source-page-01.png',10:'assets/source-page-10.png',19:'assets/source-page-19.png',21:'assets/source-page-21.png',49:'assets/source-page-49.png',56:'assets/source-page-56.png'};
let quizShellTemplate='';

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function uniqueOptions(q){const seen=new Set(),out=[];for(const o of q.options||[]){if(!o?.id||seen.has(o.id))continue;seen.add(o.id);out.push({id:o.id,text:o.text})}return out}
function solutionFor(q){return SOLUTIONS[q.id]}
function optionText(q,id){const s=solutionFor(q);if(s?.option_text_overrides?.[id]!=null)return s.option_text_overrides[id];if(s?.extraOptions?.[id]!=null)return s.extraOptions[id];return uniqueOptions(q).find(o=>o.id===id)?.text??id}
function effectiveOptions(q){const s=solutionFor(q)||{},base=uniqueOptions(q).map(o=>({id:o.id,text:optionText(q,o.id)}));const have=new Set(base.map(o=>o.id));for(const [id,text] of Object.entries(s.extraOptions||{})){if(!have.has(id)){base.push({id,text});have.add(id)}}return base}
function correctIds(q){const s=solutionFor(q)||{};if(Array.isArray(s.correct_option_ids)&&s.correct_option_ids.length)return [...new Set(s.correct_option_ids)];return [s.correct_option_id||q.correct_option_id]}
function isCorrectAnswer(q,id){return correctIds(q).includes(id)}
function primaryCorrectId(q){return correctIds(q)[0]}

function validateManualSolutions(){
  if(!DATA||!Array.isArray(DATA.questions))throw new Error('Không tìm thấy dữ liệu câu hỏi.');
  const expected=DATA.metadata?.question_count||DATA.questions.length;
  const ids=Object.keys(SOLUTIONS);
  if(ids.length!==expected)throw new Error(`Lời giải thủ công chưa đủ: cần ${expected}, hiện có ${ids.length}.`);
  const questionIds=new Set(DATA.questions.map(q=>q.id));
  const extras=ids.filter(id=>!questionIds.has(id));
  if(extras.length)throw new Error(`Có lời giải không khớp ID câu hỏi: ${extras.slice(0,8).join(', ')}`);
  for(const q of DATA.questions){
    const s=SOLUTIONS[q.id];
    if(!s)throw new Error(`Thiếu lời giải thủ công: ${q.id}`);
    if(!s.knowledge||!s.reasoning||!s.summary)throw new Error(`Lời giải chưa đủ phần kiến thức/lập luận/tóm tắt: ${q.id}`);
    const opts=effectiveOptions(q);
    if(!opts.length)throw new Error(`Câu không có phương án: ${q.id}`);
    for(const o of opts){const a=s.options?.[o.id];if(!a?.why||!a?.when)throw new Error(`Thiếu phân tích phương án ${o.id} của ${q.id}`)}
    for(const id of correctIds(q)){if(!opts.some(o=>o.id===id))throw new Error(`Đáp án đúng ${id} không tồn tại trong ${q.id}`)}
    if(s.calculation){if(!s.calculation.title||!Array.isArray(s.calculation.steps)||!s.calculation.steps.length||!s.calculation.result)throw new Error(`Bài giải tính toán chưa đầy đủ: ${q.id}`)}
  }
  return true;
}

function setup(){
  try{validateManualSolutions()}catch(e){document.body.innerHTML=`<main class="wrap"><div class="card"><h2>Không thể mở bộ đề</h2><p>${escapeHtml(e.message)}</p><p>Trang này không tạo lời giải thay thế. Dữ liệu thủ công phải đủ trước khi học.</p></div></main>`;throw e}
  quizShellTemplate=$('#quizArea')?.innerHTML||'';
  DATA.metadata.sets.forEach(s=>$('#setSelect').add(new Option(`${s.name} (${s.count} câu)`,s.id)));
  $('#setSelect').add(new Option(`Tất cả (${DATA.metadata.question_count} câu)`,'ALL'),0);
  $('#setSelect').value=DATA.metadata.sets[0].id;
  $('#setSelect').onchange=buildChapters;
  buildChapters();
  bindTopControls();
  bindQuizControls();
  updateWrongCount();
  renderWrongReviewList();
}
function bindTopControls(){
  $('#startBtn').onclick=start;
  $('#resetBtn').onclick=resetProgress;
  $('#studyTab').onclick=()=>switchTab('study');
  $('#wrongTab').onclick=()=>switchTab('wrong');
  $('#clearWrongBtn').onclick=clearWrongBank;
}
function bindQuizControls(){
  const prev=$('#prevBtn'),next=$('#nextBtn'),retry=$('#retryWrong');
  if(prev)prev.onclick=()=>move(-1);
  if(next)next.onclick=()=>move(1);
  if(retry)retry.onclick=retryWrong;
}
function ensureQuizShell(){
  const area=$('#quizArea');if(!area)return;
  if(!$('#qText')){area.innerHTML=quizShellTemplate;bindQuizControls()}
}
function switchTab(tab){
  const study=tab==='study';
  $('#studyTab')?.classList.toggle('active',study);$('#studyTab')?.setAttribute('aria-selected',String(study));
  $('#wrongTab')?.classList.toggle('active',!study);$('#wrongTab')?.setAttribute('aria-selected',String(!study));
  $('#studyTabPanel')?.classList.toggle('hidden',!study);$('#wrongTabPanel')?.classList.toggle('hidden',study);
  if(!study)renderWrongReviewList();
}
function buildChapters(){const s=$('#setSelect').value,ch=$('#chapterSelect');ch.innerHTML='<option value="ALL">Tất cả chương</option>';const vals=[...new Set(DATA.questions.filter(q=>s==='ALL'||q.set===s).map(q=>q.chapter).filter(Boolean))];vals.forEach(v=>ch.add(new Option(v,v)))}
function start(){
  ensureQuizShell();
  let p=DATA.questions.filter(q=>($('#setSelect').value==='ALL'||q.set===$('#setSelect').value)&&($('#chapterSelect').value==='ALL'||q.chapter===$('#chapterSelect').value));
  const term=$('#searchInput').value.trim().toLowerCase();if(term)p=p.filter(q=>(q.question+' '+effectiveOptions(q).map(o=>o.text).join(' ')).toLowerCase().includes(term));
  if($('#shuffleQ').checked)p=shuffle(p);
  state.pool=p;state.idx=0;state.answered={};state.score=0;state.mode='study';state.reviewSet=null;
  $('#quizArea').classList.remove('hidden');switchTab('study');render();
}
function optionOrder(q){
  const ans=state.answered[q.id]||(state.answered[q.id]={});
  const ids=effectiveOptions(q).map(o=>o.id);
  if(!ans.order||ans.order.length!==ids.length||ans.order.some(id=>!ids.includes(id)))ans.order=$('#shuffleA')?.checked?shuffle(ids):ids;
  return ans.order;
}
function render(){
  ensureQuizShell();const q=state.pool[state.idx];
  if(!q){$('#quizArea').innerHTML='<div class="card"><h2>Không tìm thấy câu hỏi phù hợp.</h2></div>';return}
  const ans=state.answered[q.id];
  $('#qPos').textContent=`Câu ${state.idx+1}/${state.pool.length}`;
  $('#qSource').textContent=`${q.set} • câu gốc ${q.source_number} • trang ${q.source_page}`;
  $('#qText').textContent=q.question;
  const badge=$('#statusBadge');badge.className='badge '+q.verification;badge.textContent=q.verification==='corrected'?'Đã sửa đáp án':q.verification==='warning'?'Cần lưu ý':'Đã đối chiếu';
  const warn=$('#warningBox');warn.textContent=q.warning||'';warn.classList.toggle('hidden',!q.warning);
  renderSourceImage(q);
  const byId=Object.fromEntries(effectiveOptions(q).map(o=>[o.id,o]));const box=$('#options');box.innerHTML='';
  optionOrder(q).forEach((id,i)=>{const o=byId[id],b=document.createElement('button');b.type='button';b.className='option';b.innerHTML=`<span class="letter">${letters[i]}</span><span>${escapeHtml(o.text)}</span>`;b.onclick=()=>choose(q,id);if(ans?.selected){b.disabled=true;if(isCorrectAnswer(q,id))b.classList.add('correct');if(id===ans.selected&&!isCorrectAnswer(q,id))b.classList.add('wrong')}box.appendChild(b)});
  showFeedback(q,ans);updateStats();
  $('#prevBtn').disabled=state.idx===0;$('#nextBtn').textContent=state.idx===state.pool.length-1?'Xem kết quả':'Câu tiếp →';
}
function sourceImageFor(q){if(q.image)return q.image;const depends=/hình|sơ đồ|cửa sổ|diagram|figure/i.test(q.warning||'');return depends?SOURCE_PAGE_IMAGES[q.source_page]||null:null}
function renderSourceImage(q){
  const wrap=$('#sourceImageWrap'),img=$('#sourceImage'),link=$('#sourceImageLink'),caption=wrap?.querySelector('figcaption'),src=sourceImageFor(q);if(!wrap||!img||!link)return;
  if(src){img.src=src;img.alt=`Ảnh/trang đề gốc - ${q.set}, câu ${q.source_number}, trang ${q.source_page}`;link.href=src;if(caption)caption.textContent='Ảnh/trang đề gốc được giữ nguyên. Bấm vào ảnh để mở kích thước đầy đủ.';wrap.classList.remove('hidden')}
  else{wrap.classList.add('hidden');img.removeAttribute('src');link.removeAttribute('href')}
}
function choose(q,id){const a=state.answered[q.id]||(state.answered[q.id]={});if(a.selected)return;a.selected=id;if(isCorrectAnswer(q,id))state.score++;else persistWrongId(q.id);render();saveProgress();updateWrongCount()}
function correctAnswerLabel(q){const order=optionOrder(q);return correctIds(q).map(id=>{const pos=order.indexOf(id);return `${pos>=0?letters[pos]:id.toUpperCase()}. ${escapeHtml(optionText(q,id))}`}).join(' hoặc ')}
function showFeedback(q,ans){const f=$('#feedback');if(!ans?.selected){f.className='feedback';f.innerHTML='<div class="pre-solution-note">Chọn một đáp án để mở lời giải thủ công đã viết sẵn cho chính câu này.</div>';return}const ok=isCorrectAnswer(q,ans.selected),s=solutionFor(q);f.className='feedback show '+(ok?'ok':'bad');f.innerHTML=`<h3>${ok?'✅ Chính xác':'❌ Chưa đúng'}</h3><div class="answer-line"><b>Đáp án đúng:</b> ${correctAnswerLabel(q)}</div>${solutionHtml(q,s,optionOrder(q))}`}
function solutionHtml(q,s,order){
  const calc=s.calculation?`<section class="solution-section calculation"><h4>🧮 Bài giải / công thức</h4><h5>${escapeHtml(s.calculation.title)}</h5><ol>${s.calculation.steps.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol><p class="calc-result"><b>Kết quả/đối chiếu:</b> ${escapeHtml(s.calculation.result)}</p></section>`:'';
  const rows=order.map(id=>{const a=s.options[id],pos=order.indexOf(id),correct=isCorrectAnswer(q,id);return `<article class="option-analysis ${correct?'is-correct':'is-wrong'}"><h5>${correct?'✅':'❌'} ${letters[pos]}. ${escapeHtml(optionText(q,id))} — ${correct?'Đúng trong câu này':'Không chọn trong câu này'}</h5><p><b>Vì sao ${correct?'đúng':'không chọn'}:</b> ${escapeHtml(a.why)}</p><p><b>Khi nào phương án này đúng / dùng được:</b> ${escapeHtml(a.when)}</p></article>`}).join('');
  const mistakes=(s.commonMistakes||[]).length?`<section class="solution-section"><h4>⚠️ Lỗi dễ mắc</h4><ul>${s.commonMistakes.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></section>`:'';
  return `<div class="solution"><section class="solution-section"><h4>📘 Kiến thức nền</h4><p>${escapeHtml(s.knowledge)}</p></section><section class="solution-section"><h4>🔎 Lập luận cho câu này</h4><p>${escapeHtml(s.reasoning)}</p></section>${calc}<section class="solution-section"><h4>🧩 Phân tích tất cả phương án</h4><div class="option-analysis-list">${rows}</div></section>${mistakes}<section class="solution-section summary-box"><h4>🧠 Ghi nhớ</h4><p>${escapeHtml(s.summary)}</p></section>${q.sources?.length?`<div class="source-note">Nguồn/đối chiếu trong dữ liệu: ${q.sources.map(escapeHtml).join(', ')}</div>`:''}</div>`
}
function move(d){if(!state.pool.length)return;if(state.idx===state.pool.length-1&&d>0){summary();return}state.idx=Math.max(0,Math.min(state.pool.length-1,state.idx+d));render();window.scrollTo({top:0,behavior:'smooth'})}
function updateStats(){const done=Object.values(state.answered).filter(x=>x.selected).length;$('#statTotal').textContent=state.pool.length;$('#statDone').textContent=done;$('#statScore').textContent=state.score;$('#statWrong').textContent=done-state.score;$('#progressBar').style.width=(state.pool.length?done/state.pool.length*100:0)+'%'}
function summary(){const done=Object.values(state.answered).filter(x=>x.selected).length,pct=done?Math.round(state.score/done*100):0;$('#quizArea').innerHTML=`<div class="card"><h2>Hoàn thành lượt học</h2><p>Bạn trả lời đúng <b>${state.score}/${done}</b> câu (${pct}%).</p><button id="again" class="btn primary">Làm lại bộ này</button> <button id="wrongOnly" class="btn ghost">Ôn câu sai lượt này</button></div>`;$('#again').onclick=start;$('#wrongOnly').onclick=retryWrong}
function retryWrong(){const wrong=state.pool.filter(q=>state.answered[q.id]?.selected&&!isCorrectAnswer(q,state.answered[q.id].selected));if(!wrong.length){alert('Chưa có câu sai trong lượt hiện tại để ôn.');return}ensureQuizShell();state.pool=$('#shuffleQ')?.checked?shuffle(wrong):wrong;state.idx=0;state.answered={};state.score=0;state.mode='wrongReview';state.reviewSet=wrong.every(x=>x.set===wrong[0].set)?wrong[0].set:null;$('#quizArea').classList.remove('hidden');switchTab('study');render()}
function saveProgress(){try{localStorage.setItem('networkQuizLast',JSON.stringify({set:$('#setSelect')?.value,at:Date.now()}))}catch(e){}}
function resetProgress(){state.answered={};state.score=0;if(state.pool.length){ensureQuizShell();render()}}
function getWrongIds(){try{const a=JSON.parse(localStorage.getItem('networkQuizWrongIds')||'[]');return Array.isArray(a)?a.filter(id=>DATA.questions.some(q=>q.id===id)):[]}catch(e){return[]}}
function setWrongIds(ids){try{localStorage.setItem('networkQuizWrongIds',JSON.stringify([...new Set(ids)]))}catch(e){}}
function persistWrongId(id){const ids=getWrongIds();if(!ids.includes(id)){ids.push(id);setWrongIds(ids)}}
function updateWrongCount(){const n=getWrongIds().length;const el=$('#wrongCount');if(el)el.textContent=n}
function clearWrongBank(){if(!getWrongIds().length)return;if(!confirm('Xóa toàn bộ danh sách câu từng làm sai?'))return;setWrongIds([]);updateWrongCount();renderWrongReviewList()}
function renderWrongReviewList(){
  const box=$('#wrongReviewList');if(!box)return;const ids=getWrongIds(),qs=ids.map(id=>DATA.questions.find(q=>q.id===id)).filter(Boolean);updateWrongCount();
  if(!qs.length){box.innerHTML='<div class="empty-state">Chưa có câu sai nào được lưu. Khi bạn trả lời sai, câu đó sẽ xuất hiện ở đây.</div>';return}
  const groups=new Map();for(const q of qs){if(!groups.has(q.set))groups.set(q.set,[]);groups.get(q.set).push(q)}
  box.innerHTML=[...groups.entries()].map(([set,items])=>`<div class="wrong-group"><div><b>${escapeHtml(set)}</b> • ${items.length} câu</div><button class="btn ghost wrong-set-start" data-set="${escapeHtml(set)}">Ôn bộ này</button></div>`).join('');
  box.querySelectorAll('.wrong-set-start').forEach(b=>b.onclick=()=>startWrongSet(b.dataset.set));
}
function startWrongSet(setId){const ids=new Set(getWrongIds()),p=DATA.questions.filter(q=>ids.has(q.id)&&(setId==='ALL'||q.set===setId));if(!p.length)return;ensureQuizShell();state.pool=$('#shuffleQ')?.checked?shuffle(p):p;state.idx=0;state.answered={};state.score=0;state.mode='wrongReview';state.reviewSet=setId;$('#quizArea').classList.remove('hidden');switchTab('study');render()}
function escapeHtml(s){return String(s==null?'':s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

document.addEventListener('DOMContentLoaded',setup);
