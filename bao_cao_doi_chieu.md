# BÁO CÁO TRÍCH XUẤT VÀ ĐỐI CHIẾU ĐÁP ÁN

- **Tổng câu hỏi dùng trong app:** 314
- **Đáp án trong file xác định là sai và đã sửa:** 10
- **Câu gắn cảnh báo:** 18
- **Mảnh văn bản/ghi chú không phải câu hỏi đã loại:** 14

## Các đáp án đã sửa

| STT | Bộ đề | Câu gốc | Trang | Đáp án file | Đáp án sau đối chiếu | Lý do |
|---:|---|---:|---:|---|---|---|
| 1 | De01 | 2 | 1 | A | D: Network | Cấp mạng tương ứng tầng Network (tầng 3), không phải Physical. |
| 2 | De01 | 41 | 8 | D | X: Không có tỷ lệ cố định | Kiểm tra chẵn lẻ phát hiện mọi lỗi có số bit đảo là lẻ, nhưng không có một tỷ lệ phần trăm cố định như 10%. |
| 3 | De04 | 13 | 25 | C | X: Cơ chế điều khiển tắc nghẽn | Lưu-và-chuyển-tiếp là kỹ thuật chuyển gói, không phải cơ chế giải quyết tắc nghẽn. Đáp án đúng phải là cơ chế điều khiển tắc nghẽn. |
| 4 | De04 | 7 | 50 | D | A: 5000m | 1000BASE-LX chuẩn có tầm xa tối đa khoảng 5 km trên sợi quang đơn mode; 10 km là biến thể mở rộng/LX-LH hoặc LX10. |
| 5 | De04 | 18 | 52 | D | C: CDMA | CDMA phân chia theo mã, không dựa trực tiếp vào khe thời gian hay dải tần như TDMA/FDMA. |
| 6 | De04 | 24 | 61 | C | D: Router | Router hoạt động ở tầng mạng; Switch và Bridge thông thường hoạt động ở tầng liên kết dữ liệu. |
| 7 | De04 | 7 | 63 | B | X: Cả listen và connect | Cả listen và connect đều thuộc dịch vụ hướng kết nối; dịch vụ không kết nối chỉ cần send/receive. |
| 8 | De04 | 10 | 64 | B | X: Cả A và B | Cả A và B đều sai: UDP không tự mang địa chỉ IP để router định tuyến, và UDP không thiết lập kết nối. |
| 9 | De04 | 2 | 66 | B | X: Cả UDP và TCP | DNS dùng UDP cho phần lớn truy vấn và dùng TCP trong một số trường hợp như truyền vùng hoặc phản hồi lớn. |
| 10 | De07 | 10 | 72 | A | X: Toàn bộ Unicode scalar values (1–4 byte) | UTF-8 mã hóa toàn bộ tập giá trị vô hướng Unicode bằng 1–4 byte; 65.536 không phải giới hạn của UTF-8. |

## Câu có cảnh báo

Các câu này vẫn có đáp án để học và chấm điểm, nhưng app hiển thị cảnh báo vì đề thiếu dữ kiện, phụ thuộc hình hoặc có phương án trùng/không chặt.

