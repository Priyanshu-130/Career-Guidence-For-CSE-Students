import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Cpu, ArrowRight, Sparkles, Brain, Shapes } from 'lucide-react';

export default function QuizSelection() {
  return (
    <div className="page-wrapper content-container animate-in" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '5rem' }}>
        <div className="page-label" style={{ marginBottom: '1.5rem' }}><Sparkles size={14} style={{ marginRight: '6px' }} /> Diagnostic Selection</div>
        <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>Choose Your <span className="text-gradient">Dimension.</span></h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '600px', margin: '0 auto' }}>
          Select the high-level track you are most curious about. Our engine will then drill down into 30 specific situational competencies.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Software Track */}
        <Link to="/quiz/software" className="glass-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'left', transition: 'var(--transition)', textDecoration: 'none' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '18px', background: 'var(--color-accent-lt)', 
            color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2rem', border: '1px solid var(--color-accent)'
          }}>
            <Layout size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>Software Track</h2>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Brain size={14} /> The "Brain" of Computers
            </div>
            <p style={{ color: 'var(--color-text-2)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
              Focus on logic, instructions, and code. Choose this if you like solving puzzles, building apps, or training AI to "think."
            </p>
          </div>

          <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Includes: AI & ML, Data Science, Web & Game Development, Cybersecurity, and Cloud Computing.
          </p>

          <div className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Initialize Software Path <ArrowRight size={18} />
          </div>
        </Link>

        {/* Hardware Track */}
        <Link to="/quiz/hardware" className="glass-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'left', transition: 'var(--transition)', textDecoration: 'none' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(168, 85, 247, 0.15)', 
            color: 'var(--color-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2rem', border: '1px solid var(--color-purple)'
          }}>
            <Cpu size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>Hardware Track</h2>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--color-purple)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Shapes size={14} /> The "Body" of Computers
            </div>
            <p style={{ color: 'var(--color-text-2)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
              Focus on physical machines and components. Choose this if you like electronics, robots, and building the internet's physical cables.
            </p>
          </div>

          <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Includes: Internet of Things (IoT), Robotics, VLSI (Chip Design), and Modern Networking.
          </p>

          <div className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, var(--color-purple), #ec4899)' }}>
            Initialize Hardware Path <ArrowRight size={18} />
          </div>
        </Link>

      </div>

      <p style={{ marginTop: '5rem', color: 'var(--color-text-3)', fontSize: '0.875rem' }}>
        All assessments use situational logic processing to ensure high accuracy in recommendations.
      </p>
    </div>
  );
}
