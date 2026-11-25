// TeamSync - Služba pro sestavu a rozestavení týmu
import { LineupSlot, MatchLineup, User } from '../types';

export interface FormationPreset {
  name: string;
  positions: { name: string; x: number; y: number }[];
}

// Předpřipravené taktické šablony pro fotbalové hřiště (x: 0-100%, y: 0-100%, kde 90% je brankář a 10% útok)
export const FORMATION_PRESETS: Record<string, FormationPreset> = {
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { name: 'GK', x: 50, y: 88 },
      { name: 'LB', x: 15, y: 68 },
      { name: 'CB_L', x: 38, y: 70 },
      { name: 'CB_R', x: 62, y: 70 },
      { name: 'RB', x: 85, y: 68 },
      { name: 'LM', x: 15, y: 44 },
      { name: 'CM_L', x: 38, y: 46 },
      { name: 'CM_R', x: 62, y: 46 },
      { name: 'RM', x: 85, y: 44 },
      { name: 'ST_L', x: 38, y: 18 },
      { name: 'ST_R', x: 62, y: 18 },
    ],
  },
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { name: 'GK', x: 50, y: 88 },
      { name: 'LB', x: 15, y: 68 },
      { name: 'CB_L', x: 38, y: 70 },
      { name: 'CB_R', x: 62, y: 70 },
      { name: 'RB', x: 85, y: 68 },
      { name: 'DM', x: 50, y: 52 },
      { name: 'CM_L', x: 30, y: 40 },
      { name: 'CM_R', x: 70, y: 40 },
      { name: 'LW', x: 18, y: 20 },
      { name: 'ST', x: 50, y: 16 },
      { name: 'RW', x: 82, y: 20 },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { name: 'GK', x: 50, y: 88 },
      { name: 'CB_L', x: 25, y: 70 },
      { name: 'CB_C', x: 50, y: 72 },
      { name: 'CB_R', x: 75, y: 70 },
      { name: 'LWB', x: 12, y: 46 },
      { name: 'CM_L', x: 36, y: 48 },
      { name: 'CM_C', x: 50, y: 40 },
      { name: 'CM_R', x: 64, y: 48 },
      { name: 'RWB', x: 88, y: 46 },
      { name: 'ST_L', x: 38, y: 18 },
      { name: 'ST_R', x: 62, y: 18 },
    ],
  },
};

export class LineupService {
  /**
   * Inicializuje novou sestavu pro zápas podle zvolené formace
   */
  static createDefaultLineup(eventId: string, formation = '4-4-2'): MatchLineup {
    const preset = FORMATION_PRESETS[formation] || FORMATION_PRESETS['4-4-2'];
    
    const slots: LineupSlot[] = preset.positions.map((pos, index) => ({
      id: `slot-${index + 1}`,
      lineupId: `lineup-${eventId}`,
      userId: '', // Zatím neobsazeno
      positionName: pos.name,
      gridX: pos.x,
      gridY: pos.y,
      isStarter: true,
      orderIndex: index,
    }));

    return {
      id: `lineup-${eventId}`,
      eventId,
      formation,
      tacticalNotes: 'Agresivní presink od prvních minut, zodpovědný návrat křídel.',
      isPublished: false,
      slots,
    };
  }

  /**
   * Změní rozestavení (např. z 4-4-2 na 4-3-3) a přemístí pozice
   */
  static changeFormation(currentLineup: MatchLineup, newFormation: string): MatchLineup {
    const preset = FORMATION_PRESETS[newFormation];
    if (!preset) return currentLineup;

    // Zachováme již přiřazené hráče podle pořadí
    const existingStarters = currentLineup.slots.filter((s) => s.isStarter);
    const existingSubs = currentLineup.slots.filter((s) => !s.isStarter);

    const newStarterSlots: LineupSlot[] = preset.positions.map((pos, index) => ({
      id: `slot-${index + 1}`,
      lineupId: currentLineup.id,
      userId: existingStarters[index]?.userId || '',
      positionName: pos.name,
      gridX: pos.x,
      gridY: pos.y,
      isStarter: true,
      orderIndex: index,
    }));

    return {
      ...currentLineup,
      formation: newFormation,
      slots: [...newStarterSlots, ...existingSubs],
    };
  }

  /**
   * Přiřadí hráče na konkrétní pozici na hřišti
   */
  static assignPlayerToSlot(
    lineup: MatchLineup,
    slotId: string,
    userId: string
  ): MatchLineup {
    // Pokud už hráč někde je, nejprve ho z původního slotu uvolníme
    const cleanedSlots = lineup.slots.map((s) =>
      s.userId === userId ? { ...s, userId: '' } : s
    );

    const updatedSlots = cleanedSlots.map((s) =>
      s.id === slotId ? { ...s, userId } : s
    );

    return {
      ...lineup,
      slots: updatedSlots,
    };
  }

  /**
   * Přidá náhradníka na střídačku
   */
  static addSubPlayer(lineup: MatchLineup, userId: string): MatchLineup {
    // Odstranit, pokud už je na hřišti nebo na lavičce
    const withoutUser = lineup.slots.filter((s) => s.userId !== userId);
    
    const newSubSlot: LineupSlot = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      lineupId: lineup.id,
      userId,
      positionName: 'Lavička',
      gridX: 0,
      gridY: 0,
      isStarter: false,
      orderIndex: withoutUser.length,
    };

    return {
      ...lineup,
      slots: [...withoutUser, newSubSlot],
    };
  }

  /**
   * Trenér sestavu potvrdí a zveřejní celému týmu
   */
  static setPublished(lineup: MatchLineup, isPublished: boolean): MatchLineup {
    return {
      ...lineup,
      isPublished,
    };
  }
}
