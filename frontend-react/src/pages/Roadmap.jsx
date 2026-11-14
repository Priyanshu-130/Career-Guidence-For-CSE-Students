import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Terminal, 
  ArrowRight, 
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Clock, 
  ExternalLink,
  Sparkles,
  ListTodo,
  Search,
  X,
  Filter,
  Circle
} from 'lucide-react';
import domainsData from '../data/domains.json';
import { getPhase4DomainBundle } from '../data/phase4DataLoader';
import { getCustomizedRoadmap } from '../utils/roadmapHelper';
import { getMastery, getDomainAssessment } from '../services/apiService';
import { TrajectoryPlanningAgent } from '../data/adaptive/domainAssessmentAgent';
import { useAuth } from '../context/AuthContext';
import { ROADMAP_SH_DOMAINS } from '../data/roadmapShData';

const PHASE4_ROADMAP_ALIAS = {
  mobile: 'web',
  systems: 'iot',
};

const NODE_TYPE_META = {
  recommended: {
    label: 'Recommended Path',
    shortLabel: 'Recommended',
    bg: '#FEF3C7',
    color: '#B45309',
    border: '#FCD34D',
    dot: '#F59E0B',
  },
  alternative: {
    label: 'Alternative Option',
    shortLabel: 'Alternative',
    bg: '#E0F2FE',
    color: '#0369A1',
    border: '#BAE6FD',
    dot: '#0284C7',
  },
  good_to_know: {
    label: 'Good to Know',
    shortLabel: 'Good to Know',
    bg: '#F3F4F6',
    color: '#4B5563',
    border: '#E5E7EB',
    dot: '#6B7280',
  },
};

const LEARNING_STATUS_OPTIONS = [
  { key: 'to_learn', label: 'To Learn', color: '#475569', bg: '#FFFFFF', border: '#CBD5E1' },
  { key: 'in_progress', label: 'In Progress', color: '#B45309', bg: '#FEF3C7', border: '#F59E0B' },
  { key: 'done', label: 'Done', color: '#047857', bg: '#ECFDF5', border: '#10B981' },
];

function getNodeTypeMeta(type) {
  return NODE_TYPE_META[type] || NODE_TYPE_META.good_to_know;
}

function getHostLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'External resource';
  }
}

