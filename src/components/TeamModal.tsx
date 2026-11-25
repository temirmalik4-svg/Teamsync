import React, { useState } from 'react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (team: {
    name: string;
    league: string;
    badge: string;
    color: string;
  }) => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, onCreateTeam }) => {
  const [name, setName] = useState('');
  const [league, setLeague] = useState('I. B třída');
  const [badge, setBadge] = useState('⚽');
  const [color, setColor] = useState('#10b981');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateTeam({
      name: name.trim(),
      league: league.trim(),
      badge,
      color,
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-white">Vytvořit nový tým</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Název klubu / týmu:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Např. SK Dynamo Braník"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Soutěž / liga:</label>
            <input
              type="text"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              placeholder="Např. Okresní přebor"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Logo / Znak:</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="⚽">⚽ Míč</option>
                <option value="🦁">🦁 Lev</option>
                <option value="🦅">🦅 Orel</option>
                <option value="🔥">🔥 Oheň</option>
                <option value="⚡">⚡ Blesk</option>
                <option value="🔴">🔴 Červená</option>
                <option value="🔵">🔵 Modrá</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Barva dresů:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 bg-slate-950 border border-slate-700 rounded-xl p-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-950/50"
            >
              Založit tým
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
