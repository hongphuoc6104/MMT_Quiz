// Prevent unrelated lesson cards from being selected by generic words or
// contaminated solution text. Selection is driven by the live question first;
// options are secondary evidence. False negatives are safer than displaying an
// unrelated definition because the manual solution remains available as fallback.
(function(){
  'use strict';
  const base=window.MMT_BEGINNER_THEORY;
  if(!base?.concepts?.length)return;
  const PACKET_RE=/mạng chuyển gói|packet\s*(?:passing|switch(?:ing|ed)?)|tắc nghẽn|congestion/i;
  const FLOW_RE=/flow control|điều khiển luồng|congestion|tắc nghẽn|nghẽn|rwnd|cwnd/i;
  const COLLISION_DOMAIN_RE=/collision\s+domain|broadcast\s+domain|miền\s+(?:đụng độ|va chạm|quảng bá)/i;
  const CIRCUIT_SWITCH_RE=/circuit\s+switch(?:ing)?|chuyển\s+mạch\s+(?:kênh|circuit)/i;
  const TCPIP_SUITE_RE=/(?:mô\s+hình|bộ\s+giao\s+thức)\s+tcp\s*\/\s*ip/i;
  const TCP_DETAIL_RE=/\b(?:syn|fin|ack|seq|sequence\s*(?:number|num)|segment|advertised\s+window|receive\s+window|rwnd|cwnd)\b|bắt\s+tay|giao\s+thức\s+tcp(?!\s*\/)/i;
  const SWITCH_CAPACITY_RE=/switch\s+capacity|arubanetworks\.com|\bJL354A\b/i;
  const COLLISION_ALLOWED=new Set(['ethernet','devices']);

  // Deliberately exclude ambiguous single words such as “giao thức”,
  // “domain”, “server”, “router” and “broadcast”. They occur in many unrelated
  // questions and were the root cause of irrelevant theory cards.
  const STRONG_RULES=Object.freeze({
    protocol:[/khái\s+niệm\s+(?:giao\s+thức|dịch\s+vụ)|kiến\s+trúc\s+phần\s+mềm.*(?:giao\s+thức|dịch\s+vụ)|giao\s+thức\s+(?:là|được\s+dùng|mô\s+tả|có\s+ý\s+nghĩa)|mô\s+tả\s+(?:những\s+gì|cách).*(?:cung\s+cấp|dịch\s+vụ|truy\s+cập)|xếp.*giao\s+thức.*thứ\s+bậc|\b(?:service|interface|primitive)s?\b\s*(?:\)|được\s+dùng|là\s+gì|mô\s+tả)/i],
    macaccess:[/\b(?:aloha|csma(?:\/cd)?|tdma|fdma|cdma|token\s*ring)\b|truy\s+(?:nhập|cập).*(?:môi trường|đường truyền)|phân\s+lượt|đa\s+truy\s+nhập|đụng\s+độ|va\s+chạm|đến\s+lượt.*đường\s+truyền/i],
    tcp:[/\btcp\b|\bsyn\b|\bfin\b|\back\b|acknowledg|sequence\s*(?:number|num)|\bseq\b|three[- ]way|bắt\s+tay|advertised\s+window|receive\s+window|\brwnd\b|\bcwnd\b/i],
    arq:[/\bhdlc\b|cửa\s+sổ\s+trượt|sliding\s+window|stop[- ]and[- ]wait|go[- ]back[- ]n|selective\s+repeat|\barq\b|khung.*(?:chờ\s+nhận|số\s+thứ\s+tự)/i],
    ethernet:[/\bethernet\b|802\.3|1000base|mac\s+address|địa\s+chỉ\s+mac|collision\s+domain|broadcast\s+domain|miền\s+(?:đụng\s+độ|va\s+chạm|quảng\s+bá)/i],
    devices:[/\b(?:repeater|hub|bridge|switch|router|gateway)s?\b|bộ\s+lặp|cầu\s+nối|bộ\s+(?:định\s+tuyến|chuyển\s+mạch)/i],
    dns:[/\bdns\b|tên\s+miền|resource\s+record|name\s+server|máy\s+chủ\s+dns|\b(?:mx|cname|aaaa)\b/i],
    ipv4:[/\bipv4\b|địa\s+chỉ\s+ip|ip\s+address|subnet|cidr|prefix|subnet\s+mask|mặt\s+nạ|địa\s+chỉ\s+(?:mạng|quảng\s+bá)|\/\d{1,2}\b/i],
    routing:[/\brouting\b|định\s+tuyến|chọn\s+đường|longest\s+prefix|next\s+hop|bảng\s+chọn\s+đường|đường\s+đi/i],
    clientserver:[/client[-– ]?server|request|response|reply|thông\s+điệp\s+(?:yêu\s+cầu|trả\s+lời)|webclient.*webserver|mô\s+hình\s+(?:khách[- ]?chủ|chủ[- ]?khách)/i]
  });
  const STRONGLY_GATED=new Set(Object.keys(STRONG_RULES));

  function textOf(v){return String(v??'').normalize('NFC');}
  function optionText(question){return (question?.options||[]).map(o=>textOf(o.text)).join(' ');}
  function conceptText(c){return [c.id,c.title,c.definition,c.distinguish].map(textOf).join(' ');}
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
    const collisionDomainTopic=COLLISION_DOMAIN_RE.test(qtext);
    const circuitSwitchTopic=CIRCUIT_SWITCH_RE.test(qtext);
    const tcpIpSuiteTopic=TCPIP_SUITE_RE.test(qtext);
    const tcpDetailTopic=TCP_DETAIL_RE.test(qtext);
    const switchCapacityTopic=SWITCH_CAPACITY_RE.test(qtext);
    const dnsTopic=strongHits('dns',qtext)>0;
    const arpTopic=/\barp\b|ánh\s+xạ.*(?:địa\s+chỉ\s+ip|\bip\b).*(?:địa\s+chỉ\s+mac|\bmac\b)|(?:địa\s+chỉ\s+mac|\bmac\b).*(?:địa\s+chỉ\s+ip|\bip\b)/i.test(qtext);
    const ranked=[];
    for(const concept of base.concepts){
      if(collisionDomainTopic && !COLLISION_ALLOWED.has(concept.id))continue;
      if((dnsTopic||arpTopic) && concept.id==='ipv4')continue;
      if(circuitSwitchTopic && concept.id==='devices')continue;
      if(tcpIpSuiteTopic && !tcpDetailTopic && concept.id==='tcp')continue;
      if(switchCapacityTopic && concept.id==='application')continue;
      const qStrong=strongHits(concept.id,qtext);
      const oStrong=strongHits(concept.id,otext);
      if(STRONGLY_GATED.has(concept.id) && qStrong===0 && oStrong<2)continue;
      const qHits=hitCount(concept.keys,qtext);
      const oHits=hitCount(concept.keys,otext);
      const ctext=conceptText(concept);
      const isFlowConcept=FLOW_RE.test(ctext);
      if(packetTopic && !isFlowConcept && !PACKET_RE.test(ctext))continue;
      if(qHits===0 && oHits<2 && qStrong===0 && oStrong===0 && !(packetTopic && isFlowConcept && oHits>=1))continue;
      const score=qStrong*12+oStrong*4+qHits*3+oHits+(packetTopic&&isFlowConcept?3:0);
      if(score>0)ranked.push({concept,score,qHits,oHits,qStrong,oStrong});
    }
    ranked.sort((a,b)=>b.score-a.score || b.qStrong-a.qStrong || b.qHits-a.qHits || String(a.concept.id).localeCompare(String(b.concept.id)));
    return ranked.slice(0,limit);
  }
  function matches(question,solution,limit=3){return rankedMatches(question,limit).map(x=>x.concept);}
  function debugMatch(question,limit=10){return rankedMatches(question,limit).map(x=>({id:x.concept.id,title:x.concept.title,score:x.score,questionStrongHits:x.qStrong,optionStrongHits:x.oStrong,questionHits:x.qHits,optionHits:x.oHits}));}
  window.MMT_BEGINNER_THEORY=Object.freeze({concepts:base.concepts,matches,debugMatch,guardVersion:'2026-08-09.2'});
})();