export default function Roadmap() {
  const { id } = useParams();
  const { user } = useAuth();
  const aliasId = PHASE4_ROADMAP_ALIAS[id] || id;
  const baseDomain = domainsData.find(d => d.id === aliasId);
  const phase4Bundle = aliasId !== id ? getPhase4DomainBundle(id) : null;
  const domain = baseDomain
    ? {
        ...baseDomain,
        id: aliasId,
        routeId: id,
        title: phase4Bundle?.domain?.name || baseDomain.title,
        description: phase4Bundle?.domain?.overview || baseDomain.description,
      }
    : null;

  // View tabs: 'visual_flow' (roadmap.sh) | 'roadmap' (8-Semester Academic) | 'trajectory' (Milestone Tracker)
  const [activeTab, setActiveTab] = useState('visual_flow');
  const [verifiedMastery, setVerifiedMastery] = useState({});
  const [aiPersonalizedRoadmap, setAiPersonalizedRoadmap] = useState(null);
  const [trajectoryData, setTrajectoryData] = useState(null);

  // roadmap.sh interactive node states: { [nodeId]: 'to_learn' | 'in_progress' | 'done' }
  const [nodeStates, setNodeStates] = useState(() => {
    try {
      const saved = localStorage.getItem(`pathfinder_roadmap_nodes_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Subtopics interactive checkable items: { [subtopicKey]: boolean }
  const [subtopicChecklist, setSubtopicChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(`pathfinder_subtopics_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Selected topic node for roadmap.sh side drawer / modal
  const [selectedNode, setSelectedNode] = useState(null);

  // Search and Filter for visual flow
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'recommended' | 'done' | 'in_progress' | 'to_learn'

  // Completed Semesters Tracking
  const [completedSemesters, setCompletedSemesters] = useState(() => {
    try {
      const saved = localStorage.getItem(`roadmap_progress_${id}`);
      return saved ? JSON.parse(saved) : [1];
    } catch (e) {
      return [1];
    }
  });

  // Individual Milestone Checkbox Tracking
  const [milestoneChecklist, setMilestoneChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(`trajectory_checklist_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const loadData = async () => {
      const email = user?.email || 'guest_student@pathfinder.edu';
      
      // 1. Load adaptive mastery
      try {
        const res = await getMastery(email);
        if (res && res.current_mastery) {
          setVerifiedMastery(res.current_mastery);
        }
      } catch (e) {
        console.error('Failed to load mastery:', e);
      }

      // 2. Check for AI-Agent-Generated Domain Assessment Roadmap
      try {
        let loadedRoadmap = null;
        let loadedTrajectory = null;

        const sessionRoadmap = sessionStorage.getItem(`domain_roadmap_${id}`);
        const sessionTraj = sessionStorage.getItem(`domain_trajectory_${id}`);
        if (sessionRoadmap) {
          loadedRoadmap = JSON.parse(sessionRoadmap);
          if (sessionTraj) loadedTrajectory = JSON.parse(sessionTraj);
        }

        if (!loadedRoadmap) {
          const apiRes = await getDomainAssessment(email, id);
          if (apiRes && apiRes.assessment && apiRes.assessment.roadmap_data) {
            loadedRoadmap = apiRes.assessment.roadmap_data;
            if (apiRes.assessment.trajectory_data) {
              loadedTrajectory = apiRes.assessment.trajectory_data;
            }
          }
        }

        if (loadedRoadmap) {
          setAiPersonalizedRoadmap(loadedRoadmap);
          if (loadedTrajectory) {
            setTrajectoryData(loadedTrajectory);
          } else {
            setTrajectoryData(TrajectoryPlanningAgent.planTrajectory({ domainId: id, roadmap: loadedRoadmap }));
          }
        }
      } catch (err) {
        console.warn('Could not load AI personalized roadmap:', err);
      }
    };

    loadData();
  }, [user, id]);

  useEffect(() => {
    if (!selectedNode || typeof document === 'undefined') return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode]);

  // Update node state (done / in_progress / to_learn)
  const setNodeStatus = (nodeId, status) => {
    const next = { ...nodeStates, [nodeId]: status };
    setNodeStates(next);
    try {
      localStorage.setItem(`pathfinder_roadmap_nodes_${id}`, JSON.stringify(next));
    } catch (e) {}
  };

  const cycleNodeStatus = (e, nodeId) => {
    e.stopPropagation();
    const current = nodeStates[nodeId] || 'to_learn';
    const nextStatus = current === 'to_learn' ? 'in_progress' : (current === 'in_progress' ? 'done' : 'to_learn');
    setNodeStatus(nodeId, nextStatus);
  };

  const toggleSubtopic = (key) => {
    const next = { ...subtopicChecklist, [key]: !subtopicChecklist[key] };
    setSubtopicChecklist(next);
    try {
      localStorage.setItem(`pathfinder_subtopics_${id}`, JSON.stringify(next));
    } catch { /* ignore storage errors */ }
  };

  const toggleAllSubtopicsForNode = (node) => {
    const subtopics = node?.subtopics || [];
    if (subtopics.length === 0) return;
    const allChecked = subtopics.every((s) => Boolean(subtopicChecklist[`${node.id}_${s}`]));
    const next = { ...subtopicChecklist };
    subtopics.forEach((s) => {
      next[`${node.id}_${s}`] = !allChecked;
    });
    setSubtopicChecklist(next);
    try {
      localStorage.setItem(`pathfinder_subtopics_${id}`, JSON.stringify(next));
    } catch { /* ignore storage errors */ }
  };

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

  const toggleMilestone = (milestoneKey) => {
    const updated = {
      ...milestoneChecklist,
      [milestoneKey]: !milestoneChecklist[milestoneKey]
    };
    setMilestoneChecklist(updated);
    try {
      localStorage.setItem(`trajectory_checklist_${id}`, JSON.stringify(updated));
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

  // Get roadmap.sh structured flow data
  const roadmapShData = ROADMAP_SH_DOMAINS[aliasId] || ROADMAP_SH_DOMAINS.ai;
  const flowNodes = roadmapShData.nodes || [];

  // Filtered flow nodes
  const filteredNodes = flowNodes.filter(node => {
    const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.subtopics.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    const status = nodeStates[node.id] || 'to_learn';
    if (filterType === 'recommended') return node.type === 'recommended';
    if (filterType === 'done') return status === 'done';
    if (filterType === 'in_progress') return status === 'in_progress';
    if (filterType === 'to_learn') return status === 'to_learn';
    return true;
  });

  // Group nodes by stage
  const stagesMap = {};
  filteredNodes.forEach(n => {
    if (!stagesMap[n.stage]) {
      stagesMap[n.stage] = { stageTitle: n.stageTitle, nodes: [] };
    }
    stagesMap[n.stage].nodes.push(n);
  });
  const sortedStages = Object.entries(stagesMap).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  // Calculate flow progress
  const doneNodesCount = flowNodes.filter(n => (nodeStates[n.id] || 'to_learn') === 'done').length;
  const inProgressCount = flowNodes.filter(n => (nodeStates[n.id] || 'to_learn') === 'in_progress').length;
  const flowProgressPct = flowNodes.length > 0 ? Math.round((doneNodesCount / flowNodes.length) * 100) : 0;

  // Academic Semesters
  const hasAiRoadmap = Boolean(aiPersonalizedRoadmap && aiPersonalizedRoadmap.semesters);
  const semesters = hasAiRoadmap ? aiPersonalizedRoadmap.semesters : getCustomizedRoadmap(domain, verifiedMastery);
  const progressPct = Math.round((completedSemesters.length / 8) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        
        {/* Back link + topic progress */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          fontSize: '1rem',
          color: '#50545B'
        }}>
          <Link
            to="/results"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#50545B', textDecoration: 'none', fontWeight: 600 }}
          >
            <ChevronLeft size={16} />
            <span>Back to my result</span>
          </Link>
          <span>Topics done: <strong style={{ color: '#17191C' }}>{doneNodesCount} of {flowNodes.length}</strong> ({flowProgressPct}%)</span>
        </div>

        {/* 2. HERO HEADER */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            border: '1px solid #F59E0B',
            backgroundColor: '#FEF3C7',
            color: '#B45309',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 800,
            marginBottom: '1rem',
            borderRadius: '4px'
          }}>
            <Sparkles size={13} />
            <span>COMMUNITY-VERIFIED DEVELOPER ROADMAP // ROADMAP.SH SPECIFICATION</span>
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            color: '#17191C'
          }}>
            {domain.title} Developer Roadmap
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            color: '#50545B',
            maxWidth: '840px',
            lineHeight: 1.6,
            margin: '0 0 1.5rem 0'
          }}>
            {roadmapShData.description || 'Step-by-step interactive visual roadmap inspired by roadmap.sh. Track skills, follow the recommended developer path, check off subtopics, and practice hands-on coding challenges.'}
          </p>

          {/* AI Intelligence Badges if Personalized */}
          {hasAiRoadmap && aiPersonalizedRoadmap.intelligenceSourcesUsed && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem'
            }}>
              <span style={{ padding: '0.3rem 0.65rem', backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', color: '#17191C' }}>
                SOURCE A: <strong>{aiPersonalizedRoadmap.intelligenceSourcesUsed.sourceA_InitialDiagnostic.interestScore}% Initial Interest</strong>
              </span>
              <span style={{ padding: '0.3rem 0.65rem', backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', color: '#0284C7' }}>
                SOURCE B: <strong>{aiPersonalizedRoadmap.intelligenceSourcesUsed.sourceB_DomainAssessment.knowledgeScore}% Verified Knowledge</strong>
              </span>
              <span style={{ padding: '0.3rem 0.65rem', backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', color: '#10B981' }}>
                SOURCE C: <strong>{aiPersonalizedRoadmap.studentAcademicProfile?.academicYear} (Sem {aiPersonalizedRoadmap.studentAcademicProfile?.currentSemester})</strong>
              </span>
            </div>
          )}

          {/* Progress Bar Container */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              marginBottom: '0.6rem'
            }}>
              <span style={{ color: '#17191C', fontWeight: 700 }}>
                {activeTab === 'visual_flow' ? 'ROADMAP TOPIC MASTERY' : 'CURRICULUM MILESTONE PROGRESSION'}
              </span>
              <span style={{ color: '#E85D3F', fontWeight: 700 }}>
                {activeTab === 'visual_flow' ? `${flowProgressPct}% COMPLETE (${doneNodesCount}/${flowNodes.length} Topics)` : `${progressPct}% COMPLETE (${completedSemesters.length}/8 Semesters)`}
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E8EAE6', overflow: 'hidden', borderRadius: '4px' }}>
              <div style={{
                width: `${activeTab === 'visual_flow' ? flowProgressPct : progressPct}%`,
                height: '100%',
                backgroundColor: '#E85D3F',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* THREE VIEW TABS */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #D8DAD7', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('visual_flow')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: 'none',
                backgroundColor: activeTab === 'visual_flow' ? '#17191C' : '#FFFFFF',
                color: activeTab === 'visual_flow' ? '#FFFFFF' : '#50545B',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
            >
              <Sparkles size={16} color={activeTab === 'visual_flow' ? '#F59E0B' : '#50545B'} />
              <span>roadmap.sh Visual Path</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: 'none',
                backgroundColor: activeTab === 'roadmap' ? '#17191C' : '#FFFFFF',
                color: activeTab === 'roadmap' ? '#FFFFFF' : '#50545B',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
            >
              <BookOpen size={16} />
              <span>8-Semester Academic Breakdown</span>
            </button>

            <button
              onClick={() => setActiveTab('trajectory')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: 'none',
                backgroundColor: activeTab === 'trajectory' ? '#17191C' : '#FFFFFF',
                color: activeTab === 'trajectory' ? '#FFFFFF' : '#50545B',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
            >
              <ListTodo size={16} />
              <span>Student Trajectory & Milestones</span>
            </button>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: ROADMAP.SH INTERACTIVE VISUAL FLOW (NODE GRAPH & DRAWER)    */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'visual_flow' && (
          <div>
            {/* Toolbar: Search & Filters */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
              borderRadius: '8px'
            }}>
              {/* Search Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '260px', flex: 1 }}>
                <Search size={16} color="#646A73" />
                <input
                  type="text"
                  placeholder="Search topics (e.g. Python, Docker, SQL, Git)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    width: '100%',
                    fontFamily: "'Manrope', sans-serif"
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <X size={14} color="#646A73" />
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73', marginRight: '0.25rem' }}>FILTER:</span>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'recommended', label: '🌟 Recommended Only' },
                  { key: 'done', label: '🟢 Done' },
                  { key: 'in_progress', label: '🟡 In Progress' },
                  { key: 'to_learn', label: '⚪ To Learn' }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilterType(f.key)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.75rem',
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 700,
                      border: filterType === f.key ? '1px solid #17191C' : '1px solid #E5E7EB',
                      backgroundColor: filterType === f.key ? '#17191C' : '#FFFFFF',
                      color: filterType === f.key ? '#FFFFFF' : '#4B5563',
                      cursor: 'pointer',
                      borderRadius: '9999px'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dotted Canvas Flowchart Container */}
            <div style={{
              background: 'radial-gradient(circle, #D8DAD7 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              backgroundColor: '#FDFDFB',
              border: '1px solid #D8DAD7',
              borderRadius: '12px',
              padding: '2.5rem 2rem',
              position: 'relative'
            }}>
              
              {/* Legend Strip */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                marginBottom: '2.5rem',
                padding: '0.7rem 1.25rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 9, height: 9, backgroundColor: '#F59E0B', borderRadius: '50%' }} />
                  <span><strong style={{ color: '#17191C' }}>Recommended Path</strong> (Core sequence)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 9, height: 9, backgroundColor: '#0284C7', borderRadius: '50%' }} />
                  <span><strong style={{ color: '#17191C' }}>Alternative Option</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 9, height: 9, backgroundColor: '#6B7280', borderRadius: '50%' }} />
                  <span><strong style={{ color: '#17191C' }}>Good to Know</strong> (Flexible order)</span>
                </div>
              </div>

              {/* Stages Spine */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}>
                {sortedStages.map(([stageNum, stageData]) => {
                  const stageDoneCount = stageData.nodes.filter(
                    (n) => (nodeStates[n.id] || 'to_learn') === 'done'
                  ).length;
                  const stageAllDone =
                    stageData.nodes.length > 0 && stageDoneCount === stageData.nodes.length;

                  return (
                    <div key={stageNum} style={{ position: 'relative' }}>
                      {/* Stage Header Pill */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: stageAllDone ? '#047857' : '#17191C',
                            color: '#FFFFFF',
                            fontFamily: "'DM Mono', monospace",
                            fontSize: '0.875rem',
                            fontWeight: 800,
                            flexShrink: 0,
                            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.14)'
                          }}>
                            {stageAllDone ? <Check size={16} /> : stageNum}
                          </div>
                          <h3 style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: '1.65rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: '#17191C',
                            margin: 0,
                            letterSpacing: '0.02em'
                          }}>
                            {stageData.stageTitle}
                          </h3>
                        </div>

                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: stageAllDone ? '#ECFDF5' : '#FFFFFF',
                          color: stageAllDone ? '#047857' : '#64748B',
                          border: stageAllDone ? '1px solid #A7F3D0' : '1px solid #E2E8F0'
                        }}>
                          {stageDoneCount}/{stageData.nodes.length} DONE
                        </span>
                      </div>

                      {/* Stage Nodes Grid with Left Connector Spine */}
                      <div style={{
                        marginLeft: '16px',
                        paddingLeft: '1.5rem',
                        borderLeft: `2px solid ${stageAllDone ? '#86EFAC' : '#E2E5E0'}`,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.25rem',
                        paddingBottom: '0.5rem'
                      }}>
                        {stageData.nodes.map(node => {
                          const status = nodeStates[node.id] || 'to_learn';
                          const isDone = status === 'done';
                          const isInProgress = status === 'in_progress';
                          const typeMeta = getNodeTypeMeta(node.type);

                          const subtopics = node.subtopics || [];
                          const completedSubCount = subtopics.filter(s => subtopicChecklist[`${node.id}_${s}`]).length;
                          const subProgressPct = subtopics.length > 0
                            ? Math.round((completedSubCount / subtopics.length) * 100)
                            : 0;

                          return (
                            <div
                              key={node.id}
                              onClick={() => setSelectedNode(node)}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: isDone ? '1.5px solid #10B981' : (isInProgress ? '1.5px solid #F59E0B' : (node.type === 'recommended' ? '1.5px solid #FCD34D' : '1px solid #D8DAD7')),
                                borderRadius: '14px',
                                padding: '1.25rem',
                                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                                cursor: 'pointer',
                                transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
                              }}
                            >
                              {/* Card Top: Type Badge & Status Pill */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', gap: '0.5rem' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: '0.6875rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: typeMeta.bg,
                                  color: typeMeta.color,
                                  border: `1px solid ${typeMeta.border}`
                                }}>
                                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: typeMeta.dot }} />
                                  {typeMeta.shortLabel}
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => cycleNodeStatus(e, node.id)}
                                  title="Click to cycle status"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.25rem 0.65rem',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: '0.6875rem',
                                    fontWeight: 800,
                                    backgroundColor: isDone ? '#ECFDF5' : (isInProgress ? '#FEF3C7' : '#F1F5F9'),
                                    color: isDone ? '#047857' : (isInProgress ? '#B45309' : '#64748B')
                                  }}
                                >
                                  {isDone && <Check size={12} color="#047857" />}
                                  {isInProgress && <Clock size={12} color="#B45309" />}
                                  {!isDone && !isInProgress && <Circle size={12} color="#64748B" />}
                                  <span>{isDone ? 'DONE' : (isInProgress ? 'IN PROGRESS' : 'TO LEARN')}</span>
                                </button>
                              </div>

                              {/* Title & Description */}
                              <div style={{ marginBottom: '1rem' }}>
                                <h4 style={{
                                  fontFamily: "'Manrope', sans-serif",
                                  fontSize: '1.125rem',
                                  fontWeight: 800,
                                  color: '#17191C',
                                  margin: '0 0 0.4rem 0'
                                }}>
                                  {node.title}
                                </h4>
                                <p style={{
                                  fontSize: '0.84rem',
                                  color: '#50545B',
                                  lineHeight: 1.55,
                                  margin: 0,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {node.description}
                                </p>
                              </div>

                              {/* Card Subtopic Progress & Footer */}
                              <div>
                                <div style={{
                                  width: '100%',
                                  height: '4px',
                                  backgroundColor: '#F1F5F9',
                                  borderRadius: '9999px',
                                  overflow: 'hidden',
                                  marginBottom: '0.7rem'
                                }}>
                                  <div style={{
                                    width: `${subProgressPct}%`,
                                    height: '100%',
                                    backgroundColor: subProgressPct === 100 ? '#10B981' : '#E85D3F',
                                    transition: 'width 0.25s ease'
                                  }} />
                                </div>

                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: '0.6875rem'
                                }}>
                                  <span style={{ color: completedSubCount > 0 ? '#047857' : '#646A73', fontWeight: 700 }}>
                                    {completedSubCount} / {subtopics.length} CONCEPTS
                                  </span>
                                  <span style={{ color: '#0284C7', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                    OPEN GUIDE <ArrowRight size={12} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedNode && (
              <TopicGuideModal
                node={selectedNode}
                flowNodes={flowNodes}
                status={nodeStates[selectedNode.id] || 'to_learn'}
                subtopicChecklist={subtopicChecklist}
                onSelectNode={setSelectedNode}
                onClose={() => setSelectedNode(null)}
                onSetStatus={(nextStatus) => setNodeStatus(selectedNode.id, nextStatus)}
                onToggleSubtopic={toggleSubtopic}
                onToggleAllSubtopics={() => toggleAllSubtopicsForNode(selectedNode)}
              />
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: 8-SEMESTER ACADEMIC ROADMAP (ALL 9 COMPONENTS PER SEMESTER) */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'roadmap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {semesters.map((sem) => {
              const semNum = sem.semester;
              const isDone = completedSemesters.includes(semNum);

              return (
                <div
                  key={semNum}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isDone ? '2px solid #10B981' : (sem.isCurrentSemester ? '2px solid #E85D3F' : '1px solid #D8DAD7'),
                    padding: '2rem 2.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    position: 'relative',
                    borderRadius: '8px'
                  }}
                >
                  {/* Semester Header Strip */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #E5E7EB'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          backgroundColor: '#17191C',
                          color: '#FFFFFF',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px'
                        }}>
                          SEMESTER 0{semNum}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73' }}>
                          {sem.year || (semNum <= 2 ? 'Year 1' : (semNum <= 4 ? 'Year 2' : (semNum <= 6 ? 'Year 3' : 'Year 4')))}
                        </span>
                        {sem.semesterPacing && (
                          <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: sem.semesterPacing.includes('Accelerated') ? '#ECFDF5' : '#F1F5F9',
                            color: sem.semesterPacing.includes('Accelerated') ? '#047857' : '#475569',
                            padding: '0.15rem 0.5rem',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px'
                          }}>
                            {sem.semesterPacing.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <h2 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '2rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#17191C',
                        margin: 0
                      }}>
                        {sem.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => toggleSemester(semNum)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: isDone ? '#ECFDF5' : '#FFFFFF',
                        color: isDone ? '#047857' : '#17191C',
                        border: isDone ? '1px solid #10B981' : '1px solid #D8DAD7',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: '6px'
                      }}
                    >
                      {isDone ? <Check size={14} color="#10B981" /> : <div style={{ width: 12, height: 12, border: '1px solid #646A73' }} />}
                      <span>{isDone ? 'COMPLETED' : 'MARK AS COMPLETED'}</span>
                    </button>
                  </div>

                  {/* Adaptation Note if Available */}
                  {sem.adaptationNote && (
                    <div style={{
                      backgroundColor: '#F8F8F6',
                      borderLeft: '3px solid #0284C7',
                      padding: '0.75rem 1rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.8125rem',
                      color: '#0369A1',
                      lineHeight: 1.5
                    }}>
                      <strong>Adaptive Intelligence:</strong> {sem.adaptationNote}
                    </div>
                  )}

                  {/* 9 DETAILED CURRICULUM SECTIONS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    
                    {/* 1. Learning Objectives */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#E85D3F', marginBottom: '0.5rem' }}>
                        1. LEARNING OBJECTIVES
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6 }}>
                        {(sem.learningObjectives || ['Master core domain fundamentals', 'Complete semester implementation labs']).map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 2. Technical Subjects & Concepts */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#0284C7', marginBottom: '0.5rem' }}>
                        2. TECHNICAL SUBJECTS & CONCEPTS
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6 }}>
                        {(sem.technicalSubjects || [sem.course?.title || 'Core Domain Studies']).map((subj, i) => (
                          <li key={i}>{subj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 3. Required Tools & Languages */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#10B981', marginBottom: '0.5rem' }}>
                        3. PROGRAMMING LANGUAGES & TOOLS
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                        {(sem.toolsAndLanguages || ['Python', 'Git', 'VS Code']).map((tool, i) => (
                          <span key={i} style={{
                            padding: '0.2rem 0.5rem',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #D8DAD7',
                            fontSize: '0.75rem',
                            fontFamily: "'DM Mono', monospace",
                            color: '#17191C',
                            borderRadius: '4px'
                          }}>
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 4. Domain-Specific Skills */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#8B5CF6', marginBottom: '0.5rem' }}>
                        4. DOMAIN-SPECIFIC SKILLS
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6 }}>
                        {(sem.domainSkills || ['Algorithmic Reasoning', 'System Design']).map((skill, i) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 5. Recommended Courses & Resources */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#D97706', marginBottom: '0.5rem' }}>
                        5. RECOMMENDED COURSES & RESOURCES
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6 }}>
                        {(sem.recommendedResources || [{ title: 'CS Foundation Course', type: 'Course' }]).map((res, i) => (
                          <li key={i}>
                            <strong>{res.title || res}</strong> {res.type && `(${res.type})`}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 6. Practical Projects & Milestones */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.5rem' }}>
                        6. PRACTICAL IMPLEMENTATION PROJECTS
                      </div>
                      {(sem.practicalProjects || [{ title: 'Semester Capstone Prototype', description: 'Functional implementation' }]).map((proj, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem', fontSize: '0.8125rem', color: '#374151' }}>
                          <strong>{proj.title || proj}</strong>
                          {proj.description && <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#646A73' }}>{proj.description}</p>}
                        </div>
                      ))}
                    </div>

                    {/* 7. DSA & Core CS Preparation */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#059669', marginBottom: '0.5rem' }}>
                        7. DSA & CORE CS PREPARATION
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6 }}>
                        {(sem.dsaAndCoreCS || ['Arrays & Strings', 'Big-O Complexity']).map((dsa, i) => (
                          <li key={i}>{dsa}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 8. Internship & Placement Milestones */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.5rem' }}>
                        8. INTERNSHIP & CAREER TARGETS
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6 }}>
                        {(sem.internshipPlacementMilestones || ['Update GitHub with semester lab projects', 'Solve 50 LeetCode problems']).map((car, i) => (
                          <li key={i}>{car}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 9. Expected Outcomes & Criteria */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem' }}>
                        9. MEASURABLE OUTCOMES
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6 }}>
                        {(sem.expectedOutcomes || ['Working project demo committed to GitHub', 'Passing grade in domain course']).map((out, i) => (
                          <li key={i}>{out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: STUDENT TRAJECTORY & MILESTONES CHECKLIST                   */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'trajectory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: '1.5rem',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#17191C',
                margin: '0 0 1rem 0'
              }}>
                Four-Year Placement & Capstone Trajectory
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {(trajectoryData?.careerMilestones || [
                  { phase: 'Year 1 (Sem 1-2)', focus: 'Foundational Programming & Computational Logic', status: completedSemesters.length >= 2 ? 'Achieved' : 'In Progress' },
                  { phase: 'Year 2 (Sem 3-4)', focus: 'DSA Mastery & Domain Mini-Projects', status: completedSemesters.length >= 4 ? 'Achieved' : 'Upcoming' },
                  { phase: 'Year 3 (Sem 5-6)', focus: 'Summer Internship & High-Impact Open Source Portfolio', status: completedSemesters.length >= 6 ? 'Achieved' : 'Upcoming' },
                  { phase: 'Year 4 (Sem 7-8)', focus: 'Campus Placements, System Design & Capstone Launch', status: completedSemesters.length >= 8 ? 'Achieved' : 'Upcoming' }
                ]).map((car, i) => (
                  <div key={i} style={{ padding: '1rem', border: '1px solid #E5E7EB', backgroundColor: '#FBFBF9', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.875rem', color: '#17191C' }}>{car.phase}</strong>
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        fontFamily: "'DM Mono', monospace",
                        color: car.status === 'Achieved' ? '#047857' : (car.status === 'In Progress' ? '#B45309' : '#64748B')
                      }}>
                        {car.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#50545B', lineHeight: 1.4 }}>{car.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Semester Trajectory Milestones Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(trajectoryData?.milestones || semesters.map(s => ({
                id: `sem_${s.semester}_trajectory`,
                semesterNum: s.semester,
                semesterTitle: `Semester 0${s.semester}: ${s.title}`,
                academicYear: s.year,
                isCompleted: completedSemesters.includes(s.semester),
                keyMilestones: [
                  { type: 'Core Skill', text: s.domainSkills?.[0] || 'Core Subject Mastery' },
                  { type: 'Technical Project', text: s.practicalProjects?.[0]?.title || 'Practical Implementation Lab' },
                  { type: 'Course / Certification', text: s.recommendedResources?.[0]?.title || 'Online Certification Track' },
                  { type: 'DSA / Placement', text: s.dsaAndCoreCS?.[0] || 'Data Structures Practice' },
                  { type: 'Career / Portfolio', text: s.internshipPlacementMilestones?.[0] || 'GitHub Repository Milestone' }
                ],
                measurableOutcome: s.expectedOutcomes?.[0] || 'Verified semester project demo.'
              }))).map((traj) => (
                <div
                  key={traj.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D8DAD7',
                    padding: '1.5rem',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#17191C', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        SEM {traj.semesterNum}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: '#17191C' }}>{traj.semesterTitle}</strong>
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73' }}>
                      {traj.academicYear}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {traj.keyMilestones.map((km, idx) => {
                      const mKey = `${traj.id}_${idx}`;
                      const isChecked = Boolean(milestoneChecklist[mKey]);

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleMilestone(mKey)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.65rem 0.85rem',
                            backgroundColor: isChecked ? '#F0FDF4' : '#F9FAFB',
                            border: isChecked ? '1px solid #86EFAC' : '1px solid #E5E7EB',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? '2px solid #10B981' : '2px solid #9CA3AF',
                            backgroundColor: isChecked ? '#10B981' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isChecked && <Check size={12} color="#FFFFFF" />}
                          </div>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 800, color: '#646A73', minWidth: '130px' }}>
                            [{km.type.toUpperCase()}]
                          </span>
                          <span style={{ fontSize: '0.8125rem', color: isChecked ? '#047857' : '#1F2937', textDecoration: isChecked ? 'line-through' : 'none' }}>
                            {km.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Portal-rendered modal guide for a selected roadmap topic node.
 */
function TopicGuideModal({
  node,
  flowNodes,
  status,
  subtopicChecklist,
  onSelectNode,
  onClose,
  onSetStatus,
  onToggleSubtopic,
  onToggleAllSubtopics,
}) {
  if (typeof document === 'undefined' || !node) return null;

  const typeMeta = getNodeTypeMeta(node.type);
  const subtopics = node.subtopics || [];
  const resources = node.resources || [];
  const completedCount = subtopics.filter(
    (s) => Boolean(subtopicChecklist[`${node.id}_${s}`])
  ).length;
  const subProgressPct =
    subtopics.length > 0 ? Math.round((completedCount / subtopics.length) * 100) : 0;
  const allSubtopicsChecked = subtopics.length > 0 && completedCount === subtopics.length;

  const currentIdx = flowNodes.findIndex((item) => item.id === node.id);
  const prevNode = currentIdx > 0 ? flowNodes[currentIdx - 1] : null;
  const nextNode =
    currentIdx >= 0 && currentIdx < flowNodes.length - 1
      ? flowNodes[currentIdx + 1]
      : null;

  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.56)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '1.25rem',
        animation: 'backdropFadeIn 0.18s ease-out',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-guide-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          borderRadius: '18px',
          boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #D8DAD7',
          fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
          animation: 'drawerSlideIn 0.22s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.35rem 1.75rem',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#FBFBF9',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.55rem',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.22rem 0.6rem',
                  borderRadius: '6px',
                  backgroundColor: typeMeta.bg,
                  color: typeMeta.color,
                  border: `1px solid ${typeMeta.border}`,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: typeMeta.dot,
                  }}
                />
                {typeMeta.label}
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#475569',
                  backgroundColor: '#F1F5F9',
                  padding: '0.22rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <strong style={{ color: '#17191C' }}>Stage {node.stage}</strong>
                <span>·</span>
                <span>{node.stageTitle}</span>
              </span>
            </div>

            <h2
              id="topic-guide-title"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(1.65rem, 3vw, 2.15rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                color: '#17191C',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {node.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#64748B',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8DAD7',
                borderRadius: '6px',
                padding: '0.2rem 0.45rem',
              }}
            >
              ESC
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close topic guide"
              style={{
                background: '#FFFFFF',
                border: '1px solid #D8DAD7',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#374151',
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* Unified Progress & Status Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              backgroundColor: '#F8FAFC',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#475569',
                }}
              >
                Learning Status
              </span>
              <div
                style={{
                  display: 'inline-flex',
                  padding: '0.22rem',
                  backgroundColor: '#E2E8F0',
                  borderRadius: '8px',
                  gap: '0.22rem',
                }}
              >
                {LEARNING_STATUS_OPTIONS.map((opt) => {
                  const isCurrent = status === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onSetStatus(opt.key)}
                      style={{
                        padding: '0.38rem 0.85rem',
                        borderRadius: '6px',
                        border: isCurrent ? `1px solid ${opt.border}` : '1px solid transparent',
                        backgroundColor: isCurrent ? opt.bg : 'transparent',
                        color: isCurrent ? opt.color : '#475569',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: isCurrent ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {subtopics.length > 0 && (
              <div style={{ minWidth: '210px', flex: '1 1 220px', maxWidth: '280px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.45rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#334155',
                    }}
                  >
                    {completedCount} / {subtopics.length} concepts mastered
                  </span>
                  <button
                    type="button"
                    onClick={onToggleAllSubtopics}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: 0,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#0284C7',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    {allSubtopicsChecked ? 'Reset all' : 'Check all'}
                  </button>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${subProgressPct}%`,
                      height: '100%',
                      backgroundColor: subProgressPct === 100 ? '#10B981' : '#E85D3F',
                      transition: 'width 0.25s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2-Column Context Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#FAF9F6',
                border: '1px solid #E6E4DD',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  marginBottom: '0.55rem',
                }}
              >
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#E0F2FE',
                    color: '#0284C7',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BookOpen size={15} />
                </span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    color: '#17191C',
                  }}
                >
                  What is this topic?
                </h4>
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#374151',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {node.description}
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#F0FDF7',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  marginBottom: '0.55rem',
                }}
              >
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#DCFCE7',
                    color: '#047857',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Briefcase size={15} />
                </span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    color: '#065F46',
                  }}
                >
                  Why it matters in industry
                </h4>
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#1F2937',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {node.whyLearn}
              </p>
            </div>
          </div>

          {/* Interactive Key Skills & Concepts Checklist */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginBottom: '0.75rem',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#17191C',
                }}
              >
                Key Skills &amp; Concepts Checklist
              </h4>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  backgroundColor: allSubtopicsChecked ? '#ECFDF5' : '#F1F5F9',
                  color: allSubtopicsChecked ? '#047857' : '#475569',
                }}
              >
                <CheckCircle2 size={12} />
                {completedCount}/{subtopics.length} Done
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {subtopics.map((sub, i) => {
                const subKey = `${node.id}_${sub}`;
                const checked = Boolean(subtopicChecklist[subKey]);
                const stepNum = String(i + 1).padStart(2, '0');

                return (
                  <button
                    key={subKey}
                    type="button"
                    onClick={() => onToggleSubtopic(subKey)}
                    aria-pressed={checked}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.72rem 0.95rem',
                      backgroundColor: checked ? '#F0FDF4' : '#FFFFFF',
                      border: checked ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: checked ? '2px solid #10B981' : '2px solid #94A3B8',
                          backgroundColor: checked ? '#10B981' : '#FFFFFF',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: checked ? '#047857' : '#94A3B8',
                          flexShrink: 0,
                        }}
                      >
                        {stepNum}
                      </span>
                      <span
                        style={{
                          fontSize: '0.885rem',
                          color: checked ? '#065F46' : '#1F2937',
                          textDecoration: checked ? 'line-through' : 'none',
                          fontWeight: checked ? 600 : 500,
                        }}
                      >
                        {sub}
                      </span>
                    </div>

                    {checked && (
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: '#047857',
                          backgroundColor: '#DCFCE7',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          flexShrink: 0,
                        }}
                      >
                        Mastered
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code-Editor Style Practical Challenge Card */}
          {node.challenge && (
            <div
              style={{
                backgroundColor: '#0F172A',
                color: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 1rem',
                  backgroundColor: '#1E293B',
                  borderBottom: '1px solid #334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#10B981' }} />
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#38BDF8',
                    }}
                  >
                    <Terminal size={13} />
                    challenge.sh
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                  }}
                >
                  Hands-on Challenge
                </span>
              </div>
              <div style={{ padding: '1.1rem 1.25rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.65, color: '#E2E8F0' }}>
                  {node.challenge}
                </p>
              </div>
            </div>
          )}

          {/* Curated Free Resources Grid */}
          {resources.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#17191C',
                  }}
                >
                  Curated Free Resources
                </h4>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.7rem',
                    color: '#64748B',
                    fontWeight: 700,
                  }}
                >
                  {resources.length} {resources.length === 1 ? 'link' : 'links'}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.55rem',
                      padding: '0.9rem 1rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D8DAD7',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: '#17191C',
                      transition: 'border-color 0.15s ease, background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0284C7';
                      e.currentTarget.style.backgroundColor = '#F0F9FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#D8DAD7';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.6875rem',
                          padding: '0.18rem 0.5rem',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          borderRadius: '5px',
                          fontWeight: 700,
                        }}
                      >
                        {res.type}
                      </span>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: '#E0F2FE',
                          color: '#0284C7',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ExternalLink size={13} />
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#17191C', marginBottom: '0.2rem' }}>
                        {res.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.72rem',
                          color: '#64748B',
                        }}
                      >
                        {getHostLabel(res.url)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer with Prev / Next Topic Navigation */}
        <div
          style={{
            padding: '0.95rem 1.75rem',
            backgroundColor: '#FBFBF9',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={!prevNode}
              onClick={() => prevNode && onSelectNode(prevNode)}
              title={prevNode ? `Previous: ${prevNode.title}` : 'First topic'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #D8DAD7',
                backgroundColor: prevNode ? '#FFFFFF' : '#F3F4F6',
                color: prevNode ? '#17191C' : '#9CA3AF',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: prevNode ? 'pointer' : 'not-allowed',
              }}
            >
              <ChevronLeft size={14} />
              <span>Previous Topic</span>
            </button>

            <button
              type="button"
              disabled={!nextNode}
              onClick={() => nextNode && onSelectNode(nextNode)}
              title={nextNode ? `Next: ${nextNode.title}` : 'Last topic'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #D8DAD7',
                backgroundColor: nextNode ? '#FFFFFF' : '#F3F4F6',
                color: nextNode ? '#17191C' : '#9CA3AF',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: nextNode ? 'pointer' : 'not-allowed',
              }}
            >
              <span>Next Topic</span>
              <ChevronRight size={14} />
            </button>

            {currentIdx !== -1 && (
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.72rem',
                  color: '#64748B',
                  marginLeft: '0.25rem',
                }}
              >
                {currentIdx + 1} / {flowNodes.length}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.6rem 1.4rem',
              backgroundColor: '#17191C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Done / Close Guide
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
