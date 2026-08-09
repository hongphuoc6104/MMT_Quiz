// Prevent unrelated lesson cards from being selected by generic words or
// contaminated solution text. Selection is driven by the live question first;
// options are secondary evidence. False negatives are safer than displaying an
// unrelated definition because the manual solution remains available as fallback.
(function(){
  'use strict';
  const base=window.MMT_BEGINNER_THEORY;
  if(!base?.concepts?.length)return;
  const PACKET_RE=/mạng chuyển gói|packet\s*(?:passing|switch(?:ing|ed)?)/i;
  const CONGESTION_CONTROL_RE=/(?:giải quyết|điều khiển|kiểm soát).*(?:tắc nghẽn|congestion)|(?:tắc nghẽn|congestion).*(?:giải quyết|điều khiển|kiểm soát)/i;
  const COLLISION_DOMAIN_RE=/collision\s+domain|broadcast\s+domain|miền\s+(?:đụng độ|va chạm|quảng bá)/i;
  const CIRCUIT_SWITCH_RE=/circuit\s+switch(?:ing)?|chuyển\s+mạch\s+(?:kênh|circuit)/i;
  const TCPIP_SUITE_RE=/(?:mô\s+hình|bộ\s+giao\s+thức)\s+tcp\s*\/\s*ip/i;
  const TCP_DETAIL_RE=/\b(?:syn|fin|ack|seq|sequence\s*(?:number|num)|segment|advertised\s+window|receive\s+window|rwnd|cwnd)\b|bắt\s+tay|giao\s+thức\s+tcp(?!\s*\/)/i;
  const SWITCH_CAPACITY_RE=/switch\s+capacity|arubanetworks\.com|\bJL354A\b/i;
  const COLLISION_ALLOWED=new Set(['collisiondomains','devices']);

  // Deliberately exclude ambiguous single words such as “giao thức”,
  // “domain”, “server”, “router” and “broadcast”. They occur in many unrelated
  // questions and were the root cause of irrelevant theory cards.
  const STRONG_RULES=Object.freeze({
    osi:[/\bosi\b|mô\s+hình.*(?:tầng|lớp)|tầng\s+nào|thuộc\s+tầng|hoạt\s+động\s+ở\s+tầng|(?:chức\s+năng|nhiệm\s+vụ|đơn\s+vị\s+truyền\s+dữ\s+liệu).*tầng|tầng.*được.*chia/i],
    protocol:[/khái\s+niệm\s+(?:giao\s+thức|dịch\s+vụ)|kiến\s+trúc\s+phần\s+mềm.*(?:giao\s+thức|dịch\s+vụ)|giao\s+thức\s+(?:là|được\s+dùng|mô\s+tả|có\s+ý\s+nghĩa)|mô\s+tả\s+(?:những\s+gì|cách).*(?:cung\s+cấp|dịch\s+vụ|truy\s+cập)|xếp.*giao\s+thức.*thứ\s+bậc|\b(?:service|interface|primitive)s?\b\s*(?:\)|được\s+dùng|là\s+gì|mô\s+tả)/i],
    packetswitching:[/mạng\s+chuyển\s+gói|packet\s*(?:passing|switch(?:ing|ed)?)/i],
    circuitswitching:[/circuit\s+switch(?:ing)?|chuyển\s+mạch\s+(?:kênh|circuit)/i],
    macaccess:[/\b(?:aloha|csma(?:\/cd)?|tdma|fdma|cdma|token\s*ring)\b|truy\s+(?:nhập|cập).*(?:môi trường|đường truyền)|phân\s+lượt|đa\s+truy\s+nhập|đụng\s+độ|va\s+chạm|đến\s+lượt.*đường\s+truyền/i],
    macsublayer:[/tầng\s+mac\b|mac\s+protocol|medium\s+access\s+control|giao\s+thức\s+llc.*giao\s+thức\s+mac/i],
    framing:[/\bframing\b|định\s+khung|byte\s+stuffing|bit\s+stuffing|flag\s+byte|(?:kỹ\s+thuật|phương\s+pháp).*khung.*(?:cờ|độn|bắt\s+đầu|kết\s+thúc)|khung.*(?:cờ|bit\s+độn|byte\s+độn)/i],
    tcp:[/\btcp\b|\bsyn\b|\bfin\b|\back\b|acknowledg|sequence\s*(?:number|num)|\bseq\b|three[- ]way|bắt\s+tay|advertised\s+window|receive\s+window|\brwnd\b|\bcwnd\b/i],
    arq:[/\bhdlc\b|cửa\s+sổ\s+trượt|sliding\s+window|stop[- ]and[- ]wait|go[- ]back[- ]n|selective\s+repeat|\barq\b|khung.*(?:chờ\s+nhận|số\s+thứ\s+tự)/i],
    ethernet:[/\bethernet\b|802\.3|\b(?:10|100|1000|10g)base(?:[- ]?[a-z0-9]+)?\b/i],
    macaddress:[/\bmac\s+address\b|địa\s+chỉ\s+mac|địa\s+chỉ\s+tầng\s*2|địa\s+chỉ\s+(?:nguồn|đích).*(?:ethernet|802\.3)/i],
    ethernetframe:[/(?:khung|frame).*(?:ethernet|802\.3)|(?:ethernet|802\.3).*(?:khung|frame)|\bmtu\b|start\s+of\s+frame|start\s+frame\s+delimiter|\bsof\b|\bsfd\b|địa\s+chỉ\s+(?:nguồn|đích).*bao\s+nhiêu\s*(?:byte|bit)/i],
    collisiondomains:[/collision\s+domain|broadcast\s+domain|miền\s+(?:đụng\s+độ|va\s+chạm|quảng\s+bá)/i],
    devices:[/\b(?:repeater|hub|bridge|switch|router|gateway)s?\b|bộ\s+lặp|cầu\s+nối|bộ\s+(?:định\s+tuyến|chuyển\s+mạch)/i],
    dns:[/\bdns\b|tên\s+miền|resource\s+record|name\s+server|máy\s+chủ\s+dns|\b(?:mx|cname|aaaa)\b/i],
    ipv4:[/\bipv4\b|địa\s+chỉ\s+ip|ip\s+address|subnet|cidr|prefix|subnet\s+mask|mặt\s+nạ|địa\s+chỉ\s+(?:mạng|quảng\s+bá)|\/\d{1,2}\b/i],
    routing:[/\brouting\b|định\s+tuyến|chọn\s+đường|longest\s+prefix|next\s+hop|bảng\s+chọn\s+đường|đường\s+đi/i],
    portsocket:[/\bport\b|số\s+hiệu\s+cổng|socket|(?:xác\s+định|phân\s+biệt).*tiến\s+trình|tiến\s+trình.*(?:xác\s+định|phân\s+biệt)|đa\s+hợp|multiplex/i],
    clientserver:[/client[-– ]?server|request|response|reply|thông\s+điệp\s+(?:yêu\s+cầu|trả\s+lời)|webclient.*webserver|mô\s+hình\s+(?:khách[- ]?chủ|chủ[- ]?khách)/i]
  });
  const STRONGLY_GATED=new Set(Object.keys(STRONG_RULES));

  function textOf(v){return String(v??'').normalize('NFC');}
  function optionText(question){return (question?.options||[]).map(o=>textOf(o.text)).join(' ');}
  function hitCount(keys,text){
    let n=0;
    for(const re of keys||[]){try{re.lastIndex=0;if(re.test(text))n++;}catch(err){}}
    return n;
  }
  function strongHits(id,text){return hitCount(STRONG_RULES[id],text);}
  function rankedMatches(question,limit=3){
    const qtext=textOf(question?.question);
    const otext=optionText(question);
    const packetTopic=PACKET_RE.test(qtext);
    const congestionControlTopic=CONGESTION_CONTROL_RE.test(qtext);
    const collisionDomainTopic=COLLISION_DOMAIN_RE.test(qtext);
    const circuitSwitchTopic=CIRCUIT_SWITCH_RE.test(qtext);
    const tcpIpSuiteTopic=TCPIP_SUITE_RE.test(qtext);
    const tcpDetailTopic=TCP_DETAIL_RE.test(qtext);
    const switchCapacityTopic=SWITCH_CAPACITY_RE.test(qtext);
    const ethernetFrameTopic=strongHits('ethernetframe',qtext)>0;
    const macAddressTopic=strongHits('macaddress',qtext)>0;
    const dnsTopic=strongHits('dns',qtext)>0;
    const arpTopic=/\barp\b|ánh\s+xạ.*(?:địa\s+chỉ\s+ip|\bip\b).*(?:địa\s+chỉ\s+mac|\bmac\b)|(?:địa\s+chỉ\s+mac|\bmac\b).*(?:địa\s+chỉ\s+ip|\bip\b)/i.test(qtext);
    const ranked=[];
    for(const concept of base.concepts){
      if(packetTopic && concept.id!==(congestionControlTopic?'flowcongestion':'packetswitching'))continue;
      if(circuitSwitchTopic && concept.id!=='circuitswitching')continue;
      if(collisionDomainTopic && !COLLISION_ALLOWED.has(concept.id))continue;
      if((dnsTopic||arpTopic) && concept.id==='ipv4')continue;
      if(arpTopic && (concept.id==='macaddress'||concept.id==='ethernet'))continue;
      if(tcpIpSuiteTopic && !tcpDetailTopic && concept.id==='tcp')continue;
      if(switchCapacityTopic && (concept.id==='application'||concept.id==='devices'||concept.id==='ethernet'))continue;
      if((collisionDomainTopic||ethernetFrameTopic||macAddressTopic) && concept.id==='ethernet')continue;
      const qStrong=strongHits(concept.id,qtext);
      const oStrong=strongHits(concept.id,otext);
      if(STRONGLY_GATED.has(concept.id) && qStrong===0 && oStrong<2)continue;
      const qHits=hitCount(concept.keys,qtext);
      const oHits=hitCount(concept.keys,otext);
      if(qHits===0 && oHits<2 && qStrong===0 && oStrong===0)continue;
      const score=qStrong*12+oStrong*4+qHits*3+oHits;
      if(score>0)ranked.push({concept,score,qHits,oHits,qStrong,oStrong});
    }
    ranked.sort((a,b)=>b.score-a.score || b.qStrong-a.qStrong || b.qHits-a.qHits || String(a.concept.id).localeCompare(String(b.concept.id)));
    return ranked.slice(0,limit);
  }
  // One precise prerequisite is more useful than three broad cards that repeat
  // vocabulary from the options. The manual knowledge and option analysis carry
  // the question-specific detail immediately below it.
  function matches(question,solution,limit=1){return rankedMatches(question,Math.min(1,Math.max(0,limit))).map(x=>x.concept);}
  function debugMatch(question,limit=10){return rankedMatches(question,limit).map(x=>({id:x.concept.id,title:x.concept.title,score:x.score,questionStrongHits:x.qStrong,optionStrongHits:x.oStrong,questionHits:x.qHits,optionHits:x.oHits}));}
  window.MMT_BEGINNER_THEORY=Object.freeze({concepts:base.concepts,matches,debugMatch,guardVersion:'2026-08-09.3'});
})();
