// Runtime cleanup layer for OCR/punctuation defects found while re-checking the source PDF.
// Loaded after questions.js + static_solutions.js and before app.js so the source IDs,
// page numbers and raw extraction remain traceable while the study UI is clean.
(function () {
  'use strict';

  const data = window.QUIZ_DATA;
  if (!data || !Array.isArray(data.questions)) return;

  const phraseFixes = [
    ['đơn vi', 'đơn vị'],
    ['tai một thời điểm', 'tại một thời điểm'],
    ['chi hai tra m cung truyen du lieu', 'chỉ hai trạm cùng truyền dữ liệu'],
    ['mot tra m truyen, ca c tra m kha c nhan du lieu', 'một trạm truyền, các trạm khác nhận dữ liệu'],
    ['may tra m vu a truyen vu a tiep tuc tha m do duong truyen', 'máy trạm vừa truyền vừa tiếp tục thăm dò đường truyền'],
    ['Tin hiệu tuần ty (analog)', 'Tín hiệu tương tự (analog)'],
    ['Tín hiệu s6 (digital)', 'Tín hiệu số (digital)'],
    ['name Server cu a mie n', 'Name Server của miền'],
    ['mail Server cu a mie n', 'Mail Server của miền'],
    ['mang cuc bo', 'mạng cục bộ'],
    ['IP dich', 'IP đích'],
    ['Dia chi MAC', 'Địa chỉ MAC'],
    ['Duong truyén ADSL', 'Đường truyền ADSL'],
    ['Duong dial qua mang dién thoai', 'Đường dial qua mạng điện thoại'],
    ['kho ng chophep truyen di ca c byte du lieu trung voi gia tri cu a byte lam co', 'không cho phép truyền đi các byte dữ liệu trùng với giá trị của byte làm cờ'],
    ['co gang ket hop goi ba o nhan va du lieu tre n cung mot chuyen', 'cố gắng kết hợp gói báo nhận và dữ liệu trên cùng một chuyến'],
    ['chi ra nhu ng gi ma mot may chu co the cung cap cho ca c khach hang', 'chỉ ra những gì mà một máy chủ có thể cung cấp cho các khách hàng'],
    ['la thong die p Client gu i cho Server de ye u ca u Server tinh toan, thuc hie n mot ta c vu na o do', 'là thông điệp Client gửi cho Server để yêu cầu Server tính toán, thực hiện một tác vụ nào đó'],
    ['ta t ca ca c thanh phan tre n', 'tất cả các thành phần trên'],
    ['giu p ta o ra nhieu ung dung moi', 'giúp tạo ra nhiều ứng dụng mới'],
    ['giu p tang hieu sua t cu a may tinh ca nhan', 'giúp tăng hiệu suất của máy tính cá nhân'],
    ['be n goi se tiep tuc goi du lieu', 'bên gửi sẽ tiếp tục gửi dữ liệu'],
    ['be n goi se ta m dung goi du lieu', 'bên gửi sẽ tạm dừng gửi dữ liệu'],
    ['truyen ta i ca c goi tin (packet) qua mot lien mang', 'truyền tải các gói tin (packet) qua một liên mạng'],
    ['giao thuc TCP va UDP', 'giao thức TCP và UDP'],
    ['dieu khien luong', 'điều khiển luồng'],
    ['khung ba o nhan', 'khung báo nhận'],
    ['tang ung dung', 'tầng ứng dụng'],
    ['lo i tre n duong truyen', 'lỗi trên đường truyền'],
    ['su kha c biet giu a to c do truyen vanhan cu a be n truyen va be n nhan', 'sự khác biệt giữa tốc độ truyền và nhận của bên truyền và bên nhận'],
    ['gia m do phu c ta p to ng the cu a ca c vie c xay dung mot he thong mang', 'giảm độ phức tạp tổng thể của việc xây dựng một hệ thống mạng'],
    ['su dung mot bit dac biet de da nh dau die m bat dau va ket thuc cu a khung', 'sử dụng một bit đặc biệt để đánh dấu điểm bắt đầu và kết thúc của khung'],
    ['du lieu cu a khung chu a du lieu cu a ung dung cung voi ta t ca ca c tie u de cu a ca c tang phi a tre n', 'dữ liệu của khung chứa dữ liệu của ứng dụng cùng với tất cả các tiêu đề của các tầng phía trên'],
    ['ta t ca de u dung', 'tất cả đều đúng'],
    ['di a chi MAC tra m gu i', 'địa chỉ MAC trạm gửi'],
    ['di a chi IP nhan', 'địa chỉ IP nhận'],
    ['phan ho i (feedback based) ta n so : trong giao thuc truyen tin ca i sa n co che gio i han ta n sua t mang goi co the truyen tin', 'phản hồi (feedback based)']
  ];

  const chapterFixes = new Map([
    ['chuong 1: tong quan', 'Chương 1: Tổng quan'],
    ['chuong 2: tang ung dung', 'Chương 2: Tầng ứng dụng'],
    ['chuong 3: tang vat ly', 'Chương 3: Tầng vật lý'],
    ['chuong 4: tang lien ket du lieu', 'Chương 4: Tầng liên kết dữ liệu'],
    ['chuong 5: mang noi bo & lop con dieu khien truy cap', 'Chương 5: Mạng nội bộ & lớp con điều khiển truy cập'],
    ['chuong 6 : tang mang', 'Chương 6: Tầng mạng'],
    ['chuong 7 : tang van chuyen (giao van)', 'Chương 7: Tầng vận chuyển (giao vận)']
  ]);

  const exactQuestionFixes = new Map([
    ['De01-23-21', 'Loại cáp nào sau đây thường được sử dụng ngoài trời để kết nối các hệ thống mạng của các tòa nhà lại với nhau?'],
    ['De01-29-27', 'Ảnh đen trắng sử dụng bao nhiêu bit để số hóa một điểm ảnh?'],
    ['De01-31-29', 'Giao thức UDP hoạt động như thế nào?'],
    ['De04-23-216', 'Tầng nào trong mô hình OSI được IEEE chia thành hai tầng con?']
  ]);

  const exactOptionFixes = new Map([
    ['De01-12-11:a', 'Máy trạm lắng nghe đường truyền và dùng cửa sổ trượt để phát hiện'],
    ['De01-12-11:b', 'Máy trạm vừa truyền vừa tiếp tục thăm dò đường truyền'],
    ['De01-16-15:d', 'Không cho phép truyền đi các byte dữ liệu trùng với giá trị của byte làm cờ'],
    ['De01-18-17:d', 'Pure ALOHA'],
    ['De01-19-18:b', 'Chỉ ra những gì mà một máy chủ có thể cung cấp cho các khách hàng'],
    ['De01-20-19:d', 'Là thông điệp Client gửi cho Server để yêu cầu Server tính toán, thực hiện một tác vụ nào đó'],
    ['De01-22-20:c', 'Tất cả các thành phần trên'],
    ['De01-27-25:b', 'Giúp tạo ra nhiều ứng dụng mới'],
    ['De01-27-25:c', 'Giúp tăng hiệu suất của máy tính cá nhân'],
    ['De01-29-27:a', '1'],
    ['De01-30-28:b', 'Bên gửi sẽ tiếp tục gửi dữ liệu'],
    ['De01-30-28:c', 'Bên gửi sẽ tạm dừng gửi dữ liệu'],
    ['De01-31-29:d', 'Có báo nhận'],
    ['De01-32-30:c', 'Truyền tải các khung (frame) trên một kênh truyền vật lý'],
    ['De01-32-30:d', 'Truyền tải các gói tin (packet) qua một liên mạng'],
    ['De01-33-31:c', 'Liên kết dữ liệu'],
    ['De01-33-31:d', 'Vật lý'],
    ['De01-38-36:d', 'Giao thức TCP và UDP'],
    ['De01-42-40:a', 'Kiểm tra lỗi'],
    ['De01-42-40:b', 'Điều khiển luồng'],
    ['De01-42-40:d', 'Định khung'],
    ['De01-44-42:a', '(2^k - 1) / 2'],
    ['De01-44-42:b', '2^k'],
    ['De01-44-42:c', '2^k / 2'],
    ['De01-44-42:d', '2^k - 1'],
    ['De01-49-46:c', 'Selective Repeat'],
    ['De01-49-46:d', 'Phản hồi (feedback based)'],
    ['De01-ver2-18-48:b', 'Khung báo nhận'],
    ['De01-ver2-24-49:d', 'Tầng ứng dụng'],
    ['De04-7-263:d', 'SEND'],
    ['De04-12-205:a', '4']
  ]);

  // These six technical conclusions were added during the previous audit because none
  // of the choices printed in the source question is fully correct. Keep them visible,
  // but label them honestly instead of presenting them as an original PDF choice.
  const supplementalAnswerIds = new Set([
    'De01-41-39',
    'De04-13-121',
    'De04-7-263',
    'De04-10-266',
    'De04-2-278',
    'De07-10-312'
  ]);

  function normalizeText(value) {
    if (typeof value !== 'string') return value;
    let s = value.normalize('NFC');
    for (const [from, to] of phraseFixes) s = s.split(from).join(to);

    s = s
      .replace(/\bKHÔNG DUNG\b/g, 'KHÔNG ĐÚNG')
      .replace(/\bchuyển mach\b/g, 'chuyển mạch')
      .replace(/\bsử dung\b/g, 'sử dụng')
      .replace(/\bvi trí\b/g, 'vị trí')
      .replace(/\bDich vu\b/g, 'Dịch vụ')
      .replace(/\bThanh phần\b/g, 'Thành phần')
      .replace(/\bchan lẻ\b/g, 'chẵn lẻ')
      .replace(/\btang MAC\b/g, 'tầng MAC')
      .replace(/\bmang LAN\b/g, 'mạng LAN')
      .replace(/\bsau day\b/g, 'sau đây')
      .replace(/\bđịa chi\b/g, 'địa chỉ')
      .replace(/\bnhận dang\b/g, 'nhận dạng')
      .replace(/\bCó thé\b/g, 'Có thể')
      .replace(/\bma ở đó\b/g, 'mà ở đó')
      .replace(/\bđường di\b/g, 'đường đi')
      .replace(/\bMệnh dé\b/g, 'Mệnh đề')
      .replace(/\bmệnh dé\b/g, 'mệnh đề')
      .replace(/\bsé\b/g, 'sẽ')
      .replace(/\bdé cập\b/g, 'đề cập')
      .replace(/\bbao nhiều\b/g, 'bao nhiêu')
      .replace(/\bliên kiết\b/g, 'liên kết')
      .replace(/\bGiảm chỉ phí\b/g, 'Giảm chi phí')
      .replace(/=0thì/g, '= 0 thì')
      .replace(/\s+\?/g, '?')
      .replace(/\s+,/g, ',')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
    return s;
  }

  function cleanQuestion(value) {
    let s = normalizeText(value);
    // Explanations/answer keys were occasionally OCR-merged into the question line.
    s = s.replace(/\s+(?:Answer|Đáp án)\s*:[\s\S]*$/i, '').trim();
    // Remove textbook page hints, not mathematical P values such as P=1011.
    s = s.replace(/\s*->\s*LLC\s*,\s*MAC\s*\/\s*GTP\d+(?:-\d+)?\s*$/i, '').trim();
    s = s.replace(/\s*(?:\/\s*)?GTP\d+(?:-\d+)?(?:\s+[A-Za-z]{1,3})?\s*$/i, '').trim();
    s = s.replace(/\s+[Pp]\d+(?:\s+[A-Za-z]{1,3}){0,2}\s*$/g, '').trim();
    return normalizeText(s);
  }

  function cleanOption(value) {
    let s = normalizeText(value);
    s = s.replace(/\s+Giải\s*:[\s\S]*$/i, '').trim();
    s = s.replace(/\s+Lớp C\s*:[\s\S]*$/i, '').trim();
    s = s.replace(/\s+Gồm ALOHA[\s\S]*$/i, '').trim();
    s = s.replace(/\s+UDP là giao thức[\s\S]*$/i, '').trim();
    s = s.replace(/\s+->\s*LLC\s*&\s*MAC[\s\S]*$/i, '').trim();
    s = s.replace(/\s+Có thể hiểu \/[\s\S]*$/i, '').trim();
    s = s.replace(/\s+Mỗi mang con[\s\S]*$/i, '').trim();
    s = s.replace(/\s+IP\s*=\s*[\s\S]*$/i, '').trim();
    s = s.replace(/\s+ta co\s+[\s\S]*$/i, '').trim();
    return normalizeText(s);
  }

  function recursivelyNormalize(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      const v = obj[key];
      if (typeof v === 'string') obj[key] = normalizeText(v);
      else if (v && typeof v === 'object') recursivelyNormalize(v);
    }
  }

  for (const q of data.questions) {
    if (chapterFixes.has(q.chapter)) q.chapter = chapterFixes.get(q.chapter);
    q.question = exactQuestionFixes.get(q.id) || cleanQuestion(q.question);

    for (const option of q.options || []) {
      const key = `${q.id}:${option.id}`;
      option.text = exactOptionFixes.get(key) || cleanOption(option.text);
    }

    // A few OCR lines contained an answer explanation inside an otherwise normal option.
    if (q.id === 'De01-10-9') {
      const o = q.options.find(x => x.id === 'd');
      if (o) o.text = '255.255.255.1';
    }
    if (q.id === 'De04-12-205') {
      const o = q.options.find(x => x.id === 'a');
      if (o) o.text = '4';
    }

    if (supplementalAnswerIds.has(q.id)) {
      const x = (q.options || []).find(o => o.id === 'x');
      if (x && !x.text.startsWith('[Đáp án kỹ thuật bổ sung')) {
        x.text = `[Đáp án kỹ thuật bổ sung – không có trong đề] ${x.text}`;
      }
      const auditNote = 'Đề PDF không có lựa chọn nào khớp hoàn toàn với kết luận kỹ thuật sau khi kiểm tra; phương án có nhãn “Đáp án kỹ thuật bổ sung” do web thêm để giải thích và không phải là phương án in trong đề gốc.';
      q.warning = q.warning ? `${normalizeText(q.warning)} ${auditNote}` : auditNote;
    } else if (q.warning) {
      q.warning = normalizeText(q.warning);
    }
    q.explanation = normalizeText(q.explanation);
  }

  // Keep the static solution wording synchronized with the cleaned choices shown above.
  const staticData = window.STATIC_SOLUTION_DATA;
  if (staticData && staticData.solutions) {
    recursivelyNormalize(staticData.solutions);
    for (const q of data.questions) {
      const solution = staticData.solutions[q.id];
      if (!solution || !Array.isArray(solution.options)) continue;
      for (const row of solution.options) {
        const option = (q.options || []).find(o => o.id === row.id);
        if (option) row.text = option.text;
      }
    }
  }

  data.metadata.text_cleanup = {
    date: '2026-08-08',
    layer: 'data_corrections.js',
    supplemental_answer_count: supplementalAnswerIds.size,
    note: 'Chuẩn hóa lỗi OCR/dấu câu trên giao diện; giữ ID, số câu và trang nguồn để truy vết PDF.'
  };
})();
