import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  filterAndGroupResources,
  getAllPhase4Domains,
  LEGACY_HARDWARE_ALIASES,
} from '../data/phase4DataLoader';

const RESOURCE_LEVELS = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

const VIEW_TABS = [
  { id: 'both', label: 'All (Booster + Resources)' },
  { id: 'booster', label: 'Stand Out Beyond Entry-Level' },
  { id: 'resources', label: 'Resources by Level' },
];

const LEVEL_OPTIONS = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

const COST_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
];

const LANGUAGE_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'English', label: 'English' },
  { id: 'Hindi', label: 'Hindi' },
];

function resolveDomainScope(rawId, validIds) {
  const norm = String(rawId || '').trim().toLowerCase();
  if (!norm) return 'all';
  const canonical = LEGACY_HARDWARE_ALIASES[norm] || norm;
  return validIds.has(canonical) ? canonical : 'all';
}

function normalizeTab(rawTab) {
  if (rawTab === 'booster' || rawTab === 'resources') return rawTab;
  return 'both';
}

function matchesSearchQuery(resource, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const hay = `${resource.title || ''} ${resource.provider || ''} ${resource.type || ''}`.toLowerCase();
  return hay.includes(q);
}

/** Filter pill button group reused across cost, language, and level controls. */
function FilterPillGroup({ label, options, value, onChange, activeColor = 'var(--color-text)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          color: 'var(--color-text-3)',
          marginRight: 'var(--space-0-5)',
        }}
      >
        {label}:
      </span>
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            style={{
              padding: '6px 13px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${active ? activeColor : 'var(--color-border)'}`,
              backgroundColor: active ? activeColor : 'var(--color-surface)',
              color: active ? '#FFFFFF' : 'var(--color-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Market Value Booster panel showing saturation reality check, skill tiers, and 3-step upgrade path. */
function MarketBoosterPanel({ domain }) {
  const { marketBooster, marketDemand } = domain;
  if (!marketBooster) return null;

  const saturatedSkills = Array.from(
    new Set([
      ...(marketBooster.declining_skills || []),
      ...(marketDemand?.saturated_skills || []),
    ])
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <TrendingUp size={18} style={{ color: 'var(--color-accent)' }} />
        <h3 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>
          How to Stand Out Beyond Entry-Level Saturation
        </h3>
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
            lineHeight: 1.55,
          }}
        >
          <strong>Reality check:</strong> {marketBooster.baseline_warning}
        </div>
      )}

      {/* 3-Column Skill Differentiation Grid */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-1)' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--color-text-2)' }} />
            <h4 style={{ fontSize: 'var(--text-base)', margin: 0 }}>
              Core Baseline Skills
            </h4>
          </div>
          <p style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
            Expected by default from every entry-level applicant
          </p>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-3)', color: 'var(--color-text-2)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
            {(marketBooster.core_skills || []).map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            padding: 'var(--space-2)',
            backgroundColor: 'var(--color-bg)',
            border: '1.5px solid var(--color-success)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-1)' }}>
            <Sparkles size={16} style={{ color: 'var(--color-success)' }} />
            <h4 style={{ fontSize: 'var(--text-base)', margin: 0, color: 'var(--color-success)' }}>
              High-Value Add-Ons
            </h4>
          </div>
          <p style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
            What differentiates shortlist-ready candidates
          </p>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-3)', color: 'var(--color-text)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
            {(marketBooster.high_value_addons || []).map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            padding: 'var(--space-2)',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-1)' }}>
            <AlertTriangle size={16} style={{ color: 'var(--color-amber)' }} />
            <h4 style={{ fontSize: 'var(--text-base)', margin: 0, color: 'var(--color-amber)' }}>
              Saturated or Declining
            </h4>
          </div>
          <p style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
            Avoid relying solely on these standalone credentials
          </p>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-3)', color: 'var(--color-text-2)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
            {saturatedSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3-Step Upgrade Path */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)',
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--color-accent)' }} />
          <h4 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>3-Step Upgrade Path</h4>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 'var(--space-2)',
          }}
        >
          {(marketBooster.upgrade_path || []).map((stepObj) => (
            <div
              key={stepObj.step}
              style={{
                padding: 'var(--space-2)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                }}
              >
                STEP {stepObj.step}
              </span>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>
                {stepObj.title}
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-2)', lineHeight: 1.55 }}>
                {stepObj.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Curated Resources by Level panel grouped into Beginner, Intermediate, and Advanced sections. */
function ResourcesByLevelPanel({
  domain,
  costFilter,
  languageFilter,
  levelFilter,
  searchQuery,
  onResetFilters,
}) {
  const grouped = useMemo(() => {
    const byCostAndLang = filterAndGroupResources(domain.resources, {
      cost: costFilter,
      language: languageFilter,
    });

    const filteredLevels = {};
    let totalCount = 0;

    RESOURCE_LEVELS.forEach(({ key }) => {
      if (levelFilter !== 'all' && levelFilter !== key) {
        filteredLevels[key] = [];
        return;
      }
      const items = (byCostAndLang[key] || []).filter((res) => matchesSearchQuery(res, searchQuery));
      filteredLevels[key] = items;
      totalCount += items.length;
    });

    return { ...filteredLevels, totalCount };
  }, [domain.resources, costFilter, languageFilter, levelFilter, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} style={{ color: 'var(--color-cyan)' }} />
          <h3 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>
            Curated Resources by Level
          </h3>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-2)',
            fontWeight: 700,
          }}
        >
          Showing {grouped.totalCount} of {domain.resources.length} resources
        </span>
      </div>

      {grouped.totalCount === 0 ? (
        <div className="state-container" style={{ padding: 'var(--space-4) var(--space-2)' }}>
          <BookOpen size={28} style={{ color: 'var(--color-text-3)' }} />
          <h4 className="state-title" style={{ fontSize: 'var(--text-lg)' }}>
            No matching {domain.name} resources for these filters
          </h4>
          <p className="state-description" style={{ marginBottom: 'var(--space-1)' }}>
            Adjust your level, cost, language, or search filter to view curated tracks for this domain.
          </p>
          <button type="button" className="btn-secondary" onClick={onResetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {RESOURCE_LEVELS.map(({ key, label }) => {
            const items = grouped[key] || [];
            if (items.length === 0) return null;

            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <h4
                  style={{
                    fontSize: 'var(--text-lg)',
                    margin: 0,
                    paddingBottom: 'var(--space-1)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                  }}
                >
                  {label} ({items.length})
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 'var(--space-2)',
                  }}
                >
                  {items.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: 'none',
                        padding: 'var(--space-2)',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 'var(--space-1)',
                        color: 'inherit',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 'var(--space-1)',
                            marginBottom: 'var(--space-1)',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--color-accent)',
                            }}
                          >
                            {res.type} &middot; {res.provider}
                          </span>
                          <ExternalLink size={14} style={{ color: 'var(--color-text-3)', flexShrink: 0 }} />
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 'var(--text-base)',
                            color: 'var(--color-text)',
                            lineHeight: 1.4,
                          }}
                        >
                          {res.title}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 'var(--space-1)',
                          paddingTop: 'var(--space-1)',
                          borderTop: '1px solid var(--color-border-subtle)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-2)',
                        }}
                      >
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor:
                              String(res.cost).toLowerCase() === 'free'
                                ? 'var(--color-success-lt)'
                                : 'var(--color-amber-lt)',
                            color: String(res.cost).toLowerCase() === 'free' ? '#0F5132' : '#92400E',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {res.cost}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border-subtle)',
                          }}
                        >
                          {res.language}
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 6px',
                          }}
                        >
                          <Clock size={12} />
                          {res.estimated_hours}h
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Dedicated multi-domain hub for comparing "How to Stand Out Beyond Entry-Level Saturation"
 * and "Curated Resources by Level" across all CSE specializations.
 */
