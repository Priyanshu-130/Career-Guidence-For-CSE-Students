import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function TopNav() {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const getBreadcrumbs = () => {
    const paths = [{ name: 'Home', path: '/' }];
    if (location.pathname.startsWith('/domain')) paths.push({ name: 'Domains', path: location.pathname });
    else if (location.pathname.startsWith('/resources')) paths.push({ name: 'Resources & Market Booster', path: '/resources' });
    else if (location.pathname.startsWith('/roadmap')) paths.push({ name: 'Roadmap', path: location.pathname });
    else if (location.pathname.startsWith('/quiz')) paths.push({ name: 'Assessment', path: '/quiz' });
    else if (location.pathname === '/results') paths.push({ name: 'My Result', path: '/results' });
    else if (location.pathname === '/progress') paths.push({ name: 'My Progress', path: '/progress' });
    else if (location.pathname === '/career-finder') paths.push({ name: 'Quick Quiz', path: '/career-finder' });
    return paths;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav 
      aria-label="Breadcrumbs"
      style={{ 
        height: 'var(--nav-h)', 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 400,
        padding: '0 var(--space-4)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
        {breadcrumbs.map((bc, idx) => (
          <React.Fragment key={bc.path}>
            {idx > 0 && <ChevronRight size={14} style={{ color: 'var(--color-border)' }} />}
            {idx === breadcrumbs.length - 1 ? (
              <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{bc.name}</span>
            ) : (
              <Link to={bc.path} style={{ color: 'var(--color-text-2)', textDecoration: 'none' }}>{bc.name}</Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
