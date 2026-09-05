import { MEDIA_PLACEHOLDERS } from '@/lib/design-system';
import { cn } from '../ui/layout';

export function EditorialPhotoFrame({ mediaKey = 'heroMain', caption, className = '', rotate = 'none' }) {
  const media = MEDIA_PLACEHOLDERS[mediaKey];
  const rotations = {
    none: '',
    left: '-rotate-1',
    right: 'rotate-1'
  };

  return (
    <figure className={cn('relative rounded-[1.75rem] border border-border bg-surface p-2 shadow-[var(--shadow-soft)]', rotations[rotate], className)}>
      <div className="aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[linear-gradient(135deg,var(--color-ivory-50),var(--color-powder-blue),var(--color-peach))]" />
      {caption || media?.label ? <MediaCaption>{caption || media.label}</MediaCaption> : null}
    </figure>
  );
}

export function TapeAccent({ className = '' }) {
  return <span aria-hidden="true" className={cn('block h-6 w-20 rotate-[-3deg] rounded-sm bg-[var(--color-butter)]/70', className)} />;
}

export function AnnotationLabel({ children, className = '' }) {
  return (
    <span className={cn('body-small inline-flex rounded-full bg-[var(--color-ivory-50)] px-3 py-1 text-muted shadow-[var(--shadow-soft)]', className)}>
      {children}
    </span>
  );
}

export function EditorialUnderline({ children, className = '' }) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      <span aria-hidden="true" className="absolute bottom-1 left-0 -z-0 h-2 w-full rounded-full bg-[var(--color-butter)]/70" />
    </span>
  );
}

export function MediaCaption({ children, className = '' }) {
  return <figcaption className={cn('body-small mt-3 text-muted', className)}>{children}</figcaption>;
}

export function IrregularPaperBlock({ children, className = '' }) {
  return (
    <div className={cn('rounded-[1.5rem_2rem_1.35rem_1.85rem] border border-border bg-[var(--color-ivory-50)] p-5 shadow-[var(--shadow-soft)]', className)}>
      {children}
    </div>
  );
}
