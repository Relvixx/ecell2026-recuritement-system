import { randomInt } from 'crypto';

export const RECRUITMENT_CYCLE = '2026-27';

export const TEAM_IDS = [
  'technical',
  'design',
  'documentation',
  'social_media',
  'pr',
  'event',
  'research'
];

export const YEAR_IDS = [
  'first_year',
  'second_year',
  'third_year'
];

export const AVAILABILITY_IDS = [
  '2_3_hours',
  '4_5_hours',
  '6_8_hours',
  '8_plus_hours',
  'depends_on_event_schedule'
];

export const STATUS_IDS = [
  'submitted',
  'under_review',
  'shortlisted',
  'interview',
  'selected',
  'rejected'
];

export const APPLICATION_CODE_PREFIX = 'EC26-';
export const APPLICATION_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const APPLICATION_CODE_SUFFIX_LENGTH = 5;

export function normalizePhoneNumber(value) {
  const rawValue = String(value || '').trim();
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

export function generateApplicationCode() {
  let suffix = '';

  for (let i = 0; i < APPLICATION_CODE_SUFFIX_LENGTH; i += 1) {
    const index = randomInt(APPLICATION_CODE_ALPHABET.length);
    suffix += APPLICATION_CODE_ALPHABET[index];
  }

  return `${APPLICATION_CODE_PREFIX}${suffix}`;
}

export async function generateUniqueApplicationCode(ApplicationModel, maxAttempts = 10) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const applicationCode = generateApplicationCode();
    const existingApplication = await ApplicationModel.exists({ applicationCode });

    if (!existingApplication) {
      return applicationCode;
    }
  }

  throw new Error('Could not generate a unique application code');
}
