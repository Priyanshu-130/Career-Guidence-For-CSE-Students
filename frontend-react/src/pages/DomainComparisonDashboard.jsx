import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DomainComparisonEngine } from '../data/adaptive/domainAssessmentAgent';
import { getAllDomainAssessments, saveDomainSelection, getDomainSelection } from '../services/apiService';
import domainsData from '../data/domains.json';
import {
  Compass,
  ArrowRight,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function DomainComparisonDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState(null);
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [secondaryDomains, setSecondaryDomains] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const email = user?.email || 'guest_student@pathfinder.edu';
      
      try {
        // 1. Load all completed domain assessments
        const res = await getAllDomainAssessments(email);
        let items = res.assessments || [];

        // Check sessionStorage fallbacks for guest or immediate session data
        domainsData.forEach(d => {
          if (!items.some(i => i.domain_id === d.id)) {
            const stored = sessionStorage.getItem(`domain_assessment_${d.id}`);
            if (stored) {
              const parsed = JSON.parse(stored);
              items.push({
                domain_id: d.id,
                knowledge_score: parsed.demonstratedKnowledgeScore,
                evaluation_report: parsed
              });
            }
          }
        });

        setAssessments(items);

        // Transform into comparison format
        const reports = items.map(item => {
          const rep = item.evaluation_report || {};
          return {
            domainId: item.domain_id,
            domainTitle: rep.domainTitle || item.domain_id.toUpperCase(),
            interestScore: rep.interestScore ?? 85,
            demonstratedKnowledgeScore: item.knowledge_score ?? rep.demonstratedKnowledgeScore ?? 60,
            readinessTier: rep.readinessTier || 'Proficient / Intermediate',
            strengths: rep.strengths || [],
            knowledgeGaps: rep.knowledgeGaps || []
          };
        });

        const comp = DomainComparisonEngine.compare({ domainReports: reports });
        setComparisonData(comp);

        // 2. Load existing selection
        const selRes = await getDomainSelection(email);
        if (selRes && selRes.selection) {
          setPrimaryDomain(selRes.selection.primary_domain);
          setSecondaryDomains(selRes.selection.secondary_domains || []);
        } else if (reports.length > 0) {
          // Default to the first assessed domain
          setPrimaryDomain(reports[0].domainId);
        }
      } catch (err) {
        console.warn('Error loading domain assessments for comparison:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSelectPrimary = (domainId) => {
    setPrimaryDomain(domainId);
    // If it was in secondary, remove it
    setSecondaryDomains(secondaryDomains.filter(id => id !== domainId));
    setSavedSuccess(false);
  };

  const toggleSecondary = (domainId) => {
    if (domainId === primaryDomain) return; // Cannot be both primary and secondary
    if (secondaryDomains.includes(domainId)) {
      setSecondaryDomains(secondaryDomains.filter(id => id !== domainId));
    } else {
      setSecondaryDomains([...secondaryDomains, domainId]);
    }
    setSavedSuccess(false);
  };

  const handleSaveSelection = async () => {
    if (!primaryDomain) return;
    const email = user?.email || 'guest_student@pathfinder.edu';
    try {
      await saveDomainSelection(email, primaryDomain, secondaryDomains);
      setSavedSuccess(true);
      // Also update student's default tracking domain in localStorage
      localStorage.setItem('pathfinder_primary_domain', primaryDomain);
      localStorage.setItem('pathfinder_secondary_domains', JSON.stringify(secondaryDomains));
    } catch (err) {
      console.error('Failed to save domain selection:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F4' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", color: '#646A73' }}>Loading your domain comparison...</p>
      </div>
    );
  }

  const evaluatedList = comparisonData?.evaluatedDomains || [];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2.5rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

        {/* BREADCRUMB STRIP */}
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
            <span style={{ color: '#17191C', fontWeight: 700 }}>Domain Comparison Dashboard</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            color: '#10B981',
            fontWeight: 700
          }}>
            <ShieldCheck size={14} />
            <span>{evaluatedList.length} DOMAIN ASSESSMENTS EVALUATED</span>
          </div>
        </div>

        {/* HERO HEADER */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            color: '#E85D3F',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            MULTI-DOMAIN COMPARISON & STRATEGIC TRAJECTORY
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#17191C',
            lineHeight: 1,
            margin: '0 0 1rem 0'
          }}>
            Domain Comparison Dashboard
          </h1>
          <p style={{ color: '#50545B', fontSize: '1.0625rem', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
            Compare your evaluated domains across demonstrated knowledge, learning commitment, foundational requirements, and career prospects. PathFinder allows you to designate one <strong>Primary Domain</strong> as your main trajectory, while retaining <strong>Secondary Domains</strong> as complementary minors.
          </p>
        </div>

        {/* EMPTY STATE IF NO ASSESSMENTS */}
        {evaluatedList.length === 0 && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <Compass size={40} color="#E85D3F" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              No Domain Assessments Completed Yet
            </h3>
            <p style={{ color: '#50545B', maxWidth: '560px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Complete the 10-question assessment for your recommended domains to unlock side-by-side trade-off analysis and trajectory planning.
            </p>
            <Link
              to="/results"
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
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}
            >
              <span>Return to Domain Recommendations</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* COMPARISON CARDS / GRID */}
        {evaluatedList.length > 0 && (
          <div>
            {/* AI Comparative Synthesis Box */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #0284C7',
              padding: '1.75rem 2rem',
              marginBottom: '2.5rem',
              boxShadow: '0 4px 20px rgba(2, 132, 199, 0.06)'
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0284C7',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>
                AI ADVISOR SYNTHESIS & TRADE-OFF EXPLANATION
              </div>
              <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.6, color: '#17191C' }}>
                {comparisonData?.aiSynthesis}
              </p>
            </div>

            {/* SIDE-BY-SIDE DOMAIN CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(320px, 1fr))`,
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              {evaluatedList.map((dom) => {
                const isPrimary = primaryDomain === dom.domainId;
                const isSecondary = secondaryDomains.includes(dom.domainId);

                return (
                  <div
                    key={dom.domainId}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: isPrimary ? '3px solid #E85D3F' : (isSecondary ? '2px solid #0284C7' : '1px solid #D8DAD7'),
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: isPrimary ? '0 8px 30px rgba(232, 93, 63, 0.12)' : 'none'
                    }}
                  >
                    <div>
                      {/* Status Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        {isPrimary ? (
                          <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            backgroundColor: '#E85D3F',
                            color: '#FFFFFF',
                            padding: '0.25rem 0.65rem'
                          }}>
                            ★ PRIMARY TRAJECTORY
                          </span>
                        ) : isSecondary ? (
                          <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            backgroundColor: '#0284C7',
                            color: '#FFFFFF',
                            padding: '0.25rem 0.65rem'
                          }}>
                            ✓ SECONDARY INTEREST
                          </span>
                        ) : (
                          <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: '#F8F8F6',
                            color: '#646A73',
                            padding: '0.25rem 0.65rem',
                            border: '1px solid #D8DAD7'
                          }}>
                            EVALUATED DOMAIN
                          </span>
                        )}

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.875rem', fontWeight: 800, color: '#E85D3F' }}>
                            {dom.knowledgeScore}% KNOWLEDGE
                          </span>
                        </div>
                      </div>

                      <h3 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#17191C',
                        margin: '0 0 0.75rem 0'
                      }}>
                        {dom.title}
                      </h3>

                      <p style={{ fontSize: '0.875rem', color: '#50545B', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                        {dom.description}
                      </p>

                      {/* Metrics List */}
                      <div style={{
                        borderTop: '1px dashed #D8DAD7',
                        borderBottom: '1px dashed #D8DAD7',
                        padding: '1rem 0',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#646A73' }}>DIFFICULTY CURVE:</span>
                          <strong style={{ color: '#17191C' }}>{dom.difficultyCurve}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#646A73' }}>WEEKLY COMMITMENT:</span>
                          <strong style={{ color: '#17191C' }}>{dom.weeklyCommitment}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#646A73' }}>AVERAGE COMP:</span>
                          <strong style={{ color: '#10B981' }}>{dom.averageStartingCompensation}</strong>
                        </div>
                      </div>

                      {/* Trade-Off Summary */}
                      <div style={{
                        backgroundColor: '#F8F8F6',
                        border: '1px solid #D8DAD7',
                        padding: '0.85rem',
                        marginBottom: '1.25rem',
                        fontSize: '0.8125rem',
                        lineHeight: 1.5,
                        color: '#50545B'
                      }}>
                        <strong style={{ color: '#17191C', display: 'block', marginBottom: '0.25rem' }}>AI Trade-Off Analysis:</strong>
                        {dom.aiTradeOffSummary}
                      </div>

                      {/* Foundational Requirements */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#646A73', marginBottom: '0.35rem' }}>
                          FOUNDATIONAL REQUIREMENTS:
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#17191C', lineHeight: 1.4 }}>
                          {dom.foundationalRequirements}
                        </div>
                      </div>
                    </div>

                    {/* Role Selection Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #D8DAD7' }}>
                      <button
                        onClick={() => handleSelectPrimary(dom.domainId)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 1rem',
                          backgroundColor: isPrimary ? '#E85D3F' : '#17191C',
                          color: '#FFFFFF',
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        {isPrimary ? <Check size={16} /> : null}
                        <span>{isPrimary ? 'Selected as Primary' : 'Set as Primary Career Trajectory'}</span>
                      </button>

                      <button
                        onClick={() => toggleSecondary(dom.domainId)}
                        disabled={isPrimary}
                        style={{
                          width: '100%',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#FFFFFF',
                          color: isPrimary ? '#D8DAD7' : (isSecondary ? '#0284C7' : '#50545B'),
                          border: isSecondary ? '2px solid #0284C7' : '1px solid #D8DAD7',
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          cursor: isPrimary ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <span>{isSecondary ? '✓ Added to Secondary' : '+ Retain as Secondary Interest'}</span>
                      </button>

                      <Link
                        to={`/roadmap/${dom.domainId}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          color: '#17191C',
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          marginTop: '0.25rem'
                        }}
                      >
                        <span>View 8-Semester Roadmap</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SAVE SELECTION FOOTER */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              <div>
                <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 0.35rem 0' }}>
                  Confirm Your Selected Career Trajectory
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#50545B' }}>
                  Primary: <strong>{primaryDomain ? primaryDomain.toUpperCase() : 'None selected'}</strong> | Secondary:{' '}
                  <strong>{secondaryDomains.length > 0 ? secondaryDomains.map(d => d.toUpperCase()).join(', ') : 'None'}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {savedSuccess && (
                  <span style={{ color: '#10B981', fontFamily: "'DM Mono', monospace", fontSize: '0.8125rem', fontWeight: 700 }}>
                    ✓ Trajectory Saved!
                  </span>
                )}
                <button
                  onClick={handleSaveSelection}
                  style={{
                    backgroundColor: '#17191C',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.85rem 2rem',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Save Trajectory & Proceed
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
