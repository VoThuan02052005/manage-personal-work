# Các Biểu Đồ UML Hỗ Trợ Báo Cáo Kỹ Thuật Phần Mềm

Tệp này chứa mã nguồn Mermaid của 4 biểu đồ cốt lõi cho dự án **Personal Work Manager**. 
Bạn có thể sao chép các khối mã bên dưới và dán vào [Mermaid Live Editor](https://mermaid.live/) để xuất ra hình ảnh (.png) và chèn vào báo cáo LaTeX.

---

## 1. Biểu đồ Use Case (Use Case Diagram)
**Vị trí chèn:** Phần 2.1.3 trong tệp `sec2_phan_tich_thiet_ke.tex`

```mermaid
usecaseDiagram
    actor User as "Người dùng cá nhân"
    
    rectangle "Hệ thống Personal Work Manager" {
        usecase UC1 as "Quản lý Tài khoản"
        usecase UC2 as "Quản lý Công việc"
        usecase UC3 as "Sử dụng Lịch biểu"
        usecase UC4 as "Thống kê năng suất"
        usecase UC5 as "Đồng bộ/Lưu trữ dữ liệu"
        
        usecase UC2_1 as "Thêm/Sửa/Xóa"
        usecase UC2_2 as "Đánh dấu Hoàn thành"
        
        UC2 ..> UC2_1 : <<include>>
        UC2 ..> UC2_2 : <<include>>
        UC1 <.. UC5 : <<extend>>
    }

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
```

---

## 2. Biểu đồ Lớp (Class Diagram)
**Vị trí chèn:** Phần 2.4 trong tệp `sec2_phan_tich_thiet_ke.tex`

```mermaid
classDiagram
    class User {
        +String username
        +String email
        +loginUser()
    }

    class Task {
        +String id
        +String title
        +String priority
        +String status
        +Date date
        +String repeat
        +markAsComplete()
    }

    class TaskContext {
        -List~Task~ tasks
        -User currentUser
        +addTask(Task)
        +updateTask(Task)
        +deleteTask(String id)
        +toggleStatus(String id)
    }

    class LocalStorageDB {
        +saveData(key, data)
        +loadData(key)
    }

    TaskContext "1" *-- "many" Task : Quản lý mảng
    TaskContext "1" o-- "1" User : Lưu phiên
    TaskContext ..> LocalStorageDB : Ghi/Đọc dữ liệu
```

---

## 3. Biểu đồ Tuần tự (Sequence Diagram)
**Vị trí chèn:** Dưới phần Đặc tả Use Case (Phần 2.1.4) trong tệp `sec2_phan_tich_thiet_ke.tex` (Làm rõ luồng sinh công việc lặp lại)

```mermaid
sequenceDiagram
    actor U as Người dùng
    participant UI as Giao diện (Tasks Page)
    participant CTX as Logic (TaskContext)
    participant DB as Bộ nhớ (LocalStorage)

    U->>UI: Click đánh dấu Hoàn thành Task
    UI->>CTX: toggleTaskStatus(taskId)
    CTX->>CTX: Đổi trạng thái thành "Hoàn thành"
    
    opt Nếu Task có thuộc tính Lặp lại (Recurring)
        CTX->>CTX: Tính toán ngày tiếp theo (dateUtils)
        CTX->>CTX: Khởi tạo Đối tượng Task mới (Trạng thái: Chờ)
        CTX->>CTX: Chèn Task mới vào đầu danh sách
    end
    
    CTX->>DB: Lưu danh sách mới (JSON.stringify)
    DB-->>CTX: Trả về trạng thái lưu thành công
    CTX-->>UI: Kích hoạt render lại giao diện
    UI-->>U: Hiển thị Task cũ gạch ngang & Task mới xuất hiện
```

---

## 4. Biểu đồ Kiến trúc Hệ thống (Architecture Diagram)
**Vị trí chèn:** Phần 2.3 trong tệp `sec2_phan_tich_thiet_ke.tex`

```mermaid
graph TD
    %% TẦNG GIAO DIỆN (VIEW LAYER)
    subgraph ViewLayer ["Tầng Giao Diện (React UI Components)"]
        direction TB
        App[App.jsx - Router Điều Hướng]
        
        %% Màn hình
        subgraph Pages ["Các Màn Hình Chính (Pages)"]
            Login[LoginPage: Đăng nhập lần đầu]
            Dash[DashboardPage: Tổng quan trong ngày]
            Tasks[TasksPage: Lọc & Quản lý toàn bộ]
            Cal[CalendarPage: Lịch biểu tương lai]
            Stats[StatsPage: Phân tích hiệu suất]
        end

        %% Thành phần con
        subgraph Components ["Thành phần giao diện (UI Widgets)"]
            Nav[Sidebar & Header: Điều hướng & Thông tin User]
            Pomo[PomodoroTimer: Đồng hồ bấm giờ]
            CRUD[TaskForm & TaskList: Thêm/Sửa/Xóa Task]
            Export[Backup/Restore JSON]
        end

        App --> Login
        App --> Dash
        App --> Tasks
        App --> Cal
        App --> Stats

        Dash -.-> Nav & Pomo & CRUD
        Tasks -.-> Nav & CRUD & Export
        Cal -.-> Nav & CRUD
    end

    %% TẦNG STATE & LOGIC (CONTROLLER LAYER)
    subgraph StateLayer ["Tầng Trạng Thái & Logic Nghiệp Vụ (Context API & Utils)"]
        direction TB
        CTX((TaskContext<br/>Kho Dữ Liệu Trung Tâm))
        
        subgraph Logic ["Hàm Tiện Ích (dateUtils)"]
            Date[Kiểm tra Quá hạn]
            Recur[Tính ngày lặp lại]
        end
        
        subgraph Actions ["Các Hành Động (Actions)"]
            AuthAct[loginUser]
            TaskAct[addTask, updateTask, delete, toggle]
        end

        CTX --- Actions
        CTX --> Logic
    end

    %% TẦNG DỮ LIỆU (DATA LAYER)
    subgraph DataLayer ["Tầng Lưu Trữ (Local Storage API)"]
        direction LR
        DB_User[(task-manager-user)]
        DB_Tasks[(task-manager-tasks-v2)]
        DB_Theme[(task-manager-theme)]
    end

    %% LIÊN KẾT GIỮA CÁC TẦNG
    Login ==>|Gửi Tên & Email| AuthAct
    CRUD ==>|Gọi hàm Thêm/Hoàn thành| TaskAct
    Export ==>|Export / Import mảng Task| CTX

    AuthAct ==>|Lưu cấu hình| DB_User
    TaskAct ==>|Ghi đè danh sách mới| DB_Tasks
    
    DB_Tasks -.->|Khôi phục khi mở App| CTX
    CTX -.->|Truyền mảng tasks & user state| Pages
```
  mmmmmmmmmmmmmmmmmm