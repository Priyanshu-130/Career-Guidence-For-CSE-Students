import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Layers, 
  Zap, 
  Shield, 
  Terminal, 
  Cpu, 
  Globe, 
  Database,
  ExternalLink,
  Activity,
  Crosshair
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
    { id: 'ai', name: 'AI & Machine Learning', code: 'DOM-01', x: 20, y: 35, color: '#EB5E41', tag: 'High Growth', sub: 'Deep Learning, PyTorch, LLMs' },
    { id: 'systems', name: 'Systems & Operating Kernels', code: 'DOM-02', x: 75, y: 25, color: '#2EC4B6', tag: 'Core Foundational', sub: 'C++, Rust, Concurrency' },
    { id: 'security', name: 'Cybersecurity & Cryptography', code: 'DOM-03', x: 82, y: 70, color: '#E5A93C', tag: 'Critical Defense', sub: 'Zero-Trust, Reverse Eng' },
    { id: 'cloud', name: 'Cloud & Distributed Systems', code: 'DOM-04', x: 38, y: 80, color: '#38BDF8', tag: 'Infrastructure', sub: 'Kubernetes, Kafka, Go' },
    { id: 'data', name: 'Data Engineering & Science', code: 'DOM-05', x: 55, y: 45, color: '#F3EFE6', tag: 'Analytical', sub: 'Spark, SQL, Analytics' },
    { id: 'web', name: 'Full Stack & Web Architecture', code: 'DOM-06', x: 18, y: 68, color: '#B5BED0', tag: 'Product Eng', sub: 'React, Node.js, GraphQL' }
  ];

  const activeNodeInfo = domainNodes.find(d => d.id === activeDomainNode) || domainNodes[0];

  return (
    <div className="page-wrapper content-container animate-in" style={{ paddingBottom: '6rem' }}>
      
      {/* 1. TOP TECHNICAL TELEMETRY STRIP */}
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
        color: 'var(--color-text-3)',
        letterSpacing: '0.08em'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ 
            display: 'inline-block', 
            width: '8px', 
            height: '8px', 
            background: 'var(--color-accent)', 
            boxShadow: '0 0 8px var(--color-accent)' 
          }} />
          <span style={{ color: 'var(--color-ivory)', fontWeight: 600 }}>OBSERVATORY // TELEMETRY: ACTIVE</span>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <span>STATION: CSE-AST-2026</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>ENGINE: <span style={{ color: 'var(--color-ivory)' }}>ADAPTIVE-TRIFOCAL</span></span>
          <span>BANK: <span style={{ color: 'var(--color-success)' }}>109 VERIFIED ITEMS</span></span>
          <span>LATENCY: <span style={{ color: 'var(--color-ivory)' }}>14ms</span></span>
        </div>
      </div>

      {/* 2. GRAND HERO SECTION */}
      <section style={{ marginBottom: '5rem', position: 'relative' }}>
        <div style={{ maxWidth: '1000px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            background: 'rgba(235, 94, 65, 0.08)',
            border: '1px solid rgba(235, 94, 65, 0.3)',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '1.75rem'
          }}>
            <Crosshair size={13} />
            <span>ACADEMIC TRAJECTORY ACCELERATOR</span>
          </div>

          {/* Main Heading per specification */}
          <h1 style={{
            fontSize: 'clamp(3.8rem, 8.5vw, 7.5rem)',
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'var(--color-ivory)',
            margin: '0 0 1.75rem 0',
            fontFamily: 'var(--font-display)'
          }}>
            FIND YOUR<br />
            <span style={{ 
              color: 'transparent', 
              WebkitTextStroke: '2px var(--color-ivory)',
              display: 'inline-block' 
            }}>
              DIRECTION.
            </span>
          </h1>

          {/* Supporting Text per specification */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.125rem, 2vw, 1.35rem)',
            lineHeight: 1.6,
            color: 'var(--color-text-2)',
            maxWidth: '680px',
            marginBottom: '2.75rem'
          }}>
            Your CSE journey is not a predefined path. Discover your strengths, explore domains, and build a roadmap that matches your potential.
          </p>

          {/* Call to Actions per specification */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <Link 
              to="/quiz" 
              className="btn-primary"
              style={{
                background: 'var(--color-ivory)',
                color: '#06080E',
                border: '1px solid var(--color-ivory)',
                padding: '1.1rem 2.5rem',
                fontSize: '1.125rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              <span>Discover My Path</span>
              <ArrowRight size={18} />
            </Link>

            <Link 
              to="/domains" 
              className="btn-secondary"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '1.1rem 2.25rem',
                fontSize: '1.125rem',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              <span>Explore Domains</span>
            </Link>

            <Link 
              to="/assess"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-3)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.75rem 1rem',
                border: '1px dashed rgba(255,255,255,0.12)'
              }}
            >
              <Terminal size={14} style={{ color: 'var(--color-accent)' }} />
              <span>OR TEST TOPIC LADDER [L1-L4] →</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE DOMAIN CONSTELLATION MAP */}
      <section style={{ marginBottom: '5rem' }}>
        <div className="observatory-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div className="mono-tag" style={{ marginBottom: '0.35rem' }}>
                TOPOLOGICAL DOMAIN SPACE // INTERACTIVE MAP
              </div>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>
                CSE Domain Constellation
              </h2>
            </div>
            
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-3)', textAlign: 'right' }}>
              <div>COORDINATES: [0x7F · 0x1A]</div>
              <div style={{ color: 'var(--color-accent)' }}>SELECTED: {activeNodeInfo.name}</div>
            </div>
          </div>

          {/* Interactive visual canvas mockup */}
          <div style={{
            position: 'relative',
            height: '360px',
            width: '100%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(16, 21, 36, 0.8) 0%, rgba(6, 8, 14, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '1.75rem',
            overflow: 'hidden'
          }}>
            
            {/* SVG Lines connecting nodes */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(235, 94, 65, 0.4)" />
                  <stop offset="100%" stopColor="rgba(46, 196, 182, 0.4)" />
                </linearGradient>
              </defs>
              <line x1="20%" y1="35%" x2="55%" y2="45%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="55%" y1="45%" x2="75%" y2="25%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="75%" y1="25%" x2="82%" y2="70%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="82%" y1="70%" x2="38%" y2="80%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="38%" y1="80%" x2="18%" y2="68%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="18%" y1="68%" x2="20%" y2="35%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="20%" y1="35%" x2="38%" y2="80%" stroke="url(#lineGrad)" strokeWidth="1.5" />
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
                    background: isSelected ? node.color : '#101524',
                    border: `2px solid ${node.color}`,
                    margin: '0 auto',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? `0 0 16px ${node.color}` : 'none'
                  }} />
                  <div style={{
                    marginTop: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.05em',
                    color: isSelected ? 'var(--color-ivory)' : 'var(--color-text-3)',
                    background: isSelected ? 'rgba(16, 21, 36, 0.9)' : 'transparent',
                    padding: '2px 6px',
                    whiteSpace: 'nowrap',
                    border: isSelected ? `1px solid ${node.color}` : 'none'
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
            padding: '1.25rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <span className="mono-tag" style={{ color: activeNodeInfo.color }}>{activeNodeInfo.code}</span>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-ivory)' }}>{activeNodeInfo.name}</h3>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.6875rem', 
                  padding: '2px 8px', 
                  background: 'rgba(255,255,255,0.06)', 
                  color: 'var(--color-text-2)' 
                }}>
                  {activeNodeInfo.tag}
                </span>
              </div>
              <div style={{ color: 'var(--color-text-3)', fontSize: '0.875rem' }}>
                Core Competencies: <span style={{ color: 'var(--color-text-2)' }}>{activeNodeInfo.sub}</span>
              </div>
            </div>

            <Link
              to={`/domain/${activeNodeInfo.id}`}
              className="btn-secondary"
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>Inspect Specialization</span>
              <ExternalLink size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. TECHNICAL ARCHITECTURE MATRIX (4 GRID PANELS) */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="mono-tag" style={{ marginBottom: '0.35rem' }}>SYSTEM PLATFORM ARCHITECTURE</div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Scientific Diagnostic Modules</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          
          <div className="observatory-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div className="mono-tag">MOD-01</div>
              <Compass size={22} style={{ color: 'var(--color-accent)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>O*NET Career Profiling</h3>
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Calibrated items from the U.S. Dept of Labor O*NET Interest Profiler mapping your natural affinity to RIASEC occupational dimensions.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent)' }}>
              OUTPUT: DOMAIN WEIGHT MATRIX
            </div>
          </div>

          <div className="observatory-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div className="mono-tag">MOD-02</div>
              <Zap size={22} style={{ color: 'var(--color-amber)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Bebras Logic Tasks</h3>
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Language-agnostic computational thinking tasks assessing graph traversal, binary state analysis, and algorithmic pattern recognition.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-amber)' }}>
              OUTPUT: COGNITIVE APTITUDE SCORE
            </div>
          </div>

          <div className="observatory-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div className="mono-tag">MOD-03</div>
              <Layers size={22} style={{ color: 'var(--color-success)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Code.org Guided Labs</h3>
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Scenario-based software engineering simulations covering database queries, system scalability, and security posture tradeoffs.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-success)' }}>
              OUTPUT: PRACTICAL READINESS INDEX
            </div>
          </div>

          <div className="observatory-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div className="mono-tag">MOD-04</div>
              <Activity size={22} style={{ color: 'var(--color-cyan)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>8-Semester Roadmap</h3>
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Personalized technical progression plan with starting depths dynamically tuned to your evaluated topic mastery levels.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)' }}>
              OUTPUT: CURRICULUM SYLLABUS
            </div>
          </div>

        </div>
      </section>

      {/* 5. ACTIVE STUDENT TELEMETRY BANNER (IF PREVIOUS RESULT EXISTS) */}
      {history.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <div className="observatory-panel" style={{ 
            padding: '2.5rem', 
            borderLeft: '4px solid var(--color-accent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div>
              <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>
                RECORDED TELEMETRY // ACTIVE PROFILE
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                Primary Specialization: <span style={{ color: 'var(--color-accent)' }}>{history[0]?.recommended_domain}</span>
              </h2>
              <p style={{ color: 'var(--color-text-2)', maxWidth: '600px', margin: 0, fontSize: '0.9375rem' }}>
                Diagnostic confidence factor evaluated at {history[0]?.confidence_score || 88}%. Explore your detailed skill radar or review your semester progression milestones.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/results" className="btn-primary" style={{ padding: '0.9rem 1.75rem' }}>
                <span>Inspect Result Telemetry</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/domains" className="btn-secondary" style={{ padding: '0.9rem 1.75rem' }}>
                <span>Compare Disciplines</span>
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
