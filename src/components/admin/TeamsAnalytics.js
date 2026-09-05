import { PaperCard, EmptyState } from '@/components';
import { getTeamAccent, getTeamById, TEAMS } from '@/config/teams';
import { STATUS_COPY } from '@/lib/design-system';

const years = { first_year: 'First Year', second_year: 'Second Year', third_year: 'Third Year' };
const BarGroup = ({ title, rows, label }) => <PaperCard><h2 className="heading">{title}</h2><div className="mt-5 grid gap-3">{rows?.length ? rows.map((row) => <div className="flex items-center justify-between gap-4 border-b border-border pb-3 text-sm" key={row._id}><span className="min-w-0 truncate">{label(row._id)}</span><span className="font-medium">{row.count}</span></div>) : <p className="body-small text-muted">No applications yet.</p>}</div></PaperCard>;

export function TeamsOverview({ stats, onTeam }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{TEAMS.map((team) => { const total = stats?.teamStats?.[team.id] || 0; return <button className="rounded-[var(--radius-card)] border border-border bg-surface p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]" key={team.id} onClick={() => onTeam(team.id)} style={{ borderTopColor: getTeamAccent(team.id)?.surface }} type="button"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-muted">Team {String(TEAMS.indexOf(team) + 1).padStart(2, '0')}</p><h2 className="heading mt-2">{team.name}</h2></div><span className="grid h-12 w-12 place-items-center rounded-full text-lg" style={{ background: getTeamAccent(team.id)?.surface }}>{total}</span></div><div className="mt-6 grid grid-cols-2 gap-3 text-sm text-muted"><span>Total applications <b className="block text-foreground">{total}</b></span><span>Current status <b className="block text-foreground">See candidates</b></span></div></button>; })}</div>;
}

export function RecruitmentAnalytics({ stats }) {
  if (!stats) return <EmptyState title="Analytics unavailable." description="Statistics will appear once the workspace loads recruitment data." />;
  const statusRows = Object.keys(STATUS_COPY).map((id) => ({ _id: id, count: stats.statusStats?.[id] || 0 }));
  const teamRows = TEAMS.map((team) => ({ _id: team.id, count: stats.teamStats?.[team.id] || 0 }));
  return <div className="grid gap-6 md:grid-cols-2"><BarGroup label={(id) => getTeamById(id)?.name || id} rows={teamRows} title="Applications by team" /><BarGroup label={(id) => years[id] || id} rows={stats.yearStats} title="Applications by year" /><BarGroup label={(id) => id} rows={stats.branchStats} title="Applications by branch" /><BarGroup label={(id) => STATUS_COPY[id]?.label || id} rows={statusRows} title="Applications by status" /></div>;
}
