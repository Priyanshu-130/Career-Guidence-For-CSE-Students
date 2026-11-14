import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home as HomeIcon, Map, PieChart, LogOut, Sparkles, LogIn, BookOpen } from 'lucide-react';

// Student navigation: 5 items. The admin console lives at /admin and is intentionally not linked here.
const NAV_ITEMS = [
  { name: 'Home', path: '/', icon: <HomeIcon size={18} />, end: true },
  { name: 'Assessment', path: '/quiz', icon: <Sparkles size={18} /> },
  { name: 'My Result', path: '/results', icon: <PieChart size={18} /> },
  { name: 'Roadmap', path: '/roadmap', icon: <Map size={18} /> },
  { name: 'Resources & Booster', path: '/resources', icon: <BookOpen size={18} /> },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.375rem',
          letterSpacing: '0.04em',
          color: 'var(--color-text)',
          lineHeight: 1
        }}>
          CSE PathFinder
        </div>
      </div>

      <nav aria-label="Main" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'flex' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: 'auto' }}>
        {user ? (
          <div>
            <div style={{ padding: '0 0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || 'CSE Student'}
              </div>
              {user.email && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-ghost"
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.875rem', justifyContent: 'flex-start', cursor: 'pointer' }}
            >
              <LogOut size={16} style={{ marginRight: '6px' }} /> Log out
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn-secondary" style={{ width: '100%', padding: '0.65rem' }}>
            Log in <LogIn size={16} />
          </NavLink>
        )}
      </div>
    </aside>
  );
}
