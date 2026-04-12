import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Flag, Book, CheckCircle2, ChevronRight, Sparkles, Terminal, ArrowRight } from 'lucide-react';
import domainsData from '../data/domains.json';

export default function Roadmap() {
  const { id } = useParams();
  const domain = domainsData.find(d => d.id === id);

  if (!domain) return <div className="page-wrapper">Roadmap not found</div>;

  const years = [
    { num: 1, title: 'Foundations & Core Logic', color: '#6366f1' },
    { num: 2, title: 'Engineering Fundamentals', color: '#8b5cf6' },
    { num: 3, title: 'Advanced Specialization', color: '#ec4899' },
    { num: 4, title: 'Capstone & Industry Prep', color: '#10b981' }
  ];

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
          A strategic 4-year progression plan designed to take you from foundational logic to industry-ready mastery in {domain.title}.
        </p>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {/* The connecting line */}
        <div style={{ 
          position: 'absolute', left: '23px', top: '10px', bottom: '10px', 
          width: '2px', background: 'linear-gradient(to bottom, var(--color-accent), var(--color-purple), var(--color-success))',
          opacity: 0.2
        }}></div>

        {years.map((year, yIdx) => (
          <div key={year.num} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '2rem' }}>
             {/* Year Marker */}
             <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-bg)', 
                border: `3px solid ${year.color}`, color: year.color, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.125rem',
                position: 'relative', zIndex: 1, boxShadow: `0 0 20px ${year.color}33`
             }}>
               {year.num}
             </div>

             <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: year.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Year {year.num}</div>
                  <h3 style={{ fontSize: '1.75rem' }}>{year.title}</h3>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {(domain.curriculum?.[`year${year.num}`] || []).map((course, cIdx) => (
                    <div key={cIdx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', transition: 'var(--transition)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-3)', border: '1px solid var(--color-border)', flexShrink: 0, marginTop: '2px' }}>
                         <Terminal size={18} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>{course.title}</div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>{course.desc}</p>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <CheckCircle2 size={12} /> Core Competency
                        </div>
                      </div>
                    </div>
                  ))}
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
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.125rem' }}>{res.title}</div>
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
        <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to specialize?</h3>
        <p style={{ color: 'var(--color-text-3)', maxWidth: '500px', margin: '0 auto 2.5rem', fontSize: '1.125rem' }}>
          This roadmap is personalized based on your diagnostic results. You can now begin exploring individual course modules.
        </p>
        <Link to={`/domain/${domain.id}`} className="btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '1.125rem' }}>Initialize Learning Modules <ArrowRight size={20} /></Link>
      </div>

    </div>
  );
}
