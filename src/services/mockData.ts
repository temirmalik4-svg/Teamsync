// TeamSync - Výchozí testovací data pro amatérský tým
import { FineEntry, FineRule, MatchLineup, TeamEvent, User, AttendanceRecord } from '../types';
import { FineService } from './fines';
import { LineupService } from './lineup';

export const MOCK_TEAM = {
  id: 'team-1',
  name: 'FC Sokol Lhota',
  code: 'LHO-2026',
  logoUrl: '⚽',
};

export const MOCK_USERS: User[] = [
  { id: 'u-coach', teamId: 'team-1', email: 'trener@teamsync.cz', name: 'Karel Vlach', role: 'COACH', phone: '+420 777 111 222' },
  { id: 'u-capt', teamId: 'team-1', email: 'kapitan@teamsync.cz', name: 'Tomáš Řepka', nickname: 'Blikanec', jerseyNumber: 2, position: 'DEF', role: 'CAPTAIN', phone: '+420 777 333 444' },
  { id: 'u-1', teamId: 'team-1', email: 'cech@teamsync.cz', name: 'Petr Čáp', nickname: 'Helma', jerseyNumber: 1, position: 'GK', role: 'PLAYER', phone: '+420 777 001 001' },
  { id: 'u-2', teamId: 'team-1', email: 'jankul@teamsync.cz', name: 'Marek Jánský', nickname: 'Jankul', jerseyNumber: 6, position: 'DEF', role: 'PLAYER' },
  { id: 'u-3', teamId: 'team-1', email: 'kovac@teamsync.cz', name: 'Radek Kovář', nickname: 'Kovy', jerseyNumber: 4, position: 'DEF', role: 'PLAYER' },
  { id: 'u-4', teamId: 'team-1', email: 'gryg@teamsync.cz', name: 'Zdeněk Grygar', nickname: 'Zdéňa', jerseyNumber: 3, position: 'DEF', role: 'PLAYER' },
  { id: 'u-5', teamId: 'team-1', email: 'nedved@teamsync.cz', name: 'Pavel Novák', nickname: 'Méďa', jerseyNumber: 11, position: 'MID', role: 'PLAYER' },
  { id: 'u-6', teamId: 'team-1', email: 'smicer@teamsync.cz', name: 'Vláďa Šmíd', nickname: 'Šmíca', jerseyNumber: 7, position: 'MID', role: 'PLAYER' },
  { id: 'u-7', teamId: 'team-1', email: 'rosicky@teamsync.cz', name: 'Tomáš Rosa', nickname: 'Malý Mozart', jerseyNumber: 10, position: 'MID', role: 'PLAYER' },
  { id: 'u-8', teamId: 'team-1', email: 'pobor@teamsync.cz', name: 'Karel Pospíšil', nickname: 'Kája', jerseyNumber: 8, position: 'MID', role: 'PLAYER' },
  { id: 'u-9', teamId: 'team-1', email: 'baros@teamsync.cz', name: 'Milan Bárta', nickname: 'Bary', jerseyNumber: 9, position: 'FWD', role: 'PLAYER' },
  { id: 'u-10', teamId: 'team-1', email: 'koller@teamsync.cz', name: 'Jan Kolomazník', nickname: 'Dino', jerseyNumber: 19, position: 'FWD', role: 'PLAYER' },
  { id: 'u-11', teamId: 'team-1', email: 'lafata@teamsync.cz', name: 'David Láfka', nickname: 'Lafy', jerseyNumber: 21, position: 'FWD', role: 'PLAYER' },
  { id: 'u-12', teamId: 'team-1', email: 'hubsch@teamsync.cz', name: 'Tomáš Hubáček', nickname: 'Hubička', jerseyNumber: 17, position: 'MID', role: 'PLAYER' },
];

