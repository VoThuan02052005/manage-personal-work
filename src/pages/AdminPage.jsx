import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Users, Trash2, ShieldCheck, UserCheck, LogOut, Calendar, BarChart2 } from 'lucide-react';

export default function AdminPage() {
  const { registeredUsers, deleteRegisteredUser, logoutUser, tasks } = useTasks();
  const [confirm, setConfirm] = useState(null); // id cần xóa

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Hoàn thành').length;
  const overdueTasks = tasks.filter(t => t.status === 'Quá hạn').length;

  const handleDelete = (id) => {
    deleteRegisteredUser(id);
    setConfirm(null);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Tiêu đề Admin */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', margin: 0 }}>Quản trị hệ thống</h1>
            <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>Admin Portal – Personal Work Manager</p>
          </div>
        </div>
        <button
          className="btn"
          onClick={logoutUser}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-secondary)', color: 'var(--text-muted)',
            border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '10px',
            cursor: 'pointer', fontSize: '14px'
          }}
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>

      {/* Thống kê tổng quan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { icon: <Users size={22} />, label: 'Người dùng đã đăng ký', value: registeredUsers.length, color: '#3b82f6' },
          { icon: <BarChart2 size={22} />, label: 'Tổng công việc hệ thống', value: totalTasks, color: '#8b5cf6' },
          { icon: <Calendar size={22} />, label: 'Công việc quá hạn', value: overdueTasks, color: '#ef4444' },
        ].map((card, i) => (
          <div key={i} className="section-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: `${card.color}20`, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bảng danh sách User */}
      <div className="section-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <UserCheck size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '17px', margin: 0 }}>Danh sách người dùng đã đăng ký</h2>
          <span style={{
            marginLeft: 'auto', background: 'var(--primary)', color: 'white',
            borderRadius: '20px', padding: '2px 12px', fontSize: '13px'
          }}>
            {registeredUsers.length} tài khoản
          </span>
        </div>

        {registeredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Users size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p>Chưa có người dùng nào đăng ký.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['#', 'Họ và tên', 'Email', 'Ngày đăng ký', 'Hành động'].map(h => (
                    <th key={h} style={{
                      padding: '10px 12px', textAlign: 'left',
                      color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registeredUsers.map((u, idx) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'var(--primary)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: '700', flexShrink: 0
                        }}>
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '500' }}>{u.username}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(u.registeredAt).toLocaleDateString('vi-VN', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {confirm === u.id ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleDelete(u.id)}
                            style={{
                              padding: '4px 12px', borderRadius: '6px', border: 'none',
                              background: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '12px'
                            }}
                          >Xác nhận xóa</button>
                          <button
                            onClick={() => setConfirm(null)}
                            style={{
                              padding: '4px 12px', borderRadius: '6px', border: 'none',
                              background: 'var(--bg-secondary)', color: 'var(--text-muted)',
                              cursor: 'pointer', fontSize: '12px'
                            }}
                          >Hủy</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirm(u.id)}
                          title="Xóa người dùng"
                          style={{
                            padding: '6px', borderRadius: '8px', border: 'none',
                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                            cursor: 'pointer', display: 'flex', alignItems: 'center'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
