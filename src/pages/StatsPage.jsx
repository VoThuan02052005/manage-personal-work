import React from 'react';
import { BarChart2, Award, Zap, AlertTriangle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import StatsOverview from '../components/stats/StatsOverview';
import StatsCharts from '../components/stats/StatsCharts';

export default function StatsPage({ setActivePage }) {
  const { stats, setFilterStatus } = useTasks();
  const { completed, total, overdue } = stats;

  const handleStatsClick = (status) => {
    if (setActivePage) {
      setFilterStatus(status);
      setActivePage('tasks');
    }
  };

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Lời khuyên động dựa trên kết quả
  const getProductivityAdvice = () => {
    if (total === 0) {
      return {
        title: "Bắt đầu hành trình mới! 🚀",
        desc: "Hãy thêm những công việc đầu tiên của bạn vào danh sách để hệ thống có thể phân tích hiệu suất làm việc giúp bạn.",
        icon: Zap,
        color: 'var(--primary)'
      };
    }
    if (overdue > 2) {
      return {
        title: "Chú ý quản lý thời gian! ⚠️",
        desc: "Hiện tại bạn đang có một vài công việc bị quá hạn. Hãy thử chia nhỏ công việc hoặc thiết lập mức ưu tiên phù hợp hơn để không bị dồn ứ nhé.",
        icon: AlertTriangle,
        color: 'var(--danger)'
      };
    }
    if (completionRate >= 70) {
      return {
        title: "Tuyệt vời! Bạn đang làm rất tốt 🏆",
        desc: "Tỷ lệ hoàn thành công việc của bạn rất ấn tượng! Hãy tiếp tục duy trì đà này để đạt được mọi mục tiêu của tháng nhé.",
        icon: Award,
        color: 'var(--success)'
      };
    }
    return {
      title: "Cố gắng lên nào! 💪",
      desc: "Hãy tập trung giải quyết các công việc có độ ưu tiên Cao (🔴) trước. Chúc bạn có một ngày làm việc thật năng suất!",
      icon: Zap,
      color: 'var(--warning)'
    };
  };

  const advice = getProductivityAdvice();
  const AdviceIcon = advice.icon;

  return (
    <>
      <div className="page-header">
        <div className="page-header-info">
          <h2 className="page-title">Phân tích hiệu suất 📈</h2>
          <p className="page-subtitle">Xem báo cáo trực quan và đánh giá năng suất làm việc</p>
        </div>
      </div>

      {/* KPI Cards */}
      <StatsOverview onCardClick={handleStatsClick} />

      {/* Lời khuyên năng suất */}
      <div className="section-card" style={{ 
        borderLeft: `5px solid ${advice.color}`,
        background: `linear-gradient(90deg, ${advice.color}05, transparent)`
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            backgroundColor: `${advice.color}15`, 
            color: advice.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AdviceIcon size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{advice.title}</h4>
            <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.6' }}>{advice.desc}</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ phân tích */}
      <StatsCharts />
    </>
  );
}
