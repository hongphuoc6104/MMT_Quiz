# Bộ lời giải thủ công — 314 câu Mạng máy tính

Website hiện dùng **duy nhất bộ lời giải được viết và lưu sẵn theo từng ID câu hỏi** trong thư mục `manual_solutions/`.

## Nguyên tắc

- Không sinh lời giải lúc chạy web.
- Không có fallback tạo kiến thức/lập luận khi thiếu dữ liệu.
- Nếu thiếu lời giải, thiếu phân tích một phương án hoặc thiếu bước tính bắt buộc, `app_manual.js` dừng và báo lỗi thay vì dựng nội dung thay thế.
- Mỗi câu có `knowledge`, `reasoning`, phân tích từng lựa chọn (`why`, `when`) và `summary`.
- Câu bài tập có `calculation` gồm tiêu đề, các bước và kết quả/đối chiếu.
- Các phương án bị lặp do OCR được khử trùng theo ID khi hiển thị; nội dung nguồn trong `questions.json` vẫn được giữ.
- Các ảnh nguồn có sẵn vẫn được dùng trực tiếp. Không vẽ ảnh mới để giả làm ảnh gốc khi repository không có asset nguồn.

## Phạm vi

- Đề 01: 47 câu
- Đề 01-ver2: 3 câu
- Đề 02: 35 câu
- Đề 03: 22 câu
- Đề 04: 187 câu
- Đề 07: 7 câu
- Đề 08: 13 câu

Tổng cộng: **314 câu**.

## Các file lời giải

Bộ lời giải được chia thành 23 file để dễ kiểm tra và bảo trì:

- `manual_solutions/de01_a.js`
- `manual_solutions/de01_b.js`
- `manual_solutions/de01_ver2.js`
- `manual_solutions/de02_a.js`
- `manual_solutions/de02_b.js`
- `manual_solutions/de03_a.js`
- `manual_solutions/de03_b.js`
- `manual_solutions/de04_ch1_a.js`
- `manual_solutions/de04_ch1_b.js`
- `manual_solutions/de04_ch1_c.js`
- `manual_solutions/de04_ch3_a.js`
- `manual_solutions/de04_ch3_b.js`
- `manual_solutions/de04_ch4.js`
- `manual_solutions/de04_ch5_a.js`
- `manual_solutions/de04_ch5_b.js`
- `manual_solutions/de04_ch6_a.js`
- `manual_solutions/de04_ch6_b.js`
- `manual_solutions/de04_ch7_a.js`
- `manual_solutions/de04_ch7_b.js`
- `manual_solutions/de04_ch8_a.js`
- `manual_solutions/de04_ch8_b.js`
- `manual_solutions/de07.js`
- `manual_solutions/de08.js`

## Ảnh nguồn

Các ảnh/trang nguồn hiện có trong repository và được giữ nguyên gồm:

- `assets/source-page-01.png`
- `assets/source-page-10.png`
- `assets/source-page-19.png`
- `assets/source-page-21.png`
- `assets/source-page-49.png`
- `assets/source-page-56.png`

Một số câu nhắc tới hình ở các trang mà repository hiện không có ảnh nguồn (ví dụ trang 29, 30 hoặc 65). Với các câu này, lời giải ghi rõ giới hạn dữ liệu và **không tự tạo ảnh hay số liệu để thay thế ảnh gốc**.

## Hiệu chỉnh đáng chú ý

Bộ manual giữ các đáp án đã được đối chiếu trước đó và bổ sung một số hiệu chỉnh cần thiết cho việc học:

- Câu parity bị khóa thành một tỷ lệ phần trăm cố định được sửa thành: **không có tỷ lệ phần trăm phát hiện cố định nếu chưa cho mô hình lỗi**; parity phát hiện mọi mẫu lỗi có số bit đảo là lẻ.
- Câu TCP có hai phương án B/D đồng nghĩa được cấu hình chấp nhận cả hai thay vì chấm oan một lựa chọn tương đương.
- Địa chỉ OCR `192.168.1101` được hiển thị lại theo ngữ cảnh là `192.168.1.101` và giải bằng subnet `/26`.
- Các câu thiếu băng thông/SNR, công suất đầu-cuối hoặc hình TCP gốc được ghi rõ là thiếu dữ kiện; lời giải không bịa phép tính để ép khớp khóa.

## Chạy và kiểm tra

`index.html` tải `questions.js`, `data_corrections.js`, 23 file manual và `app_manual.js`. Nó không tải `static_solutions.js` hay `solution_engine.js`.

Validator đọc đúng dữ liệu sau hiệu chỉnh của trình duyệt và kiểm tra:

1. đủ 314 câu và 314 ID lời giải;
2. mọi câu có kiến thức nền, lập luận và tóm tắt;
3. mọi phương án hiển thị có `why` và `when`;
4. đáp án đúng/đáp án sửa tồn tại trong các lựa chọn;
5. mọi block tính toán có đầy đủ bước và kết quả;
6. website không tham chiếu máy sinh lời giải cũ.

Validator nằm ở `scripts/validate-manual-solutions.cjs` và workflow `.github/workflows/validate-manual-solutions.yml`.