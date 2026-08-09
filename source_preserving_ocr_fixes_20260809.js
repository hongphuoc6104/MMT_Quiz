// Conservative full-bank OCR cleanup.
// The PDF wording is canonical: do not translate, paraphrase or modernize exam text here.
// Only restore unambiguous OCR damage, split merged choices/notes, and remove extraction debris.
(function () {
  'use strict';

  const data = window.QUIZ_DATA;
  const manual = window.MANUAL_SOLUTIONS || {};
  if (!data || !Array.isArray(data.questions)) return;


  const questionFixes = new Map([
    ['De01-2-1', 'Trong mô hình OSI, cáp mạng thuộc về tầng:'],
    ['De01-19-18', 'Trong kiến trúc phần mềm của mạng, khái niệm Dịch vụ (Service) được dùng để làm gì?'],
    ['De01-41-39', '“Phương pháp kiểm tra chẵn lẻ” có thể khắc phục được bao nhiêu % số lỗi xảy ra trên đường truyền?'],
    ['De02-4-51', 'Trong kiến trúc phần mềm của mạng, khái niệm Dịch vụ (Service) được dùng để?'],
    ['De02-17-61', 'Trong cơ sở dữ liệu của dịch vụ DNS, loại mẫu tin nào (type) được dùng để chỉ địa chỉ IP?'],
    ['De02-28-71', 'Đơn vị để đo băng thông là gì?'],
    ['De02-6-53', 'Hãy xác định khả năng của một kênh truyền có băng thông...'],
    ['De02-8-55', 'Với địa chỉ mạng con 100.200.0.0/21, hãy xác định số lượng mạng con?'],
    ['De02-16-60', 'Khi sử dụng phần mềm email client như Outlook Express, Pegasus, Thunder Bird thì giao thức...'],
    ['De02-20-63', 'Một tín hiệu được truyền từ điểm A đến điểm B. Hãy xác định độ suy giảm của tín hiệu này.'],
    ['De03-4-95', 'Trong kịch bản trao đổi dữ liệu hai chiều dùng giao thức HDLC như hình sau đây, hãy cho biết các giá trị X, Y trong khung mà bên B sẽ gởi là gì? X là số thứ tự của khung gởi, Y là số thứ tự của khung đang chờ nhận.'],
    ['De03-8-97', 'Điểm khác biệt giữa giao thức Dừng và chờ (Stop and wait) và giao thức cửa sổ trượt (Sliding windows) là gì?'],
    ['De03-12-101', 'Trong giao thức cửa sổ trượt (tầng 2), bên nhận có cửa sổ nhận (receiving window) gồm các số thứ tự 4, 5, 6, 7. Nếu khung số 2 đến bên nhận thì:'],
    ['De03-17-105', 'Hãy chọn mô tả phù hợp về Thông điệp yêu cầu (request message) trong mô hình Client-Server?'],
    ['De04-17-140', '“Mô tả cách mà khách hàng có thể sử dụng được các dịch vụ mạng và cách các dịch vụ có thể được truy cập đến”. Mệnh đề này đề cập đến khái niệm nào?'],
    ['De04-18-141', 'MAN là viết tắt của cụm từ nào?'],
    ['De04-24-147', 'Hãy cho biết tên gọi của hình trạng mạng (topology) sau là gì?'],
    ['De04-25-148', 'Hãy cho biết tên gọi của hình trạng mạng (topology) sau là gì?'],
    ['De04-27-184', 'Tín hiệu tương tự là?'],
    ['De04-30-193', 'Đơn vị truyền dữ liệu của Tầng liên kết dữ liệu gọi là gì?'],
    ['De04-18-211', 'Phương pháp chia kênh nào dưới đây không dựa trên tần số và thời gian sử dụng của kênh truyền?'],
    ['De04-17-210', 'Mệnh đề nào sau đây không đề cập tới phương pháp phân lượt truy cập “Thăm dò phân tán”?'],
    ['De04-14-122', 'FTTH viết tắt là gì?'],
    ['De04-2-150', 'Tìm trên trang https://www.arubanetworks.com/ và cho biết thông số Switch Capacity (khả năng chuyển mạch) của thiết bị chuyển mạch (Switch) Aruba 2540 24G 4SFP+ Switch (JL354A)?'],
    ['De04-9-156', 'Chúng ta phải mất thời gian bao lâu để gởi một tập tin có dung lượng 640,000 bits từ máy A tới máy B thông qua một mạng chuyển mạch, biết rằng (1) Tất cả các liên kết là 1.536 Mbps (2) Tất cả các liên kết đều sử dụng kỹ thuật phân chia theo thời gian với 6 slots/sec (3) Thời gian thiết lập kết nối là 500ms (ghi chú 1Mb=1000Kb; 1Kb=1000bit)?'],
    ['De04-2-159', '“Các bit "1" được mã hóa bằng một điện thế dương, sau đó đến một điện thế âm và tiếp tục như thế” là định nghĩa của phương pháp mã hóa đường truyền?'],
    ['De04-6-163', 'Ảnh 256 mức xám sử dụng bao nhiêu bit để số hóa một điểm ảnh?'],
    ['De04-29-186', 'Để mỗi tín hiệu khi truyền tải mang 03 bit dữ liệu, thì chúng ta cần bao nhiêu mẫu tín hiệu khác nhau?'],
    ['De04-7-200', 'Chuẩn mạng Ethernet 1000Base-LX, cho phép kết nối hai máy tính có khoảng cách xa nhất là?'],
    ['De04-8-201', 'Chuẩn mạng Ethernet 10Base-2, cho phép kết nối trực tiếp 02 nút mạng có khoảng cách xa nhất là?'],
    ['De04-9-202', 'Chuẩn mạng Ethernet 10Base-5, cho phép kết nối trực tiếp 02 nút mạng có khoảng cách xa nhất là?'],
    ['De04-27-220', 'Trong phương pháp CDMA, hai người dùng A và B có mã tương ứng là 11101000 và 10111011, nếu người dùng A gởi đi bit 0 và người dùng B gởi đi bit 1, thì tín hiệu tổng trên kênh truyền sẽ là?'],
    ['De04-4-228', 'Cho sơ đồ mạng như hình, bạn hãy cho biết có bao nhiêu miền đụng độ (Collision Domain) và bao nhiêu miền quảng bá (Broadcast)? Lưu ý: R1, R2 là các router; S1, S2 là các switch; B1 là bridge; H1 là hub.'],
    ['De04-3-227', 'Cho một mạng mà ở đó mỗi router phải tự tính toán và tìm kiếm thông tin về các đường đi đến những điểm khác nhau trên mạng, mạng này đang sử dụng giải thuật chọn đường loại nào?'],
    ['De04-8-232', 'Khi cài đặt giao thức IP cho một máy tính, thì máy tính đó mặc nhiên sẽ được gán địa chỉ IP?'],
    ['De04-16-240', 'Theo lược đồ phân lớp địa chỉ IP, mặt nạ mạng "255.255.255.0" là của lớp nào?'],
    ['De04-25-250', 'Trong một mạng mà ở đó các router sẽ tự động cập nhật lại thông tin về đường đi khi hình trạng mạng thay đổi. Mạng này đang sử dụng giải thuật (cách) chọn đường nào?'],
    ['De04-20-296', 'MIME cho phép một thư điện tử mang được nhiều loại dữ liệu khác nhau như audio, video, hình ảnh, tài liệu... trường nào dưới đây chỉ ra loại dữ liệu có trong thư điện tử?'],
    ['De04-16-272', 'Trong mô hình truyền dữ liệu đơn giản ở tầng vận chuyển của bộ giao thức TCP/IP dưới đây, giá trị SEQ (còn trống) được bên gởi thiết đặt là bao nhiêu?'],
    ['De08-27-319', 'Cho một giao thức cửa sổ trượt sử dụng 2 bits để đánh số thứ tự các vị trí trên cửa sổ. Vùng bộ nhớ đệm của bên nhận có thể chứa được 2 khung của cửa sổ trượt trong trường hợp này là bao nhiêu?']
  ]);

  const optionFixes = new Map([
    ['De01-5-4:d', 'A1=6, A2=8'],
    ['De01-19-18:b', 'Chỉ ra những gì mà một máy chủ có thể cung cấp cho các khách hàng'],
    ['De01-37-35:c', 'Là địa chỉ IP mà giá trị của tất cả các bits ở phần nhận dạng máy tính đều là 1, được sử dụng để chỉ tất cả các máy tính trong mạng.'],
    ['De01-29-27:a', '1'],
    ['De02-21-64:b', 'Switch có chi phí đầu tư thấp hơn Hub'],
    ['De02-16-60:d', 'IMAP'],
    ['De02-17-61:a', 'A'],
    ['De02-17-61:d', 'CNAME'],
    ['De02-18-62:c', '32.768'],
    ['De02-18-62:d', '32.766'],
    ['De02-20-63:a', '0,457 dBm'],
    ['De02-20-63:b', '0,47 dB'],
    ['De02-20-63:c', '0,457 dB'],
    ['De02-20-63:d', '0,47 dBm'],
    ['De02-23-66:a', 'Bởi vì nó truyền tín hiệu tương tự bằng các xung ánh sáng'],
    ['De02-27-70:b', 'MX'],
    ['De02-27-70:c', 'A'],
    ['De02-28-71:d', 'Decibels'],
    ['De02-32-75:d', '255.255.255.252'],
    ['De02-34-78:b', '6'],
    ['De02-35-79:c', 'Tất cả đều đúng'],
    ['De02-36-80:b', 'Định địa chỉ thiết bị'],
    ['De02-38-81:a', 'Địa chỉ MAC nhận được đổi thành địa chỉ MAC của default gateway để chuyển khung đến default gateway'],
    ['De02-41-84:d', '172.18.0.0/16'],
    ['De03-3-89:b', 'Văn bản'],
    ['De03-3-89:c', 'Phim ảnh và âm thanh'],
    ['De03-4-90:c', 'Sự khác biệt giữa tốc độ truyền và nhận của bên truyền và bên nhận'],
    ['De03-5-91:b', 'Chia sẻ đường truyền vật lý giữa các máy tính ở cùng một nhánh mạng'],
    ['De03-4-95:b', 'X=1; Y=2'],
    ['De03-5-96:b', 'Tầng mạng'],
    ['De03-5-96:c', 'Tầng MAC'],
    ['De03-12-101:d', 'Bên nhận sẽ di chuyển cửa sau lên một bước'],
    ['De03-13-102:d', 'Các khung chứa cả tiêu đề (Header) và phần đuôi (Trailer)'],
    ['De03-16-104:b', 'Văn bản'],
    ['De03-16-104:c', 'Phim ảnh và âm thanh'],
    ['De03-16-104:d', 'Hình ảnh'],
    ['De03-17-105:c', 'Là thông điệp Client gửi cho Server để yêu cầu Server tính toán, thực hiện một tác vụ nào đó'],
    ['De03-19-107:d', 'Tất cả các thành phần trên'],
    ['De03-20-108:b', 'Dây dẫn (Cable)'],
    ['De03-20-108:c', 'Tiêu đề (Header)'],
    ['De03-20-108:d', 'Ký tự'],
    ['De04-1-109:b', 'Sai'],
    ['De04-2-110:d', 'Các ứng dụng / dịch vụ mạng'],
    ['De04-3-111:a', 'Mã ASCII'],
    ['De04-6-114:a', '3'],
    ['De04-6-114:b', '4'],
    ['De04-6-114:c', '2'],
    ['De04-6-114:d', '1'],
    ['De04-8-116:a', '2 giây'],
    ['De04-8-116:b', '3,5 giây'],
    ['De04-8-116:c', '3 giây'],
    ['De04-8-116:d', '2,5 giây'],
    ['De04-11-119:a', 'Đúng'],
    ['De04-11-119:b', 'Sai'],
    ['De04-4-127:b', '5'],
    ['De04-4-127:d', '3'],
    ['De04-6-129:c', 'Mạng vẫn hoạt động khi thêm hoặc bớt các máy tính'],
    ['De04-6-129:d', 'Không hoạt động nếu thiết bị tập trung (Hub) bị lỗi'],
    ['De04-11-134:b', '6'],
    ['De04-16-139:c', 'Dữ liệu của khung chỉ chứa dữ liệu cùng với tất cả Header của các tầng bên trên'],
    ['De04-19-142:a', 'Unicast traffic, Multicast traffic, Broadcast traffic'],
    ['De04-22-145:b', 'Vòng'],
    ['De04-22-145:c', 'Trộn'],
    ['De04-25-148:d', 'Ring (vòng)'],
    ['De04-5-162:d', 'Lưỡng cực NRZ'],
    ['De04-8-165:c', '16'],
    ['De04-12-169:b', 'Số bit sử dụng để mã hóa một thang đo'],
    ['De04-13-170:d', '144'],
    ['De04-25-182:c', 'Là tiến trình mã hóa các loại dữ liệu khác nhau như văn bản, âm thanh, hình ảnh, phim ảnh bằng mã nhị phân'],
    ['De04-26-183:c', 'Switch và Bridge'],
    ['De04-26-183:d', 'HUB và Repeater'],
    ['De04-27-184:a', 'Tất cả các câu trên đều sai'],
    ['De04-27-184:b', 'Là tín hiệu có biên độ không bao giờ thay đổi'],
    ['De04-27-184:c', 'Tín hiệu có biên độ không thay đổi trong một khoảng thời gian'],
    ['De04-27-184:d', 'Là tín hiệu có biên độ thay đổi liên tục theo thời gian'],
    ['De04-29-186:d', '06'],
    ['De04-29-192:d', '1100111111100011100011111110000000'],
    ['De04-30-193:d', 'Byte'],
    ['De04-2-195:a', 'No-persistent CSMA'],
    ['De04-2-195:c', 'P-persistent CSMA'],
    ['De04-2-195:d', 'Persistent CSMA'],
    ['De04-6-199:b', '8B/10B'],
    ['De04-7-200:a', '5000m'],
    ['De04-8-201:a', '200m'],
    ['De04-9-202:d', '500m'],
    ['De04-17-210:b', 'Sau thời gian đặt chỗ, các trạm không đặt chỗ muốn truyền dữ liệu thì có thể truyền dữ liệu vào khe thời gian sau cùng'],
    ['De04-18-211:a', 'TDMA'],
    ['De04-18-211:b', 'GSM'],
    ['De04-18-211:d', 'FDMA'],
    ['De04-4-112:c', 'Cần thiết lập kết nối trước khi truyền tin'],
    ['De04-10-118:b', 'Sử dụng một chuỗi 4 tín hiệu TIC và TE'],
    ['De04-9-156:a', '2,5 giây'],
    ['De04-9-156:c', '3,5 giây'],
    ['De04-15-208:c', 'Tích trong của chúng bằng +1'],
    ['De04-24-217:b', 'Phương pháp truy cập ngẫu nhiên'],
    ['De04-25-218:b', '3'],
    ['De04-26-219:b', 'Có'],
    ['De04-27-220:a', '2 0 2 0 2 -2 0 2'],
    ['De04-27-220:b', '2 0 2 0 2 -2 0 0'],
    ['De04-27-220:c', '0 -2 0 2 0 0 2 2'],
    ['De04-27-220:d', '0 2 0 -2 0 0 2 2'],
    ['De04-30-223:d', '10'],
    ['De04-4-228:a', '10 và 4'],
    ['De04-4-228:b', '11 và 4'],
    ['De04-4-228:c', '11 và 5'],
    ['De04-4-228:d', '10 và 5'],
    ['De04-9-233:d', '255.255.255.0'],
    ['De04-13-237:d', '4 bit trong phần nhận dạng máy tính để chia mạng con'],
    ['De04-14-238:d', 'Tối đa 8 mạng con'],
    ['De04-15-239:a', 'A'],
    ['De04-15-239:d', 'B'],
    ['De04-16-240:a', 'A'],
    ['De04-16-240:b', 'C'],
    ['De04-16-240:c', 'D'],
    ['De04-16-240:d', 'B'],
    ['De04-17-241:d', '204.0.0.1'],
    ['De04-23-248:b', '5'],
    ['De04-24-249:a', 'HUB và Repeater'],
    ['De04-24-249:c', 'Switch và Bridge'],
    ['De04-26-251:d', 'Tổ chức một mạng có tối đa 512 host'],
    ['De04-27-252:d', 'Tổ chức một mạng có tối đa 2 host'],
    ['De04-28-253:d', 'Tổ chức một mạng có tối đa 29 host'],
    ['De04-29-254:d', '181.16.21.9'],
    ['De04-7-263:a', 'RECEIVE'],
    ['De04-5-281:d', 'POP3/POP3S'],
    ['De04-17-293:b', 'Máy chủ DNS chính chứa tập tin cơ sở dữ liệu chính của vùng.'],
    ['De04-17-293:d', 'Một vùng (Zone) có thể được quản lý bởi nhiều máy chủ DNS.'],
    ['De04-20-296:a', 'Content-Type'],
    ['De04-21-297:c', 'SMTP/SMTPS và FTP/FTPS'],
    ['De04-28-304:b', 'CNAME'],
    ['De04-28-304:c', 'A'],
    ['De04-30-306:b', 'A'],
    ['De04-30-306:c', 'PTR'],
    ['De04-30-306:d', 'NAME'],
    ['De07-2-309:d', 'Sao'],
    ['De07-7-311:a', 'EBCDIC'],
    ['De08-21-317:b', '29'],
    ['De08-40-325:c', '192.168.1.101'],
    ['De08-40-325:d', '192.168.1.201'],
    ['De08-42-327:b', 'Chọn đường tĩnh']
  ]);

  const warnings = new Map([
    ['De02-6-53', 'Câu hỏi trong dữ liệu trích bị thiếu giá trị băng thông và các dữ kiện còn lại; giữ đáp án nguồn, chưa tái tính độc lập.'],
    ['De02-8-55', 'Câu hỏi trích xuất không nêu địa chỉ mạng ban đầu hoặc số bit đã mượn, nên chưa đủ dữ kiện để kiểm tra độc lập số lượng mạng con.'],
    ['De02-20-63', 'Câu hỏi trích xuất bị thiếu các giá trị công suất tại A và B; giữ đáp án nguồn, chưa thể tái tính độ suy giảm.'],
    ['De02-12-59', 'Câu hỏi trong dữ liệu trích bị thiếu phần cuối sau cụm “header của”; chưa có ảnh trang 12 để xác minh nguyên văn.'],
    ['De02-16-60', 'Câu hỏi trong dữ liệu trích bị thiếu phần cuối; đáp án nguồn được giữ nguyên và cần đối chiếu lại với PDF trang 12.'],
    ['De02-29-72', 'Phương án D bị cắt trong dữ liệu trích; chưa có ảnh trang 15 để phục hồi nguyên văn.'],
    ['De04-24-147', 'Câu hỏi phụ thuộc hình minh họa nhưng repository hiện chưa lưu ảnh trang 29; giữ đáp án nguồn.'],
    ['De04-25-148', 'Câu hỏi phụ thuộc hình minh họa nhưng repository hiện chưa lưu ảnh trang 30; giữ đáp án nguồn.'],
    ['De04-23-146', 'Hình đang hiển thị là bản phục dựng, không phải ảnh gốc từ PDF; cần đối chiếu lại trang 29 khi có tệp nguồn.'],
    ['De04-16-272', 'Câu hỏi phụ thuộc hình minh họa nhưng repository hiện chưa lưu ảnh trang 65; giữ đáp án nguồn.'],
    ['De08-27-319', 'Câu trích xuất có sẵn cụm “có thể chứa được 2 khung”, khiến câu hỏi tự nêu đáp án; chưa có ảnh trang 73 để xác minh hoặc viết lại nguyên văn.']
  ]);

  const safeReplacements = [
    [/(?<!\p{L})tang cao hơn(?!\p{L})/giu, 'tầng cao hơn'],
    [/(?<!\p{L})tang mang(?!\p{L})/giu, 'tầng mạng'],
    [/(?<!\p{L})tang vận chuyển(?!\p{L})/giu, 'tầng vận chuyển'],
    [/(?<!\p{L})tang \(lớp\)(?!\p{L})/giu, 'tầng (lớp)'],
    [/(?<!\p{L})bang phương pháp(?!\p{L})/giu, 'bằng phương pháp'],
    [/(?<!\p{L})vi trí(?!\p{L})/giu, 'vị trí'],
    [/(?<!\p{L})địa chi(?!\p{L})/giu, 'địa chỉ'],
    [/(?<!\p{L})mang con(?!\p{L})/giu, 'mạng con'],
    [/(?<!\p{L})chuẩn mang(?!\p{L})/giu, 'chuẩn mạng'],
    [/(?<!\p{L})thi(?!\p{L})/gu, 'thì'],
    [/(?<!\p{L})sé(?!\p{L})/gu, 'sẽ'],
    [/(?<!\p{L})dé dàng(?!\p{L})/giu, 'dễ dàng'],
    [/(?<!\p{L})dé(?=\s+(?:làm|lam|đo|chia|truy vấn|chỉ|chi|thể hiện|xác định|truy cập)(?!\p{L}))/giu, 'để'],
    [/(?<!\p{L})lam gì(?!\p{L})/gu, 'làm gì'],
    [/\bDon vị\b/g, 'Đơn vị'],
    [/\bdon vị\b/g, 'đơn vị'],
    [/\bCac\b/g, 'Các'],
    [/\bTat cả\b/g, 'Tất cả'],
    [/\bChia sé\b/g, 'Chia sẻ'],
    [/\bAnh 256\b/g, 'Ảnh 256'],
    [/\bđiện thé\b/g, 'điện thế'],
    [/\bdé thé hiện\b/g, 'để thể hiện'],
    [/\bva điện\b/g, 'và điện'],
    [/\bLuong cực\b/g, 'Lưỡng cực'],
    [/\bMAN là viết tat của cum từ\b/g, 'MAN là viết tắt của cụm từ'],
    [/\btruyền tai \(traffic\) trên mang\b/g, 'truyền tải (traffic) trên mạng'],
    [/\bhình trang mang\b/gi, 'hình trạng mạng'],
    [/\bsao đây\b/g, 'sau đây'],
    [/\bhình anh\b/g, 'hình ảnh'],
    [/\bThiết bị mang\b/g, 'Thiết bị mạng'],
    [/\bTín hiệu tuần tự\b/g, 'Tín hiệu tương tự'],
    [/\btín hiệu tuần tự\b/g, 'tín hiệu tương tự'],
    [/\bCac mạng\b/g, 'Các mạng'],
    [/\bPhương phát truy cập ngẫu nhiêu\b/g, 'Phương pháp truy cập ngẫu nhiên'],
    [/\bđường di\b/g, 'đường đi'],
    [/\bma ở đó\b/g, 'mà ở đó'],
    [/\bbới TCP\b/g, 'bởi TCP'],
    [/\bphận đoạn\b/g, 'phân đoạn'],
    [/\bday byte\b/g, 'dãy byte'],
    [/\bdấy byte\b/g, 'dãy byte'],
    [/\bHay cho biết\b/g, 'Hãy cho biết'],
    [/\bva HTTPS\b/g, 'và HTTPS'],
    [/\bma Webserver\b/g, 'mà Webserver'],
    [/\bkhông thé\b/g, 'không thể'],
    [/\bASCH\b/g, 'ASCII'],
    [/\bMINE\b/g, 'MIME'],
    [/\bthu điện tử\b/g, 'thư điện tử'],
    [/\bdé truy vấn\b/g, 'để truy vấn'],
    [/\bLiunx\b/g, 'Linux'],
    [/\bEDBCIC\b/g, 'EBCDIC'],
    [/\btối da\b/g, 'tối đa'],
    [/\bdòng luồng\b/g, 'luồng']
  ];

  // JavaScript's ASCII-only \b does not recognize Vietnamese letters at a
  // word boundary. Keep these high-confidence repairs Unicode-aware.
  safeReplacements.unshift(
    [/(?<!\p{L})Don vị(?!\p{L})/gu, 'Đơn vị'],
    [/(?<!\p{L})don vị(?!\p{L})/gu, 'đơn vị'],
    [/(?<!\p{L})là gi(?=\s*\?)/giu, 'là gì'],
    [/(?<!\p{L})điện thé(?!\p{L})/giu, 'điện thế'],
    [/(?<!\p{L})thé hiện(?!\p{L})/giu, 'thể hiện'],
    [/(?<!\p{L})không thé(?!\p{L})/giu, 'không thể'],
    [/(?<!\p{L})mặt nạ mang(?!\p{L})/giu, 'mặt nạ mạng'],
    [/(?<!\p{L})tầng mang(?!\p{L})/giu, 'tầng mạng'],
    [/(?<!\p{L})thu điện tử(?!\p{L})/giu, 'thư điện tử']
  );

  function clean(value) {
    if (typeof value !== 'string') return value;
    let out = value.normalize('NFC');
    for (const [pattern, replacement] of safeReplacements) out = out.replace(pattern, replacement);
    return out
      .replace(/\s+([?,;:])/g, '$1')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }

  for (const q of data.questions) {
    if (questionFixes.has(q.id)) q.question = questionFixes.get(q.id);
    q.question = clean(q.question);
    q.chapter = clean(q.chapter);

    for (const option of q.options || []) {
      const key = q.id + ':' + option.id;
      if (optionFixes.has(key)) option.text = optionFixes.get(key);
      option.text = clean(option.text);
    }

    if (warnings.has(q.id)) q.warning = warnings.get(q.id);
    else if (typeof q.warning === 'string') q.warning = clean(q.warning);

    const correct = (q.options || []).find(option => option.id === q.correct_option_id);
    if (correct && /^(?:Lựa chọn phù hợp|Theo chức năng|Áp dụng dữ kiện)/.test(String(q.explanation || ''))) {
      q.explanation = 'Đáp án: ' + String(correct.text).replace(/\.+$/g, '') + '.';
    } else {
      q.explanation = clean(q.explanation);
    }
  }

  function setManual(id, path, value) {
    let target = manual[id];
    if (!target) return;
    for (let i = 0; i < path.length - 1; i += 1) {
      target = target?.[path[i]];
      if (!target) return;
    }
    target[path[path.length - 1]] = value;
  }

  // Keep exam wording untouched while teaching the canonical networking meaning.
  setManual('De01-9-8', ['knowledge'], 'Khung (frame) là đơn vị dữ liệu của tầng liên kết dữ liệu. Truyền khung tin cậy và đúng thứ tự thường phối hợp số thứ tự, khung báo nhận (ACK) và bộ đếm thời gian/timeout.');
  setManual('De01-19-18', ['knowledge'], 'Trong kiến trúc phân tầng, dịch vụ (service) mô tả những gì một tầng cung cấp cho tầng phía trên. Giao thức (protocol) mô tả quy tắc trao đổi giữa các thực thể ngang hàng; giao diện (interface) mô tả cách truy cập dịch vụ.');
  setManual('De01-19-18', ['reasoning'], 'Giữ nguyên cách diễn đạt của đề ở phương án B. Về thuật ngữ chuẩn, “khách hàng” ở đây nên được hiểu là thực thể hoặc tầng phía trên sử dụng dịch vụ, không nhất thiết là client trong mô hình client-server.');
  setManual('De01-19-18', ['options', 'b', 'why'], 'Đúng theo khóa đề. Ý nghĩa chuẩn là dịch vụ cho biết một tầng cung cấp những chức năng gì cho tầng phía trên.');
  setManual('De01-19-18', ['summary'], 'Service = tầng dưới cung cấp gì; protocol = các thực thể ngang hàng trao đổi thế nào; interface = truy cập service bằng cách nào.');
  setManual('De02-4-51', ['knowledge'], 'Trong kiến trúc phân tầng, dịch vụ (service) mô tả những gì một tầng cung cấp cho tầng phía trên; giao thức (protocol) mô tả quy tắc trao đổi giữa các thực thể ngang hàng; giao diện (interface) mô tả cách truy cập dịch vụ.');
  setManual('De04-16-272', ['reasoning'], 'Khóa đáp án nguồn là 2048. Vì hình minh họa trang 65 chưa có trong repository, chưa thể tái tính độc lập từ phần chữ còn lại.');
  setManual('De04-1-149', ['knowledge'], "Trong mã Morse: E='.', F='..-.', G='--.', H='....'. Ghép mã của E, F, G, H theo đúng thứ tự để được chuỗi cần chọn.");
  setManual('De04-1-149', ['options', 'a', 'why'], 'Đúng: E là dấu chấm; F là ..-.; G là --.; H là bốn dấu chấm.');
  setManual('De04-1-149', ['calculation', 'steps', 3], 'H tương ứng với bốn dấu chấm.');
  setManual('De04-1-149', ['calculation', 'result'], '. / ..-. / --. / .... (phương án A).');
  setManual('De04-1-149', ['summary'], 'E: dấu chấm; F: ..-.; G: --.; H: bốn dấu chấm.');
  setManual('De04-30-193', ['knowledge'], 'Đơn vị dữ liệu giao thức (PDU) của tầng liên kết dữ liệu là khung (frame). Packet là PDU của tầng mạng; bit là PDU của tầng vật lý.');
  setManual('De04-30-193', ['options', 'd', 'why'], 'Byte là nhóm 8 bit, không phải tên PDU chuẩn của tầng liên kết dữ liệu.');
  setManual('De04-30-193', ['commonMistakes', 0], 'Nhầm byte với khung: byte là đơn vị biểu diễn dữ liệu, còn frame là PDU của tầng liên kết dữ liệu.');
  setManual('De04-2-195', ['options', 'a', 'why'], 'No-persistent CSMA là một biến thể chuẩn của CSMA, nhưng không phải tên của phương pháp được mô tả trong câu hỏi này.');
  setManual('De07-7-311', ['options', 'a', 'why'], 'EBCDIC là bộ mã ký tự cũ gắn với hệ thống IBM, không phải bộ mã phổ biến toàn cầu nhất hiện nay.');

  if (data.metadata) {
    data.metadata.source_preserving_ocr_audit = {
      date: '2026-08-09',
      question_count: data.questions.length,
      question_repairs: questionFixes.size,
      option_repairs: optionFixes.size,
      rule: 'Preserve PDF wording; repair only unambiguous OCR/extraction damage.'
    };
  }
})();
