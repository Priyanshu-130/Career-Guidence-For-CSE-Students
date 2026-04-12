import React from 'react';
import { Link } from 'react-router-dom';
import domains from '../data/domains.json';
import { BookOpen, ArrowRight, Shield, Cpu, Cloud, Globe, Wifi, Settings, Database, Brain } from 'lucide-react';

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

export default function DomainsList() {
  return (
    <div className="page-wrapper content-container animate-in">
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Explore Tech <span className="text-gradient">Domains.</span></h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '700px', margin: '1.5rem auto 0' }}>
          Our industry-aligned curriculum spans 9 specialized trajectories. Each path is mapped to real-world software & hardware competencies.
        </p>
      </div>

      <div className="domains-grid">
        {domains.map(domain => (
          <Link 
            to={`/domain/${domain.id}`} 
            className="glass-card" 
            key={domain.id} 
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minHeight: '340px'
            }}
          >
            <div style={{ padding: '2.5rem', position: 'relative' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '16px', 
                background: `${domain.color}15`, color: domain.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '2rem', border: `1px solid ${domain.color}33`
              }}>
                {iconMap[domain.id] || <BookOpen size={24} />}
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{domain.title}</h2>
              <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                {domain.description}
              </p>
            </div>
            
            <div style={{ 
              marginTop: 'auto', padding: '1.5rem 2.5rem', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid var(--color-border)'
            }}>
               <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: domain.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 Analyze Path
               </span>
               <div style={{ 
                 width: '32px', height: '32px', borderRadius: '50%', 
                 background: 'rgba(255,255,255,0.03)', color: domain.color, 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 border: '1px solid var(--color-border-gl)'
               }}><ArrowRight size={16} /></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
