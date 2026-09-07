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

/*
export const YEAR_OPTIONS = [
  { value: 'first_year', label: 'First year' },
  { value: 'second_year', label: 'Second year' },
  { value: 'third_year', label: 'Third year' }
];

export const AVAILABILITY_OPTIONS = [
  { value: '2_3_hours', label: '2–3 hours' },
  { value: '4_5_hours', label: '4–5 hours' },
  { value: '6_8_hours', label: '6–8 hours' },
  { value: '8_plus_hours', label: '8+ hours' },
  { value: 'depends_on_event_schedule', label: 'Depends on the event schedule' }
];

// Provisional: FINAL_BRANCH_OPTIONS is not locked in the docs yet.
// These are reused from the legacy MET admin create flow and should be replaced
// here once Rahul confirms the final branch list.
export const BRANCH_OPTIONS = [
  { value: 'CSD', label: 'CSD' },
  { value: 'AnR', label: 'AnR' },
  { value: 'CEE', label: 'CEE' }
];
*/
