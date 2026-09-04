import dbConnect from '../../../../../lib/mongodb';
import { requireAuth } from '../../../../../lib/auth';
import Application2026 from '../../../../../models/Application2026';
import {
  RECRUITMENT_CYCLE,
  STATUS_IDS,
  TEAM_IDS,
  YEAR_IDS
} from '../../../../../lib/recruitment2026';

function seedCounts(ids) {
  return Object.fromEntries(ids.map(id => [id, 0]));
}

function toCountObject(rows, seed = {}) {
  return rows.reduce((counts, row) => {
    if (row._id) {
      counts[row._id] = row.count;
    }

    return counts;
  }, { ...seed });
}

export const GET = requireAuth(async function GET() {
  try {
    await dbConnect();

    const cycleFilter = { recruitmentCycle: RECRUITMENT_CYCLE };
    const [statusRows, teamRows, branchRows, yearRows, total] = await Promise.all([
      Application2026.aggregate([
        { $match: cycleFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Application2026.aggregate([
        { $match: cycleFilter },
        { $group: { _id: '$primaryTeam', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Application2026.aggregate([
        { $match: cycleFilter },
        { $group: { _id: '$branch', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Application2026.aggregate([
        { $match: cycleFilter },
        { $group: { _id: '$yearOfStudy', count: { $sum: 1 } } }
      ]),
      Application2026.countDocuments(cycleFilter)
    ]);

    const statusStats = toCountObject(statusRows, seedCounts(STATUS_IDS));
    const teamStats = toCountObject(teamRows, seedCounts(TEAM_IDS));
    const yearStatsObject = toCountObject(yearRows, seedCounts(YEAR_IDS));

    return Response.json({
      total,
      statusStats,
      teamStats,
      primaryTeamStats: teamRows,
      branchStats: branchRows,
      yearStats: Object.entries(yearStatsObject).map(([yearOfStudy, count]) => ({
        _id: yearOfStudy,
        count
      }))
    });
  } catch (error) {
    console.error('Stats error:', error);
    return Response.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
});