export const MOCK_EVENTS: TeamEvent[] = [
  {
    id: 'ev-match-1',
    teamId: 'team-1',
    type: 'MATCH',
    title: 'Mistrovský zápas: FC Sokol Lhota vs. FK Slavoj Vršovice',
    description: 'Boj o 1. místo tabulky! Přijďte včas, soupeř hraje tvrdý fotbal.',
    location: 'Hlavní stadion Lhota, Travnaté hřiště č. 1',
    isHome: true,
    opponent: 'FK Slavoj Vršovice',
    meetTime: '2026-10-31T13:30:00',
    startTime: '2026-10-31T15:00:00',
    endTime: '2026-10-31T17:00:00',
    isFinished: false,
  },
  {
    id: 'ev-train-1',
    teamId: 'team-1',
    type: 'TRAINING',
    title: 'Předzápasový trénink + nácvik standardek',
    description: 'Lehčí trénink, střelba a nácvik rohů. Všichni povinně chrániče.',
    location: 'Tréninkové hřiště s umělou trávou',
    isHome: true,
    meetTime: '2026-10-29T17:45:00',
    startTime: '2026-10-29T18:00:00',
    endTime: '2026-10-29T19:30:00',
    isFinished: false,
  },
  // Proběhlé události pro výpočet měsíční docházky
  {
    id: 'ev-past-1',
    teamId: 'team-1',
    type: 'TRAINING',
    title: 'Trénink - Kondice a hra',
    location: 'Hlavní hřiště',
    isHome: true,
    startTime: '2026-10-06T18:00:00',
    isFinished: true,
  },
  {
    id: 'ev-past-2',
    teamId: 'team-1',
    type: 'TRAINING',
    title: 'Trénink - Herní kombinace',
    location: 'Hlavní hřiště',
    isHome: true,
    startTime: '2026-10-13T18:00:00',
    isFinished: true,
  },
  {
    id: 'ev-past-3',
    teamId: 'team-1',
    type: 'TRAINING',
    title: 'Trénink - Taktika a střelba',
    location: 'Hlavní hřiště',
    isHome: true,
    startTime: '2026-10-20T18:00:00',
    isFinished: true,
  },
  {
    id: 'ev-past-4',
    teamId: 'team-1',
    type: 'MATCH',
    title: 'Zápas vs SK Rapid (výhra 3:1)',
    location: 'Hřiště Rapid',
    isHome: false,
    opponent: 'SK Rapid',
    startTime: '2026-10-24T14:30:00',
    isFinished: true,
  },
];

