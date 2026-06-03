import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { UserCircle2, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { loginUser } = useTasks();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      setError('Vui lòng điền đầy đủ tên và email!');
      return;
    }
    if (!email.includes('@')) {
      setError('Email không hợp lệ!');
      return;
    }
    
    loginUser(username.trim(), email.trim());
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
      <div className="section-card" style={{ maxWidth: '400px', width: '100%', padding: '40px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'var(--primary)', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            <UserCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Chào mừng đến với</h2>
          <h3 style={{ color: 'var(--primary)' }}>Personal Work Manager</h3>
          <p className="text-muted" style={{ marginTop: '10px' }}>Hãy đăng nhập để bắt đầu quản lý công việc của bạn.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Tên của bạn</label>
            <div style={{ position: 'relative' }}>
              <UserCircle2 size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '40px' }}
                placeholder="Ví dụ: Nguyễn Văn A"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>
            Bắt đầu ngay <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
