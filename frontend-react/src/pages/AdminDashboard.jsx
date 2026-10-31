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
    // Generate simulated attempt log from demo scenarios to power analytics
    const simulatedAttempts = [];
    DEMO_SCENARIOS.forEach(sc => {
      sc.attempts.forEach(att => {
        simulatedAttempts.push({
          ...att,
          student_email: sc.student.email
        });
      });
    });

    const results = computeItemAnalytics(bank, simulatedAttempts);
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
    <div className="page-wrapper content-container animate-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'var(--color-accent-lt)', color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Curriculum Administration & Explainability
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>
          Adaptive Engine <span className="text-gradient">Console & Analytics</span>
        </h1>
        <p style={{ color: 'var(--color-text-3)', fontSize: '1.0625rem', maxWidth: '800px' }}>
          Inspect question status, psychometric analytics, audit event logs, and review the transparent mathematical derivations behind student topic levels and domain recommendations.
        </p>
      </div>

      {statusMessage && (
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', marginBottom: '2rem', fontWeight: 600 }}>
          ✓ {statusMessage}
        </div>
      )}

      {/* SECTION 1: LIVE EXPLAIN MY RESULT SCREEN (DEMO SCENARIOS) */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              🔍 "Explain My Result" Inspection View
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)' }}>
              Select any of the 6 benchmark demo scenarios to view its plain-English derivation report.
            </p>
          </div>
          <select 
            value={selectedScenarioId} 
            onChange={(e) => setSelectedScenarioId(e.target.value)}
            className="input-field"
            style={{ minWidth: '320px', padding: '0.65rem 1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }}
          >
            {DEMO_SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {scenarioExplanation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-accent)' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                Profile: {scenarioExplanation.studentEmail}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-3)' }}>
                Rule Version: {scenarioExplanation.modelRuleVersion} • Hypothesis Mapping Version: {scenarioExplanation.mappingVersion}
              </div>
            </div>

            {/* Topic Level Derivations */}
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Topic Mastery Placements</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {Object.values(scenarioExplanation.topicExplanations).map(exp => (
                  <div key={exp.topic} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ textTransform: 'capitalize', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-accent)', marginBottom: '0.25rem' }}>
                      {exp.topic}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                      Assigned Level: {exp.finalLevel} / 4 (Confidence: {exp.confidence})
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {exp.summaryText}
                    </p>
                    {exp.ladderTransitions.length > 0 && (
                      <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-3)' }}>
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
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Top Domain Recommendation Formulas</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {scenarioExplanation.domainExplanations.map(dom => (
                  <div key={dom.domainId} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800 }}>Rank #{dom.rank}: {dom.title}</span>
                      <span style={{ fontWeight: 900, color: 'var(--color-accent)' }}>{dom.compositeScore}%</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', fontFamily: 'monospace', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '4px' }}>
                      {dom.derivationFormula}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', margin: 0 }}>
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
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              📊 Item Bank Diagnostics & Lifecycle Management
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-3)' }}>
              Audit % correct (facility), 'I don't know' rates, and retire or approve items using automated psychometric flags.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }}
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
              style={{ padding: '0.5rem 0.75rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }}
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
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-3)' }}>
                <th style={{ padding: '0.75rem' }}>ID & Topic</th>
                <th style={{ padding: '0.75rem' }}>Question Snippet</th>
                <th style={{ padding: '0.75rem' }}>Diff</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Pass %</th>
                <th style={{ padding: '0.75rem' }}>IDK %</th>
                <th style={{ padding: '0.75rem' }}>Flags & Advice</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.slice(0, 15).map(item => {
                const itemStat = analytics.find(a => a.questionId === item.id);
                const isRetired = item.status === 'retired';
                const flags = itemStat?.flags || [];

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)', opacity: isRetired ? 0.6 : 1.0 }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                      <div>{item.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>{item.topic}</div>
                    </td>
                    <td style={{ padding: '0.75rem', maxWidth: '300px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.questionText}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-3)' }}>{item.license}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>L{item.difficulty}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800,
                        background: isRetired ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isRetired ? 'var(--color-danger)' : 'var(--color-success)'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {itemStat?.facility !== null ? `${Math.round(itemStat.facility * 100)}%` : '—'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {itemStat?.idkRate !== null ? `${Math.round(itemStat.idkRate * 100)}%` : '—'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {flags.length > 0 ? (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {flags.map(f => (
                            <span key={f} style={{ padding: '0.15rem 0.4rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700 }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-3)', fontSize: '0.75rem' }}>Healthy</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => handleToggleRetire(item.id, item.status)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: isRetired ? 'var(--color-accent-lt)' : 'rgba(239, 68, 68, 0.1)',
                          color: isRetired ? 'var(--color-accent)' : 'var(--color-danger)',
                          border: 'none'
                        }}
                      >
                        {isRetired ? 'Re-Approve' : 'Retire Item'}
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
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          ⚙️ Active Versioned Configs & Honest Academic Disclosure
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Rules Version: {rulesConfig.rules_version}</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', lineHeight: 1.6 }}>
              Governs ladder promotion (2 consecutive correct), demotion (2 consecutive wrong), and topic question mix percentages.
            </p>
          </div>
          <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Mapping Version: {mappingConfig.mapping_version}</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', lineHeight: 1.6 }}>
              {mappingConfig.disclaimer}. O*NET career exploration vectors are experimental hypotheses subject to student feedback recalibration.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

