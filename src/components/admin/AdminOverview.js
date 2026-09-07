import { EmptyState, MetricCard, PaperCard, SkeletonBlock } from '@/components';
import { getTeamAccent, getTeamById } from '@/config/teams';
import { STATUS_COPY, STATUS_TOKENS } from '@/lib/design-system';

const years = { first_year: 'First Year', second_year: 'Second Year', third_year: 'Third Year' };
const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not provided';
const displayTeam = (id) => getTeamById(id)?.name || id || 'Not provided';

export default function AdminOverview({ stats, recent, loading, error, onRetry, onSelect, onViewCandidates }) {
  if (loading && !stats) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 7 }, (_, i) => <SkeletonBlock className="h-32" key={i} />)}</div>;
  if (error) return <EmptyState title="Couldn't load overview." description={error} action={<button className="min-h-11 rounded-[var(--radius-control)] border border-border bg-surface px-4 text-sm font-medium" onClick={onRetry} type="button">Try again</button>} />;
  const statusStats = stats?.statusStats || {};
  const metrics = [['Total Applications', stats?.total || 0, 'var(--color-powder-blue)'], ...Object.keys(STATUS_COPY).map((id) => [STATUS_COPY[id].label, statusStats[id] || 0, STATUS_TOKENS[id]])];
  const teamCounts = stats?.teamStats || {};
  const maxTeam = Math.max(1, ...Object.values(teamCounts));
  const yearRows = stats?.yearStats || [];
  return <div className="admin-overview grid gap-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, accent], index) => <MetricCard accent={accent} className={index === 0 ? 'admin-total-metric' : ''} key={label} label={label} value={value} />)}</div>
    <div className="grid items-start gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <PaperCard><div className="flex items-baseline justify-between gap-4"><h2 className="heading">Applications by team</h2><span className="body-small hidden text-muted sm:inline">2026-27</span></div><div className="mt-6 grid gap-4">{Object.keys(teamCounts).map((teamId) => <button className="grid gap-2 rounded-[var(--radius-control)] px-1 py-1 text-left transition hover:bg-[var(--color-surface-muted)] focus-visible:bg-[var(--color-surface-muted)]" key={teamId} onClick={() => onViewCandidates({ team: teamId })} type="button"><span className="flex justify-between gap-4 text-sm"><span>{displayTeam(teamId)}</span><span className="text-muted">{teamCounts[teamId] || 0}</span></span><span className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]"><span className="block h-full rounded-full" style={{ background: getTeamAccent(teamId)?.surface || 'var(--color-lavender)', width: `${((teamCounts[teamId] || 0) / maxTeam) * 100}%` }} /></span></button>)}</div></PaperCard>
      <PaperCard><h2 className="heading">Applications by year</h2><div className="mt-6 grid gap-3">{yearRows.map((row) => <div className="flex justify-between border-b border-border pb-3 text-sm" key={row._id}><span>{years[row._id] || row._id}</span><span className="font-medium">{row.count}</span></div>)}</div></PaperCard>
    </div>
    <PaperCard><div className="flex flex-wrap items-baseline justify-between gap-4"><h2 className="heading">Recent applications</h2><button className="text-sm font-medium underline decoration-[var(--color-butter)] decoration-2 underline-offset-4 hover:text-foreground" onClick={() => onViewCandidates({})} type="button">View candidates</button></div>{recent?.length ? <div className="mt-5 divide-y divide-[var(--color-border)]">{recent.map((candidate) => <button className="group grid min-h-16 w-full gap-1 rounded-[var(--radius-control)] px-2 py-3 text-left transition hover:bg-[var(--color-surface-muted)] focus-visible:bg-[var(--color-surface-muted)] sm:grid-cols-[1fr_auto_auto_1.5rem] sm:items-center sm:gap-5" data-candidate-id={candidate._id} key={candidate._id} onClick={() => onSelect(candidate._id)} type="button"><span><span className="block text-sm font-medium group-hover:underline group-hover:decoration-[var(--color-butter)] group-hover:decoration-2 group-hover:underline-offset-4">{candidate.fullName}</span><span className="body-small text-muted">{candidate.applicationCode}</span></span><span className="text-sm">{displayTeam(candidate.primaryTeam)}</span><span className="body-small text-muted">{formatDate(candidate.submittedAt)}</span><span aria-hidden="true" className="hidden text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground sm:block">&rarr;</span></button>)}</div> : <div className="mt-5"><EmptyState /></div>}</PaperCard>
  </div>;
}
