// Runtime repairs for question/option records proven to be cross-contaminated during PDF extraction.
// Keep raw questions.js traceable; patch only records whose intended content can be recovered from duplicate/source context.
(function(){
  'use strict';
  const data=window.QUIZ_DATA;
  if(!data?.questions)return;

  const byId=new Map(data.questions.map(q=>[q.id,q]));

  function replaceOptions(id, options, correctId, note){
    const q=byId.get(id);
    if(!q)return;
    q.options=options.map(o=>({id:o.id,text:o.text}));
    q.correct_option_id=correctId;
    q.verification='corrected';
    q.warning=note||null;
    q.explanation='Mạng chuyển gói truyền dữ liệu theo các packet dùng chung tài nguyên mạng. Khi tải tăng, hàng đợi có thể tích tụ nên mạng cần cơ chế quản lý/điều khiển tắc nghẽn; vì vậy phát biểu “không cần cơ chế điều khiển tắc nghẽn” là không đúng.';
  }

  // Regression 2026-08-09: A/B/C were copied from the following circuit-switching timing problem.
  // The same packet-switching question occurs as De03-18-106 with the intact conceptual choices.
  replaceOptions('De04-7-115',[
    {id:'a',text:'Thích hợp cho mạng có thông lượng dữ liệu lớn'},
    {id:'b',text:'Thông tin được truyền đi trong những đơn vị là gói tin'},
    {id:'c',text:'Không đảm bảo được chất lượng dịch vụ'},
    {id:'d',text:'Không cần cơ chế điều khiển tắc nghẽn'}
  ],'d','Đã phục hồi A/B/C từ câu trùng nội dung De03-18-106; bản trích xuất cũ bị ghép các đáp án thời gian của câu kế tiếp.');

  window.MMT_QUESTION_CONSISTENCY_FIXES=Object.freeze({version:'2026-08-09',patched:['De04-7-115']});
})();
