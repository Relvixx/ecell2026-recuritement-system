import { TEAM_IDS } from './canonical';

export const RECRUITMENT_YEAR_LABEL = '2026-27';
export const RECRUITMENT_CYCLE = '2026-27';
export const APPLICATION_CODE_PREFIX = 'EC26-';
export const APPLICATIONS_OPEN = true;
export const RECRUITMENT_TIMEZONE = 'Asia/Kolkata';
export const RECRUITMENT_OPEN_AT = '2026-09-08T00:01:00+05:30';
export const RECRUITMENT_CLOSE_AT = '2026-09-20T23:59:00+05:30';
export const RECRUITMENT_WINDOW_LABEL = '8-20 September 2026';

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

export const BRANCH_OPTIONS = [
  { value: 'Computer Science and Design', label: 'Computer Science and Design' },
  { value: 'Computer Science and Engineering', label: 'Computer Science and Engineering' },
  { value: 'Automation and Robotics', label: 'Automation and Robotics' },
  { value: 'Electrical and Telecommunication Engineering', label: 'Electrical and Telecommunication Engineering' },
  { value: 'Civil and Environmental Engineering', label: 'Civil and Environmental Engineering' }
];

export const BRANCH_IDS = BRANCH_OPTIONS.map((option) => option.value);

export const RECRUITMENT_LINKS = {
  instagramUrl: 'https://www.instagram.com/ecell.met/',
  websiteUrl: 'https://www.ecell-met.tech/',
  contactEmail: 'met.iot.ecell@gmail.com',
  deadlineLabel: '20 September 2026, 11:59 PM IST'
};

export function getRecruitmentWindowStatus(now = new Date()) {
  if (!APPLICATIONS_OPEN) {
    return 'closed';
  }

  const currentTime = now.getTime();
  const openTime = new Date(RECRUITMENT_OPEN_AT).getTime();
  const closeTime = new Date(RECRUITMENT_CLOSE_AT).getTime();

  if (currentTime < openTime) {
    return 'not_open';
  }

  if (currentTime > closeTime) {
    return 'closed';
  }

  return 'open';
}

export function isRecruitmentAcceptingApplications(now = new Date()) {
  return getRecruitmentWindowStatus(now) === 'open';
}

export { TEAM_IDS };
