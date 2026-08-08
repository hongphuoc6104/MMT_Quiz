# BÁO CÁO KIỂM TRA LẠI PDF ↔ WEBSITE — 08/08/2026

## Phạm vi

- **PDF nguồn:** `hongphuoc6104/Tai_Lieu/Tổng hợp TN De01 02 03 04 07 08 (1).pdf`
- **Website:** `hongphuoc6104/MMT_Quiz`
- **Tổng câu đang học:** **314**
- **Nguồn lời giải đang dùng:** 23 file `manual_solutions/`, đủ **314/314**.
- Mỗi câu giữ `source_number` và `source_page` để truy vết về PDF.

## Kết quả rà toàn bộ dữ liệu đang dùng trên web

Workflow `Validate quiz content` hiện kiểm tra và đã **PASS**:

- đủ 314 câu / 314 lời giải;
- đủ phần giải thích cho từng phương án;
- ID đáp án tồn tại trong câu hỏi;
- không còn ID lựa chọn bị lặp sau lớp hiệu chỉnh cấu trúc;
- đáp án của câu hỏi khớp với lời giải mà website thực tế sử dụng;
- khối bài tính hợp lệ;
- cú pháp các file trình bày và dây nạp website hợp lệ.

Không phát hiện câu nguyên vẹn nào trên website là câu tự sinh hoàn toàn ngoài tập PDF đã trích. Trước đó **14 mảnh ghi chú/OCR** không phải câu hỏi đã bị loại.

## 11 đáp án nguồn cần sửa hoặc đính chính

### 4 câu có đáp án đúng sẵn trong lựa chọn PDF

| ID | Câu / trang | Khóa nguồn | Đáp án sau kiểm tra |
|---|---|---|---|
| `De01-2-1` | De01 câu 2 / trang 1 | A | **D — Network** |
| `De04-7-200` | De04 câu 7 / trang 50 | D | **A — 5000 m** |
| `De04-18-211` | De04 câu 18 / trang 52 | D | **C — CDMA** |
| `De04-24-249` | De04 câu 24 / trang 61 | C | **D — Router** |

### 7 câu mà lựa chọn PDF không có đáp án kỹ thuật đúng hoàn toàn

Website ghi rõ phương án này là **“Đáp án kỹ thuật bổ sung – không có trong đề”**.

| ID | Câu / trang | Vấn đề |
|---|---|---|
| `De01-41-39` | De01 câu 41 / trang 8 | Parity không có một tỷ lệ phát hiện lỗi % cố định nếu không cho mô hình lỗi. |
| `De04-13-121` | De04 câu 13 / trang 25 | “Lưu và chuyển tiếp” không phải bản thân cơ chế điều khiển tắc nghẽn. |
| `De04-4-191` | De04 câu 4 / trang 39 | Bản OCR nhân lặp A/B/C/D nhiều lần và khóa **12%** không có cơ sở tổng quát; parity phát hiện mọi mẫu có số bit đảo là lẻ. |
| `De04-7-263` | De04 câu 7 / trang 63 | Cả **LISTEN** và **CONNECT** đều không thuộc dịch vụ không kết nối theo cách phân loại của câu. |
| `De04-10-266` | De04 câu 10 / trang 64 | Có hơn một phát biểu sai về UDP nên câu một lựa chọn không chặt. |
| `De04-2-278` | De04 câu 2 / trang 66 | DNS sử dụng **cả UDP và TCP** tùy trường hợp. |
| `De07-10-312` | De07 câu 10 / trang 72 | UTF-8 mã hóa Unicode scalar values bằng **1–4 byte**; lựa chọn nguồn không diễn đạt đầy đủ. |

## Câu có phương án trùng nghĩa

`De08-31-321` (De08 câu 31, trang 73) có **B và D cùng nghĩa** sau khi phục hồi OCR. Website bỏ B trùng nghĩa và giữ D theo khóa nguồn, tránh bắt người học chọn giữa hai câu trả lời tương đương.

## Cảnh báo học tập

18 cảnh báo nguồn ban đầu vẫn được giữ cho các câu phụ thuộc hình, thiếu dữ kiện, mất ký hiệu hoặc diễn đạt chưa chặt. Ngoài ra, website hiển thị cảnh báo riêng cho 7 câu có đáp án kỹ thuật bổ sung.

Các nhóm cần chú ý gồm: De01 câu 5, 9, 44, 50; De02 câu 6, 8, 20, 32; De03 câu 4, 12; De04 câu 16 trang 28, câu 12 trang 34, câu 5 trang 49, câu 4 trang 56, câu 11 trang 64; De08 câu 20, 21, 31.

## Làm sạch tiếng Việt/OCR

Website sửa các lỗi kiểu:

- `đơn vi` → `đơn vị`;
- `tai` → `tại`;
- `tra m` → `trạm`;
- `cu a` → `của`;
- `Tin hiệu tuần ty` → `Tín hiệu tương tự`;
- `Tín hiệu s6` → `Tín hiệu số`;
- `KHÔNG DUNG` → `KHÔNG ĐÚNG`;
- `chuyển mach` → `chuyển mạch`;
- `Dich vu` → `Dịch vụ`;
- `chan lẻ` → `chẵn lẻ`.

Các phần `Answer:`, `Đáp án:`, `Giải:`, `P...`, `GTP...` bị OCR dính vào câu hỏi/phương án cũng được tách khỏi phần người học cần đọc. Các khối lựa chọn A/B/C/D bị nhân lặp được khử ở `question_structure_fixes.js`.

## Cải thiện phần lời giải để dễ nhớ

`learning_view.js` giữ toàn bộ kiến thức nhưng thay cách đọc mặc định:

1. **🔑 Từ khóa cần nhớ** — tự nhận diện và làm nổi bật TCP, UDP, OSI, IP, DNS, ARP, Ethernet, subnet/CIDR, ACK/SEQ, CRC, công thức, địa chỉ IP, đơn vị tốc độ...
2. **🎯 Vì sao chọn đáp án này?** — rút câu đệm và phần lặp.
3. **🧠 Ghi nhớ** — ý ngắn để ôn nhanh.
4. **🧮 Cách tính cần nhớ** — vẫn hiện đầy đủ với câu bài tập.
5. Phân tích A/B/C/D, kiến thức nền và lỗi dễ nhầm được **thu gọn**, mở ra khi cần.

## Nguồn kỹ thuật đối chiếu chính

- RFC 9293 — TCP.
- RFC 768 — UDP.
- RFC 1035 — DNS.
- Cisco — 1000BASE-LX và OSI Layer 3/router.
- IEEE — CDMA.
- Unicode Standard — UTF-8.

## Các lớp dữ liệu hiện dùng

- `questions.js` — dữ liệu trích nguồn.
- `question_structure_fixes.js` — khử lựa chọn lặp và sửa các cấu trúc nguồn bất thường.
- `data_corrections.js` — sửa OCR/dấu tiếng Việt/dấu câu.
- `manual_solutions/*.js` — nguồn lời giải thủ công 314/314.
- `manual_to_static.js` — adapter cho ứng dụng hiện tại.
- `learning_view.js` + `learning_view.css` — rút gọn và in đậm nội dung học.
- `manual_bootstrap.js` — nạp các lớp trên theo đúng thứ tự.

`static_solutions.js` không còn được website nạp vì bản build cũ từng nhân bản dữ liệu lựa chọn ở một số câu.
