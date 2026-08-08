(function(){
'use strict';

const FACTS=[
  {re:/\bphysical\b|tầng vật lý/i,fact:'Physical là tầng 1 OSI, truyền chuỗi bit thô qua môi trường vật lý và quy định tín hiệu, đầu nối, tốc độ bit, đặc tính điện/quang.',when:'câu hỏi nói về truyền bit, tín hiệu điện/quang, đầu nối hoặc đặc tính vật lý của đường truyền'},
  {re:/data\s*link|liên kết dữ liệu/i,fact:'Data Link là tầng 2 OSI, làm việc với frame, địa chỉ MAC, phát hiện lỗi trên liên kết và điều khiển truy nhập môi trường.',when:'câu hỏi nói về frame, MAC, switch/bridge hoặc điều khiển truy nhập đường truyền'},
  {re:/\bnetwork\b|tầng mạng/i,fact:'Network là tầng 3 OSI, chịu trách nhiệm địa chỉ logic và định tuyến packet giữa các mạng; IP và router gắn chủ yếu với tầng này.',when:'câu hỏi nói về IP, định tuyến, packet hoặc router'},
  {re:/\btransport\b|tầng vận chuyển|tầng giao vận/i,fact:'Transport là tầng 4 OSI, cung cấp truyền thông đầu-cuối giữa tiến trình; TCP/UDP và số hiệu cổng hoạt động tại đây.',when:'câu hỏi nói về TCP/UDP, port, phân đoạn, độ tin cậy đầu-cuối hoặc kiểm soát luồng đầu-cuối'},
  {re:/\bsession\b|tầng phiên/i,fact:'Session là tầng 5 OSI, quản lý việc thiết lập, duy trì và đồng bộ phiên làm việc giữa các ứng dụng.',when:'câu hỏi hỏi về quản lý hoặc đồng bộ phiên'},
  {re:/\bpresentation\b|tầng trình diễn/i,fact:'Presentation là tầng 6 OSI, liên quan biểu diễn dữ liệu, chuyển đổi định dạng, mã hóa/giải mã và nén.',when:'câu hỏi hỏi về biểu diễn, chuyển đổi định dạng, mã hóa hoặc nén dữ liệu'},
  {re:/\bapplication\b|tầng ứng dụng/i,fact:'Application là tầng 7 OSI, cung cấp dịch vụ mạng trực tiếp cho ứng dụng người dùng.',when:'câu hỏi hỏi về các dịch vụ/giao thức ứng dụng như HTTP, FTP, SMTP, DNS'},
  {re:/\brouter\b/i,fact:'Router chuyển tiếp packet dựa trên địa chỉ lớp 3 và bảng định tuyến, vì vậy thuộc thiết bị tầng Network.',when:'câu hỏi hỏi thiết bị nối các mạng IP hoặc ra quyết định định tuyến lớp 3'},
  {re:/\bswitch\b/i,fact:'Switch Ethernet thông thường chuyển frame dựa trên địa chỉ MAC và thuộc tầng Data Link; switch layer-3 là trường hợp mở rộng có chức năng định tuyến.',when:'câu hỏi hỏi thiết bị chuyển frame trong LAN theo địa chỉ MAC'},
  {re:/\bbridge\b|cầu nối/i,fact:'Bridge nối các đoạn LAN và lọc/chuyển frame theo MAC ở tầng Data Link.',when:'câu hỏi hỏi thiết bị nối các đoạn LAN ở tầng 2'},
  {re:/\bhub\b|repeater|bộ lặp/i,fact:'Hub/repeater hoạt động ở tầng Physical: tái tạo/phát lại tín hiệu, không đọc địa chỉ MAC hay IP để định tuyến.',when:'câu hỏi hỏi thiết bị lặp hoặc khuếch đại/tái tạo tín hiệu vật lý'},
  {re:/\btcp\b/i,fact:'TCP là giao thức hướng kết nối, truyền byte tin cậy, có số thứ tự, ACK, truyền lại, kiểm soát luồng và điều khiển tắc nghẽn.',when:'câu hỏi yêu cầu truyền tin cậy, đúng thứ tự hoặc cơ chế kết nối đầu-cuối'},
  {re:/\budp\b/i,fact:'UDP là giao thức không kết nối, datagram, overhead thấp; bản thân UDP không đảm bảo giao hàng, thứ tự hay truyền lại.',when:'câu hỏi ưu tiên đơn giản/độ trễ thấp hoặc ứng dụng tự xử lý độ tin cậy'},
  {re:/\bicmp\b/i,fact:'ICMP mang thông báo điều khiển/lỗi cho IP và được dùng bởi các công cụ như ping; nó không thay TCP/UDP để vận chuyển dữ liệu ứng dụng.',when:'câu hỏi hỏi về báo lỗi IP, echo request/reply hoặc chẩn đoán mạng'},
  {re:/\barp\b/i,fact:'ARP phân giải địa chỉ IPv4 thành địa chỉ MAC trong cùng miền quảng bá/LAN.',when:'câu hỏi hỏi cách tìm MAC khi đã biết IPv4 của máy đích trong LAN'},
  {re:/\bdhcp\b/i,fact:'DHCP tự động cấp cấu hình IP như địa chỉ IP, subnet mask, default gateway và DNS cho host.',when:'câu hỏi hỏi cơ chế cấp phát cấu hình IP tự động'},
  {re:/\bdns\b/i,fact:'DNS là hệ thống tên miền ánh xạ tên với dữ liệu tài nguyên; truy vấn thường dùng UDP/53 và có trường hợp dùng TCP/53.',when:'câu hỏi hỏi phân giải tên miền hoặc bản ghi DNS'},
  {re:/\bmx\b/i,fact:'Bản ghi MX chỉ ra mail exchanger nhận thư cho một miền, kèm mức ưu tiên.',when:'câu hỏi hỏi mail server chịu trách nhiệm nhận thư của domain'},
  {re:/\bcname\b/i,fact:'CNAME tạo bí danh trỏ một tên DNS tới một canonical name khác.',when:'câu hỏi hỏi bí danh của một tên máy/tên miền'},
  {re:/\bns\b|name\s*server/i,fact:'Bản ghi NS chỉ ra máy chủ DNS có thẩm quyền cho một zone/domain.',when:'câu hỏi hỏi name server có thẩm quyền của miền'},
  {re:/\bftp\b/i,fact:'FTP là giao thức truyền tệp ở tầng ứng dụng, truyền thống dùng kết nối điều khiển TCP/21 và kết nối dữ liệu riêng.',when:'câu hỏi hỏi giao thức truyền tệp'},
  {re:/\bhttp\b/i,fact:'HTTP là giao thức ứng dụng theo mô hình request/response dùng cho Web; HTTPS là HTTP được bảo vệ bởi TLS.',when:'câu hỏi hỏi giao thức trao đổi tài nguyên Web'},
  {re:/\bsmtp\b/i,fact:'SMTP dùng để gửi/chuyển tiếp thư điện tử giữa client-server hoặc mail server.',when:'câu hỏi hỏi giao thức gửi email'},
  {re:/\bpop3\b/i,fact:'POP3 là giao thức truy xuất thư, thường thiên về tải thư từ máy chủ về client.',when:'câu hỏi hỏi giao thức nhận/tải email theo mô hình POP'},
  {re:/\bimap\b/i,fact:'IMAP truy cập và đồng bộ hộp thư trực tiếp trên máy chủ, phù hợp sử dụng nhiều thiết bị.',when:'câu hỏi hỏi giao thức đồng bộ/truy cập mailbox trên server'},
  {re:/analog|tương tự/i,fact:'Tín hiệu analog biến thiên liên tục theo thời gian/biên độ.',when:'câu hỏi mô tả đại lượng/tín hiệu biến thiên liên tục'},
  {re:/digital|số\b/i,fact:'Tín hiệu số biểu diễn thông tin bằng các mức rời rạc, điển hình là bit 0 và 1.',when:'câu hỏi mô tả tín hiệu có các mức rời rạc hoặc biểu diễn bit'},
  {re:/csma\/?cd/i,fact:'CSMA/CD cảm nhận sóng mang và phát hiện va chạm, gắn với Ethernet half-duplex dùng môi trường chia sẻ.',when:'câu hỏi hỏi cơ chế truy nhập Ethernet cổ điển trên môi trường chia sẻ/half-duplex'},
  {re:/csma\/?ca/i,fact:'CSMA/CA cố gắng tránh va chạm và được dùng trong IEEE 802.11 vì thiết bị vô tuyến khó phát hiện va chạm khi đang truyền.',when:'câu hỏi hỏi cơ chế truy nhập WLAN 802.11'},
  {re:/aloha/i,fact:'ALOHA là phương pháp truy nhập ngẫu nhiên; Pure ALOHA và Slotted ALOHA khác nhau ở việc có đồng bộ khe thời gian hay không.',when:'câu hỏi hỏi kỹ thuật truy nhập ngẫu nhiên ALOHA'},
  {re:/fdma/i,fact:'FDMA chia tài nguyên theo các dải tần khác nhau.',when:'câu hỏi hỏi đa truy nhập/phân kênh dựa trên tần số'},
  {re:/tdma/i,fact:'TDMA chia tài nguyên theo các khe thời gian.',when:'câu hỏi hỏi đa truy nhập/phân kênh dựa trên thời gian'},
  {re:/cdma/i,fact:'CDMA phân biệt người dùng/kênh bằng mã trải phổ thay vì cấp riêng khe thời gian hoặc dải tần cố định.',when:'câu hỏi hỏi kỹ thuật phân chia theo mã'},
  {re:/go[- ]?back[- ]?n/i,fact:'Go-Back-N là ARQ cửa sổ trượt: bên gửi có thể gửi nhiều frame nhưng khi có lỗi thường truyền lại từ frame lỗi trở đi.',when:'câu hỏi hỏi ARQ cửa sổ với truyền lại chuỗi frame từ vị trí lỗi'},
  {re:/selective\s*repeat|lặp lại có chọn/i,fact:'Selective Repeat chỉ truyền lại các frame bị mất/lỗi và cần cửa sổ nhận/bộ đệm phức tạp hơn Go-Back-N.',when:'câu hỏi hỏi ARQ chỉ truyền lại frame lỗi/mất'},
  {re:/stop[- ]?and[- ]?wait|dừng.*chờ/i,fact:'Stop-and-Wait gửi một frame rồi chờ ACK trước khi gửi frame tiếp theo, đơn giản nhưng kém hiệu quả khi RTT lớn.',when:'câu hỏi hỏi ARQ mỗi lần chỉ có một frame chưa được xác nhận'},
  {re:/\back\b|acknowledg|báo nhận/i,fact:'ACK xác nhận dữ liệu/frame đã được nhận; kết hợp số thứ tự và timeout giúp xây dựng cơ chế truyền tin cậy.',when:'câu hỏi hỏi cơ chế xác nhận dữ liệu đã đến'},
  {re:/timeout|time[- ]?out|bộ đếm thời gian|timer/i,fact:'Timeout cho phép phát hiện gián tiếp việc dữ liệu/ACK có thể bị mất và kích hoạt truyền lại.',when:'câu hỏi hỏi cách xử lý trường hợp không nhận được ACK trong thời gian chờ'},
  {re:/số thứ tự|sequence|\bseq\b/i,fact:'Số thứ tự giúp nhận biết vị trí dữ liệu, phát hiện trùng/mất và khôi phục đúng thứ tự.',when:'câu hỏi hỏi cách bảo đảm thứ tự hoặc đánh dấu vị trí dữ liệu'},
  {re:/crc/i,fact:'CRC xem chuỗi bit như đa thức trên GF(2), chia modulo-2 cho đa thức sinh và dùng phần dư làm mã kiểm tra.',when:'câu hỏi hỏi cơ chế phát hiện lỗi bằng phép chia đa thức modulo-2'},
  {re:/parity|chẵn lẻ/i,fact:'Parity thêm bit chẵn/lẻ để phát hiện các mẫu lỗi làm thay đổi tính chẵn lẻ; nó phát hiện mọi lỗi có số bit đảo là lẻ nhưng không sửa lỗi.',when:'câu hỏi hỏi kiểm tra lỗi đơn giản bằng bit chẵn/lẻ'},
  {re:/1000base[- ]?lx|\blx\b/i,fact:'1000BASE-LX là Gigabit Ethernet quang bước sóng dài; khoảng cách phụ thuộc loại sợi/biến thể và thường xa hơn SX.',when:'câu hỏi hỏi chuẩn Gigabit Ethernet quang LX'},
  {re:/1000base[- ]?sx|\bsx\b/i,fact:'1000BASE-SX là Gigabit Ethernet quang bước sóng ngắn, chủ yếu dùng multimode ở khoảng cách ngắn hơn LX.',when:'câu hỏi hỏi chuẩn Gigabit Ethernet quang SX'},
  {re:/utp|xoắn đôi/i,fact:'UTP là cáp đồng xoắn đôi không bọc chống nhiễu, phổ biến trong Ethernet LAN.',when:'câu hỏi hỏi môi trường truyền cáp xoắn đôi không shield'},
  {re:/coax|đồng trục/i,fact:'Cáp đồng trục có lõi dẫn trung tâm và lớp chắn đồng tâm, chống nhiễu tốt hơn cặp dây không bọc trong nhiều ứng dụng.',when:'câu hỏi hỏi cấu trúc/môi trường truyền đồng trục'},
  {re:/fiber|quang/i,fact:'Cáp quang truyền bằng ánh sáng, băng thông lớn, suy hao thấp theo khoảng cách và miễn nhiễm nhiễu điện từ.',when:'câu hỏi hỏi môi trường truyền quang hoặc cần khoảng cách/băng thông cao'},
  {re:/utf[- ]?8/i,fact:'UTF-8 mã hóa toàn bộ Unicode scalar values bằng chuỗi 1 đến 4 byte và tương thích ASCII cho 128 ký tự đầu.',when:'câu hỏi hỏi dạng mã hóa Unicode UTF-8'}
];

function clean(s){return String(s==null?'':s).replace(/\s+/g,' ').trim()}
function allText(q){return clean([q.question,...(q.options||[]).map(o=>o.text),q.explanation].join(' '))}
function isNegative(q){return /\b(không|sai|không phải|ngoại trừ|except|incorrect|not)\b/i.test(q.question)}
function matchFacts(text){return FACTS.filter(x=>x.re.test(text)).slice(0,3)}
function optionFact(text){return FACTS.find(x=>x.re.test(text))||null}

function topicKnowledge(q){
  const t=allText(q), facts=matchFacts(t);
  if(/mô hình osi|\bosi\b/i.test(t)) return 'Mô hình OSI chia chức năng truyền thông thành 7 tầng. Khi giải cần xác định chính xác đối tượng được hỏi (bit, frame, packet, segment/dữ liệu ứng dụng), kiểu địa chỉ và thiết bị/giao thức thuộc tầng nào.';
  if(/subnet|cidr|mặt nạ|mask|địa chỉ ip|ipv4|\/[0-9]{1,2}\b/i.test(t)) return 'Với IPv4/CIDR, luôn tách số bit network và host, xác định kích thước block, địa chỉ network, broadcast và miền host dùng được. Không được nhầm “tổng số địa chỉ” với “số host dùng được”.';
  if(/tcp|udp|port|socket|segment|seq|ack/i.test(t)) return 'Ở tầng Transport, TCP và UDP đều dùng port để định danh tiến trình nhưng khác mạnh về kết nối và độ tin cậy. Với TCP cần theo dõi sequence number, acknowledgement number, cờ SYN/ACK/FIN và kích thước dữ liệu.';
  if(/dns|mx|cname|name server|record/i.test(t)) return 'DNS lưu dữ liệu theo các resource record. Muốn chọn đúng phải phân biệt chức năng của A/AAAA, NS, MX, CNAME, PTR và cơ chế truy vấn DNS.';
  if(/ethernet|csma|aloha|collision|đụng độ|va chạm|mac\b/i.test(t)) return 'Trong LAN/môi trường chia sẻ, cần phân biệt cơ chế truy nhập đường truyền, địa chỉ MAC và điều kiện xảy ra va chạm. Một thời điểm chỉ một trạm phát trên kênh chia sẻ thì không có va chạm do nhiều trạm phát đồng thời.';
  if(/crc|parity|chẵn lẻ|frame|khung|go[- ]?back|selective|stop[- ]?and|cửa sổ/i.test(t)) return 'Tầng liên kết dữ liệu dùng framing, kiểm soát lỗi và ARQ. Khi giải cần tách ba việc: phát hiện lỗi, xác nhận/timeout và đánh số thứ tự/cửa sổ để bảo đảm đúng thứ tự.';
  if(/shannon|nyquist|băng thông|bandwidth|snr|tín hiệu|analog|digital|baud/i.test(t)) return 'Bài truyền dữ liệu vật lý cần xác định đại lượng: bandwidth, số mức tín hiệu, SNR, bit rate hay baud rate; sau đó chọn đúng định luật Nyquist hoặc Shannon và đổi đơn vị trước khi tính.';
  if(facts.length) return facts.map(x=>x.fact).join(' ');
  return 'Để giải câu này, trước hết xác định đúng khái niệm mà đề đang hỏi, sau đó đối chiếu từng phương án với định nghĩa/điều kiện của khái niệm đó. Không chọn theo từ khóa giống nhau nếu chức năng hoặc điều kiện áp dụng khác nhau.';
}

function reasoning(q){
  const correct=(q.options||[]).find(o=>o.id===q.correct_option_id);
  const neg=isNegative(q);
  const base=clean(q.explanation)||`Phương án phù hợp với dữ kiện của câu hỏi là ${correct?clean(correct.text):q.correct_option_id}.`;
  return `${neg?'Đây là câu hỏi có điều kiện phủ định (KHÔNG/SAI/NGOẠI TRỪ), nên phải tìm phương án vi phạm điều kiện hoặc không thuộc nhóm được mô tả. ':'Đây là câu hỏi chọn phương án phù hợp với khái niệm/dữ kiện đã cho. '}${base}`;
}

function optionAnalysis(q,o){
  const correct=o.id===q.correct_option_id;
  const f=optionFact(o.text);
  const correctOpt=(q.options||[]).find(x=>x.id===q.correct_option_id);
  const neg=isNegative(q);
  let why;
  if(correct){
    why=`Đây là đáp án được bộ đề xác định sau đối chiếu. ${clean(q.explanation)}`;
    if(f) why+=` ${f.fact}`;
    if(neg) why+=' Vì đề hỏi theo dạng phủ định, việc được chọn không có nghĩa nội dung của phương án luôn “đúng”; nó là phương án thỏa điều kiện KHÔNG/SAI/NGOẠI TRỪ của đề.';
  }else{
    why=f?`${f.fact} Tuy nhiên trong câu hiện tại, phương án này không thỏa điều kiện mà đề hỏi; phương án phù hợp là “${clean(correctOpt?.text)}”.`:`Trong câu hiện tại, “${clean(o.text)}” không khớp với định nghĩa/dữ kiện cần chọn. Đáp án phù hợp là “${clean(correctOpt?.text)}”; điểm quyết định là: ${clean(q.explanation)}`;
    if(neg) why+=' Với câu phủ định, cần đặc biệt tránh loại một phương án chỉ vì bản thân nó là phát biểu đúng trong ngữ cảnh khác.';
  }
  let when;
  if(f) when=`Phương án này sẽ đúng khi ${f.when}. Khi đó áp dụng đúng bản chất: ${f.fact}`;
  else if(correct) when=`Phương án này đúng khi câu hỏi có đúng các dữ kiện/điều kiện như hiện tại. Nếu thay đổi điều kiện của đề, cần kiểm tra lại thay vì ghi nhớ máy móc vị trí A/B/C/D.`;
  else when=`Phương án “${clean(o.text)}” chỉ nên được chọn khi đề bài trực tiếp mô tả đúng khái niệm/điều kiện của nó. Trong câu hiện tại điều kiện đó không khớp; hãy đối chiếu lại với “${clean(correctOpt?.text)}” và phần giải thích của đề.`;
  return {id:o.id,text:o.text,correct,why,when};
}

function num(s){return Number(String(s).replace(',','.'))}
function fmt(n){return Number.isFinite(n)?(Math.round(n*1e6)/1e6).toLocaleString('vi-VN'):String(n)}
function cidrCalc(q,t){
  const m=t.match(/\/\s*(\d{1,2})\b/); if(!m) return null;
  const p=+m[1]; if(p<0||p>32) return null;
  const h=32-p,total=2**h,usable=h>=2?total-2:(h===1?2:1);
  return {title:'Tính IPv4/CIDR',steps:[
    `Prefix là /${p} nên có ${p} bit network.`,
    `Số bit host: h = 32 - ${p} = ${h}.`,
    `Tổng số địa chỉ trong block: 2^h = 2^${h} = ${fmt(total)} địa chỉ.`,
    h>=2?`Theo cách tính subnet IPv4 thông thường, số host dùng được = 2^h - 2 = ${fmt(total)} - 2 = ${fmt(usable)} (loại network address và broadcast address).`:`Với prefix /${p}, quy tắc sử dụng địa chỉ phụ thuộc ngữ cảnh đặc biệt point-to-point/host route; không áp dụng máy móc phép trừ 2.`,
    'Nếu đề hỏi số subnet, còn phải biết prefix ban đầu và số bit mượn; số subnet thường là 2^(số bit mượn).'
  ],result:`Các giá trị nền cho /${p}: ${h} bit host, ${fmt(total)} địa chỉ trong block${h>=2?`, ${fmt(usable)} host dùng được theo cách tính thông thường`:''}.`};
}
function tcpCalc(q,t){
  if(!/(seq|ack|sequence|acknowledg|bắt tay|handshake)/i.test(t)) return null;
  const nums=[...t.matchAll(/(?:seq(?:uence)?|ack(?:nowledgement)?)\s*[=:]?\s*(\d+)/ig)].map(x=>+x[1]);
  const steps=[
    'Ghi riêng Sequence Number và Acknowledgement Number của từng chiều A→B và B→A; không cộng lẫn hai không gian số thứ tự.',
    'ACK luôn chỉ byte kế tiếp mà bên nhận mong đợi. Nếu đã nhận liên tục đến byte N thì ACK = N + 1.',
    'SYN và FIN mỗi cờ tiêu thụ 1 số thứ tự dù không mang dữ liệu ứng dụng; vì vậy khi xác nhận SYN/FIN thường có ACK = SEQ + 1.',
    'Nếu segment mang L byte dữ liệu bắt đầu tại SEQ = S thì sequence kế tiếp của chiều đó là S + L (cộng thêm 1 nếu segment có SYN/FIN tương ứng).'
  ];
  if(nums.length) steps.push(`Các số xuất hiện trong câu/giải thích (${nums.join(', ')}) phải được thay vào đúng chiều truyền trước khi cộng.`);
  return {title:'Theo dõi TCP SEQ/ACK',steps,result:clean(q.explanation)};
}
function shannonCalc(q,t){
  if(!/(shannon|snr|signal.?to.?noise|tín hiệu.*nhiễu)/i.test(t)) return null;
  return {title:'Công thức Shannon',steps:[
    'Xác định băng thông B theo Hz.',
    'Nếu SNR cho theo dB: SNR_linear = 10^(SNR_dB/10).',
    'Dung lượng kênh cực đại: C = B × log2(1 + SNR_linear) bit/s.',
    'Đổi Hz/kHz/MHz và bit/s/kbit/s/Mbit/s về cùng hệ đơn vị rồi mới so với các đáp án.'
  ],result:'Thay đúng B và SNR của đề vào công thức; nếu đề thiếu một trong hai dữ kiện thì không thể có kết quả số duy nhất.'};
}
function nyquistCalc(q,t){
  if(!/(nyquist|mức tín hiệu|signal levels|baud)/i.test(t)) return null;
  return {title:'Công thức Nyquist (kênh không nhiễu)',steps:[
    'Xác định bandwidth B (Hz) và số mức tín hiệu M.',
    'Tốc độ bit cực đại: C = 2B × log2(M) bit/s.',
    'Nếu mỗi symbol mang k bit thì M = 2^k và log2(M) = k.',
    'Kiểm tra đề đang hỏi bit rate hay baud rate để tránh dùng nhầm đại lượng.'
  ],result:'Thay B và M của đề vào C = 2B log2(M).'};
}
function transmissionCalc(q,t){
  if(!/(thời gian truyền|transmission delay|độ trễ truyền|kbit\/s|mbit\/s|kbps|mbps|gbps)/i.test(t)) return null;
  return {title:'Tính thời gian truyền',steps:[
    'Đổi kích thước dữ liệu L về bit: 1 byte = 8 bit.',
    'Đổi tốc độ R về bit/s: kbit/s = 10^3 bit/s, Mbit/s = 10^6 bit/s, Gbit/s = 10^9 bit/s (trừ khi đề quy ước khác).',
    'Transmission delay: d_trans = L / R (giây).',
    'Đổi giây sang ms bằng ×1000 hoặc sang µs bằng ×10^6 nếu cần.'
  ],result:'Áp dụng d_trans = L/R với L tính bằng bit và R tính bằng bit/s.'};
}
function crcCalc(q,t){
  if(!/\bcrc\b/i.test(t)) return null;
  return {title:'Bài CRC',steps:[
    'Viết dataword D và generator G ở dạng bit; nếu G có bậc r thì r = số bit(G) - 1.',
    'Nối r bit 0 vào cuối D để được D×2^r.',
    'Chia modulo-2 (XOR, không nhớ/không mượn) chuỗi trên cho G.',
    'Phần dư r bit là CRC; codeword = D nối CRC.',
    'Bên nhận chia codeword cho cùng G: phần dư 0 nghĩa là không phát hiện lỗi theo phép kiểm tra CRC.'
  ],result:'Cần thực hiện phép chia XOR theo đúng D và G cụ thể của đề; không dùng phép chia số học thông thường.'};
}
function windowCalc(q,t){
  if(!/(go[- ]?back[- ]?n|selective repeat|cửa sổ|window)/i.test(t)) return null;
  return {title:'Cửa sổ trượt / ARQ',steps:[
    'Nếu trường số thứ tự có k bit thì không gian sequence number có 2^k giá trị.',
    'Với Go-Back-N, cửa sổ gửi tối đa thường W_s ≤ 2^k - 1.',
    'Với Selective Repeat, để tránh nhập nhằng vòng số thứ tự thường W_s và W_r không vượt quá 2^(k-1).',
    'Sau ACK, trượt mép trái cửa sổ đến frame chưa được xác nhận nhỏ nhất; kiểm tra frame nào nằm trong/ngoài cửa sổ nhận.'
  ],result:'Dùng đúng loại ARQ của câu hỏi trước khi áp công thức kích thước cửa sổ.'};
}
function calculation(q){
  const t=allText(q);
  const solvers=[cidrCalc,tcpCalc,shannonCalc,nyquistCalc,transmissionCalc,crcCalc,windowCalc];
  for(const s of solvers){const r=s(q,t);if(r)return r}
  if(/\b(tính|bao nhiêu|giá trị|kết quả|xác định|suy ra)\b/i.test(q.question)||/[=+×*\/^-]\s*\d/.test(t)){
    return {title:'Cách giải bài tập',steps:[
      'Liệt kê dữ kiện và đại lượng cần tìm; ghi kèm đơn vị.',
      'Chọn công thức đúng với chủ đề của câu hỏi, không thay số trước khi xác định đúng đại lượng.',
      'Đổi tất cả đại lượng về hệ đơn vị thống nhất.',
      `Thay số và biến đổi từng bước theo dữ kiện của đề. Kết quả/đối chiếu hiện có trong bộ dữ liệu: ${clean(q.explanation)}`,
      'Kiểm tra ngược kết quả bằng đơn vị, miền giá trị hợp lý và so sánh từng phương án.'
    ],result:clean(q.explanation)};
  }
  return null;
}

function commonMistakes(q){
  const t=allText(q), arr=[];
  if(/osi|tầng|layer/i.test(t)) arr.push('Nhầm tên tầng với đơn vị dữ liệu hoặc nhầm thiết bị layer 2 và layer 3.');
  if(/tcp|udp/i.test(t)) arr.push('Nhầm “không kết nối” của UDP với việc IP/UDP không có địa chỉ/port; UDP vẫn có port nguồn/đích, còn IP cung cấp địa chỉ IP.');
  if(/subnet|\/\d+/i.test(t)) arr.push('Nhầm tổng số địa chỉ của subnet với số địa chỉ host dùng được.');
  if(/dns|mx|cname|ns\b/i.test(t)) arr.push('Nhầm chức năng các DNS record vì đều chứa tên miền nhưng ý nghĩa hoàn toàn khác nhau.');
  if(isNegative(q)) arr.push('Bỏ sót từ phủ định như KHÔNG/SAI/NGOẠI TRỪ và chọn một phát biểu đúng thay vì phát biểu cần loại.');
  if(q.warning) arr.push(`Câu này có cảnh báo từ nguồn: ${clean(q.warning)}`);
  if(!arr.length) arr.push('Học thuộc vị trí A/B/C/D thay vì nhớ điều kiện và định nghĩa; bộ đề có thể đảo vị trí lựa chọn.');
  return arr;
}

function build(q){
  const opts=(q.options||[]).map(o=>optionAnalysis(q,o));
  const correct=(q.options||[]).find(o=>o.id===q.correct_option_id);
  return {
    knowledge:topicKnowledge(q),
    reasoning:reasoning(q),
    finalAnswer:correct?clean(correct.text):q.correct_option_id,
    options:opts,
    calculation:calculation(q),
    commonMistakes:commonMistakes(q),
    summary:`Điểm cần nhớ: không học vị trí đáp án. Hãy nhớ điều kiện khiến “${clean(correct?.text)}” phù hợp trong câu này và phân biệt nó với từng phương án còn lại.`
  };
}

window.NETWORK_SOLUTION={build};
})();
