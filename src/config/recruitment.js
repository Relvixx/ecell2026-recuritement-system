import { TEAM_IDS } from './canonical';

export const RECRUITMENT_YEAR_LABEL = '2026-27';
export const RECRUITMENT_CYCLE = '2026-27';
export const APPLICATION_CODE_PREFIX = 'EC26-';
export const APPLICATIONS_OPEN = true;

export const APPLICATION_STATUS_IDS = [
  'submitted',
  'under_review',
  'shortlisted',
  'interview',
  'selected',
  'rejected'
];

export const ELIGIBLE_YEAR_IDS = [
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

// Provisional: Rahul must confirm the final production branch list before launch.
export const BRANCH_OPTIONS = [
  { value: 'CSD', label: 'CSD' },
  { value: 'AnR', label: 'AnR' },
  { value: 'CEE', label: 'CEE' }
];

export const BRANCH_IDS = BRANCH_OPTIONS.map((option) => option.value);

export const RECRUITMENT_LINKS = {
  instagramUrl: '',
  websiteUrl: '',
  contactEmail: '',
  deadlineLabel: ''
};

export { TEAM_IDS };
