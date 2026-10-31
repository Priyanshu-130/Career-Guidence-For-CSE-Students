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
  Map,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  Flame
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={22} /> },
    { name: 'NeuroLink Hero', path: '/neurolink', icon: <Flame size={22} color="#FFB733" /> },
    { name: 'Adaptive Ladder', path: '/assess', icon: <Sparkles size={22} /> },
    { name: 'Admin & Explain', path: '/admin', icon: <ShieldCheck size={22} /> },
    { name: 'Career Finder', path: '/career-finder', icon: <Target size={22} /> },
    { name: 'Explore Domains', path: '/domains', icon: <Compass size={22} /> },
    { name: 'Track Progress', path: '/progress', icon: <CheckSquare size={22} /> },
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
          boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)'
        }}>
          <Compass size={24} />
        </div>
        <div className="sidebar-text">
          <div style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>PathFinder</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', fontWeight: 600 }}>CSE Career Engine</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section & Logout */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: 'auto' }}>
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-accent-lt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)',
                fontWeight: 700, fontSize: '0.875rem'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div className="sidebar-text" style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name || 'Student'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="sidebar-link"
              style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
            >
              <span className="sidebar-icon"><LogOut size={20} color="var(--color-danger)" /></span>
              <span className="sidebar-text" style={{ color: 'var(--color-danger)' }}>Logout</span>
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="sidebar-link">
            <span className="sidebar-icon"><User size={20} /></span>
            <span className="sidebar-text">Sign In</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
}
