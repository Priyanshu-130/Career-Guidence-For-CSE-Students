import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, School, Calendar, BookOpen, Loader2, ArrowRight, Compass, CheckCircle } from 'lucide-react';
import { getApiBaseUrl } from '../utils/roadmapHelper';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', college: '', year: '1st Year', branch: 'CSE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch(`${getApiBaseUrl()}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await resp.json();
      if (resp.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection failed. Backend may be offline.');
    } finally {
      setLoading(false);
    }
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

        <div style={{ position: 'relative', zIndex: 1 }} className="animate-in">
          <div style={{ 
            width: '64px', height: '64px', background: '#17191C', 
            borderRadius: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#fff', marginBottom: '2.5rem'
          }}>
            <Compass size={32} />
          </div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '2rem', color: '#17191C', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>
            Build Your <span style={{ color: '#E85D3F' }}>Legacy.</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#50545B', maxWidth: '500px', lineHeight: 1.7, marginBottom: '4rem' }}>
            Join thousands of engineering students discovering their true specialized potential through our advanced curriculum mapping.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {['Personalized 8-Semester Roadmaps', 'Adaptive Psychometric Diagnostics', 'Persistent Progress Tracking'].map(feat => (
              <div key={feat} style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#17191C' }}>
                <CheckCircle size={20} color="#2EC4B6" />
                <span style={{ fontWeight: 600 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '3rem', left: '6rem', color: '#646A73', fontSize: '0.8125rem', fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>
          ESTABLISHED 2026 // CSE PATHFINDER
        </div>
      </div>

      {/* Form Side (Right) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '460px' }} className="animate-in">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: '#17191C', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>Register Account</h2>
            <p style={{ color: '#50545B' }}>Start your specialized engineering journey today</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            {error && (
              <div style={{ 
                padding: '1rem', background: '#FFF0EB', border: '1px solid #E85D3F', 
                color: '#E85D3F', borderRadius: '0px', fontSize: '0.8125rem', fontWeight: 600
              }}>
                {error}
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <User size={18} style={{ ...iconStyle }} />
              <input name="name" placeholder="Full Name" required onChange={handleChange} className="form-input" style={{ paddingLeft: '3rem' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ ...iconStyle }} />
              <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="form-input" style={{ paddingLeft: '3rem' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ ...iconStyle }} />
              <input name="password" type="password" placeholder="Create Password" required onChange={handleChange} className="form-input" style={{ paddingLeft: '3rem' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <School size={18} style={{ ...iconStyle }} />
              <input name="college" placeholder="College/University Name" required onChange={handleChange} className="form-input" style={{ paddingLeft: '3rem' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ ...iconStyle }} />
                <select name="year" onChange={handleChange} className="form-input" style={{ paddingLeft: '3rem', appearance: 'none', backgroundColor: '#FFFFFF', color: '#17191C' }}>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div style={{ position: 'relative' }}>
                <BookOpen size={18} style={{ ...iconStyle }} />
                <select name="branch" onChange={handleChange} className="form-input" style={{ paddingLeft: '3rem', appearance: 'none', backgroundColor: '#FFFFFF', color: '#17191C' }}>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Professional Profile <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.875rem', color: '#50545B' }}>
            Already registered? <Link to="/login" style={{ color: '#E85D3F', fontWeight: 800 }}>Login to Dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const iconStyle = { position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#646A73' };
