import React from 'react';
import { useParams, Link } from 'react-router-dom';
import domainsData from '../data/domains.json';
import { 
  BookOpen, 
  Wrench, 
  Trophy, 
  Briefcase, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft, 
  Target, 
  Globe, 
  MapPin, 
  Building2,
  Terminal,
  Crosshair,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import MiniQuiz from '../components/MiniQuiz';

export default function DomainDetail() {
  const { id } = useParams();
  const domain = domainsData.find(d => d.id === id);

  if (!domain) {
    return (
      <div className="page-wrapper content-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Domain Specification Not Found</h2>
        <Link to="/domains" className="btn-secondary">Return to Domain Registry</Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper content-container animate-in" style={{ paddingBottom: '6rem' }}>
      
      {/* 1. TOP NAV / TELEMETRY STRIP */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        border: '1px solid var(--color-border)',
        background: 'rgba(16, 21, 36, 0.45)',
        marginBottom: '2.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--color-text-3)'
      }}>
        <Link 
          to="/domains" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--color-text-2)', 
            textDecoration: 'none'
          }}
        >
          <ChevronLeft size={14} />
          <span>RETURN TO DOMAIN ARCHIVE</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span>IDENTIFIER: <span style={{ color: 'var(--color-accent)' }}>SPEC-{domain.id.toUpperCase()}</span></span>
          <span>MARKET: <span style={{ color: 'var(--color-success)' }}>{domain.insights?.jobDemand || 'HIGH DEMAND'}</span></span>
        </div>
      </div>

      {/* 2. HERO HEADER */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          border: '1px solid rgba(235, 94, 65, 0.3)',
          background: 'rgba(235, 94, 65, 0.06)',
          color: 'var(--color-accent)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem'
        }}>
          <span>CSE SPECIALIZATION INTELLIGENCE DOSSIER</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
          color: 'var(--color-ivory)'
        }}>
          {domain.title}
        </h1>

        <p style={{
          fontSize: 'clamp(1.125rem, 2vw, 1.35rem)',
          color: 'var(--color-text-2)',
          maxWidth: '850px',
          lineHeight: 1.6,
          margin: 0
        }}>
          {domain.description}
        </p>
      </section>

      {/* 3. MAIN DOSSIER LAYOUT (GRID: 1fr 340px) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Deep Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Field Overview & Scope */}
          <div className="observatory-panel" style={{ padding: '2.5rem' }}>
            <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>SECTION 01 // OVERVIEW & INDUSTRIAL CONTEXT</div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Domain Architecture & Industrial Scope</h2>
            <p style={{ color: 'var(--color-text-2)', fontSize: '1.0625rem', lineHeight: 1.8, margin: 0 }}>
              {domain.overview}
            </p>
          </div>

          {/* Prerequisites & Real-World Projects */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Prerequisites */}
            <div className="observatory-panel" style={{ padding: '2rem' }}>
              <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>SECTION 02 // PREREQUISITES</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Academic Prerequisites</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(domain.prerequisites || []).map(item => (
                  <div 
                    key={item} 
                    style={{ 
                      padding: '0.75rem 1rem', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid var(--color-border)', 
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-ivory)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ color: 'var(--color-accent)' }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Projects */}
            <div className="observatory-panel" style={{ padding: '2rem' }}>
              <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>SECTION 03 // PORTFOLIO</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Signature Projects</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(domain.projects || []).slice(0, 3).map((proj, idx) => (
                  <div key={proj.name} style={{ borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: idx < 2 ? '0.75rem' : '0' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ivory)', marginBottom: '0.25rem' }}>
                      {proj.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', lineHeight: 1.5 }}>
                      {proj.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Industry Trajectories & Global Employers */}
          <div className="observatory-panel" style={{ padding: '2.5rem' }}>
            <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>SECTION 04 // EMPLOYMENT RADAR</div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Market Trajectories & Global Ecosystem</h2>

            {/* Future Scope */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.125rem', color: 'var(--color-ivory)', marginBottom: '0.5rem' }}>Emerging Horizons</h4>
              <p style={{ color: 'var(--color-text-2)', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {domain.careerDetails?.futureScopeDetail || domain.insights?.futureScope}
              </p>
            </div>

            {/* Indian Hubs & Global Hotspots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
                <div className="mono-tag" style={{ marginBottom: '0.75rem' }}>NATIONAL TECH CORRIDORS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-2)' }}>
                  {(domain.careerDetails?.locations?.india || ['Bengaluru', 'Hyderabad', 'Pune', 'NCR']).map(loc => (
                    <div key={loc}>• {loc}</div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
                <div className="mono-tag" style={{ marginBottom: '0.75rem' }}>INTERNATIONAL HUBS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-2)' }}>
                  {(domain.careerDetails?.locations?.global || ['Silicon Valley, US', 'Munich, Germany', 'London, UK', 'Tokyo, Japan']).map(loc => (
                    <div key={loc}>• {loc}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Typical Roles */}
            <div>
              <div className="mono-tag" style={{ marginBottom: '0.75rem' }}>TYPICAL ROLES & DESIGNATIONS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(domain.roles || []).map(role => (
                  <span 
                    key={role} 
                    style={{ 
                      padding: '6px 14px', 
                      background: 'rgba(255,255,255,0.03)', 
                      color: 'var(--color-ivory)', 
                      fontSize: '0.8125rem', 
                      border: '1px solid var(--color-border)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Academic & Industry Verification Standard Citations */}
          <div className="observatory-panel" style={{ padding: '2.5rem' }}>
            <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>SECTION 05 // RESEARCH CITATIONS</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Accredited Standards & Global Curricula</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <a href="https://csed.acm.org/final-report/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '1rem', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)', display: 'block' }}>
                <div className="mono-tag" style={{ color: 'var(--color-accent)', marginBottom: '0.25rem' }}>CURRICULUM SPEC</div>
                <div style={{ fontWeight: 700, color: 'var(--color-ivory)', fontSize: '0.9375rem' }}>ACM/IEEE CS2023 Guidelines ↗</div>
                <div style={{ color: 'var(--color-text-3)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Undergraduate core competency definitions</div>
              </a>

              <a href="https://roadmap.sh/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '1rem', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)', display: 'block' }}>
                <div className="mono-tag" style={{ color: 'var(--color-success)', marginBottom: '0.25rem' }}>INDUSTRY PATH</div>
                <div style={{ fontWeight: 700, color: 'var(--color-ivory)', fontSize: '0.9375rem' }}>roadmap.sh Developer Matrix ↗</div>
                <div style={{ color: 'var(--color-text-3)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Community-verified engineering milestones</div>
              </a>

              <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '1rem', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)', display: 'block' }}>
                <div className="mono-tag" style={{ color: 'var(--color-amber)', marginBottom: '0.25rem' }}>MARKET DEMAND</div>
                <div style={{ fontWeight: 700, color: 'var(--color-ivory)', fontSize: '0.9375rem' }}>WEF Future of Jobs ↗</div>
                <div style={{ color: 'var(--color-text-3)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Emerging technological skill vectors</div>
              </a>
            </div>
          </div>

          {/* Mini Fit Check */}
          {domain.miniQuiz && domain.miniQuiz.length > 0 && (
            <div className="observatory-panel" style={{ padding: '2.5rem' }}>
              <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>SECTION 06 // DOMAIN FIT CHECK</div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Fast 5-Question Domain Aptitude</h2>
              <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
                Verify if your technical intuition aligns with core concepts in {domain.title}.
              </p>
              <MiniQuiz questions={domain.miniQuiz} domainName={domain.title} />
            </div>
          )}

        </div>

        {/* Right Sidebar: Quick Facts & Tech Stack */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick Facts Card */}
          <div className="observatory-panel" style={{ padding: '2rem' }}>
            <div className="mono-tag" style={{ marginBottom: '1rem' }}>TECHNICAL TELEMETRY</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-3)', textTransform: 'uppercase' }}>
                  MARKET DEMAND
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-ivory)' }}>
                  {domain.insights?.jobDemand || 'High Demand'}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-3)', textTransform: 'uppercase' }}>
                  LEARNING CURVE COMPLEXITY
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-ivory)' }}>
                  {domain.insights?.timeToLearn || '6-12 Months'}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-3)', textTransform: 'uppercase' }}>
                  ACCREDITATION CATEGORY
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-accent)' }}>
                  {domain.category?.toUpperCase() || 'SOFTWARE'}
                </div>
              </div>
            </div>
          </div>

          {/* Core Tools Stack */}
          <div className="observatory-panel" style={{ padding: '2rem' }}>
            <div className="mono-tag" style={{ marginBottom: '1rem' }}>PRODUCTION TECH STACK</div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(domain.tools || []).map(tool => (
                <span 
                  key={tool} 
                  style={{ 
                    padding: '6px 12px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--color-border)', 
                    fontSize: '0.75rem', 
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-2)'
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Launch Roadmap CTA */}
          <Link 
            to={`/roadmap/${domain.id}`} 
            className="btn-primary" 
            style={{ 
              padding: '1.25rem', 
              width: '100%', 
              justifyContent: 'center',
              fontSize: '1rem'
            }}
          >
            <span>Launch 8-Sem Roadmap</span>
            <ArrowRight size={18} />
          </Link>

        </aside>

      </div>

    </div>
  );
}
