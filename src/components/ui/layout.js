export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function PageShell({ children, className = '', recruitmentTheme = 'paper', variant = 'public' }) {
  const themeProps = variant === 'admin' ? {} : { 'data-recruitment-theme': recruitmentTheme };

  return (
    <main
      className={cn(
        'min-h-screen bg-background text-foreground',
        variant === 'admin' && 'bg-[var(--color-ivory-100)]',
        className
      )}
      {...themeProps}
    >
      {children}
    </main>
  );
}

export function Container({ children, className = '', width = 'default' }) {
  const widths = {
    default: 'max-w-[1280px]',
    copy: 'max-w-[680px]',
    form: 'max-w-[860px]',
    faq: 'max-w-[900px]',
    admin: 'max-w-[1440px]'
  };

  return (
    <div className={cn('mx-auto w-full px-4 sm:px-8 lg:px-14 xl:px-[72px]', widths[width], className)}>
      {children}
    </div>
  );
}

export function Section({ children, className = '', tone = 'neutral', spacing = 'major', ...props }) {
  const tones = {
    neutral: '',
    surface: 'bg-[var(--footer-bg)]',
    blush: 'bg-[var(--color-blush)]/35',
    sage: 'bg-[var(--color-sage)]/35'
  };

  const spacings = {
    compact: 'py-14 sm:py-20 lg:py-24',
    major: 'py-20 sm:py-28 lg:py-36',
    hero: 'py-10 sm:py-16 lg:py-20'
  };

  return <section className={cn(tones[tone], spacings[spacing], className)} {...props}>{children}</section>;
}

export function Stack({ children, className = '', gap = 'md' }) {
  const gaps = {
    xs: 'space-y-2',
    sm: 'space-y-3',
    md: 'space-y-5',
    lg: 'space-y-8',
    xl: 'space-y-12'
  };

  return <div className={cn(gaps[gap], className)}>{children}</div>;
}

export function PaperCard({ children, className = '', accent, as: Component = 'div' }) {
  return (
    <Component
      className={cn(
        'rounded-[var(--radius-paper)] border border-border bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7',
        className
      )}
      style={accent ? { '--paper-accent': accent, borderColor: 'color-mix(in srgb, var(--paper-accent) 55%, var(--border-soft))' } : undefined}
    >
      {children}
    </Component>
  );
}

export function EditorialCard({ children, className = '', accent, as: Component = 'div' }) {
  return (
    <Component
      className={cn('rounded-[var(--radius-card)] border border-border bg-[var(--paper)] p-5 sm:p-6', className)}
      style={accent ? { background: `color-mix(in srgb, ${accent} 28%, var(--paper))` } : undefined}
    >
      {children}
    </Component>
  );
}

export function Eyebrow({ children, className = '' }) {
  return <p className={cn('eyebrow text-muted', className)}>{children}</p>;
}
