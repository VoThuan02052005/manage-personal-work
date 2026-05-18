import React from 'react';
import { useTasks } from '../../context/TaskContext';

export default function StatsCharts() {
  const { stats } = useTasks();

  // --- LOGIC VẼ BIỂU ĐỒ TRÒN DONUT ---
  const { completed, active, overdue, total } = stats;
  
  // Tính tỷ lệ
  const pctCompleted = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pctActive = total > 0 ? Math.round((active / total) * 100) : 0;
  const pctOverdue = total > 0 ? Math.round((overdue / total) * 100) : 0;

  // Bán kính hình tròn donut = 50, chu vi = 2 * PI * r = 314
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16

  // Tính stroke-dashoffset cho mỗi phân đoạn
  const completedStroke = (pctCompleted / 100) * circumference;
  const activeStroke = (pctActive / 100) * circumference;
  const overdueStroke = (pctOverdue / 100) * circumference;

  // Offset lũy kế để xếp các cung tròn kề nhau
  const offsetCompleted = circumference;
  const offsetActive = circumference - completedStroke;
  const offsetOverdue = circumference - completedStroke - activeStroke;


  // --- LOGIC VẼ BIỂU ĐỒ CỘT PRIORITY ---
  const { Cao, "Trung bình": TrungBinh, Thấp: Thap } = stats.priorityCounts;
  
  // Tìm giá trị lớn nhất để làm mốc tỷ lệ chiều cao (tối thiểu là 5 để cột không quá cao)
  const maxVal = Math.max(Cao, TrungBinh, Thap, 5);
  
  const barChartHeight = 120; // Chiều cao tối đa của cột trong SVG
  
  const heightCao = (Cao / maxVal) * barChartHeight;
  const heightTrungBinh = (TrungBinh / maxVal) * barChartHeight;
  const heightThap = (Thap / maxVal) * barChartHeight;

  return (
    <div className="charts-grid">
      {/* 1. Biểu đồ tròn trạng thái công việc */}
      <div className="section-card">
        <div className="section-card-header">
          <h3 className="section-card-title">📊 Thống kê công việc</h3>
        </div>
        
        <div className="chart-container">
          {total === 0 ? (
            <div className="empty-state" style={{ padding: 0 }}>
              <span>Chưa có dữ liệu thống kê</span>
            </div>
          ) : (
            <>
              {/* Vẽ biểu đồ tròn bằng SVG */}
              <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                <svg width="100%" height="100%" viewBox="0 0 120 120" className="donut-svg">
                  {/* Vòng nền xám nhạt */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="var(--border-color)"
                    strokeWidth="12"
                  />
                  
                  {/* Vòng Đã hoàn thành (Xanh lá) */}
                  {pctCompleted > 0 && (
                    <circle
                      className="donut-segment"
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="var(--success)"
                      strokeWidth="12"
                      strokeDasharray={`${completedStroke} ${circumference - completedStroke}`}
                      strokeDashoffset={offsetCompleted}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Vòng Đang làm / Chờ (Cam) */}
                  {pctActive > 0 && (
                    <circle
                      className="donut-segment"
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="var(--warning)"
                      strokeWidth="12"
                      strokeDasharray={`${activeStroke} ${circumference - activeStroke}`}
                      strokeDashoffset={offsetActive}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Vòng Quá hạn (Đỏ) */}
                  {pctOverdue > 0 && (
                    <circle
                      className="donut-segment"
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="var(--danger)"
                      strokeWidth="12"
                      strokeDasharray={`${overdueStroke} ${circumference - overdueStroke}`}
                      strokeDashoffset={offsetOverdue}
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                {/* Văn bản chính giữa biểu đồ */}
                <div className="chart-center-text" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <span className="chart-center-val">{total}</span>
                  <span className="chart-center-lbl">Tổng số</span>
                </div>
              </div>

              {/* Chú thích bên phải */}
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-left">
                    <span className="legend-color" style={{ backgroundColor: 'var(--success)' }}></span>
                    <span>Hoàn thành</span>
                  </div>
                  <span className="legend-val">
                    {completed} <span className="legend-percent">({pctCompleted}%)</span>
                  </span>
                </div>
                
                <div className="legend-item">
                  <div className="legend-left">
                    <span className="legend-color" style={{ backgroundColor: 'var(--warning)' }}></span>
                    <span>Đang thực hiện</span>
                  </div>
                  <span className="legend-val">
                    {active} <span className="legend-percent">({pctActive}%)</span>
                  </span>
                </div>

                <div className="legend-item">
                  <div className="legend-left">
                    <span className="legend-color" style={{ backgroundColor: 'var(--danger)' }}></span>
                    <span>Quá hạn</span>
                  </div>
                  <span className="legend-val">
                    {overdue} <span className="legend-percent">({pctOverdue}%)</span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Biểu đồ cột theo độ ưu tiên */}
      <div className="section-card">
        <div className="section-card-header">
          <h3 className="section-card-title">📈 Công việc theo ưu tiên</h3>
        </div>
        
        <div className="chart-container" style={{ flexDirection: 'column' }}>
          {total === 0 ? (
            <div className="empty-state" style={{ padding: 0 }}>
              <span>Chưa có dữ liệu thống kê</span>
            </div>
          ) : (
            <svg className="bar-chart-svg" viewBox="0 0 300 160">
              {/* Các đường lưới ngang phụ */}
              <line x1="40" y1="20" x2="280" y2="20" stroke="var(--border-color)" strokeDasharray="4 4" />
              <line x1="40" y1="70" x2="280" y2="70" stroke="var(--border-color)" strokeDasharray="4 4" />
              <line x1="40" y1="120" x2="280" y2="120" stroke="var(--border-color)" />

              {/* Cột Cao (Đỏ) */}
              <rect
                className="bar-rect"
                x="65"
                y={120 - heightCao}
                width="34"
                height={heightCao}
                rx="6"
                fill="var(--danger)"
              />
              {/* Số lượng hiển thị trên cột */}
              <text x="82" y={110 - heightCao} textAnchor="middle" fill="var(--text-main)" fontSize="12" fontWeight="700">
                {Cao}
              </text>

              {/* Cột Trung bình (Cam) */}
              <rect
                className="bar-rect"
                x="133"
                y={120 - heightTrungBinh}
                width="34"
                height={heightTrungBinh}
                rx="6"
                fill="var(--warning)"
              />
              <text x="150" y={110 - heightTrungBinh} textAnchor="middle" fill="var(--text-main)" fontSize="12" fontWeight="700">
                {TrungBinh}
              </text>

              {/* Cột Thấp (Xanh lá) */}
              <rect
                className="bar-rect"
                x="201"
                y={120 - heightThap}
                width="34"
                height={heightThap}
                rx="6"
                fill="var(--success)"
              />
              <text x="218" y={110 - heightThap} textAnchor="middle" fill="var(--text-main)" fontSize="12" fontWeight="700">
                {Thap}
              </text>

              {/* Trục X và nhãn */}
              <text x="82" y="142" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">Cao</text>
              <text x="150" y="142" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">Trung bình</text>
              <text x="218" y="142" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">Thấp</text>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
