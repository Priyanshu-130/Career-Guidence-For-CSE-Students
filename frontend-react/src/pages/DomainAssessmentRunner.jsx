import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  DomainAssessmentAgent, 
  AnswerEvaluationAgent, 
  SkillMappingAgent, 
  RoadmapGenerationAgent, 
  TrajectoryPlanningAgent 
} from '../data/adaptive/domainAssessmentAgent';
import { saveDomainAssessment, getDomainAssessment } from '../services/apiService';
import domainsData from '../data/domains.json';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  ShieldCheck,
  BarChart3,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export default function DomainAssessmentRunner() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const domain = domainsData.find(d => d.id === domainId) || {
    id: domainId,
    title: domainId ? domainId.toUpperCase() : 'CSE Domain',
    description: 'Computer Science Specialization'
  };

  // State
  const [phase, setPhase] = useState('profile'); // 'profile' | 'assessing' | 'eval_report'
  const [academicProfile, setAcademicProfile] = useState({
    currentSemester: 2,
    academicYear: '1st Year',
    completedSubjects: ['Programming Fundamentals (Python / C++)', 'Basic Mathematics & Logic'],
    careerObjective: 'Software & Intelligent Systems Engineer',
    availableWeeklyHours: '15-20 hours/week'
  });

  const [session, setSession] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [evalReport, setEvalReport] = useState(null);
  const [skillMapping, setSkillMapping] = useState(null);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [trajectory, setTrajectory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Load existing initial results if passed or stored
  const initialResults = location.state?.initialResults || (() => {
    try {
      const raw = sessionStorage.getItem('quiz_results');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const handleStartQuestions = () => {
    const newSession = DomainAssessmentAgent.initSession({
      domainId,
      initialResults,
      academicProfile
    });
    setSession(newSession);
    setPhase('assessing');
  };

  const handleSelectOption = (key) => {
    if (showFeedback) return;
    setSelectedKey(key);
  };

  const handleSubmitAnswer = () => {
    if (!selectedKey || !session) return;
    setShowFeedback(true);
  };

  const handleNextQuestion = async () => {
    if (!selectedKey || !session) return;

    const updatedSession = DomainAssessmentAgent.submitAnswer({
      session,
      selectedOptionKey: selectedKey,
      timeTakenSeconds: 15
    });

    if (updatedSession.isComplete) {
      setLoading(true);
      // Run AI Agent Pipeline
      const evaluation = AnswerEvaluationAgent.evaluate({ session: updatedSession });
      const skills = SkillMappingAgent.mapSkills({
        domainId,
        evaluationResults: evaluation,
        declaredPrerequisites: initialResults?.prerequisiteProfile?.declaredPrerequisites || []
      });
      const roadmap = RoadmapGenerationAgent.generateRoadmap({
        domainId,
        initialProfile: initialResults || {},
        domainEvaluation: evaluation,
        skillMapping: skills,
        academicProfile
      });
      const traj = TrajectoryPlanningAgent.planTrajectory({
        domainId,
        roadmap
      });

      setEvalReport(evaluation);
      setSkillMapping(skills);
      setGeneratedRoadmap(roadmap);
      setTrajectory(traj);

      // Persist to backend and local storage
      const email = user?.email || 'guest_student@pathfinder.edu';
      try {
        await saveDomainAssessment({
          student_email: email,
          domain_id: domainId,
          session_id: updatedSession.sessionId,
          knowledge_score: evaluation.demonstratedKnowledgeScore,
          evaluation_report: evaluation,
          roadmap_data: roadmap,
          trajectory_data: traj
        });
      } catch (err) {
        console.warn('Could not save domain assessment to server:', err);
      }

      // Save into sessionStorage for immediate navigation
      sessionStorage.setItem(`domain_assessment_${domainId}`, JSON.stringify(evaluation));
      sessionStorage.setItem(`domain_roadmap_${domainId}`, JSON.stringify(roadmap));
      sessionStorage.setItem(`domain_trajectory_${domainId}`, JSON.stringify(traj));

      setLoading(false);
      setPhase('eval_report');
    } else {
      setSession(updatedSession);
      setSelectedKey(null);
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const toggleCompletedSubject = (subj) => {
    const list = academicProfile.completedSubjects;
    if (list.includes(subj)) {
      setAcademicProfile({ ...academicProfile, completedSubjects: list.filter(s => s !== subj) });
    } else {
      setAcademicProfile({ ...academicProfile, completedSubjects: [...list, subj] });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* TOP NAVIGATION CRUMBS */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid #D8DAD7',
          marginBottom: '2.5rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.8125rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/results" style={{ color: '#646A73', textDecoration: 'none' }}>Diagnostic Results</Link>
            <span style={{ color: '#D8DAD7' }}>/</span>
            <span style={{ color: '#17191C', fontWeight: 700 }}>Domain Assessment ({domain.title})</span>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            color: '#E85D3F',
            fontWeight: 700
          }}>
            <Sparkles size={14} />
            <span>EXACTLY 10 QUESTIONS · GROUNDED IN O*NET, BEBRAS & CODE.ORG</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PHASE 1: ACADEMIC PROFILE CONFIRMATION */}
        {/* ------------------------------------------------------------------ */}
        {phase === 'profile' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              color: '#0284C7',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              INTELLIGENCE SOURCE C · ACADEMIC CALIBRATION
            </div>

            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '2.5rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#17191C',
              margin: '0 0 1rem 0'
            }}>
              Confirm Academic Context for {domain.title}
            </h1>

            <p style={{ color: '#50545B', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              The AI Roadmap Engine combines your initial diagnostic scores, your upcoming 10-question assessment, and your real-world academic profile to construct your 8-semester roadmap. Confirm your current progress below:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#17191C' }}>
                  CURRENT SEMESTER
                </label>
                <select
                  value={academicProfile.currentSemester}
                  onChange={(e) => {
                    const s = parseInt(e.target.value, 10);
                    const y = s <= 2 ? '1st Year' : (s <= 4 ? '2nd Year' : (s <= 6 ? '3rd Year' : '4th Year'));
                    setAcademicProfile({ ...academicProfile, currentSemester: s, academicYear: y });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #D8DAD7',
                    backgroundColor: '#F8F8F6',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.875rem'
                  }}
                >
                  <option value={1}>Semester 1 (1st Year - Fresh Student)</option>
                  <option value={2}>Semester 2 (1st Year - Spring)</option>
                  <option value={3}>Semester 3 (2nd Year - Sophomore)</option>
                  <option value={4}>Semester 4 (2nd Year - Mid-College)</option>
                  <option value={5}>Semester 5 (3rd Year - Junior Pre-Placement)</option>
                  <option value={6}>Semester 6 (3rd Year - Internship Season)</option>
                  <option value={7}>Semester 7 (4th Year - Senior Placements)</option>
                  <option value={8}>Semester 8 (4th Year - Capstone & Graduation)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#17191C' }}>
                  CAREER OBJECTIVE
                </label>
                <input
                  type="text"
                  value={academicProfile.careerObjective}
                  onChange={(e) => setAcademicProfile({ ...academicProfile, careerObjective: e.target.value })}
                  placeholder="e.g. Machine Learning Engineer, Cloud Architect, Full Stack Developer"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #D8DAD7',
                    backgroundColor: '#F8F8F6',
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#17191C' }}>
                  WEEKLY STUDY COMMITMENT
                </label>
                <select
                  value={academicProfile.availableWeeklyHours}
                  onChange={(e) => setAcademicProfile({ ...academicProfile, availableWeeklyHours: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #D8DAD7',
                    backgroundColor: '#F8F8F6',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="10-15 hours/week">10-15 hours/week (Standard College Load)</option>
                  <option value="15-20 hours/week">15-20 hours/week (Focused Technical Growth)</option>
                  <option value="20-25 hours/week">20-25 hours/week (Intensive Career Acceleration)</option>
                </select>
              </div>
            </div>

            {/* Completed Coursework Checkboxes */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#17191C' }}>
                PREVIOUSLY COMPLETED SUBJECTS & LABS (CLICK TO TOGGLE):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  'Programming Fundamentals (Python / C++)',
                  'Object-Oriented Programming (Java / C++)',
                  'Basic Mathematics & Logic',
                  'Data Structures & Algorithms',
                  'Database Management Systems (SQL)',
                  'Operating Systems Fundamentals',
                  'Computer Networks (TCP/IP)'
                ].map((subj, idx) => {
                  const isChecked = academicProfile.completedSubjects.includes(subj);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleCompletedSubject(subj)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.8125rem',
                        fontFamily: "'DM Mono', monospace",
                        backgroundColor: isChecked ? '#17191C' : '#FFFFFF',
                        color: isChecked ? '#FFFFFF' : '#50545B',
                        border: isChecked ? '1px solid #17191C' : '1px solid #D8DAD7',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isChecked ? <Check size={14} color="#10B981" /> : <span style={{ color: '#D8DAD7' }}>+</span>}
                      <span>{subj}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleStartQuestions}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#E85D3F',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.85rem 2rem',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(232, 93, 63, 0.25)'
              }}
            >
              <span>Begin 10-Question Assessment</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* PHASE 2: 10-QUESTION DEEP ASSESSMENT */}
        {/* ------------------------------------------------------------------ */}
        {phase === 'assessing' && session && session.currentQuestion && (
          <div>
            {/* Question counter */}
            <div style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 700, color: '#17191C' }}>
              Question {session.currentIndex + 1} of 10
            </div>

            {/* Question Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: '2.5rem',
              boxShadow: '0 4px 25px rgba(0,0,0,0.04)',
              marginBottom: '1.5rem'
            }}>
              {/* Provenance Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.6875rem',
                color: '#646A73',
                backgroundColor: '#F8F8F6',
                border: '1px solid #D8DAD7',
                padding: '0.25rem 0.65rem',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={12} color="#10B981" />
                <span>SOURCE: {session.currentQuestion.provenance.source}</span>
              </div>

              {/* Concept Headline */}
              <h4 style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.8125rem',
                color: '#E85D3F',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                margin: '0 0 0.5rem 0'
              }}>
                CONCEPT: {session.currentQuestion.concept}
              </h4>

              {/* Main Question Prompt */}
              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#17191C',
                lineHeight: 1.35,
                margin: '0 0 1.5rem 0'
              }}>
                {session.currentQuestion.prompt}
              </h2>

              {/* Plain English Helper Accordion */}
              {session.currentQuestion.plainEnglishHelper && (
                <div style={{
                  marginBottom: '1.5rem',
                  border: '1px solid #E0E7FF',
                  backgroundColor: '#F5F7FF',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '6px'
                }}>
                  <div 
                    onClick={() => setShowHint(!showHint)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.75rem',
                      color: '#4338CA',
                      fontWeight: 700
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <HelpCircle size={14} />
                      <span>💡 NEED A HINT? CLICK FOR PLAIN-ENGLISH CLARIFICATION</span>
                    </span>
                    <ChevronDown size={14} style={{ transform: showHint ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
                  </div>
                  {showHint && (
                    <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.875rem', color: '#3730A3', lineHeight: 1.55 }}>
                      {session.currentQuestion.plainEnglishHelper}
                    </p>
                  )}
                </div>
              )}

              {/* 4 Interactive Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {session.currentQuestion.options.map((opt) => {
                  const isSelected = selectedKey === opt.key;
                  let borderCol = isSelected ? '#17191C' : '#D8DAD7';
                  let bgCol = isSelected ? '#F8F8F6' : '#FFFFFF';

                  if (showFeedback) {
                    if (opt.isCorrect) {
                      borderCol = '#10B981';
                      bgCol = '#ECFDF5';
                    } else if (isSelected && !opt.isCorrect) {
                      borderCol = '#EF4444';
                      bgCol = '#FEF2F2';
                    }
                  }

                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        border: `2px solid ${borderCol}`,
                        backgroundColor: bgCol,
                        cursor: showFeedback ? 'default' : 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 800,
                        fontSize: '0.8125rem',
                        backgroundColor: isSelected ? '#17191C' : '#F0F0EE',
                        color: isSelected ? '#FFFFFF' : '#50545B',
                        flexShrink: 0
                      }}>
                        {opt.key}
                      </div>
                      <div style={{ flex: 1, fontSize: '0.9375rem', lineHeight: 1.5, color: '#17191C' }}>
                        {opt.text}
                      </div>
                      {showFeedback && opt.isCorrect && (
                        <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanatory Feedback Banner */}
              {showFeedback && (
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: '#F8F8F6',
                  borderLeft: '4px solid #0284C7',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: '#17191C'
                }}>
                  <strong style={{ color: '#0284C7', display: 'block', marginBottom: '0.35rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}>
                    CONCEPTUAL RATIONALE & FEEDBACK:
                  </strong>
                  {session.currentQuestion.options.find(o => o.key === selectedKey)?.conceptualExplanation}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                {!showFeedback ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedKey}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: selectedKey ? '#17191C' : '#D8DAD7',
                      color: '#FFFFFF',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: selectedKey ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Confirm Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 2rem',
                      backgroundColor: '#E85D3F',
                      color: '#FFFFFF',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{session.currentIndex + 1 === 10 ? 'Complete & Generate AI Report' : 'Next Question'}</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* PHASE 3: EVALUATION REPORT & DIAGNOSTIC INTELLIGENCE */}
        {/* ------------------------------------------------------------------ */}
        {phase === 'eval_report' && evalReport && (
          <div>
            {/* Verdict Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E85D3F',
              padding: '2.5rem',
              boxShadow: '0 8px 30px rgba(232, 93, 63, 0.08)',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#E85D3F',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>
                DIAGNOSTIC REPORT · ANSWER EVALUATION AGENT
              </div>

              <h1 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '3rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#17191C',
                lineHeight: 1,
                margin: '0 0 1rem 0'
              }}>
                {evalReport.domainTitle} Readiness Assessment
              </h1>

              <p style={{ color: '#50545B', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
                {evalReport.evaluatorSummary}
              </p>

              {/* 3 Cognitive Pillars */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#F8F8F6', border: '1px solid #D8DAD7' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73', marginBottom: '0.25rem' }}>
                    CONCEPTUAL UNDERSTANDING
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.25rem', fontWeight: 800, color: '#17191C' }}>
                    {evalReport.multiDimensionalScores.conceptualUnderstanding}%
                  </div>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#F8F8F6', border: '1px solid #D8DAD7' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73', marginBottom: '0.25rem' }}>
                    TECHNICAL PROFICIENCY
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.25rem', fontWeight: 800, color: '#0284C7' }}>
                    {evalReport.multiDimensionalScores.technicalProficiency}%
                  </div>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#F8F8F6', border: '1px solid #D8DAD7' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73', marginBottom: '0.25rem' }}>
                    PROBLEM SOLVING & COMPUTATIONAL THINKING
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.25rem', fontWeight: 800, color: '#2EC4B6' }}>
                    {evalReport.multiDimensionalScores.problemSolvingAbility}%
                  </div>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#FFF0EB', border: '1px solid #E85D3F' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#E85D3F', fontWeight: 700, marginBottom: '0.25rem' }}>
                    WEIGHTED READINESS SCORE
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.25rem', fontWeight: 800, color: '#E85D3F' }}>
                    {evalReport.demonstratedKnowledgeScore}%
                  </div>
                </div>
              </div>

              {/* Strengths and Knowledge Gaps */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #D8DAD7',
                marginBottom: '2rem'
              }}>
                <div>
                  <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8125rem', fontWeight: 700, color: '#10B981', margin: '0 0 0.75rem 0' }}>
                    ✓ DEMONSTRATED STRENGTHS:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#50545B', lineHeight: 1.6 }}>
                    {evalReport.strengths.map((str, idx) => (
                      <li key={idx} style={{ marginBottom: '0.35rem' }}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8125rem', fontWeight: 700, color: '#D97706', margin: '0 0 0.75rem 0' }}>
                    ⚠ IDENTIFIED KNOWLEDGE GAPS & TARGETED REMEDIATIONS:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#50545B', lineHeight: 1.6 }}>
                    {evalReport.knowledgeGaps.map((gap, idx) => (
                      <li key={idx} style={{ marginBottom: '0.35rem' }}>
                        <strong>{gap.concept}:</strong> {gap.remediation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/roadmap/${domainId}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#17191C',
                    color: '#FFFFFF',
                    padding: '0.85rem 1.75rem',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  <span>View Interactive Developer Roadmap (roadmap.sh)</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/domain-comparison"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#FFFFFF',
                    color: '#17191C',
                    border: '1px solid #17191C',
                    padding: '0.85rem 1.75rem',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  <BarChart3 size={16} />
                  <span>Domain Comparison Dashboard</span>
                </Link>

                <Link
                  to="/results"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#F7F7F4',
                    color: '#646A73',
                    border: '1px solid #D8DAD7',
                    padding: '0.85rem 1.5rem',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  <span>Assess Another Recommended Domain</span>
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
