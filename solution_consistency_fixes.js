// Manual-solution repairs that must stay aligned with question_consistency_fixes.js.
(function(){
  'use strict';
  const solutions=window.MANUAL_SOLUTIONS=window.MANUAL_SOLUTIONS||{};

  solutions['De04-7-115']={
    knowledge:'Mạng chuyển gói chia dữ liệu thành các gói (packet) và cho nhiều luồng cùng chia sẻ liên kết/router. Vì tài nguyên được dùng chung, khi tốc độ gói đến vượt khả năng phục vụ của nút hoặc liên kết, hàng đợi tăng, độ trễ tăng và có thể mất gói. Do đó mạng chuyển gói cần cơ chế quản lý hoặc điều khiển tắc nghẽn.',
    reasoning:'Đề hỏi phát biểu KHÔNG ĐÚNG. A, B và C mô tả các đặc điểm thường gặp của packet switching trong ngữ cảnh giáo trình; D nói mạng chuyển gói không cần điều khiển tắc nghẽn, trái với việc các gói cạnh tranh tài nguyên dùng chung và có thể tạo hàng đợi quá tải.',
    options:{
      a:{why:'Không chọn. Packet switching phù hợp với lưu lượng dữ liệu dạng burst và có thể khai thác liên kết hiệu quả nhờ statistical multiplexing.',when:'Đúng khi so với việc dành cố định một circuit cho từng phiên, đặc biệt khi nguồn không truyền liên tục.'},
      b:{why:'Không chọn. Đây là đặc trưng định nghĩa: thông tin được chia thành các đơn vị gói để chuyển qua mạng.',when:'Đúng với mạng packet-switched.'},
      c:{why:'Không chọn theo ngữ cảnh giáo trình. Mạng chuyển gói best-effort truyền thống không mặc nhiên bảo đảm băng thông, độ trễ hay jitter cho từng luồng.',when:'Đúng khi nói dịch vụ best-effort không có cơ chế QoS bổ sung; các mạng hiện đại vẫn có thể triển khai QoS.'},
      d:{why:'Đây là đáp án cần chọn. Mạng chuyển gói có thể bị tắc nghẽn khi nhiều gói cùng tranh chấp tài nguyên; cần cơ chế congestion control/management để hạn chế quá tải.',when:'Chỉ có thể nói gần như không cần trong một hệ thống được kiểm soát hoặc overprovisioned sao cho tắc nghẽn thực tế không xảy ra, không phải kết luận chung cho packet network.'}
    },
    commonMistakes:['Nhầm packet switching với circuit switching, nơi tài nguyên được dành trước.','Hiểu “không đảm bảo QoS” thành “không thể triển khai QoS”; ý đúng là packet best-effort không mặc nhiên bảo đảm QoS.'],
    summary:'Packet switching = chia thành gói + chia sẻ tài nguyên; chia sẻ tài nguyên có thể gây hàng đợi/tắc nghẽn, nên “không cần điều khiển tắc nghẽn” là phát biểu sai.'
  };

  window.MMT_SOLUTION_CONSISTENCY_FIXES=Object.freeze({version:'2026-08-09',patched:['De04-7-115']});
})();
