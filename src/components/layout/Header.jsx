import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function Header() {
  const { searchQuery, setSearchQuery, stats, user } = useTasks();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('task-manager-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('task-manager-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} className="text-muted" />
        <input 
          type="text" 
          placeholder="Tìm kiếm công việc..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-actions">
        {/* Nút chuyển đổi Dark Mode */}
        <button className="icon-btn" onClick={toggleTheme} title="Chuyển chế độ sáng/tối">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Chuông thông báo công việc quá hạn */}
        <button className="icon-btn" title="Thông báo">
          <Bell size={18} />
          {stats.overdue > 0 && <span className="badge-dot"></span>}
        </button>

        {/* Profile người dùng */}
        <div className="profile">
          <div className="avatar-wrapper">
            <div className="avatar">{user ? user.username.charAt(0).toUpperCase() : 'U'}</div>
            <span className="status-dot"></span>
          </div>
          <div className="profile-info">
            <span className="profile-name">{user ? user.username : 'User'}</span>
            <span className="profile-status">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
