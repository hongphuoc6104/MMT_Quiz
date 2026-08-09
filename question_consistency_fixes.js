// Runtime repairs for question/option records proven to be cross-contaminated during PDF extraction.
// Keep raw questions.js traceable; patch only records whose intended content can be recovered from source evidence.
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
    q.verification='source_exact';
    q.warning=note||null;
    q.explanation='Mạng chuyển gói truyền dữ liệu theo các gói dùng chung tài nguyên mạng. Khi tải tăng, hàng đợi có thể tích tụ nên mạng cần cơ chế quản lý hoặc điều khiển tắc nghẽn; vì vậy phát biểu “Không cần cơ chế điều khiển tắc nghẽn” là không đúng.';
    q.source_exact={
      status:true,
      checked_against:'PDF source',
      note:'Giữ nguyên thứ tự A/B/C/D và câu chữ đã đối chiếu; không dùng bản diễn đạt tương đương.'
    };
  }

  // Regression 2026-08-09: A/B/C were copied from the following circuit-switching timing problem.
  // Restore the PDF order and wording exactly instead of only restoring semantically equivalent choices.
  replaceOptions('De04-7-115',[
    {id:'a',text:'Thông tin được truyền đi trong những đơn vị là gói tin'},
    {id:'b',text:'Khó đảm bảo được chất lượng dịch vụ'},
    {id:'c',text:'Thích hợp cho mạng có thông lượng lớn'},
    {id:'d',text:'Không cần cơ chế điều khiển tắc nghẽn'}
  ],'d','Đã phục hồi theo nguồn PDF: đúng thứ tự A/B/C/D và giữ nguyên câu chữ; bản trích xuất cũ bị ghép các đáp án thời gian của câu kế tiếp.');

  window.MMT_QUESTION_CONSISTENCY_FIXES=Object.freeze({version:'2026-08-09-source-exact-1',patched:['De04-7-115']});
})();
