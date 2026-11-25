// TeamSync - Služba pro pokutovou pokladnu (Kasa kabiny)
import { FineEntry, FineRule, TeamCashBoxSummary, User } from '../types';

export class FineService {
  /**
   * Výchozí sazebník pokut pro amatérský tým
   */
  static getDefaultFineRules(teamId: string): FineRule[] {
    return [
      { id: 'rule-1', teamId, title: 'Pozdní příchod na sraz (<15 min)', amount: 50, category: 'DISCIPLINE', isActive: true },
      { id: 'rule-2', teamId, title: 'Pozdní příchod na sraz (>15 min)', amount: 100, category: 'DISCIPLINE', isActive: true },
      { id: 'rule-3', teamId, title: 'Neomluvená absence na tréninku', amount: 150, category: 'DISCIPLINE', isActive: true },
      { id: 'rule-4', teamId, title: 'Neomluvená absence na zápase', amount: 300, category: 'DISCIPLINE', isActive: true },
      { id: 'rule-5', teamId, title: 'Špinavé kopačky před tréninkem', amount: 50, category: 'LOCKER_ROOM', isActive: true },
      { id: 'rule-6', teamId, title: 'Zvonící telefon v kabině před zápasem', amount: 100, category: 'LOCKER_ROOM', isActive: true },
      { id: 'rule-7', teamId, title: 'Zapomenutá součást výstroje / dres', amount: 100, category: 'LOCKER_ROOM', isActive: true },
      { id: 'rule-8', teamId, title: 'Žlutá karta za nesportovní chování / kecy', amount: 200, category: 'MATCH', isActive: true },
      { id: 'rule-9', teamId, title: 'Červená karta za faul / nesportovní chování', amount: 500, category: 'MATCH', isActive: true },
      { id: 'rule-10', teamId, title: 'První gól v dresu týmu (zápisné)', amount: 200, category: 'FUN', isActive: true },
      { id: 'rule-11', teamId, title: 'Narozeniny / Svátek (runda do kasy)', amount: 250, category: 'FUN', isActive: true },
    ];
  }

  /**
   * Udělení pokuty hráči kapitánem
   */
  static issueFine(
    existingFines: FineEntry[],
    params: {
      teamId: string;
      userId: string;
      fineRuleId?: string;
      title: string;
      amount: number;
      issuedByUserId: string;
      note?: string;
    }
  ): FineEntry[] {
    const newEntry: FineEntry = {
      id: `fine-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      teamId: params.teamId,
      userId: params.userId,
      fineRuleId: params.fineRuleId,
      title: params.title,
      amount: params.amount,
      isPaid: false,
      issuedByUserId: params.issuedByUserId,
      issuedAt: new Date().toISOString(),
      note: params.note,
    };

    return [newEntry, ...existingFines];
  }

  /**
   * Označení pokuty jako zaplacené (Kapitán vybral peníze do kasy)
   */
  static markAsPaid(existingFines: FineEntry[], fineId: string): FineEntry[] {
    return existingFines.map((f) =>
      f.id === fineId
        ? { ...f, isPaid: true, paidAt: new Date().toISOString() }
        : f
    );
  }

  /**
   * Smazání záznamu pokuty (storno)
   */
  static removeFine(existingFines: FineEntry[], fineId: string): FineEntry[] {
    return existingFines.filter((f) => f.id !== fineId);
  }

  /**
   * Spočítá celkovou finanční bilanci kasy a žebříček dlužníků pro celou kabinu
   */
  static calculateCashBoxSummary(
    fines: FineEntry[],
    users: User[]
  ): TeamCashBoxSummary {
    let totalCollected = 0;
    let totalUnpaid = 0;
    const debtorMap = new Map<string, { unpaidAmount: number; unpaidCount: number }>();

    fines.forEach((f) => {
      if (f.isPaid) {
        totalCollected += f.amount;
      } else {
        totalUnpaid += f.amount;
        const current = debtorMap.get(f.userId) || { unpaidAmount: 0, unpaidCount: 0 };
        debtorMap.set(f.userId, {
          unpaidAmount: current.unpaidAmount + f.amount,
          unpaidCount: current.unpaidCount + 1,
        });
      }
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const topDebtors = Array.from(debtorMap.entries())
      .map(([userId, stats]) => {
        const u = userMap.get(userId);
        return {
          userId,
          userName: u ? u.name : 'Neznámý hráč',
          nickname: u?.nickname,
          jerseyNumber: u?.jerseyNumber,
          unpaidAmount: stats.unpaidAmount,
          unpaidCount: stats.unpaidCount,
        };
      })
      .sort((a, b) => b.unpaidAmount - a.unpaidAmount); // Největší dlužník nahoře ("Král dlužníků")

    return {
      totalCollected,
      totalUnpaid,
      totalAllTime: totalCollected + totalUnpaid,
      topDebtors,
    };
  }
}
