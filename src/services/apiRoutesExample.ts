// TeamSync - Příklady Next.js / Node.js API Route Handlers (Backend)
// Tyto handlery ukazují integraci Prisma ORM s byznys logikou a kontrolou rolí (RBAC).

import { AttendanceStatus, Role } from '../types';

/**
 * Příklad ověření role uživatele v backendu
 */
export function assertRole(userRole: Role, allowedRoles: Role[]) {
  if (!allowedRoles.includes(userRole)) {
    throw new Error('Nemáte dostatečná oprávnění pro tuto akci');
  }
}

/**
 * 1. ZÁPIS DOCHÁZKY / OMLUVENKY (Hráč se může omluvit z tréninku)
 * POST /api/attendance
 */
export async function handleAttendanceSubmit(prisma: any, sessionUser: any, body: {
  eventId: string;
  status: AttendanceStatus;
  reason?: string;
}) {
  const { eventId, status, reason } = body;

  // Hráč může měnit pouze svou vlastní docházku, Trenér může upravit docházku komukoliv
  const userId = sessionUser.role === 'COACH' && body['targetUserId'] ? body['targetUserId'] : sessionUser.id;

  const attendance = await prisma.attendance.upsert({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
    update: {
      status,
      reason: status === 'EXCUSED' ? reason : null,
      respondedAt: new Date(),
    },
    create: {
      eventId,
      userId,
      status,
      reason: status === 'EXCUSED' ? reason : null,
      respondedAt: new Date(),
    },
  });

  return attendance;
}

/**
 * 2. VÝPOČET MĚSÍČNÍ DOCHÁZKY V PROCENTECH
 * GET /api/attendance/monthly?year=2026&month=10
 */
export async function handleGetMonthlyStats(prisma: any, teamId: string, year: number, month: number) {
  // Rozmezí od 1. do konce daného měsíce
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // Všechny proběhlé události týmu v měsíci
  const finishedEvents = await prisma.event.findMany({
    where: {
      teamId,
      startTime: { gte: startDate, lte: endDate },
      isFinished: true,
    },
  });

  const totalEvents = finishedEvents.length;
  const eventIds = finishedEvents.map((e: any) => e.id);

  // Všichni hráči týmu
  const players = await prisma.user.findMany({
    where: {
      teamId,
      role: { in: ['PLAYER', 'CAPTAIN'] },
    },
    select: {
      id: true,
      name: true,
      nickname: true,
      jerseyNumber: true,
      attendances: {
        where: { eventId: { in: eventIds } },
      },
    },
  });

  const stats = players.map((p: any) => {
    let present = 0;
    let excused = 0;
    let unexcused = 0;

    p.attendances.forEach((att: any) => {
      if (att.status === 'PRESENT') present++;
      else if (att.status === 'EXCUSED') excused++;
      else if (att.status === 'UNEXCUSED') unexcused++;
    });

    // Události, na které hráč vůbec nereagoval, počítáme jako neomluvené
    const unresponded = totalEvents - (present + excused + unexcused);
    unexcused += Math.max(0, unresponded);

    // Výpočet procentuální docházky
    const rate = totalEvents > 0 ? Math.round((present / totalEvents) * 100) : 100;

    return {
      userId: p.id,
      name: p.name,
      nickname: p.nickname,
      jerseyNumber: p.jerseyNumber,
      totalEvents,
      present,
      excused,
      unexcused,
      rate,
    };
  });

  return stats.sort((a: any, b: any) => b.rate - a.rate);
}

/**
 * 3. ULOŽENÍ A ZVEŘEJNĚNÍ ZÁPASOVÉ SESTAVY (Pouze Trenér)
 * POST /api/lineup/publish
 */
export async function handlePublishLineup(prisma: any, sessionUser: any, body: {
  eventId: string;
  formation: string;
  tacticalNotes?: string;
  slots: { userId: string; positionName: string; gridX: number; gridY: number; isStarter: boolean }[];
}) {
  assertRole(sessionUser.role, ['COACH']);

  const { eventId, formation, tacticalNotes, slots } = body;

  const lineup = await prisma.$transaction(async (tx: any) => {
    const savedLineup = await tx.matchLineup.upsert({
      where: { eventId },
      update: {
        formation,
        tacticalNotes,
        isPublished: true,
      },
      create: {
        eventId,
        formation,
        tacticalNotes,
        isPublished: true,
      },
    });

    // Přeuložit sloty
    await tx.lineupSlot.deleteMany({ where: { lineupId: savedLineup.id } });

    await tx.lineupSlot.createMany({
      data: slots.map((s, index) => ({
        lineupId: savedLineup.id,
        userId: s.userId,
        positionName: s.positionName,
        gridX: s.gridX,
        gridY: s.gridY,
        isStarter: s.isStarter,
        orderIndex: index,
      })),
    });

    return savedLineup;
  });

  return lineup;
}

/**
 * 4. UDĚLENÍ POKUTY (Pouze Kapitán nebo Trenér)
 * POST /api/fines
 */
export async function handleIssueFine(prisma: any, sessionUser: any, body: {
  teamId: string;
  userId: string;
  fineRuleId?: string;
  title: string;
  amount: number;
  note?: string;
}) {
  assertRole(sessionUser.role, ['CAPTAIN', 'COACH']);

  const fine = await prisma.fineEntry.create({
    data: {
      teamId: body.teamId,
      userId: body.userId,
      fineRuleId: body.fineRuleId,
      title: body.title,
      amount: body.amount,
      note: body.note,
      issuedByUserId: sessionUser.id,
    },
  });

  return fine;
}

/**
 * 5. OZNAČENÍ POKUTY ZA UHRAZENOU (Pouze Kapitán)
 * PATCH /api/fines/:id/pay
 */
export async function handleMarkFineAsPaid(prisma: any, sessionUser: any, fineId: string) {
  assertRole(sessionUser.role, ['CAPTAIN']);

  const fine = await prisma.fineEntry.update({
    where: { id: fineId },
    data: {
      isPaid: true,
      paidAt: new Date(),
    },
  });

  return fine;
}
