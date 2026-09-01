import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Compass, ShieldCheck, Zap, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, continuesAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();
      if (resp.ok && data.status === 'success') {
        login(data.student);
        navigate('/');
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Connection failed. Backend server may be offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    continuesAsGuest();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.2fr 1fr', background: 'var(--color-bg)' }}>
      {/* Visual Side (Left) */}
      <div style={{ 
        position: 'relative', 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(255, 255, 255, 1) 100%)', 
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
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)', 
          filter: 'blur(60px)' 
        }}></div>
        <div style={{ 
          position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', 
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)', 
          filter: 'blur(60px)' 
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }} className="animate-in">
          <div style={{ 
            width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 50%, var(--color-purple) 100%)', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#fff', marginBottom: '2.5rem', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)'
          }}>
            <Compass size={32} />
          </div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '2rem', color: 'var(--color-text)' }}>
            Engineer Your <span className="text-gradient">Potential.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '500px', lineHeight: 1.7, marginBottom: '4rem' }}>
            The professional diagnostic platform for CSE students to identify their ideal career trajectory using situational logic.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', background: 'var(--color-accent-lt)', borderRadius: '12px', color: 'var(--color-accent)' }}>
                <Zap size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--color-text)' }}>Precision Diagnostics</h4>
                <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem' }}>Evaluate interest, aptitude, and orientation across 9 domains.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-success)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--color-text)' }}>Persistent Dashboard</h4>
                <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem' }}>Save assessment history and track your semester-by-semester course progress.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '3rem', left: '6rem', color: 'var(--color-text-3)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.05em' }}>
          &copy; 2026 CSE PATHFINDER • VERSION 2.0
        </div>
      </div>

      {/* Form Side (Right) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }} className="animate-in">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--color-text-3)', lineHeight: 1.6 }}>
              Sign in to your CSE Pathfinder account to continue your career journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            {error && (
              <div style={{ 
                padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', 
                color: '#ef4444', borderRadius: '12px', fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={iconStyle} />
              <input 
                name="email" 
                type="email" 
                placeholder="Email Address" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="form-input" 
                style={{ paddingLeft: '3rem' }} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={iconStyle} />
              <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="form-input" 
                style={{ paddingLeft: '3rem' }} 
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', fontWeight: 700 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          </div>

          <button 
            type="button" 
            onClick={handleGuestLogin} 
            className="btn-secondary" 
            style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <UserCheck size={18} /> Continue as Guest
          </button>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.875rem', color: 'var(--color-text-3)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 800 }}>Create Profile</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const iconStyle = { position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-3)' };

