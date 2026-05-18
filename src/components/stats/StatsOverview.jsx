import React from 'react';
import { ClipboardList, CheckCircle2, PlayCircle, AlertCircle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function StatsOverview() {
  const { stats } = useTasks();

  return (
    <div className="dashboard-grid">
      {/* Tổng công việc */}
      <div className="kpi-card kpi-total">
        <div className="kpi-icon-box">
          <ClipboardList size={24} />
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Tổng công việc</span>
          <span className="kpi-value">{stats.total}</span>
        </div>
      </div>

      {/* Đã hoàn thành */}
      <div className="kpi-card kpi-completed">
        <div className="kpi-icon-box">
          <CheckCircle2 size={24} />
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Hoàn thành</span>
          <span className="kpi-value">{stats.completed}</span>
        </div>
      </div>

      {/* Đang thực hiện */}
      <div className="kpi-card kpi-active">
        <div className="kpi-icon-box">
          <PlayCircle size={24} />
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Đang thực hiện</span>
          <span className="kpi-value">{stats.active}</span>
        </div>
      </div>

      {/* Quá hạn */}
      <div className="kpi-card kpi-overdue">
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
