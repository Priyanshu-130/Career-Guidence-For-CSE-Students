import React from 'react';
import { useParams, Link } from 'react-router-dom';
import domainsData from '../data/domains.json';
import { 
  BookOpen, 
  ArrowRight, 
  ChevronLeft, 
  ExternalLink
} from 'lucide-react';
import MiniQuiz from '../components/MiniQuiz';

export default function DomainDetail() {
  const { id } = useParams();
  const domain = domainsData.find(d => d.id === id);

  if (!domain) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', backgroundColor: '#F7F7F4', minHeight: '100vh', color: '#17191C' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Domain Specification Not Found</h2>
        <Link to="/domains" className="btn-secondary">Return to Domain Registry</Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        
        {/* 1. TOP NAV / TELEMETRY STRIP */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.75rem 1.25rem',
          border: '1px solid #D8DAD7',
          backgroundColor: '#FFFFFF',
          marginBottom: '2.5rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.75rem',
          color: '#646A73'
        }}>
          <Link 
            to="/domains" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: '#50545B', 
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            <ChevronLeft size={14} />
            <span>RETURN TO DOMAIN ARCHIVE</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span>IDENTIFIER: <span style={{ color: '#E85D3F', fontWeight: 700 }}>SPEC-{domain.id.toUpperCase()}</span></span>
            <span>MARKET: <span style={{ color: '#2EC4B6', fontWeight: 700 }}>{domain.insights?.jobDemand?.toUpperCase() || 'HIGH DEMAND'}</span></span>
          </div>
        </div>

        {/* 2. HERO HEADER */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            border: '1px solid #E85D3F',
            backgroundColor: '#FFF0EB',
            color: '#E85D3F',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem'
          }}>
            <span>CSE SPECIALIZATION INTELLIGENCE DOSSIER</span>
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(3rem, 6.5vw, 5rem)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            color: '#17191C',
            textTransform: 'uppercase'
          }}>
            {domain.title}
          </h1>

          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.35rem)',
            color: '#50545B',
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
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2.5rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                SECTION 01 // OVERVIEW & INDUSTRIAL CONTEXT
              </div>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '1.25rem' }}>
                Domain Architecture & Industrial Scope
              </h2>
              <p style={{ color: '#50545B', fontSize: '1.0625rem', lineHeight: 1.8, margin: 0 }}>
                {domain.overview}
              </p>
            </div>

            {/* Prerequisites & Real-World Projects */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              {/* Prerequisites */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  SECTION 02 // PREREQUISITES
                </div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '1.25rem' }}>
                  Academic Prerequisites
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(domain.prerequisites || []).map(item => (
                    <div 
                      key={item} 
                      style={{ 
                        padding: '0.75rem 1rem', 
                        backgroundColor: '#F7F7F4', 
                        border: '1px solid #D8DAD7', 
                        fontSize: '0.875rem',
                        fontFamily: "'Manrope', sans-serif",
                        color: '#17191C',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ color: '#E85D3F' }}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Projects */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  SECTION 03 // PORTFOLIO
                </div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '1.25rem' }}>
                  Signature Projects
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(domain.projects || []).slice(0, 3).map((proj, idx) => (
                    <div key={proj.name} style={{ borderBottom: idx < 2 ? '1px solid #D8DAD7' : 'none', paddingBottom: idx < 2 ? '0.75rem' : '0' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#17191C', marginBottom: '0.25rem' }}>
                        {proj.name}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#50545B', lineHeight: 1.5 }}>
                        {proj.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Industry Trajectories & Global Employers */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2.5rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                SECTION 04 // EMPLOYMENT RADAR
              </div>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '1.5rem' }}>
                Market Trajectories & Global Ecosystem
              </h2>

              {/* Future Scope */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.125rem', color: '#17191C', fontWeight: 700, marginBottom: '0.5rem' }}>Emerging Horizons</h4>
                <p style={{ color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                  {domain.careerDetails?.futureScopeDetail || domain.insights?.futureScope}
                </p>
              </div>

              {/* Indian Hubs & Global Hotspots */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid #D8DAD7', backgroundColor: '#F7F7F4' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#646A73', marginBottom: '0.75rem' }}>
                    NATIONAL TECH CORRIDORS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: '#17191C' }}>
                    {(domain.careerDetails?.locations?.india || ['Bengaluru', 'Hyderabad', 'Pune', 'NCR']).map(loc => (
                      <div key={loc}>• {loc}</div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid #D8DAD7', backgroundColor: '#F7F7F4' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#646A73', marginBottom: '0.75rem' }}>
                    INTERNATIONAL HUBS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: '#17191C' }}>
                    {(domain.careerDetails?.locations?.global || ['Silicon Valley, US', 'Munich, Germany', 'London, UK', 'Tokyo, Japan']).map(loc => (
                      <div key={loc}>• {loc}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Typical Roles */}
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#646A73', marginBottom: '0.75rem' }}>
                  TYPICAL ROLES & DESIGNATIONS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(domain.roles || []).map(role => (
                    <span 
                      key={role} 
                      style={{ 
                        padding: '6px 14px', 
                        backgroundColor: '#F7F7F4', 
                        color: '#17191C', 
                        fontSize: '0.8125rem', 
                        border: '1px solid #D8DAD7',
                        fontWeight: 600
                      }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Academic & Industry Verification Standard Citations */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2.5rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                SECTION 05 // RESEARCH CITATIONS
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '1.25rem' }}>
                Accredited Standards & Global Curricula
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <a href="https://csed.acm.org/final-report/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '1rem', border: '1px solid #D8DAD7', backgroundColor: '#F7F7F4', display: 'block' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#E85D3F', marginBottom: '0.25rem' }}>CURRICULUM SPEC</div>
                  <div style={{ fontWeight: 700, color: '#17191C', fontSize: '0.9375rem' }}>ACM/IEEE CS2023 Guidelines ↗</div>
                  <div style={{ color: '#50545B', fontSize: '0.75rem', marginTop: '0.25rem' }}>Undergraduate core competency definitions</div>
                </a>

                <a href="https://roadmap.sh/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '1rem', border: '1px solid #D8DAD7', backgroundColor: '#F7F7F4', display: 'block' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#2EC4B6', marginBottom: '0.25rem' }}>INDUSTRY PATH</div>
                  <div style={{ fontWeight: 700, color: '#17191C', fontSize: '0.9375rem' }}>roadmap.sh Developer Matrix ↗</div>
                  <div style={{ color: '#50545B', fontSize: '0.75rem', marginTop: '0.25rem' }}>Community-verified engineering milestones</div>
                </a>

                <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '1rem', border: '1px solid #D8DAD7', backgroundColor: '#F7F7F4', display: 'block' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#D97706', marginBottom: '0.25rem' }}>MARKET DEMAND</div>
                  <div style={{ fontWeight: 700, color: '#17191C', fontSize: '0.9375rem' }}>WEF Future of Jobs ↗</div>
                  <div style={{ color: '#50545B', fontSize: '0.75rem', marginTop: '0.25rem' }}>Emerging technological skill vectors</div>
                </a>
              </div>
            </div>

            {/* Mini Fit Check */}
            {domain.miniQuiz && domain.miniQuiz.length > 0 && (
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2.5rem' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  SECTION 06 // DOMAIN FIT CHECK
                </div>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '0.5rem' }}>
                  Fast 5-Question Domain Aptitude
                </h2>
                <p style={{ color: '#50545B', fontSize: '0.9375rem', marginBottom: '2rem' }}>
                  Verify if your technical intuition aligns with core concepts in {domain.title}.
                </p>
                <MiniQuiz questions={domain.miniQuiz} domainName={domain.title} />
              </div>
            )}

          </div>

          {/* Right Sidebar: Quick Facts & Tech Stack */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Quick Facts Card */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73', fontWeight: 700, marginBottom: '1rem' }}>
                TECHNICAL TELEMETRY
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73', textTransform: 'uppercase' }}>
                    MARKET DEMAND
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#17191C' }}>
                    {domain.insights?.jobDemand || 'High Demand'}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73', textTransform: 'uppercase' }}>
                    LEARNING CURVE COMPLEXITY
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#17191C' }}>
                    {domain.insights?.timeToLearn || '6-12 Months'}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73', textTransform: 'uppercase' }}>
                    ACCREDITATION CATEGORY
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#E85D3F' }}>
                    {domain.category?.toUpperCase() || 'SOFTWARE'}
                  </div>
                </div>
              </div>
            </div>

            {/* Core Tools Stack */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73', fontWeight: 700, marginBottom: '1rem' }}>
                PRODUCTION TECH STACK
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(domain.tools || []).map(tool => (
                  <span 
                    key={tool} 
                    style={{ 
                      padding: '6px 12px', 
                      backgroundColor: '#F7F7F4', 
                      border: '1px solid #D8DAD7', 
                      fontSize: '0.75rem', 
                      fontFamily: "'DM Mono', monospace",
                      color: '#17191C',
                      fontWeight: 600
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
              style={{ 
                padding: '1.25rem', 
                width: '100%', 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#17191C',
                color: '#FFFFFF',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                border: '1px solid #17191C',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E85D3F';
                e.currentTarget.style.borderColor = '#E85D3F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#17191C';
                e.currentTarget.style.borderColor = '#17191C';
              }}
            >
              <span>Launch 8-Sem Roadmap</span>
              <ArrowRight size={18} />
            </Link>

          </aside>

        </div>

      </div>
    </div>
  );
}
