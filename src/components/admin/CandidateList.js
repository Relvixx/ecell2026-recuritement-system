'use client';

import { useEffect, useState } from 'react';
import { Button, EmptyState, Input, Select, SkeletonBlock } from '@/components';
import { getTeamById, TEAMS } from '@/config/teams';
import { STATUS_COPY, STATUS_TOKENS } from '@/lib/design-system';

const years = { first_year: 'First Year', second_year: 'Second Year', third_year: 'Third Year' };
const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not provided';
const teamName = (id) => getTeamById(id)?.name || id || 'Not provided';

function isNestedInteractiveClick(event) {
  return Boolean(event.target.closest('button, a, input, select, textarea'));
}

export default function CandidateList({ data, loading, error, filters, setFilter, onRetry, onSelect, onExport }) {
  const [searchDraft, setSearchDraft] = useState(filters.search || '');

  useEffect(() => { setSearchDraft(filters.search || ''); }, [filters.search]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDraft !== (filters.search || '')) setFilter('search', searchDraft);
    }, 320);
    return () => clearTimeout(timer);
  }, [searchDraft, filters.search, setFilter]);

  const hasFilters = Object.values(filters).some((value) => value && value !== 'newest' && value !== 1);
  const statusTabs = [{ id: '', label: 'All' }, ...Object.entries(STATUS_COPY).map(([id, copy]) => ({ id, label: copy.label }))];
  const applications = data?.applications || [];
  const page = data?.pagination?.page || 1;
  const totalPages = data?.pagination?.totalPages || 1;
  const countLabel = `${data?.total || 0} ${data?.total === 1 ? 'candidate' : 'candidates'}`;
  const clear = () => {
    ['search', 'status', 'team', 'yearOfStudy', 'branch'].forEach((key) => setFilter(key, ''));
    setFilter('sort', 'newest');
    setFilter('page', 1);
  };
  const activateRowFromKey = (event, candidateId) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelect(candidateId);
  };

  return (
    <div className="admin-candidates-view grid gap-4">
      <div className="admin-candidates-toolbar flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="body text-muted">{countLabel}</p>
          <label className="sr-only" htmlFor="candidate-search">Search candidates</label>
          <Input
            className="mt-3 min-w-0 xl:w-[460px]"
            id="candidate-search"
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search by name, email, phone or Application ID"
            value={searchDraft}
          />
        </div>
        <div className="admin-candidate-actions flex flex-wrap gap-3">
          <Button onClick={onExport} variant="secondary">Export CSV</Button>
          {hasFilters ? <Button onClick={clear} variant="ghost">Clear filters</Button> : null}
        </div>
      </div>

      <div className="admin-status-tabs flex gap-2 overflow-x-auto border-b border-border pb-2" role="tablist" aria-label="Filter by status">
        {statusTabs.map((tab) => (
          <button
            aria-selected={(filters.status || '') === tab.id}
            className={`min-h-11 shrink-0 border-b-2 px-2 text-sm transition ${((filters.status || '') === tab.id) ? 'border-foreground text-foreground' : 'border-transparent text-muted hover:text-foreground'}`}
            key={tab.id}
            onClick={() => {
              setFilter('status', tab.id);
              setFilter('page', 1);
            }}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-filter-row grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Select aria-label="Filter by team" onChange={(event) => setFilter('team', event.target.value)} value={filters.team || ''}>
          <option value="">All teams</option>
          {TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
        </Select>
        <Select aria-label="Filter by year" onChange={(event) => setFilter('yearOfStudy', event.target.value)} value={filters.yearOfStudy || ''}>
          <option value="">All years</option>
          {Object.entries(years).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </Select>
        <Input aria-label="Filter by branch" onChange={(event) => setFilter('branch', event.target.value)} placeholder="Branch" value={filters.branch || ''} />
        <Select aria-label="Sort candidates" onChange={(event) => setFilter('sort', event.target.value)} value={filters.sort || 'newest'}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name_asc">Name A-Z</option>
        </Select>
      </div>

      {error ? (
        <EmptyState title="Couldn't load candidates." description={error} action={<Button onClick={onRetry} variant="secondary">Try again</Button>} />
      ) : loading ? (
        <div className="grid gap-3">{Array.from({ length: 6 }, (_, i) => <SkeletonBlock className="h-20" key={i} />)}</div>
      ) : applications.length === 0 ? (
        <EmptyState title={hasFilters ? 'No candidates match these filters.' : 'No applications yet.'} description={hasFilters ? 'Try changing or clearing your filters.' : 'New candidates will appear here once recruitment opens.'} action={hasFilters ? <Button onClick={clear} variant="secondary">Clear filters</Button> : null} />
      ) : (
        <>
          <div className="admin-candidate-table hidden overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface md:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[var(--color-surface-muted)]">
                <tr className="text-sm text-muted">
                  <th className="px-5 py-4 font-medium">Candidate</th>
                  <th className="px-4 py-4 font-medium">Year</th>
                  <th className="px-4 py-4 font-medium">Primary team</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {applications.map((candidate) => (
                  <tr
                    aria-label={`Open ${candidate.fullName || 'candidate'} details`}
                    className="group cursor-pointer transition hover:bg-[var(--color-surface-muted)] focus:bg-[var(--color-surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/25"
                    data-candidate-id={candidate._id}
                    key={candidate._id}
                    onClick={(event) => {
                      if (!isNestedInteractiveClick(event)) onSelect(candidate._id);
                    }}
                    onKeyDown={(event) => activateRowFromKey(event, candidate._id)}
                    role="button"
                    tabIndex={0}
                  >
                    <td className="px-5 py-3.5">
                      <span className="block font-medium group-hover:underline group-hover:decoration-[var(--color-butter)] group-hover:decoration-2 group-hover:underline-offset-4">{candidate.fullName}</span>
                      <span className="body-small text-muted">{candidate.applicationCode}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm">{years[candidate.yearOfStudy] || candidate.yearOfStudy}</td>
                    <td className="px-4 py-3.5 text-sm">{teamName(candidate.primaryTeam)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={candidate.status} /></td>
                    <td className="px-5 py-3.5 text-sm text-muted">{formatDate(candidate.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-candidate-mobile-list grid gap-3 md:hidden">
            {applications.map((candidate) => (
              <button className="admin-candidate-mobile-card grid min-h-28 gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 text-left transition hover:bg-[var(--color-surface-muted)] focus-visible:bg-[var(--color-surface-muted)]" data-candidate-id={candidate._id} key={candidate._id} onClick={() => onSelect(candidate._id)} type="button">
                <div className="admin-candidate-card-header flex items-start justify-between gap-3">
                  <span className="admin-candidate-name min-w-0">
                    <span className="block font-medium">{candidate.fullName}</span>
                    <span className="body-small text-muted">{candidate.applicationCode}</span>
                  </span>
                  <StatusBadge status={candidate.status} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  <span>{teamName(candidate.primaryTeam)}</span>
                  <span>{years[candidate.yearOfStudy] || candidate.yearOfStudy}</span>
                  <span>{formatDate(candidate.submittedAt)}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <span className="body-small text-muted">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button disabled={!data?.pagination?.hasPreviousPage} onClick={() => setFilter('page', page - 1)} variant="secondary">Previous</Button>
              <Button disabled={!data?.pagination?.hasNextPage} onClick={() => setFilter('page', page + 1)} variant="secondary">Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="admin-candidate-status inline-flex min-h-8 items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium" style={{ background: STATUS_TOKENS[status] || 'var(--color-surface-muted)' }}>
      {STATUS_COPY[status]?.label || status || 'Unknown'}
    </span>
  );
}
