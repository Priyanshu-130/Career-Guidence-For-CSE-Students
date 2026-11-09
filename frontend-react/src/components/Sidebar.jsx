import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Target, 
  Map, 
  CheckSquare, 
  PieChart, 
  LogOut, 
  User,
  ShieldCheck,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Observatory Hub', path: '/', icon: <Compass size={18} />, tag: 'SYS-01' },
    { name: 'Adaptive Assessment', path: '/assess', icon: <Sparkles size={18} />, tag: 'LAB-02' },
    { name: 'Domain Intelligence', path: '/domains', icon: <Layers size={18} />, tag: 'DOM-03' },
    { name: 'Curriculum Roadmap', path: '/roadmap/ai', icon: <Map size={18} />, tag: 'MAP-04' },
    { name: 'Student Trajectory', path: '/progress', icon: <CheckSquare size={18} />, tag: 'TRK-05' },
    { name: 'Diagnostic Results', path: '/results', icon: <PieChart size={18} />, tag: 'RES-06' },
    { name: 'Admin Telemetry', path: '/admin', icon: <ShieldCheck size={18} />, tag: 'ADM-07' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand & System Status */}
      <div style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-accent)'
          }}>
            <Terminal size={14} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '0.04em',
              color: 'var(--color-ivory)',
              lineHeight: 1
            }}>
              PATHFINDER
            </div>
            <div className="mono-tag" style={{ fontSize: '0.625rem', opacity: 0.85 }}>
              CSE OBSERVATORY v3.4
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.85rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
          <span className="mono-meta" style={{ fontSize: '0.6875rem' }}>
            ENGINE: ACTIVE TELEMETRY
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        <div className="mono-tag" style={{ padding: '0 0.75rem 0.5rem', color: 'var(--color-text-3)' }}>
          NAVIGATION MATRIX
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ opacity: 0.85, display: 'flex' }}>{item.icon}</span>
            <span style={{ flex: 1, letterSpacing: '0.01em' }}>{item.name}</span>
            <span className="mono-meta" style={{ fontSize: '0.625rem', opacity: 0.5 }}>{item.tag}</span>
          </NavLink>
        ))}
      </nav>

      {/* Student Session / Footer */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: 'auto' }}>
        {user ? (
          <div>
            <div style={{ padding: '0.5rem 0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', marginBottom: '0.75rem' }}>
              <div className="mono-meta" style={{ fontSize: '0.625rem', color: 'var(--color-accent)' }}>OPERATOR IDENTITY</div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ivory)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || 'CSE Student'}
              </div>
              <div className="mono-meta" style={{ fontSize: '0.6875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>

            <button
              onClick={logout}
              className="btn-ghost"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-accent)',
                justifyContent: 'flex-start',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} style={{ marginRight: '6px' }} /> DISCONNECT SESSION
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn-secondary" style={{ width: '100%', padding: '0.65rem' }}>
            AUTHENTICATE <Terminal size={14} />
          </NavLink>
        )}
      </div>
    </aside>
  );
}
