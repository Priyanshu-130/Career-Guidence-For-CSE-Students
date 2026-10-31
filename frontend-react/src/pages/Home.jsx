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
    <div className="page-wrapper content-container" style={{ paddingTop: '1rem' }}>
      
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
          <div style={{ color: 'var(--color-accent)', marginBottom: '1.25rem' }}><Layers size={24} /></div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>9</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-3)' }}>Mapped CSE Career Paths</div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ color: 'var(--color-purple)', marginBottom: '1.25rem' }}><TrendingUp size={24} /></div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>
            {history.length > 0 ? `${Math.round(history[0].confidence_score)}%` : '94%'}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-3)' }}>Top Alignment Match</div>
        </div>

        <Link to="/assess" className="glass-card" style={{ 
          padding: '2rem', 
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textDecoration: 'none'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase' }}>Next-Gen Engine</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>Adaptive Assessment</div>
          </div>
          <ChevronRight size={24} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem', alignItems: 'start' }}>
        
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem' }}>Trajectory History</h2>
          </div>

          {loadingHistory ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={32} color="var(--color-accent)" style={{ margin: '0 auto' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((item, idx) => (
                <Link to="/results" key={idx} className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ 
                    width: '56px', height: '56px', borderRadius: '14px', 
                    background: item.quiz_type === 'software' ? 'var(--color-accent-lt)' : 'var(--color-purple-lt)',
                    color: item.quiz_type === 'software' ? 'var(--color-accent)' : 'var(--color-purple)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {item.quiz_type === 'software' ? <FileText size={24} /> : <Compass size={24} />}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>{item.recommended_domain}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', marginTop: '2px' }}>
                      {new Date(item.timestamp).toLocaleDateString()} • {item.quiz_type.toUpperCase()} TRACK
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-success)' }}>{Math.round(item.confidence_score)}%</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Match</div>
                  </div>
                  <ChevronRight size={18} style={{ opacity: 0.2 }} />
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 70%), var(--color-card)' }}>
             <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>Quick Actions</h3>
             <div style={{ display: 'grid', gap: '1rem' }}>
                <Link to="/assess" className="btn-primary" style={{ justifyContent: 'flex-start', padding: '1.25rem' }}>
                  <Sparkles size={20} />
                  <span>Start Adaptive Assessment</span>
                </Link>
                <Link to="/quiz" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '1.25rem' }}>
                  <Target size={20} style={{ color: 'var(--color-accent)' }} /> 
                  <span>Static Track Quizzes</span>
                </Link>
                <Link to="/domains" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '1.25rem' }}>
                  <BookOpen size={20} style={{ color: 'var(--color-purple)' }} /> 
                  <span>Browse Roadmaps</span>
                </Link>
             </div>
          </div>
        </aside>

      </div>

    </div>
  );
}
