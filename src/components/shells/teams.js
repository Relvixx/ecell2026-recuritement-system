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

export function TeamSelectorCard({ team, selected = false, disabled = false, secondary = false, compact = false, compactDescription = false, index, className = '', onSelect }) {
  const accent = getTeamAccent(team.id);
  const interactive = typeof onSelect === 'function';
  const Component = interactive ? 'button' : 'div';

  return (
    <Component
      aria-pressed={interactive ? selected : undefined}
      className={cn(
        'relative w-full overflow-hidden rounded-[var(--radius-card)] border text-left transition duration-200',
        compact ? 'min-h-16 p-3 md:min-h-24 md:p-4' : 'p-4',
        selected ? 'border-foreground bg-[var(--team-accent)]' : 'border-border bg-[var(--color-ivory-50)]',
        secondary && 'opacity-85',
        disabled && 'cursor-not-allowed opacity-50',
        interactive && 'hover:-translate-y-0.5 hover:border-foreground',
        className
      )}
      disabled={interactive ? disabled : undefined}
      onClick={interactive ? () => onSelect(team.id) : undefined}
      style={{ '--team-accent': accent?.surface || 'var(--color-surface-muted)' }}
      type={interactive ? 'button' : undefined}
    >
      <span aria-hidden="true" className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[var(--team-accent)] opacity-45" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          {typeof index === 'number' ? <p className="body-small text-muted">{String(index + 1).padStart(2, '0')}</p> : null}
          <p className={compact ? 'body-small hidden text-muted md:block lg:text-[1rem]' : 'body-small text-muted'}>{team.tagline}</p>
          <h3 className={compact ? 'label mt-1 text-[0.98rem] md:text-[1.08rem] lg:mt-2 lg:text-[1.28rem]' : 'heading mt-1 text-[1.35rem]'}>{team.name}</h3>
        </div>
        {selected ? <span className="team-selected-indicator body-small rounded-full bg-[var(--color-ivory-50)] px-2.5 py-1">Selected</span> : null}
      </div>
      {compact && compactDescription ? <p className="body-small mt-3 hidden text-muted lg:block">{team.shortDescription}</p> : null}
      {!compact ? <p className="body-small mt-4 text-muted">{team.shortDescription}</p> : null}
    </Component>
  );
}

export function FeaturedTeamCard({ team = TEAMS[0] }) {
  const accent = getTeamAccent(team.id);

  return (
    <EditorialCard accent={accent?.surface} className="relative min-h-[320px] overflow-hidden lg:min-h-[430px] lg:p-8">
      <span aria-hidden="true" className="absolute -right-12 top-8 h-36 w-36 rounded-full border border-foreground/10" />
      <span aria-hidden="true" className="absolute bottom-8 right-10 h-px w-28 rotate-[-8deg] bg-foreground/20" />
      <Stack gap="md">
        <TeamBadge teamId={team.id} />
        <div>
          <p className="body-small text-muted">{team.tagline}</p>
          <h2 className="display-section mt-2">{team.name}</h2>
        </div>
        <p className="body-large text-muted lg:text-[1.14rem]">{team.description}</p>
        <p className="body lg:text-[1.04rem] lg:leading-[1.7]">{team.idealFor}</p>
        <Button className="lg:w-fit" href={`/apply?team=${team.id}`} variant="secondary">
          Apply for this team &#8599;
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
        <Button href={`/apply?team=${team.id}`}>Apply for this team &#8599;</Button>
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
