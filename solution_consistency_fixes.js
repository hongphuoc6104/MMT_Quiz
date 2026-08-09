// Manual-solution repairs that must stay aligned with question_consistency_fixes.js.
(function(){
  'use strict';
  const solutions=window.MANUAL_SOLUTIONS=window.MANUAL_SOLUTIONS||{};
  solutions['De04-7-115']={
    knowledge:'Mạng chuyển gói chia dữ liệu thành các gói (packet) và cho nhiều luồng cùng chia sẻ liên kết/router. Vì tài nguyên được dùng chung, khi tốc độ gói đến vượt khả năng phục vụ của nút hoặc liên kết, hàng đợi tăng, độ trễ tăng và có thể mất gói. Do đó mạng chuyển gói cần cơ chế quản lý hoặc điều khiển tắc nghẽn.',
    reasoning:'Đề hỏi phát biểu KHÔNG ĐÚNG. Theo đúng thứ tự lựa chọn trong PDF: A mô tả đơn vị truyền là gói tin; B nói khó bảo đảm QoS; C nói phù hợp với mạng có thông lượng lớn; D nói không cần điều khiển tắc nghẽn. D là phát biểu sai vì các gói cùng tranh chấp tài nguyên dùng chung và có thể gây quá tải/hàng đợi.',
    options:{
      a:{why:'Không chọn. Đây là đặc trưng định nghĩa của packet switching: thông tin được chia thành các đơn vị là gói tin để truyền qua mạng.',when:'Đúng với mạng chuyển gói.'},
      b:{why:'Không chọn theo ngữ cảnh giáo trình. Vì tài nguyên được chia sẻ và lưu lượng biến động, mạng chuyển gói best-effort khó mặc nhiên bảo đảm băng thông, độ trễ hoặc jitter cho từng luồng.',when:'Đúng khi nói dịch vụ best-effort không có cơ chế QoS bổ sung; hệ thống hiện đại vẫn có thể triển khai QoS.'},
      c:{why:'Không chọn. Packet switching khai thác liên kết hiệu quả nhờ statistical multiplexing và phù hợp với lưu lượng dữ liệu lớn/burst trong ngữ cảnh so sánh của giáo trình.',when:'Đúng khi so với việc dành cố định một circuit cho từng phiên, đặc biệt khi nguồn không truyền liên tục.'},
      d:{why:'Đây là đáp án cần chọn. Mạng chuyển gói có thể bị tắc nghẽn khi nhiều gói cùng tranh chấp tài nguyên; cần cơ chế congestion control/management để hạn chế quá tải.',when:'Chỉ có thể nói gần như không cần trong một hệ thống được kiểm soát hoặc overprovisioned sao cho tắc nghẽn thực tế không xảy ra, không phải kết luận chung cho packet network.'}
    },
    commonMistakes:['Nhầm packet switching với circuit switching, nơi tài nguyên được dành trước.','Đổi câu “khó đảm bảo QoS” thành “không thể đảm bảo QoS”; PDF chỉ nói khó bảo đảm, không nói tuyệt đối không thể.'],
    summary:'Theo đúng PDF: A/B/C là các đặc điểm của packet switching; D “Không cần cơ chế điều khiển tắc nghẽn” là phát biểu sai.'
  };
  window.MMT_SOLUTION_CONSISTENCY_FIXES=Object.freeze({version:'2026-08-09-source-exact-1',patched:['De04-7-115']});
})();
