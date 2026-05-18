import React from 'react';
import { Calendar as CalendarIcon, ListTodo, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { isSameDay } from '../utils/dateUtils';
import Calendar from '../components/calendar/Calendar';
import TaskItem from '../components/tasks/TaskItem';

export default function CalendarPage({ onAddTask, onEditTask }) {
  const { tasks, selectedDate } = useTasks();

  const dayTasks = tasks
    .filter(task => isSameDay(task.date, selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <>
      <div className="page-header">
        <div className="page-header-info">
          <h2 className="page-title">Lịch biểu chi tiết 🗓️</h2>
          <p className="page-subtitle">Quản lý lịch trình trực quan theo ngày/tháng</p>
        </div>
      </div>

      <div className="dashboard-layout-grid">
        {/* Lịch bên trái */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">
              <CalendarIcon size={20} className="text-primary" />
              Chọn ngày xem lịch trình
            </h3>
          </div>
          <Calendar />
        </div>

        {/* Danh sách công việc bên phải */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">
              <ListTodo size={20} className="text-primary" />
              Chi tiết ngày {selectedDate.split('-').reverse().join('/')}
            </h3>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => onAddTask()}>
              <Plus size={14} /> Thêm việc
            </button>
          </div>

          <div className="task-items-list" style={{ maxHeight: '430px' }}>
            {dayTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <ListTodo size={28} />
                </div>
                <h4>Không có công việc nào trong ngày này</h4>
                <p>Hãy thêm công việc mới hoặc chọn ngày khác trên lịch.</p>
              </div>
            ) : (
              dayTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onEdit={onEditTask}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
