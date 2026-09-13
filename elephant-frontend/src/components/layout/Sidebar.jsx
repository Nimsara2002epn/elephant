import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Calendar,
  Bell,
  Users,
  BarChart3,
  MessageSquare,
  User,
  Shield,
  LogOut,
  X,
  FileText,
  Database,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Bills', path: '/bills', icon: Receipt },
    { label: 'Events', path: '/events', icon: CalendarDays },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Reminders', path: '/reminders', icon: Bell },
    { label: 'Collaboration', path: '/collaboration', icon: Users },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Feedback', path: '/feedback', icon: MessageSquare },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const adminItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Security Logs', path: '/admin/logs', icon: FileText },
    { label: 'Backup & Recovery', path: '/admin/backups', icon: Database },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="mobile-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13, 42, 91, 0.35)',
            backdropFilter: 'blur(3px)',
            zIndex: 45,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div
          style={{
            padding: '24px 22px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #EEF3F8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #29B6F6 0%, #2196F3 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                boxShadow: '0 6px 16px -2px rgba(33, 150, 243, 0.38)',
                flexShrink: 0,
              }}
            >
              🐘
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0D2A5B', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Elephant
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginTop: '2px' }}>
                Smart Finance
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: '14px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : '#64748B',
                  background: isActive ? 'linear-gradient(135deg, #29B6F6 0%, #2196F3 100%)' : 'transparent',
                  boxShadow: isActive ? '0 8px 20px -4px rgba(33, 150, 243, 0.45)' : 'none',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={19} color={isActive ? '#ffffff' : '#64748B'} strokeWidth={isActive ? 2.5 : 2} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Admin Navigation Section */}
          {isAdmin && (
            <>
              <div style={{ marginTop: '22px', padding: '0 16px 8px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8' }}>
                ADMIN
              </div>
              {adminItems.map((adm) => {
                const Icon = adm.icon;
                return (
                  <NavLink
                    key={adm.path}
                    to={adm.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '14px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#64748B',
                      background: isActive ? 'linear-gradient(135deg, #6A38EB 0%, #8B5CF6 100%)' : 'transparent',
                      boxShadow: isActive ? '0 8px 20px -4px rgba(106, 56, 235, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={18} color={isActive ? '#ffffff' : '#64748B'} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{ flex: 1 }}>{adm.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </>
          )}
        </div>

        {/* User Card & Logout Footer */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid #EEF3F8', backgroundColor: '#F8FAFD' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #29B6F6 0%, #2196F3 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0D2A5B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Nimsara'}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2196F3', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {user?.role || 'USER'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFE8F1';
                e.currentTarget.style.color = '#EF4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
