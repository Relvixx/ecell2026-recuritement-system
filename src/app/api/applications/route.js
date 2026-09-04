import dbConnect from '../../../../lib/mongodb';
import Application from '../../../../models/Application';
import Application2026 from '../../../../models/Application2026';
import { requireAuth } from '../../../../lib/auth';
import {
  AVAILABILITY_IDS,
  RECRUITMENT_CYCLE,
  TEAM_IDS,
  YEAR_IDS,
  normalizePhoneNumber
} from '../../../../lib/recruitment2026';
import { getTeamById } from '../../../config/teams';

const MAX_LENGTHS = {
  fullName: 120,
  email: 254,
  whatsappNumber: 32,
  branch: 120,
  otherClubDetails: 500,
  secondaryTeamReason: 1000,
  whyEcell: 4000,
  whyPrimaryTeam: 3000,
  experience: 4000,
  answerText: 4000,
  link: 500
};

const FORBIDDEN_SUBMISSION_FIELDS = [
  'applicationCode',
  'recruitmentCycle',
  'status',
  'internalNotes',
  'submittedAt',
  'createdAt',
  'updatedAt',
  '_id',
  '__v'
];

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APPLICATION_CODE_COLLISION_ATTEMPTS = 3;

function jsonError(error, status = 400) {
  return Response.json({ error }, { status });
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasUnsafeKeys(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (UNSAFE_KEYS.has(key)) {
      return true;
    }

    if (hasUnsafeKeys(value[key])) {
      return true;
    }
  }

  return false;
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value) {
  return cleanString(value).toLowerCase();
}

