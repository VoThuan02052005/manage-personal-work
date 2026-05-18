import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function TaskFormModal({ isOpen, onClose, editTaskData }) {
  const { addTask, updateTask, selectedDate } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState('Trung bình');
  const [repeat, setRepeat] = useState('Không lặp');

  // Load thông tin khi sửa công việc
  useEffect(() => {
    if (editTaskData) {
      setTitle(editTaskData.title || '');
      setDescription(editTaskData.description || '');
      setDate(editTaskData.date || '');
      setTime(editTaskData.time || '09:00');
      setPriority(editTaskData.priority || 'Trung bình');
      setRepeat(editTaskData.repeat || 'Không lặp');
    } else {
      // Khi thêm mới, lấy ngày đang chọn ở Lịch
      setTitle('');
      setDescription('');
      setDate(selectedDate || new Date().toISOString().split('T')[0]);
      setTime('09:00');
      setPriority('Trung bình');
      setRepeat('Không lặp');
    }
  }, [editTaskData, isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề công việc!");
      return;
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      priority,
      repeat
    };

    if (editTaskData) {
      updateTask({ id: editTaskData.id, ...taskPayload, status: editTaskData.status });
    } else {
      addTask(taskPayload);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editTaskData ? '✏️ Cập nhật công việc' : '➕ Thêm công việc mới'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="settings-list">
          {/* Tiêu đề */}
          <div className="form-group">
            <label className="form-label">Tiêu đề công việc *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="VD: Học Flask, Làm bài tập..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Mô tả */}
          <div className="form-group">
            <label className="form-label">Mô tả chi tiết</label>
            <textarea 
              className="form-textarea" 
              placeholder="Nhập ghi chú thêm..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Ngày & Giờ */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ngày thực hiện</label>
              <input 
                type="date" 
                className="form-input" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Giờ thực hiện</label>
              <input 
                type="time" 
                className="form-input" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mức độ ưu tiên */}
          <div className="form-group">
            <label className="form-label">Mức độ ưu tiên</label>
            <div className="priority-selector">
              {['Cao', 'Trung bình', 'Thấp'].map((lvl) => (
                <div key={lvl}>
                  <input
                    type="radio"
                    id={`priority-${lvl}`}
                    name="priority"
                    value={lvl}
                    className="priority-radio-input"
                    checked={priority === lvl}
                    onChange={() => setPriority(lvl)}
                  />
                  <label 
                    htmlFor={`priority-${lvl}`}
                    className={`priority-radio-label priority-radio-label-${lvl.toLowerCase().replace(' ', '')}`}
                  >
                    {lvl === 'Cao' ? '🔴' : lvl === 'Trung bình' ? '🟠' : '🟢'} {lvl}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Chu kỳ lặp lại công việc */}
          <div className="form-group">
            <label className="form-label">Chu kỳ lặp lại</label>
            <select 
              className="form-select" 
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value="Không lặp">🔄 Không lặp lại</option>
              <option value="Hàng ngày">📅 Hàng ngày</option>
              <option value="Hàng tuần">🗓️ Hàng tuần</option>
              <option value="Hàng tháng">📊 Hàng tháng</option>
            </select>
          </div>

          {/* Nút hành động */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              {editTaskData ? 'Cập nhật' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
