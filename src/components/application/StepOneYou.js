import { BRANCH_OPTIONS, YEAR_OPTIONS } from '@/config/application-options';
import { FieldError, FormField, Input, Select, Stack } from '@/components';
import { cn } from '@/components/ui/layout';

export const STEP_ONE_FORM_ID = 'application-step-one';

export function StepOneYou({ data, errors, touched, onBlur, onChange, onSubmit, autosaveStatus }) {
  const visibleError = field => (touched[field] ? errors[field] : undefined);
  const radioError = visibleError('hasOtherClubs');

  return (
    <form className="motion-settle application-step-one space-y-8" id={STEP_ONE_FORM_ID} noValidate onSubmit={onSubmit}>
      <Stack gap="sm">
        <p className="eyebrow text-muted">E-CELL MET / Recruitment 2026-27</p>
        <h1 className="display-section">Tell us about yourself</h1>
        <p className="body-large text-muted">Just the basics first.</p>
      </Stack>

      <div className="grid gap-5 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-6">
        <FormField error={visibleError('fullName')} id="fullName" label="Full name" required>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              autoComplete="name"
              error={Boolean(visibleError('fullName'))}
              onBlur={() => onBlur('fullName')}
              onChange={(event) => onChange('fullName', event.target.value)}
              placeholder="Your name"
              type="text"
              value={data.fullName}
            />
          )}
        </FormField>

        <FormField error={visibleError('email')} id="email" label="Email address" required>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              autoComplete="email"
              error={Boolean(visibleError('email'))}
              inputMode="email"
              onBlur={() => onBlur('email')}
              onChange={(event) => onChange('email', event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={data.email}
            />
          )}
        </FormField>

        <FormField
          error={visibleError('whatsappNumber')}
          helper="We'll use this for recruitment communication."
          id="whatsappNumber"
          label="WhatsApp number"
          required
        >
          {(fieldProps) => (
            <Input
              {...fieldProps}
              autoComplete="tel"
              error={Boolean(visibleError('whatsappNumber'))}
              inputMode="tel"
              onBlur={() => onBlur('whatsappNumber')}
              onChange={(event) => onChange('whatsappNumber', event.target.value)}
              placeholder="+91 9876543210"
              type="tel"
              value={data.whatsappNumber}
            />
          )}
        </FormField>

        <FormField error={visibleError('branch')} id="branch" label="Branch / Department" required>
          {(fieldProps) => (
            <Select
              {...fieldProps}
              error={Boolean(visibleError('branch'))}
              onBlur={() => onBlur('branch')}
              onChange={(event) => onChange('branch', event.target.value)}
              value={data.branch}
            >
              <option value="">Select your branch</option>
              {BRANCH_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField error={visibleError('yearOfStudy')} id="yearOfStudy" label="Year of study" required>
          {(fieldProps) => (
            <Select
              {...fieldProps}
              error={Boolean(visibleError('yearOfStudy'))}
              onBlur={() => onBlur('yearOfStudy')}
              onChange={(event) => onChange('yearOfStudy', event.target.value)}
              value={data.yearOfStudy}
            >
              <option value="">Select your year</option>
              {YEAR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <fieldset className="sm:col-span-2 lg:col-span-1">
          <legend className="label mb-2 text-foreground">Part of another club? <span aria-hidden="true">*</span></legend>
          <div className="grid grid-cols-2 gap-3" aria-describedby={radioError ? 'hasOtherClubs-error' : undefined}>
            {[
              { value: true, label: 'Yes' },
              { value: false, label: 'No' }
            ].map(option => {
              const selected = data.hasOtherClubs === option.value;
              return (
                <label
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-control)] border px-4 py-3 transition duration-200 lg:min-h-[54px]',
                    selected
                      ? 'border-foreground bg-[var(--accent-soft)]/50 text-foreground'
                      : 'border-border bg-[var(--paper)] text-muted hover:bg-[var(--surface-muted)]'
                  )}
                  key={option.label}
                >
                  <span className="label">{option.label}</span>
                  <span className="body-small text-muted">{selected ? 'Selected' : 'Choose'}</span>
                  <input
                    aria-describedby={radioError ? 'hasOtherClubs-error' : undefined}
                    checked={selected}
                    className="sr-only"
                    name="hasOtherClubs"
                    onBlur={() => onBlur('hasOtherClubs')}
                    onChange={() => onChange('hasOtherClubs', option.value)}
                    type="radio"
                    value={option.label.toLowerCase()}
                  />
                </label>
              );
            })}
          </div>
          <FieldError id="hasOtherClubs-error">{radioError}</FieldError>
        </fieldset>

        {data.hasOtherClubs === true ? (
          <FormField
            className="sm:col-span-2"
            error={visibleError('otherClubDetails')}
            helper="Tell us where you're currently involved."
            id="otherClubDetails"
            label="Which club(s)?"
            required
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                error={Boolean(visibleError('otherClubDetails'))}
                onBlur={() => onBlur('otherClubDetails')}
                onChange={(event) => onChange('otherClubDetails', event.target.value)}
                placeholder="Club name(s)"
                type="text"
                value={data.otherClubDetails}
              />
            )}
          </FormField>
        ) : null}
      </div>

      <p className="helper text-right" aria-live="polite">
        {autosaveStatus === 'saved' ? 'Saved on this device' : ' '}
      </p>
    </form>
  );
}
