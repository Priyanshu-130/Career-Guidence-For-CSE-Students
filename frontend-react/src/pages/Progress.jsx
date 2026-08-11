import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Activity, 
  Trophy, 
  Terminal, 
  Save, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  Edit3,
  ListTodo,
  ChevronRight
} from 'lucide-react';
import domainsData from '../data/domains.json';
import { getSemesterCurriculum, getApiBaseUrl, getSemesterSubtopics } from '../utils/roadmapHelper';

export default function Progress() {
  const { user } = useAuth();
  const [selectedDomainId, setSelectedDomainId] = useState('');
  const [recommendedDomainId, setRecommendedDomainId] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Note/Link editing states
  const [editingKey, setEditingKey] = useState(null); // 'semester-num'
  const [editNotes, setEditNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState({}); // { semesterNum: 'idle' | 'saving' | 'success' | 'error' }

  const apiBase = getApiBaseUrl();

  // Load recommended domain and progress on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);

      try {
        let domainRec = '';
        
        // 1. Get recommended domain
        if (user.isGuest) {
          // Default guest to the first domain in list ('ai')
          domainRec = 'ai';
          setRecommendedDomainId('ai');
          setSelectedDomainId('ai');
        } else {
          const resResp = await fetch(`${apiBase}/api/results/${user.email}`);
          const resData = await resResp.json();
          if (resData.status === 'success' && resData.results.length > 0) {
            // Find recommended domain mapping matching title
            const recTitle = resData.results[0].recommended_domain;
            // Match title with domain ID in domainsData
            const matchedDom = domainsData.find(
              d => d.title.toLowerCase().includes(recTitle.toLowerCase()) || 
                   recTitle.toLowerCase().includes(d.title.toLowerCase())
            );
            if (matchedDom) {
              domainRec = matchedDom.id;
              setRecommendedDomainId(matchedDom.id);
              setSelectedDomainId(matchedDom.id);
            } else {
              // Default to 'ai'
              domainRec = 'ai';
              setSelectedDomainId('ai');
            }
          } else {
            // No quiz results, default to 'ai'
            domainRec = 'ai';
            setSelectedDomainId('ai');
          }
        }

        // 2. Get progress data
        if (user.isGuest) {
          const guestSaved = localStorage.getItem(`pathfinder_guest_progress_${domainRec}`);
          setProgressData(guestSaved ? JSON.parse(guestSaved) : []);
        } else {
          const progResp = await fetch(`${apiBase}/api/progress/${user.email}`);
          const progData = await progResp.json();
          if (progData.status === 'success') {
            setProgressData(progData.progress || []);
          } else {
            throw new Error(progData.message || 'Failed to fetch progress');
          }
        }
      } catch (err) {
        console.error("Fetch progress error", err);
        setError("Unable to synchronize progress details. Serving local offline fallback.");
        // Local storage fallback for network error
        const localSaved = localStorage.getItem(`pathfinder_progress_fallback_${user.email}`);
        if (localSaved) {
          setProgressData(JSON.parse(localSaved));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Load progress if user changes selected domain
  const handleDomainChange = async (domainId) => {
    setSelectedDomainId(domainId);
    if (!user) return;
    
    setLoading(true);
    try {
      if (user.isGuest) {
        const guestSaved = localStorage.getItem(`pathfinder_guest_progress_${domainId}`);
        setProgressData(guestSaved ? JSON.parse(guestSaved) : []);
      } else {
        const progResp = await fetch(`${apiBase}/api/progress/${user.email}`);
        const progData = await progResp.json();
        if (progData.status === 'success') {
          setProgressData(progData.progress || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const domain = domainsData.find(d => d.id === selectedDomainId) || domainsData[0];
  const curriculum = getSemesterCurriculum(domain);

  // Helper to extract progress item details
  const getCourseProgress = (semNum, courseTitle) => {
    const matched = progressData.find(
      p => p.domain_id === selectedDomainId && 
           p.semester_num === semNum && 
           p.course_title === courseTitle
    );
    return matched || { status: 'Not Started', notes: '' };
  };

  // Helper to extract completed subtopics list safely
  const getCompletedSubtopics = (statusVal, subtopicsList) => {
    if (!statusVal) return [];
    try {
      if (statusVal.startsWith('[') && statusVal.endsWith(']')) {
        return JSON.parse(statusVal);
      }
    } catch (e) {
      // Not a JSON string, fallback below
    }
    if (statusVal === 'Completed') return subtopicsList;
    return [];
  };

  // Save progress status or notes
  const saveProgressState = async (semNum, courseTitle, newStatus, newNotes) => {
    const currentProgress = getCourseProgress(semNum, courseTitle);
    const updatedStatus = newStatus !== null ? newStatus : currentProgress.status;
    const updatedNotes = newNotes !== null ? newNotes : currentProgress.notes;

    // optimistic update
    const newProgressItem = {
      domain_id: selectedDomainId,
      semester_num: semNum,
      course_title: courseTitle,
      status: updatedStatus,
      notes: updatedNotes,
      updated_at: new Date().toISOString()
    };

    const updatedData = [...progressData];
    const matchIdx = updatedData.findIndex(
      p => p.domain_id === selectedDomainId && 
           p.semester_num === semNum && 
           p.course_title === courseTitle
    );

    if (matchIdx >= 0) {
      updatedData[matchIdx] = newProgressItem;
    } else {
      updatedData.push(newProgressItem);
    }
    setProgressData(updatedData);

    // Save persistence
    if (user.isGuest) {
      localStorage.setItem(`pathfinder_guest_progress_${selectedDomainId}`, JSON.stringify(updatedData));
      // Trigger a brief success state
      setSaveStatus(prev => ({ ...prev, [semNum]: 'success' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [semNum]: 'idle' }));
      }, 1500);
    } else {
      setSaveStatus(prev => ({ ...prev, [semNum]: 'saving' }));
      try {
        // Save to backend database
        const resp = await fetch(`${apiBase}/api/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_email: user.email,
            domain_id: selectedDomainId,
            semester_num: semNum,
            course_title: courseTitle,
            status: updatedStatus,
            notes: updatedNotes
          })
        });

        const data = await resp.json();
        if (data.status === 'success') {
          setSaveStatus(prev => ({ ...prev, [semNum]: 'success' }));
          // Backup fallback in local storage
          localStorage.setItem(`pathfinder_progress_fallback_${user.email}`, JSON.stringify(updatedData));
          setTimeout(() => {
            setSaveStatus(prev => ({ ...prev, [semNum]: 'idle' }));
          }, 1500);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error(err);
        setSaveStatus(prev => ({ ...prev, [semNum]: 'error' }));
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [semNum]: 'idle' }));
        }, 3000);
      }
    }
  };

  // Metrics calculations based on granular subtopics
  const stats = (() => {
    let completedCourses = 0;
    let inProgressCourses = 0;
    let notStartedCourses = 0;
    let totalSubtopicsCount = 0;
    let completedSubtopicsCount = 0;

    curriculum.forEach(sem => {
      const subtopics = getSemesterSubtopics(selectedDomainId, sem.semester);
      const prog = getCourseProgress(sem.semester, sem.course.title);
      const completedList = getCompletedSubtopics(prog.status, subtopics);

      totalSubtopicsCount += subtopics.length;
      completedSubtopicsCount += completedList.length;

      if (completedList.length === 0) {
        notStartedCourses++;
      } else if (completedList.length === subtopics.length) {
        completedCourses++;
      } else {
        inProgressCourses++;
      }
    });

    const completionRate = totalSubtopicsCount > 0 
      ? Math.round((completedSubtopicsCount / totalSubtopicsCount) * 100) 
      : 0;

    return { 
      completed: completedCourses, 
      inProgress: inProgressCourses, 
      notStarted: notStartedCourses, 
      completionRate 
    };
  })();

  const startEditingNotes = (semNum, currentNotes) => {
    setEditingKey(semNum);
    setEditNotes(currentNotes);
  };

  const handleSaveNotes = (semNum, courseTitle) => {
    saveProgressState(semNum, courseTitle, null, editNotes);
    setEditingKey(null);
  };

  if (loading) {
    return (
      <div className="page-wrapper content-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-accent)" />
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-3)', fontWeight: 600 }}>Loading curriculum progress...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper content-container animate-in" style={{ paddingTop: '1rem' }}>
      
      {/* Page Header */}
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="page-label" style={{ marginBottom: '1.25rem' }}>
          <Sparkles size={14} style={{ marginRight: '6px' }} /> Learning Trajectory Tracker
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>
              Your <span className="text-gradient">Progress.</span>
            </h1>
            <p style={{ color: 'var(--color-text-3)', fontSize: '1.125rem', maxWidth: '600px' }}>
              Check off courses, add custom repositories, log milestones, and map your academic progression semester-by-semester.
            </p>
          </div>
          
          {/* Domain Dropdown Selector */}
          <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Specialization</label>
            <select 
              value={selectedDomainId}
              onChange={(e) => handleDomainChange(e.target.value)}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '0.5rem 2rem 0.5rem 0.75rem',
                color: 'var(--color-text)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'var(--font)'
              }}
            >
              {domainsData.map((d) => (
                <option key={d.id} value={d.id} style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                  {d.title} {d.id === recommendedDomainId ? '(Recommended)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {error && (
        <div className="glass-card" style={{ padding: '1.25rem 2rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--color-danger)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(239, 68, 68, 0.03)' }}>
          <AlertCircle size={20} color="var(--color-danger)" />
          <span style={{ fontSize: '0.9375rem', color: 'var(--color-text-2)', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Trajectory Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
        
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: 'rgba(79, 70, 229, 0.08)', color: 'var(--color-accent)', borderRadius: '16px' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Completion Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stats.completionRate}%</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--color-success)', borderRadius: '16px' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Completed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stats.completed} / 8</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: 'rgba(139, 92, 246, 0.08)', color: 'var(--color-purple)', borderRadius: '16px' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>In Progress</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stats.inProgress} / 8</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: 'rgba(100, 116, 139, 0.08)', color: 'var(--color-text-3)', borderRadius: '16px' }}>
            <ListTodo size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Not Started</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stats.notStarted} / 8</div>
          </div>
        </div>

      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 700 }}>
          <span style={{ color: 'var(--color-text-2)' }}>Roadmap Milestone Progress</span>
          <span style={{ color: 'var(--color-accent)' }}>{stats.completionRate}% Done</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${stats.completionRate}%`, 
            height: '100%', 
            background: 'linear-gradient(to right, var(--color-accent), var(--color-purple), var(--color-success))', 
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 0 10px rgba(79, 70, 229, 0.2)'
          }}></div>
        </div>
      </div>

      {/* Curriculum Semester Timeline Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '2rem' }}>
        
        {curriculum.map((sem) => {
          const subtopics = getSemesterSubtopics(selectedDomainId, sem.semester);
          const prog = getCourseProgress(sem.semester, sem.course.title);
          const completedList = getCompletedSubtopics(prog.status, subtopics);
          const isAllCompleted = completedList.length === subtopics.length;
          const isEditing = editingKey === sem.semester;
          
          let cardBorderColor = '';
          let cardBoxShadow = '';
          if (completedList.length === subtopics.length) {
            cardBorderColor = 'rgba(16, 185, 129, 0.2)';
          } else if (completedList.length > 0) {
            cardBorderColor = 'rgba(139, 92, 246, 0.2)';
            cardBoxShadow = `0 8px 30px -10px ${sem.color}22`;
          }

          return (
            <div 
              key={sem.semester} 
              className="glass-card" 
              style={{ 
                padding: '2.5rem', 
                borderLeft: `5px solid ${sem.color}`, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem',
                boxShadow: cardBoxShadow,
                borderColor: cardBorderColor
              }}
            >
              
              {/* Semester Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: sem.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                    {sem.subtitle}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{sem.title}</h3>
                </div>
                
                {/* Sync status toast pill */}
                {saveStatus[sem.semester] && saveStatus[sem.semester] !== 'idle' && (
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    color: '#fff',
                    background: saveStatus[sem.semester] === 'saving' ? 'var(--color-purple)' :
                                saveStatus[sem.semester] === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
                    animation: 'pulse 1s infinite alternate'
                  }}>
                    {saveStatus[sem.semester] === 'saving' ? 'Saving...' :
                     saveStatus[sem.semester] === 'success' ? 'Synced' : 'Sync Error'}
                  </div>
                )}
              </div>

              {/* Course Title and Description */}
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input 
                    type="checkbox"
                    checked={isAllCompleted}
                    onChange={(e) => {
                      const nextStatus = e.target.checked ? JSON.stringify(subtopics) : JSON.stringify([]);
                      saveProgressState(sem.semester, sem.course.title, nextStatus, null);
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      accentColor: 'var(--color-success)',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}
                  />
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-3)', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                    <Terminal size={14} />
                  </div>
                  <h4 style={{ 
                    fontSize: '1.1rem', 
                    margin: 0, 
                    fontWeight: 700, 
                    color: isAllCompleted ? 'var(--color-text-3)' : 'var(--color-text)',
                    textDecoration: isAllCompleted ? 'line-through' : 'none',
                    transition: 'var(--transition)'
                  }}>
                    {sem.course.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                  {sem.course.desc}
                </p>

                {/* Granular Sub-topics Checklist */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem', 
                  background: 'rgba(79, 70, 229, 0.02)', 
                  border: '1px dashed var(--color-border)', 
                  borderRadius: '12px', 
                  padding: '1.25rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
                    Topics Coverage Checklist ({completedList.length} / {subtopics.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {subtopics.map((topic, tIdx) => {
                      const isTopicChecked = completedList.includes(topic);
                      return (
                        <label key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-text-2)', userSelect: 'none' }}>
                          <input 
                            type="checkbox"
                            checked={isTopicChecked}
                            onChange={(e) => {
                              let updatedList;
                              if (e.target.checked) {
                                updatedList = [...completedList, topic];
                              } else {
                                updatedList = completedList.filter(s => s !== topic);
                              }
                              const nextStatus = JSON.stringify(updatedList);
                              saveProgressState(sem.semester, sem.course.title, nextStatus, null);
                            }}
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '4px',
                              accentColor: 'var(--color-success)',
                              marginTop: '2px',
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                          />
                          <span style={{ 
                            textDecoration: isTopicChecked ? 'line-through' : 'none', 
                            color: isTopicChecked ? 'var(--color-text-3)' : 'var(--color-text-2)',
                            transition: 'var(--transition)',
                            lineHeight: 1.4
                          }}>
                            {topic}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Progress Status Controller */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Progress Status
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '0.25rem' }}>
                  
                  {/* Not Started Pill */}
                  <button 
                    onClick={() => saveProgressState(sem.semester, sem.course.title, JSON.stringify([]), null)}
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      background: completedList.length === 0 ? 'var(--color-text-3)' : 'transparent',
                      color: completedList.length === 0 ? '#fff' : 'var(--color-text-3)',
                    }}
                  >
                    Not Started
                  </button>

                  {/* In Progress Pill */}
                  <button 
                    onClick={() => {
                      const nextList = (completedList.length > 0 && completedList.length < subtopics.length)
                        ? completedList
                        : [subtopics[0]];
                      saveProgressState(sem.semester, sem.course.title, JSON.stringify(nextList), null);
                    }}
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      background: (completedList.length > 0 && completedList.length < subtopics.length) ? 'var(--color-purple)' : 'transparent',
                      color: (completedList.length > 0 && completedList.length < subtopics.length) ? '#fff' : 'var(--color-text-3)',
                      boxShadow: (completedList.length > 0 && completedList.length < subtopics.length) ? `0 4px 12px ${sem.color}33` : ''
                    }}
                  >
                    In Progress
                  </button>

                  {/* Completed Pill */}
                  <button 
                    onClick={() => saveProgressState(sem.semester, sem.course.title, JSON.stringify(subtopics), null)}
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      background: completedList.length === subtopics.length ? 'var(--color-success)' : 'transparent',
                      color: completedList.length === subtopics.length ? '#fff' : 'var(--color-text-3)',
                      boxShadow: completedList.length === subtopics.length ? '0 4px 12px rgba(16, 185, 129, 0.2)' : ''
                    }}
                  >
                    Completed
                  </button>

                </div>
              </div>

              {/* Notes and Portfolio Links Section */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Notes & Links
                  </div>
                  {!isEditing && (
                    <button 
                      onClick={() => startEditingNotes(sem.semester, prog.notes)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-accent)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        transition: 'var(--transition)'
                      }}
                      className="edit-notes-btn"
                    >
                      <Edit3 size={12} /> {prog.notes ? 'Edit Notes' : 'Add Notes'}
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="e.g. Github Repo Link: github.com/user/project or Coursera Certificate notes..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        background: 'rgba(0,0,0,0.01)',
                        color: 'var(--color-text)',
                        fontFamily: 'var(--font)',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setEditingKey(null)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          padding: '0.4rem 1rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: 'var(--color-text-3)'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSaveNotes(sem.semester, sem.course.title)}
                        style={{
                          background: 'var(--color-accent)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '6px',
                          padding: '0.4rem 1.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Save size={12} /> Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {prog.notes ? (
                      <div style={{
                        background: 'rgba(0,0,0,0.01)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        color: 'var(--color-text-2)',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {/* Auto detect simple URLs and render link tags */}
                        {prog.notes.split(/(\s+)/).map((word, i) => {
                          if (word.startsWith('http://') || word.startsWith('https://') || word.startsWith('github.com')) {
                            const url = word.startsWith('github.com') ? `https://${word}` : word;
                            return (
                              <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.15rem', textDecoration: 'none' }}>
                                Link <ExternalLink size={10} />
                              </a>
                            );
                          }
                          return word;
                        })}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', fontStyle: 'italic' }}>
                        No notes or project links added yet.
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}

      </div>

      {/* Return to Explore domains card */}
      <div className="glass-card" style={{ marginTop: '5rem', padding: '3.5rem', textAlign: 'center', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.15)' }}>
        <BookOpen size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--color-purple)' }} />
        <h3 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Want to check full syllabus topics?</h3>
        <p style={{ color: 'var(--color-text-3)', maxWidth: '500px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
          Explore detailed external courses, coding guidelines, textbooks, and interactive sites recommended for this specialization.
        </p>
        <Link to={`/roadmap/${selectedDomainId}`} className="btn-primary" style={{ padding: '1.1rem 3rem', fontSize: '1rem' }}>Open Domain Curriculum <ChevronRight size={18} style={{ marginLeft: '4px' }} /></Link>
      </div>

    </div>
  );
}
