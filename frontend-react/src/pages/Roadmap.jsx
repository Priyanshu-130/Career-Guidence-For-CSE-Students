import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Flag, Book, CheckCircle2, ChevronRight, Sparkles, Terminal, ArrowRight, Zap } from 'lucide-react';
import domainsData from '../data/domains.json';
import { getCustomizedRoadmap } from '../utils/roadmapHelper';
import { getMastery } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export default function Roadmap() {
  const { id } = useParams();
  const { user } = useAuth();
  const domain = domainsData.find(d => d.id === id);

  const [verifiedMastery, setVerifiedMastery] = useState({});

  useEffect(() => {
    const loadMastery = async () => {
      const email = user?.email || 'guest_student@pathfinder.edu';
      try {
        const res = await getMastery(email);
        if (res.current_mastery) {
          setVerifiedMastery(res.current_mastery);
        }
      } catch (e) {
        console.error('Failed to load mastery for roadmap customization:', e);
      }
    };
    loadMastery();
  }, [user]);

  if (!domain) return <div className="page-wrapper">Roadmap not found</div>;

  const semesters = getCustomizedRoadmap(domain, verifiedMastery);

  return (
    <div className="page-wrapper content-container animate-in">
      
      <Link to={`/domain/${domain.id}`} style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
        color: 'var(--color-text-3)', fontSize: '0.875rem', marginBottom: '2.5rem',
        fontWeight: 600
      }}>
        <ChevronLeft size={16} /> Back to Domain Insights
      </Link>

      <div style={{ marginBottom: '4rem' }}>
        <div className="page-label" style={{ marginBottom: '1rem' }}>
          <Sparkles size={14} style={{ marginRight: '6px' }} /> Personalized Technical Roadmap
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{domain.title} <span className="text-gradient">Curriculum.</span></h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '750px' }}>
          Personalized 8-semester progression plan with starting depths tailored to your verified topic mastery levels.
        </p>

        {Object.keys(verifiedMastery).length > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '20px', background: 'var(--color-accent-lt)', border: '1px solid var(--color-accent)', marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            <Zap size={14} /> Adaptive Starting Depth Active based on Verified Topic Mastery
          </div>
        )}
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {/* The connecting line */}
        <div style={{ 
          position: 'absolute', left: '23px', top: '10px', bottom: '10px', 
          width: '2px', background: 'linear-gradient(to bottom, var(--color-accent), var(--color-purple), var(--color-success))',
          opacity: 0.2
        }}></div>

        {semesters.map((sem) => (
          <div key={sem.semester} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '2rem' }}>
             {/* Semester Marker */}
             <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-bg)', 
                border: `3px solid ${sem.color}`, color: sem.color, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.125rem',
                position: 'relative', zIndex: 1, boxShadow: `0 0 20px ${sem.color}33`
             }}>
               {sem.semester}
             </div>

             <div>
                <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: sem.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{sem.subtitle}</div>
                    <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{sem.title}</h3>
                  </div>
                  {sem.depthBadge && (
                    <span style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      background: sem.isAccelerated ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-surface)',
                      border: sem.isAccelerated ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
                      color: sem.isAccelerated ? 'var(--color-success)' : 'var(--color-text-2)',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}>
                      {sem.depthBadge}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', transition: 'var(--transition)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-3)', border: '1px solid var(--color-border)', flexShrink: 0, marginTop: '2px' }}>
                       <Terminal size={18} />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', marginBottom: '0.25rem' }}>{sem.course.title}</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>{sem.course.desc}</p>
                      
                      {sem.recommendation && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', background: 'var(--color-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', borderLeft: `3px solid ${sem.color}` }}>
                          <strong>Starting Guidance:</strong> {sem.recommendation}
                        </div>
                      )}

                      <div style={{ fontSize: '0.7rem', color: sem.color, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                         <CheckCircle2 size={12} /> {sem.semester === 4 ? 'Applied Milestone' : sem.semester === 8 ? 'Capstone Milestone' : 'Core Competency'}
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Learning HQ — External Resources */}
      <section style={{ marginTop: '8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Book size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Learning HQ</h2>
            <p style={{ color: 'var(--color-text-3)' }}>Essential external websites and resources to accelerate your mastery.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {domain.resources.map((res, idx) => (
            <a key={idx} href={res.link} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: '2rem', textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.125rem' }}>{res.title}</div>
                <ChevronRight size={18} color="var(--color-text-3)" />
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', lineHeight: 1.6, margin: 0 }}>{res.desc}</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.75rem' }}>
                Visit Resource <ArrowRight size={14} />
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
