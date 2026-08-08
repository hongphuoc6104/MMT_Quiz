// Structural cleanup applied immediately after questions.js.
// Keeps the first occurrence of each option ID; OCR extraction duplicated whole A/B/C/D
// blocks in a few source regions. Also fixes the duplicated parity question whose source
// answer (12%) is not technically valid without an error probability model.
(function(){
  const data=window.QUIZ_DATA;
  if(!data||!Array.isArray(data.questions))return;

  for(const q of data.questions){
    const seen=new Set();
    q.options=(q.options||[]).filter(o=>{
      if(!o?.id||seen.has(o.id))return false;
      seen.add(o.id);
      return true;
    });
  }

  const parity=data.questions.find(q=>q.id==='De04-4-191');
  if(parity){
    parity.question='“Phương pháp kiểm tra chẵn lẻ” có thể phát hiện được bao nhiêu % số lỗi xảy ra trên đường truyền?';
    parity.options=(parity.options||[]).filter(o=>o.id!=='x');
    parity.options.push({id:'x',text:'Đáp án kỹ thuật bổ sung – không có tỷ lệ phần trăm cố định'});
    parity.correct_option_id='x';
    parity.verification='corrected';
    parity.warning='Bốn lựa chọn gốc của PDF không có đáp án kỹ thuật đúng hoàn toàn. Parity phát hiện mọi mẫu lỗi có số bit đảo là lẻ; tỷ lệ phát hiện tổng thể phụ thuộc mô hình lỗi.';
    parity.explanation='Parity phát hiện chắc chắn mọi lỗi có số bit đảo là lẻ, nhưng không có một tỷ lệ phần trăm cố định nếu đề không cho mô hình xác suất lỗi.';
  }
})();
