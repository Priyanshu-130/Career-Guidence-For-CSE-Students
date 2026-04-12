import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import domainsData from '../data/domains.json';
import { BookOpen, Wrench, Trophy, Briefcase, TrendingUp, ArrowRight, CheckCircle2, ChevronLeft, Target } from 'lucide-react';
import MiniQuiz from '../components/MiniQuiz';

export default function DomainDetail() {
  const { id } = useParams();
  const domain = domainsData.find(d => d.id === id);

  if (!domain) return <div className="page-wrapper">Domain not found</div>;

  return (
    <div className="page-wrapper content-container animate-in">
      
      <Link to="/domains" style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
        color: 'var(--color-text-3)', fontSize: '0.875rem', marginBottom: '2.5rem',
        fontWeight: 600
      }}>
        <ChevronLeft size={16} /> Back to All Domains
      </Link>

      {/* Modern Hero Header */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ 
            padding: '6px 16px', background: `${domain.color}22`, color: domain.color, 
            borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
            border: `1px solid ${domain.color}44`
          }}>
            {domain.id.toUpperCase()} • Specialization
          </span>
          <span style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', fontWeight: 600 }}>
             {domain.insights.jobDemand} Job Demand
          </span>
        </div>
        
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '2rem' }}>
          {domain.title}
        </h1>
        
        <p style={{ fontSize: '1.375rem', color: 'var(--color-text-2)', maxWidth: '850px', lineHeight: 1.6 }}>
          {domain.description}
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'start' }}>
        
        {/* Main Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          <div className="glass-card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: domain.color }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', background: `${domain.color}15`, color: domain.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: '1.5rem' }}>Overview & Scope</h3>
            </div>
            <p style={{ color: 'var(--color-text-2)', fontSize: '1.125rem', lineHeight: 1.8 }}>{domain.overview}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
               <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} color="var(--color-success)" />
                  Prerequisites
               </h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {domain.prerequisites.map(item => (
                   <div key={item} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                     {item}
                   </div>
                 ))}
               </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
               <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Trophy size={20} color="var(--color-warning)" />
                  Key Projects
               </h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {domain.projects.slice(0, 3).map(proj => (
                   <div key={proj.name}>
                     <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#fff' }}>{proj.name}</div>
                     <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)' }}>{proj.desc}</div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Mini Quiz Section */}
          <section id="aptitude-check">
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Test Your Fit</h2>
              <p style={{ color: 'var(--color-text-3)' }}>A quick 5-question check to see if your logic aligns with this domain.</p>
            </div>
            <MiniQuiz questions={domain.miniQuiz} domainName={domain.title} />
          </section>

        </div>

        {/* Sidebar Insights */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', borderTop: `4px solid ${domain.color}` }}>
             <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <TrendingUp size={20} color={domain.color} /> Career Outlook
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Future Potential</div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{domain.insights.futureScope}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Path Complexity</div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{domain.insights.timeToLearn}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Top Companies</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-2)', lineHeight: 1.5 }}>{domain.insights.topCompanies}</div>
                </div>
             </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
             <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Wrench size={20} /> Tech Stack
             </h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {domain.tools.map(tool => (
                  <span key={tool} style={{ 
                    padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', 
                    fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--color-border-gl)' 
                  }}>
                    {tool}
                  </span>
                ))}
             </div>
          </div>

          <Link to={`/roadmap/${domain.id}`} className="btn-primary" style={{ padding: '1.5rem', width: '100%', justifyContent: 'center' }}>
            Launch Full Roadmap <ArrowRight size={20} />
          </Link>

        </aside>

      </div>
    </div>
  );
}
