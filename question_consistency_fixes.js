// Runtime repairs for question/option records known to be cross-contaminated during extraction.
// Do not claim source_exact unless the exact source artifact is preserved and referenced by the provenance registry.
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
    q.verification='awaiting_source_artifact';
    q.warning=note||null;
    q.explanation='Mạng chuyển gói truyền dữ liệu theo các gói dùng chung tài nguyên mạng. Khi tải tăng, hàng đợi có thể tích tụ nên mạng cần cơ chế quản lý hoặc điều khiển tắc nghẽn; vì vậy phát biểu “Không cần cơ chế điều khiển tắc nghẽn” là không đúng.';
    q.source_exact={
      status:false,
      checked_against:null,
      note:'Chưa có PDF gốc hoặc ảnh trang nguồn được lưu trong repository để xác minh nguyên văn. Nội dung hiện tại là candidate cần đối chiếu lại.'
    };
  }

  // Regression 2026-08-09: A/B/C were contaminated by answers from the following timing problem.
  // Keep the candidate repair visible, but do not mark it source_exact until the original source page is preserved.
  replaceOptions('De04-7-115',[
    {id:'a',text:'Thông tin được truyền đi trong những đơn vị là gói tin'},
    {id:'b',text:'Khó đảm bảo được chất lượng dịch vụ'},
    {id:'c',text:'Thích hợp cho mạng có thông lượng lớn'},
    {id:'d',text:'Không cần cơ chế điều khiển tắc nghẽn'}
  ],'d','Câu này đã được sửa theo candidate hiện có nhưng CHƯA được xác minh source_exact vì repository chưa có PDF gốc hoặc ảnh trang 23. Cần đối chiếu nguồn trước khi coi là nguyên văn.');

  window.MMT_QUESTION_CONSISTENCY_FIXES=Object.freeze({version:'2026-08-09-evidence-gated-1',patched:['De04-7-115']});
})();
