# BÁO CÁO HIỆN TRẠNG HỆ THỐNG ITMatch
Ngày: 06/09/2026 — Tổng hợp từ code đang chạy (commit 72803ad)

Mỗi chức năng gồm: Mô tả → Luồng → Kết quả hiện tại → Vướng mắc.

## 1. TỔNG QUAN
- Ứng viên: 7 chức năng — đủ demo, 2 vướng nhỏ
- Nhà tuyển dụng: 6 — đủ, đã fix 3 lỗi lớn (mail, lịch PV, audit)
- Admin: 4 — đủ
- Hạ tầng (DB/Mail/AI): 4 — có Atlas + SMTP Gmail thật
- Tổng 21 chức năng ~90% spec FILE_1_TONG_QUAT

## 2. CHI TIẾT TỪNG CHỨC NĂNG

### F01 Đăng ký/Đăng nhập
- Mô tả: 3 role candidate/employer/admin, bcrypt 10 rounds, JWT Bearer, lưu itmatch_token+user localStorage.
- Luồng: AuthPage -> POST /api/auth/register|login -> auth.service.js dual-mode (MongoDB/demoUsers) -> signJWT -> FE lưu token.
- Kết quả: Chạy cả khi có/không DB. Seed 3 TK: nam.nguyen@example.com / recruiter@vng.com.vn / admin@itmatch.vn.
- Vướng: Chưa quên mật khẩu/xác thực email/refresh token/Google login; thiếu rate-limit /login.

### F02 Hồ sơ cá nhân
- Mô tả: phone, avatarUrl, cvUrl, skills[], experience, education, bio, github, linkedin. Upload Cloudinary.
- Kết quả: Avatar 400x400 rounded-full, CV 10MB iframe 720px + fullscreen + Tải/Xóa.
- Vướng: Chưa % hoàn thiện hồ sơ; chưa parse CV tự điền skills.

### F03 Danh mục kỹ năng — 60 kỹ năng 6 nhóm. GET public, POST/PUT/DELETE admin only. Vướng: chưa autocomplete.

### F04 Tìm kiếm & lọc việc — Filter q/location/mode/level/salary + badge Matching. Pagination FE 6/trang. Vướng: chưa phân trang server-side, chưa sort/lưu bộ lọc.

### F05 Chi tiết tin — JobDetailPage. Vướng: chưa Bookmark/Chia sẻ.

### F06 Matching Score — Score=matched/required*100, alias + Levenshtein fuzzy. Gemini fallback. Vướng: vẫn keyword matching.

### F07 Nộp đơn — cvUrl+coverLetter, chặn nộp 2 lần, Job.applicants++. Vướng: chưa cho CV khác nhau mỗi job.

### F08 Theo dõi đơn (Candidate) — DashboardPage list myApplications + block vàng phản hồi + block xanh lịch PV + lịch sử. Vướng: phải F5, chưa chuông thông báo.

### F09 Hồ sơ công ty — Employer tab Hồ sơ, isVerified reset khi sửa. Vướng: chưa gallery/review.

### F10 Đăng tin — POST /api/jobs pending -> Admin duyệt -> active. Vướng: chưa VIP/preview.

### F11 Quản lý ứng viên (core) — List + Xem CV + select status + nếu interview thì form xanh 6 ô date/time/location/interviewer/meetLink/note (validate 400) -> PUT /api/applications/:id/status -> history[] + mail HTML. Đã fix 3 lỗ hổng. Vướng: chưa lọc theo score, bulk, export.

### F12 Thống kê NTD — GET /api/dashboard/stats. Vướng: chưa chart.

### F13 Admin duyệt công ty & duyệt tin — Vướng: chưa ban/unban, log audit.

### F14 Admin Dashboard — Vướng: chưa biểu đồ theo tháng.

### F15 AI (Gemini) — 4 endpoint ai.routes.js. Vướng: key model-scoped, chưa streaming.

### F16 Gửi mail — nodemailer smtp.gmail.com:587. Chỉ gửi khi có DB + Gmail thật. Vướng lớn nhất: mail giả bounce, chưa Notification Center.

### F17 Hạ tầng & Seed — Atlas Cluster0, Cloudinary, seed 3 user+8 jobs+1 app+60 skills. Vướng: whitelist IP đổi WiFi phải Add Current IP lại (nên để 0.0.0.0/0).

## 3. VƯỚNG MẮC TỔNG HỢP (ưu tiên)
1. Mail giả không nhận, chưa có chuông — P0 — Thêm Notification Center ~2h
2. Chưa phân trang server-side — P1 — GET /jobs?page&limit ~1h
3. Chưa Save/Bookmark — P1 — ~1h
4. Quên mật khẩu/refresh/rate-limit — P2 — ~2h
5. Atlas whitelist đổi IP — Làm ngay 0.0.0.0/0
6. Lộ App Password — Revoke sau nộp

## 4. KẾT LUẬN
Đủ khung để bảo vệ (21 chức năng, 3 role, đủ luồng ứng viên nộp -> NTD mời PV có lịch + mail + history). Vướng chính là thông báo cho mail giả.
