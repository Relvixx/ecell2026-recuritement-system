import { AVAILABILITY_OPTIONS, BRANCH_OPTIONS, YEAR_OPTIONS } from '@/config/application-options';
import { getTeamById } from '@/config/teams';
import { ApplicationStepHeader, ReviewSection } from '@/components/shells/application';
import { Checkbox, FieldError } from '@/components/ui/forms';
import { Stack } from '@/components/ui/layout';

function displayOption(options, value) {
  return options.find(option => option.value === value)?.label || value || 'Not provided';
}

function AnswerValue({ answer, question }) {
  if (question.type === 'multiselect') {
    const options = Array.isArray(answer?.selectedOptions) ? answer.selectedOptions : [];
    return options.length ? options.join(', ') : 'Not provided';
  }

  return answer?.link || answer?.answerText || 'Not provided';
}

function DetailList({ items }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map(item => (
        <div key={item.label}>
          <dt className="helper">{item.label}</dt>
          <dd className="body mt-1 whitespace-pre-wrap break-words">{item.value || 'Not provided'}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ApplicationReview({ answersByTeam, data, errors, onChangeConfirmation, onEdit, onSubmit, submissionError, submissionErrorRef, submitting }) {
  const primaryTeam = getTeamById(data.primaryTeam);
  const activeAnswers = primaryTeam ? answersByTeam[primaryTeam.id] || [] : [];

  return (
    <form id="application-review" noValidate onSubmit={onSubmit}>
      <Stack gap="lg">
        <ApplicationStepHeader description="Take one last look before you send it." title="Almost there." />

        <ReviewSection onEdit={() => onEdit(0)} title="ABOUT YOU">
          <DetailList items={[
            { label: 'Full name', value: data.fullName },
            { label: 'Email', value: data.email },
            { label: 'WhatsApp', value: data.whatsappNumber },
            { label: 'Branch', value: displayOption(BRANCH_OPTIONS, data.branch) },
            { label: 'Year', value: displayOption(YEAR_OPTIONS, data.yearOfStudy) },
            { label: 'Other club information', value: data.hasOtherClubs ? data.otherClubDetails : 'No' }
          ]} />
        </ReviewSection>

        <ReviewSection onEdit={() => onEdit(1)} title="YOUR SQUAD">
          <DetailList items={[
            { label: 'Primary team', value: primaryTeam?.name || data.primaryTeam },
            { label: 'Second preference', value: getTeamById(data.secondaryTeam)?.name || 'None selected' },
            { label: 'Availability', value: displayOption(AVAILABILITY_OPTIONS, data.availability) }
          ]} />
        </ReviewSection>

        <ReviewSection onEdit={() => onEdit(1)} title="YOUR STORY">
          <Stack gap="md">
            <DetailList items={[
              { label: 'Why E-CELL MET?', value: data.whyEcell },
              { label: 'Why this primary team?', value: data.whyPrimaryTeam },
              { label: 'Experience', value: data.experience },
              ...(data.secondaryTeamReason ? [{ label: 'Second-choice team', value: data.secondaryTeamReason }] : [])
            ]} />
          </Stack>
        </ReviewSection>

        {primaryTeam ? (
          <ReviewSection onEdit={() => onEdit(1)} title={`${primaryTeam.name.toUpperCase()} QUESTIONS`}>
            <Stack gap="md">
              {primaryTeam.questions.map(question => (
                <div key={question.id}>
                  <p className="helper">{question.label}</p>
                  <p className="body mt-1 whitespace-pre-wrap break-words"><AnswerValue answer={activeAnswers.find(item => item.questionId === question.id)} question={question} /></p>
                </div>
              ))}
            </Stack>
          </ReviewSection>
        ) : null}

        <div className="border-t border-border pt-6">
          <Checkbox
            checked={data.confirmationAccepted}
            id="confirmationAccepted"
            label="I confirm that the information above is accurate and submitted by me."
            onChange={(event) => onChangeConfirmation(event.target.checked)}
          />
          <FieldError>{errors.confirmationAccepted}</FieldError>
          {submissionError ? (
            <p aria-live="assertive" className="body-small mt-5 rounded-[var(--radius-control)] border border-error bg-[var(--color-error-surface)]/35 p-3 text-error" id="submission-error" ref={submissionErrorRef} role="alert" tabIndex="-1">
              {submissionError}
            </p>
          ) : null}
          {submitting ? <p className="helper mt-4" aria-live="polite">Submitting...</p> : null}
        </div>
      </Stack>
    </form>
  );
}
