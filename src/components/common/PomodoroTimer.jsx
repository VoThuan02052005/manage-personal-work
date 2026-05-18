import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, X, Minimize2, Maximize2, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { isSameDay } from '../../utils/dateUtils';

export default function PomodoroTimer() {
  const { tasks, CURRENT_DATE } = useTasks();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' (tập trung 25m), 'break' (nghỉ ngơi 5m)
  
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 phút mặc định
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  const timerRef = useRef(null);

  // Danh sách công việc hôm nay chưa xong để tập trung
  const todayTasks = tasks.filter(
    t => isSameDay(t.date, CURRENT_DATE) && t.status !== "Hoàn thành"
  );

  // Đổi chế độ Focus / Break
  useEffect(() => {
    setIsRunning(false);
    if (mode === 'focus') {
      setTimeLeft(25 * 60);
    } else {
      setTimeLeft(5 * 60);
    }
  }, [mode]);

  // Bộ đếm ngược thời gian
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playAlertSound(); // Phát âm thanh báo hiệu
            
            // Tự động chuyển chế độ khi hết giờ
            if (mode === 'focus') {
              alert("🚀 Hoàn thành phiên tập trung 25 phút! Hãy nghỉ ngơi 5 phút thôi.");
              setMode('break');
            } else {
              alert("💪 Hết giờ nghỉ ngơi! Bắt đầu phiên làm việc tiếp theo thôi nào.");
              setMode('focus');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  // Hàm phát âm thanh Beep bằng Web Audio API (không phụ thuộc file ngoài)
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Tạo 3 nốt nhạc mượt mà báo hiệu
      const playNote = (freq, start, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };

      const now = audioCtx.currentTime;
      playNote(523.25, now, 0.2); // Đô (C5)
      playNote(659.25, now + 0.2, 0.2); // Mi (E5)
      playNote(783.99, now + 0.4, 0.4); // Sol (G5)
    } catch (e) {
      console.error("Trình duyệt không hỗ trợ phát âm thanh tự động", e);
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Nếu không mở, chỉ hiện một bong bóng nổi kích hoạt
  if (!isOpen) {
    return (
      <button 
        className="pomodoro-float-trigger" 
        onClick={() => setIsOpen(true)}
        title="Mở đồng hồ Pomodoro tập trung"
      >
        <Timer size={24} style={{ animation: isRunning ? 'pulse 2s infinite' : 'none' }} />
        {isRunning && <span className="pomodoro-badge"></span>}
      </button>
    );
  }

  const selectedTaskText = tasks.find(t => t.id === selectedTaskId)?.title || 'Chọn việc để tập trung';

  return (
    <div className={`pomodoro-widget-card ${isMinimized ? 'minimized' : ''}`}>
      {/* Header Widget */}
      <div className="pomodoro-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
          <Timer size={16} className={isRunning ? 'spin-animation' : ''} />
          Pomodoro Timer
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="widget-icon-btn" onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? 'Phóng to' : 'Thu nhỏ'}>
            {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>
          <button className="widget-icon-btn" onClick={() => setIsOpen(false)} title="Đóng">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Nội dung khi không bị thu nhỏ */}
      {!isMinimized && (
        <div className="pomodoro-body">
          {/* Tab chọn chế độ */}
          <div className="pomodoro-tabs">
            <button 
              className={`pomodoro-tab-btn ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => setMode('focus')}
            >
              🎯 Tập trung (25m)
            </button>
            <button 
              className={`pomodoro-tab-btn ${mode === 'break' ? 'active' : ''}`}
              onClick={() => setMode('break')}
            >
              ☕ Nghỉ ngơi (5m)
            </button>
          </div>

          {/* Hiển thị thời gian đếm ngược */}
          <div className={`pomodoro-display ${mode === 'focus' ? 'focus-mode' : 'break-mode'}`}>
            {formatTime(timeLeft)}
          </div>

          {/* Chọn nhiệm vụ tập trung */}
          {mode === 'focus' && (
            <div className="pomodoro-task-select">
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                Nhiệm vụ đang thực hiện:
              </label>
              <select 
                className="form-select" 
                style={{ fontSize: '12px', padding: '6px', borderRadius: '8px' }}
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
              >
                <option value="">-- Chọn công việc hôm nay --</option>
                {todayTasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Các nút điều khiển */}
          <div className="pomodoro-controls">
            <button 
              className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`} 
              style={{ flexGrow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={handleStartPause}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={handleReset}
              title="Đặt lại đồng hồ"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị tóm tắt siêu nhỏ khi minimized */}
      {isMinimized && (
        <div className="pomodoro-minimized-row" onClick={() => setIsMinimized(false)}>
          <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' }}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-muted" style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
            ({mode === 'focus' ? '🎯 Focus' : '☕ Break'})
          </span>
          <button 
            className="widget-mini-play" 
            onClick={(e) => { e.stopPropagation(); handleStartPause(); }}
          >
            {isRunning ? <Pause size={10} /> : <Play size={10} />}
          </button>
        </div>
      )}
    </div>
  );
}
