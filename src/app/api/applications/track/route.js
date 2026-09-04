import dbConnect from '../../../../../lib/mongodb';
import Application2026 from '../../../../../models/Application2026';
import { RECRUITMENT_CYCLE } from '../../../../../lib/recruitment2026';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APPLICATION_CODE_PATTERN = /^EC26-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/;

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value) {
  return cleanString(value).toLowerCase();
}

function normalizeApplicationCode(value) {
  return cleanString(value).toUpperCase();
}

function notFoundResponse() {
  return Response.json(
    { error: 'Application not found' },
    { status: 404 }
  );
}

function getFirstName(fullName) {
  return cleanString(fullName).split(/\s+/)[0] || '';
}

export async function POST(request) {
  try {
    await dbConnect();

    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const applicationCode = normalizeApplicationCode(body?.applicationCode);
    const email = normalizeEmail(body?.email);

    if (!APPLICATION_CODE_PATTERN.test(applicationCode) || !EMAIL_PATTERN.test(email)) {
      return notFoundResponse();
    }

    const application = await Application2026.findOne({
      applicationCode,
      email,
      recruitmentCycle: RECRUITMENT_CYCLE
    }).select('applicationCode fullName primaryTeam status').lean();

    if (!application) {
      return notFoundResponse();
    }

    return Response.json({
      application: {
        applicationCode: application.applicationCode,
        firstName: getFirstName(application.fullName),
        primaryTeam: application.primaryTeam,
        status: application.status
      }
    });
  } catch (error) {
    console.error('Track application error:', error);
    return Response.json(
      { error: 'Failed to track application' },
      { status: 500 }
    );
  }
}
