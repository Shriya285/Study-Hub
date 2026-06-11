export const DEFAULT_SCHEDULE = [
  { id: 's1',  start: '08:00', end: '08:10',  label: 'Warm Up',         subtitle: 'Review notes, plan today\'s targets',               isBreak: false, icon: 'sun',        durationLabel: '10m'    },
  { id: 's2',  start: '08:10', end: '10:10',  label: 'DSA Block 1',     subtitle: 'LeetCode — arrays, strings, sliding window',         isBreak: false, icon: 'code',       durationLabel: '2h'     },
  { id: 's3',  start: '10:30', end: '10:45',  label: 'Break',           subtitle: 'Step away from screen',                             isBreak: true,  icon: 'coffee',     durationLabel: '15m'    },
  { id: 's4',  start: '10:45', end: '12:15',  label: 'CS Fundamentals', subtitle: 'OS · DBMS · Networks · OOP — MCQ style',            isBreak: false, icon: 'book',       durationLabel: '1h 30m' },
  { id: 's5',  start: '12:15', end: '13:15',  label: 'Lunch',           subtitle: 'Full break — no screens',                          isBreak: true,  icon: 'utensils',   durationLabel: '1h'     },
  { id: 's6',  start: '13:15', end: '14:45',  label: 'Mock OA',         subtitle: '3 problems, 90 min, no hints',                     isBreak: false, icon: 'terminal-2', durationLabel: '1h 30m' },
  { id: 's7',  start: '14:45', end: '15:00',  label: 'Break',           subtitle: 'Walk, stretch',                                    isBreak: true,  icon: 'coffee',     durationLabel: '15m'    },
  { id: 's8',  start: '15:00', end: '16:00',  label: 'DSA Block 2',     subtitle: 'Trees, graphs, DP — harder problems',               isBreak: false, icon: 'bolt',       durationLabel: '1h'     },
  { id: 's9',  start: '16:00', end: '16:45',  label: 'Applications',    subtitle: 'Cisco, Atlassian, NetApp, Intuit',                  isBreak: false, icon: 'send',       durationLabel: '45m'    },
  { id: 's10', start: '16:45', end: '17:00',  label: 'Break',           subtitle: '',                                                 isBreak: true,  icon: 'coffee',     durationLabel: '15m'    },
  { id: 's11', start: '17:00', end: '17:45',  label: 'Review',          subtitle: 'Fix mistakes, write what you learned',             isBreak: false, icon: 'pencil',     durationLabel: '45m'    },
]

export const DEFAULT_GOALS = [
  { id: 'g1', label: 'Solve 2 LeetCode problems',           xp: 30 },
  { id: 'g2', label: 'Cover 1 CS Fundamentals topic',       xp: 30 },
  { id: 'g3', label: "Review and fix yesterday's mistakes", xp: 25 },
  { id: 'g4', label: 'Submit 1 job application',            xp: 20 },
  { id: 'g5', label: 'Log what I learned today',            xp: 15 },
]

export const DEFAULT_RESOURCES = [
  { id: 'r1', label: 'LeetCode',    url: 'https://leetcode.com/problemset/',            icon: 'code'          },
  { id: 'r2', label: 'NeetCode',    url: 'https://neetcode.io/practice',                icon: 'list-check'    },
  { id: 'r3', label: 'Cisco Prep',  url: 'https://dsa-prep-app.vercel.app/',            icon: 'device-laptop' },
  { id: 'r4', label: 'CS Fund.',    url: 'https://dsa-prep-app.vercel.app/cs',          icon: 'book'          },
  { id: 'r5', label: 'StudyForge',  url: 'https://study-forge2-0-six.vercel.app/',      icon: 'school'        },
  { id: 'r6', label: 'Learn2Build', url: 'https://learn2-build.vercel.app/',            icon: 'rocket'        },
  { id: 'r7', label: 'Job Tracker', url: 'https://job-searcher-z2f1.vercel.app/',       icon: 'briefcase'     },
  { id: 'r8', label: 'Resume',      url: 'https://www.overleaf.com/project',            icon: 'file-text'     },
]

export const DEFAULT_TROPHIES = {
  firstDay:   false,
  streak3:    false,
  problems50: false,
  streak7:    false,
  streak14:   false,
  streak30:   false,
}

export const XP_LEVELS = [
  { level: 1, title: 'Beginner',             threshold: 0    },
  { level: 2, title: 'Code Curious',         threshold: 100  },
  { level: 3, title: 'Problem Solver',       threshold: 250  },
  { level: 4, title: 'Algorithm Apprentice', threshold: 500  },
  { level: 5, title: 'Sprint Warrior',       threshold: 850  },
  { level: 6, title: 'Placement Ready',      threshold: 1300 },
]
