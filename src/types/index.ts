// TeamSync - TypeScript typy a rozhraní

export type Role = 'COACH' | 'CAPTAIN' | 'PLAYER';
export type EventType = 'TRAINING' | 'MATCH';
export type AttendanceStatus = 'PRESENT' | 'EXCUSED' | 'UNEXCUSED' | 'PENDING';
export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface User {
  id: string;
  teamId: string;
  email: string;
  name: string;
  nickname?: string;
  jerseyNumber?: number;
  position?: PlayerPosition;
  role: Role;
  phone?: string;
  avatarUrl?: string;
}

export interface TeamEvent {
  id: string;
  teamId: string;
  type: EventType;
  title: string;
  description?: string;
  location: string;
  isHome: boolean;
  opponent?: string;
  meetTime?: string; // ISO String nebo čas srazu
  startTime: string; // ISO String začátku
  endTime?: string;
  isFinished: boolean;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  userId: string;
  status: AttendanceStatus;
  reason?: string;
  respondedAt?: string;
}

export interface PlayerAttendanceSummary {
  userId: string;
  userName: string;
  jerseyNumber?: number;
  totalEvents: number;
  presentCount: number;
  excusedCount: number;
  unexcusedCount: number;
  pendingCount: number;
  attendanceRate: number; // Procentuální úspěšnost (0 - 100 %)
  statusGrade: 'EXCELLENT' | 'GOOD' | 'POOR'; // >80% zelená, 60-80% žlutá, <60% červená
}

export interface LineupSlot {
  id: string;
  lineupId: string;
  userId: string;
  positionName: string; // např. "GK", "LB", "CB", "RB", "CM", "ST", "SUB"
  gridX: number; // 0 - 100 (pozice na hřišti v %)
  gridY: number; // 0 - 100
  isStarter: boolean;
  orderIndex: number;
  player?: User;
}

export interface MatchLineup {
  id: string;
  eventId: string;
  formation: string; // "4-4-2" | "4-3-3" | "3-5-2"
  tacticalNotes?: string;
  isPublished: boolean;
  slots: LineupSlot[];
}

export interface FineRule {
  id: string;
  teamId: string;
  title: string;
  description?: string;
  amount: number; // v Kč
  category: 'DISCIPLINE' | 'MATCH' | 'LOCKER_ROOM' | 'FUN';
  isActive: boolean;
}

export interface FineEntry {
  id: string;
  teamId: string;
  userId: string;
  fineRuleId?: string;
  title: string;
  amount: number;
  isPaid: boolean;
  issuedByUserId: string;
  issuedAt: string;
  paidAt?: string;
  note?: string;
  user?: User;
  issuer?: User;
}

export interface TeamCashBoxSummary {
  totalCollected: number; // Vybráno a uloženo v kase (Kč)
  totalUnpaid: number;    // Nevybráno / dluh v kabině (Kč)
  totalAllTime: number;   // Celková suma udělených pokut
  topDebtors: {
    userId: string;
    userName: string;
    nickname?: string;
    jerseyNumber?: number;
    unpaidAmount: number;
    unpaidCount: number;
  }[];
}
