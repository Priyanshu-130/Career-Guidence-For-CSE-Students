import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, UserCheck } from 'lucide-react';
import { loginUser } from '../services/apiService';

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
      const res = await loginUser({ email, password });
      if (res.status === 'success') {
        login(res.student);
        navigate('/');
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    continuesAsGuest();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }} className="glass-card animate-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800, color: 'var(--color-text)' }}>Sign In</h2>
          <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem' }}>
            Enter your email and password to access your account.
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

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-3)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 800 }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}

const iconStyle = { position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-3)' };
