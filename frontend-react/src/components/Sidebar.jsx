import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Target, 
  Compass, 
  PieChart, 
  LogOut, 
  User,
  Map
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={22} /> },
    { name: 'Career Finder', path: '/career-finder', icon: <Target size={22} /> },
    { name: 'Explore Domains', path: '/domains', icon: <Compass size={22} /> },
    { name: 'My Analytics', path: '/results', icon: <PieChart size={22} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.75rem 1.5rem', marginBottom: '1rem' }}>
        <div style={{ 
          minWidth: '40px', height: '40px', borderRadius: '12px', 
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
        }}>
          <Compass size={24} />
        </div>
        <div className="sidebar-text">
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>PATHFINDER</div>
          <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Professional v2.1</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile Summary Footer */}
      <div style={{ marginTop: 'auto', padding: '1rem 0.75rem' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--color-border)',
          padding: '1rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              minWidth: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-accent-lt)', 
              color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={18} />
            </div>
            <div className="sidebar-text" style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-3)' }}>{user?.year} • {user?.branch}</div>
            </div>
          </div>
          <button onClick={logout} className="sidebar-text logout-btn-side" style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)',
            transition: 'var(--transition)'
          }}>
            <LogOut size={14} /> <span>Sign Out</span>
          </button>
        </div>
      </div>

      <style>{`
        .sidebar-text { opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .sidebar:hover .sidebar-text { opacity: 1; pointer-events: auto; }
        .logout-btn-side:hover { color: var(--color-danger) !important; }
      `}</style>
    </aside>
  );
}
