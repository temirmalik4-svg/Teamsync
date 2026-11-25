// TeamSync - Služba pro správu docházky a výpočet statistik
import { AttendanceRecord, AttendanceStatus, PlayerAttendanceSummary, TeamEvent, User } from '../types';

export class AttendanceService {
  /**
   * Zaznamená nebo aktualizuje docházku/omluvenku hráče na událost
   */
  static submitAttendance(
    existingRecords: AttendanceRecord[],
    eventId: string,
    userId: string,
    status: AttendanceStatus,
    reason?: string
  ): AttendanceRecord[] {
    const existingIndex = existingRecords.findIndex(
      (r) => r.eventId === eventId && r.userId === userId
    );

    const updatedRecord: AttendanceRecord = {
      id: existingIndex >= 0 ? existingRecords[existingIndex].id : `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId,
      userId,
      status,
      reason: status === 'EXCUSED' ? (reason?.trim() || 'Omluven bez udání důvodu') : undefined,
      respondedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const copy = [...existingRecords];
      copy[existingIndex] = updatedRecord;
      return copy;
    }

    return [...existingRecords, updatedRecord];
  }

  /**
   * Vypočítá docházku pro všechny hráče za zadaný měsíc a rok.
   * 
   * @param events Seznam všech událostí týmu
   * @param attendances Seznam záznamů o docházce
   * @param players Seznam registrovaných hráčů
   * @param targetYear Rok (např. 2026)
   * @param targetMonth Měsíc (1 - 12)
   */
  static calculateMonthlyAttendance(
    events: TeamEvent[],
    attendances: AttendanceRecord[],
    players: User[],
    targetYear: number,
    targetMonth: number
  ): PlayerAttendanceSummary[] {
    // 1. Vyfiltrovat události, které spadají do vybraného měsíce a již proběhly nebo se konají
    const monthEvents = events.filter((e) => {
      const d = new Date(e.startTime);
      return (
        d.getFullYear() === targetYear &&
        d.getMonth() + 1 === targetMonth &&
        e.isFinished // Počítáme události, které už proběhly
      );
    });

    const totalEventsInMonth = monthEvents.length;
    const eventIds = new Set(monthEvents.map((e) => e.id));

    // 2. Spočítat statistiku pro každého hráče
    return players
      .filter((p) => p.role === 'PLAYER' || p.role === 'CAPTAIN') // trenéra nepočítáme do hráčské docházky
      .map((player) => {
        const playerAttendances = attendances.filter(
          (a) => a.userId === player.id && eventIds.has(a.eventId)
        );

        let presentCount = 0;
        let excusedCount = 0;
        let unexcusedCount = 0;

        playerAttendances.forEach((record) => {
          if (record.status === 'PRESENT') presentCount++;
          else if (record.status === 'EXCUSED') excusedCount++;
          else if (record.status === 'UNEXCUSED') unexcusedCount++;
        });

        // Hráči, kteří nereagovali a událost proběhla, jsou automaticky vedeni jako neomluvení
        const respondedCount = presentCount + excusedCount + unexcusedCount;
        const missingCount = Math.max(0, totalEventsInMonth - respondedCount);
        unexcusedCount += missingCount;

        // Výpočet procentuální úspěšnosti příchodu:
        // Poměr: (počet účastí / celkový počet proběhlých akcí v měsíci) * 100
        const attendanceRate = totalEventsInMonth > 0
          ? Math.round((presentCount / totalEventsInMonth) * 100)
          : 100;

        // Hodnocení pro vizuální badge (zelená / oranžová / červená)
        let statusGrade: 'EXCELLENT' | 'GOOD' | 'POOR' = 'POOR';
        if (attendanceRate >= 80) statusGrade = 'EXCELLENT';
        else if (attendanceRate >= 60) statusGrade = 'GOOD';

        return {
          userId: player.id,
          userName: player.name,
          jerseyNumber: player.jerseyNumber,
          totalEvents: totalEventsInMonth,
          presentCount,
          excusedCount,
          unexcusedCount,
          pendingCount: 0,
          attendanceRate,
          statusGrade,
        };
      })
      .sort((a, b) => b.attendanceRate - a.attendanceRate); // Seřadit od nejpoctivějších docházkářů
  }
}
