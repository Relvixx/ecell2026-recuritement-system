'use client';

import { useEffect, useState } from 'react';
import { TEAMS, getTeamAccent } from '@/config/teams';
import { MobileStickyApply } from '@/components/shells/participant';
import { FeaturedTeamCard, TeamDetailPanel } from '@/components/shells/teams';

export function LandingStickyApplyController() {
  const [hidden, setHidden] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenuChange = (event) => setMenuOpen(Boolean(event.detail?.open));

    window.addEventListener('participant-menu-change', handleMenuChange);
    return () => window.removeEventListener('participant-menu-change', handleMenuChange);
  }, []);

  useEffect(() => {
    const heroCta = document.querySelector('[data-hero-cta]');
    const finalCta = document.querySelector('[data-final-cta]');

    if (!heroCta || !finalCta) {
      setHidden(false);
      return undefined;
    }

    let frameId;

    const isVisible = (node) => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const update = () => {
      frameId = undefined;
      setHidden(isVisible(heroCta) || isVisible(finalCta));
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return <MobileStickyApply hidden={hidden || menuOpen} />;
}

export function TeamExplorer() {
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const selectedTeam = TEAMS.find((team) => team.id === selectedTeamId) || TEAMS[0];

  const selectTeam = (teamId) => {
    setSelectedTeamId(teamId);
    setDetailsOpen(false);
  };

  return (
    <div className="team-explorer">
      <div className="hidden lg:grid lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-12">
        <div className="motion-fade-up min-w-0 self-center lg:sticky lg:top-28" id="selected-team-dossier">
          <FeaturedTeamCard
            detailsOpen={detailsOpen}
            onViewDetails={() => setDetailsOpen(true)}
            team={selectedTeam}
          />
        </div>

        <div className="team-dossier-index">
          <div className="team-dossier-index-header" aria-hidden="true">
            <span>Dossier index</span>
            <span>{String(TEAMS.length).padStart(2, '0')} teams</span>
          </div>
          <ol aria-label="Choose a team dossier" className="team-dossier-entries">
            {TEAMS.map((team, index) => {
              const selected = team.id === selectedTeamId;

              return (
                <li key={team.id}>
                  <button
                    aria-controls="selected-team-dossier"
                    aria-describedby={`team-index-summary-${team.id}`}
                    aria-labelledby={`team-index-name-${team.id}`}
                    aria-pressed={selected}
                    className="team-dossier-entry"
                    onClick={() => selectTeam(team.id)}
                    style={{ '--team-accent': getTeamAccent(team.id)?.surface }}
                    type="button"
                  >
                    <span aria-hidden="true" className="team-dossier-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="team-dossier-copy">
                      <span className="team-dossier-meta">
                        <span>{team.tagline}</span>
                        <span aria-hidden="true" className="team-dossier-state">{selected ? 'Open' : '\u2197'}</span>
                      </span>
                      <span className="team-dossier-name" id={`team-index-name-${team.id}`}>{team.name}</span>
                      <span className="team-dossier-summary" id={`team-index-summary-${team.id}`}>{team.shortDescription}</span>
                    </span>
                    <span aria-hidden="true" className="team-dossier-accent" />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="lg:hidden">
        <p className="team-mobile-helper body-small text-muted">Pick a team below to see what it&apos;s really like.</p>
        <ol aria-label="Choose a team dossier" className="team-mobile-dossier-list">
          {TEAMS.map((team, index) => {
            const selected = team.id === selectedTeamId;
            const dossierId = `mobile-team-dossier-${team.id}`;
            const triggerId = `mobile-team-trigger-${team.id}`;

            return (
              <li className="team-mobile-dossier-item" key={team.id}>
                <button
                  aria-controls={dossierId}
                  aria-expanded={selected}
                  className="team-mobile-dossier-trigger"
                  id={triggerId}
                  onClick={() => selectTeam(team.id)}
                  style={{ '--team-accent': getTeamAccent(team.id)?.surface }}
                  type="button"
                >
                  <span aria-hidden="true" className="team-mobile-dossier-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="team-mobile-dossier-copy">
                    <span className="team-mobile-dossier-meta">{team.tagline}</span>
                    <span className="team-mobile-dossier-name">{team.name}</span>
                  </span>
                  <span aria-hidden="true" className="team-mobile-dossier-state">{selected ? '\u2212' : '+'}</span>
                </button>
                <div
                  aria-labelledby={triggerId}
                  className={`team-mobile-dossier-panel accordion-ready ${selected ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  id={dossierId}
                  role="region"
                >
                  <div className="overflow-hidden">
                    <div className="team-mobile-dossier-shell">
                      {selected ? (
                        <FeaturedTeamCard
                          className="team-inline-dossier-card"
                          detailsOpen={detailsOpen}
                          onViewDetails={() => setDetailsOpen(true)}
                          team={team}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {detailsOpen ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[var(--footer-bg)]/95 p-4 md:p-8 lg:static lg:z-auto lg:col-span-2 lg:bg-transparent lg:p-0">
          <div className="mx-auto max-w-[900px]" id="team-detail-content">
            <TeamDetailPanel onClose={() => setDetailsOpen(false)} team={selectedTeam} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const open = index === openIndex;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <section key={item.question}>
            <button
              aria-controls={panelId}
              aria-expanded={open}
              className="flex min-h-[72px] w-full items-center justify-between gap-5 py-5 text-left lg:min-h-[92px] lg:py-7"
              id={buttonId}
              onClick={() => setOpenIndex(open ? -1 : index)}
              type="button"
            >
              <span className="label text-[1rem] lg:text-[1.22rem]">{item.question}</span>
              <span aria-hidden="true" className="text-xl lg:text-2xl">{open ? '-' : '+'}</span>
            </button>
            <div
              aria-labelledby={buttonId}
              className={`grid accordion-ready ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              id={panelId}
              role="region"
            >
              <div className="overflow-hidden">
                <p className="body max-w-[820px] pb-7 text-muted lg:pb-8 lg:text-[1.12rem] lg:leading-[1.78]">{item.answer}</p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
