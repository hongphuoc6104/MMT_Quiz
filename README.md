# Bộ trắc nghiệm Mạng máy tính

- Mở `index.html` bằng Chrome/Edge/Firefox hoặc dùng GitHub Pages của repository.
- Chọn bộ đề, bật/tắt xáo trộn câu hỏi và đảo đáp án.
- Sau khi trả lời, giao diện đi theo thứ tự **Áp dụng kiến thức vào chính câu hỏi → Kiến thức nền riêng của câu → Khái niệm liên quan trực tiếp → Phân tích đầy đủ A/B/C/D → Ghi nhớ**. Câu bài tập có thêm **Cách tính**.
- Mỗi câu chỉ được hiển thị tối đa một khái niệm liên quan có độ tin cậy cao. Thẻ gộp chung Ethernet/MAC/switch/collision-domain đã được tách thành các định nghĩa đúng trọng tâm; nếu không có thẻ phù hợp, giao diện chỉ dùng phần kiến thức viết riêng của câu thay vì ghép gần đúng.
- Giao diện không còn lặp các nhãn kiểu `Vì sao chọn`, `Vì sao không chọn`, `Khi nào phương án này đúng / dùng được`, cũng không còn lớp tự động in đậm từ khóa hàng loạt. Nội dung của từng phương án chỉ giữ phần giải thích có kiến thức.
- Các câu bài tập vẫn giữ công thức/cách giải từng bước cho IPv4/CIDR, TCP SEQ/ACK, Shannon, Nyquist, transmission delay, CRC và sliding-window ARQ.
- Câu có hình giữ ảnh/trang nguồn trong `assets/`; ảnh được hiển thị ngay trong câu hỏi và có thể phóng to.
- Dữ liệu câu hỏi nằm trong `questions.json`; `questions.js` giúp app chạy trực tiếp bằng `file://`.
- `question_structure_fixes.js` khử các khối A/B/C/D bị OCR nhân lặp, sửa câu parity bị lặp ở De04 câu 4 trang 39 và loại phương án B trùng nghĩa với D ở De08 câu 31.
- `data_corrections.js` sửa lỗi OCR, dấu tiếng Việt, dấu câu, phần `Answer:/Đáp án:/Giải:` và ghi chú `P.../GTP...` bị dính vào nội dung mà không đổi ID, số câu hay trang nguồn.
- **Nguồn lời giải đang dùng trên website là 23 file trong `manual_solutions/`, đủ 314/314 câu.** `manual_bootstrap.js` nạp các file này theo thứ tự và `manual_to_static.js` chuyển sang cấu trúc mà `app.js` sử dụng.
- `tthcm_layout.js` là lớp trình bày lời giải cuối cùng, có nhiệm vụ đưa phần áp dụng lên đầu, bỏ meta-language/lời lặp và giữ đầy đủ lý do/điều kiện của từng phương án.
- Workflow `Validate quiz content` kiểm tra 314 câu, 314 lời giải, 1.235 phần giải thích phương án, đáp án, cấu trúc dữ liệu, ánh xạ lý thuyết một-khái-niệm và thứ tự giao diện question-first.
- Đáp án được lưu bằng ID ổn định, độc lập với vị trí A/B/C/D nên đảo lựa chọn vẫn chấm đúng.

## Thống kê sau lần rà lại 08/08/2026
- Câu hỏi sử dụng: **314**
- Lời giải thủ công: **314/314**
- Phần giải thích phương án được kiểm tra: **1.235**
- Đáp án gốc được xác định cần sửa/đính chính sau đối chiếu: **11**
- Trong 11 mục trên có **7 câu mà các lựa chọn PDF không có đáp án kỹ thuật đúng hoàn toàn**. Phương án `x` trên web được ghi rõ là **“Đáp án kỹ thuật bổ sung – không có trong đề”**.
- Cảnh báo nguồn/thiếu dữ kiện ban đầu: **18**; giao diện còn bổ sung cảnh báo cho các câu có đáp án kỹ thuật ngoài lựa chọn nguồn.
- Mảnh văn bản/ghi chú không phải câu hỏi đã loại: **14**

## Báo cáo kiểm tra lại

Xem `bao_cao_kiem_tra_lai_2026-08-08.md` để biết PDF/repo nguồn, các đáp án file bị xác định sai, các câu có bộ lựa chọn nguồn không đầy đủ/không duy nhất, các câu phụ thuộc hình hoặc thiếu dữ kiện và các lỗi OCR đã làm sạch.

## Lưu ý học tập

Các câu được gắn `warning` vẫn giữ cảnh báo của nguồn. Khi gặp câu phụ thuộc hình, thiếu dữ kiện hoặc phương án diễn đạt chưa chặt, ưu tiên ảnh/trang nguồn và phần cảnh báo thay vì học thuộc máy móc đáp án.
