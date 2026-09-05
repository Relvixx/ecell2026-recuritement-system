'use client';

import { useEffect, useState } from 'react';
import { TEAMS } from '@/config/teams';
import { MobileStickyApply, TeamDetailPanel, TeamSelectorCard, FeaturedTeamCard, Button } from '@/components';

export function LandingStickyApplyController() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const heroCta = document.querySelector('[data-hero-cta]');
    const finalCta = document.querySelector('[data-final-cta]');

    if (!heroCta || !finalCta || !('IntersectionObserver' in window)) {
      setHidden(false);
      return undefined;
    }

    const visibility = {
      hero: true,
      final: false
    };

    const update = () => setHidden(visibility.hero || visibility.final);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroCta) visibility.hero = entry.isIntersecting;
          if (entry.target === finalCta) visibility.final = entry.isIntersecting;
        });
        update();
      },
      { threshold: 0.08 }
    );

    observer.observe(heroCta);
    observer.observe(finalCta);

    return () => observer.disconnect();
  }, []);

  return <MobileStickyApply hidden={hidden} />;
}

export function TeamExplorer() {
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const selectedTeam = TEAMS.find((team) => team.id === selectedTeamId) || TEAMS[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div className="motion-fade-up">
        <FeaturedTeamCard team={selectedTeam} />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setDetailsOpen(true)} variant="secondary">
            View team details
          </Button>
          <Button href={`/apply?team=${selectedTeam.id}`}>
            Apply for this team &rarr;
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TEAMS.map((team, index) => (
          <TeamSelectorCard
            key={team.id}
            onSelect={(teamId) => {
              setSelectedTeamId(teamId);
              setDetailsOpen(false);
            }}
            selected={team.id === selectedTeamId}
            team={team}
          />
        ))}
      </div>

      {detailsOpen ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[var(--color-ivory-100)]/95 p-4 md:p-8 lg:static lg:z-auto lg:col-span-2 lg:bg-transparent lg:p-0">
          <div className="mx-auto max-w-[900px]">
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
              className="flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left"
              id={buttonId}
              onClick={() => setOpenIndex(open ? -1 : index)}
              type="button"
            >
              <span className="label text-[1rem]">{item.question}</span>
              <span aria-hidden="true" className="text-xl">{open ? '-' : '+'}</span>
            </button>
            <div
              aria-labelledby={buttonId}
              className={`grid accordion-ready ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              id={panelId}
              role="region"
            >
              <div className="overflow-hidden">
                <p className="body max-w-[720px] pb-5 text-muted">{item.answer}</p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
