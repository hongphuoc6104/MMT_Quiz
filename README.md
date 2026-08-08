# Bộ trắc nghiệm Mạng máy tính

- Mở `index.html` bằng Chrome/Edge/Firefox hoặc dùng GitHub Pages của repository.
- Chọn bộ đề, bật/tắt xáo trộn câu hỏi và đảo đáp án.
- Sau khi chọn đáp án, trang hiển thị lời giải **đã lưu tĩnh theo ID từng câu**: kiến thức nền, lập luận, phân tích từng phương án A/B/C/D, vì sao không chọn, khi phương án đó có thể đúng, lỗi dễ nhầm và phần ghi nhớ.
- Các câu bài tập có khu vực công thức/cách giải từng bước cho các nhóm như IPv4/CIDR, TCP SEQ/ACK, Shannon, Nyquist, transmission delay, CRC và sliding-window ARQ.
- Câu có hình giữ nguyên ảnh/trang nguồn trong `assets/`; ảnh được hiển thị ngay trong câu hỏi và có thể bấm để mở kích thước đầy đủ.
- Dữ liệu câu hỏi nằm trong `questions.json`; `questions.js` giúp app chạy trực tiếp bằng `file://`.
- `data_corrections.js` được nạp trước `app.js` để sửa lỗi OCR, dấu tiếng Việt, dấu câu, phần `Answer:/Đáp án:/Giải:` và ghi chú `P.../GTP...` bị dính vào nội dung. Lớp này không đổi ID, số câu hay trang nguồn nên vẫn truy vết được về PDF.
- Toàn bộ 314 lời giải được lưu trong `static_solutions.js`. Website **không sinh lời giải khi chạy** và không có fallback tạo lời giải. Nếu thiếu một ID, ứng dụng sẽ báo lỗi dữ liệu thay vì tự tạo nội dung thay thế.
- `solution_engine.js` và `scripts/materialize-solutions.cjs` đã bị vô hiệu hóa, không được website sử dụng. Workflow còn lại chỉ kiểm tra read-only rằng dữ liệu tĩnh đủ 314 câu và đủ các phương án.
- Đáp án được lưu bằng `correct_option_id` độc lập với vị trí A/B/C/D, nên đảo lựa chọn vẫn chấm đúng.

## Thống kê
- Câu hỏi sử dụng: 314
- Lời giải tĩnh: 314
- Đáp án gốc được sửa sau đối chiếu: 10
- Trong 10 mục trên có **6 câu mà bốn lựa chọn của PDF không có đáp án kỹ thuật đúng hoàn toàn**. Phương án `x` trên web được ghi rõ là **“Đáp án kỹ thuật bổ sung – không có trong đề”** để không nhầm với lựa chọn gốc.
- Câu có cảnh báo: 18
- Mảnh văn bản/ghi chú không phải câu hỏi đã loại: 14

## Báo cáo kiểm tra lại

Xem `bao_cao_kiem_tra_lai_2026-08-08.md` để biết:

- PDF/repo nguồn đã dùng;
- các đáp án file bị xác định sai;
- 6 câu có bộ lựa chọn nguồn không đầy đủ hoặc không duy nhất;
- các câu phụ thuộc hình/thiếu dữ kiện;
- các nhóm lỗi OCR, dấu tiếng Việt và dấu câu đã được làm sạch.

## Lưu ý học tập

Các câu được gắn `warning` vẫn giữ cảnh báo của nguồn, nhất là câu phụ thuộc hình, đề thiếu dữ kiện hoặc phương án diễn đạt chưa chặt. Khi gặp các câu này, ưu tiên đối chiếu ảnh/trang nguồn và phần cảnh báo thay vì học thuộc máy móc đáp án.
