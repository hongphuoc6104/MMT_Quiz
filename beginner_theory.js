// Beginner-first theory library. It enriches manual solutions without changing answers.
(() => {
  'use strict';

  const C = [
    {
      id:'osi', title:'Mô hình OSI 7 tầng',
      keys:[/\bosi\b/i,/physical|vật lý/i,/data link|liên kết dữ liệu/i,/network layer|tầng mạng/i,/transport|vận chuyển|giao vận/i,/session|presentation|application layer|tầng ứng dụng/i],
      definition:'OSI là mô hình tham chiếu chia chức năng truyền thông thành 7 tầng để dễ thiết kế và hiểu hệ thống mạng. Từ thấp lên cao: Physical truyền bit/tín hiệu; Data Link truyền frame trên một liên kết và xử lý MAC; Network dùng địa chỉ logic và định tuyến packet; Transport truyền đầu-cuối giữa các tiến trình; Session quản lý phiên; Presentation biểu diễn/chuyển đổi dữ liệu; Application cung cấp dịch vụ mạng gần ứng dụng.',
      points:['Layer 1 Physical: cáp, tín hiệu, đầu nối, bit rate.','Layer 2 Data Link: frame, MAC, truy nhập môi trường, lỗi trên liên kết.','Layer 3 Network: IP, packet, router, định tuyến.','Layer 4 Transport: TCP/UDP, port, truyền giữa process.','Layer 5–7: phiên, biểu diễn dữ liệu và dịch vụ ứng dụng.'],
      example:'Nếu câu hỏi nhắc router, IP hoặc định tuyến, hãy nghĩ Layer 3. Nếu nhắc frame/MAC/Ethernet switch, hãy nghĩ Layer 2.',
      distinguish:'Đừng chỉ học số tầng. Hãy gắn mỗi tầng với PDU và chức năng: bit → frame → packet → segment/datagram → dữ liệu ứng dụng.',
      source:'ISO/IEC 7498-1 — OSI Basic Reference Model.'
    },
    {
      id:'protocol', title:'Protocol, Service và Interface',
      keys:[/protocol|giao thức/i,/service|dịch vụ/i,/interface|giao diện|primitive/i],
      definition:'Protocol là tập quy tắc để hai thực thể ngang hàng trao đổi thông tin: định dạng thông điệp, ý nghĩa các trường, thứ tự gửi/nhận và hành động cần thực hiện. Service là khả năng một tầng cung cấp cho tầng trên. Interface là cách tầng trên gọi hoặc truy cập service đó.',
      points:['Protocol trả lời: “hai phía trao đổi với nhau theo luật nào?”.','Service trả lời: “tầng dưới cung cấp được điều gì?”.','Interface/primitive trả lời: “tầng trên gọi dịch vụ đó bằng cách nào?”.'],
      example:'TCP là protocol. Dịch vụ mà ứng dụng nhận được là luồng byte đầu-cuối. Socket/API là cách phần mềm truy cập dịch vụ.',
      distinguish:'Các câu trắc nghiệm hay tráo ba từ này. Hãy xác định câu đang nói về quy tắc peer-to-peer, khả năng cung cấp hay cách gọi dịch vụ.',
      source:'Khái niệm phân tầng trong mô hình OSI.'
    },
    {
      id:'encapsulation', title:'Đóng gói và tháo gói',
      keys:[/encapsulation|decapsulation|đóng gói|gỡ.*header|thêm.*header|\bpdu\b/i],
      definition:'Encapsulation là quá trình dữ liệu đi từ tầng cao xuống tầng thấp ở phía gửi; mỗi tầng nhận dữ liệu của tầng trên làm payload rồi thêm thông tin điều khiển của mình, thường là header và đôi khi trailer. Decapsulation là chiều ngược lại ở máy nhận: từng tầng đọc/kiểm tra rồi gỡ phần thông tin của tầng đó.',
      points:['Transport có thể thêm TCP/UDP header.','Network thêm IP header.','Data Link tạo frame và có thể thêm header/trailer.','Physical biến dữ liệu thành bit/tín hiệu để truyền.'],
      example:'HTTP data → TCP segment → IP packet → Ethernet frame → bit trên đường truyền.',
      distinguish:'Đi xuống thường thêm thông tin điều khiển; đi lên thường kiểm tra và gỡ thông tin điều khiển.',
      source:'Nguyên lý kiến trúc phân tầng.'
    },
    {
      id:'signals', title:'Tín hiệu analog và digital',
      keys:[/analog|tương tự/i,/digital|tín hiệu số|rời rạc/i,/liên tục/i],
      definition:'Tín hiệu analog biến thiên liên tục theo đại lượng vật lý, còn tín hiệu digital biểu diễn thông tin bằng các mức rời rạc. “Analog/digital” mô tả đặc tính biểu diễn tín hiệu, trong khi “cáp đồng/sợi quang/vô tuyến” là môi trường truyền.',
      points:['Analog: biên độ/tham số có thể thay đổi liên tục trong miền xét.','Digital: dùng các mức rời rạc, thường được ánh xạ từ bit.','Một hệ thống số vẫn có thể truyền bằng dạng sóng vật lý liên tục; điều quan trọng là cách thông tin được mã hóa/giải mã.'],
      example:'Bit 0 và 1 có thể được biểu diễn bởi hai mức điện áp trên dây; đó là biểu diễn số dù điện áp vật lý vẫn là đại lượng liên tục.',
      distinguish:'Đừng nhầm “loại tín hiệu” với “loại môi trường”. Fiber không đồng nghĩa analog; copper cũng không đồng nghĩa digital.',
      source:'Lý thuyết truyền dữ liệu cơ bản.'
    },
    {
      id:'media', title:'Môi trường truyền: cáp đồng, cáp quang và vô tuyến',
      keys:[/twisted pair|xoắn đôi|coax|đồng trục|fiber|quang|1000base|utp|stp|wireless|vô tuyến/i],
      definition:'Môi trường truyền là con đường vật lý hoặc không dây mà tín hiệu đi qua. Twisted pair dùng cặp dây đồng xoắn; coaxial dùng lõi và lớp chắn đồng trục; optical fiber dẫn ánh sáng; wireless truyền bằng sóng điện từ qua không gian.',
      points:['Cáp quang thường có băng thông cao, suy hao thấp theo khoảng cách và miễn nhiễm nhiễu điện từ.','Twisted pair phổ biến trong Ethernet LAN vì rẻ, dễ triển khai nhưng khoảng cách/cấp cáp có giới hạn.','Coaxial có lớp chắn tốt và từng phổ biến trong Ethernet/cáp truyền hình.','Chuẩn như 1000BASE-LX mô tả một PHY Ethernet quang cụ thể; cần đọc đúng chuẩn/khoảng cách thay vì suy từ tên chung “fiber”.'],
      example:'Kết nối giữa tòa nhà xa nhau thường ưu tiên fiber vì khoảng cách và chống nhiễu tốt hơn dây đồng.',
      distinguish:'“Loại cáp” khác “giao thức”. Ethernet có thể chạy trên nhiều loại môi trường vật lý.',
      source:'Họ chuẩn IEEE 802.3 và kiến thức truyền dẫn.'
    },
    {
      id:'capacity', title:'Bandwidth, bit rate, Nyquist và Shannon',
      keys:[/bandwidth|băng thông/i,/nyquist/i,/shannon/i,/snr|signal.*noise|tín hiệu.*nhiễu/i,/baud|symbol/i],
      definition:'Bandwidth theo ngữ cảnh vật lý thường là dải tần kênh (Hz); bit rate là số bit truyền mỗi giây; baud/symbol rate là số ký hiệu tín hiệu mỗi giây. Nyquist cho giới hạn tốc độ ký hiệu/bit của kênh không nhiễu với số mức tín hiệu hữu hạn; Shannon cho dung lượng lý thuyết của kênh có nhiễu dựa trên bandwidth và SNR.',
      points:['Nyquist (dạng thường học): C = 2B log2(M) bit/s cho kênh lý tưởng, B tính bằng Hz và M là số mức tín hiệu.','Shannon: C = B log2(1 + S/N) bit/s, trong đó S/N phải ở dạng tỷ số tuyến tính.','Nếu SNR cho bằng dB, đổi bằng S/N = 10^(SNR_dB/10) trước khi dùng Shannon.','Thiếu B hoặc SNR thì không thể ép ra một giá trị Shannon duy nhất.'],
      example:'SNR = 30 dB tương ứng tỷ số tuyến tính 10^(30/10)=1000.',
      distinguish:'Nyquist và Shannon trả lời hai mô hình khác nhau; đừng trộn số mức M của Nyquist vào công thức Shannon.',
      source:'Định lý Nyquist/Shannon trong lý thuyết thông tin và truyền dữ liệu.'
    },
    {
      id:'delay', title:'Các loại độ trễ trong mạng',
      keys:[/delay|độ trễ|latency|transmission time|propagation|lan truyền|rtt/i],
      definition:'Độ trễ đầu-cuối có thể gồm processing delay, queueing delay, transmission delay và propagation delay. Transmission delay là thời gian “đẩy” toàn bộ số bit của gói lên đường truyền; propagation delay là thời gian tín hiệu đi qua môi trường vật lý.',
      points:['Transmission delay = L/R, với L là số bit và R là bit/s.','Propagation delay = d/v, với d là khoảng cách và v là tốc độ lan truyền.','Queueing delay phụ thuộc tải và hàng đợi nên thường biến thiên.','RTT là thời gian khứ hồi, không đơn giản luôn bằng 2× một thành phần nếu có xử lý/hàng đợi bất đối xứng.'],
      example:'Gói 1 Mbit trên đường 10 Mbit/s có transmission delay 0,1 s, chưa tính propagation hay queueing.',
      distinguish:'Gói lớn làm transmission delay tăng; khoảng cách xa làm propagation delay tăng.',
      source:'Mô hình delay chuẩn trong mạng chuyển gói.'
    },
    {
      id:'framing', title:'Frame và kỹ thuật định khung',
      keys:[/framing|định khung|frame|byte stuffing|bit stuffing|flag byte|cờ/i],
      definition:'Data Link cần biết một frame bắt đầu và kết thúc ở đâu. Framing là nhóm kỹ thuật tạo ranh giới frame, có thể dùng trường độ dài, byte/character flag kết hợp byte stuffing, hoặc bit flag kết hợp bit stuffing tùy giao thức.',
      points:['Byte stuffing: nếu dữ liệu chứa byte đặc biệt giống flag/escape thì chèn escape để phân biệt dữ liệu với điều khiển.','Bit stuffing: sau một chuỗi bit nhất định trong payload, sender chèn bit để mẫu flag không xuất hiện giả trong dữ liệu; receiver bỏ bit chèn.','Frame thường chứa header, payload và có thể trailer kiểm tra lỗi.'],
      example:'HDLC dùng flag dạng bit và bit stuffing để ngăn payload vô tình tạo ra mẫu flag.',
      distinguish:'Framing tạo ranh giới dữ liệu; error detection kiểm tra dữ liệu có bị lỗi hay không. Hai chức năng khác nhau dù đều thuộc Data Link.',
      source:'Nguyên lý Data Link và các giao thức kiểu HDLC.'
    },
    {
      id:'error', title:'Phát hiện lỗi: parity, checksum và CRC',
      keys:[/parity|chẵn lẻ/i,/checksum/i,/\bcrc\b|cyclic redundancy/i,/phát hiện lỗi|kiểm tra lỗi/i],
      definition:'Phát hiện lỗi thêm thông tin dư thừa để receiver nhận biết dữ liệu có thể đã bị thay đổi. Parity rất đơn giản; checksum cộng/biến đổi các từ dữ liệu theo quy tắc; CRC xem chuỗi bit như đa thức và truyền phần dư phép chia theo đa thức sinh.',
      points:['Một parity bit phát hiện mọi mẫu lỗi có số bit đảo là lẻ, nhưng có thể bỏ sót lỗi làm đảo số bit chẵn.','Checksum không phải CRC; thuật toán và khả năng phát hiện lỗi khác nhau.','CRC mạnh với nhiều dạng burst error nếu chọn đa thức sinh phù hợp.','Phát hiện lỗi không đồng nghĩa sửa lỗi; sửa lỗi cần thêm cấu trúc/mã hoặc cơ chế truyền lại.'],
      example:'Nếu một frame dùng even parity và đúng 1 bit bị đảo, parity chắc chắn đổi và receiver phát hiện được.',
      distinguish:'Không có một “% lỗi parity luôn phát hiện” cố định nếu chưa cho mô hình xác suất lỗi.',
      source:'Lý thuyết mã phát hiện lỗi và CRC.'
    },
    {
      id:'arq', title:'ARQ: Stop-and-Wait, Go-Back-N và Selective Repeat',
      keys:[/stop-and-wait|go-back-n|selective repeat|sliding window|cửa sổ trượt|\barq\b/i],
      definition:'ARQ là cơ chế truyền tin cậy dựa trên ACK/timeout và truyền lại. Stop-and-Wait chỉ giữ một frame chưa xác nhận. Sliding Window cho phép nhiều frame đang bay. Go-Back-N và Selective Repeat khác nhau ở cách receiver chấp nhận frame ngoài thứ tự và phạm vi sender phải truyền lại.',
      points:['Stop-and-Wait đơn giản nhưng kém hiệu quả khi RTT lớn.','Go-Back-N thường dùng cumulative ACK; khi một frame bị mất/lỗi, sender có thể phải gửi lại frame đó và các frame sau trong cửa sổ.','Selective Repeat có thể đệm frame ngoài thứ tự và chỉ truyền lại frame thiếu/lỗi.','Kích thước không gian sequence number phải đủ để phân biệt frame mới với frame cũ sau vòng quay số.'],
      example:'Nếu frame 3 mất nhưng 4,5 đến: GBN thường không “hoàn tất” 4,5 theo cách SR làm; SR có thể giữ 4,5 và chỉ yêu cầu/đợi 3.',
      distinguish:'Tên “Selective Repeat” nhớ bằng ý “chọn đúng frame cần lặp lại”; GBN nhớ bằng “quay lại từ frame lỗi/mất”.',
      source:'Các giao thức ARQ cửa sổ trượt trong Data Link/Transport.'
    },
    {
      id:'macaccess', title:'Truy nhập môi trường: ALOHA, CSMA, CSMA/CD, TDMA, FDMA, CDMA',
      keys:[/aloha|csma|tdma|fdma|cdma|collision|va chạm|đụng độ|đa truy nhập/i],
      definition:'Khi nhiều trạm dùng chung môi trường, cần quy tắc chia quyền truyền. Random access như ALOHA/CSMA chấp nhận khả năng tranh chấp; controlled/channelized access chia quyền theo thời gian, tần số, mã hoặc cơ chế điều phối.',
      points:['ALOHA gửi theo quy tắc đơn giản và xử lý collision bằng truyền lại; Slotted ALOHA giới hạn thời điểm bắt đầu vào slot.','CSMA nghe kênh trước khi gửi.','CSMA/CD vừa truyền vừa theo dõi để phát hiện collision trong Ethernet half-duplex chia sẻ truyền thống.','TDMA chia theo thời gian; FDMA chia theo tần số; CDMA phân biệt bằng mã.'],
      example:'Nếu đề hỏi “chia người dùng bằng mã” → CDMA; “chia bằng khe thời gian” → TDMA; “chia dải tần” → FDMA.',
      distinguish:'CD trong CSMA/CD nghĩa Collision Detection, còn CD trong CDMA là Code Division — hai khái niệm hoàn toàn khác.',
      source:'Lý thuyết MAC/multiple access; IEEE 802.3 cho CSMA/CD Ethernet.'
    },
    {
      id:'ethernet', title:'Ethernet, MAC address, switch và collision domain',
      keys:[/ethernet|802\.3|mac address|địa chỉ mac|switch|bridge|hub|collision domain|broadcast domain|1000base/i],
      definition:'Ethernet là họ công nghệ LAN của IEEE 802.3. Ethernet frame có địa chỉ MAC nguồn/đích. Hub tạo môi trường chia sẻ; bridge/switch học MAC và chuyển frame theo cổng. Router tạo ranh giới Layer 3 và thường là ranh giới broadcast giữa các subnet.',
      points:['Hub/repeater nhiều cổng hoạt động chủ yếu ở mức bit và không học địa chỉ MAC.','Switch Layer 2 học source MAC và tra bảng MAC để quyết định cổng ra.','Mỗi cổng switch full-duplex hiện đại thường là collision domain riêng.','Broadcast Ethernet Layer 2 vẫn có thể đi qua nhiều cổng switch trong cùng VLAN; router không forward broadcast Layer 2 sang subnet khác theo kiểu đó.'],
      example:'Hai máy qua hub có thể collision; qua hai cổng switch full-duplex riêng thì không chia sẻ collision domain truyền thống.',
      distinguish:'Switch tách collision domain; router/subnet/VLAN Layer 3 boundary mới liên quan mạnh đến broadcast domain.',
      source:'IEEE 802.3 và mô hình LAN Layer 2.'
    },
    {
      id:'devices', title:'Repeater, Hub, Bridge, Switch, Router và Gateway',
      keys:[/repeater|hub|bridge|switch|router|gateway|bộ lặp|cầu nối|bộ định tuyến|bộ chuyển mạch/i],
      definition:'Thiết bị mạng khác nhau bởi lớp thông tin mà chúng hiểu. Repeater/hub chủ yếu xử lý tín hiệu/bit. Bridge/switch Ethernet quyết định theo địa chỉ MAC ở Data Link. Router quyết định theo địa chỉ/prefix mạng như IP ở Network. Gateway là thuật ngữ rộng cho điểm chuyển tiếp/chuyển đổi; “default gateway” của host thường là router ra khỏi subnet.',
      points:['Repeater tái tạo tín hiệu để mở rộng liên kết.','Hub là repeater nhiều cổng, không có bảng MAC như switch.','Bridge/switch chuyển frame dựa trên MAC.','Router chuyển packet giữa mạng/subnet dựa trên bảng định tuyến.'],
      example:'Host gửi tới IP ngoài subnet sẽ đóng Ethernet frame đến MAC của default gateway, còn IP destination vẫn là host đích cuối.',
      distinguish:'Một multilayer switch có thể làm Layer 3, nhưng câu giáo trình cơ bản “router thuộc tầng nào?” thường nhắm Network/Layer 3.',
      source:'Phân lớp chức năng theo OSI.'
    },
    {
      id:'ipv4', title:'IPv4, subnet mask và CIDR',
      keys:[/ipv4|địa chỉ ip|ip address|subnet|cidr|prefix|subnet mask|mặt nạ|network address|broadcast|địa chỉ mạng|địa chỉ quảng bá|\/\d{1,2}/i],
      definition:'IPv4 dùng địa chỉ 32 bit. CIDR /n cho biết n bit đầu là prefix mạng; các bit còn lại là phần host. Subnet mask là cách biểu diễn các bit mạng bằng 1 và bit host bằng 0. Network address có toàn bit host bằng 0; directed broadcast của subnet truyền thống có toàn bit host bằng 1.',
      points:['Một subnet /n có 2^(32−n) địa chỉ tổng.','Trong subnet thông thường, host dùng được thường là 2^(32−n)−2; có ngoại lệ chuyên biệt như /31 point-to-point.','Network address = IP bitwise AND subnet mask.','Hai IP cùng subnet nếu prefix sau khi áp cùng mask giống nhau.'],
      example:'192.168.1.101/26: block size 64; 101 thuộc dải 64–127 → network 192.168.1.64, broadcast 192.168.1.127.',
      distinguish:'Đừng nhầm tổng số địa chỉ với host dùng được: /27 có 32 địa chỉ tổng nhưng thường 30 host dùng được.',
      source:'RFC 791/RFC 950 và cách đánh địa chỉ CIDR.'
    },
    {
      id:'routing', title:'Định tuyến và longest-prefix match',
      keys:[/routing|định tuyến|route|next hop|longest prefix|đường đi|router/i],
      definition:'Routing là quá trình chọn đường/next hop để packet đến mạng đích. Router duy trì bảng định tuyến gồm prefix đích và thông tin chuyển tiếp. Khi nhiều route cùng khớp địa chỉ đích, nguyên tắc phổ biến là chọn route có prefix dài nhất — tức route cụ thể nhất.',
      points:['Routing table không cần có một dòng cho mọi host; có thể lưu prefix tổng quát.','Default route 0.0.0.0/0 khớp mọi IPv4 destination nhưng là lựa chọn ít cụ thể nhất.','Next hop là router kế tiếp trên đường, không nhất thiết là host đích cuối.','Forwarding là thao tác chuyển packet theo bảng; routing protocol là cơ chế học/tính route.'],
      example:'Nếu có 10.0.0.0/8 và 10.1.0.0/16, destination 10.1.2.3 chọn /16 vì cụ thể hơn.',
      distinguish:'Đừng nhầm routing protocol (OSPF/RIP...) với routed protocol (IP) trong cách gọi giáo trình cũ.',
      source:'Nguyên tắc forwarding IP theo prefix.'
    },
    {
      id:'arp', title:'ARP: từ IPv4 đến địa chỉ MAC trên LAN',
      keys:[/\barp\b|address resolution|ip.*mac|mac.*ip/i],
      definition:'ARP giải bài toán tìm địa chỉ phần cứng cho một địa chỉ giao thức trên liên kết. Trong Ethernet IPv4 điển hình, host biết IPv4 của đích/next hop nhưng cần MAC để tạo frame, nên dùng ARP Request/Reply và lưu kết quả trong ARP cache.',
      points:['ARP Request thường broadcast trên LAN.','ARP Reply cung cấp địa chỉ phần cứng tương ứng.','Nếu IP đích ở mạng khác, host thường ARP MAC của default gateway chứ không ARP MAC của host ở xa.','ARP hoạt động trên liên kết cục bộ; router không chuyển ARP broadcast qua mạng khác như packet IP thông thường.'],
      example:'A muốn gửi cho 192.168.1.20 cùng subnet: A hỏi “ai có IP này?” rồi dùng MAC trả lời để tạo Ethernet frame.',
      distinguish:'DNS: tên → dữ liệu như IP. ARP: địa chỉ giao thức trên LAN → địa chỉ phần cứng.',
      source:'RFC 826 — Address Resolution Protocol.'
    },
    {
      id:'icmp', title:'ICMP: thông báo điều khiển và lỗi của IP',
      keys:[/\bicmp\b|ping|time exceeded|destination unreachable|ttl/i],
      definition:'ICMP là giao thức điều khiển gắn với IP, dùng để phản hồi các vấn đề như destination unreachable, time exceeded và hỗ trợ chẩn đoán như echo request/reply. ICMP không làm IP trở thành dịch vụ tin cậy và không thay thế cơ chế ACK/truyền lại của TCP.',
      points:['TTL IPv4 giảm khi packet qua router; hết TTL có thể sinh ICMP Time Exceeded.','Ping thường dùng ICMP Echo Request/Echo Reply.','Traceroute có thể dựa vào phản hồi Time Exceeded khi điều khiển TTL/Hop Limit.','Không phải mọi packet mất đều nhất thiết tạo được ICMP báo lỗi.'],
      example:'Packet có TTL=1 tới router: router giảm TTL và có thể loại packet rồi gửi ICMP Time Exceeded về nguồn.',
      distinguish:'ICMP báo trạng thái/lỗi mạng; TCP/UDP mang dữ liệu cho tiến trình ứng dụng.',
      source:'RFC 792 — Internet Control Message Protocol.'
    },
    {
      id:'ipv6', title:'IPv6',
      keys:[/ipv6|128-bit|128 bit|hop limit|extension header/i],
      definition:'IPv6 là phiên bản Internet Protocol dùng địa chỉ 128 bit. Header cơ sở có thiết kế khác IPv4, dùng Hop Limit, Next Header và có thể nối extension header cho chức năng mở rộng. IPv6 không chỉ là IPv4 “tăng số bit địa chỉ”.',
      points:['Source Address và Destination Address dài 128 bit.','Hop Limit giảm khi được forward, tương tự vai trò kiểm soát vòng lặp của TTL.','Extension headers tách nhiều chức năng khỏi header cơ sở.','IPv6 không dùng broadcast theo cách IPv4; multicast/anycast có vai trò quan trọng.'],
      example:'2001:db8::1 là dạng rút gọn của địa chỉ IPv6 hexadecimal 128 bit.',
      distinguish:'Khi đề hỏi số bit địa chỉ: IPv4 = 32 bit, IPv6 = 128 bit.',
      source:'RFC 8200 — IPv6 Specification.'
    },
    {
      id:'tcp', title:'TCP từ số 0',
      keys:[/\btcp\b|sequence number|\bseq\b|\back\b|acknowledg|\bsyn\b|\bfin\b|three-way|bắt tay|rwnd|cwnd|receive window|retransmi/i],
      definition:'TCP là giao thức tầng vận chuyển hướng kết nối cung cấp luồng byte hai chiều. TCP đánh số byte, xác nhận bằng ACK, truyền lại khi cần và duy trì cửa sổ để kiểm soát lượng dữ liệu đang bay. “Tin cậy” nghĩa giao thức cố gắng cung cấp dữ liệu đúng thứ tự/không trùng cho ứng dụng, không có nghĩa mạng bên dưới không bao giờ mất hoặc lỗi packet.',
      points:['SEQ chỉ vị trí trong không gian sequence number; ACK thường là số thứ tự kế tiếp receiver mong đợi.','SYN và FIN chiếm sequence space, nên ACK cho SYN thường là SEQ+1.','Three-way handshake: SYN → SYN+ACK → ACK.','Receive window liên quan flow control; congestion window liên quan congestion control.','TCP là full-duplex: hai phía có thể gửi độc lập theo hai chiều.'],
      example:'Nếu SYN có SEQ=100 thì peer thường xác nhận ACK=101.',
      distinguish:'TCP là byte stream: ranh giới các lần application write không nhất thiết được giữ như ranh giới message.',
      source:'RFC 9293 — Transmission Control Protocol.'
    },
    {
      id:'udp', title:'UDP từ số 0',
      keys:[/\budp\b|user datagram/i],
      definition:'UDP là giao thức tầng vận chuyển dạng datagram với cơ chế tối giản. Nó cung cấp port, length và checksum nhưng bản thân UDP không thiết lập kết nối, không tạo sequence/ACK để sắp thứ tự, không tự truyền lại và không có flow control kiểu TCP.',
      points:['Mỗi lần gửi tạo một datagram; UDP giữ ranh giới message.','Connectionless nghĩa không cần handshake thiết lập trạng thái kết nối trước khi gửi.','Ứng dụng vẫn có thể tự thêm retry/sequence nếu thiết kế cần độ tin cậy.','UDP thường phù hợp khi ứng dụng ưu tiên độ trễ, kiểm soát riêng hoặc thông điệp đơn giản.'],
      example:'Một DNS query truyền thống thường có thể đi bằng UDP, nhưng DNS cũng có trường hợp dùng TCP.',
      distinguish:'“UDP không có ACK” là đặc tính của UDP; không được suy ra rằng mọi ứng dụng chạy trên UDP đều không bao giờ phản hồi.',
      source:'RFC 768 — User Datagram Protocol.'
    },
    {
      id:'flowcongestion', title:'Flow control và congestion control',
      keys:[/flow control|điều khiển luồng|congestion|tắc nghẽn|nghẽn|rwnd|cwnd/i],
      definition:'Flow control bảo vệ receiver khỏi bị sender gửi nhanh hơn khả năng nhận/buffer. Congestion control bảo vệ mạng trung gian khỏi quá tải. Cả hai có thể làm sender giảm tốc nhưng đối tượng cần bảo vệ khác nhau.',
      points:['Flow control hỏi: receiver còn nhận được bao nhiêu?','Congestion control hỏi: network đang chịu tải đến đâu?','Trong TCP, advertised receive window (rwnd) gắn với receiver flow control.','Congestion window (cwnd) là biến phía sender dùng cho congestion control.'],
      example:'Receiver buffer gần đầy → giảm window là flow control; mạng có dấu hiệu nghẽn → sender giảm congestion window là congestion control.',
      distinguish:'Store-and-forward là phương pháp chuyển dữ liệu qua nút, không tự nó là thuật toán congestion control.',
      source:'Khái niệm transport/network control; TCP congestion control được mô tả trong các RFC liên quan.'
    },
    {
      id:'portsocket', title:'Port và socket',
      keys:[/\bport\b|socket|process|tiến trình/i],
      definition:'IP đưa packet đến đúng host; port giúp tầng vận chuyển phân phối dữ liệu đến đúng tiến trình/dịch vụ trên host đó. Socket là endpoint phần mềm mà ứng dụng dùng để gửi/nhận dữ liệu; trong TCP, một connection thường được nhận diện bởi cặp endpoint nguồn/đích gồm địa chỉ và port.',
      points:['Port là số logic của tầng vận chuyển, không phải cổng vật lý trên switch/router.','Server thường lắng nghe trên port dịch vụ; client thường dùng ephemeral port.','Hai kết nối TCP có thể cùng tới port server 443 nhưng khác IP/port phía client.'],
      example:'Trình duyệt có thể kết nối tới server HTTPS port 443 từ một ephemeral port cục bộ.',
      distinguish:'Địa chỉ IP chọn host/network interface; port chọn ứng dụng/tiến trình ở tầng vận chuyển.',
      source:'Mô hình socket/TCP/UDP.'
    },
    {
      id:'dns', title:'DNS từ số 0',
      keys:[/\bdns\b|domain|tên miền|resource record|\bmx\b|\bns\b|\baaaa\b|\bcname\b|name server/i],
      definition:'DNS là hệ thống cơ sở dữ liệu phân tán và phân cấp dùng resource record để gắn tên miền với nhiều loại thông tin. Nó không chỉ ánh xạ tên → IP; DNS còn mô tả name server, mail exchanger, alias và nhiều dữ liệu khác.',
      points:['A: tên → IPv4.','AAAA: tên → IPv6.','NS: name server có thẩm quyền cho zone.','MX: mail exchanger nhận thư cho domain và có priority.','CNAME: alias → canonical name.','DNS hoạt động trên port 53 và chuẩn có cả UDP lẫn TCP trong các tình huống phù hợp.'],
      example:'Web browser cần A/AAAA để tìm địa chỉ server; mail server quan tâm MX để biết nơi chuyển thư của domain.',
      distinguish:'DNS ≠ ARP. DNS xử lý tên ở tầng ứng dụng; ARP tìm địa chỉ phần cứng trên liên kết.',
      source:'RFC 1034 và RFC 1035.'
    },
    {
      id:'dhcp', title:'DHCP từ số 0',
      keys:[/\bdhcp\b|dhcpdiscover|dhcpoffer|dhcprequest|dhcpack|lease|cấp phát.*ip/i],
      definition:'DHCP là giao thức client-server cấp địa chỉ mạng và các tham số cấu hình cho host. Ngoài IP, server có thể cung cấp subnet mask, default gateway, DNS server, lease time và nhiều option khác.',
      points:['Quy trình dễ nhớ DORA: Discover → Offer → Request → Acknowledge.','Dynamic allocation cấp địa chỉ trong một lease có thời hạn.','Client ban đầu chưa có cấu hình đầy đủ nên một số bước có thể dùng broadcast.','DHCP relay cho phép client và server ở các subnet khác nhau.'],
      example:'Laptop mới vào LAN phát DHCPDISCOVER, nhận offer, request địa chỉ và nhận DHCPACK xác nhận cấu hình.',
      distinguish:'DHCP cấp cấu hình; DNS phân giải tên; ARP tìm MAC trên LAN.',
      source:'RFC 2131 — Dynamic Host Configuration Protocol.'
    },
    {
      id:'application', title:'Các giao thức ứng dụng thường gặp',
      keys:[/http|https|ftp|smtp|pop3|imap|telnet|ssh|application layer|tầng ứng dụng/i],
      definition:'Tầng ứng dụng chứa các giao thức trực tiếp phục vụ chức năng ứng dụng mạng. HTTP/HTTPS trao đổi tài nguyên web; FTP truyền file theo mô hình riêng; SMTP chuyển/gửi thư; POP3/IMAP cho client truy cập hộp thư; SSH cung cấp truy cập từ xa bảo mật; Telnet là giao thức terminal từ xa cũ không bảo mật như SSH.',
      points:['HTTP là giao thức ứng dụng, thường chạy trên TCP; HTTPS là HTTP qua TLS.','SMTP dùng cho gửi/chuyển mail; POP3/IMAP dùng cho client lấy/đồng bộ thư.','FTP truyền file và có mô hình kết nối điều khiển/dữ liệu.','SSH mã hóa phiên; Telnet truyền dữ liệu không được bảo vệ tương đương.'],
      example:'Người dùng đọc mail qua IMAP nhưng mail server chuyển thư giữa nhau bằng SMTP.',
      distinguish:'Port mặc định giúp nhận diện dịch vụ nhưng “giao thức thuộc tầng nào” phải dựa vào chức năng, không chỉ thuộc số port.',
      source:'Các RFC tương ứng của HTTP, mail, FTP, SSH/Telnet.'
    },
    {
      id:'clientserver', title:'Client–server và request–response',
      keys:[/client|server|request|response|máy chủ|khách hàng/i],
      definition:'Trong mô hình client–server, server cung cấp một dịch vụ và chờ request; client chủ động yêu cầu dịch vụ. Request là thông điệp yêu cầu một hành động/tài nguyên, response là kết quả hoặc trạng thái server trả lại. Đây là mô hình vai trò ứng dụng, không nhất thiết nói client luôn là máy yếu hay server luôn là một máy vật lý duy nhất.',
      points:['Client thường khởi tạo phiên giao tiếp ứng dụng.','Server có thể phục vụ nhiều client đồng thời.','Một máy có thể vừa chạy chương trình client vừa chạy server cho dịch vụ khác.','Request/response là mẫu phổ biến nhưng không phải mọi giao thức đều chỉ có đúng một request rồi một response.'],
      example:'Browser là HTTP client gửi request; web server trả response chứa status, header và nội dung.',
      distinguish:'Client/server là vai trò logic của phần mềm, không phải nhãn cố định cho toàn bộ máy tính.',
      source:'Kiến trúc ứng dụng mạng.'
    },
    {
      id:'unicode', title:'Unicode và UTF-8',
      keys:[/unicode|utf-8|utf8|character encoding|mã hóa ký tự/i],
      definition:'Unicode định nghĩa các code point cho ký tự; UTF-8 là một encoding biến mỗi Unicode scalar value hợp lệ thành chuỗi 1 đến 4 byte. Vì là mã có độ dài biến đổi, ký tự ASCII dùng 1 byte trong UTF-8 còn nhiều ký tự khác dùng 2–4 byte.',
      points:['Unicode là tập mã/chuẩn ký tự; UTF-8 là một cách mã hóa các giá trị đó thành byte.','UTF-8 tương thích ASCII cho các giá trị 0–127.','Không nên đồng nhất “Unicode = 16 bit” hay cho rằng UTF-8 chỉ có 65.536 ký tự.'],
      example:'Chữ ASCII “A” dùng một byte 0x41 trong UTF-8; ký tự ngoài ASCII có thể cần nhiều byte.',
      distinguish:'Số ký tự có thể biểu diễn không bằng 2^(số byte cố định), vì UTF-8 là variable-length encoding.',
      source:'The Unicode Standard và định nghĩa UTF-8.'
    }
  ];

  function haystack(question, solution){
    const optionText = (question?.options || []).map(o => o.text || '').join(' ');
    return [question?.question, optionText, solution?.knowledge, solution?.reasoning, solution?.summary].filter(Boolean).join(' ');
  }

  function matches(question, solution, limit=3){
    const text = haystack(question, solution);
    const ranked = C.map(concept => ({
      concept,
      score:concept.keys.reduce((n,re)=>n+(re.test(text)?1:0),0)
    })).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    return ranked.slice(0,limit).map(x=>x.concept);
  }

  window.MMT_BEGINNER_THEORY = Object.freeze({concepts:C, matches});
})();
