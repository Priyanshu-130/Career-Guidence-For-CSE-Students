import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, BookOpen, Clock, Activity, FileText, ChevronRight, User, Loader2, Target, Sparkles, Trophy, Zap, MousePointer2 } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    if (user?.email && !user.isGuest) {
      fetch(`http://127.0.0.1:5000/api/results/${user.email}`)
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

  return (
    <div className="page-wrapper content-container" style={{ paddingTop: '1rem' }}>
      
      {/* Dynamic Header */}
      <header style={{ marginBottom: '4rem' }}>
        <div className="page-label" style={{ marginBottom: '1.25rem' }}>
          <Sparkles size={14} style={{ marginRight: '6px' }} /> Engineering Intelligence Hub
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>
          {greeting()}, <span className="text-gradient">{user?.name.split(' ')[0]}!</span>
        </h1>
        <p style={{ color: 'var(--color-text-3)', fontSize: '1.125rem', maxWidth: '600px' }}>
          Your specialized trajectory is currently <span style={{ color: 'var(--color-accent)', fontWeight: 800 }}>{history.length > 0 ? 'Optimal' : 'Pending Diagnosis'}</span>. Explore your matched domains below.
        </p>
      </header>

      {/* Hero Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-accent)', borderRadius: '16px' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Assessments</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{history.length}</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--color-purple)', borderRadius: '16px' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Specializations</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{new Set(history.map(h => h.recommended_domain)).size}</div>
          </div>
        </div>
        <Link to="/career-finder" className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--color-accent)', color: '#fff', border: 'none' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.2)', color: '#fff', borderRadius: '16px' }}>
            <Zap size={24} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase' }}>Diagnostic</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>Quick Start</div>
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
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-success)' }}>{item.confidence_score}%</div>
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
                <Link to="/quiz" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '1.25rem' }}>
                  <Target size={20} style={{ color: 'var(--color-accent)' }} /> 
                  <span>Take Full Diagnostic</span>
                </Link>
                <Link to="/domains" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '1.25rem' }}>
                  <BookOpen size={20} style={{ color: 'var(--color-purple)' }} /> 
                  <span>Browse Roadmaps</span>
                </Link>
             </div>
          </div>

          <div style={{ 
            padding: '2rem', borderRadius: 'var(--radius-lg)', 
            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)',
            textAlign: 'center'
          }}>
             <MousePointer2 size={32} style={{ color: 'var(--color-accent)', margin: '0 auto 1.5rem', opacity: 0.5 }} />
             <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Interactive Insights</h4>
             <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', lineHeight: 1.6 }}>
               All trajectory reports are synchronized with real-world industry demand metrics.
             </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
