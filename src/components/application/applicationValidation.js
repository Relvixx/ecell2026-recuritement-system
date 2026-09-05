import { BRANCH_OPTIONS, YEAR_OPTIONS } from '@/config/application-options';

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
