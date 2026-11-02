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
  TrendingUp, 
  Loader2,
  Award,
  ExternalLink,
  ChevronRight,
  Zap,
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F4' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={36} className="animate-spin" style={{ color: '#E85D3F', margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '0.5rem' }}>
            Computing Diagnostic Telemetry...
          </h2>
          <p style={{ color: '#646A73', fontFamily: "'DM Mono', monospace", fontSize: '0.8125rem' }}>
            SYNTHESIZING O*NET RIASEC CODES & COMPUTATIONAL PROFILES
          </p>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div style={{
        minHeight: '80vh',
        backgroundColor: '#F7F7F4',
        color: '#17191C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DAD7',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          maxWidth: '640px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            color: '#E85D3F',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            backgroundColor: '#FFF0EB',
            border: '1px solid #E85D3F',
            padding: '0.35rem 0.85rem',
            fontWeight: 700
          }}>
            NO ACTIVE TELEMETRY RECORD
          </div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#17191C',
            marginBottom: '1rem'
          }}>
            Assessment Not Completed
          </h2>
          <p style={{ color: '#50545B', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            No diagnostic telemetry has been recorded for this session yet. Complete an assessment to generate your psychometric RIASEC profile, skill radar, and personalized career domain affinities.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/assess"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.75rem',
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
              <span>Start Adaptive Assessment</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/quiz"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.85rem 1.75rem',
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
              <span>Diagnostic Tracks</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          '#E85D3F',
          '#2EC4B6',
          '#D97706',
          '#0284C7',
          '#17191C',
          '#6366F1',
          '#EC4899'
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
        backgroundColor: '#17191C',
        titleColor: '#FFFFFF',
        bodyColor: '#D8DAD7',
        borderColor: '#D8DAD7',
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
          color: '#D8DAD7',
        },
        ticks: {
          color: '#646A73',
          font: { family: 'DM Mono', size: 11 },
          callback: (val) => `${val}%`
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#17191C',
          font: { family: 'Manrope', size: 12, weight: 600 }
        }
      }
    }
  };

  const rankedDomains = Object.entries(resultsData.all_scores || {})
    .sort(([, a], [, b]) => b - a);

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
          marginBottom: '3rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.75rem',
          color: '#646A73'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%',
              backgroundColor: '#2EC4B6'
            }} />
            <span style={{ color: '#17191C', fontWeight: 700 }}>DIAGNOSTIC REPORT // VERDICT COMPILED</span>
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span>STUDENT: {user?.email || 'GUEST_STUDENT'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>CONFIDENCE: <span style={{ color: '#17191C', fontWeight: 700 }}>{resultsData.confidence_score || resultsData.match_percentage || 88}%</span></span>
            <span>PATHWAY: <span style={{ color: '#E85D3F', fontWeight: 700 }}>{resultsData.track?.toUpperCase() || 'FOUNDATIONS'}</span></span>
          </div>
        </div>

        {/* 2. HEADER */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: '#E85D3F', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            EVALUATION VERDICT & DIRECTION
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: '0 0 1rem 0' }}>
            Your Recommended Trajectory
          </h1>
          <p style={{ color: '#50545B', fontSize: '1.125rem', maxWidth: '720px', margin: 0 }}>
            Synthesized through RIASEC occupational resonance, algorithmic logic deduction, and practical engineering simulation.
          </p>
        </div>

        {/* 3. HERO VERDICT: HIGH CONTRAST CARD */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #E85D3F',
          padding: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '3.5rem',
          position: 'relative'
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
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#E85D3F',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>
                PRIMARY SPECIALIZATION MATCH
              </div>

              <h2 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 800,
                color: '#17191C',
                lineHeight: 1,
                margin: '0 0 1rem 0',
                fontFamily: "'Barlow Condensed', sans-serif",
                textTransform: 'uppercase'
              }}>
                {resultsData.top_domain}
              </h2>

              <p style={{
                fontSize: '1.0625rem',
                color: '#50545B',
                maxWidth: '680px',
                lineHeight: 1.6,
                margin: '0 0 1.75rem 0'
              }}>
                {matchedDomain?.description || 
                 'High alignment with computational problem-solving, algorithmic formulation, and core systems design.'}
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontFamily: "'DM Mono', monospace", fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: '#646A73' }}>ALIGNMENT SCORE: </span>
                  <span style={{ fontWeight: 800, color: '#17191C' }}>{resultsData.match_percentage || resultsData.confidence_score || 88}%</span>
                </div>
                <div>
                  <span style={{ color: '#646A73' }}>RECOMMENDED PATH: </span>
                  <span style={{ fontWeight: 800, color: '#E85D3F' }}>8-SEMESTER ACADEMIC CURRICULUM</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '240px' }}>
              <Link 
                to={`/roadmap/${matchedDomain.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#17191C',
                  color: '#FFFFFF',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '1rem 2rem',
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
                <span>Explore Curriculum Roadmap</span>
                <ArrowRight size={16} />
              </Link>

              <Link 
                to={`/domain/${matchedDomain.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  color: '#17191C',
                  border: '1px solid #D8DAD7',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '0.85rem 1.5rem',
                  textDecoration: 'none',
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
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: '#E85D3F', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              DATA VECTOR // COMPARISON
            </div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '1.5rem' }}>
              Multi-Domain Affinity Spectrum
            </h3>
            <div style={{ height: '320px', position: 'relative' }}>
              <Bar options={chartOptions} data={chartData} />
            </div>
          </div>

          {/* Ranked Compatibility List */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2.5rem' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: '#E85D3F', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              RANKED RESONANCE // TOPOLOGIES
            </div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', marginBottom: '1.5rem' }}>
              Compatibility Matrix
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rankedDomains.slice(0, 5).map(([domTitle, score], idx) => {
                const matched = domainsData.find(d => d.title.toLowerCase().includes(domTitle.toLowerCase()) || domTitle.toLowerCase().includes(d.title.toLowerCase()));
                const domId = matched ? matched.id : 'ai';
                
                let statusLabel = 'Moderate Fit';
                let statusColor = '#D97706';
                if (score >= 80) {
                  statusLabel = 'Prime Direction';
                  statusColor = '#E85D3F';
                } else if (score >= 65) {
                  statusLabel = 'Strong Affinity';
                  statusColor = '#2EC4B6';
                }

                return (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      border: '1px solid #D8DAD7',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.75rem',
                        color: '#646A73',
                        fontWeight: 700,
                        width: '24px'
                      }}>
                        0{idx + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#17191C' }}>
                          {domTitle}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: statusColor, fontWeight: 700 }}>
                          {statusLabel}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 800, fontSize: '1.125rem', color: '#17191C' }}>
                        {score}%
                      </span>
                      <Link 
                        to={`/domain/${domId}`}
                        style={{ color: '#646A73', display: 'flex', alignItems: 'center' }}
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
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Zap size={18} style={{ color: '#E85D3F' }} />
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: 0 }}>
                Identified Core Strengths
              </h3>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.8 }}>
              <li><strong style={{ color: '#17191C' }}>Algorithmic Logic:</strong> High proficiency in conditional state deduction and loop tracing.</li>
              <li><strong style={{ color: '#17191C' }}>Pattern Recognition:</strong> Rapid identification of structural relationships and data transformations.</li>
              <li><strong style={{ color: '#17191C' }}>Occupational Resonance:</strong> Strong alignment with Investigative and Realistic RIASEC technical dimensions.</li>
            </ul>
          </div>

          {/* Growth Vectors */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <TrendingUp size={18} style={{ color: '#2EC4B6' }} />
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: 0 }}>
                Target Growth Vectors
              </h3>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.8 }}>
              <li><strong style={{ color: '#17191C' }}>System Architecture:</strong> Transition from isolated code snippets to large-scale modular subsystems.</li>
              <li><strong style={{ color: '#17191C' }}>Concurrency & Memory:</strong> Deep dive into threads, locks, and cache-conscious data layout.</li>
              <li><strong style={{ color: '#17191C' }}>Practical Deployment:</strong> Containerizing microservices and establishing CI/CD pipelines.</li>
            </ul>
          </div>

          {/* Skill Gap Analysis */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={18} style={{ color: '#D97706' }} />
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: 0 }}>
                Prerequisite Gap Analysis
              </h3>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.8 }}>
              <li><strong style={{ color: '#17191C' }}>SQL & Relational Schemas:</strong> Normalization and query optimization need practical reinforcement.</li>
              <li><strong style={{ color: '#17191C' }}>System Modeling:</strong> Formal UML state charts and API contracts before implementation.</li>
            </ul>
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #D8DAD7' }}>
              <Link 
                to="/assess"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#E85D3F',
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
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', padding: '2.5rem', marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: '#E85D3F', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                TOPIC-LEVEL MASTERY LADDER
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: 0 }}>
                Verified Core Engineering Competencies
              </h3>
            </div>
            
            <Link 
              to="/assess" 
              style={{
                padding: '0.75rem 1.5rem',
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
                gap: '0.5rem'
              }}
            >
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
                    backgroundColor: '#F7F7F4',
                    border: '1px solid #D8DAD7',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#17191C' }}>{t.label}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 800 }}>
                      L{m.level} / 4
                    </span>
                  </div>

                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73', marginBottom: '0.75rem' }}>
                    {levelNames[m.level]}
                  </div>

                  <div style={{ width: '100%', height: '4px', backgroundColor: '#D8DAD7', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: `${Math.max(15, pct)}%`,
                      height: '100%',
                      backgroundColor: m.level >= 3 ? '#2EC4B6' : m.level >= 2 ? '#E85D3F' : '#D97706',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73' }}>
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
          border: '1px solid #D8DAD7',
          backgroundColor: '#FFFFFF'
        }}>
          <div>
            <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 0.25rem 0', color: '#17191C' }}>
              Need to recalculate under different assumptions?
            </h4>
            <p style={{ color: '#50545B', margin: 0, fontSize: '0.875rem' }}>
              Retake the 21-question diagnostic or choose an alternate CSE specialization directly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              to="/quiz" 
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8DAD7',
                color: '#17191C',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.9375rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}
            >
              <span>Retake Diagnostic</span>
            </Link>
            <Link 
              to="/domains" 
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8DAD7',
                color: '#17191C',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.9375rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}
            >
              <span>Explore All 9 Domains</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
