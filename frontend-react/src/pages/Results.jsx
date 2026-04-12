import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from '../data/questions';
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
import { Activity, Compass, AlertCircle, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Results() {
  const [resultsData] = useState(() => {
    const raw = sessionStorage.getItem("quiz_results");
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!resultsData) {
      navigate('/quiz');
    }
  }, [navigate, resultsData]);

  if (!resultsData) return null;

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
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
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
        backgroundColor: '#1e293b',
        titleFont: { family: 'Outfit', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { 
        beginAtZero: true, max: 4, 
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: { 
        grid: { display: false },
        ticks: { color: '#f8fafc', font: { family: 'Outfit', weight: '600' } }
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
        
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ 
              fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', 
              background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 2.5rem', 
              borderRadius: '999px', display: 'inline-block' 
          }}>
            {resultsData.match_percentage.toFixed(1)}% Alignment Score
          </div>
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
                    <span style={{ fontWeight: 600, color: idx === primaryIdx ? '#fff' : 'var(--color-text-3)' }}>{label}</span>
                    <span style={{ fontWeight: 800, color: idx === primaryIdx ? 'var(--color-success)' : 'inherit' }}>{((chartValues[idx]/4)*100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
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