export default function DomainResourcesAndBooster() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const allDomains = useMemo(() => getAllPhase4Domains(), []);
  const validDomainIds = useMemo(() => new Set(allDomains.map((d) => d.id)), [allDomains]);

  const [selectedDomain, setSelectedDomain] = useState(() => resolveDomainScope(id, validDomainIds));
  const [activeTab, setActiveTab] = useState(() => normalizeTab(searchParams.get('tab')));
  const [levelFilter, setLevelFilter] = useState('all');
  const [costFilter, setCostFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedDomain(resolveDomainScope(id, validDomainIds));
  }, [id, validDomainIds]);

  useEffect(() => {
    const paramTab = searchParams.get('tab');
    if (paramTab) {
      setActiveTab(normalizeTab(paramTab));
    }
  }, [searchParams]);

  const handleSelectDomain = (domainScope) => {
    setSelectedDomain(domainScope);
    const tabSuffix = activeTab !== 'both' ? `?tab=${activeTab}` : '';
    navigate(domainScope === 'all' ? `/resources${tabSuffix}` : `/resources/${domainScope}${tabSuffix}`);
  };

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);
    if (nextTab === 'both') {
      searchParams.delete('tab');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ tab: nextTab }, { replace: true });
    }
  };

  const resetResourceFilters = () => {
    setLevelFilter('all');
    setCostFilter('all');
    setLanguageFilter('all');
    setSearchQuery('');
  };

  const visibleDomains = useMemo(() => {
    if (selectedDomain === 'all') return allDomains;
    return allDomains.filter((d) => d.id === selectedDomain);
  }, [allDomains, selectedDomain]);

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
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        {/* Header Card */}
        <header className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div style={{ flex: '1 1 360px' }}>
              <span className="mono-tag">All-Domain Growth &amp; Learning Hub</span>
              <h1 style={{ margin: 'var(--space-0-5) 0 var(--space-1) 0' }}>
                Resources by Level &amp; Stand Out Beyond Entry-Level
              </h1>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-text-2)', lineHeight: 1.6 }}>
                Compare how to differentiate yourself beyond saturated fresher skills and browse structured Beginner, Intermediate, and Advanced learning tracks across all {allDomains.length} CSE domains.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
              <Link to="/domains" className="btn-secondary">
                <Layers size={16} />
                <span>Explore Domains</span>
              </Link>
              <Link to="/roadmap" className="btn-primary">
                <span>My Roadmap</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Domain Selector Pill Bar */}
          <div
            role="group"
            aria-label="Filter by specialization domain"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              paddingTop: 'var(--space-2)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <button
              type="button"
              aria-pressed={selectedDomain === 'all'}
              onClick={() => handleSelectDomain('all')}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                border: `1.5px solid ${selectedDomain === 'all' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                backgroundColor: selectedDomain === 'all' ? 'var(--color-accent)' : 'var(--color-surface)',
                color: selectedDomain === 'all' ? '#FFFFFF' : 'var(--color-text)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              All {allDomains.length} Domains
            </button>

            {allDomains.map((dom) => {
              const active = selectedDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleSelectDomain(dom.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${active ? 'var(--color-text)' : 'var(--color-border)'}`,
                    backgroundColor: active ? 'var(--color-text)' : 'var(--color-surface)',
                    color: active ? '#FFFFFF' : 'var(--color-text)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {dom.name}
                </button>
              );
            })}
          </div>
        </header>

        {/* View Mode & Resource Filters Card */}
        <section
          aria-label="View mode and resource filters"
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {VIEW_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleTabChange(tab.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      backgroundColor: active ? 'var(--color-accent-lt)' : 'var(--color-surface)',
                      color: active ? 'var(--color-accent)' : 'var(--color-text)',
                      fontWeight: 700,
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab !== 'booster' && (
              <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '320px' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-3)',
                  }}
                />
                <input
                  type="text"
                  aria-label="Search resources by title, provider, or type"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, provider, type..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>
            )}
          </div>

          {activeTab !== 'booster' && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <FilterPillGroup
                label="LEVEL"
                options={LEVEL_OPTIONS}
                value={levelFilter}
                onChange={setLevelFilter}
                activeColor="var(--color-cyan)"
              />
              <FilterPillGroup
                label="COST"
                options={COST_OPTIONS}
                value={costFilter}
                onChange={setCostFilter}
              />
              <FilterPillGroup
                label="LANGUAGE"
                options={LANGUAGE_OPTIONS}
                value={languageFilter}
                onChange={setLanguageFilter}
                activeColor="var(--color-accent)"
              />
            </div>
          )}
        </section>

        {/* Per-Domain Sections */}
        {visibleDomains.map((domain, index) => (
          <section
            key={domain.id}
            id={`resources-domain-${domain.id}`}
            aria-labelledby={`resources-domain-heading-${domain.id}`}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
          >
            {/* Domain Header Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                paddingBottom: 'var(--space-2)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ flex: '1 1 360px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span className="mono-tag">
                    0{selectedDomain === 'all' ? index + 1 : allDomains.findIndex((d) => d.id === domain.id) + 1} &middot; {domain.id.toUpperCase()}
                  </span>
                  {domain.marketDemand?.demand_trend && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-bg-alt)',
                        color: 'var(--color-text-2)',
                      }}
                    >
                      Demand: {domain.marketDemand.demand_trend}
                    </span>
                  )}
                  {domain.marketDemand?.fresher_salary_range_inr?.display && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      Fresher: {domain.marketDemand.fresher_salary_range_inr.display}
                    </span>
                  )}
                </div>

                <h2 id={`resources-domain-heading-${domain.id}`} style={{ margin: '0 0 4px 0' }}>
                  {domain.name}
                </h2>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-2)', lineHeight: 1.55 }}>
                  {domain.overview}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                <Link to={`/domain/${domain.id}`} className="btn-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                  <span>Domain Overview</span>
                </Link>
                <Link to={`/roadmap/${domain.id}`} className="btn-ghost" style={{ fontSize: 'var(--text-sm)' }}>
                  <span>Semester Roadmap</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Part A: Stand Out Beyond Entry-Level */}
            {activeTab !== 'resources' && <MarketBoosterPanel domain={domain} />}

            {/* Divider if showing both */}
            {activeTab === 'both' && domain.marketBooster && (
              <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-1) 0' }} />
            )}

            {/* Part B: Curated Resources by Level */}
            {activeTab !== 'booster' && (
              <ResourcesByLevelPanel
                domain={domain}
                costFilter={costFilter}
                languageFilter={languageFilter}
                levelFilter={levelFilter}
                searchQuery={searchQuery}
                onResetFilters={resetResourceFilters}
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