export const MOCK_ATTENDANCES: AttendanceRecord[] = [
  // Hráč u-capt (Tomáš Řepka) - 100%
  { id: 'att-1', eventId: 'ev-past-1', userId: 'u-capt', status: 'PRESENT' },
  { id: 'att-2', eventId: 'ev-past-2', userId: 'u-capt', status: 'PRESENT' },
  { id: 'att-3', eventId: 'ev-past-3', userId: 'u-capt', status: 'PRESENT' },
  { id: 'att-4', eventId: 'ev-past-4', userId: 'u-capt', status: 'PRESENT' },
  { id: 'att-m1', eventId: 'ev-match-1', userId: 'u-capt', status: 'PRESENT' },

  // Hráč u-1 (Petr Čáp) - 100%
  { id: 'att-5', eventId: 'ev-past-1', userId: 'u-1', status: 'PRESENT' },
  { id: 'att-6', eventId: 'ev-past-2', userId: 'u-1', status: 'PRESENT' },
  { id: 'att-7', eventId: 'ev-past-3', userId: 'u-1', status: 'PRESENT' },
  { id: 'att-8', eventId: 'ev-past-4', userId: 'u-1', status: 'PRESENT' },
  { id: 'att-m2', eventId: 'ev-match-1', userId: 'u-1', status: 'PRESENT' },

  // Hráč u-9 (Milan Bárta) - 75% (1x omluven)
  { id: 'att-9', eventId: 'ev-past-1', userId: 'u-9', status: 'PRESENT' },
  { id: 'att-10', eventId: 'ev-past-2', userId: 'u-9', status: 'EXCUSED', reason: 'Pracovní přesčas ve skladu' },
  { id: 'att-11', eventId: 'ev-past-3', userId: 'u-9', status: 'PRESENT' },
  { id: 'att-12', eventId: 'ev-past-4', userId: 'u-9', status: 'PRESENT' },
  { id: 'att-m3', eventId: 'ev-match-1', userId: 'u-9', status: 'PRESENT' },

  // Hráč u-10 (Jan Kolomazník) - 50% (1x omluven, 1x neomluven)
  { id: 'att-13', eventId: 'ev-past-1', userId: 'u-10', status: 'PRESENT' },
  { id: 'att-14', eventId: 'ev-past-2', userId: 'u-10', status: 'EXCUSED', reason: 'Namožený zadní stehenní sval' },
  { id: 'att-15', eventId: 'ev-past-3', userId: 'u-10', status: 'UNEXCUSED' },
  { id: 'att-16', eventId: 'ev-past-4', userId: 'u-10', status: 'PRESENT' },
  { id: 'att-m4', eventId: 'ev-match-1', userId: 'u-10', status: 'EXCUSED', reason: 'Rodinná oslava 50. narozenin tchyně' },

  // Ostatní na nadcházející zápas
  { id: 'att-m5', eventId: 'ev-match-1', userId: 'u-2', status: 'PRESENT' },
  { id: 'att-m6', eventId: 'ev-match-1', userId: 'u-3', status: 'PRESENT' },
  { id: 'att-m7', eventId: 'ev-match-1', userId: 'u-4', status: 'PRESENT' },
  { id: 'att-m8', eventId: 'ev-match-1', userId: 'u-5', status: 'PRESENT' },
  { id: 'att-m9', eventId: 'ev-match-1', userId: 'u-6', status: 'PRESENT' },
  { id: 'att-m10', eventId: 'ev-match-1', userId: 'u-7', status: 'PRESENT' },
  { id: 'att-m11', eventId: 'ev-match-1', userId: 'u-8', status: 'PRESENT' },
  { id: 'att-m12', eventId: 'ev-match-1', userId: 'u-11', status: 'PRESENT' },
  { id: 'att-m13', eventId: 'ev-match-1', userId: 'u-12', status: 'PRESENT' },
];

export const MOCK_LINEUP: MatchLineup = {
  id: 'lineup-ev-match-1',
  eventId: 'ev-match-1',
  formation: '4-3-3',
  tacticalNotes: 'Agresivní napadání od začátku, krajní obránci podporují útok, standardky kope Tomáš Rosa (#10).',
  isPublished: true, // Trenér už ji zveřejnil pro kabinu!
  slots: [
    { id: 's-1', lineupId: 'lineup-ev-match-1', userId: 'u-1', positionName: 'GK', gridX: 50, gridY: 88, isStarter: true, orderIndex: 0 },
    { id: 's-2', lineupId: 'lineup-ev-match-1', userId: 'u-2', positionName: 'LB', gridX: 15, gridY: 68, isStarter: true, orderIndex: 1 },
    { id: 's-3', lineupId: 'lineup-ev-match-1', userId: 'u-capt', positionName: 'CB_L', gridX: 38, gridY: 70, isStarter: true, orderIndex: 2 },
    { id: 's-4', lineupId: 'lineup-ev-match-1', userId: 'u-3', positionName: 'CB_R', gridX: 62, gridY: 70, isStarter: true, orderIndex: 3 },
    { id: 's-5', lineupId: 'lineup-ev-match-1', userId: 'u-4', positionName: 'RB', gridX: 85, gridY: 68, isStarter: true, orderIndex: 4 },
    { id: 's-6', lineupId: 'lineup-ev-match-1', userId: 'u-12', positionName: 'DM', gridX: 50, gridY: 52, isStarter: true, orderIndex: 5 },
    { id: 's-7', lineupId: 'lineup-ev-match-1', userId: 'u-5', positionName: 'CM_L', gridX: 30, gridY: 40, isStarter: true, orderIndex: 6 },
    { id: 's-8', lineupId: 'lineup-ev-match-1', userId: 'u-7', positionName: 'CM_R', gridX: 70, gridY: 40, isStarter: true, orderIndex: 7 },
    { id: 's-9', lineupId: 'lineup-ev-match-1', userId: 'u-6', positionName: 'LW', gridX: 18, gridY: 20, isStarter: true, orderIndex: 8 },
    { id: 's-10', lineupId: 'lineup-ev-match-1', userId: 'u-9', positionName: 'ST', gridX: 50, gridY: 16, isStarter: true, orderIndex: 9 },
    { id: 's-11', lineupId: 'lineup-ev-match-1', userId: 'u-8', positionName: 'RW', gridX: 82, gridY: 20, isStarter: true, orderIndex: 10 },
    // Náhradníci na střídačce
    { id: 'sub-1', lineupId: 'lineup-ev-match-1', userId: 'u-11', positionName: 'Náhradník', gridX: 0, gridY: 0, isStarter: false, orderIndex: 11 },
  ],
};

