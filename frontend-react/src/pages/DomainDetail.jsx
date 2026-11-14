import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  ChevronLeft,
  ExternalLink,
  Layers,
  MapPin,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { getDomainMarketInsights } from '../services/apiService';
import {
  filterAndGroupResources,
  getPhase4DomainBundle,
  LEGACY_HARDWARE_ALIASES,
} from '../data/phase4DataLoader';

function getTrendBadgeStyle(trend) {
  const norm = String(trend || '').toLowerCase();
  if (norm === 'rising') {
    return {
      backgroundColor: 'var(--color-success-lt)',
      color: '#0F5132',
      border: '1px solid var(--color-success)',
    };
  }
  if (norm === 'stable') {
    return {
      backgroundColor: 'var(--color-cyan-lt)',
      color: '#075985',
      border: '1px solid var(--color-cyan)',
    };
  }
  return {
    backgroundColor: 'var(--color-amber-lt)',
    color: '#92400E',
    border: '1px solid var(--color-amber)',
  };
}

export default function DomainDetail() {
  const { id } = useParams();
  const [apiPayload, setApiPayload] = useState(null);
  const [liveMarketInsights, setLiveMarketInsights] = useState(null);

  const staticBundle = useMemo(() => getPhase4DomainBundle(id), [id]);

  useEffect(() => {
    const rawId = String(id || '').trim().toLowerCase();
    if (!rawId) return;
    const canonicalId = LEGACY_HARDWARE_ALIASES[rawId] || rawId;

    let cancelled = false;
    const apiBase = getApiBaseUrl();
    fetch(`${apiBase}/api/data/domains/${canonicalId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || data.status !== 'success') return;
        setApiPayload({ requestId: rawId, canonicalId, data });
      })
      .catch(() => {
        // Offline or dev static mode: keep bundled Phase 4 JSON fallback
      });

    getDomainMarketInsights(canonicalId)
      .then((insights) => {
        if (!cancelled && insights) {
          setLiveMarketInsights({ requestId: rawId, data: insights });
        }
      })
      .catch(() => {
        // Keep static market demand view if lookup fails
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const bundle = useMemo(() => {
    if (!staticBundle) return null;
    const rawId = String(id || '').trim().toLowerCase();
    if (!apiPayload || apiPayload.requestId !== rawId) {
      return staticBundle;
    }

    const { data, canonicalId } = apiPayload;
    return {
      domain:
        canonicalId === rawId && data.domain
          ? { ...staticBundle.domain, ...data.domain }
          : staticBundle.domain,
      marketDemand: data.market_demand || staticBundle.marketDemand,
      marketBooster: data.market_booster || staticBundle.marketBooster,
      resources:
        Array.isArray(data.resources) && data.resources.length > 0
          ? data.resources
          : staticBundle.resources,
      meta: staticBundle.meta,
    };
  }, [staticBundle, apiPayload, id]);

  const groupedResources = useMemo(() => {
    if (!bundle) {
      return { beginner: [], intermediate: [], advanced: [], totalCount: 0 };
    }
    return filterAndGroupResources(bundle.resources);
  }, [bundle]);

  if (!bundle) {
    return (
      <div
        style={{
          padding: 'var(--space-6) var(--space-2)',
          backgroundColor: 'var(--color-bg)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="state-container" style={{ maxWidth: '480px', width: '100%' }}>
          <h2 className="state-title">Domain Not Found</h2>
          <p className="state-description">
            We couldn&apos;t find specialization data for &ldquo;{id}&rdquo;.
          </p>
          <Link to="/domains" className="btn-secondary">
            Return to All Domains
          </Link>
        </div>
      </div>
    );
  }

  const { domain, marketDemand, marketBooster, resources, meta } = bundle;
  const trendStyle = getTrendBadgeStyle(marketDemand?.demand_trend);

  return (
    <div
      style={{
        minHeight: '100%',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        padding: 'var(--space-4) var(--space-2) var(--space-8)',
      }}
    >
      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        {/* Top Back Link */}
        <div>
          <Link
            to="/domains"
            className="btn-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-1) var(--space-2)',
              minHeight: '36px',
              fontSize: 'var(--text-sm)',
            }}
          >
            <ChevronLeft size={16} />
            <span>All Domains</span>
          </Link>
        </div>

        {/* ============================================================
            SECTION 1: OVERVIEW (3 lines max)
            ============================================================ */}
        <section
          id="domain-section-overview"
          aria-labelledby="domain-overview-heading"
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-1)',
            }}
          >
            <span className="mono-tag">1. Overview</span>
            {domain.onet_code && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-3)',
                }}
              >
                O*NET {domain.onet_code}
              </span>
            )}
          </div>

          <h1 id="domain-overview-heading" style={{ margin: 0, color: 'var(--color-text)' }}>
            {domain.name}
          </h1>

          {/* Strictly capped to 3 lines max */}
          <p
            data-testid="domain-overview-text"
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-2)',
              lineHeight: 1.55,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {domain.overview}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-2)',
              paddingTop: 'var(--space-2)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-text-3)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                PREREQUISITES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                {(domain.prerequisites || []).map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--color-bg-alt)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-text-3)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                ENTRY-LEVEL ROLES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                {(domain.career_paths || []).map((role) => (
                  <span
                    key={role}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--color-bg-alt)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 2: MARKET DEMAND IN INDIA
            ============================================================ */}
        {marketDemand && (
          <section
            id="domain-section-market-demand"
            aria-labelledby="market-demand-heading"
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
              }}
            >
              <div>
                <span className="mono-tag">2. Market Demand in India</span>
                <h2 id="market-demand-heading" style={{ margin: 'var(--space-0-5) 0 0 0' }}>
                  Hiring Trend &amp; Entry-Level Compensation
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                <span
                  data-testid="market-demand-trend"
                  style={{
                    ...trendStyle,
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <TrendingUp size={16} />
                  <span>{marketDemand.demand_trend}</span>
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-2)',
              }}
            >
              <div
                style={{
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: 'var(--color-text-3)',
                    marginBottom: 'var(--space-0-5)',
                  }}
                >
                  FRESHER SALARY RANGE (INDIA, 0–2 YRS)
                </div>
                <div
                  data-testid="fresher-salary-range"
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 800,
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-0-5)',
                  }}
                >
                  {marketDemand.fresher_salary_range_inr?.display}
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-2)' }}>
                  {marketDemand.fresher_salary_range_inr?.notes}
                </p>
              </div>

              <div
                style={{
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-1)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: 'var(--color-text-3)',
                      marginBottom: 'var(--space-0-5)',
                    }}
                  >
                    LAST UPDATED &amp; VERIFICATION
                  </div>
                  <div
                    data-testid="market-last-updated"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                    }}
                  >
                    <Calendar size={18} style={{ color: 'var(--color-accent)' }} />
                    <span>{marketDemand.last_updated}</span>
                  </div>
                  <p style={{ margin: 'var(--space-0-5) 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-2)' }}>
                    {marketDemand.verified
                      ? 'Verified dataset entry.'
                      : 'Indicative estimate — verify live postings on Naukri / LinkedIn India.'}
                  </p>
                </div>

                {marketDemand.source_url && (
                  <a
                    href={marketDemand.source_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-cyan)',
                    }}
                  >
                    <span>Source: {marketDemand.source}</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {marketDemand.entry_level_reality && (
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-text-2)', lineHeight: 1.6 }}>
                {marketDemand.entry_level_reality}
              </p>
            )}

            {(() => {
              const rawId = String(id || '').trim().toLowerCase();
              const activeInsights =
                liveMarketInsights && liveMarketInsights.requestId === rawId
                  ? liveMarketInsights.data
                  : null;
              if (!activeInsights?.market_insights) return null;

              const stats = activeInsights.market_insights;
              const topSkills = activeInsights.skill_gap?.top_15_domain_skills || [];
              const listings = activeInsights.job_listings || [];

              return (
                <div
                  data-testid="live-market-dataset-block"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)' }}>
                      2026 INDIAN TECH JOB MARKET SNAPSHOT
                    </span>
                  </div>

                  {/* Live Dataset KPI Strip */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                    <div style={{ padding: '10px 12px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)' }}>TOTAL OPENINGS</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                        {Number(stats.total_openings || 0).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ padding: '10px 12px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)' }}>FRESHER-FRIENDLY</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)' }}>
                        {Number(stats.fresher_friendly_count || 0).toLocaleString('en-IN')}{' '}
                        <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                          ({Number(stats.fresher_friendly_ratio_pct || 0).toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '10px 12px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)' }}>MEDIAN LPA</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                        {stats.median_salary_lpa != null ? `₹${stats.median_salary_lpa} LPA` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Top Hiring Hubs & Top Demanded Skills */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    {(stats.top_hiring_hubs || []).length > 0 && (
                      <div style={{ padding: '12px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-3)', marginBottom: '8px' }}>
                          <MapPin size={13} />
                          <span>TOP INDIAN HIRING HUBS</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {stats.top_hiring_hubs.slice(0, 5).map((hub) => (
                            <span
                              key={hub.city}
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.76rem',
                                padding: '3px 9px',
                                borderRadius: '999px',
                                backgroundColor: 'var(--color-bg-alt)',
                                border: '1px solid var(--color-border)',
                              }}
                            >
                              {hub.city} ({hub.count})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {topSkills.length > 0 && (
                      <div style={{ padding: '12px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-3)', marginBottom: '8px' }}>
                          TOP DEMANDED SKILLS (% OF POSTINGS)
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {topSkills.slice(0, 8).map((item) => (
                            <span
                              key={item.skill}
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.76rem',
                                padding: '3px 9px',
                                borderRadius: '999px',
                                backgroundColor: 'var(--color-cyan-lt)',
                                color: '#075985',
                                border: '1px solid var(--color-cyan)',
                              }}
                            >
                              {item.skill} ({Number(item.demand_pct || 0).toFixed(1)}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sample Real Indian Job Listings */}
                  {listings.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-3)', marginBottom: '8px' }}>
                        <Briefcase size={13} />
                        <span>SAMPLE INDIAN JOB LISTINGS</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                        {listings.slice(0, 4).map((job, idx) => (
                          <div
                            key={`${job.job_title}-${job.company_name}-${idx}`}
                            style={{
                              padding: '10px 12px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '6px',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text)' }}>
                                {job.job_title}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-2)' }}>
                                {job.company_name} &bull; {job.primary_city}
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', paddingTop: '6px', borderTop: '1px solid var(--color-border-subtle)' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-accent)' }}>
                                {job.salary_display || 'Competitive'} {job.experience_raw ? `· ${job.experience_raw}` : ''}
                              </span>
                              {job.job_url && (
                                <a
                                  href={job.job_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--color-cyan)', fontWeight: 600, textDecoration: 'none' }}
                                >
                                  <span>View</span>
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
              Note: {meta.disclaimer}
            </p>
          </section>
        )}

        {/* ============================================================
            SECTION 3: MARKET VALUE BOOSTER (Summary & Dedicated Page CTA)
            ============================================================ */}
        {marketBooster && (
          <section
            id="domain-section-market-booster"
            aria-labelledby="market-booster-heading"
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div>
                <span className="mono-tag">3. Market Value Booster</span>
                <h2 id="market-booster-heading" style={{ margin: 'var(--space-0-5) 0 0 0' }}>
                  How to Stand Out Beyond Entry-Level Saturation
                </h2>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                }}
              >
                <Sparkles size={14} />
                <span>{(marketBooster.upgrade_path || []).length}-Step Upgrade Plan</span>
              </span>
            </div>

            {marketBooster.baseline_warning && (
              <div
                style={{
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--color-accent-lt)',
                  borderLeft: '4px solid var(--color-accent)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text)',
                }}
              >
                <strong>Reality check:</strong> {marketBooster.baseline_warning}
              </div>
            )}

            {(marketBooster.high_value_addons || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: 'var(--color-success)',
                  }}
                >
                  HIGH-VALUE ADD-ONS:
                </span>
                {marketBooster.high_value_addons.slice(0, 5).map((addon) => (
                  <span
                    key={addon}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--color-success-lt)',
                      border: '1px solid var(--color-success)',
                      color: '#0F5132',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                    }}
                  >
                    {addon}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                flexWrap: 'wrap',
                paddingTop: 'var(--space-1)',
              }}
            >
              <Link to={`/resources/${domain.id}?tab=booster`} className="btn-primary">
                <span>Open Stand Out &amp; Market Booster Page</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/resources?tab=booster" className="btn-secondary">
                <span>Compare All 7 Domains</span>
              </Link>
            </div>
          </section>
        )}

        {/* ============================================================
            SECTION 4: RESOURCES (Summary & Dedicated Page CTA)
            ============================================================ */}
        <section
          id="domain-section-resources"
          aria-labelledby="resources-heading"
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
            }}
          >
            <div>
              <span className="mono-tag">4. Curated Learning Resources</span>
              <h2 id="resources-heading" style={{ margin: 'var(--space-0-5) 0 0 0' }}>
                Resources by Level
              </h2>
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-2)',
                fontWeight: 700,
              }}
            >
              <BookOpen size={15} />
              <span>{resources.length} curated resources</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { label: 'Beginner', count: groupedResources.beginner.length },
              { label: 'Intermediate', count: groupedResources.intermediate.length },
              { label: 'Advanced', count: groupedResources.advanced.length },
            ].map((lvl) => (
              <span
                key={lvl.label}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-bg-alt)',
                  border: '1px solid var(--color-border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                }}
              >
                {lvl.label} ({lvl.count})
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              flexWrap: 'wrap',
              paddingTop: 'var(--space-1)',
            }}
          >
            <Link to={`/resources/${domain.id}?tab=resources`} className="btn-primary">
              <span>Browse All {domain.name} Resources by Level</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/resources" className="btn-secondary">
              <span>All Domains Resource Hub</span>
            </Link>
          </div>
        </section>

        {/* ============================================================
            SECTION 5: LINK TO THE SEMESTER ROADMAP
            ============================================================ */}
        <section
          id="domain-section-roadmap"
          aria-labelledby="roadmap-link-heading"
          className="card"
          style={{
            border: '2px solid var(--color-text)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ flex: '1 1 320px' }}>
            <span className="mono-tag">5. Semester Roadmap</span>
            <h2 id="roadmap-link-heading" style={{ margin: 'var(--space-0-5) 0 var(--space-1) 0' }}>
              Turn This Into a Semester-by-Semester Plan
            </h2>
            <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-text-2)', lineHeight: 1.55 }}>
              Follow the structured 8-semester B.Tech CSE milestone roadmap for {domain.name}.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {domain.roadmap_url && (
              <a
                href={domain.roadmap_url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <Layers size={16} />
                <span>roadmap.sh Guide</span>
                <ExternalLink size={14} />
              </a>
            )}
            <Link to={`/roadmap/${domain.id}`} className="btn-primary">
              <span>Open Semester Roadmap</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
