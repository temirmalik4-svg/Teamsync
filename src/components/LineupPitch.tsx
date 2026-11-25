import React from 'react';
import { MatchLineup, User } from '../types';

interface LineupPitchProps {
  lineup: MatchLineup;
  players: User[];
  isCoach: boolean;
  onSelectSlot?: (slotId: string) => void;
}

export const LineupPitch: React.FC<LineupPitchProps> = ({
  lineup,
  players,
  isCoach,
  onSelectSlot,
}) => {
  const starters = lineup.slots.filter((s) => s.isStarter);
  const bench = lineup.slots.filter((s) => !s.isStarter);

  const playerMap = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="space-y-4">
      {/* Informace a taktické pokyny */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400">Rozestavení: {lineup.formation}</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              lineup.isPublished
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                : 'bg-amber-950 text-amber-300 border border-amber-800/50'
            }`}
          >
            {lineup.isPublished ? 'Zveřejněno v kabině' : 'Návrh trenéra (nehotovo)'}
          </span>
        </div>

        {lineup.tacticalNotes && (
          <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
            <strong className="text-emerald-400">Taktika: </strong>
            {lineup.tacticalNotes}
          </p>
        )}
      </div>

      {/* Grafické hřiště */}
      <div className="relative w-full aspect-[9/13] bg-[#1a4427] rounded-2xl overflow-hidden border-2 border-emerald-900/60 shadow-2xl">
        {/* Lajna a kruh */}
        <div className="absolute inset-2 border-2 border-white/30 rounded-lg pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white/30"></div>
          {/* Brankoviště nahoře */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-14 border-b-2 border-x-2 border-white/30"></div>
          {/* Brankoviště dole */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-14 border-t-2 border-x-2 border-white/30"></div>
        </div>

        {/* Pozice 11 hráčů v poli */}
        {starters.map((slot) => {
          const player = playerMap.get(slot.userId);
          const isGk = slot.positionName === 'GK';

          return (
            <div
              key={slot.id}
              style={{ left: `${slot.gridX}%`, top: `${slot.gridY}%` }}
              onClick={() => isCoach && onSelectSlot?.(slot.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition ${
                isCoach ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg border-2 ${
                  isGk
                    ? 'bg-amber-400 text-slate-950 border-amber-200'
                    : 'bg-emerald-500 text-slate-950 border-white'
                }`}
              >
                {player ? player.jerseyNumber || player.name[0] : '?'}
              </div>
              <div className="mt-0.5 px-1.5 py-0.2 bg-slate-950/90 text-white text-[10px] font-bold rounded shadow max-w-[70px] truncate text-center">
                {player ? player.nickname || player.name.split(' ')[0] : slot.positionName}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lavička náhradníků */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Střídačka ({bench.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {bench.map((b) => {
            const player = playerMap.get(b.userId);
            if (!player) return null;
            return (
              <span
                key={b.id}
                className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-xl text-xs font-medium text-slate-200"
              >
                #{player.jerseyNumber} {player.name}
              </span>
            );
          })}
          {bench.length === 0 && (
            <span className="text-xs text-slate-500 italic">Žádní náhradníci na lavičce</span>
          )}
        </div>
      </div>
    </div>
  );
};
