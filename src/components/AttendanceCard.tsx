import React from 'react';
import { TeamEvent, AttendanceRecord, User, AttendanceStatus } from '../types';

interface AttendanceCardProps {
  event: TeamEvent;
  currentUser: User;
  attendanceRecord?: AttendanceRecord;
  allAttendances: AttendanceRecord[];
  allPlayers: User[];
  onConfirm: (eventId: string) => void;
  onExcuse: (eventId: string, reason: string) => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  event,
  currentUser,
  attendanceRecord,
  allAttendances,
  allPlayers,
  onConfirm,
  onExcuse,
}) => {
  const isMatch = event.type === 'MATCH';

  // Počet potvrzených a omluvených
  const presentCount = allAttendances.filter(
    (a) => a.eventId === event.id && a.status === 'PRESENT'
  ).length;

  const excusedCount = allAttendances.filter(
    (a) => a.eventId === event.id && a.status === 'EXCUSED'
  ).length;

  const myStatus = attendanceRecord?.status || 'PENDING';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
      <div className="flex items-start justify-between">
        <div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isMatch
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isMatch ? '🏆 Zápas' : '🏃 Trénink'}
          </span>
          <h3 className="font-bold text-slate-100 text-sm mt-2">{event.title}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-300">
        <div>
          <span className="text-slate-500">Začátek:</span>{' '}
          <strong className="text-slate-200">
            {new Date(event.startTime).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
          </strong>
        </div>
        {event.meetTime && (
          <div>
            <span className="text-slate-500">Sraz v šatně:</span>{' '}
            <strong className="text-slate-200">
              {new Date(event.meetTime).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
            </strong>
          </div>
        )}
        <div className="col-span-2 text-slate-400 truncate">
          📍 {event.location}
        </div>
      </div>

      {/* Stav v kabině */}
      <div className="mt-3 bg-slate-950/70 p-2.5 rounded-xl flex items-center justify-between text-xs">
        <div className="flex gap-3">
          <span className="text-emerald-400 font-semibold">✓ {presentCount} potvrdilo</span>
          <span className="text-amber-400 font-semibold">✕ {excusedCount} omluveno</span>
        </div>
        <div>
          {myStatus === 'PRESENT' && (
            <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/40">
              Máš potvrzeno
            </span>
          )}
          {myStatus === 'EXCUSED' && (
            <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/40">
              Omluven ({attendanceRecord?.reason})
            </span>
          )}
        </div>
      </div>

      {/* Akční tlačítka pro hráče */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          onClick={() => onConfirm(event.id)}
          className={`py-2 px-3 rounded-xl font-bold text-xs transition active:scale-95 ${
            myStatus === 'PRESENT'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          ✓ Jdu / Přijdu
        </button>
        <button
          onClick={() => {
            const reason = window.prompt('Zadej důvod omluvenky pro trenéra:');
            if (reason !== null) onExcuse(event.id, reason);
          }}
          className={`py-2 px-3 rounded-xl font-bold text-xs transition active:scale-95 ${
            myStatus === 'EXCUSED'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          ✕ Omluvit se
        </button>
      </div>
    </div>
  );
};
