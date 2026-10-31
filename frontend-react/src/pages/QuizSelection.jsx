import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Terminal, 
  Cpu, 
  Globe, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  Activity
} from 'lucide-react';

export default function QuizSelection() {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState('adaptive');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

        {/* 1. MINIMAL HEADER & BREADCRUMBS */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #D8DAD7',
          marginBottom: '3.5rem'
        }}>
          {/* Logo & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#17191C',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>PATHFINDER</span>
            </div>

            <span style={{ color: '#D8DAD7' }}>/</span>

            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8125rem',
              color: '#646A73',
              letterSpacing: '0.04em'
            }}>
              <Link to="/" style={{ color: '#50545B', textDecoration: 'none' }}>Dashboard</Link>
              <span style={{ margin: '0 0.5rem', color: '#D8DAD7' }}>/</span>
              <span style={{ color: '#17191C', fontWeight: 600 }}>Assessment</span>
            </div>
          </div>

          {/* Assessment status indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            color: '#17191C',
            letterSpacing: '0.04em'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#2EC4B6'
            }} />
            <span style={{ fontWeight: 600 }}>DIAGNOSTIC ENGINE: READY</span>
          </div>
        </header>

        {/* 2. MAIN EDITORIAL HEADING */}
        <div style={{ marginBottom: '4rem', maxWidth: '820px' }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#E85D3F',
            marginBottom: '0.85rem'
          }}>
            DIAGNOSTIC SELECTION
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#17191C',
            margin: '0 0 1.5rem 0'
          }}>
            CHOOSE YOUR PATH.
          </h1>

          <p style={{
            fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: '#50545B',
            margin: 0
          }}>
            Tell us where you are in your CSE journey. We'll adapt your assessment to your existing knowledge and experience.
          </p>
        </div>

        {/* 3. FEATURED RECOMMENDED ASSESSMENT: ADAPTIVE CAREER ASSESSMENT */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div 
            onClick={() => setSelectedTrack('adaptive')}
            style={{
              backgroundColor: '#FFFFFF',
              border: selectedTrack === 'adaptive' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
              boxShadow: selectedTrack === 'adaptive' ? '0 12px 32px rgba(232, 93, 63, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.02)',
              padding: 'clamp(2rem, 4vw, 3.25rem)',
              position: 'relative',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            {/* Top Tag & Metadata */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#50545B',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ color: '#E85D3F', fontWeight: 700 }}>RECOMMENDED</span>
                <span style={{ color: '#D8DAD7' }}>·</span>
                <span>ADAPTIVE ENGINE</span>
              </div>

              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#646A73'
              }}>
                ACCREDITATION: O*NET + ACM/IEEE
              </div>
            </div>

            {/* Title & Description Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              alignItems: 'center',
              gap: '2.5rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#17191C',
                  margin: '0 0 1rem 0'
                }}>
                  Adaptive Career Assessment
                </h2>

                <p style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.65,
                  color: '#50545B',
                  maxWidth: '780px',
                  margin: 0
                }}>
                  An intelligent multi-stage assessment that evaluates your background, identifies your knowledge level, and adapts subsequent questions to your abilities.
                </p>

                {/* Badges / Micro Features */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginTop: '1.5rem',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.75rem',
                  color: '#50545B'
                }}>
                  <span style={{ padding: '0.35rem 0.75rem', backgroundColor: '#F7F7F4', border: '1px solid #D8DAD7' }}>
                    • ZERO-KNOWLEDGE & ADVANCED TRACKS
                  </span>
                  <span style={{ padding: '0.35rem 0.75rem', backgroundColor: '#F7F7F4', border: '1px solid #D8DAD7' }}>
                    • 109 VERIFIED QUESTIONS
                  </span>
                  <span style={{ padding: '0.35rem 0.75rem', backgroundColor: '#F7F7F4', border: '1px solid #D8DAD7' }}>
                    • 100% OFFLINE READY
                  </span>
                </div>
              </div>

              {/* Primary CTA */}
              <div>
                <Link
                  to="/assess"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    backgroundColor: '#17191C',
                    color: '#FFFFFF',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '1.125rem 2.25rem',
                    textDecoration: 'none',
                    border: '1px solid #17191C',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E85D3F';
                    e.currentTarget.style.borderColor = '#E85D3F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#17191C';
                    e.currentTarget.style.borderColor = '#17191C';
                  }}
                >
                  <span>START ADAPTIVE ASSESSMENT</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 4. THREE DISTINCT DIAGNOSTIC TRACKS */}
        <section>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #D8DAD7'
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#646A73'
            }}>
              SPECIALIZED ASSESSMENT TRACKS
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              color: '#646A73'
            }}>
              [SELECT ONE TO PROCEED]
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>

            {/* TRACK 01: SOFTWARE TRACK */}
            <div
              onClick={() => setSelectedTrack('software')}
              style={{
                backgroundColor: selectedTrack === 'software' ? '#FFF0EB' : '#FFFFFF',
                border: selectedTrack === 'software' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <div>
                {/* Minimalist Icon & Track Number */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '1px solid #D8DAD7',
                    backgroundColor: '#FFFFFF',
                    color: '#17191C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Terminal size={22} style={{ color: '#E85D3F' }} />
                  </div>

                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#646A73'
                  }}>
                    TRACK 01
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  color: '#17191C',
                  margin: '0 0 1rem 0'
                }}>
                  01 — SOFTWARE TRACK
                </h3>

                {/* Description per user requirement */}
                <p style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#50545B',
                  margin: '0 0 1.5rem 0'
                }}>
                  For students interested in programming, software engineering, algorithms, AI/ML, databases, and software systems.
                </p>

                {/* Technical topics */}
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.6875rem',
                  color: '#646A73',
                  paddingTop: '1rem',
                  borderTop: '1px solid #D8DAD7',
                  marginBottom: '2rem'
                }}>
                  DOMAINS: AI/ML · WEB · SYSTEMS · CLOUD · DB
                </div>
              </div>

              {/* Action Button */}
              <Link
                to="/quiz/software"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  backgroundColor: selectedTrack === 'software' ? '#E85D3F' : '#FFFFFF',
                  color: selectedTrack === 'software' ? '#FFFFFF' : '#17191C',
                  border: selectedTrack === 'software' ? '1px solid #E85D3F' : '1px solid #D8DAD7',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#17191C';
                  e.currentTarget.style.borderColor = '#17191C';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (selectedTrack === 'software') {
                    e.currentTarget.style.backgroundColor = '#E85D3F';
                    e.currentTarget.style.borderColor = '#E85D3F';
                    e.currentTarget.style.color = '#FFFFFF';
                  } else {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#D8DAD7';
                    e.currentTarget.style.color = '#17191C';
                  }
                }}
              >
                <span>EXPLORE SOFTWARE</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* TRACK 02: HARDWARE TRACK */}
            <div
              onClick={() => setSelectedTrack('hardware')}
              style={{
                backgroundColor: selectedTrack === 'hardware' ? '#FFF0EB' : '#FFFFFF',
                border: selectedTrack === 'hardware' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <div>
                {/* Minimalist Icon & Track Number */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '1px solid #D8DAD7',
                    backgroundColor: '#FFFFFF',
                    color: '#17191C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Cpu size={22} style={{ color: '#E85D3F' }} />
                  </div>

                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#646A73'
                  }}>
                    TRACK 02
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  color: '#17191C',
                  margin: '0 0 1rem 0'
                }}>
                  02 — HARDWARE TRACK
                </h3>

                {/* Description per user requirement */}
                <p style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#50545B',
                  margin: '0 0 1.5rem 0'
                }}>
                  For students interested in computer architecture, embedded systems, electronics, digital logic, and hardware technologies.
                </p>

                {/* Technical topics */}
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.6875rem',
                  color: '#646A73',
                  paddingTop: '1rem',
                  borderTop: '1px solid #D8DAD7',
                  marginBottom: '2rem'
                }}>
                  DOMAINS: VLSI · ROBOTICS · EMBEDDED · IOT · NETWORKS
                </div>
              </div>

              {/* Action Button */}
              <Link
                to="/quiz/hardware"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  backgroundColor: selectedTrack === 'hardware' ? '#E85D3F' : '#FFFFFF',
                  color: selectedTrack === 'hardware' ? '#FFFFFF' : '#17191C',
                  border: selectedTrack === 'hardware' ? '1px solid #E85D3F' : '1px solid #D8DAD7',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#17191C';
                  e.currentTarget.style.borderColor = '#17191C';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (selectedTrack === 'hardware') {
                    e.currentTarget.style.backgroundColor = '#E85D3F';
                    e.currentTarget.style.borderColor = '#E85D3F';
                    e.currentTarget.style.color = '#FFFFFF';
                  } else {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#D8DAD7';
                    e.currentTarget.style.color = '#17191C';
                  }
                }}
              >
                <span>EXPLORE HARDWARE</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* TRACK 03: GENERAL CSE TRACK */}
            <div
              onClick={() => setSelectedTrack('general')}
              style={{
                backgroundColor: selectedTrack === 'general' ? '#FFF0EB' : '#FFFFFF',
                border: selectedTrack === 'general' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <div>
                {/* Minimalist Icon & Track Number */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '1px solid #D8DAD7',
                    backgroundColor: '#FFFFFF',
                    color: '#17191C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Globe size={22} style={{ color: '#E85D3F' }} />
                  </div>

                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#646A73'
                  }}>
                    TRACK 03
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  color: '#17191C',
                  margin: '0 0 1rem 0'
                }}>
                  03 — GENERAL CSE TRACK
                </h3>

                {/* Description per user requirement */}
                <p style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#50545B',
                  margin: '0 0 1.5rem 0'
                }}>
                  For students who are still exploring and want to discover their interests across multiple CSE domains.
                </p>

                {/* Technical topics */}
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.6875rem',
                  color: '#646A73',
                  paddingTop: '1rem',
                  borderTop: '1px solid #D8DAD7',
                  marginBottom: '2rem'
                }}>
                  EVALUATION: BROAD MULTI-DISCIPLINE RESONANCE
                </div>
              </div>

              {/* Action Button */}
              <Link
                to="/quiz/general"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  backgroundColor: selectedTrack === 'general' ? '#E85D3F' : '#FFFFFF',
                  color: selectedTrack === 'general' ? '#FFFFFF' : '#17191C',
                  border: selectedTrack === 'general' ? '1px solid #E85D3F' : '1px solid #D8DAD7',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#17191C';
                  e.currentTarget.style.borderColor = '#17191C';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (selectedTrack === 'general') {
                    e.currentTarget.style.backgroundColor = '#E85D3F';
                    e.currentTarget.style.borderColor = '#E85D3F';
                    e.currentTarget.style.color = '#FFFFFF';
                  } else {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#D8DAD7';
                    e.currentTarget.style.color = '#17191C';
                  }
                }}
              >
                <span>EXPLORE GENERAL CSE</span>
                <ArrowRight size={15} />
              </Link>
            </div>

          </div>
        </section>

        {/* 5. EDITORIAL FOOTNOTE */}
        <footer style={{
          marginTop: '4rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #D8DAD7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.75rem',
          color: '#646A73'
        }}>
          <div>
            FRAMEWORK: U.S. DEPT OF LABOR O*NET RIASEC · ACM/IEEE CS2023
          </div>
          <div>
            SECURE ADAPTIVE ROUTING · CONFIDENCE CALIBRATED
          </div>
        </footer>

      </div>
    </div>
  );
}
