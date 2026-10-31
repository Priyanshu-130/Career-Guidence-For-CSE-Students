import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Compass, 
  Layers, 
  Zap, 
  Terminal, 
  Activity, 
  Crosshair, 
  ExternalLink
} from 'lucide-react';
import { getApiBaseUrl } from '../utils/roadmapHelper';

export default function Home() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [activeDomainNode, setActiveDomainNode] = useState('ai');

  useEffect(() => {
    if (user?.email && !user.isGuest) {
      fetch(`${getApiBaseUrl()}/api/results/${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setHistory(data.results || []);
          }
        })
        .catch(err => console.error("Failed to fetch history", err));
    } else {
      const stored = sessionStorage.getItem("quiz_results");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setHistory([parsed]);
        } catch (e) {}
      }
    }
  }, [user]);

  // Constellation domain nodes
  const domainNodes = [
    { id: 'ai', name: 'AI & Machine Learning', code: 'DOM-01', x: 20, y: 35, color: '#E85D3F', tag: 'High Growth', sub: 'Deep Learning, PyTorch, LLMs' },
    { id: 'systems', name: 'Systems & Operating Kernels', code: 'DOM-02', x: 75, y: 25, color: '#2EC4B6', tag: 'Core Foundational', sub: 'C++, Rust, Concurrency' },
    { id: 'security', name: 'Cybersecurity & Cryptography', code: 'DOM-03', x: 82, y: 70, color: '#D97706', tag: 'Critical Defense', sub: 'Zero-Trust, Reverse Eng' },
    { id: 'cloud', name: 'Cloud & Distributed Systems', code: 'DOM-04', x: 38, y: 80, color: '#0284C7', tag: 'Infrastructure', sub: 'Kubernetes, Kafka, Go' },
    { id: 'data', name: 'Data Engineering & Science', code: 'DOM-05', x: 55, y: 45, color: '#FFFFFF', tag: 'Analytical', sub: 'Spark, SQL, Analytics' },
    { id: 'web', name: 'Full Stack & Web Architecture', code: 'DOM-06', x: 18, y: 68, color: '#94A3B8', tag: 'Product Eng', sub: 'React, Node.js, GraphQL' }
  ];

  const activeNodeInfo = domainNodes.find(d => d.id === activeDomainNode) || domainNodes[0];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        
        {/* 1. TOP TECHNICAL TELEMETRY STRIP */}
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
          color: '#646A73',
          letterSpacing: '0.04em'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%',
              backgroundColor: '#E85D3F'
            }} />
            <span style={{ color: '#17191C', fontWeight: 700 }}>DIAGNOSTIC ENGINE: ACTIVE</span>
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span>STATION: CSE-AST-2026</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>ENGINE: <span style={{ color: '#17191C', fontWeight: 600 }}>ADAPTIVE-TRIFOCAL</span></span>
            <span>BANK: <span style={{ color: '#2EC4B6', fontWeight: 700 }}>109 VERIFIED ITEMS</span></span>
            <span>LATENCY: <span style={{ color: '#17191C' }}>14ms</span></span>
          </div>
        </div>

        {/* 2. GRAND HERO SECTION */}
        <section style={{ marginBottom: '5rem', maxWidth: '960px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: '#FFF0EB',
            border: '1px solid #E85D3F',
            color: '#E85D3F',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem'
          }}>
            <Crosshair size={13} />
            <span>ACADEMIC TRAJECTORY ACCELERATOR</span>
          </div>

          {/* Main Heading: High-contrast Jet Black */}
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#17191C',
            margin: '0 0 1.5rem 0'
          }}>
            FIND YOUR<br />
            DIRECTION.
          </h1>

          {/* Supporting Text: High-contrast Dark Slate */}
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.35rem)',
            lineHeight: 1.6,
            color: '#50545B',
            maxWidth: '680px',
            margin: '0 0 2.5rem 0'
          }}>
            Your CSE journey is not a predefined path. Discover your strengths, explore domains, and build a roadmap that matches your potential.
          </p>

          {/* Call to Actions */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <Link 
              to="/quiz" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                backgroundColor: '#17191C',
                color: '#FFFFFF',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '1.125rem 2.5rem',
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
              <span>Discover My Path</span>
              <ArrowRight size={18} />
            </Link>

            <Link 
              to="/domains" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                backgroundColor: '#FFFFFF',
                color: '#17191C',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '1.125rem 2.25rem',
                textDecoration: 'none',
                border: '1px solid #D8DAD7',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#17191C';
                e.currentTarget.style.backgroundColor = '#F7F7F4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#D8DAD7';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <span>Explore Domains</span>
            </Link>

            <Link 
              to="/assess"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.8125rem',
                color: '#50545B',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.25rem',
                border: '1px dashed #D8DAD7',
                backgroundColor: '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E85D3F';
                e.currentTarget.style.color = '#E85D3F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#D8DAD7';
                e.currentTarget.style.color = '#50545B';
              }}
            >
              <Terminal size={14} style={{ color: '#E85D3F' }} />
              <span>OR TEST TOPIC LADDER [L1-L4] →</span>
            </Link>
          </div>

        </section>

        {/* 3. INTERACTIVE DOMAIN CONSTELLATION MAP */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '2.5rem'
          }}>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#E85D3F',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem'
                }}>
                  TOPOLOGICAL DOMAIN SPACE // INTERACTIVE MAP
                </div>
                <h2 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '2rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#17191C',
                  margin: 0
                }}>
                  CSE Domain Constellation
                </h2>
              </div>
              
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73', textAlign: 'right' }}>
                <div>COORDINATES: [0x7F · 0x1A]</div>
                <div style={{ color: '#E85D3F', fontWeight: 600 }}>SELECTED: {activeNodeInfo.name}</div>
              </div>
            </div>

            {/* Dark Technical Radar Canvas: High Contrast Text & Nodes */}
            <div style={{
              position: 'relative',
              height: '360px',
              width: '100%',
              backgroundColor: '#20252B',
              border: '1px solid #343C4E',
              marginBottom: '1.75rem',
              overflow: 'hidden'
            }}>
              
              {/* SVG Connecting Lines */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line x1="20%" y1="35%" x2="55%" y2="45%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="55%" y1="45%" x2="75%" y2="25%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <line x1="75%" y1="25%" x2="82%" y2="70%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="82%" y1="70%" x2="38%" y2="80%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <line x1="38%" y1="80%" x2="18%" y2="68%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="18%" y1="68%" x2="20%" y2="35%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <line x1="20%" y1="35%" x2="38%" y2="80%" stroke="#E85D3F" strokeWidth="2" />
              </svg>

              {/* Nodes */}
              {domainNodes.map((node) => {
                const isSelected = activeDomainNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveDomainNode(node.id)}
                    style={{
                      position: 'absolute',
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: 2,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: isSelected ? '20px' : '12px',
                      height: isSelected ? '20px' : '12px',
                      backgroundColor: isSelected ? node.color : '#20252B',
                      border: `2px solid ${node.color}`,
                      margin: '0 auto',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 14px ${node.color}` : 'none'
                    }} />
                    <div style={{
                      marginTop: '8px',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      backgroundColor: isSelected ? '#17191C' : 'rgba(32, 37, 43, 0.85)',
                      padding: '2px 8px',
                      whiteSpace: 'nowrap',
                      border: `1px solid ${isSelected ? node.color : 'rgba(255, 255, 255, 0.15)'}`
                    }}>
                      {node.code} · {node.name.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Node Detail Card */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#F7F7F4',
              border: '1px solid #D8DAD7'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#E85D3F' }}>
                    {activeNodeInfo.code}
                  </span>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.35rem', fontWeight: 800, textTransform: 'uppercase', margin: 0, color: '#17191C' }}>
                    {activeNodeInfo.name}
                  </h3>
                  <span style={{ 
                    fontFamily: "'DM Mono', monospace", 
                    fontSize: '0.6875rem', 
                    padding: '2px 8px', 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #D8DAD7',
                    color: '#50545B' 
                  }}>
                    {activeNodeInfo.tag}
                  </span>
                </div>
                <div style={{ color: '#50545B', fontSize: '0.875rem' }}>
                  Core Competencies: <span style={{ color: '#17191C', fontWeight: 600 }}>{activeNodeInfo.sub}</span>
                </div>
              </div>

              <Link
                to={`/domain/${activeNodeInfo.id}`}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8DAD7',
                  color: '#17191C',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#17191C';
                  e.currentTarget.style.backgroundColor = '#FFF0EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D8DAD7';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <span>Inspect Specialization</span>
                <ExternalLink size={14} />
              </Link>
            </div>

          </div>
        </section>

        {/* 4. SCIENTIFIC DIAGNOSTIC MODULES (4 GRID PANELS) */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: '#E85D3F', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              SYSTEM PLATFORM ARCHITECTURE
            </div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: 0 }}>
              Scientific Diagnostic Modules
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#646A73' }}>MOD-01</span>
                <Compass size={22} style={{ color: '#E85D3F' }} />
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: '0 0 0.75rem 0' }}>
                O*NET Career Profiling
              </h3>
              <p style={{ color: '#50545B', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Calibrated items from the U.S. Dept of Labor O*NET Interest Profiler mapping your natural affinity to RIASEC occupational dimensions.
              </p>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700 }}>
                OUTPUT: DOMAIN WEIGHT MATRIX
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#646A73' }}>MOD-02</span>
                <Zap size={22} style={{ color: '#D97706' }} />
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: '0 0 0.75rem 0' }}>
                Bebras Logic Tasks
              </h3>
              <p style={{ color: '#50545B', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Language-agnostic computational thinking tasks assessing graph traversal, binary state analysis, and algorithmic pattern recognition.
              </p>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>
                OUTPUT: COGNITIVE APTITUDE SCORE
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#646A73' }}>MOD-03</span>
                <Layers size={22} style={{ color: '#2EC4B6' }} />
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: '0 0 0.75rem 0' }}>
                Code.org Guided Labs
              </h3>
              <p style={{ color: '#50545B', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Scenario-based software engineering simulations covering database queries, system scalability, and security posture tradeoffs.
              </p>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#2EC4B6', fontWeight: 700 }}>
                OUTPUT: PRACTICAL READINESS INDEX
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#646A73' }}>MOD-04</span>
                <Activity size={22} style={{ color: '#0284C7' }} />
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: '0 0 0.75rem 0' }}>
                8-Semester Roadmap
              </h3>
              <p style={{ color: '#50545B', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Personalized technical progression plan with starting depths dynamically tuned to your evaluated topic mastery levels.
              </p>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#0284C7', fontWeight: 700 }}>
                OUTPUT: CURRICULUM SYLLABUS
              </div>
            </div>

          </div>
        </section>

        {/* 5. ACTIVE STUDENT TELEMETRY BANNER (IF RECORDED) */}
        {history.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ 
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              borderLeft: '4px solid #E85D3F',
              padding: '2.5rem', 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2rem'
            }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700, marginBottom: '0.5rem' }}>
                  RECORDED TELEMETRY // ACTIVE PROFILE
                </div>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: '0 0 0.5rem 0' }}>
                  Primary Specialization: <span style={{ color: '#E85D3F' }}>{history[0]?.recommended_domain}</span>
                </h2>
                <p style={{ color: '#50545B', maxWidth: '600px', margin: 0, fontSize: '0.9375rem' }}>
                  Diagnostic confidence factor evaluated at {history[0]?.confidence_score || 88}%. Explore your detailed skill radar or review your semester progression milestones.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/results"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem 1.75rem',
                    backgroundColor: '#17191C',
                    color: '#FFFFFF',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  <span>Inspect Result Telemetry</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/domains"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem 1.75rem',
                    backgroundColor: '#FFFFFF',
                    color: '#17191C',
                    border: '1px solid #D8DAD7',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  <span>Compare Disciplines</span>
                </Link>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
