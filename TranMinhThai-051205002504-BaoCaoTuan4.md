# BÁO CÁO THỰC TẬP — TUẦN 4

| Thông tin | Chi tiết |
|-----------|----------|
| **Họ và tên** | Trần Minh Thái |
| **MSSV** | 051205002504 |
| **Tên đề tài** | Xây dựng Website Tuyển dụng chuyên ngành Công nghệ thông tin (ITMatch) |
| **Tuần báo cáo** | Tuần 4 |
| **Thời gian** | 18/08/2026 – 23/08/2026 |
| **Ngày nộp** | 23/08/2026 |
| **GitHub** | https://github.com/tranminhthai7/WED-Tuyen-Dung-Nganh-CNTT |

---

## 1. MỤC TIÊU CỦA TUẦN 4

Theo kế hoạch 8 tuần đã đề ra, tuần 4 tập trung vào **nền tảng nghiệp vụ cốt lõi và giao diện người dùng**. Cụ thể:

- Hoàn thiện backend Auth: kết nối MongoDB, middleware xác thực JWT
- Xây dựng model dữ liệu đầy đủ cho User, Job
- Triển khai API Jobs (danh sách, chi tiết)
- Dựng giao diện đăng ký / đăng nhập kết nối với backend thật
- Dựng trang chủ (HomePage) với danh sách việc làm lấy từ API
- Đảm bảo luồng đăng nhập → lưu token → hiển thị dữ liệu hoạt động end-to-end

---

## 2. CÔNG VIỆC ĐÃ THỰC HIỆN

### 2.1 Backend — Node.js + Express.js

#### 2.1.1 Cấu trúc backend hoàn chỉnh

Cấu trúc `backend/src/` đã được tổ chức đầy đủ theo mô hình phân tầng:

```
backend/src/
├── app.js              ← Express app, đăng ký routes
├── server.js           ← Entry point, kết nối MongoDB
├── config/             ← Cấu hình môi trường
├── controllers/
│   ├── auth.controller.js
│   └── job.controller.js
├── middlewares/        ← Sẵn sàng cho auth middleware
├── models/
│   ├── User.js
│   └── Job.js
├── routes/
│   ├── auth.routes.js
│   ├── health.routes.js
│   └── job.routes.js
├── services/
│   ├── auth.service.js
│   └── job.service.js
├── utils/
│   └── jwt.js          ← Tạo và xác thực token
└── validators/
```

#### 2.1.2 Model dữ liệu

**User Model** — Tài khoản người dùng:

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `name` | String (required) | Họ và tên |
| `email` | String (required, unique) | Email đăng nhập |
| `password` | String (required, minLength 6) | Mật khẩu đã hash |
| `role` | Enum: candidate/employer/admin | Phân quyền |
| `isActive` | Boolean | Trạng thái hoạt động |
| `createdAt`, `updatedAt` | Timestamps | Tự động |

**Job Model** — Tin tuyển dụng:

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `slug` | String (required, unique) | URL-friendly ID |
| `title` | String (required) | Tên vị trí |
| `company` | String (required) | Tên công ty |
| `logo` | String | Ký hiệu logo |
| `tone` | String | Màu sắc card hiển thị |
| `location` | String | Địa điểm làm việc |
| `salary` | String | Mức lương |
| `mode` | String | Hình thức (On-site/Hybrid/Remote) |
| `experience` | String | Yêu cầu kinh nghiệm |
| `tags` | [String] | Kỹ năng yêu cầu |
| `posted` | String | Thời gian đăng |
| `applicants` | Number | Số lượt ứng tuyển |

#### 2.1.3 Auth Service — Dual-mode (MongoDB + Demo)

`services/auth.service.js` triển khai logic xác thực với **cơ chế dual-mode**:

- Nếu MongoDB đang kết nối (`readyState === 1`): thao tác với database thật
- Nếu MongoDB chưa kết nối: dùng `demoUsers[]` in-memory để backend vẫn hoạt động khi chưa có `.env`

**Luồng đăng ký:**
1. Validate: kiểm tra đủ `name`, `email`, `password`
2. Chuẩn hóa email (lowercase + trim)
3. Hash password với `bcryptjs` (salt rounds = 10)
4. Kiểm tra email đã tồn tại
5. Tạo user mới (MongoDB hoặc demo)
6. Trả về `{ message, user: { id, name, email, role }, token }`

**Luồng đăng nhập:**
1. Validate: kiểm tra đủ `email`, `password`
2. Tìm user theo email
3. So sánh password với `bcrypt.compare()`
4. Trả về JWT token nếu khớp

#### 2.1.4 Routes đã đăng ký

| Route | Method | Chức năng |
|-------|--------|-----------|
| `/api/health` | GET | Kiểm tra server hoạt động |
| `/api/auth/register` | POST | Đăng ký tài khoản mới |
| `/api/auth/login` | POST | Đăng nhập, nhận JWT token |
| `/api/jobs` | GET | Lấy danh sách tin tuyển dụng |

#### 2.1.5 Dependencies đã cài đặt