export const MOCK_FINE_RULES: FineRule[] = FineService.getDefaultFineRules('team-1');

export const MOCK_FINES: FineEntry[] = [
  {
    id: 'f-1',
    teamId: 'team-1',
    userId: 'u-capt',
    fineRuleId: 'rule-8',
    title: 'Žlutá karta za kecy na rozhodčího',
    amount: 200,
    isPaid: false,
    issuedByUserId: 'u-coach',
    issuedAt: '2026-10-24T16:45:00',
    note: 'Opět diskutoval po odpískaném ofsajdu.',
  },
  {
    id: 'f-2',
    teamId: 'team-1',
    userId: 'u-9',
    fineRuleId: 'rule-1',
    title: 'Pozdní příchod na sraz (<15 min)',
    amount: 50,
    isPaid: false,
    issuedByUserId: 'u-capt',
    issuedAt: '2026-10-20T17:55:00',
    note: 'Stál v koloně na Jižní spojce.',
  },
  {
    id: 'f-3',
    teamId: 'team-1',
    userId: 'u-10',
    fineRuleId: 'rule-3',
    title: 'Neomluvená absence na tréninku',
    amount: 150,
    isPaid: false,
    issuedByUserId: 'u-capt',
    issuedAt: '2026-10-20T18:15:00',
    note: 'Nedorazil a nebral mobil.',
  },
  {
    id: 'f-4',
    teamId: 'team-1',
    userId: 'u-6',
    fineRuleId: 'rule-5',
    title: 'Špinavé kopačky před tréninkem',
    amount: 50,
    isPaid: false,
    issuedByUserId: 'u-capt',
    issuedAt: '2026-10-13T17:50:00',
    note: 'Bláto ještě z minulého víkendu.',
  },
  // Již zaplacené pokuty do kasy
  {
    id: 'f-paid-1',
    teamId: 'team-1',
    userId: 'u-7',
    fineRuleId: 'rule-10',
    title: 'První gól v dresu týmu (zápisné)',
    amount: 200,
    isPaid: true,
    issuedByUserId: 'u-capt',
    issuedAt: '2026-10-06T19:00:00',
    paidAt: '2026-10-06T20:30:00',
    note: 'Zaplaceno v hospodě po zápase hotově do kasy.',
  },
  {
    id: 'f-paid-2',
    teamId: 'team-1',
    userId: 'u-1',
    fineRuleId: 'rule-6',
    title: 'Zvonící telefon v kabině před zápasem',
    amount: 100,
    isPaid: true,
    issuedByUserId: 'u-capt',
    issuedAt: '2026-10-06T14:10:00',
    paidAt: '2026-10-07T12:00:00',
    note: 'Zvonil budík. Hned druhý den poslal přes QR kód.',
  },
  {
    id: 'f-paid-3',
    teamId: 'team-1',
    userId: 'u-5',
    fineRuleId: 'rule-11',
    title: 'Narozeniny / Svátek (runda do kasy)',
    amount: 250,
    isPaid: true,
    issuedByUserId: 'u-capt',
    issuedAt: '2026-10-15T18:00:00',
    paidAt: '2026-10-15T21:00:00',
    note: 'Slavil 32 let.',
  },
];
