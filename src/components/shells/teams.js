import { TEAMS, getTeamAccent } from '@/config/teams';
import { Button, Pill } from '../ui/forms';
import { EditorialCard, Stack, cn } from '../ui/layout';

export function TeamBadge({ teamId, className = '' }) {
  const team = TEAMS.find((item) => item.id === teamId);
  const accent = getTeamAccent(teamId);

  if (!team) return null;

  return (
    <Pill accent={accent?.surface} className={className}>
      {team.name}
    </Pill>
  );
}

export function TeamSelectorCard({ team, selected = false, disabled = false, secondary = false, onSelect }) {
  const accent = getTeamAccent(team.id);
  const interactive = typeof onSelect === 'function';
  const Component = interactive ? 'button' : 'div';

  return (
    <Component
      aria-pressed={interactive ? selected : undefined}
      className={cn(
        'w-full rounded-[var(--radius-card)] border p-4 text-left transition duration-200',
        selected ? 'border-foreground bg-[var(--team-accent)]' : 'border-border bg-[var(--color-ivory-50)]',
        secondary && 'opacity-85',
        disabled && 'cursor-not-allowed opacity-50',
        interactive && 'min-h-28 hover:-translate-y-0.5 hover:border-foreground'
      )}
      disabled={interactive ? disabled : undefined}
      onClick={interactive ? () => onSelect(team.id) : undefined}
      style={{ '--team-accent': accent?.surface || 'var(--color-surface-muted)' }}
      type={interactive ? 'button' : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="body-small text-muted">{team.tagline}</p>
          <h3 className="heading mt-1 text-[1.35rem]">{team.name}</h3>
        </div>
        {selected ? <span className="label rounded-full bg-[var(--color-ivory-50)] px-3 py-1">Selected</span> : null}
      </div>
      <p className="body-small mt-4 text-muted">{team.shortDescription}</p>
    </Component>
  );
}

export function FeaturedTeamCard({ team = TEAMS[0] }) {
  const accent = getTeamAccent(team.id);

  return (
    <EditorialCard accent={accent?.surface} className="min-h-[320px]">
      <Stack gap="md">
        <TeamBadge teamId={team.id} />
        <div>
          <p className="body-small text-muted">{team.tagline}</p>
          <h2 className="display-section mt-2">{team.name}</h2>
        </div>
        <p className="body-large text-muted">{team.description}</p>
        <p className="body">{team.idealFor}</p>
        <Button href={`/apply?team=${team.id}`} variant="secondary">
          Apply for this team &rarr;
        </Button>
      </Stack>
    </EditorialCard>
  );
}

export function TeamDetailPanel({ team = TEAMS[0], onClose }) {
  return (
    <section className="rounded-[var(--radius-paper)] border border-border bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7" aria-label={`${team.name} team details`}>
      <Stack gap="lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <TeamBadge teamId={team.id} />
            <h2 className="heading mt-4">{team.name}</h2>
            <p className="body-small mt-1 text-muted">{team.tagline}</p>
          </div>
          {onClose ? (
            <button className="min-h-11 rounded-[var(--radius-control)] px-3 text-sm text-muted hover:bg-[var(--color-surface-muted)]" onClick={onClose} type="button">
              Close
            </button>
          ) : null}
        </div>
        <p className="body-large text-muted">{team.description}</p>
        <div>
          <h3 className="label">What we do</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {team.whatWeDo.map((item) => (
              <li className="body-small rounded-[var(--radius-control)] bg-[var(--color-surface-muted)] px-3 py-2" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="label">You might fit here if</h3>
          <p className="body mt-2 text-muted">{team.idealFor}</p>
        </div>
        <div>
          <h3 className="label">You may work on</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {team.mayWorkOn.map((item) => (
              <li className="body-small rounded-[var(--radius-control)] bg-[var(--color-surface-muted)] px-3 py-2" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="helper">{team.reassurance}</p>
        <Button href={`/apply?team=${team.id}`}>Apply for this team &rarr;</Button>
      </Stack>
    </section>
  );
}

export function TeamPrimitiveDemo() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <FeaturedTeamCard team={TEAMS[0]} />
      <div className="grid gap-3 sm:grid-cols-2">
        {TEAMS.slice(0, 4).map((team, index) => (
          <TeamSelectorCard key={team.id} selected={index === 0} team={team} />
        ))}
      </div>
    </div>
  );
}
