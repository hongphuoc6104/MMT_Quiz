// Conservative Vietnamese spelling/diacritic cleanup for all visible quiz text.
// Loaded after data_corrections.js + pdf_ocr_hotfixes.js.
// IMPORTANT: this file changes text only; it never changes answer IDs or scoring.
(function () {
  'use strict';

  const data = window.QUIZ_DATA;
  if (!data || !Array.isArray(data.questions)) return;
  const byId = new Map(data.questions.map(q => [q.id, q]));

  function option(qid, oid, text) {
    const q = byId.get(qid);
    const o = q?.options?.find(x => x.id === oid);
    if (o) o.text = text;
  }
  function question(qid, text) {
    const q = byId.get(qid);
    if (q) q.question = text;
  }
  function explanation(qid, text) {
    const q = byId.get(qid);
    if (q) q.explanation = text;
  }

  // --- Exact repairs for text whose intended Vietnamese is unambiguous. ---
  option('De01-27-25', 'a', 'Giảm chi phí đầu tư');
  option('De01-39-37', 'd', 'Có thể thay đổi bằng Properties của Windows');

  option('De01-ver2-25-50', 'b', 'Biến điệu tần số, Biến điệu băng thông, Biến điệu biên độ');
  option('De01-ver2-25-50', 'c', 'Biến điệu tần số, Biến điệu pha, Biến điệu biên độ');
  explanation('De01-ver2-25-50', 'Lựa chọn phù hợp nhất với khái niệm trong câu hỏi là: biến điệu tần số, biến điệu pha, biến điệu biên độ.');

  option('De02-4-51', 'a', 'Mô tả những gì mà một thành phần mạng máy tính cung cấp cho các thành phần khác muốn giao tiếp với nó');
  option('De02-4-51', 'b', 'Mô tả cách mà một khách hàng có thể sử dụng được một dịch vụ mạng và cách dịch vụ đó có thể được truy cập');
  explanation('De02-4-51', 'Theo chức năng/chuẩn của giao thức hoặc tầng mạng được hỏi, lựa chọn phù hợp là: mô tả những gì mà một thành phần mạng máy tính cung cấp cho các thành phần khác muốn giao tiếp với nó.');
  question('De02-6-53', 'Hãy xác định khả năng của một kênh truyền có băng thông... thiếu đề');
  question('De02-7-54', 'Công cụ nào sau đây có thể được sử dụng để nối kết và quản lý một máy tính ở xa?');
  question('De02-9-56', 'Phát biểu nào sau đây không đúng khi đề cập đến giao thức truy cập đường truyền Slotted ALOHA?');
  option('De02-10-57', 'b', 'Tầng vận chuyển');
  question('De02-11-58', 'Xác định mặt nạ mạng con của địa chỉ IP 136.36.44.111/24');
  option('De02-17-61', 'd', 'CNAME. A (Address record): ánh xạ tên miền → địa chỉ IP (IPv4). MX (Mail Exchange): chỉ máy chủ email. NS (Name Server): chỉ máy chủ DNS chịu trách nhiệm. CNAME (Canonical Name): bí danh (alias) cho một tên miền khác.');
  option('De02-29-72', 'b', 'Máy chủ root chứa các thông tin về các máy chủ tên miền cho các tên miền mức cao nhất');
  option('De02-29-72', 'c', 'Máy chủ root có thể tìm kiếm địa chỉ IP cho tất cả các tên miền trên Internet');
  explanation('De02-29-72', 'Lựa chọn phù hợp nhất với khái niệm trong câu hỏi là: máy chủ root có thể tìm kiếm địa chỉ IP cho tất cả các tên miền trên Internet.');
  option('De02-30-73', 'c', 'WANs có thể sử dụng kênh truyền dữ liệu công cộng hoặc kênh truyền riêng');
  question('De02-32-75', 'Với địa chỉ mạng 200.200.200.0, hãy xác định mặt nạ mạng con để tạo ra 30 mạng con và...');
  option('De02-33-77', 'b', 'Phát hiện tấn công mạng');
  option('De02-33-77', 'c', 'Gửi các thông điệp báo lỗi hoặc các thông điệp điều khiển');
  explanation('De02-33-77', 'Theo chức năng/chuẩn của giao thức hoặc tầng mạng được hỏi, lựa chọn phù hợp là: gửi các thông điệp báo lỗi hoặc các thông điệp điều khiển.');
  option('De02-38-81', 'b', 'Địa chỉ IP gửi được đổi thành địa chỉ IP của Router');
  question('De02-41-84', 'Các mạng con nào sau đây KHÔNG thuộc vùng địa chỉ IP dùng riêng (Private IP Address)?');
  question('De02-45-86', 'Xác định địa chỉ mạng con của địa chỉ IP 190.132.166.4/21');

  option('De03-5-91', 'c', 'Đảm nhận chức năng vạch đường');
  option('De03-5-91', 'd', 'Truyền tải thông tin giữa hai ứng dụng trên mạng');
  option('De03-1-92', 'b', 'Chia sẻ đường truyền vật lý giữa các máy tính ở cùng một nhánh mạng');
  explanation('De03-1-92', 'Theo chức năng/chuẩn của giao thức hoặc tầng mạng được hỏi, lựa chọn phù hợp là: chia sẻ đường truyền vật lý giữa các máy tính ở cùng một nhánh mạng.');
  option('De03-5-96', 'd', 'Tầng vật lý');
  question('De03-10-99', 'Nhiệm vụ chính của tầng vật lý là gì?');
  option('De03-10-99', 'a', 'Truyền tải các bit trên một kênh truyền vật lý');
  explanation('De03-10-99', 'Lựa chọn phù hợp nhất với khái niệm trong câu hỏi là: truyền tải các bit trên một kênh truyền vật lý.');
  option('De03-16-104', 'a', 'Dữ liệu số');
  explanation('De03-16-104', 'Áp dụng dữ kiện hoặc phép tính trong đề, kết quả phù hợp là: dữ liệu số.');
  option('De03-18-106', 'd', 'Không cần cơ chế điều khiển tắc nghẽn');
  explanation('De03-18-106', 'Lựa chọn phù hợp nhất với khái niệm trong câu hỏi là: không cần cơ chế điều khiển tắc nghẽn.');

  option('De04-6-114', 'd', '1 đường biên mạng, đường trục mạng, mạng truy cập');
  option('De04-7-115', 'd', 'Không cần cơ chế điều khiển tắc nghẽn');
  explanation('De04-7-115', 'Lựa chọn phù hợp nhất với khái niệm trong câu hỏi là: không cần cơ chế điều khiển tắc nghẽn.');
  question('De04-8-116', 'Chúng ta phải mất thời gian bao lâu để gửi một tập tin có dung lượng 320.000 bit từ máy A tới máy B thông qua một mạng chuyển mạch, biết rằng: (1) tất cả các liên kết là 1,536 Mbps; (2) tất cả các liên kết đều sử dụng kỹ thuật phân chia theo thời gian với 12 slots/sec; (3) thời gian thiết lập kết nối là 500 ms (ghi chú: 1 Mb = 1000 Kb; 1 Kb = 1000 bit)?');
  question('De04-15-123', 'Mệnh đề nào sau đây đề cập đến "truy cập mạng"?');
  option('De04-15-123', 'd', 'Các “máy chủ/trạm làm việc” và các ứng dụng mạng');
  option('De04-6-129', 'c', 'Mạng vẫn hoạt động khi thêm hoặc bớt các máy tính. Không hoạt động nếu thiết bị tập trung (Hub) bị lỗi');
  option('De04-17-140', 'c', 'Dịch vụ');
  option('De04-17-140', 'd', 'Phần mềm mạng');
  question('De04-1-149', 'Mã Morse sử dụng 2 tín hiệu tít (ký hiệu là dấu chấm ".") và te (ký hiệu là dấu gạch ngang "-") để mã hóa dữ liệu truyền đi. Hãy cho biết mã Morse của chuỗi ký tự EFGH.');
  question('De04-2-189', '“Nếu một khung bị sai thì ta không xác định được khung nào tiếp theo”, mệnh đề này thể hiện khuyết điểm của phương pháp định khung nào?');
  option('De04-3-190', 'c', 'Phản hồi (Feedback based)');
  explanation('De04-3-190', 'Lựa chọn phù hợp nhất với khái niệm trong câu hỏi là: Phản hồi (Feedback based).');
  option('De04-17-210', 'd', 'Thời gian được chia thành những “khe” (slot). Một chu kỳ hoạt động của hệ thống bắt đầu bằng N (N = số trạm) khe thời gian ngắn dùng để đặt chỗ.');
  option('De04-18-211', 'b', 'GSM → Thời gian + Tần số');
  question('De04-1-224', 'Theo nguyên tắc phân mạng con: (1) Phần nhận dạng máy tính của địa chỉ mạng ban đầu được giữ nguyên. (2) Phần nhận dạng mạng của địa chỉ mạng ban đầu được chia thành 2 phần: phần nhận dạng mạng con và phần nhận dạng máy tính trong mạng con. Mệnh đề này là đúng hay sai?');
  question('De04-22-247', 'Theo phương pháp vạch đường liên miền không phân lớp (CIDR), địa chỉ IP được viết dưới dạng X.X.X.X/Y, trong đó Y có ý nghĩa là?');
  option('De04-26-251', 'd', 'Tổ chức một mạng có tối đa 512 host. /23 tức 9 bit dành cho host: 2^9 = 512 địa chỉ → 510 địa chỉ host (trừ 2 địa chỉ Network và Broadcast). Công thức: 2^x - 2 = 2^9 - 2 = 510 (x là số bit host).');
  question('De04-28-253', 'Với địa chỉ mạng con 172.18.100.0/29, ta có thể?');
  question('De04-29-254', 'Địa chỉ quảng bá (Broadcast) của mạng con 181.16.21.8/29 là gì?');
  option('De04-29-254', 'd', '181.16.21.9. /29 có 3 bit dành cho host. Giữ nguyên 29 bit đầu, các bit host đổi thành 1 → 181.16.21.15. Cách khác: 2^3 = 8 địa chỉ, dải là 181.16.21.8–181.16.21.15.');
  option('De04-30-256', 'd', 'Khung (Frame)');
  option('De04-17-273', 'c', 'Địa chỉ của cổng dịch vụ.');
  question('De04-19-275', 'Trong tầng vận chuyển của bộ giao thức TCP/IP, giao thức nào cung cấp dịch vụ có nối kết?');
  question('De04-5-281', 'Giao thức cho phép người dùng đọc trực tiếp email trong mailbox trên máy chủ email?');
  question('De04-6-282', 'Giao thức nào được sử dụng trong dịch vụ Web (WWW)?');
  question('De04-21-297', 'Người dùng có thể nhận và đọc email của mình qua các giao thức nào?');
  question('De04-27-303', 'Trong cơ sở dữ liệu của dịch vụ DNS, kiểu mẫu tin nào được dùng để chỉ một máy chủ DNS của một miền nào đó?');
  question('De04-28-304', 'Trong cơ sở dữ liệu của dịch vụ DNS, kiểu mẫu tin nào được dùng để chỉ một máy chủ Email của một miền nào đó?');
  question('De04-30-306', 'Trong cơ sở dữ liệu của dịch vụ DNS, kiểu mẫu tin nào được dùng để ánh xạ một tên miền sang địa chỉ IP?');

  question('De07-8-308', 'Mạng máy tính là gì?');
  question('De07-10-312', 'Bộ mã UTF-8 có thể mã hóa được bao nhiêu ký tự?');
  option('De07-11-313', 'c', 'Địa chỉ của cổng dịch vụ.');

  option('De08-31-321', 'c', 'Bên nhận sẽ không gửi lại bất kỳ thông báo nào.');
  question('De08-38-324', 'Mục đích của việc xây dựng dịch vụ trực tuyến là gì?');
  question('De08-40-325', 'Địa chỉ IP nào là hợp lệ cho một host thuộc mạng 192.168.1.64/26?');
  option('De08-42-327', 'c', 'Chọn đường tập trung');
  option('De08-42-327', 'd', 'Chọn đường động');
  explanation('De08-42-327', 'Áp dụng dữ kiện hoặc phép tính trong đề, kết quả phù hợp là: chọn đường tập trung.');

  // Chapter 8 was extracted without Vietnamese diacritics in every row.
  for (const q of data.questions) {
    if (q.chapter === 'chuong 8 : tang ung dung' || q.chapter === 'chuong 8: tang ung dung') {
      q.chapter = 'Chương 8: Tầng ứng dụng';
    }
  }

  // Safe typography and universally unambiguous OCR fixes.
  const safePhrases = [
    [/Giảm chỉ phí/g, 'Giảm chi phí'],
    [/Có thé/g, 'Có thể'],
    [/Mệnh dé/g, 'Mệnh đề'],
    [/mệnh dé/g, 'mệnh đề'],
    [/Dich vụ/g, 'Dịch vụ'],
    [/Phan mém mang/g, 'Phần mềm mạng'],
    [/Phan hồi/g, 'Phản hồi'],
    [/Tang vat ly/g, 'Tầng vật lý'],
    [/Tầng vat lý/g, 'Tầng vật lý'],
    [/Tan số/g, 'Tần số'],
    [/\bDia chỉ\b/g, 'Địa chỉ'],
    [/\bdia chỉ\b/g, 'địa chỉ']
  ];

  function clean(value) {
    if (typeof value !== 'string') return value;
    let s = value.normalize('NFC');
    for (const [pattern, replacement] of safePhrases) s = s.replace(pattern, replacement);
    return s
      .replace(/\s+([?,;:])/g, '$1')
      .replace(/([:;,])(?=\S)/g, '$1 ')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }

  for (const q of data.questions) {
    q.question = clean(q.question);
    q.chapter = clean(q.chapter);
    q.explanation = clean(q.explanation);
    if (typeof q.warning === 'string') q.warning = clean(q.warning);
    for (const o of q.options || []) o.text = clean(o.text);
  }
})();
