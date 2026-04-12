import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function TopNav() {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const getBreadcrumbs = () => {
    const paths = [{ name: 'Dashboard', path: '/' }];
    if (location.pathname.startsWith('/domain')) paths.push({ name: 'Domain Insights', path: location.pathname });
    else if (location.pathname.startsWith('/roadmap')) paths.push({ name: 'Roadmap', path: location.pathname });
    else if (location.pathname.startsWith('/quiz')) paths.push({ name: 'Assessment', path: '/quiz' });
    else if (location.pathname === '/results') {
       paths.push({ name: 'Analysis', path: '/results' });
    } else if (location.pathname === '/career-finder') {
       paths.push({ name: 'Quick Diagnostic', path: '/career-finder' });
    }
    return paths;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav style={{ 
      height: 'var(--nav-h)', 
      display: 'flex', 
      alignItems: 'center', 
      background: 'rgba(2, 6, 23, 0.4)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 400
    }}>
      <div className="content-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {breadcrumbs.map((bc, idx) => (
          <React.Fragment key={bc.path}>
            {idx > 0 && <ChevronRight size={14} style={{ opacity: 0.3 }} />}
            {idx === breadcrumbs.length - 1 ? (
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fff' }}>{bc.name}</span>
            ) : (
              <Link to={bc.path} style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', fontWeight: 500, transition: 'var(--transition)' }}>{bc.name}</Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
