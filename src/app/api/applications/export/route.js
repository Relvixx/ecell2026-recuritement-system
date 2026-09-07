import dbConnect from '../../../../../lib/mongodb';
import { requireAuth } from '../../../../../lib/auth';
import Application2026 from '../../../../../models/Application2026';
import {
  RECRUITMENT_CYCLE,
  STATUS_IDS,
  TEAM_IDS,
  YEAR_IDS
} from '../../../../../lib/recruitment2026';

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function csvEscape(value) {
  let text = value === undefined || value === null ? '' : String(value);

  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function buildFilter(searchParams) {
  const filter = { recruitmentCycle: RECRUITMENT_CYCLE };
  const status = cleanString(searchParams.get('status'));
  const primaryTeam = cleanString(searchParams.get('primaryTeam') || searchParams.get('team') || searchParams.get('role')).toLowerCase();
  const yearOfStudy = cleanString(searchParams.get('yearOfStudy') || searchParams.get('year')).toLowerCase();
  const branch = cleanString(searchParams.get('branch'));
  const search = cleanString(searchParams.get('search'));

  if (status && STATUS_IDS.includes(status)) {
    filter.status = status;
  }

  if (primaryTeam && TEAM_IDS.includes(primaryTeam)) {
    filter.primaryTeam = primaryTeam;
  }

  if (yearOfStudy && YEAR_IDS.includes(yearOfStudy)) {
    filter.yearOfStudy = yearOfStudy;
  }

  if (branch) {
    filter.branch = branch;
  }

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { fullName: { $regex: escapedSearch, $options: 'i' } },
      { email: { $regex: escapedSearch, $options: 'i' } },
      { whatsappNumber: { $regex: escapedSearch, $options: 'i' } },
      { applicationCode: { $regex: escapedSearch, $options: 'i' } }
    ];
  }

  return {
    filter,
    filters: { status, primaryTeam, yearOfStudy, branch, search }
  };
}

function formatTeamAnswers(teamAnswers = []) {
  return teamAnswers.map(answer => {
    if (answer.selectedOptions?.length) {
      return `${answer.questionId}: ${answer.selectedOptions.join('; ')}`;
    }

    if (answer.link) {
      return `${answer.questionId}: ${answer.link}`;
    }

    return `${answer.questionId}: ${answer.answerText || ''}`;
  }).join(' | ');
}

function toExportRecord(application) {
  return {
    applicationCode: application.applicationCode || '',
    fullName: application.fullName || '',
    email: application.email || '',
    whatsappNumber: application.whatsappNumber || '',
    branch: application.branch || '',
    yearOfStudy: application.yearOfStudy || '',
    primaryTeam: application.primaryTeam || '',
    secondaryTeam: application.secondaryTeam || '',
    secondaryTeamReason: application.secondaryTeamReason || '',
    hasOtherClubs: application.hasOtherClubs === true ? 'yes' : 'no',
    otherClubDetails: application.otherClubDetails || '',
    whyEcell: application.whyEcell || '',
    whyPrimaryTeam: application.whyPrimaryTeam || '',
    experience: application.experience || '',
    availability: application.availability || '',
    teamAnswers: formatTeamAnswers(application.teamAnswers),
    status: application.status || '',
    submittedAt: application.submittedAt || '',
    updatedAt: application.updatedAt || ''
  };
}

export const GET = requireAuth(async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') === 'json' ? 'json' : 'csv';
    const { filter, filters } = buildFilter(searchParams);

    const applications = await Application2026.find(filter)
      .sort({ submittedAt: -1 })
      .select('-_id -__v -internalNotes')
      .lean();

    const records = applications.map(toExportRecord);

    if (format === 'json') {
      return Response.json({
        data: records,
        exportedAt: new Date().toISOString(),
        totalRecords: records.length,
        filters
      });
    }

    const headers = [
      'Application Code',
      'Full Name',
      'Email',
      'WhatsApp Number',
      'Branch',
      'Year Of Study',
      'Primary Team',
      'Secondary Team',
      'Secondary Team Reason',
      'Has Other Clubs',
      'Other Club Details',
      'Why E-CELL',
      'Why Primary Team',
      'Experience',
      'Availability',
      'Team Answers',
      'Status',
      'Submitted At',
      'Last Updated'
    ];

    const rows = records.map(record => [
      record.applicationCode,
      record.fullName,
      record.email,
      record.whatsappNumber,
      record.branch,
      record.yearOfStudy,
      record.primaryTeam,
      record.secondaryTeam,
      record.secondaryTeamReason,
      record.hasOtherClubs,
      record.otherClubDetails,
      record.whyEcell,
      record.whyPrimaryTeam,
      record.experience,
      record.availability,
      record.teamAnswers,
      record.status,
      record.submittedAt ? new Date(record.submittedAt).toLocaleString() : '',
      record.updatedAt ? new Date(record.updatedAt).toLocaleString() : ''
    ]);

    const csvContent = [
      headers.map(csvEscape).join(','),
      ...rows.map(row => row.map(csvEscape).join(','))
    ].join('\n');

    const timestamp = new Date().toISOString().split('T')[0];

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ecell_applications_2026_${timestamp}.csv"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return Response.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
});
