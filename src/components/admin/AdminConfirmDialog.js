'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components';

export default function AdminConfirmDialog({ title, children, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKeyDown = (event) => event.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(40,38,38,0.28)] p-4" role="presentation">
      <div aria-modal="true" className="w-full max-w-[440px] rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]" role="dialog" aria-labelledby="admin-confirm-title">
        <h2 className="heading" id="admin-confirm-title">{title}</h2>
        <p className="body mt-3 text-muted">{children}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button className="sm:min-w-28" onClick={onCancel} ref={cancelRef} variant="secondary">Cancel</Button>
          <Button className={danger ? 'bg-[var(--color-error)] text-white hover:opacity-90' : ''} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
