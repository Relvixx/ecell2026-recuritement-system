import Link from 'next/link';
import { cn } from './layout';

const buttonVariants = {
  primary: 'bg-foreground text-[#fffdf9] visited:text-[#fffdf9] hover:bg-[#3a3632] hover:text-[#fffdf9] focus-visible:text-[#fffdf9]',
  secondary: 'border border-border bg-surface text-foreground visited:text-foreground hover:bg-[var(--color-surface-muted)]',
  ghost: 'text-foreground visited:text-foreground hover:bg-[var(--color-surface-muted)]'
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  href,
  style,
  type = 'button',
  ...props
}) {
  const primaryStyle = variant === 'primary' ? { color: 'var(--color-ivory-50)' } : null;
  const resolvedStyle = primaryStyle || style ? { ...primaryStyle, ...style } : undefined;
  const classes = cn(
    'group inline-flex min-h-11 items-center justify-center gap-2 rounded-[1.15rem] px-5 py-3 text-center text-sm font-medium transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-55 sm:min-h-[52px] sm:px-6',
    buttonVariants[variant],
    className
  );

  const content = <span>{isLoading ? 'Loading...' : children}</span>;

  if (href) {
    return (
      <Link className={classes} href={href} style={resolvedStyle} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || isLoading} style={resolvedStyle} type={type} {...props}>
      {content}
    </button>
  );
}

export function FieldError({ id, children, className = '' }) {
  if (!children) return null;
  return (
    <p className={cn('body-small mt-2 text-error', className)} id={id} role="alert">
      {children}
    </p>
  );
}

export function FormField({ label, helper, error, id, children, required = false, className = '' }) {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helper ? `${id}-helper` : undefined;

  return (
    <div className={className}>
      <label className="label mb-2 block text-foreground" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {typeof children === 'function'
        ? children({
            id,
            'aria-invalid': Boolean(error),
            'aria-describedby': [helperId, errorId].filter(Boolean).join(' ') || undefined
          })
        : children}
      {helper ? (
        <p className="helper mt-2" id={helperId}>
          {helper}
        </p>
      ) : null}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

const controlClasses =
  'min-h-11 w-full rounded-[var(--radius-control)] border bg-[var(--color-ivory-50)] px-4 py-3 text-foreground placeholder:text-muted/70 transition duration-200 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20 disabled:cursor-not-allowed disabled:opacity-60';

export function Input({ className = '', error = false, ...props }) {
  return (
    <input
      className={cn(controlClasses, error && 'border-error bg-[var(--color-error-surface)]/35', !error && 'border-border', className)}
      {...props}
    />
  );
}

export function Textarea({ className = '', error = false, rows = 5, ...props }) {
  return (
    <textarea
      className={cn(
        controlClasses,
        'min-h-32 resize-y leading-relaxed',
        error && 'border-error bg-[var(--color-error-surface)]/35',
        !error && 'border-border',
        className
      )}
      rows={rows}
      {...props}
    />
  );
}

export function Select({ className = '', error = false, children, ...props }) {
  return (
    <select
      className={cn(controlClasses, 'appearance-auto', error && 'border-error bg-[var(--color-error-surface)]/35', !error && 'border-border', className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function Checkbox({ id, label, helper, className = '', ...props }) {
  return (
    <div className={cn('flex gap-3', className)}>
      <input
        className="mt-1 h-5 w-5 rounded border-border text-foreground focus:ring-focus"
        id={id}
        type="checkbox"
        {...props}
      />
      <label className="label block cursor-pointer" htmlFor={id}>
        {label}
        {helper ? <span className="helper mt-1 block font-normal">{helper}</span> : null}
      </label>
    </div>
  );
}

export function Pill({ children, className = '', accent }) {
  return (
    <span
      className={cn('inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground', className)}
      style={accent ? { background: `color-mix(in srgb, ${accent} 42%, var(--color-ivory-50))` } : undefined}
    >
      {children}
    </span>
  );
}
