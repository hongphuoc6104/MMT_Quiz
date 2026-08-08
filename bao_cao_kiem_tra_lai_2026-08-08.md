# BÁO CÁO KIỂM TRA LẠI PDF ↔ WEBSITE — 08/08/2026

## 1. Phạm vi kiểm tra

- **Repo đề nguồn:** `hongphuoc6104/Tai_Lieu`
- **PDF nguồn:** `Tổng hợp TN De01 02 03 04 07 08 (1).pdf`
- **Repo website:** `hongphuoc6104/MMT_Quiz`
- **Dữ liệu website:** 314 câu, thuộc các bộ De01, De01-ver2, De02, De03, De04, De07, De08.
- Mỗi câu đang dùng trên web đều có `source_number` và `source_page` để truy vết về đề nguồn.

## 2. Kết luận đối chiếu câu hỏi

### Không phát hiện câu nguyên vẹn nào bị thêm ngoài bộ PDF đã trích

Trong tập 314 câu hiện dùng, không xác định được câu nguyên vẹn nào là một câu tự sinh hoàn toàn không có ánh xạ về PDF. Trước đó 14 mảnh văn bản/ghi chú bị OCR nhận nhầm thành câu hỏi đã được loại khỏi dữ liệu.

Tuy nhiên, có **6 câu mà website từng thêm một phương án kỹ thuật `x` không xuất hiện trong đề PDF**, vì bốn lựa chọn gốc không chứa đáp án kỹ thuật đầy đủ. Đây là khác biệt thật sự giữa web và đề, được liệt kê ở mục 4.

Ngoài ra có nhiều trường hợp OCR làm:

- mất dấu tiếng Việt;
- tách âm tiết thành nhiều mảnh (`tra m`, `cu a`, `ca c`, ...);
- dính nhãn đáp án B/C/D vào phương án trước;
- dính ghi chú giáo trình như `P86`, `GTP189-190` vào câu hỏi;
- dính luôn `Answer:`, `Đáp án:` hoặc phần `Giải:` vào câu hỏi/phương án.

Website đã được bổ sung `data_corrections.js` để làm sạch các lỗi này trước khi ứng dụng khởi động, nhưng vẫn giữ nguyên ID, số câu và số trang nguồn để có thể truy vết.

## 3. Các đáp án gốc trong file đã xác định sai nhưng đáp án đúng CÓ SẴN trong lựa chọn của đề

| ID | Bộ đề | Câu | Trang | Đáp án file | Kết quả kiểm tra | Ghi chú |
|---|---|---:|---:|---|---|---|
| `De01-2-1` | De01 | 2 | 1 | A | **D — Network** | Network là tầng 3 của OSI. |
| `De04-7-200` | De04 | 7 | 50 | D | **A — 5000 m** | IEEE 1000BASE-LX trên single-mode fiber là 5 km; 10 km là LX/LH/LH mở rộng của một số thiết bị. |
| `De04-18-211` | De04 | 18 | 52 | D | **C — CDMA** | CDMA phân chia người dùng theo mã, khác TDMA theo thời gian và FDMA theo tần số. |
| `De04-24-249` | De04 | 24 | 61 | C | **D — Router** | Router là thiết bị tầng mạng (Layer 3). |

## 4. Các câu đề nguồn KHÔNG có phương án nào đúng hoàn toàn

Đây là 6 câu từng có phương án `x` được thêm vào dữ liệu web. Từ lần sửa này, website ghi rõ trên chính phương án đó: **“Đáp án kỹ thuật bổ sung – không có trong đề”**, tránh làm người học hiểu nhầm rằng phương án này có trong PDF.

| ID | Bộ đề | Câu | Trang | Đáp án file | Vấn đề của đề / kết luận kỹ thuật |
|---|---|---:|---:|---|---|
| `De01-41-39` | De01 | 41 | 8 | D — 10% | Câu hỏi “kiểm tra chẵn lẻ khắc phục được bao nhiêu % lỗi” không đủ chặt và không có một tỷ lệ cố định như các lựa chọn. Parity phát hiện mọi mẫu lỗi có số bit đảo là lẻ, nhưng không sửa lỗi theo một tỷ lệ % cố định. |
| `De04-13-121` | De04 | 13 | 25 | C — Kỹ thuật lưu và chuyển tiếp | Lưu-và-chuyển-tiếp là kỹ thuật chuyển gói, không phải bản thân cơ chế điều khiển tắc nghẽn. Bốn phương án không có “cơ chế điều khiển tắc nghẽn”. |
| `De04-7-263` | De04 | 7 | 63 | B — LISTEN | Cả **LISTEN** và **CONNECT** đều không thuộc nhóm primitive của dịch vụ không kết nối theo cách phân loại của câu; chỉ chọn B là không duy nhất. |
| `De04-10-266` | De04 | 10 | 64 | B | Cả A và B trong đề đều là phát biểu sai về UDP; câu yêu cầu một lựa chọn duy nhất nên không chặt. |
| `De04-2-278` | De04 | 2 | 66 | B | DNS sử dụng **cả UDP và TCP** trên port 53 trong các trường hợp khác nhau; nếu đề chỉ cho một trong hai làm đáp án thì không đầy đủ. |
| `De07-10-312` | De07 | 10 | 72 | A | UTF-8 mã hóa toàn bộ Unicode scalar values bằng chuỗi **1–4 byte**, không bị giới hạn ở 65.536 ký tự. Không có lựa chọn gốc diễn đạt đầy đủ điều này. |

