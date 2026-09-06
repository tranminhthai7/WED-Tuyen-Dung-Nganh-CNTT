# BÁO CÁO TUẦN NÀY

## Dự án: ITMatch - Hệ thống tuyển dụng CNTT

Ngày báo cáo: 2026-09-06 (Tuần 6)

## 1. Mục tiêu của tuần

- Hoàn thiện pipeline ứng tuyển end-to-end: ứng viên nộp đơn → NTD đổi trạng thái → ứng viên nhận thông báo.
- Khắc phục 3 lỗ hổng nghiệp vụ: không gửi mail khi đổi status, mời phỏng vấn chỉ là chữ, không có lịch sử audit.
- Hoàn thiện xác thực hồ sơ công ty (isVerified reset khi sửa thông tin).
- Nâng cấp thuật toán Matching Score (AI Gemini + alias + fuzzy Levenshtein).
- Cấu hình SMTP Gmail thật để mail phỏng vấn gửi được (App Password).
- Kiểm tra thực tế: FE/BE chạy local + MongoDB Atlas đã whitelist IP.

## 2. Công việc đã thực hiện

### 2.1 Backend — Node.js + Express + MongoDB Atlas

| Hạng mục | Chi tiết |
|----------|----------|
| Auth | `auth.service.js` dual-mode (MongoDB / demoUsers), bcrypt 10 rounds, JWT, `authenticate + requireRole([candidate,employer,admin])` |
| Company | `company.service.js:updateMyCompany()` — sửa bất kỳ field nào (name/website/industry/size/address/description/techStack/logo) nếu đang `isVerified=true` thì reset `isVerified=false` → `Đang chờ Admin duyệt`. Báo cho FE + invalidate myCompany. |
| Application | Mở rộng `Application` schema: `interview{date,time,location,interviewer,meetLink,note}` + `history[{from,to,companyNote,interview,by,at}]`. `updateApplicationStatus()` validate interview khi status=interview, push history, fire-and-forget `sendMail` HTML. Trả `interview+history` cho cả `getMyApplications` và `getEmployerApplications`. |
| Mail | `utils/mail.js` — nodemailer, check `SMTP_HOST/USER/PASS` nếu thiếu thì `console.warn + skipped` (demo mode không vỡ), nếu có thì gửi HTML có block xanh lịch PV. Đã cấu hình `.env` với `smtp.gmail.com:587 / dp1.1a1.thai@gmail.com / iydx xpki qmni xkay`. |
| Matching/AI | `matching.js` — alias groups (React/Next.js, MySQL/SQL...) + Levenshtein fuzzy (Reac~React), badge Xanh >70% / Vàng 40-70% / Đỏ <40% + "Còn thiếu: CSS, Figma". `ai.service.js` — Gemini REST `gemini-3-flash-preview` cho matching/suggest-jobs/JD/cover-letter (fallback alias+fuzzy). `ai.routes.js` 4 endpoint. |
| Skill/Admin | `skill.routes.js` — admin CRUD kỹ năng (POST/PUT/DELETE), GET public có seed `defaultSkills` 60 kỹ năng 6 nhóm. `dashboard.routes.js` GET /stats cho employer/admin. |
| Job | `job.service.js` 8 jobs seed đa dạng level/mode/salary/deadline, `demoJobs` fallback, pagination 6/trang ở FE. `Job` status `pending/active/closed/rejected`. |
| Config | `.env` có MongoDB SRV + Cloudinary + Gemini + SMTP. `seed.js` tạo 3 user (candidate/employer/admin) + 8 jobs + 1 application. |

### 2.2 Frontend — React 18 + Vite + Tailwind

| Trang | Tính năng chính |
|-------|-----------------|
| AuthPage | Tab Đăng nhập/Đăng ký, lưu `itmatch_token + itmatch_user` localStorage |
| HomePage | Hero + search + trust strip + JobCard list từ `GET /api/jobs` |
| JobsPage | Filter q/location/mode/level/salary, badge Matching Score, pagination 6/trang + reset page khi filter, nút AI Gợi ý việc |
| JobDetailPage | Chi tiết job, nút Ứng tuyển (kèm CV + CoverLetter), AI Cover Letter + Matching % |
| DashboardPage (ứng viên) | Danh sách đơn `myApplications`, hiển thị coverLetter giống NTD, block vàng `Phản hồi NTD`, **block xanh Lịch phỏng vấn** (date/time/location/interviewer/meetLink click được + note), `<details> Lịch sử cập nhật` 5 dòng gần nhất |
| EmployerDashboardPage | Tabs Tổng quan/Hồ sơ công ty/Đăng tin/Ứng viên. Form công ty reset verify + báo "Đã lưu — cần xác thực lại". **Phản hồi ứng viên**: select `pending/viewed/interview/accepted/rejected` + textarea `companyNote` + **form xanh lịch PV 6 ô** (Ngày/Giờ/Địa điểm/Người PV/Link Meet/Ghi chú) khi chọn interview (validate phải điền date/time/location/meetLink), prefill khi mở lại, card hiện interview + history |
| AdminDashboardPage | Duyệt công ty/tin, quản lý skill, thống kê |
| ProfilePage | avatar `rounded-full w-28` crop face 400x400, CV upload Cloudinary raw `10MB`, preview iframe 720px + fullscreen overlay + nút Tải/Xóa, normalize skills |

