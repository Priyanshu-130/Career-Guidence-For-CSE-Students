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
  Crosshair
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        
        {/* 1. TOP TELEMETRY STRIP */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.75rem 1.25rem',
          border: '1px solid #D8DAD7',
          backgroundColor: '#FFFFFF',
          marginBottom: '3.5rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.75rem',
          color: '#646A73'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Crosshair size={14} style={{ color: '#E85D3F' }} />
            <span style={{ color: '#17191C', fontWeight: 700 }}>DOMAIN REGISTRY // SPECIALIZATIONS</span>
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span>9 ACCREDITED CSE TRACKS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>ACM/IEEE: <span style={{ color: '#2EC4B6', fontWeight: 700 }}>CURRICULUM ALIGNED</span></span>
            <span>SEMESTERS: <span style={{ color: '#17191C', fontWeight: 600 }}>1 THROUGH 8</span></span>
          </div>
        </div>

        {/* 2. HEADER */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: '#E85D3F', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            DISCIPLINE ARCHIVE
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: '0 0 1rem 0' }}>
            Explore CSE Specializations
          </h1>
          <p style={{ color: '#50545B', fontSize: '1.125rem', maxWidth: '720px', margin: 0 }}>
            Detailed intelligence briefings across software engineering, systems infrastructure, artificial intelligence, and hardware design.
          </p>
        </div>

        {/* 3. FILTER CONTROLS */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '3rem',
          borderBottom: '1px solid #D8DAD7',
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
                backgroundColor: filter === tab.id ? '#17191C' : '#FFFFFF',
                color: filter === tab.id ? '#FFFFFF' : '#50545B',
                border: filter === tab.id ? '1px solid #17191C' : '1px solid #D8DAD7',
                fontFamily: "'DM Mono', monospace",
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
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2.25rem',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8DAD7',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        backgroundColor: '#FFF0EB',
                        color: '#E85D3F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #E85D3F'
                      }}>
                        {iconMap[dom.id] || <BookOpen size={20} />}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73', fontWeight: 700 }}>
                          {code}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#2EC4B6', fontWeight: 700 }}>
                          {dom.category?.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.6875rem',
                      color: '#50545B',
                      padding: '3px 8px',
                      backgroundColor: '#F7F7F4',
                      border: '1px solid #D8DAD7',
                      fontWeight: 600
                    }}>
                      {dom.insights?.jobDemand || 'High Demand'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', color: '#17191C' }}>
                    {dom.title}
                  </h2>
                  <p style={{ color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    {dom.description}
                  </p>

                  {/* Skills Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '2rem' }}>
                    {(dom.skills || []).slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.6875rem',
                          color: '#17191C',
                          backgroundColor: '#F7F7F4',
                          padding: '3px 8px',
                          border: '1px solid #D8DAD7'
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
                  borderTop: '1px solid #D8DAD7'
                }}>
                  <Link
                    to={`/domain/${dom.id}`}
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: '#17191C',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    <span>Domain Intelligence</span>
                    <ArrowRight size={14} style={{ color: '#E85D3F' }} />
                  </Link>

                  <Link
                    to={`/roadmap/${dom.id}`}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.75rem',
                      color: '#646A73',
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
    </div>
  );
}
