# 🗓️ Personal Work Manager (Hệ thống Quản lý Công việc Cá nhân)

[![React Version](https://img.shields.io/badge/React-19.2.6-blue.svg?logo=react)](https://react.dev)
[![Vite Version](https://img.shields.io/badge/Vite-8.0.12-646CFF.svg?logo=vite)](https://vitejs.dev)
[![State Management](https://img.shields.io/badge/State-Context%20API-orange)](https://react.dev/reference/react/createContext)
[![Design Style](https://img.shields.io/badge/Styling-Custom%20Vanilla%20CSS-green)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

**Personal Work Manager** là một ứng dụng web đơn trang (SPA) cao cấp được xây dựng trên nền tảng **React 19** và **Vite**. Dự án được thiết kế với giao diện hiện đại, mượt mà và trực quan, giúp người dùng lập kế hoạch, theo dõi tiến độ công việc hàng ngày, cải thiện năng suất lao động bằng phương pháp khoa học và đồng bộ hóa dữ liệu thông minh.

---

## 🚀 Tính Năng Nổi Bật

Hệ thống được phát triển với nhiều tính năng nâng cao, đáp ứng đầy đủ nhu cầu của một quản lý công việc chuyên nghiệp:

### 1. Quản lý Công việc Toàn diện (Core CRUD)
* **Thao tác nhanh chóng:** Thêm, sửa, xóa, và đánh dấu trạng thái công việc chỉ với một chạm.
* **Mức độ ưu tiên trực quan:** Phân loại công việc theo mức độ ưu tiên (**Cao**, **Trung bình**, **Thấp**) đi kèm màu sắc chỉ thị bắt mắt.
* **Lọc và tìm kiếm thông minh:** Tìm kiếm theo tiêu đề/mô tả; lọc nhanh theo độ ưu tiên hoặc trạng thái (*Chờ, Đang thực hiện, Hoàn thành, Quá hạn*).

### 2. Tự động Quản lý Công việc Định kỳ (Recurring Tasks)
* Hỗ trợ cài đặt tự động lặp lại công việc theo chu kỳ: **Hàng ngày**, **Hàng tuần**, **Hàng tháng**.
* Khi người dùng tích chọn "Hoàn thành" một công việc lặp lại, hệ thống sẽ tự động tính toán và khởi tạo một công việc mới cho chu kỳ tiếp theo dựa trên logic ngày tháng chuẩn xác.

### 3. Lịch trình Trực quan (Calendar View)
* Giao diện lịch biểu hàng tháng tích hợp sẵn, giúp theo dõi mật độ công việc phân bổ theo ngày.
* Nhấp vào một ngày trên lịch để xem nhanh và thêm/sửa công việc của ngày đó ngay lập tức.

### 4. Tiện ích Tập trung Pomodoro Timer
* Đồng hồ bấm giờ **Pomodoro** được tích hợp dưới dạng widget nổi tiện lợi (Floating Widget).
* Hỗ trợ các chu kỳ tập trung 25 phút chuẩn khoa học xen kẽ các khoảng nghỉ ngắn/dài, giúp tối ưu hóa khả năng tập trung của bộ não.

### 5. Sắp xếp Kéo & Thả (Drag & Drop)
* Cho phép thay đổi thứ tự ưu tiên hoặc thứ tự hiển thị của công việc một cách tự nhiên bằng hành động kéo thả chuột trực tiếp trên danh sách.

### 6. Nhắc nhở qua Thông báo Đẩy (Browser Push Notifications)
* Tự động quét và phát âm thanh/thông báo hệ thống khi đến giờ thực hiện công việc (trước hoặc đúng giờ hẹn).
* Tích hợp mượt mà với API thông báo hệ điều hành của trình duyệt.

### 7. Đồng bộ & Sao lưu Dữ liệu Thông minh
* **Lưu trữ cục bộ:** Tự động đồng bộ thời gian thực toàn bộ dữ liệu công việc vào **localStorage**, không sợ mất mát dữ liệu khi tải lại trang.
* **Nhập / Xuất dữ liệu (Import & Export):** Xuất toàn bộ dữ liệu ra tệp tin định dạng `.json` để sao lưu hoặc chuyển đổi thiết bị, và nhập lại dễ dàng chỉ trong vài giây.

### 8. Đăng Nhập & Cá Nhân Hóa (Onboarding)
* **First-time Login:** Màn hình đăng nhập dành cho người dùng mới, giúp thiết lập tên và email để hệ thống cá nhân hóa giao diện và thông báo.
* **Tự động lưu phiên:** Không yêu cầu đăng nhập lại ở các lần truy cập tiếp theo (tự động nhận diện tài khoản qua LocalStorage).

### 9. Lịch Trình Thời Gian Thực (Real-time Sync)
* Toàn bộ lịch biểu và trạng thái công việc được đồng bộ theo **ngày giờ thực tế** của hệ thống, giúp tính năng tự động chuyển trạng thái "Quá hạn" vận hành chính xác 100%.

### 10. Bảng Thống Kê Tương Tác Kép
* Các thẻ thống kê KPI (Hoàn thành, Đang thực hiện, Quá hạn) không chỉ dùng để xem mà còn **có thể click** để tự động chuyển hướng và áp dụng bộ lọc tương ứng bên trang Danh sách.

---

## 🛠️ Tech Stack & Kiến Trúc Dự Án

### 💻 Công nghệ sử dụng
* **Frontend Library:** [React 19](https://react.dev/) (phiên bản mới nhất mang lại hiệu năng tối ưu).
* **Build Tool:** [Vite 8](https://vite.dev/) (khởi động cực nhanh, Hot Module Replacement siêu tốc).
* **Styling:** Custom Vanilla CSS (Thiết kế Responsive hoàn hảo, Glassmorphism, Hiệu ứng chuyển động mượt mà, hỗ trợ giao diện sáng/tối cao cấp).
* **Icons:** [Lucide React](https://lucide.dev/) (thư viện icon dạng vector hiện đại và sắc nét).

### 📐 Kiến trúc Source Code
Dự án được tổ chức theo cấu trúc rõ ràng, module hóa cao để dễ dàng bảo trì và mở rộng:

```text
manage-personal-work/
├── public/                 # Các tài nguyên tĩnh (favicon, v.v.)
├── src/
│   ├── assets/             # Hình ảnh và font chữ dùng chung
│   ├── components/         # Các Component giao diện tái sử dụng
│   │   ├── calendar/       # Component con phục vụ trang lịch biểu
│   │   ├── common/         # Component dùng chung (PomodoroTimer, v.v.)
│   │   ├── layout/         # Header, Sidebar điều hướng hệ thống
│   │   ├── stats/          # Các widget thống kê trực quan
│   │   └── tasks/          # Component liên quan đến danh sách, form công việc
│   ├── context/            # Quản lý trạng thái toàn cục (TaskContext.jsx)
│   ├── data/               # Dữ liệu khởi tạo mẫu (sampleTasks.js)
│   ├── hooks/              # Custom Hooks tùy biến
│   ├── pages/              # Các trang giao diện chính (Dashboard, Tasks, Calendar, Stats, Settings, LoginPage)
│   ├── utils/              # Các hàm xử lý ngày tháng và logic hỗ trợ (dateUtils.js)
│   ├── App.jsx             # Điểm cấu hình layout và Router chính của ứng dụng
│   ├── index.css           # File CSS cốt lõi chứa hệ thống Design System chung
│   └── main.jsx            # Điểm khởi chạy của dự án React
├── index.html              # Template HTML5 chính
├── package.json            # Quản lý thư viện phụ thuộc và scripts chạy dự án
└── vite.config.js          # File cấu hình hoạt động của Vite
```

### ⚡ Design Patterns Áp Dụng
1. **Context Provider Pattern (`src/context/TaskContext.jsx`):** 
   Đóng vai trò như một kho dữ liệu (Single Source of Truth) kết nối toàn bộ State của ứng dụng, tránh tình trạng chuyển tiếp Props quá sâu (Prop Drilling). Giúp quản lý CRUD, Import/Export, Drag & Drop và Thống kê tập trung.
2. **Observer / State Syncing Pattern:**
   Theo dõi sự thay đổi của danh sách công việc (`tasks`) để tự động cập nhật trạng thái "Quá hạn" theo ngày hệ thống và ghi nhận dữ liệu mới vào `localStorage`.
3. **Strategy / Mapping Pattern (`src/utils/dateUtils.js`):**
   Xử lý tính toán chu kỳ ngày tháng tiếp theo cho công việc lặp lại (Hàng ngày, Hàng tuần, Hàng tháng) một cách trừu tượng hóa và linh hoạt.

---

## 🎨 Graphic Design

Giao diện hệ thống được lập trình dựa trên thiết kế trực quan cao cấp, bạn có thể tham khảo thiết kế gốc tại đường dẫn sau:
* **Đường dẫn thiết kế:** `/home/vo/manage personal work/graphic design.png`

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Thử

Để chạy thử dự án trên máy tính cá nhân của bạn, hãy thực hiện theo các bước đơn giản sau:

### 1. Yêu cầu hệ thống
* Máy tính đã cài đặt **Node.js** (Khuyến nghị phiên bản LTS v18 trở lên).
* Phần mềm quản lý gói **npm** hoặc **yarn**.

### 2. Các bước cài đặt chi tiết

```bash
# 1. Di chuyển vào thư mục dự án
cd "manage personal work"

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển (Development Server)
npm run dev
```

Sau khi chạy thành công lệnh trên, trình duyệt của bạn sẽ tự động mở hoặc bạn có thể truy cập liên kết mặc định:
👉 **[http://localhost:5173](http://localhost:5173)**

### 3. Build Production (Đóng gói sản phẩm)
Khi cần đóng gói ứng dụng để đưa lên máy chủ thực tế:

```bash
npm run build
```
Sản phẩm sau khi build sẽ nằm trong thư mục `/dist` và sẵn sàng để deploy lên Vercel, Netlify, Github Pages,...

---

## 🛡️ License

Dự án được phân phối dưới giấy phép **MIT License**. Bạn được tự do học tập, tùy chỉnh và phát triển thêm. 

Chúc bạn quản lý công việc hiệu quả và nâng cao hiệu suất làm việc mỗi ngày cùng **Personal Work Manager**! 🚀
