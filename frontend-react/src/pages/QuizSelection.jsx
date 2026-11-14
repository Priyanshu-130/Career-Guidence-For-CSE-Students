import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Check, 
  GraduationCap, 
  HelpCircle 
} from 'lucide-react';
import { 
  TRACK_DESCRIPTIONS, 
  PREREQUISITE_DEFINITIONS,
  SEMESTER_OPTIONS,
  DOMAIN_FACTOR_OPTIONS
} from '../data/adaptive/domainAdvisorAgent';

export default function QuizSelection() {
  const navigate = useNavigate();
  
  // Track selection: 'software' | 'hardware'
  const [selectedTrack, setSelectedTrack] = useState('software');
  
  // Current Semester & Domain-shaping factors
  const [semester, setSemester] = useState('1-2');
  const [mathComfort, setMathComfort] = useState('balanced');
  const [workStyle, setWorkStyle] = useState('mix');
  const [careerGoal, setCareerGoal] = useState('job_ready');

  // Prerequisite mode: 'zero' | 'prerequisites'
  const [prereqMode, setPrereqMode] = useState('zero');
  
  // Selected prerequisites IDs
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [customKnowledge, setCustomKnowledge] = useState('');

  const currentTrackMeta = TRACK_DESCRIPTIONS[selectedTrack];
  const trackPrereqs = PREREQUISITE_DEFINITIONS[selectedTrack] || [];

  const handleTrackChange = (newTrack) => {
    setSelectedTrack(newTrack);
    setSelectedPrereqs([]);
    setCustomKnowledge('');
  };

  const togglePrereq = (id) => {
    if (selectedPrereqs.includes(id)) {
      setSelectedPrereqs(selectedPrereqs.filter(p => p !== id));
    } else {
      setSelectedPrereqs([...selectedPrereqs, id]);
    }
  };

  const handleStartAssessment = () => {
    navigate(`/quiz/${selectedTrack}`, {
      state: {
        track: selectedTrack,
        semester,
        prerequisiteMode: prereqMode,
        declaredPrerequisites: prereqMode === 'zero' ? [] : selectedPrereqs,
        domainFactors: {
          mathComfort,
          workStyle,
          careerGoal
        },
        customKnowledge: prereqMode === 'zero' ? '' : customKnowledge
      }
    });
  };

  return (
    <div style={{
      minHeight: '100%',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      padding: 'var(--space-4) var(--space-2) var(--space-8)'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

        {/* 1. EDITORIAL HEADING */}
        <div>
          <span className="mono-tag">Assessment Calibration</span>
          <h1 style={{ margin: 'var(--space-1) 0 var(--space-2) 0', color: 'var(--color-text)' }}>
            Choose Your Track
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-2)', margin: 0, maxWidth: '720px' }}>
            Select whether you want to evaluate Software Engineering or Hardware Engineering, and tell us your current semester to personalize your assessment.
          </p>
        </div>

        {/* 2. TRACK SELECTOR TABS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-2)'
        }}>
          <button
            type="button"
            onClick={() => handleTrackChange('software')}
            className={`card card-interactive ${selectedTrack === 'software' ? 'selected' : ''}`}
            style={{
              padding: 'var(--space-3)',
              textAlign: 'left',
              border: selectedTrack === 'software' ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
              backgroundColor: selectedTrack === 'software' ? 'var(--color-accent-lt)' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <Terminal size={22} color={selectedTrack === 'software' ? 'var(--color-accent)' : 'var(--color-text-2)'} />
              <h3 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>Software Track</h3>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-text-2)' }}>
              Full Stack, AI/ML, Cloud & Distributed Systems, Data Engineering, and Cybersecurity.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleTrackChange('hardware')}
            className={`card card-interactive ${selectedTrack === 'hardware' ? 'selected' : ''}`}
            style={{
              padding: 'var(--space-3)',
              textAlign: 'left',
              border: selectedTrack === 'hardware' ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
              backgroundColor: selectedTrack === 'hardware' ? 'var(--color-accent-lt)' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <Cpu size={22} color={selectedTrack === 'hardware' ? 'var(--color-accent)' : 'var(--color-text-2)'} />
              <h3 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>Hardware Track</h3>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-text-2)' }}>
              Embedded Systems, IoT, Robotics, VLSI Design, and Computer Networking.
            </p>
          </button>
        </div>

        {/* 3. TRACK PROFILE CARD */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)' }}>{currentTrackMeta.title}</h2>
              <p style={{ margin: 'var(--space-0-5) 0 0 0', fontSize: 'var(--text-base)', color: 'var(--color-text-2)' }}>
                {currentTrackMeta.overview}
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-1) var(--space-2)',
              backgroundColor: 'var(--color-bg-alt)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)'
            }}>
              <GraduationCap size={16} color="var(--color-accent)" />
              <span>ACM / IEEE CS2023 ALIGNED</span>
            </div>
          </div>

          {/* SEMESTER SELECTION */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>
              Which semester are you in?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
              {SEMESTER_OPTIONS.map((sem) => {
                const active = semester === sem.id;
                return (
                  <button
                    key={sem.id}
                    type="button"
                    onClick={() => setSemester(sem.id)}
                    className="card card-interactive"
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-2)',
                      border: active ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      backgroundColor: active ? 'var(--color-accent-lt)' : '#FFFFFF'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: active ? 'var(--color-accent)' : 'var(--color-text)' }}>
                      {sem.label}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-2)', marginTop: 'var(--space-0-5)' }}>
                      {sem.sublabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ENTRY MODE: ZERO PREREQS VS PRIOR EXPERIENCE */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>
              How would you like to start?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-2)' }}>
              
              <button
                type="button"
                onClick={() => setPrereqMode('zero')}
                className="card card-interactive"
                style={{
                  textAlign: 'left',
                  padding: 'var(--space-3)',
                  border: prereqMode === 'zero' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  backgroundColor: prereqMode === 'zero' ? 'var(--color-accent-lt)' : '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${prereqMode === 'zero' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    backgroundColor: prereqMode === 'zero' ? 'var(--color-accent)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {prereqMode === 'zero' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </span>
                  <strong style={{ fontSize: 'var(--text-base)' }}>Beginner / Starting Fresh</strong>
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-2)' }}>
                  No prior coding or hardware knowledge assumed. Evaluates intuitive logic and problem solving.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPrereqMode('prerequisites')}
                className="card card-interactive"
                style={{
                  textAlign: 'left',
                  padding: 'var(--space-3)',
                  border: prereqMode === 'prerequisites' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  backgroundColor: prereqMode === 'prerequisites' ? 'var(--color-accent-lt)' : '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${prereqMode === 'prerequisites' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    backgroundColor: prereqMode === 'prerequisites' ? 'var(--color-accent)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {prereqMode === 'prerequisites' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </span>
                  <strong style={{ fontSize: 'var(--text-base)' }}>I Have Prior Coursework</strong>
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-2)' }}>
                  Declare subjects you have already studied so we can calibrate conceptual depth.
                </p>
              </button>

            </div>
          </div>

          {/* PRIOR COURSEWORK CHECKLIST (if selected) */}
          {prereqMode === 'prerequisites' && (
            <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
                Select subjects you've already covered:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-2)' }}>
                {trackPrereqs.map((prereq) => {
                  const isChecked = selectedPrereqs.includes(prereq.id);
                  return (
                    <label
                      key={prereq.id}
                      onClick={() => togglePrereq(prereq.id)}
                      className="card card-interactive"
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2)',
                        border: isChecked ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                        backgroundColor: isChecked ? 'var(--color-accent-lt)' : '#FFFFFF',
                        margin: 0
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ marginTop: '3px' }}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>
                          {prereq.name}
                        </strong>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-2)' }}>
                          {prereq.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* SINGLE CLEAR PRIMARY ACTION */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={handleStartAssessment}
              className="btn-primary"
              style={{ width: '100%', maxWidth: '340px' }}
            >
              <span>Start Assessment</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
