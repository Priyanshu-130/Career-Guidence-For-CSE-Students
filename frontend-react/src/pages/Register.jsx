import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, School, Calendar, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { registerUser } from '../services/apiService';

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
      const res = await registerUser(formData);
      if (res.status === 'success') {
        navigate('/login');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: '460px', padding: '2.5rem' }} className="glass-card animate-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800, color: 'var(--color-text)' }}>Register Account</h2>
          <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem' }}>Fill in your details to create an account.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          {error && (
            <div style={{ 
              padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#ef4444', borderRadius: '12px', fontSize: '0.8125rem'
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
              <select name="year" onChange={handleChange} className="form-input" style={{ paddingLeft: '3rem', appearance: 'none' }}>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <BookOpen size={18} style={{ ...iconStyle }} />
              <select name="branch" onChange={handleChange} className="form-input" style={{ paddingLeft: '3rem', appearance: 'none' }}>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-3)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 800 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

const iconStyle = { position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-3)' };
