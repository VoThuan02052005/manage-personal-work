import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { UserCircle2, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { loginUser } = useTasks();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isAdminMode) {
      // Chế độ Admin: chỉ cần username + password
      if (!username.trim() || !password.trim()) {
        setError('Vui lòng nhập tên đăng nhập và mật khẩu!');
        return;
      }
      const result = loginUser(username.trim(), '', password);
      if (!result.success) {
        setError(result.message || 'Sai tên đăng nhập hoặc mật khẩu!');
      }
    } else {
      // Chế độ User
      const result = loginUser(username.trim(), email.trim(), password);
      if (!result.success) {
        setError(result.message);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '20px'
    }}>
      <div className="section-card" style={{ maxWidth: '420px', width: '100%', padding: '40px 30px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: isAdminMode ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'var(--primary)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            transition: 'background 0.3s'
          }}>
            {isAdminMode ? <ShieldCheck size={36} /> : <UserCircle2 size={36} />}
          </div>
          <h2 style={{ fontSize: '22px', marginBottom: '6px' }}>
            {isAdminMode ? 'Đăng nhập Quản trị' : 'Chào mừng bạn!'}
          </h2>
          <h3 style={{ color: isAdminMode ? '#e74c3c' : 'var(--primary)', marginBottom: '8px' }}>
            {isAdminMode ? 'Admin Portal' : 'Personal Work Manager'}
          </h3>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            {isAdminMode
              ? 'Đăng nhập bằng tài khoản quản trị viên.'
              : 'Đăng nhập hoặc tạo tài khoản để bắt đầu.'}
          </p>
        </div>

        {/* Toggle Admin / User */}
        <div style={{
          display: 'flex', background: 'var(--bg-secondary)',
          borderRadius: '10px', padding: '4px', marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setIsAdminMode(false); setError(''); }}
            style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: !isAdminMode ? 'var(--primary)' : 'transparent',
              color: !isAdminMode ? 'white' : 'var(--text-muted)',
              fontWeight: !isAdminMode ? '600' : '400',
              transition: 'all 0.2s', fontSize: '14px'
            }}
          >
            👤 Người dùng
          </button>
          <button
            type="button"
            onClick={() => { setIsAdminMode(true); setError(''); }}
            style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: isAdminMode ? '#e74c3c' : 'transparent',
              color: isAdminMode ? 'white' : 'var(--text-muted)',
              fontWeight: isAdminMode ? '600' : '400',
              transition: 'all 0.2s', fontSize: '14px'
            }}
          >
            🛡️ Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              color: 'var(--danger)', marginBottom: '15px', fontSize: '13px',
              textAlign: 'center', padding: '10px', background: 'rgba(239,68,68,0.1)',
              borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)'
            }}>
              {error}
            </div>
          )}

          {/* Tên đăng nhập */}
          <div className="form-group">
            <label className="form-label">
              {isAdminMode ? 'Tên đăng nhập Admin' : 'Họ và tên'}
            </label>
            <div style={{ position: 'relative' }}>
              <UserCircle2 size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder={isAdminMode ? 'admin' : 'Ví dụ: Nguyễn Văn A'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Email – ẩn ở chế độ Admin */}
          {!isAdminMode && (
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="vidu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Mật khẩu */}
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder={isAdminMode ? '••••••••' : 'Ít nhất 6 ký tự'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isAdminMode && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Lần đầu đăng nhập? Nhập email mới để tạo tài khoản tự động.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%', marginTop: '20px', justifyContent: 'center',
              background: isAdminMode ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : undefined
            }}
          >
            {isAdminMode ? 'Đăng nhập Admin' : 'Bắt đầu ngay'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
