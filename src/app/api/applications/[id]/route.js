import dbConnect from '../../../../../lib/mongodb';
import { requireAuth } from '../../../../../lib/auth';
import Application2026 from '../../../../../models/Application2026';
import {
  AVAILABILITY_IDS,
  STATUS_IDS,
  TEAM_IDS,
  YEAR_IDS,
  normalizePhoneNumber
} from '../../../../../lib/recruitment2026';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function jsonError(error, status = 400) {
  return Response.json({ error }, { status });
}

function normalizeEmail(value) {
  return cleanString(value).toLowerCase();
}

function isValidPhoneNumber(value) {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

function appendStringUpdate(updateData, body, field) {
  if (Object.hasOwn(body, field)) {
    updateData[field] = cleanString(body[field]);
  }
}

function buildAdminUpdate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid update payload' };
  }

  const updateData = {};

  if (Object.hasOwn(body, 'status')) {
    const status = cleanString(body.status);

    if (!STATUS_IDS.includes(status)) {
      return { error: 'status is invalid' };
    }

    updateData.status = status;
  }

  appendStringUpdate(updateData, body, 'internalNotes');
  appendStringUpdate(updateData, body, 'fullName');
  appendStringUpdate(updateData, body, 'branch');
  appendStringUpdate(updateData, body, 'otherClubDetails');
  appendStringUpdate(updateData, body, 'secondaryTeamReason');
  appendStringUpdate(updateData, body, 'whyEcell');
  appendStringUpdate(updateData, body, 'whyPrimaryTeam');
  appendStringUpdate(updateData, body, 'experience');

  if (Object.hasOwn(body, 'email')) {
    const email = normalizeEmail(body.email);

    if (!EMAIL_PATTERN.test(email)) {
      return { error: 'email is invalid' };
    }

    updateData.email = email;
  }

  if (Object.hasOwn(body, 'whatsappNumber')) {
    const whatsappNumber = normalizePhoneNumber(body.whatsappNumber);

    if (!isValidPhoneNumber(whatsappNumber)) {
      return { error: 'whatsappNumber is invalid' };
    }

    updateData.whatsappNumber = whatsappNumber;
  }

  if (Object.hasOwn(body, 'hasOtherClubs')) {
    updateData.hasOtherClubs = body.hasOtherClubs === true;
  }

  if (Object.hasOwn(body, 'yearOfStudy')) {
    const yearOfStudy = cleanString(body.yearOfStudy).toLowerCase();

    if (!YEAR_IDS.includes(yearOfStudy)) {
      return { error: 'yearOfStudy is invalid' };
    }

    updateData.yearOfStudy = yearOfStudy;
  }

  if (Object.hasOwn(body, 'primaryTeam')) {
    const primaryTeam = cleanString(body.primaryTeam).toLowerCase();

    if (!TEAM_IDS.includes(primaryTeam)) {
      return { error: 'primaryTeam is invalid' };
    }

    updateData.primaryTeam = primaryTeam;
  }

  if (Object.hasOwn(body, 'secondaryTeam')) {
    const secondaryTeam = cleanString(body.secondaryTeam).toLowerCase();

    if (secondaryTeam && !TEAM_IDS.includes(secondaryTeam)) {
      return { error: 'secondaryTeam is invalid' };
    }

    updateData.secondaryTeam = secondaryTeam || undefined;
  }

  if (Object.hasOwn(body, 'availability')) {
    const availability = cleanString(body.availability).toLowerCase();

    if (!AVAILABILITY_IDS.includes(availability)) {
      return { error: 'availability is invalid' };
    }

    updateData.availability = availability;
  }

  const nextPrimaryTeam = updateData.primaryTeam;
  const nextSecondaryTeam = updateData.secondaryTeam;

  if (nextPrimaryTeam && nextSecondaryTeam && nextPrimaryTeam === nextSecondaryTeam) {
    return { error: 'secondaryTeam must be different from primaryTeam' };
  }

  if (Object.keys(updateData).length === 0) {
    return { error: 'No supported fields to update' };
  }

  return { updateData };
}

export const GET = requireAuth(async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const application = await Application2026.findById(id).select('-__v').lean();

    if (!application) {
      return jsonError('Application not found', 404);
    }

    return Response.json({ application });
  } catch (error) {
    console.error('Fetch application error:', error);
    return jsonError('Failed to fetch application', 500);
  }
});

export const PUT = requireAuth(async function PUT(request, { params }) {
  try {
    await dbConnect();

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid JSON payload', 400);
    }

    const { updateData, error } = buildAdminUpdate(body);

    if (error) {
      return jsonError(error, 400);
    }

    const { id } = await params;
    const application = await Application2026.findById(id).select('-__v');

    if (!application) {
      return jsonError('Application not found', 404);
    }

    const nextPrimaryTeam = updateData.primaryTeam ?? application.primaryTeam;
    const nextSecondaryTeam = updateData.secondaryTeam ?? application.secondaryTeam;

    if (nextSecondaryTeam && nextPrimaryTeam === nextSecondaryTeam) {
      return jsonError('secondaryTeam must be different from primaryTeam', 400);
    }

    Object.entries(updateData).forEach(([field, value]) => {
      application[field] = value;
    });

    await application.save();

    return Response.json({
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);

    if (error?.code === 11000) {
      return jsonError('An application already exists with this email or WhatsApp number.', 409);
    }

    return jsonError('Failed to update application', 500);
  }
});

export const DELETE = requireAuth(async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const application = await Application2026.findByIdAndDelete(id);

    if (!application) {
      return jsonError('Application not found', 404);
    }

    return Response.json({
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    return jsonError('Failed to delete application', 500);
  }
});