## 5. Những câu vẫn cần cảnh báo khi học

Các câu dưới đây có nội dung phụ thuộc hình, thiếu dữ kiện, ký hiệu PDF lỗi hoặc lựa chọn diễn đạt chưa chặt. Không nên học thuộc đáp án mà bỏ qua cảnh báo:

1. De01 câu 5 trang 1 — phụ thuộc hình bắt tay TCP.
2. De01 câu 9 trang 2 — câu khái quát về số thứ tự/ACK/timeout.
3. De01 câu 44 trang 9 — PDF mất số mũ; hiểu là `2^k - 1` trong ngữ cảnh Go-Back-N.
4. De01 câu 50 trang 10 — phụ thuộc hình TCP.
5. De02 câu 6 trang 11 — thiếu dữ kiện băng thông/SNR.
6. De02 câu 8 trang 11 — thiếu phần số lượng mạng con dự kiến.
7. De02 câu 20 trang 13 — thiếu giá trị công suất đầu-cuối.
8. De02 câu 32 trang 15 — phần yêu cầu host bị cắt.
9. De03 câu 4 trang 19 — phụ thuộc hình/sơ đồ.
10. De03 câu 12 trang 21 — phụ thuộc hình cửa sổ nhận.
11. De04 câu 16 trang 28 — phương án A và C gần nghĩa nhau.
12. De04 câu 12 trang 34 — “dung lượng file” là hệ quả, không phải tham số chất lượng độc lập.
13. De04 câu 5 trang 49 — phụ thuộc hình/sơ đồ.
14. De04 câu 4 trang 56 — kết quả phụ thuộc chính xác sơ đồ.
15. De04 câu 11 trang 64 — pseudo-header còn có trường protocol; phương án D chỉ là phương án gần nhất.
16. De08 câu 20 trang 73 — cụm “tất cả máy tính” chưa rõ phạm vi.
17. De08 câu 21 trang 73 — /27 có 32 địa chỉ tổng, 30 địa chỉ host dùng được; do không có lựa chọn 30 nên “Tất cả đều sai” là lựa chọn hợp lý theo bộ đáp án.
18. De08 câu 31 trang 73 — phương án B và D đồng nghĩa.

## 6. Các nhóm lỗi tiếng Việt/OCR đã sửa trên giao diện

Một số ví dụ trước → sau:

- `đơn vi` → `đơn vị`
- `tai một thời điểm` → `tại một thời điểm`
- `chi hai tra m cung truyen du lieu` → `chỉ hai trạm cùng truyền dữ liệu`
- `mot tra m truyen, ca c tra m kha c nhan du lieu` → `một trạm truyền, các trạm khác nhận dữ liệu`
- `Tin hiệu tuần ty (analog)` → `Tín hiệu tương tự (analog)`
- `Tín hiệu s6 (digital)` → `Tín hiệu số (digital)`
- `name Server cu a mie n` → `Name Server của miền`
- `mail Server cu a mie n` → `Mail Server của miền`
- `KHÔNG DUNG` → `KHÔNG ĐÚNG`
- `chuyển mach` → `chuyển mạch`
- `Dich vu` → `Dịch vụ`
- `Thanh phần` → `Thành phần`
- `chan lẻ` → `chẵn lẻ`
- `tang MAC` → `tầng MAC`
- `mang LAN` → `mạng LAN`
- `sau day` → `sau đây`
- `địa chi` → `địa chỉ`

Đồng thời đã tách phần lời giải/ghi chú bị dính ra khỏi phần câu hỏi hoặc phương án trong các mẫu như:

- `Answer: ...`
- `Đáp án: ...`
- `Giải: ...`
- `P4`, `P44`, `P86`, ...
- `GTP28`, `GTP101`, `GTP189-190`, ...

Một số lỗi gộp phương án được sửa theo ID cụ thể, ví dụ De01 câu 12, câu 32, câu 42; De04 câu 12 trang 51; cùng các câu có phần giải thích bị dính vào lựa chọn.

## 7. Nguồn kỹ thuật dùng để kiểm tra đáp án

- RFC 9293 — TCP.
- RFC 768 — UDP.
- RFC 1035 — DNS, nêu rõ TCP port 53 và UDP port 53 đều được sử dụng.
- Cisco — 1000BASE-LX: chuẩn 5 km trên single-mode fiber; Cisco LX/LH có thể đạt 10 km.
- Cisco — Router hoạt động ở OSI Layer 3.
- IEEE tài liệu/Technology Navigator — CDMA phân biệt người dùng bằng mã.
- Unicode Standard 16.0, §3.9.3 — UTF-8 ánh xạ mỗi Unicode scalar value thành chuỗi 1–4 byte.

## 8. File thay đổi trong lần kiểm tra này

- `data_corrections.js` — chuẩn hóa tiếng Việt/OCR, tách ghi chú/lời giải dính và đánh dấu 6 đáp án bổ sung không có trong PDF.
- `index.html` — nạp lớp hiệu chỉnh trước `app.js`.
- `bao_cao_kiem_tra_lai_2026-08-08.md` — báo cáo này.

> Lưu ý: `questions.json`/`questions.js` vẫn giữ dữ liệu trích gốc để truy vết. Nội dung sạch được áp dụng ở lớp hiển thị trước khi người học bắt đầu làm bài; cách này tránh làm mất dấu vết so sánh với PDF nguồn.
