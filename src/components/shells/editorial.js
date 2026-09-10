import Image from 'next/image';
import { HERO_VIDEO, MEDIA_PLACEHOLDERS } from '@/lib/design-system';
import { cn } from '../ui/layout';

export function EditorialPhotoFrame({ mediaKey = 'heroMain', caption, captionMeta, className = '', mediaClassName = '', rotate = 'none' }) {
  const media = MEDIA_PLACEHOLDERS[mediaKey];
  const rotations = {
    none: '',
    left: '-rotate-1',
    right: 'rotate-1'
  };

  return (
    <figure className={cn('relative rounded-[1.75rem] border border-border bg-surface p-2 shadow-[var(--shadow-soft)]', rotations[rotate], className)}>
      <div className={cn('relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[linear-gradient(135deg,var(--paper),var(--color-powder-blue),var(--color-peach))]', mediaClassName)}>
        {media?.path ? (
          <Image
            alt={media.alt || ''}
            className="object-cover"
            fill
            priority={media.priority}
            sizes={media.sizes}
            src={media.path}
            style={{ objectPosition: media.objectPosition }}
          />
        ) : null}
      </div>
      {caption ? <MediaCaption meta={captionMeta}>{caption}</MediaCaption> : null}
    </figure>
  );
}

export function EditorialVideoFrame({ className = '', mediaClassName = '' }) {
  return (
    <figure className={cn('relative rounded-[1.75rem] border border-border bg-surface p-2 shadow-[var(--shadow-soft)]', className)}>
      <div className={cn('relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[var(--media-frame)]', mediaClassName)}>
        <Image
          alt=""
          aria-hidden="true"
          className="hero-video-poster object-cover"
          fill
          priority
          sizes={HERO_VIDEO.sizes}
          src={HERO_VIDEO.posterPath}
          style={{ objectPosition: HERO_VIDEO.objectPosition }}
        />
        <video
          aria-hidden="true"
          autoPlay
          className="hero-primary-video absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          poster={HERO_VIDEO.posterPath}
          preload="metadata"
          style={{ objectPosition: HERO_VIDEO.objectPosition }}
          tabIndex={-1}
        >
          <source src={HERO_VIDEO.path} type="video/mp4" />
        </video>
      </div>
    </figure>
  );
}

export function TapeAccent({ className = '' }) {
  return <span aria-hidden="true" className={cn('block h-6 w-20 rotate-[-3deg] rounded-sm bg-[var(--accent-soft)]/70', className)} />;
}

export function AnnotationLabel({ children, className = '' }) {
  return (
    <span className={cn('body-small inline-flex rounded-full bg-[var(--paper)] px-3 py-1 text-muted shadow-[var(--shadow-soft)]', className)}>
      {children}
    </span>
  );
}

export function EditorialUnderline({ children, className = '' }) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      <span aria-hidden="true" className="absolute bottom-1 left-0 -z-0 h-2 w-full rounded-full bg-[var(--accent-soft)]/70" />
    </span>
  );
}

export function MediaCaption({ children, className = '', meta }) {
  return (
    <figcaption className={cn('body-small mt-3 text-muted', className)}>
      {meta ? <span className="media-caption-meta">{meta}</span> : null}
      <span className="media-caption-copy">{children}</span>
    </figcaption>
  );
}

export function IrregularPaperBlock({ children, className = '' }) {
  return (
    <div className={cn('rounded-[1.5rem_2rem_1.35rem_1.85rem] border border-border bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)]', className)}>
      {children}
    </div>
  );
}
