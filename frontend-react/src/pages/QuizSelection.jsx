import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Cpu, ArrowRight, Sparkles, Brain, Shapes, Compass, Zap } from 'lucide-react';

export default function QuizSelection() {
  return (
    <div className="page-wrapper content-container animate-in" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '3.5rem' }}>
        <div className="page-label" style={{ marginBottom: '1.5rem' }}>
          <Sparkles size={14} style={{ marginRight: '6px' }} /> Diagnostic Selection
        </div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          Choose Your <span className="text-gradient">Diagnostic Path.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '680px', margin: '0 auto' }}>
          Experience our new multi-stage adaptive ladder tailored to your exact coding background, or choose a classic static track.
        </p>
      </div>

      {/* FEATURED: ADAPTIVE ASSESSMENT (PHASE 2-4 ENGINE) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 3.5rem' }}>
        <Link
          to="/assess"
          className="glass-card"
          style={{
            display: 'block',
            padding: '3rem',
            textAlign: 'left',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06), rgba(139, 92, 246, 0.08)), var(--color-card)',
            border: '2px solid var(--color-accent)',
            textDecoration: 'none',
            boxShadow: '0 15px 35px -10px rgba(79, 70, 229, 0.12)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'var(--color-accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Compass size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)' }}>
                  Recommended • Next-Gen Engine
                </span>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Adaptive Career Assessment (Dynamic Ladder)</h2>
              </div>
            </div>
            <div className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Start Adaptive Path <ArrowRight size={18} />
            </div>
          </div>

          <p style={{ color: 'var(--color-text-2)', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '880px', margin: 0 }}>
            Features behavior-based background profiling, starter logic diagnostic, knowledge laddering (Level 0 to 4), explainer cards, and O*NET-derived RIASEC hypothesis with top 3 domain fits. Works 100% offline.
          </p>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
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
          
          <div style={{ background: 'rgba(79, 70, 229, 0.03)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
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

          <div style={{ background: 'rgba(168, 85, 247, 0.03)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
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

        {/* General Alignment Track */}
        <Link to="/quiz/general" className="glass-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'left', transition: 'var(--transition)', textDecoration: 'none' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '18px', background: 'var(--color-accent-lt)', 
            color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2rem', border: '1px solid var(--color-accent)'
          }}>
            <Shapes size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>General Track</h2>

          <div style={{ background: 'rgba(79, 70, 229, 0.03)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={14} /> The Full Diagnostic
            </div>
            <p style={{ color: 'var(--color-text-2)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
              Evaluate alignment across all major hardware and software domains simultaneously.
            </p>
          </div>

          <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Includes: AI, Data Science, Web Development, Cybersecurity, Cloud, IoT, and Blockchain.
          </p>

          <div className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Initialize General Path <ArrowRight size={18} />
          </div>
        </Link>

      </div>

      <p style={{ marginTop: '5rem', color: 'var(--color-text-3)', fontSize: '0.875rem' }}>
        All assessments use situational logic processing to provide transparent heuristic alignment across domains.
      </p>
    </div>
  );
}
