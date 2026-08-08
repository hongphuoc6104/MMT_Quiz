# Bộ trắc nghiệm Mạng máy tính

- Mở `index.html` bằng Chrome/Edge/Firefox hoặc dùng GitHub Pages của repository.
- Chọn bộ đề, bật/tắt xáo trộn câu hỏi và đảo đáp án.
- Sau khi chọn đáp án, trang hiển thị lời giải học tập đầy đủ: kiến thức nền, lập luận, phân tích từng phương án A/B/C/D, vì sao không chọn, khi phương án đó có thể đúng, lỗi dễ nhầm và phần ghi nhớ.
- Các câu bài tập được bổ sung khu vực công thức/cách giải từng bước cho các nhóm phổ biến như IPv4/CIDR, TCP SEQ/ACK, Shannon, Nyquist, transmission delay, CRC và sliding-window ARQ.
- Câu có hình giữ nguyên ảnh/trang nguồn trong `assets/`; ảnh được hiển thị ngay trong câu hỏi và có thể bấm để mở kích thước đầy đủ.
- Dữ liệu gốc nằm trong `questions.json`; `questions.js` giúp app chạy trực tiếp bằng `file://` mà không cần web server.
- `solution_engine.js` tạo phần lời giải học tập cho toàn bộ câu hỏi dựa trên nội dung câu, đáp án đã đối chiếu, giải thích hiện có và các quy tắc kiến thức mạng máy tính.
- Đáp án được lưu bằng `correct_option_id` độc lập với vị trí A/B/C/D, nên đảo lựa chọn vẫn chấm đúng.

## Thống kê
- Câu hỏi sử dụng: 314
- Đáp án gốc được sửa: 10
- Câu có cảnh báo: 18
- Mảnh văn bản/ghi chú không phải câu hỏi đã loại: 14

## Lưu ý học tập

Các câu được gắn `warning` vẫn giữ cảnh báo của nguồn, nhất là câu phụ thuộc hình, đề thiếu dữ kiện hoặc phương án diễn đạt chưa chặt. Khi gặp các câu này, ưu tiên đối chiếu ảnh/trang nguồn và phần cảnh báo thay vì học thuộc máy móc đáp án.
