# Húc Fest · Donate tracker

Dự án độc lập, không cần thư mục myproject-main hay node_modules của dự án cũ.

## Chạy

Cài Node.js 22 trở lên. Mở Terminal trong thư mục này, chạy:

    npm start

Mở http://localhost:3098 . Không cần npm install vì chỉ dùng thư viện có sẵn của Node.js.
Giữ Terminal chạy và kết nối Internet để cập nhật Cake. Ctrl+C để tắt.
Đổi cổng trong PowerShell: $env:PORT=3100; npm start

## Source

- public/index.html: giao diện và booth.
- public/assets/css/donate-tracker.css: theme.
- public/assets/js/donate-tracker.js: TARGET = 40000000, các mốc booth và giao dịch.
- donate-tracker.cjs: lọc và cộng giao dịch từ 07/09/2026 (giờ Việt Nam).
- server.js: web server và API Cake, encoded_id 318535339.

Chạy kiểm tra: npm test.
Tổng tiền chỉ gồm giao dịch nhận tiền, không gồm hoàn tiền. Tự cập nhật mỗi 60 giây.

## Sửa nhanh ở đâu?

| Muốn sửa                    | File / vị trí                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| Target gây quỹ              | `public/assets/js/donate-tracker.js` → `TARGET`                                                       |
| % và tên các mốc            | Cùng file → `stages`; sửa `data-part` trong HTML nếu đổi ngưỡng                                       |
| Tần suất cập nhật           | Cùng file → `REFRESH_INTERVAL_MS`                                                                     |
| Tên project, lời giới thiệu | `public/index.html` → phần tiêu đề                                                                    |
| Hình booth                  | `public/index.html` → SVG, mỗi nhóm `data-part` là một hạng mục                                       |
| Màu, font, kích thước       | `public/assets/css/donate-tracker.css` → các mục có chú thích                                         |
| ID sao kê Cake              | `server.js` → `CAKE_ENCODED_ID`; đổi cả link sao kê trong HTML và `SOURCE` trong `donate-tracker.cjs` |
| Ngày bắt đầu                | `donate-tracker.cjs` → `START` và `startDate` trả về; đổi cả các dòng ngày hiển thị trong HTML/JS     |
| Cổng chạy web               | `server.js` → `DEFAULT_PORT`, hoặc biến môi trường `PORT`                                             |

Sửa HTML/CSS/JS xong thì tải lại trang. Sửa `server.js` hoặc `donate-tracker.cjs` thì dừng và chạy lại `npm start`.
Code đã được căn lề 2 dấu cách và chia phần bằng chú thích. Có `.editorconfig` và `.prettierrc.json` để giữ định dạng nhất quán khi sửa tiếp.
