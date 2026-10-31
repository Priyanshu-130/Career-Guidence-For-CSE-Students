import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import domains from '../data/domains.json';
import { 
  BookOpen, 
  ArrowRight, 
  Shield, 
  Cpu, 
  Cloud, 
  Globe, 
  Wifi, 
  Settings, 
  Database, 
  Brain,
  Crosshair,
  ExternalLink,
  Layers
} from 'lucide-react';

const iconMap = {
  ai: <Brain size={22} />,
  data: <Database size={22} />,
  web: <Globe size={22} />,
  security: <Shield size={22} />,
  cloud: <Cloud size={22} />,
  iot: <Wifi size={22} />,
  robotics: <Settings size={22} />,
  vlsi: <Cpu size={22} />,
  networking: <Wifi size={22} />
};

export default function DomainsList() {
  const [filter, setFilter] = useState('all');

  const filteredDomains = domains.filter(d => {
    if (filter === 'all') return true;
    return d.category === filter;
  });

  return (
    <div className="page-wrapper content-container animate-in" style={{ paddingBottom: '6rem' }}>
      
      {/* 1. TOP TELEMETRY STRIP */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        border: '1px solid var(--color-border)',
        background: 'rgba(16, 21, 36, 0.45)',
        marginBottom: '3.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--color-text-3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Crosshair size={14} style={{ color: 'var(--color-accent)' }} />
          <span style={{ color: 'var(--color-ivory)', fontWeight: 600 }}>DOMAIN REGISTRY // SPECIALIZATIONS</span>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <span>9 ACCREDITED CSE TRACKS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>ACM/IEEE: <span style={{ color: 'var(--color-success)' }}>CURRICULUM ALIGNED</span></span>
          <span>SEMESTERS: <span style={{ color: 'var(--color-ivory)' }}>1 THROUGH 8</span></span>
        </div>
      </div>

      {/* 2. HEADER */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>DISCIPLINE ARCHIVE</div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', margin: '0 0 1rem 0' }}>
          Explore CSE Specializations
        </h1>
        <p style={{ color: 'var(--color-text-2)', fontSize: '1.125rem', maxWidth: '720px', margin: 0 }}>
          Detailed intelligence briefings across software engineering, systems infrastructure, artificial intelligence, and hardware design.
        </p>
      </div>

      {/* 3. FILTER CONTROLS */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '3rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1rem'
      }}>
        {[
          { id: 'all', label: 'All Specializations [09]' },
          { id: 'software', label: 'Software & Systems [05]' },
          { id: 'hardware', label: 'Hardware & Networks [04]' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '0.5rem 1.25rem',
              background: filter === tab.id ? 'var(--color-ivory)' : 'transparent',
              color: filter === tab.id ? '#06080E' : 'var(--color-text-3)',
              border: filter === tab.id ? '1px solid var(--color-ivory)' : '1px solid transparent',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: filter === tab.id ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. DOMAIN ARCHITECTURAL GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem'
      }}>
        {filteredDomains.map((dom, idx) => {
          const code = `DOM-0${idx + 1}`;
          return (
            <div 
              key={dom.id}
              className="observatory-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2.25rem',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(235, 94, 65, 0.08)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(235, 94, 65, 0.25)'
                    }}>
                      {iconMap[dom.id] || <BookOpen size={20} />}
                    </div>
                    <div>
                      <div className="mono-tag" style={{ color: 'var(--color-text-3)' }}>{code}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-success)' }}>
                        {dom.category?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-3)',
                    padding: '2px 8px',
                    border: '1px solid var(--color-border)'
                  }}>
                    {dom.insights?.jobDemand || 'High Demand'}
                  </span>
                </div>

                {/* Title & Description */}
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--color-ivory)' }}>
                  {dom.title}
                </h2>
                <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  {dom.description}
                </p>

                {/* Skills Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '2rem' }}>
                  {(dom.skills || []).slice(0, 4).map(skill => (
                    <span
                      key={skill}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--color-text-2)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '3px 8px',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--color-border)'
              }}>
                <Link
                  to={`/domain/${dom.id}`}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: 'var(--color-ivory)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textTransform: 'uppercase'
                  }}
                >
                  <span>Domain Intelligence</span>
                  <ArrowRight size={14} style={{ color: 'var(--color-accent)' }} />
                </Link>

                <Link
                  to={`/roadmap/${dom.id}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-3)',
                    textDecoration: 'none'
                  }}
                >
                  [8-SEM ROADMAP]
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
