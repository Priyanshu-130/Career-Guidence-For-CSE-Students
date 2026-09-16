import React from 'react';
import { Link } from 'react-router-dom';
import domains from '../data/domains.json';
import { BookOpen, ArrowRight, Shield, Cpu, Cloud, Globe, Wifi, Settings, Database, Brain, TrendingUp, Sparkles, Award } from 'lucide-react';

const iconMap = {
  ai: <Brain size={24} />,
  data: <Database size={24} />,
  web: <Globe size={24} />,
  security: <Shield size={24} />,
  cloud: <Cloud size={24} />,
  iot: <Wifi size={24} />,
  robotics: <Settings size={24} />,
  vlsi: <Cpu size={24} />,
  networking: <Wifi size={24} />
};

const DomainCard = ({ domain }) => (
  <Link 
    to={`/domain/${domain.id}`} 
    className="glass-card" 
    style={{ 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: '380px',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}
  >
    <div style={{ padding: '2.25rem', position: 'relative' }}>
      
      {/* Top bar with icon and WEF rank pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div style={{ 
          width: '54px', height: '54px', borderRadius: '16px', 
          background: `${domain.color}15`, color: domain.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${domain.color}33`
        }}>
          {iconMap[domain.id] || <BookOpen size={24} />}
        </div>

        {domain.wefInsight && (
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 800, 
            padding: '5px 12px', 
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            letterSpacing: '0.02em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={11} /> {domain.wefInsight.rank}
          </span>
        )}
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.875rem', fontWeight: 800 }}>{domain.title}</h2>
      <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
        {domain.description}
      </p>

      {/* WEF Highlight stat badge */}
      {domain.wefInsight && (
        <div style={{
          padding: '0.65rem 1rem',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.025)',
          border: '1px solid var(--color-border)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TrendingUp size={14} style={{ color: domain.color, flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>{domain.wefInsight.stat}</span>
        </div>
      )}
    </div>
    
    <div style={{ 
      marginTop: 'auto', padding: '1.25rem 2.25rem', 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderTop: '1px solid var(--color-border)',
      background: 'rgba(0,0,0,0.1)'
    }}>
       <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: domain.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
         Analyze Trajectory
       </span>
       <div style={{ 
         width: '32px', height: '32px', borderRadius: '50%', 
         background: 'rgba(255,255,255,0.03)', color: domain.color, 
         display: 'flex', alignItems: 'center', justifyContent: 'center',
         border: '1px solid var(--color-border-gl)'
       }}><ArrowRight size={16} /></div>
    </div>
  </Link>
);

export default function DomainsList() {
  const softwareDomains = domains.filter(d => d.category === 'software');
  const hardwareDomains = domains.filter(d => d.category === 'hardware');

  return (
    <div className="page-wrapper content-container animate-in">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>
          Explore Tech <span className="text-gradient">Domains.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '750px', margin: '1.5rem auto 0', lineHeight: 1.6 }}>
          Our industry-aligned curriculum spans 9 specialized trajectories — updated according to the latest workforce insights and emerging technology benchmarks from the <strong>World Economic Forum (WEF)</strong>.
        </p>
      </div>

      {/* WEF Global Market Banner */}
      <div className="glass-card" style={{ 
        padding: '2rem 2.5rem', 
        marginBottom: '4rem', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.06) 100%), var(--color-card)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', maxWidth: '750px' }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '14px', 
            background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              WEF Future of Jobs 2025/2026 Aligned
            </div>
            <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.4 }}>
              Tracking +170 Million new tech-driven roles & top emerging skill priorities across AI, Big Data, Security & Edge Infrastructure.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8125rem', fontWeight: 700, border: '1px solid var(--color-border)' }}>
            #1 Big Data
          </span>
          <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8125rem', fontWeight: 700, border: '1px solid var(--color-border)' }}>
            #2 AI Specialists
          </span>
          <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8125rem', fontWeight: 700, border: '1px solid var(--color-border)' }}>
            #3 Cyber & Security
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          Software Engineering Tracks
        </h2>
        <div className="domains-grid">
          {softwareDomains.map(domain => <DomainCard key={domain.id} domain={domain} />)}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          Hardware Engineering Tracks
        </h2>
        <div className="domains-grid">
          {hardwareDomains.map(domain => <DomainCard key={domain.id} domain={domain} />)}
        </div>
      </div>
    </div>
  );
}
