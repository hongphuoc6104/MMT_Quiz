// Concise learning presentation: preserve the full stored solution, but make the default
// reading path shorter and emphasize networking terms that are worth memorizing.
(function(){
  const KEY_TERMS=[
    '1000BASE-LX','Go-Back-N','Selective Repeat','Stop-and-Wait','sliding window','cửa sổ trượt',
    'three-way handshake','bắt tay ba bước','connection-oriented','connectionless','full-duplex',
    'encapsulation','decapsulation','đóng gói','giải đóng gói','congestion control','flow control',
    'OSI','TCP','UDP','IPv4','IPv6','IP','ARP','RARP','ICMP','DNS','DHCP','HTTP','HTTPS','FTP','SMTP','POP3','IMAP','Telnet','SSH',
    'Ethernet','CSMA/CD','CSMA/CA','ALOHA','CDMA','TDMA','FDMA','FDM','TDM','Token Ring',
    'MAC','LLC','VLAN','NAT','CIDR','subnet mask','Subnet Mask','subnet','broadcast','network address','địa chỉ mạng','địa chỉ quảng bá',
    'router','switch','hub','bridge','gateway','packet','frame','segment','datagram','socket','port',
    'ACK','SEQ','SYN','FIN','RST','PSH','TTL','MTU','RTT','checksum','CRC','parity','chẵn lẻ',
    'analog','digital','Nyquist','Shannon','bandwidth','băng thông','SNR','sequence number','receive window','rwnd','cwnd',
    'Physical','Data Link','Network','Transport','Session','Presentation','Application'
  ];
  const DISPLAY_LIMITS={reasoning:330,summary:230};
  const escapeRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const keywordSource=KEY_TERMS.slice().sort((a,b)=>b.length-a.length).map(escapeRe).join('|');
  const techRe=new RegExp('('+keywordSource+'|\\b\\d{1,3}(?:\\.\\d{1,3}){3}(?:\\/\\d{1,2})?\\b|\\/(?:[12]?\\d|3[0-2])\\b|\\b\\d+(?:[.,]\\d+)?\\s*(?:Gbps|Mbps|Kbps|bps|GHz|MHz|kHz|Hz|ms|bytes?|bits?|km|m)\\b)','gi');

  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

  function tidy(v){
    let s=String(v??'').normalize('NFC').replace(/\s+/g,' ').trim();
    const drop=[
      /^Theo chức năng\/?chuẩn của giao thức hoặc tầng mạng được hỏi,?\s*/i,
      /^Lựa chọn phù hợp nhất với khái niệm trong câu hỏi là:\s*/i,
      /^Áp dụng dữ kiện hoặc phép tính trong đề,?\s*kết quả phù hợp là:\s*/i,
      /^Trong câu này,?\s*/i,
      /^Ở câu này,?\s*/i,
      /^Đúng\.\s*/i,
      /^Sai\.\s*/i
    ];
    for(const re of drop)s=s.replace(re,'');
    s=s.replace(/\s+([,.;:?])/g,'$1').replace(/([.!?])\1+/g,'$1').trim();
    return s;
  }

  function concise(v,max){
    const s=tidy(v);if(!s||s.length<=max)return s;
    const parts=s.match(/[^.!?]+[.!?]?/g)||[s];
    let out='';
    for(const p of parts){
      const next=(out+' '+p.trim()).trim();
      if(next.length>max&&out)break;
      out=next;
      if(out.length>=Math.min(max*.72,210))break;
    }
    return out&&out.length<s.length?out+' …':(s.slice(0,max).replace(/\s+\S*$/,'')+' …');
  }

  function mark(v,max){const s=max?concise(v,max):tidy(v);return esc(s).replace(techRe,'<strong class="key-term">$1</strong>');}

  function extractKeywords(text,correctText){
    const hay=(String(text||'')+' '+String(correctText||'')).toLowerCase();
    const found=[];
    for(const term of KEY_TERMS){
      if(hay.includes(term.toLowerCase())&&!found.some(x=>x.toLowerCase()===term.toLowerCase()))found.push(term);
      if(found.length===6)break;
    }
    const ct=tidy(correctText);
    if(ct&&ct.length<=34&&!/^(đúng|sai|tất cả.*)$/i.test(ct)&&!found.some(x=>x.toLowerCase()===ct.toLowerCase()))found.unshift(ct);
    return found.slice(0,6);
  }

  function optionAnalyses(s){
    if(Array.isArray(s?.options))return s.options;
    return Object.entries(s?.options||{}).map(([id,a])=>({id,...a}));
  }

  function buildSolutionHtml(q,s,order){
    const analyses=optionAnalyses(s);
    const byId=Object.fromEntries(analyses.map(x=>[x.id,x]));
    const qById=Object.fromEntries((q.options||[]).map(o=>[o.id,o]));
    const correctId=q.correct_option_id;
    const correctText=qById[correctId]?.text||byId[correctId]?.text||'';
    const keywords=extractKeywords([s.summary,s.reasoning,s.knowledge].join(' '),correctText);
    const keywordHtml=keywords.length?`<div class="memory-keywords"><span>🔑 Từ khóa:</span>${keywords.map(k=>`<span class="memory-chip">${esc(k)}</span>`).join('')}</div>`:'';

    // Only the always-visible path is shortened. Expanded study sections remain complete.
    const reason=mark(s.reasoning,DISPLAY_LIMITS.reasoning);
    const summary=mark(s.summary,DISPLAY_LIMITS.summary);

    const calc=s.calculation?`<section class="solution-section calculation quick-section"><h4>🧮 Cách tính cần nhớ</h4><h5>${mark(s.calculation.title)}</h5><ol>${(s.calculation.steps||[]).map(x=>`<li>${mark(x)}</li>`).join('')}</ol>${s.calculation.result?`<p class="calc-result"><b>Kết quả:</b> ${mark(s.calculation.result)}</p>`:''}</section>`:'';

    const ordered=(order||[]).map(id=>({id,a:byId[id]})).filter(x=>x.a);
    const rows=ordered.map(({id,a},i)=>{
      const correct=id===correctId;
      const text=qById[id]?.text||a.text||id;
      return `<article class="option-analysis ${correct?'is-correct':'is-wrong'}"><h5>${correct?'✅':'❌'} ${String.fromCharCode(65+i)}. ${mark(text)} — ${correct?'Đúng':'Không chọn'}</h5><p><b>${correct?'Lý do':'Vì sao sai'}:</b> ${mark(a.why)}</p><p class="when-line"><b>Dùng khi:</b> ${mark(a.when)}</p></article>`;
    }).join('');

    const mistakes=(s.commonMistakes||[]).length?`<details class="study-details"><summary>⚠️ Lỗi dễ nhầm</summary><div class="details-body"><ul>${s.commonMistakes.map(x=>`<li>${mark(x)}</li>`).join('')}</ul></div></details>`:'';
    const knowledge=s.knowledge?`<details class="study-details"><summary>📘 Kiến thức nền</summary><div class="details-body"><p>${mark(s.knowledge)}</p></div></details>`:'';
    const options=rows?`<details class="study-details"><summary>🧩 Xem phân tích A/B/C/D</summary><div class="details-body"><div class="option-analysis-list">${rows}</div></div></details>`:'';
    const source=q.sources?.length?`<div class="source-note">Nguồn đối chiếu: ${q.sources.map(esc).join(', ')}</div>`:'';

    return `<div class="solution learning-solution">${keywordHtml}<section class="solution-section quick-section reason-card"><h4>🎯 Vì sao chọn đáp án này?</h4><p>${reason}</p></section><section class="solution-section quick-section memory-card"><h4>🧠 Ghi nhớ</h4><p>${summary}</p></section>${calc}${options}${knowledge}${mistakes}${source}</div>`;
  }

  // app.js declares solutionHtml globally. Replace only the presentation layer;
  // scoring, answer IDs, progress, wrong-question storage and source data stay untouched.
  window.solutionHtml=buildSolutionHtml;
  try{solutionHtml=buildSolutionHtml;}catch(e){}
  window.QUIZ_LEARNING_VIEW={tidy,concise,extractKeywords,buildSolutionHtml};
})();
