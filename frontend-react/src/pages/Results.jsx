import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import domainsData from '../data/domains.json';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { getMastery, predictDomainAndMarket } from '../services/apiService';
import { buildPhase6RecommendationFromSession } from '../data/adaptive/recommendationEngine';
import { getPhase4DomainBundle } from '../data/phase4DataLoader';
import {
  ArrowRight,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Briefcase,
  TrendingUp,
  Sparkles,
  MapPin,
  AlertCircle,
} from 'lucide-react';

const DOMAIN_DEFAULT_SKILLS = {
  ai: 'Python, Machine Learning, SQL',
  data: 'Python, SQL, Data Analysis, Excel',
  web: 'JavaScript, React, HTML/CSS, SQL',
  security: 'Linux, Networking, Cybersecurity, Python',
  cloud: 'AWS, Docker, Linux, Git',
  systems: 'Linux, Networking, Python, Java',
  iot: 'Python, C++, Arduino, Linux',
  robotics: 'Python, C++, Machine Learning',
  vlsi: 'Digital Logic, C++, Verilog',
  networking: 'TCP/IP, Networking, Linux',
};

const PREREQ_TO_SKILL_TEXT = {
  prog_fund: 'Python, Java, C++',
  math_stats: 'Statistics, Excel, Data Analysis',
  web_design: 'HTML/CSS, JavaScript, Figma, React',
  dsa_logic: 'Data Structures, Algorithms',
  dbms_data: 'SQL, Database Management',
  linux_cloud: 'Linux, Git, AWS, Docker',
  security_net: 'Networking, Cybersecurity',
};

