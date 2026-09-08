import { MEDIA_PLACEHOLDERS } from '@/lib/design-system';
import { cn } from './layout';

export function MediaPlaceholder({ mediaKey = 'heroMain', className = '', caption }) {
  const media = MEDIA_PLACEHOLDERS[mediaKey];
  const label = caption || media?.label || 'E-CELL media placeholder';

  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-[1.75rem] border border-border bg-[var(--media-frame)]',
        className
      )}
    >
      <div className="aspect-[4/3] min-h-52 w-full bg-[linear-gradient(135deg,var(--paper),var(--color-powder-blue),var(--color-peach))]" />
      <figcaption className="absolute bottom-4 left-4 rounded-full bg-[var(--paper)] px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-soft)]">
        {label}
      </figcaption>
    </figure>
  );
}
