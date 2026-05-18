import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { getCalendarMonthDays, DAYS_OF_WEEK, MONTHS, isSameDay } from '../../utils/dateUtils';

export default function Calendar() {
  const { tasks, selectedDate, setSelectedDate, CURRENT_DATE } = useTasks();
  
  // Trạng thái tháng/năm đang xem trên lịch
  const [currentYear, setCurrentYear] = useState(() => new Date(CURRENT_DATE).getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date(CURRENT_DATE).getMonth()); // 0-indexed

  // Chuyển tháng
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    const today = new Date(CURRENT_DATE);
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(CURRENT_DATE);
  };

  // Lấy các ngày hiển thị trong lưới lịch
  const calendarDays = getCalendarMonthDays(currentYear, currentMonth);

  // Tìm các chấm ưu tiên cho một ngày cụ thể
  const getDayDots = (dateString) => {
    const dayTasks = tasks.filter(t => isSameDay(t.date, dateString));
    
    // Gom nhóm xem ngày đó có những mức độ ưu tiên nào
    const priorities = new Set();
    dayTasks.forEach(t => {
      if (t.status !== 'Hoàn thành') {
        priorities.add(t.priority);
      }
    });

    return Array.from(priorities);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <span className="calendar-month-year">
          {MONTHS[currentMonth]}, {currentYear}
        </span>
        
        <div className="calendar-nav">
          <button className="icon-btn" onClick={handlePrevMonth} title="Tháng trước">
            <ChevronLeft size={16} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleGoToToday}>
            Hôm nay
          </button>
          <button className="icon-btn" onClick={handleNextMonth} title="Tháng sau">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Tên các ngày trong tuần (T2, T3...) */}
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {/* Các ô ngày trong tháng */}
        {calendarDays.map((cell, index) => {
          const isSelected = isSameDay(cell.dateString, selectedDate);
          const isToday = isSameDay(cell.dateString, CURRENT_DATE);
          const dots = getDayDots(cell.dateString);

          return (
            <div
              key={index}
              className={`calendar-day-cell 
                ${!cell.isCurrentMonth ? 'inactive' : ''} 
                ${isToday ? 'today' : ''} 
                ${isSelected ? 'selected' : ''}
              `}
              onClick={() => setSelectedDate(cell.dateString)}
            >
              <span>{cell.day}</span>
              
              {/* Chấm tròn biểu thị mức độ ưu tiên dưới số ngày */}
              {dots.length > 0 && (
                <div className="calendar-dots">
                  {dots.map(p => (
                    <span 
                      key={p} 
                      className={`dot dot-${p.toLowerCase().replace(' ', '')}`}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
