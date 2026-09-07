'use client';

import { useEffect, useRef } from 'react';
import { AVAILABILITY_OPTIONS } from '@/config/application-options';
import { getTeamAccent, getTeamById, TEAMS } from '@/config/teams';
import { FieldError, FormField, Input, Select, Textarea } from '@/components/ui/forms';
import { ApplicationStepHeader } from '@/components/shells/application';
import { Stack, cn } from '@/components/ui/layout';
import { TeamSelectorCard } from '@/components/shells/teams';

function AutoGrowTextarea({ value, onChange, className = '', style, ...props }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 264)}px`;
  }, [value]);

  return (
    <Textarea
      {...props}
      className={cn('resize-y overflow-y-auto', className)}
      onChange={onChange}
      ref={textareaRef}
      rows={3}
      style={{ minHeight: '104px', maxHeight: '264px', ...style }}
      value={value}
    />
  );
}

function TeamAnswerField({ answer, error, onBlur, onChange, question, touched }) {
  const fieldId = `team-question-${question.id}`;
  const errorId = `${fieldId}-error`;
  const showError = touched ? error : undefined;

  if (question.type === 'multiselect') {
    const selectedOptions = Array.isArray(answer?.selectedOptions) ? answer.selectedOptions : [];

    return (
      <fieldset className="space-y-3">
        <legend className="label text-foreground">
          {question.label}{question.required ? <span aria-hidden="true"> *</span> : null}
        </legend>
        {question.helper ? <p className="helper">{question.helper}</p> : null}
        <div className="grid grid-cols-2 gap-2 lg:gap-3" aria-describedby={showError ? errorId : undefined}>
          {question.options.map(option => {
            const selected = selectedOptions.includes(option);
            return (
              <label
                className={cn(
                  'flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-control)] border px-4 py-3 text-sm transition duration-200 lg:min-h-[50px] lg:text-[0.98rem]',
                  selected ? 'border-foreground bg-[var(--color-lavender)]/55 text-foreground' : 'border-border bg-[var(--color-ivory-50)] text-muted hover:bg-[var(--color-surface-muted)]'
                )}
                key={option}
              >
                <span>{option}</span>
                <input
                  aria-describedby={showError ? errorId : undefined}
                  checked={selected}
                  className="sr-only"
                  onBlur={() => onBlur(question.id)}
                  onChange={() => onChange(question, selectedOptions.includes(option) ? selectedOptions.filter(item => item !== option) : [...selectedOptions, option])}
                  type="checkbox"
                />
                <span aria-hidden="true" className="text-xs">{selected ? 'Selected' : ' '}</span>
              </label>
            );
          })}
        </div>
        <FieldError id={errorId}>{showError}</FieldError>
      </fieldset>
    );
  }

  return (
    <FormField error={showError} helper={question.helper} id={fieldId} label={question.label} required={question.required}>
      {(fieldProps) => question.type === 'url' ? (
        <Input
          {...fieldProps}
          autoComplete="url"
          error={Boolean(showError)}
          onBlur={() => onBlur(question.id)}
          onChange={(event) => onChange(question, event.target.value)}
          placeholder="https://"
          type="url"
          value={answer?.link || ''}
        />
      ) : (
        <AutoGrowTextarea
          {...fieldProps}
          error={Boolean(showError)}
          onBlur={() => onBlur(question.id)}
          onChange={(event) => onChange(question, event.target.value)}
          value={answer?.answerText || ''}
        />
      )}
    </FormField>
  );
}

export function StepTwoYourSquad({ answersByTeam, data, errors, onBlur, onChange, onSubmit, onTeamAnswerChange, touched }) {
  const primaryTeam = getTeamById(data.primaryTeam);
  const primaryAccent = getTeamAccent(primaryTeam?.id);

  return (
    <form className="application-step-two" id="application-step-two" noValidate onSubmit={onSubmit}>
      <Stack gap="xl">
        <ApplicationStepHeader description="Pick the team you'd genuinely enjoy contributing to. You don't need to be an expert already." title="Find your place" />

        <fieldset className="application-chapter">
          <legend className="heading text-[1.35rem] lg:text-[1.5rem]">Primary team <span aria-hidden="true">*</span></legend>
          <p className="helper mt-2">This is the team you&apos;d most like to work with.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:gap-4">
            {TEAMS.map((team, index) => (
              <TeamSelectorCard
                compact
                className="application-team-card min-h-[82px] p-3 lg:min-h-[118px] lg:p-5"
                index={index}
                key={team.id}
                onSelect={(teamId) => onChange('primaryTeam', teamId)}
                selected={data.primaryTeam === team.id}
                team={team}
              />
            ))}
          </div>
          <FieldError id="primaryTeam-error">{touched.primaryTeam ? errors.primaryTeam : undefined}</FieldError>
        </fieldset>

        <fieldset className="application-chapter border-t border-border/75 pt-7">
          <legend className="heading text-[1.35rem] lg:text-[1.5rem]">Second preference</legend>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="helper mt-2">Optional. Pick another team you&apos;d also be happy contributing to.</p>
            </div>
            <button
              aria-pressed={!data.secondaryTeam}
              className={cn(
                'label min-h-10 rounded-full border px-4 py-2 transition',
                !data.secondaryTeam
                  ? 'border-foreground bg-[var(--color-sage)]/55 text-foreground'
                  : 'border-border bg-[var(--color-ivory-50)] text-muted hover:border-foreground hover:text-foreground'
              )}
              onClick={() => onChange('secondaryTeam', '')}
              type="button"
            >
              No second preference
            </button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {TEAMS.map((team, index) => (
              team.id === data.primaryTeam ? null : (
                <TeamSelectorCard
                  compact
                  className="application-secondary-team-card min-h-[72px] p-3 lg:min-h-[92px] lg:p-4"
                  index={index}
                  key={team.id}
                  onSelect={(teamId) => onChange('secondaryTeam', data.secondaryTeam === teamId ? '' : teamId)}
                  secondary
                  selected={data.secondaryTeam === team.id}
                  team={team}
                />
              )
            ))}
          </div>
          <FieldError id="secondaryTeam-error">{touched.secondaryTeam ? errors.secondaryTeam : undefined}</FieldError>
        </fieldset>

        {data.secondaryTeam ? (
          <FormField className="border-t border-border/75 pt-7" error={touched.secondaryTeamReason ? errors.secondaryTeamReason : undefined} id="secondaryTeamReason" label="Why might your second-choice team also suit you?">
            {(fieldProps) => (
              <AutoGrowTextarea
                {...fieldProps}
                error={Boolean(touched.secondaryTeamReason && errors.secondaryTeamReason)}
                onBlur={() => onBlur('secondaryTeamReason')}
                onChange={(event) => onChange('secondaryTeamReason', event.target.value)}
                value={data.secondaryTeamReason}
              />
            )}
          </FormField>
        ) : null}

        <section aria-labelledby="your-story-heading" className="application-chapter border-t border-border/75 pt-8">
          <div className="mb-5">
            <p className="eyebrow text-muted">YOUR STORY</p>
            <h2 className="heading mt-2" id="your-story-heading">A little more about your why</h2>
          </div>
          <Stack gap="lg">
            <FormField error={touched.whyEcell ? errors.whyEcell : undefined} helper="Tell us what genuinely interests you—not what you think we want to hear." id="whyEcell" label="Why do you want to be part of E-CELL MET?" required>
              {(fieldProps) => <AutoGrowTextarea {...fieldProps} error={Boolean(touched.whyEcell && errors.whyEcell)} onBlur={() => onBlur('whyEcell')} onChange={(event) => onChange('whyEcell', event.target.value)} value={data.whyEcell} />}
            </FormField>
            <FormField error={touched.whyPrimaryTeam ? errors.whyPrimaryTeam : undefined} helper="Tell us about your interests, skills, personality or curiosity." id="whyPrimaryTeam" label="Why does your primary team feel like a good fit for you?" required>
              {(fieldProps) => <AutoGrowTextarea {...fieldProps} error={Boolean(touched.whyPrimaryTeam && errors.whyPrimaryTeam)} onBlur={() => onBlur('whyPrimaryTeam')} onChange={(event) => onChange('whyPrimaryTeam', event.target.value)} value={data.whyPrimaryTeam} />}
            </FormField>
            <FormField error={touched.experience ? errors.experience : undefined} helper="School work, personal projects, volunteering, experiments and side projects all count." id="experience" label="Tell us about something you've built, created, organised, researched or contributed to." required>
              {(fieldProps) => <AutoGrowTextarea {...fieldProps} error={Boolean(touched.experience && errors.experience)} onBlur={() => onBlur('experience')} onChange={(event) => onChange('experience', event.target.value)} value={data.experience} />}
            </FormField>
            <FormField className="lg:max-w-[520px]" error={touched.availability ? errors.availability : undefined} id="availability" label="How much time can you realistically give E-CELL each week?" required>
              {(fieldProps) => (
                <Select {...fieldProps} error={Boolean(touched.availability && errors.availability)} onBlur={() => onBlur('availability')} onChange={(event) => onChange('availability', event.target.value)} value={data.availability}>
                  <option value="">Select your availability</option>
                  {AVAILABILITY_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </Select>
              )}
            </FormField>
          </Stack>
        </section>

        {primaryTeam ? (
          <section
            aria-labelledby="team-questions-heading"
            className="application-chapter border-t pt-8"
            style={{ borderTopColor: primaryAccent?.surface || 'var(--color-border)' }}
          >
            <div className="mb-5">
              <p className="eyebrow flex items-center gap-2 text-muted">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: primaryAccent?.surface || 'var(--color-border)' }} />
                {primaryTeam.name.toUpperCase()} QUESTIONS
              </p>
              <h2 className="heading mt-2" id="team-questions-heading">A few {primaryTeam.name}-specific questions</h2>
            </div>
            <Stack gap="lg">
              {primaryTeam.questions.map(question => (
                <TeamAnswerField
                  answer={(answersByTeam[primaryTeam.id] || []).find(item => item.questionId === question.id)}
                  error={errors[`team_${question.id}`]}
                  key={question.id}
                  onBlur={onBlur}
                  onChange={onTeamAnswerChange}
                  question={question}
                  touched={touched[`team_${question.id}`]}
                />
              ))}
            </Stack>
          </section>
        ) : null}
      </Stack>
    </form>
  );
}
