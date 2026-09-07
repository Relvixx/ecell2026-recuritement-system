import mongoose from 'mongoose';
import {
  AVAILABILITY_IDS,
  BRANCH_IDS,
  RECRUITMENT_CYCLE,
  STATUS_IDS,
  TEAM_IDS,
  YEAR_IDS,
  generateUniqueApplicationCode,
  normalizePhoneNumber
} from '../lib/recruitment2026';

const TeamAnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[a-z0-9_]+$/
  },
  answerText: {
    type: String,
    trim: true
  },
  selectedOptions: [{
    type: String,
    trim: true
  }],
  link: {
    type: String,
    trim: true
  }
}, {
  _id: false
});

const Application2026Schema = new mongoose.Schema({
  // Identity
  applicationCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    match: /^EC26-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/
  },
  recruitmentCycle: {
    type: String,
    required: true,
    trim: true,
    default: RECRUITMENT_CYCLE,
    enum: [RECRUITMENT_CYCLE],
    immutable: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  whatsappNumber: {
    type: String,
    required: true,
    trim: true,
    set: normalizePhoneNumber
  },
  branch: {
    type: String,
    required: true,
    trim: true,
    enum: BRANCH_IDS
  },
  yearOfStudy: {
    type: String,
    required: true,
    enum: YEAR_IDS
  },

  // Club context
  hasOtherClubs: {
    type: Boolean,
    required: true,
    default: false
  },
  otherClubDetails: {
    type: String,
    trim: true
  },

  // Team preferences
  primaryTeam: {
    type: String,
    required: true,
    enum: TEAM_IDS
  },
  secondaryTeam: {
    type: String,
    enum: TEAM_IDS
  },
  secondaryTeamReason: {
    type: String,
    trim: true
  },

  // Common application answers
  whyEcell: {
    type: String,
    required: true,
    trim: true
  },
  whyPrimaryTeam: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: String,
    required: true,
    enum: AVAILABILITY_IDS
  },

  // Team-specific answers
  teamAnswers: {
    type: [TeamAnswerSchema],
    default: []
  },

  // Confirmation
  confirmationAccepted: {
    type: Boolean,
    required: true,
    validate: {
      validator: value => value === true,
      message: 'Application confirmation must be accepted'
    }
  },

  // Admin
  status: {
    type: String,
    required: true,
    enum: STATUS_IDS,
    default: 'submitted'
  },
  internalNotes: {
    type: String,
    trim: true
  },

  // Timing
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'applications_2026'
});

Application2026Schema.pre('validate', async function assignApplicationCode(next) {
  if (this.applicationCode) {
    this.applicationCode = this.applicationCode.toUpperCase().trim();
    return next();
  }

  try {
    this.applicationCode = await generateUniqueApplicationCode(this.constructor);
    return next();
  } catch (error) {
    return next(error);
  }
});

Application2026Schema.path('secondaryTeam').validate(function validateSecondaryTeam(value) {
  return !value || value !== this.primaryTeam;
}, 'Secondary team must be different from primary team');

Application2026Schema.index({ applicationCode: 1 }, { unique: true });
Application2026Schema.index({ recruitmentCycle: 1, email: 1 }, { unique: true });
Application2026Schema.index({ recruitmentCycle: 1, whatsappNumber: 1 }, { unique: true });
Application2026Schema.index({ status: 1 });
Application2026Schema.index({ primaryTeam: 1 });
Application2026Schema.index({ yearOfStudy: 1 });
Application2026Schema.index({ branch: 1 });
Application2026Schema.index({ submittedAt: -1 });

export default mongoose.models.Application2026 ||
  mongoose.model('Application2026', Application2026Schema);
