import React from 'react';
import { Plus, Filter, Search, ListTodo } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/tasks/TaskItem';

export default function TasksPage({ onAddTask, onEditTask }) {
  const { 
    tasks, 
    searchQuery, 
    filterPriority, 
    setFilterPriority, 
    filterStatus, 
    setFilterStatus 
  } = useTasks();

  // Áp dụng bộ lọc tìm kiếm, độ ưu tiên, trạng thái
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = filterPriority === "Tất cả" || task.priority === filterPriority;
    
    const matchesStatus = filterStatus === "Tất cả" || task.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <>
      {/* Header trang */}
      <div className="page-header">
        <div className="page-header-info">
          <h2 className="page-title">Danh sách công việc 📝</h2>
          <p className="page-subtitle">Quản lý và cập nhật tiến độ công việc cá nhân</p>
        </div>
        <button className="btn btn-primary" onClick={() => onAddTask()}>
          <Plus size={18} /> Thêm công việc
        </button>
      </div>

      {/* Thanh bộ lọc (Filters Panel) */}
      <div className="section-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700' }}>
            <Filter size={18} />
            <span>Bộ lọc:</span>
          </div>

          {/* Lọc theo mức độ ưu tiên */}
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', margin: 0 }}>
            <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>Độ ưu tiên:</label>
            <select 
              className="form-select" 
              style={{ width: '150px', padding: '8px 12px', borderRadius: '10px' }}
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Cao">🔴 Cao</option>
              <option value="Trung bình">🟠 Trung bình</option>
              <option value="Thấp">🟢 Thấp</option>
            </select>
          </div>

          {/* Lọc theo trạng thái */}
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', margin: 0 }}>
            <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>Trạng thái:</label>
            <select 
              className="form-select" 
              style={{ width: '170px', padding: '8px 12px', borderRadius: '10px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Chờ">🔵 Chờ</option>
              <option value="Đang thực hiện">🟡 Đang thực hiện</option>
              <option value="Hoàn thành">🟢 Hoàn thành</option>
              <option value="Quá hạn">🔴 Quá hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách kết quả */}
      <div className="section-card">
        <div className="task-items-list" style={{ maxHeight: 'none' }}>
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search size={32} />
              </div>
              <h3>Không tìm thấy công việc nào!</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onEdit={onEditTask}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