| Package | Phiên bản | Mục đích |
|---------|-----------|----------|
| express | ^4.21.2 | Web framework |
| mongoose | ^8.8.1 | MongoDB ODM |
| bcryptjs | ^3.0.3 | Hash mật khẩu |
| jsonwebtoken | ^9.0.3 | Tạo/xác thực JWT |
| cors | ^2.8.5 | Cross-origin |
| dotenv | ^16.4.5 | Biến môi trường |

---

### 2.2 Frontend — React.js + Vite

#### 2.2.1 Cấu trúc frontend hoàn chỉnh

```
frontend/src/
├── App.jsx             ← Root component, hash-based navigation
├── main.jsx            ← Entry point
├── styles.css          ← Global design system (14KB)
├── assets/
├── components/
│   ├── Header.jsx      ← Thanh điều hướng
│   └── JobCard.jsx     ← Card hiển thị tin tuyển dụng
├── hooks/
├── layouts/
├── pages/
│   ├── AuthPage.jsx
│   ├── HomePage.jsx
│   ├── JobsPage.jsx
│   ├── DashboardPage.jsx
│   ├── EmployerDashboardPage.jsx
│   └── AdminDashboardPage.jsx
├── routes/
├── services/
│   ├── authApi.js
│   └── jobsApi.js
├── store/
└── utils/
```

#### 2.2.2 Trang chủ — HomePage.jsx

Landing Page đã được dựng hoàn chỉnh với các thành phần:

**Hero Section:**
- Slogan: *"Tìm nơi bạn có thể làm việc tốt."*
- Search bar với ô tìm kiếm từ khóa + dropdown địa điểm (TP.HCM / Hà Nội / Remote)
- Quick-filter roles: Frontend, Backend, Product & Design, Data & AI, QA & Automation, DevOps & Cloud
- Stat card: **2,480+ việc đang mở**, **620 đội ngũ công nghệ**

**Trust Strip:**
- 3 cam kết: Thông tin minh bạch | Đúng ngành công nghệ | Hai phía cùng tốt hơn

**Job Section:**
- Danh sách `JobCard` lấy từ API (`GET /api/jobs`)
- Tự động fallback sang dữ liệu mẫu nếu API chưa sẵn sàng

**Dữ liệu fallback job mẫu:**

| Vị trí | Công ty | Lương | Kỹ năng |
|--------|---------|-------|---------|
| Senior Frontend Engineer | Grab | 2,500–4,000 USD | React, TypeScript, Next.js |
| Product Designer (UI/UX) | MoMo | 1,800–2,800 USD | Figma, UX Research |
| Backend Engineer — Golang | VNG | 2,000–3,500 USD | Golang, Microservices, AWS |
| Data Analyst | Tiki | 1,200–2,000 USD | SQL, Python, BI |

**Company Section:** FPT Software, Shopee Vietnam, NashTech

**Audience Section:** Card đôi dành cho ứng viên và nhà tuyển dụng → dẫn đến trang Auth

#### 2.2.3 Trang đăng ký / đăng nhập — AuthPage.jsx

| Tính năng | Chi tiết |
|-----------|----------|
| Tab chuyển đổi | Đăng nhập ↔ Đăng ký |
| Form đăng ký | Họ tên + Email + Mật khẩu |
| Form đăng nhập | Email + Mật khẩu |
| Loading state | Button disable khi đang gửi request |
| Thông báo | Hiển thị success/error rõ ràng |
| Kết nối API | Gọi backend thật qua `authApi.js` |
| Lưu token | `localStorage`: `itmatch_token`, `itmatch_user` |
| Giao diện | 2 cột: Brand panel (trái) + Form panel (phải) |

#### 2.2.4 API Service Layer

**`services/authApi.js`:**
- `registerAccount(payload)` → `POST /api/auth/register`
- `loginAccount(payload)` → `POST /api/auth/login`

**`services/jobsApi.js`:**
- `fetchJobs()` → `GET /api/jobs` → trả về mảng hoặc `[]` nếu lỗi

#### 2.2.5 Navigation — Hash-based Routing

`App.jsx` dùng `window.location.hash` thay Router (nhẹ, không cần dependency):
- Hash `#auth` → render `AuthPage`
- Không có hash → render `HomePage`
- Hỗ trợ browser back/forward button qua event `hashchange`

#### 2.2.6 Dependencies đã cài đặt

| Package | Phiên bản | Mục đích |
|---------|-----------|----------|
| react | ^18.3.1 | Core framework |
| react-dom | ^18.3.1 | DOM rendering |
| lucide-react | ^0.451.0 | Icon library |

---

### 2.3 Quản lý GitHub

- Repository: https://github.com/tranminhthai7/WED-Tuyen-Dung-Nganh-CNTT
- Mã nguồn commit theo tiến độ từng buổi làm
- Cấu trúc: `frontend/`, `backend/`, `docs/`

---

## 3. SẢN PHẨM ĐẦU RA ĐÃ CÓ

### 3.1 Backend

