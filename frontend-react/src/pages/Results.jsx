import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from '../data/questions';
import { useAuth } from '../context/AuthContext';
import domainsData from '../data/domains.json';
import { getApiBaseUrl } from '../utils/roadmapHelper';
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
  const apiBase = getApiBaseUrl();

  useEffect(() => {
    const loadHistoricResult = async () => {
      if (resultsData) return; // already loaded in session
      
      if (!user) return; // Wait for user info to load
      
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
          
          // Match recommended_domain to get domain_id
          const matchedDom = domainsData.find(
            d => d.title.toLowerCase().includes(latest.recommended_domain.toLowerCase()) || 
                 latest.recommended_domain.toLowerCase().includes(d.title.toLowerCase())
          );

          const reconstructed = {
            track: latest.quiz_type,
            top_domain: latest.recommended_domain,
            domain_id: matchedDom ? matchedDom.id : 'ai',
            match_percentage: latest.confidence_score,
            scores: latest.all_scores
          };

          // Save to sessionStorage so it stays available
          sessionStorage.setItem("quiz_results", JSON.stringify(reconstructed));
          setResultsData(reconstructed);
        } else {
          // No history, redirect
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

  const getInclinationRating = (maxScore) => {
    if (maxScore <= 3) return { text: "Low Inclination", color: "#EF4444", desc: "You have a low psychological preference for this field at the moment." };
    if (maxScore <= 7) return { text: "Moderate Inclination", color: "#F59E0B", desc: "You show a moderate interest. This path is worth exploring but may not be your primary driver." };
    if (maxScore <= 12) return { text: "Strong Inclination", color: "#4F46E5", desc: "You have a strong logical and interest-based alignment with this domain!" };
    return { text: "Very Strong Domain Fit", color: "#10B981", desc: "Phenomenal! Your mindset and logical preferences represent a perfect fit for this field!" };
  };

  const rawScore = Math.round((resultsData.match_percentage / 100) * 30);
  const rating = getInclinationRating(rawScore);

  const trackData = QUIZ_DATA[resultsData.track];
  const clusters = Object.values(trackData.clusters);
  const chartLabels = clusters.map(c => c.name);
  const chartValues = Object.values(resultsData.scores);

  const sortedIndices = [...Array(chartValues.length).keys()].sort((a, b) => chartValues[b] - chartValues[a]);
  const primaryIdx = sortedIndices[0];
  const secondaryIdx = sortedIndices[1];
  
  const scoreDiff = chartValues[primaryIdx] - chartValues[secondaryIdx];
  const showComparison = scoreDiff <= 0.2; 

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Aptitude Alignment',
        data: chartValues,
        backgroundColor: 'rgba(79, 70, 229, 0.65)',
        borderColor: 'rgba(79, 70, 229, 0.9)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(79, 70, 229, 0.85)',
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Plus Jakarta Sans', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { 
        beginAtZero: true, max: 4, 
        grid: { color: 'rgba(15, 23, 42, 0.08)' },
        ticks: { color: '#64748B' }
      },
      y: { 
        grid: { display: false },
        ticks: { color: '#0F172A', font: { family: 'Plus Jakarta Sans', weight: '600' } }
      }
    },
  };

  return (
    <div className="page-wrapper content-container animate-in">
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="page-label" style={{ marginBottom: '1rem' }}><Sparkles size={14} style={{ marginRight: '6px' }} /> Diagnostic Complete</div>
        <h1 style={{ fontSize: '4rem' }}>Your Professional <span className="text-gradient">Trajectory.</span></h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '600px', margin: '1rem auto 0' }}>
          Based on our neuro-fuzzy analysis of your situational responses, we've identified the following career alignment.
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
            <strong>High Adaptability Detected:</strong> Your results for {chartLabels[primaryIdx]} and {chartLabels[secondaryIdx]} are nearly identical. Both paths are highly recommended.
          </p>
        </div>
      )}

      {/* Primary Result Card */}
      <section className="glass-card" style={{ 
        padding: '5rem 3rem', textAlign: 'center', marginBottom: '4rem',
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 40%), var(--color-card)'
      }}>
        <div className="page-label" style={{ marginBottom: '1.5rem' }}>Primary Recommended Domain</div>
        <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem' }}>{resultsData.top_domain}</h2>
        
        <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
              fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', 
              background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 2.5rem', 
              borderRadius: '999px', display: 'inline-block' 
          }}>
            {resultsData.match_percentage.toFixed(1)}% Alignment Score
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

        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '700px', margin: '0 auto 4rem', lineHeight: 1.8 }}>
          Your profile exhibits a unique combination of logical reasoning and technical orientation that perfectly matches the requirements for {resultsData.top_domain}.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to={`/domain/${resultsData.domain_id || resultsData.top_domain.toLowerCase().split(' ')[0]}`} className="btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1rem' }}>
             Explore Curriculum <ArrowRight size={20} />
          </Link>
          <Link to={`/roadmap/${resultsData.domain_id || resultsData.top_domain.toLowerCase().split(' ')[0]}`} className="btn-ghost" style={{ padding: '1.25rem 3rem', fontSize: '1rem' }}>
             Detailed Roadmap
          </Link>
        </div>
      </section>

      {/* Data Visualization Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem' }}>
        
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <Activity size={24} color="var(--color-accent)" />
            <h3 style={{ fontSize: '1.5rem' }}>Competency Mapping</h3>
          </div>
          <div style={{ height: '350px', position: 'relative' }}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp size={20} color="var(--color-accent)" />
              Profile Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chartLabels.map((label, idx) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600, color: idx === primaryIdx ? 'var(--color-text)' : 'var(--color-text-3)' }}>{label}</span>
                    <span style={{ fontWeight: 800, color: idx === primaryIdx ? 'var(--color-success)' : 'inherit' }}>{((chartValues[idx]/4)*100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(15,23,42,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(chartValues[idx]/4)*100}%`, 
                      background: idx === primaryIdx ? 'var(--color-accent)' : 'var(--color-border-gl)',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={24} />
             </div>
             <div>
               <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Verified Analysis</div>
               <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)' }}>Logic validated by industry mentors</div>
             </div>
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '6rem' }}>
        <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Not satisfied with this track?</p>
        <Link to="/quiz" className="btn-ghost" style={{ padding: '1rem 2rem' }}>Retake Diagnostic in Another Dimension</Link>
      </div>

    </div>
  );
}
