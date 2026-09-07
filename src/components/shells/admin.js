'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Container, PageShell, Stack, cn } from '../ui/layout';

const adminNav = [
  { id: 'overview', label: 'Overview' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'teams', label: 'Teams' },
  { id: 'analytics', label: 'Analytics' }
];

export function AdminShell({ children, title = 'Recruitment 2026-27', subtitle, actions, adminSlot, logoutSlot, activeView = 'overview', onNavigate }) {
  return (
    <PageShell className="admin-workspace" variant="admin">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[248px_1fr]">
        <AdminSidebar activeView={activeView} adminSlot={adminSlot} logoutSlot={logoutSlot} onNavigate={onNavigate} />
        <div className="min-w-0">
          <AdminMobileNav activeView={activeView} adminSlot={adminSlot} logoutSlot={logoutSlot} onNavigate={onNavigate} />
          <main className="py-6 lg:py-8">
            <Container width="admin">
              <Stack gap="md">
                <AdminHeader actions={actions} subtitle={subtitle} title={title} />
                {children}
              </Stack>
            </Container>
          </main>
        </div>
      </div>
    </PageShell>
  );
}

export function AdminSidebar({ activeView = 'overview', adminSlot = 'Admin', logoutSlot, onNavigate }) {
  return (
    <aside className="hidden border-r border-border bg-[var(--color-ivory-50)] p-6 lg:flex lg:flex-col lg:justify-between">
      <Stack gap="lg">
        <Link className="admin-sidebar-brand inline-flex min-h-11 items-center gap-3" href="/">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--color-sage)]" />
          <span className="grid gap-0.5">
            <span className="text-[0.98rem] font-medium leading-none tracking-[0.03em] text-foreground">E-CELL MET</span>
            <span className="text-[0.72rem] leading-none text-muted">Recruitment 2026–27</span>
          </span>
        </Link>
        <nav aria-label="Admin workspace" className="grid gap-1">
          {adminNav.map((item) => (
            <button
              aria-current={activeView === item.id ? 'page' : undefined}
              className={cn(
                'min-h-11 rounded-[var(--radius-control)] px-3 py-2 text-left text-sm text-muted transition hover:bg-[var(--color-surface-muted)] hover:text-foreground focus-visible:bg-[var(--color-surface-muted)] focus-visible:text-foreground',
                activeView === item.id && 'bg-[var(--color-surface-muted)] text-foreground'
              )}
              onClick={() => onNavigate?.(item.id)}
              key={item.id}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </Stack>
      <div className="grid gap-3 border-t border-border pt-5">
        <div>
          <p className="helper">Signed in as</p>
          <p className="label mt-1 break-words">{adminSlot}</p>
        </div>
        {logoutSlot || <button className="min-h-11 rounded-[var(--radius-control)] text-left text-sm text-muted hover:text-foreground" type="button">Logout</button>}
      </div>
    </aside>
  );
}

export function AdminMobileNav({ activeView = 'overview', adminSlot = 'Admin', logoutSlot, onNavigate }) {
  const activeTabRef = useRef(null);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeView]);

  return (
    <header className="admin-mobile-header border-b border-border bg-[var(--color-ivory-50)] lg:hidden">
      <div className="px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <Link className="admin-mobile-brand inline-flex min-h-11 items-center gap-3" href="/">
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-sage)]" />
            <span className="grid gap-0.5">
              <span className="text-[0.95rem] font-medium leading-none tracking-[0.03em] text-foreground">E-CELL MET</span>
              <span className="text-[0.72rem] leading-none text-muted">Recruitment 2026-27</span>
            </span>
          </Link>
          <div className="admin-mobile-logout shrink-0">
            {logoutSlot || <button className="min-h-11 rounded-[var(--radius-control)] text-sm text-muted hover:text-foreground" type="button">Logout</button>}
          </div>
        </div>
        <div className="mt-2 border-t border-border pt-2">
          <div className="min-w-0">
            <p className="helper">Signed in as</p>
            <p className="label mt-0.5 truncate">{adminSlot}</p>
          </div>
        </div>
      </div>
      <nav aria-label="Admin mobile workspace" className="admin-mobile-tabs flex gap-2 overflow-x-auto px-4 pb-3">
        {adminNav.map((item) => (
          <button
            aria-current={activeView === item.id ? 'page' : undefined}
            className={cn(
              'min-h-11 shrink-0 rounded-[var(--radius-control)] border border-border bg-surface px-4 py-2 text-sm transition hover:bg-[var(--color-surface-muted)] hover:text-foreground focus-visible:bg-[var(--color-surface-muted)] focus-visible:text-foreground',
              activeView === item.id ? 'text-foreground shadow-[var(--shadow-soft)]' : 'text-muted'
            )}
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            ref={activeView === item.id ? activeTabRef : null}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export function AdminHeader({ title, subtitle, actions }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow text-muted">Recruitment 2026-27</p>
        <h1 className="heading mt-2">{title}</h1>
        {subtitle ? <p className="body mt-2 max-w-[680px] text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

export function MetricCard({ label, value = '--', accent = 'var(--color-powder-blue)', className = '' }) {
  return (
    <article className={cn('rounded-[var(--radius-card)] border border-border bg-surface p-5', className)} style={{ borderTop: `5px solid ${accent}` }}>
      <p className="body-small text-muted">{label}</p>
      <p className="heading mt-3">{value}</p>
    </article>
  );
}

export function EmptyState({ title = 'No applications yet.', description = 'New candidates will appear here once recruitment opens.', action }) {
  return (
    <section className="rounded-[var(--radius-paper)] border border-dashed border-border bg-[var(--color-ivory-50)] p-6 text-center sm:p-10">
      <h2 className="heading">{title}</h2>
      <p className="body mx-auto mt-3 max-w-[520px] text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}

export function SkeletonBlock({ className = '' }) {
  return <div aria-hidden="true" className={cn('min-h-11 animate-pulse rounded-[var(--radius-control)] bg-[var(--color-surface-muted)]', className)} />;
}
