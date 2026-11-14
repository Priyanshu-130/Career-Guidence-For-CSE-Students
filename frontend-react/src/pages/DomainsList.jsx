import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import domains from '../data/domains.json';
import { getAllPhase4Domains, getPhase4DomainBundle } from '../data/phase4DataLoader';
import { 
  BookOpen, 
  ArrowRight, 
  Search, 
  ExternalLink, 
  TrendingUp, 
  Briefcase, 
  X
} from 'lucide-react';

const domainImages = {
  ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  web: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  security: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  cloud: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  systems: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  vlsi: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  iot: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
  robotics: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  networking: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
};

export default function DomainsList() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);

  const allDomains = useMemo(() => {
    const legacyById = new Map(domains.map((d) => [d.id, d]));
    const phase4Domains = getAllPhase4Domains();
    const seen = new Set();

    const merged = phase4Domains.map((p4) => {
      seen.add(p4.id);
      const legacy = legacyById.get(p4.id);
      const category = p4.id === 'systems' ? 'systems' : legacy?.category || 'software';
      return {
        ...(legacy || {}),
        id: p4.id,
        title: p4.name,
        description: p4.overview,
        overview: p4.overview,
        category,
        prerequisites: p4.prerequisites || legacy?.prerequisites || [],
        skills: p4.core_skills || legacy?.skills || [],
        tools: legacy?.tools || p4.core_skills || [],
        roles: p4.career_paths || legacy?.roles || [],
        salaryDisplay: p4.marketDemand?.fresher_salary_range_inr?.display || '₹4.0 – ₹12.0 LPA',
        demandTrend: p4.marketDemand?.demand_trend || 'Stable',
      };
    });

    domains.forEach((d) => {
      if (seen.has(d.id)) return;
      const bundle = getPhase4DomainBundle(d.id);
      merged.push({
        ...d,
        salaryDisplay: bundle?.marketDemand?.fresher_salary_range_inr?.display || '₹4.0 – ₹14.0 LPA',
        demandTrend: bundle?.marketDemand?.demand_trend || 'Stable',
      });
    });

    return merged;
  }, []);

  const filteredDomains = useMemo(() => {
    return allDomains.filter(d => {
      // Category filter
      if (filter === 'software' && d.category !== 'software') return false;
      if (filter === 'hardware' && d.category !== 'hardware') return false;
      if (filter === 'systems' && !['cloud', 'security', 'systems', 'networking', 'vlsi'].includes(d.id)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = d.title.toLowerCase().includes(q);
        const matchesDesc = d.description?.toLowerCase().includes(q);
        const matchesSkills = d.skills?.some(s => s.toLowerCase().includes(q));
        const matchesTools = d.tools?.some(t => t.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesSkills || matchesTools;
      }
      return true;
    });
  }, [allDomains, filter, searchQuery]);

  return (
    <div style={{
      minHeight: '100%',
      backgroundColor: 'var(--tide)',
      backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(116, 139, 255, 0.35) 100%)',
      color: 'var(--ink)',
      fontFamily: 'Manrope, system-ui, sans-serif',
      padding: '1.5rem 1rem 5rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* 2. EDITORIAL HEADER & SEARCH BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: 'rgba(116, 139, 255, 0.16)',
              border: '1px solid var(--edge)',
              color: 'var(--ink-soft)',
              fontFamily: 'Manrope, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              borderRadius: '6px',
              marginBottom: '1rem'
            }}>
              DISCIPLINE ARCHIVE
            </div>

            <h1 style={{
              fontFamily: 'Manrope, system-ui, sans-serif',
              fontSize: 'clamp(34px, 3.6vw, 48px)',
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              textTransform: 'none',
              color: 'var(--ink)',
              textWrap: 'balance',
              margin: '0 0 0.75rem 0'
            }}>
              Explore CSE{' '}
              <span style={{
                fontFamily: 'Manrope, system-ui, sans-serif',
                fontStyle: 'italic',
                fontWeight: 400,
                textTransform: 'none',
                color: 'var(--signal-deep)'
              }}>
                specializations
              </span>
            </h1>

            <p style={{
              color: 'var(--ink-capsule)',
              maxWidth: '680px',
              margin: 0
            }}>
              Detailed intelligence briefings across intelligent systems, systems infrastructure, cybersecurity, and silicon hardware design.
            </p>
          </div>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '320px'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--signal)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, tools, roles..."
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.55)',
                border: '1px solid var(--edge)',
                borderRadius: '9999px',
                fontFamily: 'Manrope, system-ui, sans-serif',
                fontSize: '14px',
                color: 'var(--ink)',
                outline: 'none',
                boxShadow: '0 4px 16px rgba(21, 36, 78, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
              }}
            />
          </div>
        </div>

        {/* 3. CATEGORY FILTER TABS */}
        <div style={{
          display: 'flex',
          gap: '0.65rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--edge)',
          paddingBottom: '1.25rem'
        }}>
          {[
            { id: 'all', label: 'All Specializations' },
            { id: 'software', label: 'Software & AI' },
            { id: 'systems', label: 'Systems & Cloud' },
            { id: 'hardware', label: 'Hardware & Embedded' }
          ].map(tab => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '0.6rem 1.4rem',
                  backgroundColor: isActive ? 'var(--signal)' : 'var(--glass)',
                  color: isActive ? '#FFFFFF' : 'var(--ink-soft)',
                  border: '1px solid var(--edge)',
                  borderRadius: '9999px',
                  fontFamily: 'Manrope, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 8px 24px rgba(116, 139, 255, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4. DOMAIN ARCHITECTURAL CARD GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem'
        }}>
          {filteredDomains.map((dom, idx) => {
            const img = domainImages[dom.id] || domainImages.web;
            const comp = dom.salaryDisplay || '₹4.0 – ₹12.0 LPA';
            const code = `DOM-0${idx + 1}`;

            return (
              <div 
                key={dom.id}
                style={{
                  backgroundColor: 'var(--glass)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid var(--edge)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 40px rgba(21, 36, 78, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--signal)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(21, 36, 78, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--edge)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(21, 36, 78, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                }}
              >
                {/* Visual Header */}
                <div style={{ position: 'relative', height: '210px', overflow: 'hidden', backgroundColor: 'rgba(169, 200, 255, 0.25)' }}>
                  <img
                    src={img}
                    alt={dom.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      backgroundColor: 'rgba(11, 22, 54, 0.72)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontFamily: 'Manrope, system-ui, sans-serif',
                      fontSize: '9px',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {dom.category}
                    </span>
                    <span style={{
                      backgroundColor: 'var(--signal)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontFamily: 'Manrope, system-ui, sans-serif',
                      fontSize: '9px',
                      fontWeight: 600
                    }}>
                      {code}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'Manrope, system-ui, sans-serif',
                      fontSize: '19px',
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      textTransform: 'none',
                      color: 'var(--ink)',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.25
                    }}>
                      {dom.title}
                    </h3>

                    <p style={{
                      color: 'var(--ink-capsule)',
                      margin: '0 0 1.25rem 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {dom.description}
                    </p>

                    {/* Metadata Box */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(234, 240, 255, 0.36)',
                      border: '1px solid var(--edge)',
                      borderRadius: '8px',
                      marginBottom: '1.25rem',
                      fontSize: '14px',
                      color: 'var(--ink-soft)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <TrendingUp size={14} style={{ color: 'var(--signal-deep)', flexShrink: 0 }} />
                        <span>{comp.split('(')[0].trim()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Briefcase size={14} style={{ color: 'var(--ink)', flexShrink: 0 }} />
                        <span>{dom.demandTrend || `${dom.roles?.length || 4}+ Roles`}</span>
                      </div>
                    </div>

                    {/* Tools pill tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {dom.tools?.slice(0, 4).map((tool, tIdx) => (
                        <span key={tIdx} style={{
                          fontFamily: 'Manrope, system-ui, sans-serif',
                          fontSize: '11px',
                          fontWeight: 400,
                          letterSpacing: '0.02em',
                          backgroundColor: 'rgba(169, 200, 255, 0.28)',
                          border: '1px solid var(--edge)',
                          color: 'var(--ink)',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--edge)'
                  }}>
                    <Link
                      to={`/domain/${dom.id}`}
                      style={{
                        padding: '0.6rem 1.15rem',
                        backgroundColor: 'var(--glass)',
                        border: '1px solid var(--edge)',
                        borderRadius: '9999px',
                        fontFamily: 'Manrope, system-ui, sans-serif',
                        fontSize: '14px',
                        fontWeight: 400,
                        textTransform: 'none',
                        color: 'var(--ink)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span>Explore Domain</span>
                      <ExternalLink size={12} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedDomain(dom)}
                      style={{
                        padding: '0.6rem 0.9rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontFamily: 'Manrope, system-ui, sans-serif',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: 'var(--ink-soft)',
                        cursor: 'pointer'
                      }}
                    >
                      Quick View
                    </button>

                    <Link
                      to={`/roadmap/${dom.id}`}
                      style={{
                        padding: '0.6rem 1.25rem',
                        backgroundColor: 'var(--signal)',
                        border: '1px solid var(--edge)',
                        borderRadius: '9999px',
                        fontFamily: 'Manrope, system-ui, sans-serif',
                        fontSize: '14px',
                        fontWeight: 400,
                        textTransform: 'none',
                        color: '#FFFFFF',
                        boxShadow: '0 8px 24px rgba(116, 139, 255, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span>Roadmap</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Quick View */}
      {selectedDomain && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backgroundColor: 'rgba(11, 22, 54, 0.55)',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            backgroundColor: 'var(--tide)',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid var(--edge)',
            boxShadow: '0 10px 40px rgba(21, 36, 78, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            position: 'relative',
            padding: '2.5rem'
          }}>
            <button
              onClick={() => setSelectedDomain(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--glass)',
                border: '1px solid var(--edge)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--ink)'
              }}
            >
              <X size={16} />
            </button>

            <span style={{
              fontFamily: 'Manrope, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              color: 'var(--ink-soft)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              {selectedDomain.category?.toUpperCase()} SPECIALIZATION
            </span>

            <h3 style={{
              fontFamily: 'Manrope, system-ui, sans-serif',
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              textTransform: 'none',
              color: 'var(--ink)',
              margin: '0 0 1rem 0'
            }}>
              {selectedDomain.title}
            </h3>

            <p style={{ color: 'var(--ink-capsule)', margin: '0 0 1.5rem 0' }}>
              {selectedDomain.overview || selectedDomain.description}
            </p>

            {/* Prerequisites */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontFamily: 'Manrope, system-ui, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>
                Prerequisites & Foundational Math
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedDomain.prerequisites?.map((pre, pIdx) => (
                  <span key={pIdx} style={{
                    fontSize: '11px',
                    fontFamily: 'Manrope, system-ui, sans-serif',
                    backgroundColor: 'var(--glass)',
                    border: '1px solid var(--edge)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    color: 'var(--ink)'
                  }}>
                    {pre}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Roles */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontFamily: 'Manrope, system-ui, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>
                Target Engineering Titles
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedDomain.roles?.map((role, rIdx) => (
                  <span key={rIdx} style={{
                    fontSize: '11px',
                    fontFamily: 'Manrope, system-ui, sans-serif',
                    backgroundColor: 'rgba(169, 200, 255, 0.28)',
                    border: '1px solid var(--edge)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    color: 'var(--ink)',
                    fontWeight: 500
                  }}>
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--edge)', flexWrap: 'wrap' }}>
              <Link
                to={`/domain/${selectedDomain.id}`}
                style={{
                  flex: 1,
                  padding: '0.85rem 1.5rem',
                  backgroundColor: 'var(--glass)',
                  border: '1px solid var(--edge)',
                  color: 'var(--ink)',
                  borderRadius: '9999px',
                  fontFamily: 'Manrope, system-ui, sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  textTransform: 'none',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <BookOpen size={16} />
                <span>Open Full Blueprint</span>
              </Link>
              <Link
                to={`/roadmap/${selectedDomain.id}`}
                style={{
                  padding: '0.85rem 1.75rem',
                  backgroundColor: 'var(--signal)',
                  border: '1px solid var(--edge)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(116, 139, 255, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                  borderRadius: '9999px',
                  fontFamily: 'Manrope, system-ui, sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  textTransform: 'none',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>View Roadmap</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