- **De01 – câu 5 – trang 1**: Câu hỏi phụ thuộc hình/sơ đồ; mở ảnh trang gốc để đối chiếu.
- **De01 – câu 9 – trang 2**: Câu hỏi khái quát; cần phối hợp số thứ tự, ACK và timeout để bảo đảm tin cậy/thứ tự.
- **De01 – câu 44 – trang 9**: Ký hiệu trong PDF bị mất số mũ. Đáp án được hiểu là 2^k - 1 (Go-Back-N).
- **De01 – câu 50 – trang 10**: Câu hỏi phụ thuộc hình/sơ đồ; mở ảnh trang gốc để đối chiếu.
- **De02 – câu 6 – trang 11**: PDF thiếu dữ kiện băng thông/tỷ số tín hiệu-nhiễu; tạm giữ đáp án gốc.
- **De02 – câu 8 – trang 11**: Câu hỏi thiếu phần “số lượng mạng con dự kiến”; tạm giữ đáp án gốc.
- **De02 – câu 20 – trang 13**: PDF thiếu các giá trị công suất đầu–cuối; tạm giữ đáp án gốc.
- **De02 – câu 32 – trang 15**: Đề bị cắt phần yêu cầu host; kết quả /29 phù hợp với yêu cầu 30 mạng con.
- **De03 – câu 4 – trang 19**: Câu hỏi phụ thuộc hình/sơ đồ; mở ảnh trang gốc để đối chiếu.
- **De03 – câu 12 – trang 21**: Phụ thuộc hình cửa sổ nhận; đáp án C phù hợp vì khung 2 nằm ngoài cửa sổ 4–7.
- **De04 – câu 16 – trang 28**: Phương án A và C diễn đạt gần nhau; giữ đáp án gốc theo ngữ cảnh giáo trình.
- **De04 – câu 12 – trang 34**: Dung lượng file là hệ quả, không phải tham số chất lượng độc lập; câu diễn đạt chưa chặt.
- **De04 – câu 5 – trang 49**: Câu hỏi phụ thuộc hình/sơ đồ; mở ảnh trang gốc để đối chiếu.
- **De04 – câu 4 – trang 56**: Kết quả phụ thuộc chính xác sơ đồ; app kèm trang gốc để đối chiếu.
- **De04 – câu 11 – trang 64**: Pseudo-header còn có trường protocol; đáp án D là phương án gần nhất nhưng chưa đầy đủ.
- **De08 – câu 20 – trang 73**: Cụm “tất cả máy tính” không rõ có bao gồm thiết bị trung gian hay chỉ end host.
- **De08 – câu 21 – trang 73**: Subnet /27 có 32 địa chỉ, còn 30 địa chỉ host dùng được; vì không có lựa chọn 30 nên phương án “Tất cả đều sai” là đáp án hợp lệ trong bộ lựa chọn.
- **De08 – câu 31 – trang 73**: Phương án B và D đồng nghĩa; giữ D theo file nhưng coi hai cách diễn đạt tương đương.

## Phương pháp

1. Trích cấu trúc câu hỏi, lựa chọn và dấu đáp án từ PDF; OCR tiếng Việt được dùng để phục hồi dấu.
2. Loại các đoạn giải thích bị nhận nhầm thành câu hỏi.
3. Kiểm tra phép tính (subnet, CRC, CDMA, thời gian truyền) và đối chiếu nhóm kiến thức giao thức với RFC/tài liệu chính thức.
4. Chỉ ghi “đã sửa” khi có căn cứ rõ; trường hợp không đủ chắc chắn giữ đáp án/đáp án hợp lý nhất và gắn cảnh báo.

## Nguồn đối chiếu chính

- RFC 9293 — Transmission Control Protocol (TCP): https://www.rfc-editor.org/rfc/rfc9293
- RFC 768 — User Datagram Protocol (UDP): https://www.rfc-editor.org/rfc/rfc768
- RFC 1035 — Domain Names: Implementation and Specification: https://www.rfc-editor.org/rfc/rfc1035
- RFC 959 — File Transfer Protocol (FTP): https://www.rfc-editor.org/rfc/rfc959
- RFC 826 — Address Resolution Protocol (ARP): https://www.rfc-editor.org/rfc/rfc826
- Cisco — Address Resolution Protocol / OSI Layer 2–3: https://www.cisco.com/c/en/us/td/docs/routers/ios-xe/ip-addressing/ip-addressing/m_arp-config-arp-0.html
- Cisco — 1000BASE-LX/LH GBIC (nêu chuẩn LX 5 km): https://www.cisco.com/c/en/us/products/interfaces-modules/1000base-lx-lh-gbic/index.html
- Unicode Standard — UTF-8 encoding form: https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/
- PDF nguồn trên GitHub: https://github.com/hongphuoc6104/Tai_Lieu/blob/main/T%E1%BB%95ng%20h%E1%BB%A3p%20TN%20De01%2002%2003%2004%2007%2008%20(1).pdf