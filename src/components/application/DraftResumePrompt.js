import { Button } from '@/components/ui/forms';
import { Stack } from '@/components/ui/layout';

export function DraftResumePrompt({ onContinue, onStartOver }) {
  return (
    <div
      aria-labelledby="draft-resume-title"
      aria-modal="true"
      className="rounded-[var(--radius-paper)] border border-border bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] sm:p-6"
      role="dialog"
    >
      <Stack gap="md">
        <div>
          <p className="eyebrow text-muted">Saved draft</p>
          <h2 className="heading mt-2" id="draft-resume-title">
            Welcome back.
          </h2>
          <p className="body mt-3 text-muted">We found an unfinished application on this device.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="w-full sm:w-auto" onClick={onContinue} type="button">
            Continue draft
          </Button>
          <Button className="w-full sm:w-auto" onClick={onStartOver} type="button" variant="secondary">
            Start over
          </Button>
        </div>
      </Stack>
    </div>
  );
}
