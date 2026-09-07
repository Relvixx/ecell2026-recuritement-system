'use client';

import { useEffect, useState } from 'react';
import { TEAMS } from '@/config/teams';
import { Button } from '@/components/ui/forms';
import { MobileStickyApply } from '@/components/shells/participant';
import { FeaturedTeamCard, TeamDetailPanel, TeamSelectorCard } from '@/components/shells/teams';

export function LandingStickyApplyController() {
  const [hidden, setHidden] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenuChange = (event) => setMenuOpen(Boolean(event.detail?.open));

    window.addEventListener('participant-menu-change', handleMenuChange);
    return () => window.removeEventListener('participant-menu-change', handleMenuChange);
  }, []);

  useEffect(() => {
    const heroSection = document.querySelector('[data-hero-section]');
    const finalCta = document.querySelector('[data-final-cta]');

    if (!heroSection || !finalCta || !('IntersectionObserver' in window)) {
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
          if (entry.target === heroSection) visibility.hero = entry.isIntersecting;
          if (entry.target === finalCta) visibility.final = entry.isIntersecting;
        });
        update();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0 }
    );

    observer.observe(heroSection);
    observer.observe(finalCta);

    return () => observer.disconnect();
  }, []);

  return <MobileStickyApply hidden={hidden || menuOpen} />;
}

export function TeamExplorer() {
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const selectedTeam = TEAMS.find((team) => team.id === selectedTeamId) || TEAMS[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-start lg:gap-12">
      <div className="motion-fade-up lg:sticky lg:top-28">
        <FeaturedTeamCard team={selectedTeam} />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setDetailsOpen(true)} variant="secondary">
            View team details
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-4">
        {TEAMS.map((team, index) => (
          <div
            className={[
              index === 1 || index === 4 ? 'lg:translate-y-5' : '',
              index === 2 ? 'lg:col-span-2 lg:max-w-[68%]' : '',
              index === 5 ? 'lg:-translate-y-1' : '',
              index === 6 ? 'lg:col-span-2 lg:ml-auto lg:max-w-[68%]' : ''
            ].join(' ')}
            key={team.id}
          >
            <TeamSelectorCard
              className="min-h-[76px] p-3 lg:min-h-[150px] lg:p-6"
              compact
              index={index}
              onSelect={(teamId) => {
                setSelectedTeamId(teamId);
                setDetailsOpen(false);
              }}
              selected={team.id === selectedTeamId}
              team={team}
            />
          </div>
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
