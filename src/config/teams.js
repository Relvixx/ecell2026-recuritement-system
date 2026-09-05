import { TEAM_IDS } from './canonical';
import { TEAM_ACCENT_TOKENS } from '../lib/design-system';

export const TEAM_REASSURANCE = "You don't need to know everything already. Curiosity and willingness to learn matter.";

export const TEAMS = [
  {
    id: 'technical',
    name: 'Technical',
    tagline: 'The Builders',
    shortDescription: 'Build the digital systems, tools and tech behind E-CELL.',
    description: "The Technical team works on the technology that keeps E-CELL moving-from websites and registration systems to automation, event tech and internal tools.",
    idealFor: "You may fit here if you enjoy building things, solving problems, experimenting with technology or figuring out why something isn't working.",
    whatWeDo: [
      'Websites',
      'Registration systems',
      'Automation',
      'Internal tools',
      'Event technology',
      'Technical troubleshooting',
      'New experiments'
    ],
    mayWorkOn: [
      'Websites',
      'Registration systems',
      'Automation',
      'Internal tools',
      'Event technology',
      'Technical troubleshooting',
      'New experiments'
    ],
    reassurance: TEAM_REASSURANCE,
    visual: {
      motif: ['nodes', 'grid', 'terminal fragments', 'connection diagrams'],
      accent: 'powder_blue'
    },
    questions: [
      {
        id: 'technical_tools_tried',
        type: 'multiselect',
        label: 'What technologies or tools have you tried?',
        required: true,
        options: [
          'HTML / CSS',
          'JavaScript',
          'React / Next.js',
          'Python',
          'Git / GitHub',
          'Databases',
          'Arduino / Hardware',
          'AI tools',
          'Other',
          "I'm just getting started"
        ]
      },
      {
        id: 'technical_project_attempt',
        type: 'textarea',
        label: "Tell us about something technical you've tried or built-even if it didn't fully work.",
        helper: "We're interested in how you explore and solve problems, not just finished projects.",
        required: true
      },
      {
        id: 'technical_project_link',
        type: 'url',
        label: 'Project / GitHub / portfolio link',
        required: false
      }
    ]
  },
  {
    id: 'design',
    name: 'Design',
    tagline: 'The Visual Thinkers',
    shortDescription: 'Turn ideas into visuals people remember.',
    description: 'The Design team shapes how E-CELL looks and feels-from event identities and posters to presentations, social creatives and digital experiences.',
    idealFor: 'You may fit here if you notice visual details, enjoy experimenting with layouts or aesthetics, and like turning rough ideas into something clear and memorable.',
    whatWeDo: [
      'Event branding',
      'Posters',
      'Social creatives',
      'Presentations',
      'UI visuals',
      'Campaign identities',
      'Merchandise'
    ],
    mayWorkOn: [
      'Event branding',
      'Posters',
      'Social creatives',
      'Presentations',
      'UI visuals',
      'Campaign identities',
      'Merchandise'
    ],
    reassurance: TEAM_REASSURANCE,
    visual: {
      motif: ['abstract shapes', 'typography blocks', 'composition guides'],
      accent: 'lavender'
    },
    questions: [
      {
        id: 'design_interests',
        type: 'multiselect',
        label: 'What kind of design work interests you most?',
        required: true,
        options: [
          'Posters',
          'Branding',
          'Social Media',
          'UI/UX',
          'Presentations',
          'Video / Motion',
          'Other'
        ]
      },
      {
        id: 'design_event_identity',
        type: 'textarea',
        label: 'E-CELL announces a major event tomorrow. How would you make its visual identity stand out?',
        required: true
      },
      {
        id: 'design_portfolio_link',
        type: 'url',
        label: 'Portfolio / sample work',
        helper: 'Behance, Drive, Canva, Instagram or any accessible link. Optional.',
        required: false
      }
    ]
  },
  {
    id: 'documentation',
    name: 'Documentation',
    tagline: 'The Story Keepers',
    shortDescription: 'Turn messy information into something clear, useful and lasting.',
    description: 'Documentation keeps E-CELL organised and helps important work survive beyond the event itself. The team creates reports, proposals, records and structured written material.',
    idealFor: 'You may fit here if you enjoy organising information, writing clearly, spotting missing details or turning chaos into structure.',
    whatWeDo: [
      'Event reports',
      'Proposals',
      'Meeting records',
      'Competition documentation',
      'Official content',
      'Structured archives'
    ],
    mayWorkOn: [
      'Event reports',
      'Proposals',
      'Meeting records',
      'Competition documentation',
      'Official content',
      'Structured archives'
    ],
    reassurance: TEAM_REASSURANCE,
    visual: {
      motif: ['paper', 'annotations', 'underline', 'document marks'],
      accent: 'peach_warm_cream'
    },
    questions: [
      {
        id: 'documentation_report_process',
        type: 'textarea',
        label: 'An event ends with messy notes, photos and scattered information. How would you turn that into a clean report?',
        required: true
      },
      {
        id: 'documentation_priority',
        type: 'textarea',
        label: 'Which matters most in good documentation-clarity, detail or speed? Why?',
        required: true
      },
      {
        id: 'documentation_sample_link',
        type: 'url',
        label: 'Writing / documentation sample',
        required: false
      }
    ]
  },
  {
    id: 'social_media',
    name: 'Social Media',
    tagline: 'The Attention Engineers',
    shortDescription: "Turn what's happening inside E-CELL into content people want to stop and watch.",
    description: "The Social Media team translates E-CELL's work into posts, reels, stories and campaigns that people actually notice.",
    idealFor: 'You may fit here if you understand online culture, enjoy content creation, notice trends or instinctively think, "this would make a good post."',
    whatWeDo: [
      'Instagram',
      'Reels',
      'Campaigns',
      'Content calendars',
      'Captions',
      'Event coverage',
      'Community engagement'
    ],
    mayWorkOn: [
      'Instagram',
      'Reels',
      'Campaigns',
      'Content calendars',
      'Captions',
      'Event coverage',
      'Community engagement'
    ],
    reassurance: TEAM_REASSURANCE,
    visual: {
      motif: ['feed frame', 'motion frame', 'crop marks', 'content tiles'],
      accent: 'blush_pink'
    },
    questions: [
      {
        id: 'social_media_content_pitch',
        type: 'textarea',
        label: 'Pitch one Reel or Post idea that could make students curious about E-CELL.',
        required: true
      },
      {
        id: 'social_media_platforms',
        type: 'multiselect',
        label: 'Which content formats or platforms do you understand best?',
        required: true,
        options: [
          'Instagram',
          'Reels',
          'Short-form video',
          'Memes',
          'LinkedIn',
          'Photography',
          'Copywriting',
          'Other'
        ]
      },
      {
        id: 'social_media_sample_link',
        type: 'url',
        label: 'Content sample / account link',
        required: false
      }
    ]
  },
  {
    id: 'pr',
    name: 'PR',
    tagline: 'The Connectors',
    shortDescription: 'Build the conversations and relationships that take E-CELL beyond campus.',
    description: 'PR handles outreach and external communication-connecting E-CELL with speakers, founders, organisations, partners and opportunities.',
    idealFor: "You may fit here if you communicate clearly, aren't afraid to approach new people, and enjoy building genuine professional relationships.",
    whatWeDo: [
      'Speaker outreach',
      'External communication',
      'Partnership conversations',
      'Guest coordination',
      'Professional messaging',
      'Relationship management'
    ],
    mayWorkOn: [
      'Speaker outreach',
      'External communication',
      'Partnership conversations',
      'Guest coordination',
      'Professional messaging',
      'Relationship management'
    ],
    reassurance: TEAM_REASSURANCE,
    visual: {
      motif: ['connection lines', 'speech fragments', 'linked nodes'],
      accent: 'soft_coral_peach'
    },
    questions: [
      {
        id: 'pr_founder_outreach',
        type: 'textarea',
        label: 'E-CELL wants to invite a startup founder who has never heard of us. How would you approach them?',
        required: true
      },
      {
        id: 'pr_message_opening',
        type: 'textarea',
        label: "Write the first 2-3 lines of the message you'd send.",
        required: true
      }
    ]
  },
  {
    id: 'event',
    name: 'Event',
    tagline: 'The Executors',
    shortDescription: 'Turn plans on paper into experiences that actually happen.',
    description: 'The Event team owns execution-from planning timelines and coordinating people to handling the last-minute problems nobody saw coming.',
    idealFor: 'You may fit here if you enjoy responsibility, coordination, working with people and staying useful when plans suddenly change.',
    whatWeDo: [
      'Event planning',
      'Volunteer coordination',
      'Logistics',
      'Timelines',
      'On-ground execution',
      'Problem solving',
      'Event operations'
    ],
    mayWorkOn: [
      'Event planning',
      'Volunteer coordination',
      'Logistics',
      'Timelines',
      'On-ground execution',
      'Problem solving',
      'Event operations'
    ],
    reassurance: TEAM_REASSURANCE,
    visual: {
      motif: ['ticket', 'timeline', 'stage marks', 'checklist'],
      accent: 'butter_yellow'
    },
    questions: [
      {
        id: 'event_last_minute_response',
        type: 'textarea',
        label: "An event starts in 30 minutes. One volunteer is absent and an important setup isn't ready. What would you do first?",
        required: true
      },
      {
        id: 'event_responsibility_example',
        type: 'textarea',
        label: 'Tell us about a time you organised, coordinated or took responsibility for something.',
        helper: "It doesn't have to be a college event.",
        required: true
      }
    ]
  },
  {
    id: 'research',
    name: 'Research',
    tagline: 'The Insight Lab',
    shortDescription: 'Find the information that helps better decisions happen.',
    description: 'The Research team explores startups, industries, competitions, speakers, opportunities and other information that helps E-CELL decide what is worth pursuing.',
    idealFor: "You may fit here if you're naturally curious, enjoy digging deeper than the first Google result, and care about whether information is actually reliable.",
    whatWeDo: [
      'Startup research',
      'Industry research',
      'Opportunity discovery',
      'Speaker/company research',
      'Market insights',
      'Research reports',
      'Information verification'
    ],
    mayWorkOn: [
      'Startup research',
      'Industry research',
      'Opportunity discovery',
      'Speaker/company research',
      'Market insights',
      'Research reports',
      'Information verification'
    ],
    reassurance: TEAM_REASSURANCE,
    visual: {
      motif: ['magnifier', 'highlight marks', 'notes', 'map / research fragments'],
      accent: 'sage_mint'
    },
    questions: [
      {
        id: 'research_curiosity_process',
        type: 'textarea',
        label: 'Tell us about something you recently became curious about. How did you find information you could trust?',
        required: true
      },
      {
        id: 'research_startup_shortlist',
        type: 'textarea',
        label: "You're asked to shortlist 10 startups for an E-CELL event. How would you decide which ones are worth approaching?",
        required: true
      }
    ]
  }
];

export const TEAMS_BY_ID = Object.fromEntries(TEAMS.map(team => [team.id, team]));

export const TEAM_VISUAL_TOKENS = TEAM_ACCENT_TOKENS;

export function getTeamAccent(teamId) {
  return TEAM_VISUAL_TOKENS[teamId] || null;
}

export function getTeamById(teamId) {
  return TEAMS_BY_ID[teamId] || null;
}

const configuredTeamIds = TEAMS.map(team => team.id);
const missingTeamIds = TEAM_IDS.filter(teamId => !configuredTeamIds.includes(teamId));
const extraTeamIds = configuredTeamIds.filter(teamId => !TEAM_IDS.includes(teamId));

if (missingTeamIds.length > 0 || extraTeamIds.length > 0) {
  throw new Error('2026 team config does not match canonical team IDs');
}
