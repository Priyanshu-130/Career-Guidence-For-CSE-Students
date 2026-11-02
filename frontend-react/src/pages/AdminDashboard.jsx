import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  BarChart2, 
  Sliders, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  FileText, 
  Filter, 
  Compass, 
  Layers,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';

import { computeItemAnalytics, updateQuestionStatus, explainResult } from '../data/adaptive/analyticsEngine';
import { DEMO_SCENARIOS } from '../data/adaptive/demoScenarios';
import { domainMapping } from '../data/adaptive/adaptiveEngine';

import itemBankData from '../data/adaptive/item_bank.json';
import rulesConfig from '../data/adaptive/rules_version.json';
import mappingConfig from '../data/adaptive/domain_mapping_version.json';

export default function AdminDashboard() {
  const [bank, setBank] = useState(itemBankData.questions || []);
  const [analytics, setAnalytics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [filterFlag, setFilterFlag] = useState('all');
  const [selectedScenarioId, setSelectedScenarioId] = useState(DEMO_SCENARIOS[0].id);
  const [scenarioExplanation, setScenarioExplanation] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // 1. Compute Analytics
  useEffect(() => {
    const combinedAttempts = [];
    DEMO_SCENARIOS.forEach(sc => {
      sc.attempts.forEach(att => {
        combinedAttempts.push({
          ...att,
          student_email: sc.student.email
        });
      });
    });

    // Also include real student attempts recorded in localStorage
    try {
      const realAttemptsRaw = localStorage.getItem('cpath_assessment_attempts');
      if (realAttemptsRaw) {
        const realList = JSON.parse(realAttemptsRaw);
        if (Array.isArray(realList)) {
          realList.forEach(att => {
            combinedAttempts.push({
              question_id: att.questionId || att.question_id,
              correct: att.isCorrect ?? att.correct ?? false,
              answer: att.selectedAnswer || att.answer || '',
              is_dont_know: att.isDontKnow ?? att.is_dont_know ?? false,
              time_taken: att.timeSpentSeconds || att.time_taken || 20,
              student_email: att.studentEmail || att.student_email || 'student@pathfinder.edu'
            });
          });
        }
      }
    } catch (e) {
      console.warn('Could not read local attempts:', e);
    }

    const results = computeItemAnalytics(bank, combinedAttempts);
    setAnalytics(results);
  }, [bank]);

  // 2. Compute Explainability for Selected Scenario
  useEffect(() => {
    const sc = DEMO_SCENARIOS.find(s => s.id === selectedScenarioId) || DEMO_SCENARIOS[0];
    const hypothesis = domainMapping(sc.riasecVector, null, mappingConfig);
    const exp = explainResult({
      studentEmail: sc.student.email,
      studentProfile: sc.student,
      diagnosticResults: sc.diagnosticResults,
      attempts: sc.attempts,
      mastery: sc.mastery,
      hypothesisResult: hypothesis,
      behaviorEvents: sc.behaviorEvents
    });
    setScenarioExplanation(exp);
  }, [selectedScenarioId]);

  // 3. Admin Status Toggle (e.g. Retire item)
  const handleToggleRetire = (questionId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'retired' ? 'approved' : 'retired';
      const reason = nextStatus === 'retired' ? 'Flagged and retired by curriculum administrator via Admin Console.' : 'Re-approved by administrator.';
      const res = updateQuestionStatus(bank, questionId, nextStatus, reason);
      setBank(res.updatedBank);
      setStatusMessage(res.message);
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredItems = bank.filter(item => {
    const matchesTopic = selectedTopic === 'all' || item.topic === selectedTopic;
    const itemAnalytics = analytics.find(a => a.questionId === item.id);
    const flags = itemAnalytics?.flags || [];
    const matchesFlag = filterFlag === 'all' 
      || (filterFlag === 'flagged' && flags.length > 0)
      || (filterFlag === 'retired' && item.status === 'retired')
      || (filterFlag === 'approved' && item.status === 'approved')
      || flags.includes(filterFlag);
    return matchesTopic && matchesFlag;
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
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
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={16} /> CURRICULUM ADMINISTRATION & EXPLAINABILITY
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#17191C',
            margin: '0 0 1rem 0'
          }}>
            Adaptive Engine Console & Analytics
          </h1>
          <p style={{ color: '#50545B', fontSize: '1.0625rem', maxWidth: '820px', margin: 0, lineHeight: 1.6 }}>
            Inspect question status, psychometric analytics, audit event logs, and review the transparent mathematical derivations behind student topic levels and domain recommendations.
          </p>
        </div>

        {statusMessage && (
          <div style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#F0FDF4',
            border: '1px solid #2EC4B6',
            color: '#2EC4B6',
            marginBottom: '2rem',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            ✓ {statusMessage}
          </div>
        )}

        {/* SECTION 1: LIVE EXPLAIN MY RESULT SCREEN (DEMO SCENARIOS) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DAD7',
          padding: '2.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#17191C',
                margin: '0 0 0.35rem 0'
              }}>
                🔍 "Explain My Result" Inspection View
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#50545B', margin: 0 }}>
                Select any benchmark demo scenario to inspect its full transparent derivation report.
              </p>
            </div>
            <select 
              value={selectedScenarioId} 
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              style={{
                minWidth: '320px',
                padding: '0.75rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8DAD7',
                color: '#17191C',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.875rem',
                outline: 'none'
              }}
            >
              {DEMO_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {scenarioExplanation && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: '#F8F8F6',
                border: '1px solid #D8DAD7',
                borderLeft: '4px solid #E85D3F'
              }}>
                <div style={{ fontWeight: 800, color: '#17191C', fontSize: '1rem', marginBottom: '0.35rem' }}>
                  Student Dossier: {scenarioExplanation.studentEmail}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#50545B', fontFamily: "'DM Mono', monospace" }}>
                  Rules Version: {scenarioExplanation.modelRuleVersion} · Hypothesis Version: {scenarioExplanation.mappingVersion}
                </div>
              </div>

              {/* Topic Level Derivations */}
              <div>
                <h4 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#17191C',
                  margin: '0 0 1rem 0'
                }}>
                  Topic Mastery Placements
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {Object.values(scenarioExplanation.topicExplanations).map(exp => (
                    <div key={exp.topic} style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7' }}>
                      <div style={{ textTransform: 'uppercase', fontWeight: 800, fontSize: '1rem', color: '#E85D3F', fontFamily: "'DM Mono', monospace", marginBottom: '0.35rem' }}>
                        {exp.topic}
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#17191C', marginBottom: '0.5rem' }}>
                        Assigned Level: 0{exp.finalLevel} / 04 (Confidence: {exp.confidence})
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#50545B', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                        {exp.summaryText}
                      </p>
                      {exp.ladderTransitions.length > 0 && (
                        <div style={{ borderTop: '1px dashed #D8DAD7', paddingTop: '0.5rem', fontSize: '0.75rem', color: '#646A73' }}>
                          <strong>Ladder Events:</strong>
                          <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                            {exp.ladderTransitions.map((evt, i) => (
                              <li key={i}>{evt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain Score Derivations */}
              <div>
                <h4 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#17191C',
                  margin: '0 0 1rem 0'
                }}>
                  Domain Affinity Formula Derivations
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {scenarioExplanation.domainExplanations.map(dom => (
                    <div key={dom.domainId} style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: '#17191C' }}>Rank #{dom.rank}: {dom.title}</span>
                        <span style={{ fontWeight: 800, color: '#E85D3F' }}>{dom.compositeScore}%</span>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#17191C',
                        fontFamily: "'DM Mono', monospace",
                        marginBottom: '0.75rem',
                        backgroundColor: '#F8F8F6',
                        border: '1px solid #D8DAD7',
                        padding: '0.5rem'
                      }}>
                        {dom.derivationFormula}
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#50545B', margin: 0, lineHeight: 1.5 }}>
                        {dom.reasoning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* SECTION 2: QUESTION BANK MANAGEMENT & PSYCHOMETRIC ANALYTICS */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DAD7',
          padding: '2.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#17191C',
                margin: '0 0 0.35rem 0'
              }}>
                📊 Item Bank Diagnostics & Lifecycle Management
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#50545B', margin: 0 }}>
                Audit % correct (facility), 'I don't know' rates, and retire or approve items using automated psychometric flags.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                style={{ padding: '0.65rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', color: '#17191C', fontFamily: "'DM Mono', monospace", fontSize: '0.8125rem' }}
              >
                <option value="all">All Topics</option>
                <option value="python">Python</option>
                <option value="sql">SQL</option>
                <option value="java">Java</option>
                <option value="bebras_logic">Bebras Logic</option>
                <option value="starter_diagnostic">Diagnostic</option>
                <option value="career_interest">Interest</option>
              </select>

              <select
                value={filterFlag}
                onChange={(e) => setFilterFlag(e.target.value)}
                style={{ padding: '0.65rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #D8DAD7', color: '#17191C', fontFamily: "'DM Mono', monospace", fontSize: '0.8125rem' }}
              >
                <option value="all">All Statuses & Flags</option>
                <option value="flagged">Any Warning Flag</option>
                <option value="too_easy">Too Easy (&gt;90% pass)</option>
                <option value="too_hard">Too Hard (&lt;20% pass)</option>
                <option value="high_idk_rate">High IDK (&gt;60%)</option>
                <option value="confusing">Confusing / Misleading</option>
                <option value="retired">Retired Items</option>
                <option value="approved">Approved Items</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #D8DAD7', color: '#17191C', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}>
                  <th style={{ padding: '0.85rem' }}>ID & TOPIC</th>
                  <th style={{ padding: '0.85rem' }}>QUESTION SNIPPET</th>
                  <th style={{ padding: '0.85rem' }}>DIFF</th>
                  <th style={{ padding: '0.85rem' }}>STATUS</th>
                  <th style={{ padding: '0.85rem' }}>FACILITY %</th>
                  <th style={{ padding: '0.85rem' }}>IDK %</th>
                  <th style={{ padding: '0.85rem' }}>FLAGS & ADVICE</th>
                  <th style={{ padding: '0.85rem' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.slice(0, 15).map(item => {
                  const itemStat = analytics.find(a => a.questionId === item.id);
                  const isRetired = item.status === 'retired';
                  const flags = itemStat?.flags || [];

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #D8DAD7', opacity: isRetired ? 0.6 : 1.0, backgroundColor: isRetired ? '#F8F8F6' : '#FFFFFF' }}>
                      <td style={{ padding: '0.85rem', fontWeight: 700 }}>
                        <div style={{ color: '#17191C' }}>{item.id}</div>
                        <div style={{ fontSize: '0.75rem', color: '#E85D3F', fontFamily: "'DM Mono', monospace" }}>{item.topic}</div>
                      </td>
                      <td style={{ padding: '0.85rem', maxWidth: '300px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#17191C' }}>
                          {item.questionText}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#646A73', fontFamily: "'DM Mono', monospace" }}>{item.license}</div>
                      </td>
                      <td style={{ padding: '0.85rem', fontFamily: "'DM Mono', monospace" }}>L0{item.difficulty}</td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          fontFamily: "'DM Mono', monospace",
                          background: isRetired ? '#FFF0EB' : '#F0FDF4',
                          border: `1px solid ${isRetired ? '#E85D3F' : '#2EC4B6'}`,
                          color: isRetired ? '#E85D3F' : '#2EC4B6'
                        }}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
                        {itemStat?.facility !== null ? `${Math.round(itemStat.facility * 100)}%` : '—'}
                      </td>
                      <td style={{ padding: '0.85rem', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
                        {itemStat?.idkRate !== null ? `${Math.round(itemStat.idkRate * 100)}%` : '—'}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        {flags.length > 0 ? (
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {flags.map(f => (
                              <span key={f} style={{ padding: '0.15rem 0.45rem', backgroundColor: '#FEF3C7', border: '1px solid #D97706', color: '#92400E', fontSize: '0.7rem', fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                                {f}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#2EC4B6', fontSize: '0.75rem', fontWeight: 700 }}>✓ Healthy</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleRetire(item.id, item.status)}
                          style={{
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            fontFamily: "'DM Mono', monospace",
                            cursor: 'pointer',
                            background: isRetired ? '#FFF0EB' : '#FFFFFF',
                            color: isRetired ? '#E85D3F' : '#17191C',
                            border: `1px solid ${isRetired ? '#E85D3F' : '#D8DAD7'}`
                          }}
                        >
                          {isRetired ? 'RE-APPROVE' : 'RETIRE'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: VERSIONED CONFIGURATIONS & METHODOLOGY NOTICE */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DAD7',
          padding: '2.5rem'
        }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '1.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#17191C',
            margin: '0 0 1.25rem 0'
          }}>
            ⚙️ Active Versioned Configs & Honest Academic Disclosure
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#F8F8F6', border: '1px solid #D8DAD7', padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 800, color: '#17191C', margin: '0 0 0.5rem 0' }}>Rules Engine: {rulesConfig.rules_version}</h4>
              <p style={{ fontSize: '0.875rem', color: '#50545B', lineHeight: 1.6, margin: 0 }}>
                Governs ladder promotion (2 consecutive correct), demotion (2 consecutive wrong), and topic question mix percentages.
              </p>
            </div>
            <div style={{ backgroundColor: '#F8F8F6', border: '1px solid #D8DAD7', padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 800, color: '#17191C', margin: '0 0 0.5rem 0' }}>Hypothesis Mapping: {mappingConfig.mapping_version}</h4>
              <p style={{ fontSize: '0.875rem', color: '#50545B', lineHeight: 1.6, margin: 0 }}>
                {mappingConfig.disclaimer}. O*NET career exploration vectors are experimental hypotheses subject to student feedback recalibration.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
