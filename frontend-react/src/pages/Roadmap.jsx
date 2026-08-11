import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Flag, Book, CheckCircle2, ChevronRight, Sparkles, Terminal, ArrowRight } from 'lucide-react';
import domainsData from '../data/domains.json';
import { getSemesterCurriculum } from '../utils/roadmapHelper';

export default function Roadmap() {
  const { id } = useParams();
  const domain = domainsData.find(d => d.id === id);

  if (!domain) return <div className="page-wrapper">Roadmap not found</div>;

  const semesters = getSemesterCurriculum(domain);

  return (
    <div className="page-wrapper content-container animate-in">
      
      <Link to={`/domain/${domain.id}`} style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
        color: 'var(--color-text-3)', fontSize: '0.875rem', marginBottom: '2.5rem',
        fontWeight: 600
      }}>
        <ChevronLeft size={16} /> Back to Domain Insights
      </Link>

      <div style={{ marginBottom: '5rem' }}>
        <div className="page-label" style={{ marginBottom: '1rem' }}><Sparkles size={14} style={{ marginRight: '6px' }} /> Technical Roadmap</div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{domain.title} <span className="text-gradient">Curriculum.</span></h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-3)', maxWidth: '700px' }}>
          A strategic 8-semester progression plan designed to take you from foundational logic to industry-ready mastery in {domain.title}.
        </p>
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
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: sem.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{sem.subtitle}</div>
                  <h3 style={{ fontSize: '1.75rem' }}>{sem.title}</h3>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', transition: 'var(--transition)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-3)', border: '1px solid var(--color-border)', flexShrink: 0, marginTop: '2px' }}>
                       <Terminal size={18} />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', marginBottom: '0.25rem' }}>{sem.course.title}</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>{sem.course.desc}</p>
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

      <div className="glass-card" style={{ marginTop: '8rem', padding: '4rem 3rem', textAlign: 'center', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)' }}>
        <Flag size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--color-success)' }} />
        <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to track your progress?</h3>
        <p style={{ color: 'var(--color-text-3)', maxWidth: '500px', margin: '0 auto 2.5rem', fontSize: '1.125rem' }}>
          This semester roadmap can be saved to your progress dashboard. You can mark courses, add notes, and log your learning milestones.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to={`/domain/${domain.id}`} className="btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.125rem' }}>Initialize Learning Modules <ArrowRight size={20} /></Link>
          <Link to="/progress" className="btn-secondary" style={{ 
            padding: '1.25rem 3rem', fontSize: '1.125rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
            background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', 
            textDecoration: 'none', fontWeight: 600, color: 'var(--color-text)', transition: 'var(--transition)'
          }}>
            Track Your Progress <CheckCircle2 size={18} color="var(--color-success)" style={{ marginLeft: '4px' }} />
          </Link>
        </div>
      </div>

    </div>
  );
}
