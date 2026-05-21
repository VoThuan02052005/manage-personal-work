import React, { useState, useEffect, useRef } from 'react';

// Khởi tạo dữ liệu mẫu nếu LocalStorage trống
const INITIAL_TASKS = [
  { id: 'task-1', title: 'Thiết kế giao diện UI/UX Premium', priority: 'cao', status: 'progress', time: '09:00', date: '2026-05-22' },
  { id: 'task-2', title: 'Refactor cấu hình ESLint Flat Config', priority: 'trungbinh', status: 'done', time: '14:30', date: '2026-05-22' },
  { id: 'task-3', title: 'Tích hợp logic Kéo thả & Pomodoro Widget', priority: 'cao', status: 'cho', time: '16:00', date: '2026-05-23' },
];

export default function App() {
  // ==========================================================================
  // 1. CÁC TRẠNG THÁI (STATES) CỦA ỨNG DỤNG
  // ==========================================================================
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lumina_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lumina_theme') || 'light';
  });

  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'tasks' | 'settings'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Trạng thái Form thêm Task mới
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'trungbinh', date: '2026-05-22', time: '08:00' });

  // Trạng thái Pomodoro Timer
  const [pomoMode, setPomoMode] = useState('focus'); // 'focus' | 'break'
  const [pomoTime, setPomoTime] = useState(25 * 60); // 25 phút tính bằng giây
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [isPomoMaximized, setIsPomoMaximized] = useState(false);
  const [selectedTaskForPomo, setSelectedTaskForPomo] = useState('');

  const timerRef = useRef(null);

  // ==========================================================================
  // 2. HIỆU ỨNG ĐỒNG BỘ (EFFECTS)
  // ==========================================================================
  // Đồng bộ Theme (Dark / Light Mode) vào thẻ HTML bao bọc bên ngoài
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lumina_theme', theme);
  }, [theme]);

  // Đồng bộ danh sách công việc vào LocalStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('lumina_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Vận hành lõi đồng hồ Pomodoro bằng setInterval
  useEffect(() => {
    if (isPomoRunning) {
      timerRef.current = setInterval(() => {
        setPomoTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsPomoRunning(false);
            // Phát âm thanh báo hiệu hệ thống khi hết giờ
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
            audio.play().catch(() => {});
            
            // Tự động chuyển đổi chế độ làm việc / nghỉ ngơi
            if (pomoMode === 'focus') {
              alert('Chúc mừng bạn đã hoàn thành một phiên làm việc tập trung! Hãy nghỉ ngơi chút nào.');
              setPomoMode('break');
              return 5 * 60; // 5 phút nghỉ ngơi
            } else {
              alert('Hết thời gian xả hơi rồi! Quay lại tập trung làm việc thôi.');
              setPomoMode('focus');
              return 25 * 60; // 25 phút tập trung mới
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPomoRunning, pomoMode]);

  // ==========================================================================
  // 3. LOGIC XỬ LÝ HÀNH ĐỘNG (HANDLERS)
  // ==========================================================================
  // Thêm mới một Task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const taskCreated = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      priority: newTask.priority,
      status: 'cho',
      time: newTask.time,
      date: newTask.date
    };

    setTasks([taskCreated, ...tasks]);
    setNewTask({ title: '', priority: 'trungbinh', date: '2026-05-22', time: '08:00' });
    setShowModal(false);
  };

  // Đổi trạng thái hoàn thành nhanh (Checkbox click)
  const toggleTaskComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'cho' : 'done' } : t));
  };

  // Xóa Task
  const handleDeleteTask = (id) => {
    if(confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  // Định dạng thời gian hiển thị giây thành mm:ss (ví dụ: 1500 giây -> 25:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // ==========================================================================
  // 4. LOGIC KÉO THẢ (DRAG & DROP HTML5)
  // ==========================================================================
  const [draggingId, setDraggingId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (!draggingId) return;
    
    // Cập nhật lại cột trạng thái mới cho phần tử bị kéo thả vào ô
    setTasks(tasks.map(t => t.id === draggingId ? { ...t, status: targetStatus } : t));
    setDraggingId(null);
  };

  // Lọc tìm kiếm công việc theo thanh Header Search
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Tính toán nhanh số liệu KPI hiển thị lên màn hình chính
  const kpiTotal = tasks.length;
  const kpiCompleted = tasks.filter(t => t.status === 'done').length;
  const kpiActive = tasks.filter(t => t.status === 'progress' || t.status === 'cho').length;
  const kpiOverdue = tasks.filter(t => t.status === 'overdue').length;

  return (
    <div className="app-container">
      
      {/* ====================================================================
          HỢP PHẦN 1: SIDEBAR (THANH ĐIỀU HƯỚNG BÊN TRÁI)
          ==================================================================== */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">⚡</div>
          <h2 className="brand-name">LuminaTask</h2>
        </div>
        
        <ul className="menu-list">
          <li>
            <button className={`menu-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
              📊 <span>Bảng điều khiển</span>
            </button>
          </li>
          <li>
            <button className={`menu-item ${currentPage === 'tasks' ? 'active' : ''}`} onClick={() => setCurrentPage('tasks')}>
              📝 <span>Danh sách nhiệm vụ</span>
            </button>
          </li>
          <li>
            <button className={`menu-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => setCurrentPage('settings')}>
              ⚙️ <span>Cài đặt hệ thống</span>
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <p className="sidebar-footer-title">Năng suất tối ưu</p>
          <p className="sidebar-footer-text">Ứng dụng đã được tối ưu hóa cấu trúc Premium mượt mà.</p>
        </div>
      </aside>

      {/* KHỐI GIAO DIỆN NỘI DUNG PHẢI (HEADER + MAIN CONTENT) */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* ====================================================================
            HỢP PHẦN 2: HEADER (THANH TIÊU ĐỀ TRÊN CÙNG)
            ==================================================================== */}
        <header className="header">
          <div className="header-search">
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm nhanh nhiệm vụ của bạn..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="icon-btn" onClick={() => setShowModal(true)}>
              ➕ <div className="badge-dot"></div>
            </button>
            
            <div className="profile">
              <div className="avatar-wrapper">
                <div className="avatar">A</div>
                <div className="status-dot"></div>
              </div>
              <div className="profile-info">
                <span className="profile-name">Developer Peer</span>
                <span className="profile-status">Trực tuyến</span>
              </div>
            </div>
          </div>
        </header>

        {/* ====================================================================
            HỢP PHẦN 3: DIỄN GIẢI TRANG HIỂN THỊ CHÍNH (MAIN PAGES)
            ==================================================================== */}
        <main className="main-content">
          
          {/* TRANG 1: DASHBOARD (BẢNG ĐIỀU KHIỂN CHÍNH) */}
          {currentPage === 'dashboard' && (
            <>
              <div className="page-header">
                <div className="page-header-info">
                  <h1 className="page-title">Chào ngày mới!</h1>
                  <p className="page-subtitle">Dưới đây là tổng quan hiệu suất phân tích lịch trình của bạn.</p>
                </div>
              </div>

              {/* Grid 4 thẻ KPIs */}
              <div className="dashboard-grid">
                <div className="kpi-card kpi-total">
                  <div className="kpi-icon-box">📊</div>
                  <div className="kpi-info">
                    <span className="kpi-title">Tổng nhiệm vụ</span>
                    <span className="kpi-value">{kpiTotal}</span>
                  </div>
                </div>
                <div className="kpi-card kpi-completed">
                  <div className="kpi-icon-box">✅</div>
                  <div className="kpi-info">
                    <span className="kpi-title">Đã hoàn thành</span>
                    <span className="kpi-value">{kpiCompleted}</span>
                  </div>
                </div>
                <div className="kpi-card kpi-active">
                  <div className="kpi-icon-box">⏳</div>
                  <div className="kpi-info">
                    <span className="kpi-title">Đang thực hiện</span>
                    <span className="kpi-value">{kpiActive}</span>
                  </div>
                </div>
                <div className="kpi-card kpi-overdue">
                  <div className="kpi-icon-box">🚨</div>
                  <div className="kpi-info">
                    <span className="kpi-title">Quá hạn chặng</span>
                    <span className="kpi-value">{kpiOverdue}</span>
                  </div>
                </div>
              </div>

              {/* Bố cục chia hai cột: Danh sách kéo thả & Ô lịch lịch trình */}
              <div className="dashboard-layout-grid">
                <div className="section-card">
                  <div className="section-card-header">
                    <h3 className="section-card-title">⚡ Tiến độ thực hiện (Hỗ trợ Kéo thả)</h3>
                  </div>
                  
                  {/* Chia 3 cột trạng thái Kanban nhỏ để kéo thả trực quan */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    
                    {/* Cột 1: Chờ xử lý */}
                    <div 
                      style={{ background: 'var(--bg-app)', padding: '15px', borderRadius: 'var(--radius-md)' }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'cho')}
                    >
                      <h4 style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>📥 CHỜ LÀM</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {filteredTasks.filter(t => t.status === 'cho').map(task => (
                          <div 
                            key={task.id} className="task-item-card" draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                          >
                            <span className="task-title" style={{ fontSize: '13px' }}>{task.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cột 2: Đang làm */}
                    <div 
                      style={{ background: 'var(--bg-app)', padding: '15px', borderRadius: 'var(--radius-md)' }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'progress')}
                    >
                      <h4 style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--warning)' }}>⚡ ĐANG LÀM</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {filteredTasks.filter(t => t.status === 'progress').map(task => (
                          <div 
                            key={task.id} className="task-item-card" draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                          >
                            <span className="task-title" style={{ fontSize: '13px' }}>{task.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cột 3: Hoàn thành */}
                    <div 
                      style={{ background: 'var(--bg-app)', padding: '15px', borderRadius: 'var(--radius-md)' }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'done')}
                    >
                      <h4 style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--success)' }}>🎉 HOÀN THÀNH</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {filteredTasks.filter(t => t.status === 'done').map(task => (
                          <div 
                            key={task.id} className="task-item-card completed" draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                          >
                            <span className="task-title" style={{ fontSize: '13px' }}>{task.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Cột phải: Lịch biểu thu nhỏ mini */}
                <div className="section-card">
                  <h3 className="section-card-title">📅 Ô lịch tiến độ</h3>
                  <div className="calendar-container">
                    <div className="calendar-grid">
                      <div className="calendar-weekday">T2</div><div className="calendar-weekday">T3</div>
                      <div className="calendar-weekday">T4</div><div className="calendar-weekday">T5</div>
                      <div className="calendar-weekday">T6</div><div className="calendar-weekday">T7</div>
                      <div className="calendar-weekday">CN</div>
                      
                      {/* Thử nghiệm render nhanh các ngày biểu trưng tháng 5 */}
                      {[...Array(28)].map((_, i) => (
                        <div key={i} className={`calendar-day-cell ${(i+1) === 22 ? 'today selected' : ''}`}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TRANG 2: TASKS MANAGEMENT (QUẢN LÝ DANH SÁCH CHI TIẾT) */}
          {currentPage === 'tasks' && (
            <div className="section-card">
              <div className="page-header">
                <h2 className="page-title">Danh sách nhiệm vụ chi tiết</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Thêm nhiệm vụ</button>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <h3>Hộp công việc trống</h3>
                  <p>Hãy thêm công việc mới hoặc thử tìm kiếm một từ khóa khác.</p>
                </div>
              ) : (
                <div className="task-items-list">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className={`task-item-card ${task.status === 'done' ? 'completed' : ''}`}>
                      <div className="task-item-left">
                        <div 
                          className={`checkbox-round ${task.status === 'done' ? 'checked' : ''}`}
                          onClick={() => toggleTaskComplete(task.id)}
                        >
                          {task.status === 'done' && '✓'}
                        </div>
                        <div className="task-text">
                          <span className="task-title">{task.title}</span>
                          <div className="task-info-row">
                            <span className="task-time">📅 {task.date} ({task.time})</span>
                            <span className={`badge badge-priority-${task.priority}`}>
                              Tầm quan trọng: {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="task-item-right">
                        <div className="task-actions">
                          <button className="action-btn action-btn-delete" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TRANG 3: SETTINGS (CẤU HÌNH CÀI ĐẶT) */}
          {currentPage === 'settings' && (
            <div className="section-card">
              <h2 className="page-title">Cài đặt cấu hình</h2>
              <div className="settings-list">
                <div className="setting-row">
                  <div className="setting-info">
                    <span className="setting-name">Giao diện tối (Dark Mode)</span>
                    <span className="setting-desc">Tối ưu hóa dịu mắt ban đêm và tiết kiệm điện năng cho thiết bị.</span>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={theme === 'dark'} onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <span className="setting-name">Thông báo hệ thống</span>
                    <span className="setting-desc">Phát âm thanh cảnh báo trực tiếp khi kết thúc chu trình Pomodoro.</span>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ====================================================================
          HỢP PHẦN 4: WIDGET ĐỒNG HỒ POMODORO THÔNG MINH NỔI (FLOATING WIDGET)
          ==================================================================== */}
      {!isPomoMaximized ? (
        <button className="pomodoro-float-trigger" onClick={() => setIsPomoMaximized(true)}>
          ⏱️
          {isPomoRunning && <div className="pomodoro-badge"></div>}
        </button>
      ) : (
        <div className={`pomodoro-widget-card ${!isPomoMaximized ? 'minimized' : ''}`}>
          <div className="pomodoro-header">
            <span>⏱️ Trạm năng suất Pomodoro</span>
            <button className="widget-icon-btn" onClick={() => setIsPomoMaximized(false)}>➖</button>
          </div>
          
          <div className="pomodoro-body">
            <div className="pomodoro-tabs">
              <button className={`pomodoro-tab-btn ${pomoMode === 'focus' ? 'active' : ''}`} onClick={() => { setIsPomoRunning(false); setPomoMode('focus'); setPomoTime(25*60); }}>Tập trung (25m)</button>
              <button className={`pomodoro-tab-btn ${pomoMode === 'break' ? 'active' : ''}`} onClick={() => { setIsPomoRunning(false); setPomoMode('break'); setPomoTime(5*60); }}>Nghỉ ngơi (5m)</button>
            </div>

            <div className={`pomodoro-display ${pomoMode === 'focus' ? 'focus-mode' : 'break-mode'} ${isPomoRunning ? 'spin-animation' : ''}`}>
              {formatTime(pomoTime)}
            </div>

            <div className="form-group">
              <label className="form-label">Gắn thẻ nhiệm vụ đang làm:</label>
              <select className="form-select" value={selectedTaskForPomo} onChange={(e) => setSelectedTaskForPomo(e.target.value)}>
                <option value="">Chọn một công việc hiện có...</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div className="pomodoro-controls">
              <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => setIsPomoRunning(!isPomoRunning)}>
                {isPomoRunning ? '⏸ Tạm dừng' : '▶ Bắt đầu'}
              </button>
              <button className="btn btn-secondary" onClick={() => { setIsPomoRunning(false); setPomoTime(pomoMode === 'focus' ? 25*60 : 5*60); }}>
                🔄 Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          HỢP PHẦN 5: MODAL DIALOG HỘP THOẠI THÊM CÔNG VIỆC MỚI
          ==================================================================== */}
      {showModal && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleAddTask}>
            <div className="modal-header">
              <h3 className="modal-title">Thêm nhiệm vụ mới</h3>
              <button type="button" className="close-btn" onClick={() => setShowModal(false)} style={{ fontSize: '20px' }}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Tên nhiệm vụ cần thực hiện</label>
              <input 
                type="text" className="form-input" required placeholder="Ví dụ: Hoàn tất mã nguồn lõi..."
                value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hạn ngày</label>
                <input type="date" className="form-input" value={newTask.date} onChange={(e) => setNewTask({...newTask, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Giờ mốc</label>
                <input type="time" className="form-input" value={newTask.time} onChange={(e) => setNewTask({...newTask, time: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mức độ ưu tiên kiểm soát</label>
              <div className="priority-selector">
                <input type="radio" id="p-cao" name="priority" className="priority-radio-input" checked={newTask.priority === 'cao'} onChange={() => setNewTask({...newTask, priority: 'cao'})} />
                <label htmlFor="p-cao" className="priority-radio-label priority-radio-label-cao">🔴 Cao</label>

                <input type="radio" id="p-trungbinh" name="priority" className="priority-radio-input" checked={newTask.priority === 'trungbinh'} onChange={() => setNewTask({...newTask, priority: 'trungbinh'})} />
                <label htmlFor="p-trungbinh" className="priority-radio-label priority-radio-label-trungbinh">🟡 Vừa</label>

                <input type="radio" id="p-thap" name="priority" className="priority-radio-input" checked={newTask.priority === 'thap'} onChange={() => setNewTask({...newTask, priority: 'thap'})} />
                <label htmlFor="p-thap" className="priority-radio-label priority-radio-label-thap">🟢 Thấp</label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy bỏ</button>
              <button type="submit" className="btn btn-primary">Xác nhận tạo</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
