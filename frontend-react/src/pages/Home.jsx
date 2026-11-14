import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { predictDomainAndMarket } from '../services/apiService';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const STEPS = [
  { title: 'Take the assessment', text: 'Answer short questions about logic, interests and what you already know. You can always pick "I don\'t know".' },
  { title: 'See your best-fit domain', text: 'Get a recommended CSE domain and a clear explanation of why it was chosen.' },
  { title: 'Follow your roadmap', text: 'Get a semester-by-semester plan of skills, resources and projects for that domain.' },
];

export default function Home() {
  const { user, continuesAsGuest } = useAuth();
  const navigate = useNavigate();

  const [skillsInput, setSkillsInput] = useState('');
  const [mlResult, setMlResult] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);

  const runPrediction = async (skillsText, preferredDomain = 'ai') => {
    const trimmed = String(skillsText || '').trim();
    if (!trimmed) return;
    setMlLoading(true);
    const data = await predictDomainAndMarket({
      skills: trimmed,
      preferredDomain,
    });
    setMlResult(data);
    setMlLoading(false);
  };

  const handleStart = () => {
    if (!user) continuesAsGuest();
    navigate('/quiz');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    runPrediction(skillsInput, 'ai');
  };

  const primaryDomainId = mlResult?.canonical_domain_id || 'ai';

  return (
    <div style={{ minHeight: '100%', padding: '3rem 1.5rem 5rem', color: 'var(--color-text)' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

        <section style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(34px, 3.6vw, 48px)', fontWeight: 400, lineHeight: 1.12, letterSpacing: '-0.035em', color: 'var(--ink)', margin: '0 0 1rem 0' }}>
            Find the CSE domain that fits you
          </h1>
          <p style={{ margin: '0 auto', maxWidth: '620px', color: 'var(--ink-capsule)' }}>
            A short adaptive assessment for B.Tech CSE students that recommends a domain and shows you exactly what to learn next.
          </p>
        </section>

        <section aria-labelledby="how-it-works">
          <h2 id="how-it-works" style={{ fontSize: '19px', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)', textAlign: 'center', margin: '0 0 1.5rem 0' }}>How it works</h2>
          <ol style={{
            listStyle: 'none', padding: 0, margin: 0,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem'
          }}>
            {STEPS.map((step, i) => (
              <li key={step.title} style={{
                background: 'var(--glass)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--edge)',
                boxShadow: '0 10px 40px rgba(21, 36, 78, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(11, 22, 54, 0.72)', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px',
                  marginBottom: '1rem'
                }}>{i + 1}</div>
                <h3 style={{ fontSize: '19px', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 0.5rem 0' }}>{step.title}</h3>
                <p style={{ color: 'var(--ink-capsule)', margin: 0 }}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleStart}
            className="btn-primary"
            style={{ padding: '1.125rem 2.5rem', cursor: 'pointer' }}
          >
            Start Assessment <ArrowRight size={20} />
          </button>
        </div>

        {/* ============================================================
            QUICK DOMAIN PREDICTOR
            ============================================================ */}
        <section
          id="home-ml-predictor"
          aria-labelledby="home-ml-heading"
          className="card"
          style={{
            border: '1px solid var(--edge)',
            padding: 'clamp(1.25rem, 3vw, 2rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  color: 'var(--ink-soft)',
                  marginBottom: '6px',
                }}
              >
                <Sparkles size={14} style={{ color: 'var(--signal)' }} />
                <span>Quick Domain Predictor</span>
              </div>
              <h2 id="home-ml-heading" style={{ margin: 0, fontSize: '19px', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                Quick Domain Predictor
              </h2>
              <p style={{ margin: '6px 0 0', color: 'var(--ink-capsule)' }}>
                Enter your technical skills to predict your best-fit CSE domains and check your skill readiness.
              </p>
            </div>
          </div>

          {/* Custom Skills Input Form */}
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <input
              id="home-ml-skills-input"
              type="text"
              aria-label="Enter technical skills (comma-separated)"
              className="input-field"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, React, SQL, Docker, Machine Learning"
              style={{ flex: '1 1 280px' }}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={mlLoading || !skillsInput.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {mlLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Predicting...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Prediction</span>
                </>
              )}
            </button>
          </form>

          {mlLoading && !mlResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text-2)' }}>
              <Loader2 size={18} className="animate-spin" />
              <span>Predicting your best-fit domains...</span>
            </div>
          )}

          {mlResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* Top 3 Predicted Domains */}
                <div style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TrendingUp size={16} />
                      <span>Top 3 Predicted Domains</span>
                    </h3>
                    <span className="mono-tag" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                      Top: {mlResult.primary_domain}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {(mlResult.top_predictions || []).slice(0, 3).map((pred, idx) => {
                      const pct = Math.max(0, Math.min(100, Number(pred.confidence_pct || 0)));
                      const domId = pred.canonical_domain_id || 'ai';
                      return (
                        <div key={`${pred.domain_label}-${idx}`}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', marginBottom: '4px', gap: '8px' }}>
                            <span style={{ fontWeight: idx === 0 ? 700 : 500 }}>
                              {idx + 1}. {pred.domain_label}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Link
                                to={`/domain/${domId}`}
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-cyan)', fontWeight: 700, textDecoration: 'none' }}
                              >
                                Details
                              </Link>
                              <Link
                                to={`/roadmap/${domId}`}
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-2)', fontWeight: 700, textDecoration: 'none' }}
                              >
                                Roadmap
                              </Link>
                              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: idx === 0 ? 'var(--color-accent)' : 'var(--color-text-2)' }}>
                                {pct.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div style={{ width: '100%', height: '8px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.55)', border: '1px solid var(--edge)', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                borderRadius: '999px',
                                backgroundColor: idx === 0 ? 'var(--color-accent)' : 'var(--color-cyan)',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <Link to={`/domain/${primaryDomainId}`} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', minHeight: '36px', fontSize: '0.85rem' }}>
                      Explore {mlResult.primary_domain} <ArrowRight size={14} />
                    </Link>
                    <Link to={`/roadmap/${primaryDomainId}`} className="btn-ghost" style={{ padding: '0.45rem 0.9rem', minHeight: '36px', fontSize: '0.85rem' }}>
                      Open Roadmap
                    </Link>
                  </div>
                </div>

                {/* Skill-Gap Readiness */}
                {mlResult.skill_gap && (
                  <div style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                        <span>Skill-Gap Readiness</span>
                      </h3>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-success)' }}>
                        {Number(mlResult.skill_gap.readiness_score_pct || 0).toFixed(0)}%
                      </span>
                    </div>

                    <div>
                      <div style={{ width: '100%', height: '8px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.55)', border: '1px solid var(--edge)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.max(0, Math.min(100, Number(mlResult.skill_gap.readiness_score_pct || 0)))}%`,
                            height: '100%',
                            backgroundColor: 'var(--color-success)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-2)', marginTop: '6px' }}>
                        Matched {mlResult.skill_gap.matched_count || 0} of {mlResult.skill_gap.total_benchmark_skills || 15} benchmark skills in Indian job postings.
                      </div>
                    </div>

                    {(mlResult.skill_gap.matched_skills || []).length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-2)', marginBottom: '4px' }}>
                          Matched Skills
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {mlResult.skill_gap.matched_skills.map((skill) => (
                            <span
                              key={skill}
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                backgroundColor: 'var(--color-success-lt)',
                                color: '#0F5132',
                                border: '1px solid var(--color-success)',
                              }}
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={13} />
                        <span>Top 3 Missing High-Impact Skills</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(mlResult.skill_gap.missing_skills_top3 || []).map((skill) => (
                          <span
                            key={skill}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              padding: '3px 9px',
                              borderRadius: '999px',
                              backgroundColor: 'var(--color-accent-lt)',
                              border: '1px solid var(--color-accent)',
                              color: 'var(--color-text)',
                              fontWeight: 600,
                            }}
                          >
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
