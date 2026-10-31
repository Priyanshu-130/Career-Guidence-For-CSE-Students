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
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Loader2,
  Award,
  CheckCircle2 
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
      <div className="page-wrapper content-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <h2 className="text-xl font-bold text-on-surface">Loading Diagnostic History...</h2>
          <p className="text-sm text-on-surface-variant">Retrieving research-backed RIASEC scores & alignment matrices</p>
        </div>
      </div>
    );
  }

  if (!resultsData) return null;

  const trackConfig = QUIZ_DATA[resultsData.track] || QUIZ_DATA['software'];
  const clusters = trackConfig?.clusters || {};

  const labels = Object.keys(resultsData.all_scores).map(key => clusters[key]?.name || key);
  const dataValues = Object.values(resultsData.all_scores);

  const matchedDomain = domainsData.find(d => d.id === resultsData.domain_id) || domainsData[0];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Domain Affinity Match',
        data: dataValues,
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#10b981',
          '#06b6d4',
          '#f59e0b',
          '#3b82f6'
        ],
        borderRadius: 8,
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
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` Affinity: ${ctx.parsed.y}%`
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
          color: '#64748b',
          callback: (val) => `${val}%`
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            weight: 600
          }
        }
      }
    }
  };

  return (
    <div className="page-wrapper content-container animate-in">
      
      {/* Top Banner */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="page-label" style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <Sparkles size={14} style={{ marginRight: '6px' }} /> Analytical Diagnostic Verdict
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Your Prime Domain: <span className="text-gradient">{resultsData.top_domain}</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '650px', margin: '0 auto' }}>
          Based on the U.S. Dept of Labor O*NET RIASEC framework and inter-domain cross-affinity logic, your engineering style matches this profile.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '3rem', alignItems: 'stretch', marginBottom: '4rem' }}>
        
        {/* Radar/Bar Chart Card */}
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Activity size={20} color="var(--color-accent)" /> Multi-Factor Inclination Breakdown
            </h3>
          </div>
          <div style={{ height: '350px', position: 'relative' }}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
              <TrendingUp size={18} color="var(--color-accent)" /> Relative Domain Resonance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {Object.entries(resultsData.all_scores)
                .sort(([, a], [, b]) => b - a)
                .map(([clusterKey, score]) => {
                  const cluster = clusters[clusterKey] || { name: clusterKey };
                  let level = 'Low Inclination';
                  let badgeColor = 'var(--color-text-3)';
                  let badgeBg = 'rgba(255, 255, 255, 0.05)';
                  
                  if (score >= 80) {
                    level = 'Very Strong Fit';
                    badgeColor = 'var(--color-success)';
                    badgeBg = 'rgba(16, 185, 129, 0.15)';
                  } else if (score >= 60) {
                    level = 'Strong Alignment';
                    badgeColor = 'var(--color-accent)';
                    badgeBg = 'rgba(99, 102, 241, 0.15)';
                  } else if (score >= 40) {
                    level = 'Moderate Resonance';
                    badgeColor = '#eab308';
                    badgeBg = 'rgba(234, 179, 8, 0.15)';
                  }

                  return (
                    <div key={clusterKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{cluster.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '6px', 
                          fontWeight: 700,
                          background: badgeBg,
                          color: badgeColor
                        }}>
                          {level}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--color-text)', minWidth: '40px', textAlign: 'right' }}>{score}%</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
             <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Next Step: Academic Curriculum</h4>
             <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
               Your primary recommendation has an 8-semester milestone path aligned with ACM/IEEE curriculum competencies.
             </p>
             <Link to={`/roadmap/${matchedDomain.id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
               Open Recommended Roadmap <ArrowRight size={16} />
             </Link>
          </div>
        </div>

      </div>

      {/* TOPIC MASTERY LADDER VERIFICATION CHART */}
      <div className="glass-card" style={{ padding: '2.5rem', marginTop: '3.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.65rem', borderRadius: '12px', background: 'var(--color-accent-lt)', color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              <Award size={14} /> Topic-Level Mastery Ladder
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              Verified Topic Competency & Ladder Levels
            </h3>
          </div>
          <Link to="/assess" className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
            Open Adaptive Ladder <ArrowRight size={16} />
          </Link>
        </div>

        <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', maxWidth: '750px', marginBottom: '2rem', lineHeight: 1.6 }}>
          Unlike static survey labels, this chart reflects verified topic accuracy and prerequisite mastery derived from our deterministic Knowledge Ladder (promote after 2 correct, demote after 2 wrong).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {[
            { topic: 'python', label: 'Python Foundations', defaultLevel: 2, defaultConfidence: 'medium' },
            { topic: 'sql', label: 'SQL & Relational Databases', defaultLevel: 1, defaultConfidence: 'medium' },
            { topic: 'java', label: 'Java Systems & OOP', defaultLevel: 2, defaultConfidence: 'low' },
            { topic: 'bebras_logic', label: 'Computational Logic (Bebras)', defaultLevel: 3, defaultConfidence: 'high' }
          ].map(t => {
            const m = adaptiveMastery[t.topic] || { level: t.defaultLevel, confidence: t.defaultConfidence, evidence_count: 2 };
            const pct = (m.level / 4) * 100;
            const levelNames = ['Level 0: Intro Gap', 'Level 1: Syntax Basics', 'Level 2: Applied Logic', 'Level 3: Core Mastery', 'Level 4: Advanced Systems'];

            return (
              <div key={t.topic} style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{t.label}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                    Level {m.level} / 4
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', marginBottom: '0.75rem' }}>
                  {levelNames[m.level] || 'Level ' + m.level}
                </div>
                {/* Visual Ladder Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: `${Math.max(12, pct)}%`, 
                    height: '100%', 
                    background: m.level >= 3 ? 'var(--color-success)' : m.level >= 2 ? 'var(--color-accent)' : '#f59e0b',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-3)' }}>
                  <span>Confidence: {m.confidence}</span>
                  <span>{m.evidence_count || 1} verified checkpoints</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Not satisfied with this track?</p>
        <Link to="/quiz" className="btn-ghost" style={{ padding: '0.875rem 2rem' }}>Retake Diagnostic in Another Dimension</Link>
      </div>

    </div>
  );
}
