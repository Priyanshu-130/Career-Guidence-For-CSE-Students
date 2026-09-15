import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, BookOpen, FileText, ChevronRight, Loader2, Target, MousePointer2 } from 'lucide-react';
import { getQuizResults } from '../services/apiService';

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
      getQuizResults(user.email)
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
    <div className="page-wrapper content-container" style={{ paddingTop: '2rem', maxWidth: '780px', margin: '0 auto' }}>
      
      {/* Dynamic Header */}
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.75rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '0.5rem' }}>
          {greeting()}, <span className="text-gradient">{user?.name.split(' ')[0]}!</span>
        </h1>
      </header>

      {/* Action Card ("What do you want to do?") */}
      <div className="glass-card" style={{ padding: '2rem 2.5rem', marginBottom: '3.5rem', background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent 70%), var(--color-card)' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-text)', textAlign: 'center' }}>
          What do you want to do?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <Link 
            to="/quiz" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '1.15rem 1.5rem', 
              borderRadius: 'var(--radius-lg)', 
              background: 'rgba(99, 102, 241, 0.06)',
              border: '1.5px solid rgba(99, 102, 241, 0.2)',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.05rem',
              transition: 'all 0.2s ease'
            }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <Target size={22} style={{ color: 'var(--color-accent)' }} /> 
              <span>Take Diagnostic</span>
            </div>
            <ChevronRight size={20} style={{ color: 'var(--color-text-3)' }} />
          </Link>

          <Link 
            to="/domains" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '1.15rem 1.5rem', 
              borderRadius: 'var(--radius-lg)', 
              background: 'rgba(168, 85, 247, 0.06)',
              border: '1.5px solid rgba(168, 85, 247, 0.2)',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.05rem',
              transition: 'all 0.2s ease'
            }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <BookOpen size={22} style={{ color: 'var(--color-purple)' }} /> 
              <span>Explore Roadmaps</span>
            </div>
            <ChevronRight size={20} style={{ color: 'var(--color-text-3)' }} />
          </Link>
        </div>
      </div>

      {/* Trajectory History Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Trajectory History</h2>
        </div>

        {loadingHistory ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={36} color="var(--color-accent)" style={{ margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {history.map((item, idx) => (
              <Link to="/results" key={idx} className="glass-card" style={{ padding: '1.5rem 2.25rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ 
                  width: '60px', height: '60px', borderRadius: '16px', 
                  background: item.quiz_type === 'software' ? 'var(--color-accent-lt)' : 'var(--color-purple-lt)',
                  color: item.quiz_type === 'software' ? 'var(--color-accent)' : 'var(--color-purple)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.quiz_type === 'software' ? <FileText size={26} /> : <Compass size={26} />}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{item.recommended_domain}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', marginTop: '3px' }}>
                    {new Date(item.timestamp).toLocaleDateString()} • {item.quiz_type.toUpperCase()} TRACK
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-success)' }}>{item.confidence_score}%</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Match</div>
                </div>
                <ChevronRight size={20} style={{ opacity: 0.3 }} />
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
