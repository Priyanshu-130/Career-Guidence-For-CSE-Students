import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Target, 
  ArrowRight, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Zap, 
  Layers,
  FileText,
  Loader2
} from 'lucide-react';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import NeuroLinkHero from '../components/NeuroLinkHero';

export default function Home() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (user?.email && !user.isGuest) {
      fetch(`${getApiBaseUrl()}/api/results/${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setHistory(data.results);
          }
        })
        .catch(err => console.error("Failed to fetch history", err))
        .finally(() => setLoadingHistory(false));
    } else {
      setHistory([
        { quiz_type: 'software', recommended_domain: 'Artificial Intelligence', confidence_score: 85, timestamp: new Date() },
        { quiz_type: 'hardware', recommended_domain: 'Robotics', confidence_score: 72, timestamp: new Date() }
      ]);
      setLoadingHistory(false);
    }
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* 1. Full-Viewport NeuroLink Hero Section */}
      <NeuroLinkHero />

      {/* 2. Main Dashboard Content */}
      <div className="page-wrapper content-container" style={{ paddingTop: '3rem' }}>
        
        {/* Dynamic Header */}
        <header style={{ marginBottom: '4rem' }}>
          <div className="page-label" style={{ marginBottom: '1.25rem' }}>
            <Sparkles size={14} style={{ marginRight: '6px' }} /> Engineering Intelligence Hub
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>
            {greeting()}, <span className="text-gradient">{user?.name ? user.name.split(' ')[0] : 'Engineer'}!</span>
          </h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: '1.125rem', maxWidth: '600px' }}>
            Your specialized trajectory is currently <span style={{ color: 'var(--color-accent)', fontWeight: 800 }}>{history.length > 0 ? 'Optimal' : 'Pending Diagnosis'}</span>. Explore your matched domains below.
          </p>
        </header>

        {/* Hero Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ color: 'var(--color-accent)', marginBottom: '1.25rem' }}>
              <Compass size={28} />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Primary Trajectory
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {history[0]?.recommended_domain || 'AI & Machine Learning'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-2)' }}>
              Confidence Factor: {history[0]?.confidence_score || 88}%
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ color: 'var(--color-purple)', marginBottom: '1.25rem' }}>
              <Zap size={28} />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Learning Pace
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Active Track
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-2)' }}>
              Curriculum Semester 3 Aligned
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ color: 'var(--color-success)', marginBottom: '1.25rem' }}>
              <Layers size={28} />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Verified Mastery
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Knowledge Ladder
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-2)' }}>
              Adaptive Assessment Active
            </div>
          </div>
        </div>

        {/* Quick Launch CTA */}
        <div className="glass-card" style={{ padding: '3rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Ready for your Diagnostic Career Evaluation?
            </h2>
            <p style={{ color: 'var(--color-text-3)', maxWidth: '600px', lineHeight: 1.6 }}>
              Take our U.S. Dept of Labor O*NET RIASEC career profiling quiz or test your skill mastery on our topic-level adaptive ladder.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/assess" className="btn-primary" style={{ padding: '0.875rem 1.75rem' }}>
              Adaptive Ladder <ArrowRight size={18} />
            </Link>
            <Link to="/quiz" className="btn-ghost" style={{ padding: '0.875rem 1.75rem' }}>
              RIASEC Career Quiz
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
