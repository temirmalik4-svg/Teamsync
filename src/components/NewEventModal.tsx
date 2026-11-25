import React, { useState } from 'react';
import { EventType } from '../types';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: EventType;
    title: string;
    opponent?: string;
    date: string;
    meetTime: string;
    startTime: string;
    location: string;
    notes?: string;
  }) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<EventType>('TRAINING');
  const [title, setTitle] = useState('');
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetTime, setMeetTime] = useState('17:45');
  const [startTime, setStartTime] = useState('18:00');
  const [location, setLocation] = useState('Hlavní hřiště');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      title: type === 'MATCH' ? `Mistrovský zápas vs. ${opponent}` : (title || 'Trénink týmu'),
      opponent: type === 'MATCH' ? opponent : undefined,
      date,
      meetTime,
      startTime,
      location,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-white">Přidat akci (Trenér)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('TRAINING')}
              className={`py-2 rounded-xl text-xs font-black transition ${type === 'TRAINING' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'}`}
            >
              🏃 Trénink
            </button>
            <button
              type="button"
              onClick={() => setType('MATCH')}
              className={`py-2 rounded-xl text-xs font-black transition ${type === 'MATCH' ? 'bg-rose-500 text-white shadow' : 'text-slate-400'}`}
            >
              🏆 Zápas
            </button>
          </div>

          {type === 'MATCH' ? (
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Soupeř:</label>
              <input
                type="text"
                required
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                placeholder="Např. FK Slavoj Vršovice"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          ) : (
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Název tréninku:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Např. Nácvik presinku a střelba"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Datum:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Sraz v šatně:</label>
              <input
                type="time"
                required
                value={meetTime}
                onChange={(e) => setMeetTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Začátek / Výkop:</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Místo / Hřiště:</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Pokyny pro hráče:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Např. Černé štulpny, chrániče..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
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
              Uložit do kalendáře
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
