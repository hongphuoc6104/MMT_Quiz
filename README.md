# Bộ trắc nghiệm Mạng máy tính

- Mở `index.html` bằng Chrome/Edge/Firefox hoặc dùng GitHub Pages của repository.
- Chọn bộ đề, bật/tắt xáo trộn câu hỏi và đảo đáp án.
- Sau khi trả lời, giao diện ưu tiên **từ khóa cần nhớ**, **vì sao đáp án đúng** và **ghi nhớ ngắn**. Phân tích A/B/C/D, kiến thức nền, công thức và lỗi dễ nhầm được thu gọn để mở khi cần.
- `learning_view.js` tự in đậm các từ khóa mạng quan trọng như TCP/UDP, OSI, IP, DNS, ARP, Ethernet, subnet/CIDR, ACK/SEQ, CRC... và rút các câu đệm/lặp khỏi phần hiển thị.
- Các câu bài tập vẫn giữ công thức/cách giải từng bước cho IPv4/CIDR, TCP SEQ/ACK, Shannon, Nyquist, transmission delay, CRC và sliding-window ARQ.
- Câu có hình giữ ảnh/trang nguồn trong `assets/`; ảnh được hiển thị ngay trong câu hỏi và có thể phóng to.
- Dữ liệu câu hỏi nằm trong `questions.json`; `questions.js` giúp app chạy trực tiếp bằng `file://`.
- `data_corrections.js` sửa lỗi OCR, dấu tiếng Việt, dấu câu, phần `Answer:/Đáp án:/Giải:` và ghi chú `P.../GTP...` bị dính vào nội dung mà không đổi ID, số câu hay trang nguồn.
- **Nguồn lời giải đang dùng trên website là 23 file trong `manual_solutions/`, đủ 314/314 câu.** `manual_bootstrap.js` nạp các file này theo thứ tự và `manual_to_static.js` chuyển sang cấu trúc mà `app.js` sử dụng.
- `static_solutions.js` không còn được nạp trên website vì bản build cũ có lỗi nhân bản dữ liệu ở một số câu. `solution_engine.js` và `scripts/materialize-solutions.cjs` cũng không được website sử dụng.
- Workflow `Validate quiz content` kiểm tra đủ 314 câu/lời giải, đủ phân tích từng phương án, ID đáp án hợp lệ, khối bài tính, dữ liệu thực tế mà website dùng và cú pháp JavaScript trình bày.
- Đáp án được lưu bằng `correct_option_id` độc lập với vị trí A/B/C/D, nên đảo lựa chọn vẫn chấm đúng.

## Thống kê
- Câu hỏi sử dụng: 314
- Lời giải thủ công: 314
- Đáp án gốc được sửa sau đối chiếu: 10
- Trong 10 mục trên có **6 câu mà bốn lựa chọn của PDF không có đáp án kỹ thuật đúng hoàn toàn**. Phương án `x` trên web được ghi rõ là **“Đáp án kỹ thuật bổ sung – không có trong đề”**.
- Câu có cảnh báo: 18
- Mảnh văn bản/ghi chú không phải câu hỏi đã loại: 14

## Báo cáo kiểm tra lại

Xem `bao_cao_kiem_tra_lai_2026-08-08.md` để biết PDF/repo nguồn, các đáp án file bị xác định sai, 6 câu có bộ lựa chọn nguồn không đầy đủ/không duy nhất, các câu phụ thuộc hình hoặc thiếu dữ kiện và các lỗi OCR đã làm sạch.

## Lưu ý học tập

Các câu được gắn `warning` vẫn giữ cảnh báo của nguồn. Khi gặp câu phụ thuộc hình, thiếu dữ kiện hoặc phương án diễn đạt chưa chặt, ưu tiên ảnh/trang nguồn và phần cảnh báo thay vì học thuộc máy móc đáp án.
