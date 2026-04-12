import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Compass, ShieldCheck, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, continuesAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuest = () => {
    continuesAsGuest();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();
      if (resp.ok && data.status === 'success') {
        login(data.student);
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.2fr 1fr', background: 'var(--color-bg)' }}>
      {/* Visual Side (Left) */}
      <div style={{ 
        position: 'relative', 
        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '6rem',
        overflow: 'hidden',
        borderRight: '1px solid var(--color-border)'
      }}>
        {/* Glow Effects */}
        <div style={{ 
          position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', 
          filter: 'blur(60px)' 
        }}></div>
        <div style={{ 
          position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', 
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', 
          filter: 'blur(60px)' 
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }} className="animate-in">
          <div style={{ 
            width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#fff', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
          }}>
            <Compass size={32} />
          </div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '2rem' }}>
            Engineer Your <span className="text-gradient">Potential.</span>
          </h1>

          {/* Floating Orb for Creativity */}
          <div style={{ 
            width: '200px', height: '200px', background: 'var(--color-accent)', 
            borderRadius: '50%', filter: 'blur(80px)', opacity: 0.2,
            position: 'absolute', top: '40%', left: '40%',
            animation: 'floatOrb 10s infinite ease-in-out'
          }}></div>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '500px', lineHeight: 1.7, marginBottom: '4rem' }}>
            The professional diagnostic platform for CSE students to identify their ideal career trajectory using neuro-fuzzy logic.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', color: 'var(--color-accent)' }}>
                <Zap size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Precision Diagnostics</h4>
                <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem' }}>Evaluate interest, aptitude, and orientation across 9 domains.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', color: 'var(--color-purple)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Secure Repository</h4>
                <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem' }}>Persistent storage of your roadmap progress and results history.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '3rem', left: '6rem', color: 'var(--color-text-3)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.05em' }}>
          &copy; 2026 CSE PATHFINDER • VERSION 2.0
        </div>
      </div>

      {/* Form Side (Right) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }} className="animate-in">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Student Login</h2>
            <p style={{ color: 'var(--color-text-3)' }}>Access your personalized career dashboard</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            {error && (
              <div style={{ 
                padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', 
                color: '#ef4444', borderRadius: '12px', fontSize: '0.8125rem', fontWeight: 600
              }}>
                {error}
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-3)' }} />
              <input 
                type="email" 
                placeholder="Student Email" 
                required 
                className="form-input"
                style={{ paddingLeft: '3rem' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-3)' }} />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                className="form-input"
                style={{ paddingLeft: '3rem' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In Now <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', fontWeight: 700 }}>EXPLORATION MODE</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          </div>

          <button onClick={handleGuest} className="btn-ghost" style={{ width: '100%', padding: '1rem' }}>
            Continue as Guest Student
          </button>

          <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.875rem', color: 'var(--color-text-3)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 800 }}>Join the Community</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
