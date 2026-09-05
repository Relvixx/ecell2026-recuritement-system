import { AVAILABILITY_OPTIONS } from '@/config/application-options';
import { getTeamById, TEAMS } from '@/config/teams';
import { FieldError, FormField, Input, Select, Textarea } from '@/components/ui/forms';
import { ApplicationStepHeader } from '@/components/shells/application';
import { Stack, cn } from '@/components/ui/layout';
import { TeamSelectorCard } from '@/components/shells/teams';

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
        <div className="grid gap-2 sm:grid-cols-2" aria-describedby={showError ? errorId : undefined}>
          {question.options.map(option => {
            const selected = selectedOptions.includes(option);
            return (
              <label
                className={cn(
                  'flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-control)] border px-4 py-3 text-sm transition duration-200',
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
        <Textarea
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

  return (
    <form id="application-step-two" noValidate onSubmit={onSubmit}>
      <Stack gap="lg">
        <ApplicationStepHeader description="Pick the team you'd genuinely enjoy contributing to. You don't need to be an expert already." title="Find your place" />

        <fieldset>
          <legend className="heading text-[1.35rem]">Primary team <span aria-hidden="true">*</span></legend>
          <p className="helper mt-2">This is the team you&apos;d most like to work with.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {TEAMS.map((team, index) => (
              <TeamSelectorCard
                compact
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

        <fieldset>
          <legend className="heading text-[1.35rem]">Second preference</legend>
          <p className="helper mt-2">Optional. Pick another team you&apos;d also be happy contributing to.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {TEAMS.filter(team => team.id !== data.primaryTeam).map((team, index) => (
              <TeamSelectorCard
                compact
                index={index}
                key={team.id}
                onSelect={(teamId) => onChange('secondaryTeam', data.secondaryTeam === teamId ? '' : teamId)}
                selected={data.secondaryTeam === team.id}
                team={team}
              />
            ))}
          </div>
          <FieldError id="secondaryTeam-error">{touched.secondaryTeam ? errors.secondaryTeam : undefined}</FieldError>
        </fieldset>

        {data.secondaryTeam ? (
          <FormField error={touched.secondaryTeamReason ? errors.secondaryTeamReason : undefined} id="secondaryTeamReason" label="Why might your second-choice team also suit you?">
            {(fieldProps) => (
              <Textarea
                {...fieldProps}
                error={Boolean(touched.secondaryTeamReason && errors.secondaryTeamReason)}
                onBlur={() => onBlur('secondaryTeamReason')}
                onChange={(event) => onChange('secondaryTeamReason', event.target.value)}
                value={data.secondaryTeamReason}
              />
            )}
          </FormField>
        ) : null}

        <section aria-labelledby="your-story-heading">
          <div className="mb-5">
            <p className="eyebrow text-muted">YOUR STORY</p>
            <h2 className="heading mt-2" id="your-story-heading">A little more about your why</h2>
          </div>
          <Stack gap="lg">
            <FormField error={touched.whyEcell ? errors.whyEcell : undefined} helper="Tell us what genuinely interests you—not what you think we want to hear." id="whyEcell" label="Why do you want to be part of E-CELL MET?" required>
              {(fieldProps) => <Textarea {...fieldProps} error={Boolean(touched.whyEcell && errors.whyEcell)} onBlur={() => onBlur('whyEcell')} onChange={(event) => onChange('whyEcell', event.target.value)} value={data.whyEcell} />}
            </FormField>
            <FormField error={touched.whyPrimaryTeam ? errors.whyPrimaryTeam : undefined} helper="Tell us about your interests, skills, personality or curiosity." id="whyPrimaryTeam" label="Why does your primary team feel like a good fit for you?" required>
              {(fieldProps) => <Textarea {...fieldProps} error={Boolean(touched.whyPrimaryTeam && errors.whyPrimaryTeam)} onBlur={() => onBlur('whyPrimaryTeam')} onChange={(event) => onChange('whyPrimaryTeam', event.target.value)} value={data.whyPrimaryTeam} />}
            </FormField>
            <FormField error={touched.experience ? errors.experience : undefined} helper="School work, personal projects, volunteering, experiments and side projects all count." id="experience" label="Tell us about something you've built, created, organised, researched or contributed to." required>
              {(fieldProps) => <Textarea {...fieldProps} error={Boolean(touched.experience && errors.experience)} onBlur={() => onBlur('experience')} onChange={(event) => onChange('experience', event.target.value)} value={data.experience} />}
            </FormField>
            <FormField error={touched.availability ? errors.availability : undefined} id="availability" label="How much time can you realistically give E-CELL each week?" required>
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
          <section aria-labelledby="team-questions-heading" className="border-t border-border pt-8">
            <div className="mb-5">
              <p className="eyebrow text-muted">{primaryTeam.name.toUpperCase()} QUESTIONS</p>
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
