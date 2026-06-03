import React from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { formatViDate, isSameDay } from '../utils/dateUtils';
import StatsOverview from '../components/stats/StatsOverview';
import StatsCharts from '../components/stats/StatsCharts';
import Calendar from '../components/calendar/Calendar';
import TaskItem from '../components/tasks/TaskItem';

export default function DashboardPage({ onAddTask, onEditTask, setActivePage }) {
  const { tasks, selectedDate, setSelectedDate, CURRENT_DATE, setFilterStatus, user } = useTasks();
  
  const handleStatsClick = (status) => {
    if (setActivePage) {
      setFilterStatus(status);
      setActivePage('tasks');
    }
  };

  // Đặt lại ngày được chọn về hôm nay khi mở dashboard để xem "Công việc hôm nay"
  React.useEffect(() => {
    setSelectedDate(CURRENT_DATE);
  }, []);

  // Lấy các công việc của ngày được chọn (mặc định hôm nay)
  const todayTasks = tasks
    .filter(task => isSameDay(task.date, selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time)); // Sắp xếp theo thời gian tăng dần

  return (
    <>
      {/* 1. Header Trang */}
      <div className="page-header">
        <div className="page-header-info">
          <h2 className="page-title">Chào buổi sáng, {user ? user.username : 'bạn'}! 👋</h2>
          <p className="page-subtitle">Hôm nay là {formatViDate(CURRENT_DATE)}</p>
        </div>
        <button className="btn btn-primary" onClick={() => onAddTask()}>
          <Plus size={18} /> Thêm công việc
        </button>
      </div>

      {/* 2. Thống kê KPI Cards */}
      <StatsOverview onCardClick={handleStatsClick} />

      {/* 3. Bố cục hai cột chính */}
      <div className="dashboard-layout-grid">
        {/* Cột trái: Công việc trong ngày */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">
              <ListTodo size={20} className="text-primary" />
              Công việc ngày {selectedDate.split('-').reverse().join('/')}
            </h3>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => onAddTask()}>
              + Thêm mới
            </button>
          </div>

          <div className="task-items-list">
            {todayTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <ListTodo size={32} />
                </div>
                <h3>Tuyệt vời, không có công việc nào!</h3>
                <p>Bạn đã hoàn thành mọi mục tiêu đề ra hoặc chưa tạo lịch trình.</p>
              </div>
            ) : (
              todayTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onEdit={onEditTask}
                />
              ))
            )}
          </div>

          {tasks.length > 0 && (
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() => setActivePage('tasks')}
            >
              Xem tất cả công việc
            </button>
          )}
        </div>

        {/* Cột phải: Lịch */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">📅 Lịch biểu</h3>
          </div>
          <Calendar />
        </div>
      </div>

      {/* 4. Phần Biểu Đồ Thống Kê */}
      <StatsCharts />
    </>
  );
}
