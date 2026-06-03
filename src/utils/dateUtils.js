// Các hàm tiện ích xử lý ngày tháng (Date Utilities)

export const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
export const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

// Định dạng ngày hiển thị (VD: Thứ Ba, 18/05/2026)
export const formatViDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dayName = days[date.getDay()];
  
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dayName}, ${dd}/${mm}/${yyyy}`;
};

// So sánh 2 ngày có trùng nhau không (chỉ so sánh YYYY-MM-DD)
export const isSameDay = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return false;
  return dateStr1.split('T')[0] === dateStr2.split('T')[0];
};

// Kiểm tra ngày có trước hôm nay không (quá hạn)
export const isBeforeToday = (dateStr, todayStr) => {
  if (!todayStr) {
    const d = new Date();
    todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  if (!dateStr) return false;
  const d1 = new Date(dateStr.split('T')[0]);
  const d2 = new Date(todayStr);
  return d1 < d2;
};

// Tạo danh sách các ngày để hiển thị lưới lịch tháng (7x6 = 42 ô)
export const getCalendarMonthDays = (year, month) => {
  // month là 0-indexed (0 = Tháng 1, 4 = Tháng 5)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  
  // Lấy ngày trong tuần của ngày đầu tiên (0 = Chủ nhật, 1 = Thứ hai...)
  // Chuyển đổi sang chuẩn T2 = 0, T3 = 1... CN = 6
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6; // Chủ Nhật thành 6

  const calendarDays = [];

  // Thêm các ngày cuối của tháng trước để lấp đầy hàng đầu tiên
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    calendarDays.push({
      day: d,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      dateString: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }

  // Thêm các ngày của tháng hiện tại
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      month: month,
      year: year,
      isCurrentMonth: true,
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }

  // Thêm các ngày đầu của tháng sau để đủ lưới 42 ô (6 hàng x 7 ngày)
  const remainingCells = 42 - calendarDays.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    calendarDays.push({
      day: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      dateString: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }

  return calendarDays;
};

// Tính ngày tiếp theo cho công việc lặp lại
export const getNextOccurrenceDate = (dateString, repeatType) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  switch (repeatType) {
    case "Hàng ngày":
      date.setDate(date.getDate() + 1);
      break;
    case "Hàng tuần":
      date.setDate(date.getDate() + 7);
      break;
    case "Hàng tháng":
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      return dateString;
  }

  return date.toISOString().split('T')[0];
};

