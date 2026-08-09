// Prevent unrelated lesson cards from being selected by contaminated solution text.
// Selection is driven by the live question first; options are secondary evidence.
(function(){
  'use strict';
  const base=window.MMT_BEGINNER_THEORY;
  if(!base?.concepts?.length)return;

  const DEVICE_RE=/repeater|hub|bridge|switch|router|gateway|bộ lặp|cầu nối|bộ chọn đường/i;
  const PACKET_RE=/mạng chuyển gói|packet\s*(?:passing|switch(?:ing|ed)?)|tắc nghẽn|congestion/i;
  const FLOW_RE=/flow control|điều khiển luồng|congestion|tắc nghẽn|nghẽn|rwnd|cwnd/i;

  function textOf(v){return String(v??'').normalize('NFC');}
  function optionText(question){return (question?.options||[]).map(o=>textOf(o.text)).join(' ');}
  function conceptText(c){return [c.id,c.title,c.definition,c.distinguish].map(textOf).join(' ');}
  function hitCount(keys,text){
    let n=0;
    for(const re of keys||[]){
      try{ re.lastIndex=0; if(re.test(text))n++; }catch(err){}
    }
    return n;
  }

  function rankedMatches(question,limit=3){
    const qtext=textOf(question?.question);
    const otext=optionText(question);
    const questionMentionsDevice=DEVICE_RE.test(qtext);
    const packetTopic=PACKET_RE.test(qtext);

    const ranked=[];
    for(const concept of base.concepts){
      const qHits=hitCount(concept.keys,qtext);
      const oHits=hitCount(concept.keys,otext);
      const ctext=conceptText(concept);
      const isFlowConcept=FLOW_RE.test(ctext);

      // A device overview is only relevant when the question itself names a device.
      if(DEVICE_RE.test(ctext) && !questionMentionsDevice)continue;

      // Packet/congestion questions must stay in packet/control concepts.
      if(packetTopic && !isFlowConcept && !PACKET_RE.test(ctext))continue;

      // Never let a stray option alone select a concept unless there is substantial evidence.
      // Exception: a packet-switching question with an explicit congestion option is strong topic evidence.
      if(qHits===0 && oHits<2 && !(packetTopic && isFlowConcept && oHits>=1))continue;
      const score=qHits*5+oHits+(packetTopic&&isFlowConcept?3:0);
      if(score>0)ranked.push({concept,score,qHits,oHits});
    }

    ranked.sort((a,b)=>b.score-a.score || b.qHits-a.qHits || String(a.concept.id).localeCompare(String(b.concept.id)));
    return ranked.slice(0,limit);
  }

  function matches(question,solution,limit=3){
    return rankedMatches(question,limit).map(x=>x.concept);
  }

  function debugMatch(question,limit=10){
    return rankedMatches(question,limit).map(x=>({id:x.concept.id,title:x.concept.title,score:x.score,questionHits:x.qHits,optionHits:x.oHits}));
  }

  window.MMT_BEGINNER_THEORY=Object.freeze({concepts:base.concepts,matches,debugMatch,guardVersion:'2026-08-09'});
})();
