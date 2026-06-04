import React, { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import TaskFormModal from './components/tasks/TaskFormModal';
import PomodoroTimer from './components/common/PomodoroTimer';
import LoginPage from './pages/LoginPage';
import { useTasks } from './context/TaskContext';

function AppContent() {
  const { user } = useTasks();
  const [activePage, setActivePage] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);

  // Mở modal thêm công việc mới
  const handleAddTask = () => {
    setEditTaskData(null);
    setIsModalOpen(true);
  };

  // Mở modal sửa công việc hiện có
  const handleEditTask = (task) => {
    setEditTaskData(task);
    setIsModalOpen(true);
  };

  // Điều hướng hiển thị trang
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage 
            onAddTask={handleAddTask} 
            onEditTask={handleEditTask} 
            setActivePage={setActivePage} 
          />
        );
      case 'tasks':
        return (
          <TasksPage 
            onAddTask={handleAddTask} 
            onEditTask={handleEditTask} 
          />
        );
      case 'calendar':
        return (
          <CalendarPage 
            onAddTask={handleAddTask} 
            onEditTask={handleEditTask} 
          />
        );
      case 'stats':
        return <StatsPage setActivePage={setActivePage} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage 
            onAddTask={handleAddTask} 
            onEditTask={handleEditTask} 
            setActivePage={setActivePage} 
          />
        );
    }
  };

  if (!user) {
    return <LoginPage />;
  }

  // Admin được chuyển thẳng đến trang quản trị
  if (user.role === 'admin') {
    return <AdminPage />;
  }

  return (
    <div className="app-container">
      {/* Sidebar bên trái */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Phần bên phải bao gồm Header và Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Header />
        
        <main className="main-content">
          {renderActivePage()}
        </main>
      </div>

      {/* Modal tạo/sửa công việc toàn cục */}
      <TaskFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editTaskData={editTaskData}
      />

      {/* Tiện ích nổi Pomodoro Timer */}
      <PomodoroTimer />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
