'use client';

import Image from 'next/image';
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

const footerLinks = [
  {
    index: '01',
    label: 'Instagram',
    display: '@ecell.met',
    description: 'Updates, events & announcements',
    href: RECRUITMENT_LINKS.instagramUrl,
    icon: 'instagram',
    external: true
  },
  {
    index: '02',
    label: 'Official website',
    display: 'ecell-met.tech',
    description: 'Official E-CELL MET website',
    href: RECRUITMENT_LINKS.websiteUrl,
    icon: 'globe',
    external: true
  },
  {
    index: '03',
    label: 'Contact',
    display: RECRUITMENT_LINKS.contactEmail,
    description: 'Recruitment-related queries',
    href: `mailto:${RECRUITMENT_LINKS.contactEmail}`,
    icon: 'mail',
    external: false
  }
];

function DirectoryIcon({ type }) {
  const shared = {
    'aria-hidden': 'true',
    className: 'footer-directory-icon h-[1.05rem] w-[1.05rem] shrink-0',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: '1.5',
    viewBox: '0 0 24 24'
  };

  if (type === 'instagram') {
    return <svg {...shared}><rect height="15" rx="4" width="15" x="4.5" y="4.5" /><circle cx="12" cy="12" r="3.25" /><circle cx="17.35" cy="6.8" fill="currentColor" r="0.7" stroke="none" /></svg>;
  }

  if (type === 'globe') {
    return <svg {...shared}><circle cx="12" cy="12" r="8.25" /><path d="M3.75 12h16.5M12 3.75c2.1 2.26 3.18 4.99 3.18 8.25S14.1 17.99 12 20.25C9.9 17.99 8.82 15.26 8.82 12S9.9 6.01 12 3.75Z" /></svg>;
  }

  return <svg {...shared}><rect height="14.5" rx="2.5" width="18" x="3" y="4.75" /><path d="m4.4 6.3 7.6 6.05 7.6-6.05" /></svg>;
}

function ExternalArrow({ external }) {
  return <span aria-hidden="true" className="footer-directory-arrow">{external ? '\u2197' : '\u2192'}</span>;
}

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
    <header className="sticky top-0 z-30 border-b border-border bg-[var(--header-bg)]/95 lg:bg-[var(--header-bg)]/90">
      <Container className="flex min-h-16 items-center justify-between gap-4 lg:min-h-[84px]">
        <Link className="label min-h-11 inline-flex items-center gap-2.5 lg:group lg:gap-3" href="/">
          <Image alt="" aria-hidden="true" className="h-14 w-14 object-contain lg:h-16 lg:w-16" height={1627} priority src="/brand/ecell-met-logo.png" width={1674} />
          <span className="text-[1rem] font-medium leading-none tracking-[0.01em] text-foreground lg:hidden">E-CELL MET</span>
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
          'fixed inset-0 z-50 overflow-y-auto bg-[var(--footer-bg)] transition duration-200 md:hidden',
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        )}
        id={menuId}
        inert={!open}
      >
        <Container className="safe-bottom-pad min-h-svh py-4">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <Link className="label inline-flex min-h-11 items-center gap-2.5" href="/" onClick={() => setOpen(false)}>
              <Image alt="" aria-hidden="true" className="h-14 w-14 object-contain" height={1627} src="/brand/ecell-met-logo.png" width={1674} />
              <span>E-CELL MET</span>
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
  return (
    <footer className="participant-footer border-t border-border bg-[var(--footer-bg)]">
      <Container className="py-10 sm:py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-start lg:gap-14">
          <div className="footer-brand max-w-[520px]">
            <div className="flex items-center gap-3">
              <Image alt="" aria-hidden="true" className="footer-logo h-28 w-28 object-contain" height={1627} src="/brand/ecell-met-logo.png" width={1674} />
              <p className="heading text-[2rem]">E-CELL MET</p>
            </div>
            <p className="body-small mt-2 text-muted">Recruitment {RECRUITMENT_YEAR_LABEL}</p>
            <p className="body mt-5 text-muted">
              Student-led recruitment for the people behind E-CELL&apos;s ideas, events, stories, systems and execution.
            </p>
          </div>

          <nav aria-label="E-CELL MET contact directory" className="footer-directory grid border-b border-border/70 lg:grid-cols-3 lg:gap-7">
            {footerLinks.map((link) => (
              <a
                aria-label={link.external ? `${link.label}: ${link.display} (opens in a new tab)` : `Email E-CELL MET recruitment: ${link.display}`}
                className="footer-directory-item group relative grid min-h-[126px] grid-cols-[auto_1fr_auto] gap-x-3 border-t border-border/70 py-5 focus-visible:outline-none"
                href={link.href}
                key={link.label}
                rel={link.external ? 'noopener noreferrer' : undefined}
                target={link.external ? '_blank' : undefined}
              >
                <span className="footer-directory-index eyebrow pt-0.5">{link.index}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-muted">
                    <DirectoryIcon type={link.icon} />
                    <span className="eyebrow">{link.label}</span>
                  </span>
                  <span className="footer-directory-display mt-3 block break-words text-[1.1rem] leading-tight text-foreground">{link.display}</span>
                  <span className="body-small mt-2 block leading-snug text-muted">{link.description}</span>
                </span>
                <ExternalArrow external={link.external} />
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="mx-auto flex max-w-[430px] items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-[var(--paper)] p-3 shadow-[var(--shadow-soft)]">
        <span className="body-small text-muted">{RECRUITMENT_WINDOW_LABEL}</span>
        <Button className="min-h-11 px-4 py-2 sm:min-h-11" href="/apply">
          Apply <span aria-hidden="true">&rarr;</span>
        </Button>
      </div>
    </div>
  );
}
