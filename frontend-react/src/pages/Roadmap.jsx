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
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F7F4',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        fontFamily: "'Manrope', sans-serif"
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#17191C' }}>Roadmap Not Found</h2>
        <Link 
          to="/domains" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.85rem 2rem',
            backgroundColor: '#17191C',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontWeight: 700
          }}
        >
          Return to Specializations
        </Link>
      </div>
    );
  }

  const semesters = getCustomizedRoadmap(domain, verifiedMastery);
  const progressPct = Math.round((completedSemesters.length / 8) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* 1. TOP TELEMETRY STRIP */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.85rem 1.25rem',
          border: '1px solid #D8DAD7',
          backgroundColor: '#FFFFFF',
          marginBottom: '3rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.75rem',
          color: '#646A73'
        }}>
          <Link 
            to={`/domain/${domain.id}`} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: '#50545B', 
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            <ChevronLeft size={14} />
            <span>RETURN TO SPECIALIZATION INTELLIGENCE</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>PROGRESS: <span style={{ color: '#2EC4B6', fontWeight: 700 }}>{completedSemesters.length} / 8 SEMESTERS [{progressPct}%]</span></span>
            <span>CURRICULUM: <span style={{ color: '#E85D3F', fontWeight: 700 }}>ACM/IEEE CS2023</span></span>
          </div>
        </div>

        {/* 2. HERO HEADER */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            border: '1px solid #E85D3F',
            backgroundColor: '#FFF0EB',
            color: '#E85D3F',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Crosshair size={13} />
            <span>INDIVIDUALIZED ACADEMIC TIMELINE</span>
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2.8rem, 6vw, 5.25rem)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            color: '#17191C'
          }}>
            {domain.title} Curriculum
          </h1>

          <p style={{
            fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
            color: '#50545B',
            maxWidth: '820px',
            lineHeight: 1.6,
            margin: '0 0 2rem 0'
          }}>
            Connected 8-semester milestone sequence engineered to guide you from foundational computational thinking to advanced production capstone.
          </p>

          {/* Progress Bar Container */}
          <div style={{
            maxWidth: '820px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '1.25rem 1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              marginBottom: '0.65rem'
            }}>
              <span style={{ color: '#17191C', fontWeight: 700 }}>OVERALL MILESTONE PROGRESSION</span>
              <span style={{ color: '#E85D3F', fontWeight: 700 }}>{progressPct}% COMPLETE</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#E8EAE6' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#E85D3F', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </section>

        {/* 3. CONNECTED TIMELINE */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1000px' }}>
          
          {/* Connecting spine */}
          <div style={{ 
            position: 'absolute', 
            left: '27px', 
            top: '24px', 
            bottom: '24px', 
            width: '2px', 
            backgroundColor: '#D8DAD7',
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
                    backgroundColor: isDone ? '#E85D3F' : isCurrent ? '#FFFFFF' : '#FFFFFF', 
                    border: `2px solid ${isDone ? '#E85D3F' : isCurrent ? '#17191C' : '#D8DAD7'}`, 
                    color: isDone ? '#FFFFFF' : isCurrent ? '#17191C' : '#646A73', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '0.9375rem',
                    fontFamily: "'DM Mono', monospace",
                    cursor: 'pointer',
                    position: 'relative', 
                    zIndex: 1,
                    transition: 'all 0.15s ease'
                  }}
                  title={isDone ? 'Click to unmark' : 'Click to mark complete'}
                >
                  {isDone ? <Check size={22} color="#FFFFFF" /> : `S0${sem.semester}`}
                </div>

                {/* Milestone Panel */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: isCurrent ? '1px solid #17191C' : '1px solid #D8DAD7',
                  padding: '2.25rem',
                  transition: 'border-color 0.15s ease'
                }}>
                  
                  {/* Header metadata */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: '#E85D3F',
                        marginBottom: '0.25rem'
                      }}>
                        {sem.subtitle || `SEMESTER 0${sem.semester} PHASE`}
                      </div>
                      <h3 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '1.85rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        margin: 0,
                        color: '#17191C'
                      }}>
                        {sem.title}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {sem.depthBadge && (
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          border: '1px solid #2EC4B6',
                          color: '#2EC4B6',
                          backgroundColor: '#F0FDF4'
                        }}>
                          {sem.depthBadge}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleSemester(sem.semester)}
                        style={{
                          padding: '4px 10px',
                          backgroundColor: isDone ? '#FFF0EB' : '#FFFFFF',
                          border: `1px solid ${isDone ? '#E85D3F' : '#D8DAD7'}`,
                          color: isDone ? '#E85D3F' : '#646A73',
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {isDone ? 'COMPLETED [✓]' : 'MARK AS DONE'}
                      </button>
                    </div>
                  </div>

                  {/* Course & Effort Breakdown */}
                  <div style={{
                    backgroundColor: '#F8F8F6',
                    border: '1px solid #D8DAD7',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '1.0625rem',
                      color: '#17191C',
                      marginBottom: '0.5rem'
                    }}>
                      {sem.course?.title}
                    </div>
                    <p style={{ color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                      {sem.course?.desc}
                    </p>
                  </div>

                  {/* Starting Guidance (Adaptive) */}
                  {sem.recommendation && (
                    <div style={{
                      padding: '0.85rem 1.25rem',
                      backgroundColor: '#FFF0EB',
                      borderLeft: '3px solid #E85D3F',
                      border: '1px solid #D8DAD7',
                      borderLeftWidth: '3px',
                      marginBottom: '1.25rem',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.8125rem',
                      color: '#17191C'
                    }}>
                      <strong style={{ color: '#E85D3F' }}>ADAPTIVE DIRECTIVE:</strong> {sem.recommendation}
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
                    borderTop: '1px solid #D8DAD7',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.75rem',
                    color: '#646A73'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={13} style={{ color: '#0284C7' }} />
                      <span>EST. EFFORT: 120-140 HRS (4 CREDITS)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={13} style={{ color: '#2EC4B6' }} />
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
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#E85D3F',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              EXTERNAL REFERENCE MATRIX
            </div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '2.5rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              margin: 0,
              color: '#17191C'
            }}>
              Curriculum Acceleration Resources
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {(domain.resources || []).map((res, idx) => (
              <a 
                key={idx} 
                href={res.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8DAD7',
                  padding: '2rem', 
                  textDecoration: 'none', 
                  display: 'block',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#17191C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D8DAD7';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#17191C', fontSize: '1.125rem' }}>{res.title}</div>
                  <ExternalLink size={16} style={{ color: '#646A73' }} />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#50545B', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                  {res.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E85D3F', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700 }}>
                  <span>OPEN RESOURCE</span>
                  <ArrowRight size={13} />
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
