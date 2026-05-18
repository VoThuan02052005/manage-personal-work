import React, { useState, useEffect, useRef } from 'react';
import { Settings, Shield, Bell, Moon, Languages, RotateCcw, AlertTriangle, Download, Upload, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { sampleTasks } from '../data/sampleTasks';

export default function SettingsPage() {
  const { exportTasksData, importTasksData } = useTasks();
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null); // null, 'success', 'error'

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('task-manager-theme') || 'light';
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('task-manager-notifications');
    return saved === 'true';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('task-manager-lang') || 'vi';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('task-manager-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleToggleNotifications = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    localStorage.setItem('task-manager-notifications', String(newVal));
    
    if (newVal && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem('task-manager-lang', lang);
  };

  // Reset dữ liệu về trạng thái mẫu ban đầu
  const handleResetData = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại dữ liệu ứng dụng về trạng thái mẫu ban đầu không? Mọi thay đổi của bạn sẽ bị xóa.")) {
      localStorage.setItem('task-manager-tasks', JSON.stringify(sampleTasks));
      window.location.reload();
    }
  };

  // Xử lý khi chọn file để Import
  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importTasksData(event.target.result);
      if (result) {
        setImportStatus('success');
        setTimeout(() => {
          setImportStatus(null);
          window.location.reload(); // Tải lại để cập nhật toàn bộ trạng thái
        }, 1500);
      } else {
        setImportStatus('error');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-info">
          <h2 className="page-title">Cài đặt hệ thống ⚙️</h2>
          <p className="page-subtitle">Tùy biến cấu hình và quản lý dữ liệu cá nhân</p>
        </div>
      </div>

      <div className="section-card" style={{ maxWidth: '800px' }}>
        <div className="settings-list">
          
          {/* 1. Chế độ tối (Dark Mode) */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Moon size={16} className="text-primary" />
                Giao diện tối (Dark Mode)
              </span>
              <span className="setting-desc">Chuyển đổi giao diện sáng hoặc tối bảo vệ mắt ban đêm.</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
              <span className="slider"></span>
            </label>
          </div>

          {/* 2. Thông báo nhắc nhở */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} className="text-primary" />
                Thông báo đẩy (Push Notifications)
              </span>
              <span className="setting-desc">Nhận thông báo nhắc nhở trước khi công việc bắt đầu.</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notifications} onChange={handleToggleNotifications} />
              <span className="slider"></span>
            </label>
          </div>

          {/* 3. Lựa chọn ngôn ngữ */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Languages size={16} className="text-primary" />
                Ngôn ngữ hệ thống
              </span>
              <span className="setting-desc">Lựa chọn ngôn ngữ hiển thị trên ứng dụng.</span>
            </div>
            <select 
              className="form-select" 
              style={{ width: '150px', padding: '8px 12px', borderRadius: '10px' }}
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English (Coming)</option>
            </select>
          </div>

          {/* 4. Sao lưu & phục hồi dữ liệu */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} className="text-primary" />
                Sao lưu & Khôi phục dữ liệu
              </span>
              <span className="setting-desc">Xuất dữ liệu công việc ra file JSON hoặc nhập từ file sao lưu có sẵn.</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Nút Xuất Backup */}
              <button className="btn btn-secondary" onClick={exportTasksData} title="Tải file backup .json">
                <Download size={15} /> Xuất JSON
              </button>

              {/* Nút Nhập Backup */}
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".json"
                onChange={handleImportFileChange}
              />
              <button className="btn btn-secondary" onClick={triggerFileInput} title="Chọn file backup để phục hồi">
                <Upload size={15} /> Nhập JSON
              </button>

              {/* Trạng thái import */}
              {importStatus === 'success' && (
                <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                  <CheckCircle2 size={14} /> Thành công!
                </span>
              )}
              {importStatus === 'error' && (
                <span style={{ color: 'var(--danger)', fontSize: '12px', fontWeight: '600' }}>
                  ❌ Lỗi định dạng JSON!
                </span>
              )}
            </div>
          </div>

          {/* 5. Quản lý dữ liệu (Khôi phục / Xóa) */}
          <div className="setting-row" style={{ borderBottom: 'none' }}>
            <div className="setting-info">
              <span className="setting-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
                <AlertTriangle size={16} />
                Vùng nguy hiểm (Khôi phục dữ liệu)
              </span>
              <span className="setting-desc">Khôi phục ứng dụng về dữ liệu mẫu ban đầu. Hành động này không thể hoàn tác.</span>
            </div>
            <button className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }} onClick={handleResetData}>
              <RotateCcw size={16} /> Đặt lại dữ liệu
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
