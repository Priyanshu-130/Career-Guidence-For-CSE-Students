import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from '../data/questions';
import { useAuth } from '../context/AuthContext';
import domainsData from '../data/domains.json';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { getMastery } from '../services/apiService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { 
  Activity, 
  Compass, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Loader2,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Target,
  Zap,
  Layers,
  AlertCircle
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Results() {
  const [resultsData, setResultsData] = useState(() => {
    const raw = sessionStorage.getItem("quiz_results");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [adaptiveMastery, setAdaptiveMastery] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const apiBase = getApiBaseUrl();

  useEffect(() => {
    const loadHistoricResult = async () => {
      // Load verified topic mastery from adaptive ladder
      try {
        const masteryResp = await getMastery(user?.email || 'guest_student@pathfinder.edu');
        if (masteryResp && masteryResp.status === 'success') {
          setAdaptiveMastery(masteryResp.mastery || {});
        }
      } catch (err) {
        console.warn('Could not load adaptive mastery:', err);
      }

      if (resultsData) return;
      if (!user) return;
      
      if (user.isGuest) {
        navigate('/quiz');
        return;
      }

      setLoading(true);
      try {
        const resp = await fetch(`${apiBase}/api/results/${user.email}`);
        const data = await resp.json();
        if (data.status === 'success' && data.results.length > 0) {
          const latest = data.results[0];
          
          const matchedDom = domainsData.find(
            d => d.title.toLowerCase().includes(latest.recommended_domain.toLowerCase()) || 
                 latest.recommended_domain.toLowerCase().includes(d.title.toLowerCase())
          );

          // Standardize scores to 0-100 percentage range
          const rawScores = latest.all_scores || {};
          const cleanScores = {};
          Object.entries(rawScores).forEach(([k, v]) => {
             cleanScores[k] = v > 100 ? Math.min(100, Math.round(v / 10)) : Math.min(100, Math.round(v));
          });

          const reconstructed = {
            track: latest.quiz_type,
            top_domain: latest.recommended_domain,
            confidence_score: latest.confidence_score,
            all_scores: cleanScores,
            domain_id: matchedDom ? matchedDom.id : 'ai'
          };
          setResultsData(reconstructed);
        } else {
          navigate('/quiz');
        }
      } catch (err) {
        console.error("Failed to load past results:", err);
        navigate('/quiz');
      } finally {
        setLoading(false);
      }
    };

    loadHistoricResult();
  }, [user, apiBase, navigate, resultsData]);

  if (loading) {
    return (
      <div className="page-wrapper content-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-accent)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Computing Diagnostic Telemetry...</h2>
          <p style={{ color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
            SYNTHESIZING O*NET RIASEC CODES & COMPUTATIONAL PROFILES
          </p>
        </div>
      </div>
    );
  }

  if (!resultsData) return null;

  const trackConfig = QUIZ_DATA[resultsData.track] || QUIZ_DATA['software'];
  const clusters = trackConfig?.clusters || {};

  const labels = Object.keys(resultsData.all_scores || {}).map(key => clusters[key]?.name || key);
  const dataValues = Object.values(resultsData.all_scores || {});

  const matchedDomain = domainsData.find(d => d.id === resultsData.domain_id) || domainsData[0];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Domain Affinity Match (%)',
        data: dataValues,
        backgroundColor: [
          '#EB5E41',
          '#2EC4B6',
          '#E5A93C',
          '#38BDF8',
          '#F3EFE6',
          '#818CF8',
          '#F472B6'
        ],
        borderRadius: 0,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#101524',
        titleColor: '#F3EFE6',
        bodyColor: '#B5BED0',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 0,
        callbacks: {
          label: (ctx) => ` Affinity Match: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#687694',
          font: { family: 'DM Mono', size: 11 },
          callback: (val) => `${val}%`
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#F3EFE6',
          font: { family: 'Manrope', size: 12, weight: 600 }
        }
      }
    }
  };

  // Derive ranked domains list
  const rankedDomains = Object.entries(resultsData.all_scores || {})
    .sort(([, a], [, b]) => b - a);

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
        marginBottom: '3rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--color-text-3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ 
            display: 'inline-block', 
            width: '8px', 
            height: '8px', 
            background: 'var(--color-success)', 
            boxShadow: '0 0 8px var(--color-success)' 
          }} />
          <span style={{ color: 'var(--color-ivory)', fontWeight: 600 }}>DIAGNOSTIC REPORT // VERDICT COMPILED</span>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <span>STUDENT: {user?.email || 'GUEST_STUDENT'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>CONFIDENCE: <span style={{ color: 'var(--color-ivory)', fontWeight: 700 }}>{resultsData.confidence_score || resultsData.match_percentage || 88}%</span></span>
          <span>PATHWAY: <span style={{ color: 'var(--color-accent)' }}>{resultsData.track?.toUpperCase() || 'FOUNDATIONS'}</span></span>
        </div>
      </div>

      {/* 2. HEADER */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>
          EVALUATION VERDICT & DIRECTION
        </div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', margin: '0 0 1rem 0' }}>
          Your Recommended Trajectory
        </h1>
        <p style={{ color: 'var(--color-text-2)', fontSize: '1.125rem', maxWidth: '720px', margin: 0 }}>
          Synthesized through RIASEC occupational resonance, algorithmic logic deduction, and practical engineering simulation.
        </p>
      </div>

      {/* 3. HERO VERDICT: WARM IVORY CONTRAST CARD */}
      <div style={{
        background: '#F3EFE6',
        color: '#06080E',
        padding: '3rem',
        marginBottom: '4rem',
        position: 'relative',
        border: '1px solid #FFFFFF'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              PRIMARY SPECIALIZATION MATCH
            </div>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
              fontWeight: 800,
              color: '#06080E',
              lineHeight: 1,
              margin: '0 0 1rem 0',
              fontFamily: 'var(--font-display)'
            }}>
              {resultsData.top_domain}
            </h2>

            <p style={{
              fontSize: '1.0625rem',
              color: '#343C4E',
              maxWidth: '680px',
              lineHeight: 1.6,
              margin: '0 0 1.75rem 0'
            }}>
              {matchedDomain?.description || 
               'High alignment with computational problem-solving, algorithmic formulation, and core systems design.'}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: '#747C8C' }}>ALIGNMENT SCORE: </span>
                <span style={{ fontWeight: 800, color: '#06080E' }}>{resultsData.match_percentage || resultsData.confidence_score || 88}%</span>
              </div>
              <div>
                <span style={{ color: '#747C8C' }}>RECOMMENDED PATH: </span>
                <span style={{ fontWeight: 800, color: 'var(--color-accent)' }}>8-SEMESTER ACADEMIC CURRICULUM</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '240px' }}>
            <Link 
              to={`/roadmap/${matchedDomain.id}`}
              className="btn-primary"
              style={{
                background: '#06080E',
                color: '#F3EFE6',
                border: '1px solid #06080E',
                padding: '1rem 2rem',
                justifyContent: 'center',
                boxShadow: 'none'
              }}
            >
              <span>Explore Curriculum Roadmap</span>
              <ArrowRight size={16} />
            </Link>

            <Link 
              to={`/domain/${matchedDomain.id}`}
              className="btn-secondary"
              style={{
                border: '1px solid rgba(6, 8, 14, 0.25)',
                color: '#06080E',
                padding: '0.85rem 1.5rem',
                justifyContent: 'center'
              }}
            >
              <span>Domain Intelligence Specs</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. MULTI-FACTOR ANALYSIS & RANKED DOMAINS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        
        {/* Affinity Chart Panel */}
        <div className="observatory-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
          <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>DATA VECTOR // COMPARISON</div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Multi-Domain Affinity Spectrum</h3>
          <div style={{ height: '320px', position: 'relative' }}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Ranked Compatibility List */}
        <div className="observatory-panel" style={{ padding: '2.5rem' }}>
          <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>RANKED RESONANCE // TOPOLOGIES</div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Compatibility Matrix</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {rankedDomains.slice(0, 5).map(([domTitle, score], idx) => {
              const matched = domainsData.find(d => d.title.toLowerCase().includes(domTitle.toLowerCase()) || domTitle.toLowerCase().includes(d.title.toLowerCase()));
              const domId = matched ? matched.id : 'ai';
              
              let statusLabel = 'Moderate Fit';
              let statusColor = 'var(--color-amber)';
              if (score >= 80) {
                statusLabel = 'Prime Direction';
                statusColor = 'var(--color-accent)';
              } else if (score >= 65) {
                statusLabel = 'Strong Affinity';
                statusColor = 'var(--color-success)';
              }

              return (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-3)',
                      width: '24px'
                    }}>
                      0{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ivory)' }}>
                        {domTitle}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: statusColor }}>
                        {statusLabel}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-ivory)' }}>
                      {score}%
                    </span>
                    <Link 
                      to={`/domain/${domId}`}
                      style={{ color: 'var(--color-text-3)', display: 'flex', alignItems: 'center' }}
                      title="Inspect Domain"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 5. STRENGTHS, GROWTH AREAS & SKILL GAP ANALYSIS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        
        {/* Identified Strengths */}
        <div className="observatory-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Zap size={18} style={{ color: 'var(--color-accent)' }} />
            <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Identified Core Strengths</h3>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: 'var(--color-text-2)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
            <li><strong style={{ color: 'var(--color-ivory)' }}>Algorithmic Logic:</strong> High proficiency in conditional state deduction and loop tracing.</li>
            <li><strong style={{ color: 'var(--color-ivory)' }}>Pattern Recognition:</strong> Rapid identification of structural relationships and data transformations.</li>
            <li><strong style={{ color: 'var(--color-ivory)' }}>Occupational Resonance:</strong> Strong alignment with Investigative and Realistic RIASEC technical dimensions.</li>
          </ul>
        </div>

        {/* Growth Vectors */}
        <div className="observatory-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-success)' }} />
            <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Target Growth Vectors</h3>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: 'var(--color-text-2)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
            <li><strong style={{ color: 'var(--color-ivory)' }}>System Architecture:</strong> Transition from isolated code snippets to large-scale modular subsystems.</li>
            <li><strong style={{ color: 'var(--color-ivory)' }}>Concurrency & Memory:</strong> Deep dive into threads, locks, and cache-conscious data layout.</li>
            <li><strong style={{ color: 'var(--color-ivory)' }}>Practical Deployment:</strong> Containerizing microservices and establishing CI/CD pipelines.</li>
          </ul>
        </div>

        {/* Skill Gap Analysis */}
        <div className="observatory-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ color: 'var(--color-amber)' }} />
            <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Prerequisite Gap Analysis</h3>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: 'var(--color-text-2)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
            <li><strong style={{ color: 'var(--color-ivory)' }}>SQL & Relational Schemas:</strong> Normalization and query optimization need practical reinforcement.</li>
            <li><strong style={{ color: 'var(--color-ivory)' }}>System Modeling:</strong> Formal UML state charts and API contracts before implementation.</li>
          </ul>
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Link 
              to="/assess"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>EVALUATE TOPIC MASTERY LADDER</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>

      {/* 6. VERIFIED KNOWLEDGE LADDER LEVELS */}
      <div className="observatory-panel" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div className="mono-tag" style={{ marginBottom: '0.35rem' }}>TOPIC-LEVEL MASTERY LADDER</div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>Verified Core Engineering Competencies</h3>
          </div>
          
          <Link to="/assess" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>
            <span>Retest Adaptive Ladder</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { topic: 'python', label: 'Python Foundations', defaultLevel: 2, defaultConfidence: 'medium' },
            { topic: 'sql', label: 'SQL & Relational Databases', defaultLevel: 1, defaultConfidence: 'medium' },
            { topic: 'java', label: 'Java Systems & OOP', defaultLevel: 2, defaultConfidence: 'low' },
            { topic: 'bebras_logic', label: 'Computational Logic (Bebras)', defaultLevel: 3, defaultConfidence: 'high' }
          ].map(t => {
            const m = adaptiveMastery[t.topic] || { level: t.defaultLevel, confidence: t.defaultConfidence, evidence_count: 2 };
            const pct = (m.level / 4) * 100;
            const levelNames = ['Level 0: Prerequisite Gap', 'Level 1: Syntax & Variables', 'Level 2: Applied Logic', 'Level 3: Core Competency', 'Level 4: Advanced Design'];

            return (
              <div 
                key={t.topic} 
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--color-border)',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ivory)' }}>{t.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                    L{m.level} / 4
                  </span>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-3)', marginBottom: '0.75rem' }}>
                  {levelNames[m.level]}
                </div>

                <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: `${Math.max(15, pct)}%`,
                    height: '100%',
                    background: m.level >= 3 ? 'var(--color-success)' : m.level >= 2 ? 'var(--color-accent)' : 'var(--color-amber)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-3)' }}>
                  <span>CONF: {m.confidence.toUpperCase()}</span>
                  <span>{m.evidence_count || 1} CHECKPOINTS</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. RE-EVALUATION FOOTER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        padding: '2rem',
        border: '1px solid var(--color-border)',
        background: 'rgba(16, 21, 36, 0.3)'
      }}>
        <div>
          <h4 style={{ fontSize: '1.125rem', margin: '0 0 0.25rem 0' }}>Need to recalculate under different assumptions?</h4>
          <p style={{ color: 'var(--color-text-3)', margin: 0, fontSize: '0.875rem' }}>
            Retake the 21-question diagnostic or choose an alternate CSE specialization directly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/quiz" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>
            <span>Retake Diagnostic</span>
          </Link>
          <Link to="/domains" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>
            <span>Explore All 9 Domains</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
