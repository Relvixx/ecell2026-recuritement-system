'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { RECRUITMENT_LINKS, RECRUITMENT_WINDOW_LABEL, RECRUITMENT_YEAR_LABEL } from '@/config/recruitment';
import { Button } from '../ui/forms';
import { Container, cn } from '../ui/layout';

const desktopLinks = [
  { label: 'About', href: '#about' },
  { label: 'Life', href: '#life' },
  { label: 'Teams', href: '#teams' },
  { label: 'Journey', href: '#journey' },
  { label: 'FAQ', href: '#faq' }
];

const mobileLinks = [
  { label: 'About', href: '#about' },
  { label: 'Life at E-CELL', href: '#life' },
  { label: 'Find Your Squad', href: '#teams' },
  { label: 'Recruitment Journey', href: '#journey' },
  { label: 'FAQ', href: '#faq' }
];

export function ParticipantHeader({ onMenuChange }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const closeRef = useRef(null);

  useEffect(() => {
    onMenuChange?.(open);
    window.dispatchEvent(new CustomEvent('participant-menu-change', { detail: { open } }));
  }, [onMenuChange, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 lg:bg-background/90">
      <Container className="flex min-h-16 items-center justify-between gap-4 lg:min-h-[84px]">
        <Link className="label min-h-11 inline-flex items-center lg:group lg:gap-3" href="/">
          <span className="lg:hidden">E-CELL MET</span>
          <span className="hidden h-12 w-12 place-items-center rounded-[1rem] border border-border bg-[var(--color-ivory-50)] text-[0.92rem] font-medium text-foreground transition group-hover:border-foreground lg:grid">
            EC
          </span>
          <span className="hidden gap-0.5 lg:grid">
            <span className="text-[1.2rem] font-medium leading-none tracking-[0.01em] text-foreground">E-CELL MET</span>
            <span className="hidden text-[0.8rem] leading-none text-muted lg:block">Recruitment {RECRUITMENT_YEAR_LABEL}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 text-[1rem] text-muted md:flex lg:gap-9">
          {desktopLinks.map((link) => (
            <a className="inline-flex min-h-11 items-center border-b border-transparent hover:border-foreground/30 hover:text-foreground" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button className="min-h-11 px-5 sm:min-h-11 lg:min-h-[50px] lg:px-7 lg:text-[0.96rem]" href="/apply">
            Apply Now <span className="arrow-shift" aria-hidden="true">&#8599;</span>
          </Button>
        </div>

        <button
          aria-controls={menuId}
          aria-expanded={open}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface text-sm font-medium md:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
        </button>
      </Container>

      <div
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-50 overflow-y-auto bg-[var(--color-ivory-100)] transition duration-200 md:hidden',
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        )}
        id={menuId}
        inert={!open}
      >
        <Container className="safe-bottom-pad min-h-svh py-4">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <Link className="label inline-flex min-h-11 items-center" href="/" onClick={() => setOpen(false)}>
              E-CELL MET
            </Link>
            <button
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm font-medium"
              onClick={() => setOpen(false)}
              ref={closeRef}
              type="button"
            >
              Close
            </button>
          </div>
          <nav aria-label="Mobile primary" className="mt-8 flex flex-col gap-2">
            {mobileLinks.map((link) => (
              <a
                className="heading min-h-[56px] rounded-[var(--radius-control)] px-2 py-2 text-[2rem]"
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button className="mt-6 w-full" href="/apply" onClick={() => setOpen(false)}>
              Start Application <span className="arrow-shift" aria-hidden="true">&#8599;</span>
            </Button>
          </nav>
        </Container>
      </div>
    </header>
  );
}

export function ParticipantFooter() {
  const footerLinks = [
    { label: 'Instagram', meta: RECRUITMENT_LINKS.instagramUrl || 'URL pending' },
    { label: 'Website', meta: RECRUITMENT_LINKS.websiteUrl || 'URL pending' },
    { label: 'Contact', meta: RECRUITMENT_LINKS.contactEmail || 'Email pending' }
  ];

  return (
    <footer className="border-t border-border bg-[var(--color-ivory-100)]">
      <Container className="py-10 sm:py-12 lg:py-14">
        <div className="grid gap-8 lg:hidden">
          <div>
            <p className="label">E-CELL MET</p>
            <p className="body-small mt-2 text-muted">Recruitment {RECRUITMENT_YEAR_LABEL}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm text-muted">
            {footerLinks.map((link) => (
              <span className="min-h-11 inline-flex items-center" key={link.label}>
                {link.label}
              </span>
            ))}
          </nav>
          <p className="body-small text-muted">Built with care by E-CELL MET.</p>
        </div>

        <div className="hidden gap-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="max-w-[520px]">
            <p className="heading text-[2rem]">E-CELL MET</p>
            <p className="body-small mt-2 text-muted">Recruitment {RECRUITMENT_YEAR_LABEL}</p>
            <p className="body mt-5 text-muted">
              Student-led recruitment for the people behind E-CELL&apos;s ideas, events, stories, systems and execution.
            </p>
          </div>

          <nav aria-label="Footer" className="flex gap-10 lg:justify-self-end">
            {footerLinks.map((link) => (
              <span className="min-w-[7rem]" key={link.label}>
                <span className="label block text-[1.04rem]">{link.label}</span>
                <span className="body-small mt-2 block text-muted">{link.meta}</span>
              </span>
            ))}
          </nav>
        </div>
        <div className="mt-10 hidden flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between lg:flex">
          <p className="body-small text-muted">Built with care by E-CELL MET.</p>
          <p className="body-small text-muted">Applications close {RECRUITMENT_LINKS.deadlineLabel}.</p>
        </div>
      </Container>
    </footer>
  );
}

export function MobileStickyApply({ hidden = false, className = '' }) {
  if (hidden) return null;

  return (
    <div className={cn('fixed inset-x-0 bottom-0 z-20 px-4 pb-[calc(1rem+var(--safe-area-bottom))] md:hidden', className)}>
      <div className="mx-auto flex max-w-[430px] items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-[var(--color-ivory-50)] p-3 shadow-[var(--shadow-soft)]">
        <span className="body-small text-muted">{RECRUITMENT_WINDOW_LABEL}</span>
        <Button className="min-h-11 px-4 py-2 sm:min-h-11" href="/apply">
          Apply <span aria-hidden="true">&rarr;</span>
        </Button>
      </div>
    </div>
  );
}