### 2.3 Hạ tầng

- MongoDB Atlas Cluster0 (Data Size 342.9KB/512MB) — đã fix `IP whitelist` (Add Current IP 77.234.13.215/32), BE log `MongoDB connected successfully (SRV)` + `ITMatch backend running on port 5000`.
- Frontend Vite `http://localhost:5173`, Backend `http://localhost:5000`, `node --watch` auto-reload.
- Git: 20+ commits tuần này (fix button trắng mất chữ, seed mở rộng, AI Gemini, matching fuzzy, CV preview, pagination, mail interview...).

## 3. Sản phẩm đầu ra đã có

- Source code `frontend/` + `backend/` chạy được cả 2 mode: có DB (Atlas) và demo (không DB).
- API hoạt động: `/api/health`, `/api/auth/*`, `/api/jobs`, `/api/applications/*`, `/api/companies/*`, `/api/skills`, `/api/ai/*`, `/api/dashboard/stats`.
- Giao diện đủ 3 role, responsive, design system 14KB, lưu tin Bookmark (localStorage) đã có nền tảng.
- Mail phỏng vấn gửi thật qua Gmail SMTP (đã test, log `[mail] sent <id> -> ...`).

## 4. Kết quả kiểm tra thực tế

| Kiểm tra | Kết quả |
|----------|---------|
| `GET /api/health` | `{"status":"ok","message":"ITMatch backend đang hoạt động"}` |
| MongoDB | `connected successfully (SRV)` sau khi whitelist, trước đó `SRV connect failed` → demo mode |
| SMTP | Trước: `[mail] SMTP chua cau hinh — bo qua`, Sau cấu hình App Password: gửi được, cần ứng viên dùng Gmail thật (mail giả example.com sẽ bounce) |
| NTD đổi `pending → interview` kèm lịch | Card ứng viên hiện block xanh + `<details>` history, ứng viên F5 thấy lịch + mail (check cả Spam) |
| Sửa hồ sơ công ty khi đã xác thực | `isVerified` về false + badge `Đang chờ Admin duyệt` |
| Build FE | `Vite v5.4.21 ready in 599ms`, BE `vite build ✓ built in 2.15s` (các tuần trước) |

## 5. Đánh giá kết quả

- **Đạt được:** Đã cover hết 13 đầu mục trong FILE_1_TONG_QUAT (NV01-NV13), pipeline `pending→viewed→interview(lịch)→accepted/rejected + history + mail` hoàn chỉnh — điểm nổi bật so với mặt bằng đồ án. Dual-mode BE giúp demo không phụ thuộc DB. AI Gemini + fuzzy matching là điểm cộng kỹ thuật.
- **Hạn chế:** Chưa có Notification Center (chuông) trong web cho mail giả — phải F5 mới thấy. Chưa phân trang API server-side (mới pagination FE). Chưa chat realtime, chưa gói Premium/VIP, chưa refresh token/quên mật khẩu.

## 6. Kế hoạch tuần tiếp theo

1. Thêm **Notification Center** (bell + badge unread) để mail giả vẫn thấy thông báo mời PV ngay trong app.
2. Thêm **Lưu tin (Bookmark)** + **Theo dõi công ty** (collection SavedJob).
3. Chuyển **phân trang sang server-side** `GET /jobs?page&limit` + sort lương/deadline.
4. Thêm **quên mật khẩu / xác thực email** + rate-limit login.
5. Chuẩn bị **slide bảo vệ + video demo** (flow ứng viên nộp → NTD mời PV có lịch → mail tới Gmail).
6. Deploy thử: Vercel (FE) + Render (BE) + Atlas.

---

## Ghi chú cuối cùng

Báo cáo này tổng hợp đến commit `72803ad` (05/09/2026) — nguồn: `git log`, file `.env`, log backend `task-2119`, và kiểm tra UI `EmployerDashboardPage`/`DashboardPage`/`mail.js`/`seed.js`. Toàn bộ đã chạy thử local trước khi viết báo cáo.
