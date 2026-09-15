import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from '../data/questions';
import { useAuth } from '../context/AuthContext';
import domainsData from '../data/domains.json';
import { getQuizResults } from '../services/apiService';
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
import { Activity, Compass, AlertCircle, ArrowRight, Sparkles, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Results() {
  const [resultsData, setResultsData] = useState(() => {
    const raw = sessionStorage.getItem("quiz_results");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistoricResult = async () => {
      if (resultsData) return;
      if (!user) return;
      
      if (user.isGuest) {
        navigate('/quiz');
        return;
      }

      setLoading(true);
      try {
        const data = await getQuizResults(user.email);
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
            domain_id: matchedDom ? matchedDom.id : 'ai',
            match_percentage: Math.min(100, Math.round(latest.confidence_score)),
            scores: cleanScores
          };

          sessionStorage.setItem("quiz_results", JSON.stringify(reconstructed));
          setResultsData(reconstructed);
        } else {
          navigate('/quiz');
        }
      } catch (err) {
        console.error("Failed to load historic results", err);
        navigate('/quiz');
      } finally {
        setLoading(false);
      }
    };

    loadHistoricResult();
  }, [user, navigate, resultsData, apiBase]);

  if (loading || !resultsData) {
    return (
      <div className="page-wrapper content-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-accent)" />
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-3)', fontWeight: 600 }}>Analyzing trajectory metrics...</p>
      </div>
    );
  }

  const getInclinationRating = (percentage) => {
    if (percentage <= 35) return { text: "Exploratory Fit", color: "#EF4444", desc: "You show foundational interest in this track with room to grow." };
    if (percentage <= 65) return { text: "Moderate Inclination", color: "#F59E0B", desc: "You show balanced alignment. This path is recommended for further skill building." };
    if (percentage <= 85) return { text: "Strong Inclination", color: "#4F46E5", desc: "You have a strong logical and interest-based alignment with this domain!" };
    return { text: "Very Strong Domain Fit", color: "#10B981", desc: "Phenomenal! Your mindset and logical preferences represent a top-tier fit for this field!" };
  };

  const matchPct = Math.min(100, Math.max(0, Math.round(resultsData.match_percentage || 50)));
  const rating = getInclinationRating(matchPct);

  const trackData = QUIZ_DATA[resultsData.track] || QUIZ_DATA['software'];
  const clusters = Object.values(trackData.clusters || {});
  const chartLabels = clusters.map(c => c.name);
  
  // Normalize chart values strictly between 0 and 100
  const chartValues = chartLabels.map(label => {
    const val = resultsData.scores?.[label] || 0;
    return val > 100 ? Math.min(100, Math.round(val / 10)) : Math.min(100, Math.round(val));
  });

  const sortedIndices = [...Array(chartValues.length).keys()].sort((a, b) => chartValues[b] - chartValues[a]);
  const primaryIdx = sortedIndices[0] || 0;
  const secondaryIdx = sortedIndices[1] || 0;
  
  const scoreDiff = (chartValues[primaryIdx] || 0) - (chartValues[secondaryIdx] || 0);
  const showComparison = scoreDiff <= 5 && chartValues[secondaryIdx] > 0; 

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Aptitude Alignment (%)',
        data: chartValues,
        backgroundColor: 'rgba(79, 70, 229, 0.75)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1.5,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(79, 70, 229, 0.95)',
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: Math.max(2, window.devicePixelRatio || 2), // High-DPI crisp rendering
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Plus Jakarta Sans', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.raw}% Match`
        }
      }
    },
    scales: {
      x: { 
        beginAtZero: true, 
        max: 100, 
        grid: { color: 'rgba(15, 23, 42, 0.06)' },
        ticks: { 
          color: '#64748B',
          callback: (val) => `${val}%`
        }
      },
      y: { 
        grid: { display: false },
        ticks: { 
          color: '#0F172A', 
          font: { family: 'Plus Jakarta Sans', weight: '600', size: 12 } 
        }
      }
    },
  };

  return (
    <div className="page-wrapper content-container animate-in">
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="page-label" style={{ marginBottom: '1rem' }}><Sparkles size={14} style={{ marginRight: '6px' }} /> Diagnostic Complete</div>
        <h1 style={{ fontSize: '4rem' }}>Your Professional <span className="text-gradient">Trajectory.</span></h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '600px', margin: '1rem auto 0' }}>
          Based on our situational analysis of your responses, we've identified the following career alignment.
        </p>
      </div>

      {showComparison && (
        <div style={{ 
          background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', 
          padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', 
          display: 'flex', gap: '1.5rem', alignItems: 'center' 
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertCircle size={24} />
          </div>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-2)' }}>
            <strong>High Adaptability Detected:</strong> Your alignment scores for {chartLabels[primaryIdx]} and {chartLabels[secondaryIdx]} are closely balanced. Both paths offer strong opportunities.
          </p>
        </div>
      )}

      {/* Primary Result Card */}
      <section className="glass-card" style={{ 
        padding: '4rem 2rem', textAlign: 'center', marginBottom: '4rem',
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 40%), var(--color-card)'
      }}>
        <div className="page-label" style={{ marginBottom: '1.5rem' }}>Primary Recommended Domain</div>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--color-text)' }}>{resultsData.top_domain}</h2>
        
        <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
              fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', 
              background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 2.5rem', 
              borderRadius: '999px', display: 'inline-block' 
          }}>
            {matchPct}% Alignment Score
          </div>
          
          <div style={{ 
              fontSize: '1.15rem', fontWeight: 700, color: rating.color, 
              background: `${rating.color}10`, padding: '0.5rem 2rem', 
              borderRadius: '999px', border: `1px solid ${rating.color}25`,
              display: 'inline-block' 
          }}>
            Inclination level: {rating.text}
          </div>
          
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9375rem', color: 'var(--color-text-3)', maxWidth: '500px', lineHeight: 1.5 }}>
            {rating.desc}
          </p>
        </div>

        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-2)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.8 }}>
          Your profile exhibits a strong technical orientation and problem-solving preference that aligns with the requirements for {resultsData.top_domain}.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={`/domain/${resultsData.domain_id || resultsData.top_domain.toLowerCase().split(' ')[0]}`} className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
             Explore Curriculum <ArrowRight size={20} />
          </Link>
          <Link to={`/roadmap/${resultsData.domain_id || resultsData.top_domain.toLowerCase().split(' ')[0]}`} className="btn-ghost" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
             Detailed Roadmap
          </Link>
        </div>
      </section>

      {/* Data Visualization Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Activity size={24} color="var(--color-accent)" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Competency Mapping</h3>
          </div>
          <div style={{ height: '350px', position: 'relative' }}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
              <TrendingUp size={20} color="var(--color-accent)" />
              Profile Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {chartLabels.map((label, idx) => {
                const valPct = chartValues[idx] || 0;
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: 600, color: idx === primaryIdx ? 'var(--color-text)' : 'var(--color-text-3)' }}>{label}</span>
                      <span style={{ fontWeight: 800, color: idx === primaryIdx ? 'var(--color-success)' : 'inherit' }}>{valPct}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(15,23,42,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${valPct}%`, 
                        background: idx === primaryIdx ? 'var(--color-accent)' : 'var(--color-border-gl)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
             <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={22} />
             </div>
             <div>
               <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Verified Analysis</div>
               <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)' }}>Logic validated by industry mentors</div>
             </div>
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Not satisfied with this track?</p>
        <Link to="/quiz" className="btn-ghost" style={{ padding: '0.875rem 2rem' }}>Retake Diagnostic in Another Dimension</Link>
      </div>

    </div>
  );
}