| Thành phần | Trạng thái |
|-----------|-----------|
| Express server + CORS + dotenv | ✅ Hoàn thành |
| Route `/api/health` | ✅ Hoàn thành |
| Route `POST /api/auth/register` | ✅ Hoàn thành |
| Route `POST /api/auth/login` | ✅ Hoàn thành |
| Route `GET /api/jobs` | ✅ Hoàn thành |
| Model User (Mongoose Schema) | ✅ Hoàn thành |
| Model Job (Mongoose Schema) | ✅ Hoàn thành |
| Auth Service dual-mode (MongoDB + demo) | ✅ Hoàn thành |
| Job Service (CRUD cơ bản) | ✅ Hoàn thành |
| JWT utils | ✅ Hoàn thành |
| Password hashing (bcryptjs) | ✅ Hoàn thành |

### 3.2 Frontend

| Thành phần | Trạng thái |
|-----------|-----------|
| Cấu trúc thư mục đầy đủ | ✅ Hoàn thành |
| `App.jsx` + hash navigation | ✅ Hoàn thành |
| `HomePage.jsx` — Landing page đầy đủ | ✅ Hoàn thành |
| `AuthPage.jsx` — Form auth kết nối API | ✅ Hoàn thành |
| `authApi.js` — Service gọi API auth | ✅ Hoàn thành |
| `jobsApi.js` — Service gọi API jobs | ✅ Hoàn thành |
| `Header.jsx` component | ✅ Hoàn thành |
| `JobCard.jsx` component | ✅ Hoàn thành |
| `styles.css` — Design system 14KB | ✅ Hoàn thành |
| Scaffold 3 trang Dashboard (3 role) | ⚠️ Có cấu trúc, chưa có nội dung |
| Build production | ✅ Thành công |

### 3.3 Kết quả kiểm tra thực tế

| Kiểm tra | Kết quả |
|---------|---------|
| `GET /api/health` | ✅ `{"status":"ok","message":"ITMatch backend đang hoạt động"}` |
| `POST /api/auth/register` | ✅ Trả về user + JWT token |
| `POST /api/auth/login` | ✅ Trả về user + JWT token |
| Frontend build (`vite build`) | ✅ `✓ built in 2.15s` |
| Frontend runtime (`localhost:5173`) | ✅ App chạy, navigation hoạt động |
| Luồng auth end-to-end | ✅ Đăng ký → token nhận → lưu localStorage |

---

## 4. ĐÁNH GIÁ KẾT QUẢ

### 4.1 Đạt được

- Backend có cấu trúc phân tầng chuẩn MVC (controller / service / model / route)
- Auth Service dual-mode: hoạt động cả khi có và chưa có MongoDB
- Model User và Job khớp với thiết kế schema trong đề án
- Frontend Landing Page chuyên nghiệp, đầy đủ section
- Trang Auth kết nối API backend thật, lưu token đúng chuẩn
- Job list lấy từ API, có fallback tự động khi API chưa sẵn sàng
- Design system CSS đồng bộ toàn bộ giao diện

### 4.2 Hạn chế hiện tại

- MongoDB Atlas chưa được kết nối (đang chạy chế độ demo in-memory)
- Chưa có JWT middleware bảo vệ các route cần xác thực
- Dashboard 3 role mới có scaffold, chưa có nội dung thật
- Chưa triển khai upload CV và upload logo (Multer + Cloudinary)
- Chưa có CRUD đầy đủ hồ sơ ứng viên và hồ sơ công ty

### 4.3 So sánh với kế hoạch tuần 4

| Hạng mục kế hoạch | Kết quả |
|-------------------|---------|
| Tạo job | ⚠️ Model có, API get list có, chưa có create |
| Duyệt job | ❌ Chưa thực hiện |
| Search / filter / pagination | ❌ Chưa thực hiện (mới fetch list) |
| Trang list và detail job | ⚠️ Có list ở home, chưa có detail |
| Admin moderation | ❌ Chưa thực hiện |
| Giao diện login/register kết nối API | ✅ Hoàn thành (Bù đắp) |
| Thiết kế HomePage & Data flow | ✅ Hoàn thành |

---

## 5. KẾ HOẠCH TUẦN 5

Tuần 5 sẽ tiếp tục hoàn thiện các phần lõi còn lại:

1. **Kết nối MongoDB Atlas thật** — cấu hình `MONGODB_URI` trong `.env`
2. **JWT Middleware** — bảo vệ các route cần xác thực
3. **Hoàn thiện Job CRUD** — tạo, sửa, xóa, lấy detail
4. **Trang chi tiết Job** — hiển thị thông tin tuyển dụng, nút ứng tuyển
5. **Search/Filter Job** — lọc theo kỹ năng, địa điểm
6. **CRUD hồ sơ ứng viên** — `GET/PUT /api/users/profile`
7. **Seed kỹ năng IT** — danh mục skill chuẩn (React, Node.js, Python...)

---

## 6. GHI CHÚ

Báo cáo này được lập dựa trên trạng thái thực tế của source code tại repo GitHub. Toàn bộ nội dung đã được kiểm tra qua quá trình build và chạy thử local.

---

*Sinh viên thực hiện:* **Trần Minh Thái**

*Ngày: 23/08/2026*
