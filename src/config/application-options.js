import { AVAILABILITY_IDS, BRANCH_OPTIONS, ELIGIBLE_YEAR_IDS } from './recruitment';

const yearLabels = {
  first_year: 'First year',
  second_year: 'Second year',
  third_year: 'Third year'
};

const availabilityLabels = {
  '2_3_hours': '2-3 hours',
  '4_5_hours': '4-5 hours',
  '6_8_hours': '6-8 hours',
  '8_plus_hours': '8+ hours',
  depends_on_event_schedule: 'Depends on the event schedule'
};

export const YEAR_OPTIONS = ELIGIBLE_YEAR_IDS.map((value) => ({
  value,
  label: yearLabels[value] || value
}));

export const AVAILABILITY_OPTIONS = AVAILABILITY_IDS.map((value) => ({
  value,
  label: availabilityLabels[value] || value
}));

export { BRANCH_OPTIONS };
