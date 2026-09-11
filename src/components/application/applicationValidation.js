import { BRANCH_OPTIONS, YEAR_OPTIONS } from '@/config/application-options';
import { getTeamById } from '@/config/teams';

export const STEP_ONE_FIELDS = [
  'fullName',
  'email',
  'whatsappNumber',
  'branch',
  'yearOfStudy',
  'hasOtherClubs',
  'otherClubDetails'
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeEmail(value) {
  return cleanString(value).toLowerCase();
}

export function normalizePhoneForValidation(value) {
  const rawValue = cleanString(value);
  const hasInternationalPrefix = rawValue.startsWith('+');
  let digits = rawValue.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  if (hasInternationalPrefix && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }

  return rawValue.replace(/\s+/g, '');
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(normalizeEmail(value));
}

export function isValidPhone(value) {
  return /^\+[1-9]\d{7,14}$/.test(normalizePhoneForValidation(value));
}

export function normalizeStepOneData(data) {
  const hasOtherClubs = data.hasOtherClubs === true;

  return {
    ...data,
    fullName: cleanString(data.fullName),
    email: normalizeEmail(data.email),
    whatsappNumber: normalizePhoneForValidation(data.whatsappNumber),
    branch: cleanString(data.branch),
    yearOfStudy: cleanString(data.yearOfStudy),
    hasOtherClubs,
    otherClubDetails: hasOtherClubs ? cleanString(data.otherClubDetails) : ''
  };
}

export function validateStepOne(data) {
  const errors = {};
  const normalizedEmail = normalizeEmail(data.email);
  const branchValues = BRANCH_OPTIONS.map(option => option.value);
  const yearValues = YEAR_OPTIONS.map(option => option.value);

  if (!cleanString(data.fullName)) {
    errors.fullName = 'This field is required.';
  }

  if (!normalizedEmail) {
    errors.email = 'This field is required.';
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!cleanString(data.whatsappNumber)) {
    errors.whatsappNumber = 'This field is required.';
  } else if (!isValidPhone(data.whatsappNumber)) {
    errors.whatsappNumber = 'Enter a valid WhatsApp number.';
  }

  if (!branchValues.includes(cleanString(data.branch))) {
    errors.branch = 'This field is required.';
  }

  if (!yearValues.includes(cleanString(data.yearOfStudy))) {
    errors.yearOfStudy = 'This field is required.';
  }

  if (data.hasOtherClubs !== true && data.hasOtherClubs !== false) {
    errors.hasOtherClubs = 'This field is required.';
  }

  if (data.hasOtherClubs === true && !cleanString(data.otherClubDetails)) {
    errors.otherClubDetails = 'This field is required.';
  }

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}

export function normalizeAnswerValue(question, value) {
  if (question.type === 'multiselect') {
    return Array.isArray(value) ? value.filter(option => typeof option === 'string') : [];
  }

  return cleanString(value);
}

export function validateUrl(value) {
  const normalized = cleanString(value);

  if (!normalized) {
    return true;
  }

  try {
    const url = new URL(normalized);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function validateStepTwo(data, teamAnswers = {}) {
  const errors = {};
  const primaryTeam = getTeamById(data.primaryTeam);

  if (!primaryTeam) {
    errors.primaryTeam = 'Choose a primary team.';
  }

  if (data.secondaryTeam && data.secondaryTeam === data.primaryTeam) {
    errors.secondaryTeam = 'Choose a different team for your second preference.';
  }

  if (!cleanString(data.whyEcell)) {
    errors.whyEcell = 'This field is required.';
  }

  if (!cleanString(data.whyPrimaryTeam)) {
    errors.whyPrimaryTeam = 'This field is required.';
  }

  if (!cleanString(data.experience)) {
    errors.experience = 'This field is required.';
  }

  if (data.secondaryTeam && !cleanString(data.secondaryTeamReason)) {
    // The second-preference explanation is intentionally optional.
    delete errors.secondaryTeamReason;
  }

  if (primaryTeam) {
    const answers = Array.isArray(teamAnswers[primaryTeam.id]) ? teamAnswers[primaryTeam.id] : [];
    const answersById = new Map(answers.map(answer => [answer.questionId, answer]));

    for (const question of primaryTeam.questions) {
      const answer = answersById.get(question.id);
      const value = question.type === 'multiselect' ? answer?.selectedOptions : question.type === 'url' ? answer?.link : answer?.answerText;
      const empty = question.type === 'multiselect' ? !Array.isArray(value) || value.length === 0 : !cleanString(value);

      if (question.required && empty) {
        errors[`team_${question.id}`] = 'This field is required.';
      } else if (question.type === 'multiselect' && Array.isArray(value) && value.some(option => !question.options.includes(option))) {
        errors[`team_${question.id}`] = 'Choose valid options.';
      } else if (question.type === 'url' && !validateUrl(value)) {
        errors[`team_${question.id}`] = 'Enter a valid URL.';
      }
    }
  }

  return errors;
}
