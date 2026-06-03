import React from 'react';
import { ClipboardList, CheckCircle2, PlayCircle, AlertCircle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function StatsOverview({ onCardClick }) {
  const { stats } = useTasks();

  return (
    <div className="dashboard-grid">
      {/* Tổng công việc */}
      <div 
        className="kpi-card kpi-total" 
        onClick={() => onCardClick && onCardClick('Tất cả')} 
        style={{ cursor: onCardClick ? 'pointer' : 'default', transition: 'transform 0.2s' }}
        onMouseOver={(e) => onCardClick && (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseOut={(e) => onCardClick && (e.currentTarget.style.transform = 'scale(1)')}
      >
        <div className="kpi-icon-box">
          <ClipboardList size={24} />
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Tổng công việc</span>
          <span className="kpi-value">{stats.total}</span>
        </div>
      </div>

      {/* Đã hoàn thành */}
      <div 
        className="kpi-card kpi-completed"
        onClick={() => onCardClick && onCardClick('Hoàn thành')} 
        style={{ cursor: onCardClick ? 'pointer' : 'default', transition: 'transform 0.2s' }}
        onMouseOver={(e) => onCardClick && (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseOut={(e) => onCardClick && (e.currentTarget.style.transform = 'scale(1)')}
      >
        <div className="kpi-icon-box">
          <CheckCircle2 size={24} />
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Hoàn thành</span>
          <span className="kpi-value">{stats.completed}</span>
        </div>
      </div>

      {/* Đang thực hiện */}
      <div 
        className="kpi-card kpi-active"
        onClick={() => onCardClick && onCardClick('Đang thực hiện')} 
        style={{ cursor: onCardClick ? 'pointer' : 'default', transition: 'transform 0.2s' }}
        onMouseOver={(e) => onCardClick && (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseOut={(e) => onCardClick && (e.currentTarget.style.transform = 'scale(1)')}
      >
        <div className="kpi-icon-box">
          <PlayCircle size={24} />
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Đang thực hiện</span>
          <span className="kpi-value">{stats.active}</span>
        </div>
      </div>

      {/* Quá hạn */}
      <div 
        className="kpi-card kpi-overdue"
        onClick={() => onCardClick && onCardClick('Quá hạn')} 
        style={{ cursor: onCardClick ? 'pointer' : 'default', transition: 'transform 0.2s' }}
        onMouseOver={(e) => onCardClick && (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseOut={(e) => onCardClick && (e.currentTarget.style.transform = 'scale(1)')}
      >
        <div className="kpi-icon-box">
          <AlertCircle size={24} />
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Quá hạn</span>
          <span className="kpi-value">{stats.overdue}</span>
        </div>
      </div>
    </div>
  );
}
