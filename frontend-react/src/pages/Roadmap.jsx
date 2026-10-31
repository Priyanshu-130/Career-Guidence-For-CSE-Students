import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  Zap, 
  Crosshair, 
  BookOpen, 
  Check, 
  Clock, 
  Award,
  ExternalLink
} from 'lucide-react';
import domainsData from '../data/domains.json';
import { getCustomizedRoadmap } from '../utils/roadmapHelper';
import { getMastery } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export default function Roadmap() {
  const { id } = useParams();
  const { user } = useAuth();
  const domain = domainsData.find(d => d.id === id);

  const [verifiedMastery, setVerifiedMastery] = useState({});
  const [completedSemesters, setCompletedSemesters] = useState(() => {
    try {
      const saved = localStorage.getItem(`roadmap_progress_${id}`);
      return saved ? JSON.parse(saved) : [1]; // Semester 1 completed by default
    } catch (e) {
      return [1];
    }
  });

  useEffect(() => {
    const loadMastery = async () => {
      const email = user?.email || 'guest_student@pathfinder.edu';
      try {
        const res = await getMastery(email);
        if (res && res.current_mastery) {
          setVerifiedMastery(res.current_mastery);
        }
      } catch (e) {
        console.error('Failed to load mastery for roadmap customization:', e);
      }
    };
    loadMastery();
  }, [user]);

  const toggleSemester = (semNum) => {
    let next;
    if (completedSemesters.includes(semNum)) {
      next = completedSemesters.filter(s => s !== semNum);
    } else {
      next = [...completedSemesters, semNum];
    }
    setCompletedSemesters(next);
    try {
      localStorage.setItem(`roadmap_progress_${id}`, JSON.stringify(next));
    } catch (e) {}
  };

  if (!domain) {
    return (
      <div className="page-wrapper content-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Roadmap Not Found</h2>
        <Link to="/domains" className="btn-secondary">Return to Domains</Link>
      </div>
    );
  }

  const semesters = getCustomizedRoadmap(domain, verifiedMastery);
  const progressPct = Math.round((completedSemesters.length / 8) * 100);

  return (
    <div className="page-wrapper content-container animate-in" style={{ paddingBottom: '6rem' }}>
      
      {/* 1. TOP TELEMETRY STRIP */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        border: '1px solid var(--color-border)',
        background: 'rgba(16, 21, 36, 0.45)',
        marginBottom: '2.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--color-text-3)'
      }}>
        <Link 
          to={`/domain/${domain.id}`} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--color-text-2)', 
            textDecoration: 'none'
          }}
        >
          <ChevronLeft size={14} />
          <span>RETURN TO DOMAIN INTELLIGENCE</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>PROGRESS: <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>{completedSemesters.length} / 8 SEMESTERS [{progressPct}%]</span></span>
          <span>CURRICULUM: <span style={{ color: 'var(--color-accent)' }}>ACM/IEEE CS2023</span></span>
        </div>
      </div>

      {/* 2. HERO HEADER */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          border: '1px solid rgba(235, 94, 65, 0.3)',
          background: 'rgba(235, 94, 65, 0.06)',
          color: 'var(--color-accent)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem'
        }}>
          <Crosshair size={13} />
          <span>INDIVIDUALIZED ACADEMIC TIMELINE</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
          color: 'var(--color-ivory)'
        }}>
          {domain.title} Curriculum
        </h1>

        <p style={{
          fontSize: 'clamp(1.125rem, 2vw, 1.35rem)',
          color: 'var(--color-text-2)',
          maxWidth: '800px',
          lineHeight: 1.6,
          margin: '0 0 2rem 0'
        }}>
          Connected 8-semester milestone sequence engineered to guide you from foundational computational thinking to advanced production capstone.
        </p>

        {/* Progress Bar */}
        <div style={{
          maxWidth: '800px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--color-border)',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-ivory)' }}>OVERALL MILESTONE PROGRESSION</span>
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{progressPct}% COMPLETE</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--color-accent)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </section>

      {/* 3. CONNECTED TIMELINE */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px' }}>
        
        {/* Connecting spine */}
        <div style={{ 
          position: 'absolute', 
          left: '27px', 
          top: '24px', 
          bottom: '24px', 
          width: '2px', 
          background: 'linear-gradient(to bottom, var(--color-accent), var(--color-cyan), var(--color-success))',
          opacity: 0.35,
          zIndex: 0
        }} />

        {semesters.map((sem) => {
          const isDone = completedSemesters.includes(sem.semester);
          const isCurrent = !isDone && (sem.semester === 1 || completedSemesters.includes(sem.semester - 1));

          return (
            <div 
              key={sem.semester} 
              style={{ 
                position: 'relative', 
                display: 'grid', 
                gridTemplateColumns: '56px minmax(0, 1fr)', 
                gap: '2rem',
                alignItems: 'start'
              }}
            >
              {/* Semester Node */}
              <div 
                onClick={() => toggleSemester(sem.semester)}
                style={{ 
                  width: '56px', 
                  height: '56px', 
                  background: isDone ? 'var(--color-accent)' : isCurrent ? 'var(--color-surface)' : 'var(--color-bg)', 
                  border: `2px solid ${isDone ? 'var(--color-accent)' : isCurrent ? 'var(--color-ivory)' : 'var(--color-border)'}`, 
                  color: isDone ? '#06080E' : isCurrent ? 'var(--color-ivory)' : 'var(--color-text-3)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 800, 
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  position: 'relative', 
                  zIndex: 1,
                  boxShadow: isCurrent ? '0 0 16px rgba(243, 239, 230, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                title={isDone ? 'Click to unmark' : 'Click to mark complete'}
              >
                {isDone ? <Check size={20} /> : `S0${sem.semester}`}
              </div>

              {/* Milestone Panel */}
              <div className="observatory-panel" style={{ padding: '2.25rem' }}>
                
                {/* Header metadata */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div className="mono-tag" style={{ color: sem.color || 'var(--color-accent)', marginBottom: '0.25rem' }}>
                      {sem.subtitle || `SEMESTER 0${sem.semester} PHASE`}
                    </div>
                    <h3 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-ivory)' }}>
                      {sem.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {sem.depthBadge && (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        padding: '3px 8px',
                        border: '1px solid var(--color-success)',
                        color: 'var(--color-success)',
                        background: 'rgba(46, 196, 182, 0.08)'
                      }}>
                        {sem.depthBadge}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleSemester(sem.semester)}
                      style={{
                        padding: '4px 10px',
                        background: isDone ? 'rgba(235, 94, 65, 0.15)' : 'transparent',
                        border: `1px solid ${isDone ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        color: isDone ? 'var(--color-accent)' : 'var(--color-text-3)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isDone ? 'COMPLETED [✓]' : 'MARK AS DONE'}
                    </button>
                  </div>
                </div>

                {/* Course & Effort Breakdown */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--color-border)',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-ivory)', marginBottom: '0.5rem' }}>
                    {sem.course?.title}
                  </div>
                  <p style={{ color: 'var(--color-text-2)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                    {sem.course?.desc}
                  </p>
                </div>

                {/* Starting Guidance (Adaptive) */}
                {sem.recommendation && (
                  <div style={{
                    padding: '0.85rem 1.25rem',
                    background: 'rgba(235, 94, 65, 0.05)',
                    borderLeft: '3px solid var(--color-accent)',
                    marginBottom: '1.25rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-2)'
                  }}>
                    <strong style={{ color: 'var(--color-accent)' }}>ADAPTIVE DIRECTIVE:</strong> {sem.recommendation}
                  </div>
                )}

                {/* Deliverable & Effort Telemetry */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={13} style={{ color: 'var(--color-cyan)' }} />
                    <span>EST. EFFORT: 120-140 HRS (4 CREDITS)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={13} style={{ color: 'var(--color-success)' }} />
                    <span>KEY DELIVERABLE: {sem.semester === 4 ? 'SYSTEM REPO' : sem.semester === 8 ? 'CAPSTONE PRODUCTION' : 'MINI PROJECT'}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* 4. LEARNING HQ: ESSENTIAL EXTERNAL RESOURCES */}
      <section style={{ marginTop: '6rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="mono-tag" style={{ marginBottom: '0.35rem' }}>EXTERNAL REFERENCE MATRIX</div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Curriculum Acceleration Resources</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {(domain.resources || []).map((res, idx) => (
            <a 
              key={idx} 
              href={res.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="observatory-panel" 
              style={{ padding: '2rem', textDecoration: 'none', display: 'block' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-ivory)', fontSize: '1.125rem' }}>{res.title}</div>
                <ExternalLink size={16} style={{ color: 'var(--color-text-3)' }} />
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                {res.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                <span>OPEN RESOURCE</span>
                <ArrowRight size={13} />
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