function isValidPhoneNumber(value) {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

function isValidUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function pushRequiredStringError(errors, data, field) {
  if (!data[field]) {
    errors.push(`${field} is required`);
    return;
  }

  if (data[field].length > MAX_LENGTHS[field]) {
    errors.push(`${field} is too long`);
  }
}

function normalizeTeamAnswers(rawTeamAnswers, primaryTeam, errors) {
  const team = getTeamById(primaryTeam);

  if (!team) {
    errors.push('primaryTeam is invalid');
    return [];
  }

  if (rawTeamAnswers === undefined) {
    rawTeamAnswers = [];
  }

  if (!Array.isArray(rawTeamAnswers)) {
    errors.push('teamAnswers must be an array');
    return [];
  }

  const questionsById = new Map(team.questions.map(question => [question.id, question]));
  const answersByQuestionId = new Map();
  const normalizedAnswers = [];

  for (const rawAnswer of rawTeamAnswers) {
    if (!isPlainObject(rawAnswer) || hasUnsafeKeys(rawAnswer)) {
      errors.push('teamAnswers contains an invalid answer');
      continue;
    }

    const questionId = cleanString(rawAnswer.questionId).toLowerCase();
    const question = questionsById.get(questionId);

    if (!question) {
      errors.push(`Unknown team question: ${questionId || 'blank'}`);
      continue;
    }

    if (answersByQuestionId.has(questionId)) {
      errors.push(`Duplicate team question answer: ${questionId}`);
      continue;
    }

    answersByQuestionId.set(questionId, true);

    if (question.type === 'multiselect') {
      if (!Array.isArray(rawAnswer.selectedOptions)) {
        errors.push(`${questionId} must use selectedOptions`);
        continue;
      }

      const selectedOptions = rawAnswer.selectedOptions
        .filter(option => typeof option === 'string')
        .map(option => option.trim())
        .filter(Boolean);

      const invalidOptions = selectedOptions.filter(option => !question.options.includes(option));

      if (invalidOptions.length > 0) {
        errors.push(`${questionId} contains invalid options`);
        continue;
      }

      if (question.required && selectedOptions.length === 0) {
        errors.push(`${questionId} is required`);
        continue;
      }

      normalizedAnswers.push({
        questionId,
        selectedOptions
      });
      continue;
    }

    if (question.type === 'url') {
      const link = cleanString(rawAnswer.link || rawAnswer.answerText);

      if (link.length > MAX_LENGTHS.link) {
        errors.push(`${questionId} is too long`);
        continue;
      }

      if (!isValidUrl(link)) {
        errors.push(`${questionId} must be a valid URL`);
        continue;
      }

      if (question.required && !link) {
        errors.push(`${questionId} is required`);
        continue;
      }

      if (link) {
        normalizedAnswers.push({
          questionId,
          link
        });
      }
      continue;
    }

    if (question.type === 'text' || question.type === 'textarea') {
      const answerText = cleanString(rawAnswer.answerText);

      if (answerText.length > MAX_LENGTHS.answerText) {
        errors.push(`${questionId} is too long`);
        continue;
      }

      if (question.required && !answerText) {
        errors.push(`${questionId} is required`);
        continue;
      }

      normalizedAnswers.push({
        questionId,
        answerText
      });
      continue;
    }

    errors.push(`${questionId} has an unsupported question type`);
  }

  for (const question of team.questions) {
    if (question.required && !answersByQuestionId.has(question.id)) {
      errors.push(`${question.id} is required`);
    }
  }

  return normalizedAnswers;
}

function normalizeSubmissionBody(body) {
  const errors = [];

  if (!isPlainObject(body) || hasUnsafeKeys(body)) {
    return {
      errors: ['Invalid submission payload'],
      data: null
    };
  }

  const forbiddenFields = FORBIDDEN_SUBMISSION_FIELDS.filter(field => Object.hasOwn(body, field));

  if (forbiddenFields.length > 0) {
    errors.push('Submission contains fields that cannot be accepted');
  }

  const email = normalizeEmail(body.email);
  const whatsappNumber = normalizePhoneNumber(body.whatsappNumber);
  const hasOtherClubs = body.hasOtherClubs === true;
  const secondaryTeam = cleanString(body.secondaryTeam).toLowerCase();
  const otherClubDetails = hasOtherClubs ? cleanString(body.otherClubDetails) : '';
  const secondaryTeamReason = secondaryTeam ? cleanString(body.secondaryTeamReason) : '';

  const data = {
    fullName: cleanString(body.fullName),
    email,
    whatsappNumber,
    branch: cleanString(body.branch),
    yearOfStudy: cleanString(body.yearOfStudy).toLowerCase(),
    hasOtherClubs,
    otherClubDetails,
    primaryTeam: cleanString(body.primaryTeam).toLowerCase(),
    secondaryTeam,
    secondaryTeamReason,
    whyEcell: cleanString(body.whyEcell),
    whyPrimaryTeam: cleanString(body.whyPrimaryTeam),
    experience: cleanString(body.experience),
    availability: cleanString(body.availability).toLowerCase(),
    confirmationAccepted: body.confirmationAccepted
  };

  pushRequiredStringError(errors, data, 'fullName');
  pushRequiredStringError(errors, data, 'email');
  pushRequiredStringError(errors, data, 'whatsappNumber');
  pushRequiredStringError(errors, data, 'branch');
  pushRequiredStringError(errors, data, 'yearOfStudy');
  pushRequiredStringError(errors, data, 'primaryTeam');
  pushRequiredStringError(errors, data, 'whyEcell');
  pushRequiredStringError(errors, data, 'whyPrimaryTeam');
  pushRequiredStringError(errors, data, 'experience');
  pushRequiredStringError(errors, data, 'availability');

  if (data.otherClubDetails.length > MAX_LENGTHS.otherClubDetails) {
    errors.push('otherClubDetails is too long');
  }

  if (data.secondaryTeamReason.length > MAX_LENGTHS.secondaryTeamReason) {
    errors.push('secondaryTeamReason is too long');
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    errors.push('Enter a valid email address');
  }

  if (!isValidPhoneNumber(data.whatsappNumber)) {
    errors.push('Enter a valid WhatsApp number');
  }

  if (!YEAR_IDS.includes(data.yearOfStudy)) {
    errors.push('yearOfStudy is invalid');
  }

  if (!TEAM_IDS.includes(data.primaryTeam)) {
    errors.push('primaryTeam is invalid');
  }

  if (data.secondaryTeam && !TEAM_IDS.includes(data.secondaryTeam)) {
    errors.push('secondaryTeam is invalid');
  }

  if (data.secondaryTeam && data.secondaryTeam === data.primaryTeam) {
    errors.push('Choose a different team for your second preference');
  }

  if (!AVAILABILITY_IDS.includes(data.availability)) {
    errors.push('availability is invalid');
  }

  if (data.confirmationAccepted !== true) {
    errors.push('confirmationAccepted must be true');
  }

  const teamAnswers = normalizeTeamAnswers(body.teamAnswers, data.primaryTeam, errors);

  const applicationData = {
    fullName: data.fullName,
    email: data.email,
    whatsappNumber: data.whatsappNumber,
    branch: data.branch,
    yearOfStudy: data.yearOfStudy,
    hasOtherClubs: data.hasOtherClubs,
    primaryTeam: data.primaryTeam,
    whyEcell: data.whyEcell,
    whyPrimaryTeam: data.whyPrimaryTeam,
    experience: data.experience,
    availability: data.availability,
    teamAnswers,
    confirmationAccepted: data.confirmationAccepted
  };

  if (data.otherClubDetails) {
    applicationData.otherClubDetails = data.otherClubDetails;
  }

  if (data.secondaryTeam) {
    applicationData.secondaryTeam = data.secondaryTeam;
  }

  if (data.secondaryTeamReason) {
    applicationData.secondaryTeamReason = data.secondaryTeamReason;
  }

  return {
    errors,
    data: applicationData
  };
}

function isDuplicateKeyError(error) {
  return error?.code === 11000;
}

function isApplicationCodeCollision(error) {
  return isDuplicateKeyError(error) && Boolean(error?.keyPattern?.applicationCode);
}

function isApplicantDuplicate(error) {
  if (!isDuplicateKeyError(error)) {
    return false;
  }

  return Boolean(error?.keyPattern?.email || error?.keyPattern?.whatsappNumber);
}

async function createApplicationWithCodeRetry(applicationData) {
  for (let attempt = 0; attempt < APPLICATION_CODE_COLLISION_ATTEMPTS; attempt += 1) {
    try {
      const application = new Application2026(applicationData);
      await application.save();
      return application;
    } catch (error) {
      if (isApplicationCodeCollision(error) && attempt < APPLICATION_CODE_COLLISION_ATTEMPTS - 1) {
        continue;
      }

      throw error;
    }
  }

  throw new Error('Application code generation failed');
}

export async function POST(request) {
  try {
    await dbConnect();

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid JSON payload', 400);
    }

    const validation = normalizeSubmissionBody(body);

    if (validation.errors.length > 0) {
      return jsonError(validation.errors[0], 400);
    }

    const existingApplication = await Application2026.exists({
      recruitmentCycle: RECRUITMENT_CYCLE,
      $or: [
        { email: validation.data.email },
        { whatsappNumber: validation.data.whatsappNumber }
      ]
    });

    if (existingApplication) {
      return Response.json(
        { error: 'An application already exists with this email or WhatsApp number.' },
        { status: 409 }
      );
    }

    const application = await createApplicationWithCodeRetry(validation.data);

    return Response.json(
      { 
        success: true,
        applicationCode: application.applicationCode,
        primaryTeam: application.primaryTeam,
        status: application.status
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Application submission error:', error);

    if (isApplicantDuplicate(error)) {
      return Response.json(
        { error: 'An application already exists with this email or WhatsApp number.' },
        { status: 409 }
      );
    }

    if (isApplicationCodeCollision(error)) {
      return Response.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    return Response.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (role) {
      filter.$or = [
        { primaryRole: { $regex: role, $options: 'i' } },
        { secondaryRole: { $regex: role, $options: 'i' } }
      ];
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { whatsappNumber: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Filter:', JSON.stringify(filter));

    const applications = await Application.find(filter)
      .sort({ submittedAt: -1 });

    console.log('Applications found:', applications.length);

    const total = applications.length;

    return Response.json({
      applications,
      total
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return Response.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
});
