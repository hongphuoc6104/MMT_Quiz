// Human-readable answer audit notes shown before the lesson explanation.
// This file documents known corrected/source-ambiguous items without changing scoring.
(() => {
  'use strict';
  const corrected = {
    'De01-2-1': {
      kind:'corrected',
      title:'Đáp án này đã được sửa sau khi đối chiếu',
      text:'Khóa cũ chọn Physical, nhưng “tầng mạng / Network Layer” là tầng 3 của OSI. Đáp án đúng là Network.',
      basis:'Đối chiếu mô hình OSI: Network là Layer 3.'
    },
    'De04-7-200': {
      kind:'corrected',
      title:'Đáp án này đã được sửa sau khi đối chiếu',
      text:'Khóa cũ chọn 10 km. Với 1000BASE-LX theo chuẩn cơ bản trên single-mode fiber, giá trị học trong bộ đề là 5 km = 5000 m; 10 km thường gắn với biến thể LX/LH hoặc mở rộng của thiết bị.',
      basis:'Đối chiếu thông số 1000BASE-LX và ghi chú thiết bị mở rộng.'
    },
    'De04-18-211': {
      kind:'corrected',
      title:'Đáp án này đã được sửa sau khi đối chiếu',
      text:'CDMA phân biệt người dùng bằng mã. TDMA chia theo khe thời gian và FDMA chia theo dải tần, nên đáp án đúng là CDMA.',
      basis:'Đối chiếu định nghĩa các kỹ thuật đa truy nhập.'
    },
    'De04-24-249': {
      kind:'corrected',
      title:'Đáp án này đã được sửa sau khi đối chiếu',
      text:'Router thực hiện chức năng định tuyến ở tầng Network (Layer 3), vì vậy đáp án đúng là Router.',
      basis:'Đối chiếu chức năng thiết bị theo mô hình OSI.'
    }
  };

  const noCompleteChoice = {
    'De01-41-39': {
      kind:'source-problem',
      title:'Đề gốc không có một phương án kỹ thuật đúng hoàn toàn',
      text:'Parity không “khắc phục/phát hiện một tỷ lệ phần trăm cố định” nếu đề không cho mô hình lỗi. Một bit parity phát hiện mọi mẫu lỗi có số bit bị đảo là lẻ, nhưng bỏ sót các mẫu lỗi có số bit đảo là chẵn.',
      basis:'Kết luận kỹ thuật được dùng để học thay vì học thuộc tỷ lệ % trong lựa chọn gốc.'
    },
    'De04-13-121': {
      kind:'source-problem',
      title:'Đề gốc không có một phương án kỹ thuật đúng hoàn toàn',
      text:'Store-and-forward là kỹ thuật chuyển tiếp frame/packet qua nút, không phải bản thân một cơ chế điều khiển tắc nghẽn. Vì vậy không nên học thuộc phương án đó như định nghĩa congestion control.',
      basis:'Phân biệt chức năng chuyển tiếp với điều khiển tắc nghẽn.'
    },
    'De04-7-263': {
      kind:'source-problem',
      title:'Câu gốc không có lựa chọn duy nhất',
      text:'Theo cách phân loại primitive của dịch vụ không kết nối trong giáo trình, cả LISTEN và CONNECT đều không thuộc nhóm primitive connectionless theo nghĩa câu đang kiểm tra. Chỉ chọn LISTEN là không duy nhất.',
      basis:'Học bản chất connection-oriented/connectionless thay vì học khóa cũ máy móc.'
    },
    'De04-10-266': {
      kind:'source-problem',
      title:'Câu gốc có nhiều phát biểu sai',
      text:'Có hơn một lựa chọn sai về UDP, nên câu hỏi một-đáp-án không chặt. Phần giải thích trên web sẽ nêu rõ từng phát biểu thay vì ép bạn học một khóa duy nhất.',
      basis:'Đối chiếu UDP theo RFC 768.'
    },
    'De04-2-278': {
      kind:'source-problem',
      title:'Đề gốc diễn đạt DNS chưa đầy đủ',
      text:'DNS sử dụng cả UDP và TCP trên port 53 trong các tình huống khác nhau. Vì vậy nếu câu bắt buộc chọn duy nhất “UDP” hoặc “TCP” như một định nghĩa tổng quát thì không đầy đủ.',
      basis:'RFC 1035 nêu cả datagram access qua UDP 53 và TCP 53.'
    },
    'De07-10-312': {
      kind:'source-problem',
      title:'Đề gốc không có mô tả UTF-8 đầy đủ',
      text:'UTF-8 biểu diễn Unicode scalar value bằng chuỗi 1–4 byte. Không nên học rằng UTF-8 chỉ biểu diễn tối đa 65.536 ký tự.',
      basis:'Đối chiếu chuẩn Unicode/UTF-8.'
    }
  };

  const cautionIds = new Set([
    'De01-5-4','De01-9-8','De01-44-42','De01-50-47',
    'De02-6-52','De02-8-54','De02-20-66','De02-32-78',
    'De03-4-95','De03-12-101','De04-16-124','De04-12-167',
    'De04-5-198','De04-4-228','De04-11-267','De08-20-301',
    'De08-21-302','De08-31-311'
  ]);

  function noteFor(question){
    if(!question)return null;
    if(corrected[question.id]) return corrected[question.id];
    if(noCompleteChoice[question.id]) return noCompleteChoice[question.id];
    if(cautionIds.has(question.id) || question.warning){
      return {
        kind:'caution',
        title:'Câu này cần đọc kèm cảnh báo',
        text: question.warning || 'Câu hỏi phụ thuộc hình, dữ kiện bị thiếu/cắt hoặc lựa chọn diễn đạt chưa đủ chặt. Hãy dùng phần giải thích để hiểu điều kiện áp dụng, không học thuộc đáp án một cách tuyệt đối.',
        basis:'Đã được đánh dấu trong báo cáo đối chiếu PDF ↔ website.'
      };
    }
    return null;
  }

  window.MMT_ANSWER_AUDIT = Object.freeze({noteFor, corrected, noCompleteChoice, cautionIds});
})();
