'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
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

  useEffect(() => {
    onMenuChange?.(open);
    window.dispatchEvent(new CustomEvent('participant-menu-change', { detail: { open } }));
  }, [onMenuChange, open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link className="label min-h-11 inline-flex items-center" href="/">
          E-CELL MET
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted md:flex">
          {desktopLinks.map((link) => (
            <a className="min-h-11 inline-flex items-center hover:text-foreground" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button className="min-h-11 sm:min-h-11" href="/apply">
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
        className={cn(
          'grid border-b border-border bg-[var(--color-lavender)]/45 transition-[grid-template-rows,opacity] duration-200 md:hidden',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
        id={menuId}
      >
        <div className="overflow-hidden">
          <Container className="safe-bottom-pad py-6">
            <nav aria-label="Mobile primary" className="flex flex-col gap-2">
              {mobileLinks.map((link) => (
                <a
                  className="heading min-h-12 rounded-[var(--radius-control)] px-2 py-2"
                  href={link.href}
                  key={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button className="mt-4 w-full" href="/apply" onClick={() => setOpen(false)}>
                Start Application <span className="arrow-shift" aria-hidden="true">&#8599;</span>
              </Button>
            </nav>
          </Container>
        </div>
      </div>
    </header>
  );
}

export function ParticipantFooter() {
  const footerLinks = ['Instagram', 'Website', 'Contact'];

  return (
    <footer className="border-t border-border bg-[var(--color-ivory-100)]">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="label">E-CELL MET</p>
            <p className="body-small mt-2 text-muted">Recruitment 2026&ndash;27</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm text-muted">
            {footerLinks.map((label) => (
              <span className="min-h-11 inline-flex items-center" key={label}>
                {label}
              </span>
            ))}
          </nav>
        </div>
        <p className="body-small mt-10 text-muted">Built with care by E-CELL MET.</p>
      </Container>
    </footer>
  );
}

export function MobileStickyApply({ hidden = false, className = '' }) {
  if (hidden) return null;

  return (
    <div className={cn('fixed inset-x-0 bottom-0 z-20 px-4 pb-[calc(1rem+var(--safe-area-bottom))] md:hidden', className)}>
      <div className="mx-auto flex max-w-[430px] items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-[var(--color-ivory-50)] p-3 shadow-[var(--shadow-soft)]">
        <span className="body-small text-muted">Recruitment open</span>
        <Button className="min-h-11 px-4 py-2 sm:min-h-11" href="/apply">
          Apply <span aria-hidden="true">&rarr;</span>
        </Button>
      </div>
    </div>
  );
}
