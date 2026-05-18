import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Settings, 
  Clock 
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Công việc', icon: CheckSquare },
    { id: 'calendar', label: 'Lịch', icon: CalendarIcon },
    { id: 'stats', label: 'Thống kê', icon: BarChart2 },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Clock size={22} />
        </div>
        <span className="brand-name">Task Manager</span>
      </div>

      <nav>
        <ul className="menu-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  className={`menu-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <IconComponent size={20} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-footer-title">⚡ Hiệu quả & Khoa học</span>
        <span className="sidebar-footer-text">
          "Quản lý công việc thông minh nâng cao năng suất mỗi ngày!"
        </span>
      </div>
    </aside>
  );
}
