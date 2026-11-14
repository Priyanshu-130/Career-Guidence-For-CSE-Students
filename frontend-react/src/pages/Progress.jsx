import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Activity, 
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
import { getDomainSelection } from '../services/apiService';

export default function Progress() {
  const { user } = useAuth();
  const [selectedDomainId, setSelectedDomainId] = useState('');
  const [recommendedDomainId, setRecommendedDomainId] = useState('');
  const [primaryDomainId, setPrimaryDomainId] = useState('');
  const [secondaryDomainIds, setSecondaryDomainIds] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Note/Link editing states
  const [editingKey, setEditingKey] = useState(null); // 'semester-num'
  const [editNotes, setEditNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState({}); // { semesterNum: 'idle' | 'saving' | 'success' | 'error' }

  const apiBase = getApiBaseUrl();

  // Load recommended domain, primary selection, and progress on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);

      try {
        let domainRec = '';
        let designatedPrimary = localStorage.getItem('pathfinder_primary_domain') || '';
        let designatedSecondaries = [];
        try {
          const rawSec = localStorage.getItem('pathfinder_secondary_domains');
          if (rawSec) designatedSecondaries = JSON.parse(rawSec);
        } catch (e) {}

        // Check backend domain selection if authenticated or local
        try {
          const selResp = await getDomainSelection(user.email || 'guest@pathfinder.edu');
          if (selResp?.status === 'success' && selResp?.selection) {
            if (selResp.selection.primary_domain) {
              designatedPrimary = selResp.selection.primary_domain;
            }
            if (Array.isArray(selResp.selection.secondary_domains)) {
              designatedSecondaries = selResp.selection.secondary_domains;
            }
          }
        } catch (e) {
          console.warn("Could not retrieve domain selection:", e);
        }

        if (designatedPrimary) {
          setPrimaryDomainId(designatedPrimary);
          setSecondaryDomainIds(designatedSecondaries);
          domainRec = designatedPrimary;
          setSelectedDomainId(designatedPrimary);
        } else {
          // Fallback to initial recommended domain
          if (user.isGuest) {
            domainRec = 'ai';
            setRecommendedDomainId('ai');
            setSelectedDomainId('ai');
          } else {
            const resResp = await fetch(`${apiBase}/api/results/${user.email}`);
            const resData = await resResp.json();
            if (resData.status === 'success' && resData.results.length > 0) {
              const recTitle = resData.results[0].recommended_domain;
              const matchedDom = domainsData.find(
                d => d.title.toLowerCase().includes(recTitle.toLowerCase()) || 
                     recTitle.toLowerCase().includes(d.title.toLowerCase())
              );
              if (matchedDom) {
                domainRec = matchedDom.id;
                setRecommendedDomainId(matchedDom.id);
                setSelectedDomainId(matchedDom.id);
              } else {
                domainRec = 'ai';
                setSelectedDomainId('ai');
              }
            } else {
              domainRec = 'ai';
              setSelectedDomainId('ai');
            }
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
        const localSaved = localStorage.getItem(`pathfinder_progress_fallback_${user?.email || 'guest'}`);
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
      // fallback
    }
    if (statusVal === 'Completed') return subtopicsList;
    return [];
  };

  // Save progress status or notes
  const saveProgressState = async (semNum, courseTitle, newStatus, newNotes) => {
    const currentProgress = getCourseProgress(semNum, courseTitle);
    const updatedStatus = newStatus !== null ? newStatus : currentProgress.status;
    const updatedNotes = newNotes !== null ? newNotes : currentProgress.notes;

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

    // Persistence
    if (user.isGuest) {
      localStorage.setItem(`pathfinder_guest_progress_${selectedDomainId}`, JSON.stringify(updatedData));
      setSaveStatus(prev => ({ ...prev, [semNum]: 'success' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [semNum]: 'idle' }));
      }, 1500);
    } else {
      setSaveStatus(prev => ({ ...prev, [semNum]: 'saving' }));
      try {
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

  // Metrics calculations
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
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F7F4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Manrope', sans-serif"
      }}>
        <Loader2 className="animate-spin" size={40} color="#E85D3F" />
        <p style={{ marginTop: '1.25rem', color: '#50545B', fontFamily: "'DM Mono', monospace", fontSize: '0.875rem' }}>
          SYNCHRONIZING TRAJECTORY DATA...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

        {/* 2. HERO HEADER & DOMAIN SELECTOR */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: '#FFF0EB',
              border: '1px solid #E85D3F',
              color: '#E85D3F',
              fontWeight: 700,
              fontSize: '0.75rem',
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: '9999px',
              marginBottom: '1rem'
            }}>
              <Activity size={13} />
              <span>TRK-05 // INDIVIDUAL LEARNING TRAJECTORY</span>
            </div>

            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#17191C',
              margin: '0 0 1rem 0'
            }}>
              TRACK YOUR <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#E85D3F', textTransform: 'none' }}>Academic Trajectory</span>.
            </h1>

            <p style={{
              color: '#50545B',
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              maxWidth: '680px',
              lineHeight: 1.6,
              margin: 0
            }}>
              Check off verified curriculum topics, link live project repositories, log course milestones, and observe real-time semester progression towards capstone mastery.
            </p>
          </div>

          {/* Domain Dropdown Selector */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            borderRadius: '1.25rem',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            minWidth: '280px'
          }}>
            <label style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.6875rem',
              fontWeight: 800,
              color: '#646A73',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              SPECIALIZATION FOCUS
            </label>
            <select 
              value={selectedDomainId}
              onChange={(e) => handleDomainChange(e.target.value)}
              style={{
                backgroundColor: '#F7F7F4',
                border: '1px solid #D8DAD7',
                borderRadius: '0.75rem',
                padding: '0.65rem 1rem',
                color: '#17191C',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: "'Manrope', sans-serif"
              }}
            >
              {domainsData.map((d) => (
                <option key={d.id} value={d.id} style={{ backgroundColor: '#FFFFFF', color: '#17191C' }}>
                  {d.title} {d.id === primaryDomainId ? '★ (Primary Career Trajectory)' : secondaryDomainIds.includes(d.id) ? '◆ (Secondary Interest)' : d.id === recommendedDomainId ? '(Recommended)' : ''}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* PRIMARY & SECONDARY DESIGNATION BANNER */}
        {primaryDomainId && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            borderLeft: '4px solid #E85D3F',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Sparkles size={18} color="#E85D3F" />
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 800, color: '#E85D3F', textTransform: 'uppercase' }}>
                  DESIGNATED PRIMARY CAREER TRAJECTORY:
                </span>{' '}
                <strong style={{ color: '#17191C', fontSize: '0.9375rem' }}>
                  {domainsData.find(d => d.id === primaryDomainId)?.title || primaryDomainId.toUpperCase()}
                </strong>
              </div>
              {secondaryDomainIds && secondaryDomainIds.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#646A73' }}>Secondary Domains:</span>
                  {secondaryDomainIds.map(sId => (
                    <span key={sId} style={{
                      backgroundColor: '#F3F4F6',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#374151'
                    }}>
                      {domainsData.find(d => d.id === sId)?.title || sId}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/domain-comparison"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#E85D3F',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                fontFamily: "'DM Mono', monospace"
              }}
            >
              COMPARE & SWITCH DOMAINS <ChevronRight size={14} />
            </Link>
          </div>
        )}

        {error && (
          <div style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: '#FFF0EB',
            border: '1px solid #E85D3F',
            borderRadius: '1rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <AlertCircle size={20} color="#E85D3F" />
            <span style={{ fontSize: '0.875rem', color: '#17191C', fontWeight: 600 }}>{error}</span>
          </div>
        )}

        {/* 3. FOUR METRICS OVERVIEW CARDS (RESTORA PROPORTIONS) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '1rem',
              backgroundColor: '#FFF0EB',
              color: '#E85D3F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E85D3F'
            }}>
              <Activity size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#646A73', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                COMPLETION RATE
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#17191C' }}>
                {stats.completionRate}%
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '1rem',
              backgroundColor: '#F0FDF4',
              color: '#2EC4B6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #2EC4B6'
            }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#646A73', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                COMPLETED
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#17191C' }}>
                {stats.completed} <span style={{ fontSize: '1.25rem', color: '#646A73', fontWeight: 600 }}>/ 8</span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '1rem',
              backgroundColor: '#F0F9FF',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #0284C7'
            }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#646A73', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                IN PROGRESS
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#17191C' }}>
                {stats.inProgress} <span style={{ fontSize: '1.25rem', color: '#646A73', fontWeight: 600 }}>/ 8</span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '1rem',
              backgroundColor: '#F7F7F4',
              color: '#646A73',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #D8DAD7'
            }}>
              <ListTodo size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#646A73', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                NOT STARTED
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#17191C' }}>
                {stats.notStarted} <span style={{ fontSize: '1.25rem', color: '#646A73', fontWeight: 600 }}>/ 8</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4. PROGRESS BAR CONTAINER */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DAD7',
          borderRadius: '1.25rem',
          padding: '1.5rem 1.75rem',
          marginBottom: '3.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <span style={{ color: '#17191C' }}>AGGREGATE CURRICULUM SATISFACTION</span>
            <span style={{ color: '#E85D3F' }}>{stats.completionRate}% COMPLETE</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#E8EAE6',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${stats.completionRate}%`, 
              height: '100%', 
              backgroundColor: '#E85D3F',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* 5. CURRICULUM SEMESTER TIMELINE CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {curriculum.map((sem) => {
            const subtopics = getSemesterSubtopics(selectedDomainId, sem.semester);
            const prog = getCourseProgress(sem.semester, sem.course.title);
            const completedList = getCompletedSubtopics(prog.status, subtopics);
            const isAllCompleted = completedList.length === subtopics.length && subtopics.length > 0;
            const isEditing = editingKey === sem.semester;

            return (
              <div 
                key={sem.semester} 
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.25rem',
                  border: isAllCompleted ? '2px solid #2EC4B6' : '1px solid #D8DAD7',
                  padding: '2.25rem',
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  transition: 'border-color 0.2s ease, transform 0.2s ease'
                }}
              >
                
                {/* Semester Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#E85D3F',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.25rem'
                    }}>
                      {sem.subtitle || `SEMESTER 0${sem.semester}`}
                    </div>
                    <h3 style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1.65rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#17191C',
                      margin: 0
                    }}>
                      {sem.title}
                    </h3>
                  </div>
                  
                  {/* Sync status toast pill */}
                  {saveStatus[sem.semester] && saveStatus[sem.semester] !== 'idle' && (
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      color: '#FFFFFF',
                      backgroundColor: saveStatus[sem.semester] === 'saving' ? '#0284C7' :
                                       saveStatus[sem.semester] === 'success' ? '#2EC4B6' : '#E85D3F'
                    }}>
                      {saveStatus[sem.semester] === 'saving' ? 'Saving...' :
                       saveStatus[sem.semester] === 'success' ? 'Synced ✓' : 'Sync Error'}
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
                        borderRadius: '4px',
                        cursor: 'pointer',
                        accentColor: '#2EC4B6',
                        flexShrink: 0
                      }}
                    />
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#F7F7F4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#646A73',
                      border: '1px solid #D8DAD7',
                      flexShrink: 0
                    }}>
                      <Terminal size={14} />
                    </div>
                    <h4 style={{ 
                      fontSize: '1.1rem', 
                      margin: 0, 
                      fontWeight: 700, 
                      color: isAllCompleted ? '#646A73' : '#17191C',
                      textDecoration: isAllCompleted ? 'line-through' : 'none'
                    }}>
                      {sem.course.title}
                    </h4>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#50545B', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                    {sem.course.desc}
                  </p>

                  {/* Granular Sub-topics Checklist */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.75rem', 
                    backgroundColor: '#F7F7F4', 
                    border: '1px solid #D8DAD7', 
                    borderRadius: '1rem', 
                    padding: '1.25rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#646A73',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      borderBottom: '1px solid #D8DAD7',
                      paddingBottom: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      TOPICS COVERAGE CHECKLIST ({completedList.length} / {subtopics.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {subtopics.map((topic, tIdx) => {
                        const isTopicChecked = completedList.includes(topic);
                        return (
                          <label key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#17191C', userSelect: 'none' }}>
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
                                accentColor: '#2EC4B6',
                                marginTop: '3px',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            />
                            <span style={{ 
                              textDecoration: isTopicChecked ? 'line-through' : 'none', 
                              color: isTopicChecked ? '#8E95A0' : '#17191C',
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
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#646A73',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.65rem'
                  }}>
                    STATUS SETTING
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    backgroundColor: '#F7F7F4',
                    border: '1px solid #D8DAD7',
                    borderRadius: '0.75rem',
                    padding: '0.3rem'
                  }}>
                    
                    {/* Not Started Pill */}
                    <button 
                      type="button"
                      onClick={() => saveProgressState(sem.semester, sem.course.title, JSON.stringify([]), null)}
                      style={{
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: "'DM Mono', monospace",
                        background: completedList.length === 0 ? '#17191C' : 'transparent',
                        color: completedList.length === 0 ? '#FFFFFF' : '#646A73',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Not Started
                    </button>

                    {/* In Progress Pill */}
                    <button 
                      type="button"
                      onClick={() => {
                        const nextList = (completedList.length > 0 && completedList.length < subtopics.length)
                          ? completedList
                          : [subtopics[0]];
                        saveProgressState(sem.semester, sem.course.title, JSON.stringify(nextList), null);
                      }}
                      style={{
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: "'DM Mono', monospace",
                        background: (completedList.length > 0 && completedList.length < subtopics.length) ? '#0284C7' : 'transparent',
                        color: (completedList.length > 0 && completedList.length < subtopics.length) ? '#FFFFFF' : '#646A73',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      In Progress
                    </button>

                    {/* Completed Pill */}
                    <button 
                      type="button"
                      onClick={() => saveProgressState(sem.semester, sem.course.title, JSON.stringify(subtopics), null)}
                      style={{
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: "'DM Mono', monospace",
                        background: isAllCompleted ? '#2EC4B6' : 'transparent',
                        color: isAllCompleted ? '#FFFFFF' : '#646A73',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Completed
                    </button>

                  </div>
                </div>

                {/* Notes and Portfolio Links Section */}
                <div style={{ borderTop: '1px solid #D8DAD7', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#646A73', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      PROJECT NOTES & REPOSITORIES
                    </div>
                    {!isEditing && (
                      <button 
                        type="button"
                        onClick={() => startEditingNotes(sem.semester, prog.notes)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#E85D3F',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontFamily: "'DM Mono', monospace"
                        }}
                      >
                        <Edit3 size={12} /> {prog.notes ? 'Edit Notes' : '+ Add Notes'}
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="e.g. GitHub: github.com/username/project or Coursera Capstone certificate notes..."
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          borderRadius: '0.75rem',
                          border: '1px solid #D8DAD7',
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          backgroundColor: '#F7F7F4',
                          color: '#17191C',
                          fontFamily: "'Manrope', sans-serif",
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          type="button"
                          onClick={() => setEditingKey(null)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #D8DAD7',
                            borderRadius: '9999px',
                            padding: '0.4rem 1rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: '#50545B',
                            fontFamily: "'DM Mono', monospace"
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleSaveNotes(sem.semester, sem.course.title)}
                          style={{
                            backgroundColor: '#17191C',
                            border: 'none',
                            color: '#FFFFFF',
                            borderRadius: '9999px',
                            padding: '0.4rem 1.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontFamily: "'DM Mono', monospace"
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
                          backgroundColor: '#F7F7F4',
                          border: '1px solid #D8DAD7',
                          borderRadius: '0.75rem',
                          padding: '0.75rem 1rem',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          color: '#17191C',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {prog.notes.split(/(\s+)/).map((word, i) => {
                            if (word.startsWith('http://') || word.startsWith('https://') || word.startsWith('github.com')) {
                              const url = word.startsWith('github.com') ? `https://${word}` : word;
                              return (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#E85D3F', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.15rem', textDecoration: 'none' }}>
                                  Link <ExternalLink size={10} />
                                </a>
                              );
                            }
                            return word;
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8125rem', color: '#8E95A0', fontStyle: 'italic' }}>
                          No notes or project repositories logged yet.
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* 6. BOTTOM EXPLORE CURRICULUM BANNER */}
        <div style={{
          backgroundColor: '#17191C',
          borderRadius: '1.5rem',
          padding: '3.5rem 2.5rem',
          textAlign: 'center',
          color: '#FFFFFF',
          boxShadow: '0 8px 32px rgba(23, 25, 28, 0.15)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: '#20252B',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#2EC4B6',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            borderRadius: '9999px',
            marginBottom: '1.5rem'
          }}>
            <BookOpen size={14} />
            <span>FULL ACM/IEEE CS2023 SPECIFICATION</span>
          </div>

          <h3 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            margin: '0 0 1rem 0'
          }}>
            Inspect the Connected Semester Roadmap
          </h3>

          <p style={{
            color: '#D8DAD7',
            maxWidth: '560px',
            margin: '0 auto 2.5rem auto',
            fontSize: '1.05rem',
            lineHeight: 1.6
          }}>
            Explore detailed external courses, textbooks, interactive platforms, and capstone milestones curated for {domain.title}.
          </p>

          <Link 
            to={`/roadmap/${selectedDomainId}`} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#E85D3F',
              color: '#FFFFFF',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(232, 93, 63, 0.3)'
            }}
          >
            <span>Open Domain Curriculum</span>
            <ChevronRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
