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
    else if (location.pathname === '/assess') paths.push({ name: 'Adaptive Assessment', path: '/assess' });
    else if (location.pathname === '/results') paths.push({ name: 'Analysis & Telemetry', path: '/results' });
    else if (location.pathname === '/progress') paths.push({ name: 'Student Trajectory', path: '/progress' });
    else if (location.pathname === '/admin') paths.push({ name: 'Admin Telemetry', path: '/admin' });
    else if (location.pathname === '/career-finder') paths.push({ name: 'Quick Diagnostic', path: '/career-finder' });
    return paths;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav style={{ 
      height: 'var(--nav-h)', 
      display: 'flex', 
      alignItems: 'center', 
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #D8DAD7',
      position: 'sticky',
      top: 0,
      zIndex: 400,
      padding: '0 2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8125rem' }}>
        {breadcrumbs.map((bc, idx) => (
          <React.Fragment key={bc.path}>
            {idx > 0 && <ChevronRight size={13} style={{ color: '#D8DAD7' }} />}
            {idx === breadcrumbs.length - 1 ? (
              <span style={{ fontWeight: 700, color: '#17191C' }}>{bc.name}</span>
            ) : (
              <Link to={bc.path} style={{ color: '#50545B', textDecoration: 'none' }}>{bc.name}</Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
