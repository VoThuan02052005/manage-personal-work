import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, Clock, Check, GripVertical, RefreshCw } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function TaskItem({ task, onEdit }) {
  const { toggleTaskStatus, deleteTask, dragAndDropTasks } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);

  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case 'Cao': return 'badge-priority-cao';
      case 'Trung bình': return 'badge-priority-trungbinh';
      case 'Thấp': return 'badge-priority-thap';
      default: return '';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hoàn thành': return <span className="badge badge-status-done">Đã xong</span>;
      case 'Đang thực hiện': return <span className="badge badge-status-progress">Đang làm</span>;
      case 'Quá hạn': return <span className="badge badge-status-overdue">Quá hạn</span>;
      case 'Chờ':
      default:
        return <span className="badge badge-status-cho">Chờ</span>;
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa công việc "${task.title}" không?`)) {
      deleteTask(task.id);
    }
  };

  // --- LOGIC SỰ KIỆN KÉO THẢ (DRAG & DROP) ---
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Cho phép Drop
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== task.id) {
      dragAndDropTasks(draggedId, task.id);
    }
  };

  return (
    <div 
      className={`task-item-card 
        ${task.status === 'Hoàn thành' ? 'completed' : ''} 
        ${isDragOver ? 'drag-over' : ''}
      `}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="task-item-left">
        {/* Grip Handle Kéo Thả */}
        <div className="drag-handle" title="Kéo thả để sắp xếp">
          <GripVertical size={16} className="text-muted" />
        </div>

        {/* Nút Checkbox Tròn */}
        <button 
          className={`checkbox-round ${task.status === 'Hoàn thành' ? 'checked' : ''}`}
          onClick={() => toggleTaskStatus(task.id)}
          title={task.status === 'Hoàn thành' ? "Đánh dấu chưa hoàn thành" : "Đánh dấu đã hoàn thành"}
        >
          {task.status === 'Hoàn thành' && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="task-text">
          <span className="task-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {task.title}
            {task.repeat && task.repeat !== "Không lặp" && (
              <RefreshCw size={11} className="text-primary" title={`Lặp lại: ${task.repeat}`} style={{ animation: 'spin 12s linear infinite' }} />
            )}
          </span>
          <div className="task-info-row">
            <span className="task-time">
              <Calendar size={12} /> {task.date.split('-').reverse().join('/')}
            </span>
            <span className="task-time">
              <Clock size={12} /> {task.time}
            </span>
            {task.description && (
              <span className="task-desc-summary" title={task.description}>
                • {task.description.length > 35 ? task.description.slice(0, 35) + '...' : task.description}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-item-right">
        {/* Nhãn Độ Ưu Tiên */}
        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
          {task.priority}
        </span>

        {/* Nhãn Trạng Thái */}
        {getStatusBadge(task.status)}

        {/* Nút Thao Tác (Hiện khi Hover) */}
        <div className="task-actions">
          <button 
            className="action-btn action-btn-edit" 
            onClick={() => onEdit(task)}
            title="Sửa công việc"
          >
            <Edit2 size={14} />
          </button>
          <button 
            className="action-btn action-btn-delete" 
            onClick={handleDelete}
            title="Xóa công việc"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