export default function Results() {
  const [resultsData, setResultsData] = useState(() => {
    try {
      const raw =
        sessionStorage.getItem('quiz_results') ||
        localStorage.getItem('cpath_latest_quiz_results');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [adaptiveMastery, setAdaptiveMastery] = useState({});
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [mlMarketData, setMlMarketData] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const apiBase = getApiBaseUrl();

  useEffect(() => {
    let cancelled = false;

    const loadHistoricResult = async () => {
      try {
        const masteryResp = await getMastery(user?.email || 'guest_student@pathfinder.edu');
        if (!cancelled && masteryResp && masteryResp.status === 'success') {
          setAdaptiveMastery(masteryResp.current_mastery || masteryResp.mastery || {});
        }
      } catch (err) {
        console.warn('Could not load adaptive mastery:', err);
      }

      if (resultsData || !user || user.isGuest) return;

      if (!cancelled) setLoading(true);
      try {
        const resp = await fetch(`${apiBase}/api/results/${user.email}`);
        const data = await resp.json();
        if (cancelled) return;

        if (data.status === 'success' && data.results.length > 0) {
          const latest = data.results[0];

          const matchedDom = domainsData.find(
            (d) =>
              d.title.toLowerCase().includes(latest.recommended_domain.toLowerCase()) ||
              latest.recommended_domain.toLowerCase().includes(d.title.toLowerCase())
          );

          const rawScores = latest.all_scores || {};
          const cleanScores = {};
          Object.entries(rawScores).forEach(([k, v]) => {
            cleanScores[k] = v > 100 ? Math.min(100, Math.round(v / 10)) : Math.min(100, Math.round(v));
          });

          setResultsData({
            track: latest.quiz_type,
            top_domain: latest.recommended_domain,
            confidence_score: latest.confidence_score,
            all_scores: cleanScores,
            domain_id: matchedDom ? matchedDom.id : 'ai',
          });
        } else {
          const cached = localStorage.getItem('cpath_latest_quiz_results');
          if (cached) {
            setResultsData(JSON.parse(cached));
          }
        }
      } catch (err) {
        console.error('Failed to load past results:', err);
        if (!cancelled) {
          try {
            const cached = localStorage.getItem('cpath_latest_quiz_results');
            if (cached) {
              setResultsData(JSON.parse(cached));
              return;
            }
          } catch { /* ignore malformed offline cache */ }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHistoricResult();
    return () => {
      cancelled = true;
    };
  }, [user, apiBase, resultsData]);

  const phase6Recommendation = useMemo(() => {
    if (!resultsData) return null;
    if (resultsData.phase6Recommendation?.topDomain) {
      return resultsData.phase6Recommendation;
    }
    return buildPhase6RecommendationFromSession({
      ...resultsData,
      adaptiveMastery,
    });
  }, [resultsData, adaptiveMastery]);

  useEffect(() => {
    let cancelled = false;
    const domId = phase6Recommendation?.topDomain?.domainId || 'ai';

    const prereqIds =
      resultsData?.declaredPrerequisites ||
      resultsData?.prerequisiteProfile?.declaredPrerequisites ||
      [];
    const mappedPrereqs = Array.isArray(prereqIds)
      ? prereqIds.map((id) => PREREQ_TO_SKILL_TEXT[id] || id).filter(Boolean)
      : [];
    const customPart = resultsData?.customKnowledge ? [resultsData.customKnowledge] : [];
    const combined = [...mappedPrereqs, ...customPart].join(', ').trim();
    const initialSkills =
      combined ||
      (phase6Recommendation?.topDomain ? DOMAIN_DEFAULT_SKILLS[domId] : null) ||
      'Python, SQL, Machine Learning';

    setSkillsInput((prev) => prev || initialSkills);

    const runInitialPrediction = async () => {
      setMlLoading(true);
      const data = await predictDomainAndMarket({
        skills: initialSkills,
        preferredDomain: domId,
      });
      if (!cancelled) {
        setMlMarketData(data);
        setMlLoading(false);
      }
    };

    runInitialPrediction();
    return () => {
      cancelled = true;
    };
  }, [phase6Recommendation?.topDomain?.domainId]);

  const handleAnalyzeSkills = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const domId = phase6Recommendation?.topDomain?.domainId || 'ai';
    setMlLoading(true);
    const data = await predictDomainAndMarket({
      skills: skillsInput,
      preferredDomain: domId,
    });
    setMlMarketData(data);
    setMlLoading(false);
  };

  // Loading State
  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-3)' }}>
        <div className="state-container" style={{ maxWidth: '440px', width: '100%' }}>
          <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
          <h2 className="state-title">Loading your result...</h2>
          <p className="state-description">Compiling weighted RIASEC, readiness, and India market demand scores.</p>
        </div>
      </div>
    );
  }

  // Empty State (with interactive ML Skill-to-Domain & Market Predictor)
  if (!resultsData || !phase6Recommendation?.topDomain) {
    return (
      <div style={{
        minHeight: '100%',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        padding: 'var(--space-4) var(--space-2) var(--space-8)',
      }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="state-container" style={{ width: '100%' }}>
            <HelpCircle size={44} style={{ color: 'var(--color-text-3)' }} />
            <h2 className="state-title">No Assessment Result Yet</h2>
            <p className="state-description">
              You haven&apos;t completed the career assessment yet. Answer short questions about logic and interests to see your recommended CSE domain, or test the live ML predictor below right away.
            </p>
            <div style={{ marginTop: 'var(--space-2)' }}>
              <Link to="/quiz" className="btn-primary">
                Start Assessment <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <MlMarketSection
            skillsInput={skillsInput}
            onSkillsChange={setSkillsInput}
            onAnalyzeSkills={handleAnalyzeSkills}
            mlMarketData={mlMarketData}
            mlLoading={mlLoading}
          />
        </div>
      </div>
    );
  }

  const topDomain = phase6Recommendation.topDomain;
  const weights = phase6Recommendation.weights || { riasec: 0.4, readiness: 0.3, market_demand: 0.3 };
  const whyThisOneBullets = (phase6Recommendation.whyThisOne || []).slice(0, 3);
  const lowerRankedDomains = phase6Recommendation.lowerRankedDomains || [];

  const phase4Bundle = getPhase4DomainBundle(topDomain.domainId);
  const matchedDomain =
    domainsData.find((d) => d.id === topDomain.domainId) ||
    phase4Bundle?.domain ||
    domainsData[0];

  const domainSummary =
    phase4Bundle?.domain?.overview ||
    topDomain.overview ||
    matchedDomain?.description ||
    'Best combined fit across your RIASEC interests, verified readiness, and Indian job-market demand.';

  return (
    <div style={{
      minHeight: '100%',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      padding: 'var(--space-4) var(--space-2) var(--space-8)',
    }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

        {/* ============================================================
            STEP 1: ONLY THE TOP RECOMMENDED DOMAIN
            ============================================================ */}
        <section aria-labelledby="recommended-domain-heading">
          <div style={{ marginBottom: 'var(--space-1)' }}>
            <span className="mono-tag">Your Recommended Specialization</span>
          </div>

          <div
            className="card"
            style={{
              border: '2px solid var(--color-accent)',
              padding: 'clamp(var(--space-3), 4vw, var(--space-5))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div style={{ flex: '1 1 320px' }}>
                <h1 id="recommended-domain-heading" style={{ margin: '0 0 var(--space-1) 0', color: 'var(--color-text)' }}>
                  {topDomain.title}
                </h1>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-2)', maxWidth: '620px', margin: 0, lineHeight: 1.6 }}>
                  {domainSummary}
                </p>

                {mlMarketData && (
                  <div
                    data-testid="hero-ml-badge"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: 'var(--space-2)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: mlMarketData.source === 'ml_backend' ? 'var(--color-success-lt)' : 'var(--color-amber-lt)',
                      border: `1px solid ${mlMarketData.source === 'ml_backend' ? 'var(--color-success)' : 'var(--color-amber)'}`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: mlMarketData.source === 'ml_backend' ? '#0F5132' : '#92400E',
                    }}
                  >
                    <Sparkles size={13} />
                    <span>
                      ML Match: {mlMarketData.primary_domain}
                      {mlMarketData.top_predictions?.[0]?.confidence_pct != null
                        ? ` (${Number(mlMarketData.top_predictions[0].confidence_pct).toFixed(1)}%)`
                        : ''}
                    </span>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-accent-lt)',
                  border: '1.5px solid var(--color-accent)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2) var(--space-3)',
                  minWidth: '124px',
                }}
              >
                <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1 }}>
                  {topDomain.finalScorePct}%
                </span>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text)', marginTop: '4px' }}>
                  FINAL SCORE
                </span>
              </div>
            </div>

            {/* Single clear primary CTA directly to the recommended domain's page */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                paddingTop: 'var(--space-2)',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <Link
                to={`/domain/${topDomain.domainId}`}
                className="btn-primary"
                style={{ flex: '1 1 260px' }}
              >
                <span>Open {topDomain.title} Domain Page</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to={`/roadmap/${topDomain.domainId}`}
                className="btn-secondary"
                style={{ flex: '0 1 auto' }}
              >
                <span>Semester Roadmap</span>
                <ExternalLink size={16} />
              </Link>
              <button
                type="button"
                onClick={() => navigate('/quiz')}
                className="btn-ghost"
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <RotateCcw size={16} />
                <span>Retake Assessment</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================
            STEP 2: WHY THIS ONE (MAX 3 BULLETS)
            ============================================================ */}
        <section id="why-this-one-section" aria-labelledby="why-this-one-heading">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <CheckCircle2 size={22} style={{ color: 'var(--color-success)' }} />
              <h2 id="why-this-one-heading" style={{ fontSize: 'var(--text-xl)', margin: 0 }}>
                Why this one
              </h2>
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: 'var(--space-3)',
                color: 'var(--color-text-2)',
                fontSize: 'var(--text-base)',
                lineHeight: 1.7,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)',
              }}
            >
              {whyThisOneBullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================================================
            STEP 2.5: ML DOMAIN PREDICTION & INDIAN TECH JOB MARKET (2026)
            ============================================================ */}
        <MlMarketSection
          skillsInput={skillsInput}
          onSkillsChange={setSkillsInput}
          onAnalyzeSkills={handleAnalyzeSkills}
          mlMarketData={mlMarketData}
          mlLoading={mlLoading}
        />

        {/* ============================================================
            STEP 3: EXPLAIN MY RESULT (SCORE BREAKDOWN + LOWER RANKINGS + AUDIT LOG)
            ============================================================ */}
        <section aria-labelledby="audit-log-heading">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setShowAuditLog(!showAuditLog)}
              aria-expanded={showAuditLog}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-surface)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <span className="mono-tag" style={{ color: 'var(--color-cyan)' }}>Technical Audit Log</span>
                </div>
                <h2 id="audit-log-heading" style={{ fontSize: 'var(--text-xl)', margin: 'var(--space-0-5) 0 0 0' }}>
                  Explain my result
                </h2>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-3)' }}>
                  View the weighted score breakdown, why other domains ranked lower, ladder levels, and audit trail.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-bg-alt)',
                  color: 'var(--color-text)',
                }}
              >
                {showAuditLog ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {showAuditLog && (
              <div
                style={{
                  padding: 'var(--space-4)',
                  borderTop: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                {/* 1. Score Breakdown */}
                <div id="explain-score-breakdown">
                  <h3 style={{ fontSize: 'var(--text-lg)', margin: '0 0 var(--space-1) 0' }}>
                    Weighted Score Breakdown ({topDomain.title})
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-2)', margin: '0 0 var(--space-2) 0' }}>
                    {topDomain.formulaText}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <div className="card" style={{ padding: 'var(--space-2)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
                        RIASEC MATCH (WEIGHT {weights.riasec})
                      </div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)' }}>
                        {topDomain.riasecScorePct}%
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>
                        Euclidean O*NET similarity &rarr; +{topDomain.contributions.riasecPct} pts
                      </div>
                    </div>

                    <div className="card" style={{ padding: 'var(--space-2)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
                        LADDER READINESS (WEIGHT {weights.readiness})
                      </div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)' }}>
                        {topDomain.readinessScorePct}%
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>
                        {topDomain.readinessSource} &rarr; +{topDomain.contributions.readinessPct} pts
                      </div>
                    </div>

                    <div className="card" style={{ padding: 'var(--space-2)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
                        INDIA MARKET DEMAND (WEIGHT {weights.market_demand})
                      </div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)' }}>
                        {topDomain.marketDemandScorePct}%
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>
                        Trend: {topDomain.demandTrend} &rarr; +{topDomain.contributions.marketDemandPct} pts
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Why Other Domains Ranked Lower */}
                {lowerRankedDomains.length > 0 && (
                  <div id="explain-lower-ranked-domains">
                    <h3 style={{ fontSize: 'var(--text-lg)', margin: '0 0 var(--space-2) 0' }}>
                      Why Other Domains Ranked Lower
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {lowerRankedDomains.map((cand) => (
                        <div key={cand.domainId} className="card" style={{ padding: 'var(--space-2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-0-5)' }}>
                            <strong style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>
                              #{cand.rank} {cand.title}
                            </strong>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-2)' }}>
                              {cand.finalScorePct}%
                            </span>
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', marginBottom: 'var(--space-1)' }}>
                            RIASEC: {cand.riasecScorePct}% | Readiness: {cand.readinessScorePct}% | India Demand ({cand.demandTrend}): {cand.marketDemandScorePct}%
                          </div>
                          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-2)', lineHeight: 1.5 }}>
                            {cand.whyRankedLower}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Verified Knowledge Ladder Levels */}
                <div>
                  <h3 style={{ fontSize: 'var(--text-lg)', margin: '0 0 var(--space-2) 0' }}>
                    Topic-Level Mastery Ladder
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 'var(--space-2)',
                    }}
                  >
                    {[
                      { topic: 'python', label: 'Python Foundations', defaultLevel: 2, defaultConfidence: 'medium' },
                      { topic: 'sql', label: 'SQL & Relational Databases', defaultLevel: 1, defaultConfidence: 'medium' },
                      { topic: 'java', label: 'Java Systems & OOP', defaultLevel: 2, defaultConfidence: 'low' },
                      { topic: 'bebras_logic', label: 'Computational Logic', defaultLevel: 3, defaultConfidence: 'high' },
                    ].map((t) => {
                      const m = adaptiveMastery[t.topic] || { level: t.defaultLevel, confidence: t.defaultConfidence, evidence_count: 2 };
                      const pct = (m.level / 4) * 100;
                      const levelNames = [
                        'Level 0: Gap Identified',
                        'Level 1: Syntax & Variables',
                        'Level 2: Applied Logic',
                        'Level 3: Core Competency',
                        'Level 4: Advanced Design',
                      ];

                      return (
                        <div key={t.topic} className="card" style={{ padding: 'var(--space-2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-0-5)' }}>
                            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{t.label}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontWeight: 800 }}>
                              L{m.level} / 4
                            </span>
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', marginBottom: 'var(--space-1)' }}>
                            {levelNames[m.level]}
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-border-subtle)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-1)' }}>
                            <div
                              style={{
                                width: `${Math.max(15, pct)}%`,
                                height: '100%',
                                backgroundColor: m.level >= 3 ? 'var(--color-success)' : m.level >= 2 ? 'var(--color-accent)' : 'var(--color-amber)',
                                borderRadius: 'var(--radius-full)',
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)' }}>
                            <span>CONF: {m.confidence.toUpperCase()}</span>
                            <span>{m.evidence_count || 1} PROBES</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Question-by-Question Audit Trail */}
                {Array.isArray(resultsData.auditTrail) && resultsData.auditTrail.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                      <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>
                        Question-by-Question Audit Trail
                      </h3>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>
                        Skipped: {resultsData.readiness_summary?.skipped_count ?? resultsData.auditTrail.filter((e) => e.status === 'skipped').length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      {resultsData.auditTrail.map((entry, idx) => {
                        const isSkippedEntry = entry.status === 'skipped';
                        const isIdkEntry = entry.status === 'dont_know';
                        return (
                          <div
                            key={`${entry.itemId}-${entry.step}-${idx}`}
                            className="card"
                            style={{
                              padding: 'var(--space-1) var(--space-2)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: 'var(--space-1)',
                            }}
                          >
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', flex: '1 1 260px' }}>
                              <strong style={{ fontFamily: 'var(--font-mono)', marginRight: 'var(--space-1)' }}>
                                #{entry.step}
                              </strong>
                              <span>{entry.prompt}</span>
                              {entry.reServed && (
                                <span style={{ marginLeft: 'var(--space-1)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
                                  (re-served)
                                </span>
                              )}
                            </div>
                            <span
                              style={{
                                padding: '0.15rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                backgroundColor: isSkippedEntry ? 'var(--color-bg-alt)' : isIdkEntry ? '#FEF3C7' : 'var(--color-accent-lt)',
                                border: `1px solid ${isSkippedEntry ? 'var(--color-border)' : isIdkEntry ? '#D97706' : 'var(--color-accent)'}`,
                                color: isSkippedEntry ? 'var(--color-text-2)' : isIdkEntry ? '#92400E' : 'var(--color-accent)',
                              }}
                            >
                              {entry.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Interactive ML Domain Prediction & 2026 Indian Job Market section shared by
 * both the Results empty state and completed assessment Results view.
 */
function MlMarketSection({
  skillsInput,
  onSkillsChange,
  onAnalyzeSkills,
  mlMarketData,
  mlLoading,
}) {
  return (
    <section aria-labelledby="ml-market-heading">
      <div
        className="card"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '6px',
              }}
            >
              <Sparkles size={14} />
              <span>ML Domain Fit &amp; Indian Tech Market</span>
            </div>
            <h2
              id="ml-market-heading"
              style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--color-text)',
              }}
            >
              Real-World Skill Readiness &amp; Job Openings
            </h2>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: '0.92rem',
                color: 'var(--color-text-2)',
              }}
            >
              Enter or refine your current technical skills to run TF-IDF + calibrated ML domain prediction and inspect matching Indian job listings.
            </p>
          </div>
        </div>

        {/* Interactive Skills Form */}
        <form
          onSubmit={onAnalyzeSkills}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'stretch',
          }}
        >
          <label htmlFor="ml-skills-input" className="sr-only">
            Your current skills (comma-separated)
          </label>
          <input
            id="ml-skills-input"
            type="text"
            value={skillsInput}
            onChange={(e) => onSkillsChange(e.target.value)}
            placeholder="e.g. python, sql, machine learning, react, docker"
            style={{
              flex: '1 1 280px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
              fontSize: '0.95rem',
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={mlLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              whiteSpace: 'nowrap',
            }}
          >
            {mlLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Analyze Skills &amp; Market Fit</span>
              </>
            )}
          </button>
        </form>

        {mlLoading && !mlMarketData && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-2)',
            }}
          >
            <Loader2 size={18} className="animate-spin" />
            <span>Running ML domain prediction and querying Indian job market data...</span>
          </div>
        )}

        {mlMarketData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              {/* Top 3 Predicted Domains */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <TrendingUp size={16} />
                    <span>Top 3 ML Domain Matches</span>
                  </h3>
                  {mlMarketData.primary_domain && (
                    <span
                      className="mono-tag"
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-accent)',
                        fontWeight: 700,
                      }}
                    >
                      Primary: {mlMarketData.primary_domain}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(mlMarketData.top_predictions || []).slice(0, 3).map((pred, index) => {
                    const pct = Math.max(0, Math.min(100, Number(pred.confidence_pct || 0)));
                    return (
                      <div key={`${pred.domain_label}-${index}`}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            marginBottom: '4px',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: index === 0 ? 700 : 500,
                              color: 'var(--color-text)',
                            }}
                          >
                            {index + 1}. {pred.domain_label}
                          </span>
                          <span
                            className="mono-tag"
                            style={{
                              fontWeight: 700,
                              color: index === 0 ? 'var(--color-accent)' : 'var(--color-text-2)',
                            }}
                          >
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '8px',
                            borderRadius: '999px',
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              borderRadius: '999px',
                              backgroundColor:
                                index === 0 ? 'var(--color-accent)' : 'var(--color-cyan)',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skill-Gap Readiness Meter */}
              {mlMarketData.skill_gap && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Skill-Gap Readiness</span>
                    </h3>
                    <span
                      className="mono-tag"
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'var(--color-success)',
                      }}
                    >
                      {Number(mlMarketData.skill_gap.readiness_score_pct || 0).toFixed(1)}%
                    </span>
                  </div>

                  <div>
                    <div
                      style={{
                        width: '100%',
                        height: '10px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, Number(mlMarketData.skill_gap.readiness_score_pct || 0))
                          )}%`,
                          height: '100%',
                          borderRadius: '999px',
                          backgroundColor: 'var(--color-success)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '0.82rem',
                        color: 'var(--color-text-2)',
                      }}
                    >
                      Matched {mlMarketData.skill_gap.matched_count || 0} of{' '}
                      {mlMarketData.skill_gap.total_benchmark_skills || 15} top required domain skills
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <AlertCircle size={14} />
                      <span>Top 3 Missing Skills to Learn Next</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(mlMarketData.skill_gap.missing_skills_top3 || []).length > 0 ? (
                        mlMarketData.skill_gap.missing_skills_top3.map((skill) => (
                          <span
                            key={skill}
                            className="mono-tag"
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              backgroundColor: 'var(--color-accent-lt)',
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text)',
                            }}
                          >
                            + {skill}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-success)' }}>
                          Strong coverage across top benchmark skills!
                        </span>
                      )}
                    </div>
                  </div>

                  {(mlMarketData.skill_gap.matched_skills || []).length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--color-text-2)',
                          marginBottom: '4px',
                        }}
                      >
                        Matched in Your Profile
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {mlMarketData.skill_gap.matched_skills.map((skill) => (
                          <span
                            key={skill}
                            className="mono-tag"
                            style={{
                              padding: '3px 9px',
                              borderRadius: '999px',
                              fontSize: '0.78rem',
                              backgroundColor: 'var(--color-surface)',
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text-2)',
                            }}
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Indian Market Insights Stats Bar */}
            {mlMarketData.market_insights && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-3)' }}>
                    Total Active Openings
                  </div>
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--color-text)',
                      marginTop: '4px',
                    }}
                  >
                    {Number(mlMarketData.market_insights.total_openings || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-3)' }}>
                    Fresher-Friendly Share
                  </div>
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--color-success)',
                      marginTop: '4px',
                    }}
                  >
                    {Number(mlMarketData.market_insights.fresher_friendly_ratio_pct || 0).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-2)', marginTop: '2px' }}>
                    {Number(mlMarketData.market_insights.fresher_friendly_count || 0).toLocaleString('en-IN')} entry-level roles
                  </div>
                </div>

                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-3)' }}>
                    Median Salary &amp; IQR
                  </div>
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--color-accent)',
                      marginTop: '4px',
                    }}
                  >
                    {mlMarketData.market_insights.median_salary_lpa != null
                      ? `₹${mlMarketData.market_insights.median_salary_lpa} LPA`
                      : 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-2)', marginTop: '2px' }}>
                    Range: {mlMarketData.market_insights.salary_range_lpa || 'Competitive'}
                  </div>
                </div>

                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--color-text-3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <MapPin size={13} />
                    <span>Top Hiring Hubs</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '6px',
                    }}
                  >
                    {(mlMarketData.market_insights.top_hiring_hubs || []).slice(0, 4).map((hub) => (
                      <span
                        key={hub.city}
                        className="mono-tag"
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {hub.city} ({hub.count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Matching Indian Job Listings */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Briefcase size={18} />
                  <span>Matching Indian Tech Job Openings</span>
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-3)' }}>
                  Prioritizing fresher-friendly roles
                </span>
              </div>

              {(mlMarketData.job_listings || []).length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {mlMarketData.job_listings.map((job, idx) => (
                    <div
                      key={`${job.job_title}-${job.company_name}-${idx}`}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '8px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              color: 'var(--color-text)',
                              lineHeight: 1.35,
                            }}
                          >
                            {job.job_title}
                          </div>
                          {job.is_fresher_friendly && (
                            <span
                              className="mono-tag"
                              style={{
                                flexShrink: 0,
                                fontSize: '0.7rem',
                                padding: '2px 7px',
                                borderRadius: '999px',
                                backgroundColor: 'var(--color-accent-lt)',
                                color: 'var(--color-success)',
                                border: '1px solid var(--color-border)',
                                fontWeight: 700,
                              }}
                            >
                              Fresher Friendly
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: '0.86rem',
                            color: 'var(--color-text-2)',
                            marginTop: '4px',
                          }}
                        >
                          {job.company_name} &bull; {job.primary_city}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--color-border)',
                          fontSize: '0.82rem',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                          <span
                            className="mono-tag"
                            style={{ fontWeight: 700, color: 'var(--color-accent)' }}
                          >
                            {job.salary_display ||
                              (job.salary_midpoint_lpa != null
                                ? `₹${job.salary_midpoint_lpa} LPA`
                                : 'Competitive')}
                          </span>
                          {job.experience_raw && (
                            <span style={{ color: 'var(--color-text-3)' }}>
                              {job.experience_raw}
                            </span>
                          )}
                        </div>

                        {job.job_url && (
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 600,
                              color: 'var(--color-accent)',
                              textDecoration: 'none',
                            }}
                          >
                            <span>Apply</span>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-2)',
                    fontSize: '0.9rem',
                  }}
                >
                  No live job openings returned for the current filter.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
