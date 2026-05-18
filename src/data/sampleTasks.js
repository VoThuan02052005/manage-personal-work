// Dữ liệu công việc mẫu (Sample Tasks)
// Được định nghĩa động dựa trên ngày hiện tại để demo trực quan nhất

const getRelativeDate = (offsetDays) => {
  const date = new Date("2026-05-18"); // Lấy mốc thời gian hiện tại của hệ thống từ metadata
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
};

export const sampleTasks = [
  {
    id: "task-1",
    title: "Học Flask",
    description: "Học cách tạo API đơn giản với Python Flask và kết nối cơ sở dữ liệu.",
    date: getRelativeDate(0), // Hôm nay
    time: "09:00",
    priority: "Cao", // Cao, Trung bình, Thấp
    status: "Đang thực hiện", // Chờ, Đang thực hiện, Hoàn thành, Quá hạn
    createdAt: new Date().toISOString()
  },
  {
    id: "task-2",
    title: "Làm bài tập JavaScript",
    description: "Hoàn thành bài tập về Promise, Async/Await và DOM Manipulation.",
    date: getRelativeDate(0), // Hôm nay
    time: "11:00",
    priority: "Trung bình",
    status: "Chờ",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-3",
    title: "Đọc sách Clean Code",
    description: "Đọc chương 3 về Functions và ghi chú lại các quy tắc quan trọng.",
    date: getRelativeDate(0), // Hôm nay
    time: "14:00",
    priority: "Thấp",
    status: "Hoàn thành",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-4",
    title: "Tập thể dục",
    description: "Chạy bộ 30 phút công viên và giãn cơ.",
    date: getRelativeDate(0), // Hôm nay
    time: "18:00",
    priority: "Thấp",
    status: "Hoàn thành",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-5",
    title: "Ôn tập kiến thức SQL",
    description: "Thực hành các câu lệnh JOIN nâng cao và Subquery trên LeetCode.",
    date: getRelativeDate(0), // Hôm nay
    time: "20:00",
    priority: "Cao",
    status: "Chờ",
    createdAt: new Date().toISOString()
  },
  // Ngày hôm qua (Quá hạn)
  {
    id: "task-6",
    title: "Sửa lỗi CSS trang Dashboard",
    description: "Sửa lỗi hiển thị trên màn hình nhỏ và căn chỉnh các card thống kê.",
    date: getRelativeDate(-1), // Hôm qua
    time: "10:00",
    priority: "Cao",
    status: "Quá hạn",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-7",
    title: "Gửi báo cáo tuần cho sếp",
    description: "Tổng hợp tiến độ dự án cá nhân và gửi qua email công ty.",
    date: getRelativeDate(-1), // Hôm qua
    time: "17:00",
    priority: "Trung bình",
    status: "Quá hạn",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-8",
    title: "Xem lại thiết kế Figma",
    description: "Xem lại giao diện trang quản lý công việc để chuẩn bị code React.",
    date: getRelativeDate(-1), // Hôm qua
    time: "15:00",
    priority: "Trung bình",
    status: "Hoàn thành",
    createdAt: new Date().toISOString()
  },
  // Ngày mai
  {
    id: "task-9",
    title: "Học React Context & State Hooks",
    description: "Tìm hiểu sâu hơn về quản lý state toàn cục không cần Redux.",
    date: getRelativeDate(1), // Ngày mai
    time: "08:30",
    priority: "Cao",
    status: "Chờ",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-10",
    title: "Đi siêu thị mua đồ ăn",
    description: "Mua thực phẩm cho cả tuần, tập trung vào rau củ quả và ức gà.",
    date: getRelativeDate(1), // Ngày mai
    time: "16:00",
    priority: "Thấp",
    status: "Chờ",
    createdAt: new Date().toISOString()
  },
  // Các ngày khác trong tháng để hiển thị lịch phong phú
  {
    id: "task-11",
    title: "Review code dự án nhóm",
    description: "Hỗ trợ các thành viên khác tối ưu hóa mã nguồn Frontend.",
    date: getRelativeDate(3),
    time: "14:00",
    priority: "Cao",
    status: "Chờ",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-12",
    title: "Họp Kick-off dự án mới",
    description: "Họp triển khai dự án Quản lý chi tiêu với các đối tác.",
    date: getRelativeDate(5),
    time: "09:00",
    priority: "Cao",
    status: "Chờ",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-13",
    title: "Cắt tóc",
    description: "Đặt lịch tiệm tóc lúc 5h chiều.",
    date: getRelativeDate(7),
    time: "17:00",
    priority: "Thấp",
    status: "Chờ",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-14",
    title: "Mua quà sinh nhật cho mẹ",
    description: "Lựa chọn một món quà ý nghĩa tặng sinh nhật mẹ vào cuối tuần sau.",
    date: getRelativeDate(10),
    time: "19:00",
    priority: "Cao",
    status: "Chờ",
    createdAt: new Date().toISOString()
  }
];
