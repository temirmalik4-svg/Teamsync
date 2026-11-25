import React from 'react';
import { FineEntry, TeamCashBoxSummary, User } from '../types';

interface FineBoxProps {
  summary: TeamCashBoxSummary;
  fines: FineEntry[];
  currentUser: User;
  onMarkPaid: (fineId: string) => void;
  onOpenIssueModal: () => void;
}

export const FineBox: React.FC<FineBoxProps> = ({
  summary,
  fines,
  currentUser,
  onMarkPaid,
  onOpenIssueModal,
}) => {
  const isCaptain = currentUser.role === 'CAPTAIN';

  return (
    <div className="space-y-4">
      {/* Finanční bilance kasy */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-400 block mb-1">
            💰 Vybráno v kase
          </span>
          <div className="text-2xl font-black text-slate-100">
            {summary.totalCollected.toLocaleString('cs-CZ')} <span className="text-xs text-slate-400 font-normal">Kč</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Uloženo na dokopnou</p>
        </div>

        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-amber-400 block mb-1">
            ⚠️ Celkový dluh
          </span>
          <div className="text-2xl font-black text-amber-400">
            {summary.totalUnpaid.toLocaleString('cs-CZ')} <span className="text-xs text-slate-400 font-normal">Kč</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Nevybráno v kabině</p>
        </div>
      </div>

      {/* Tlačítko pro kapitána */}
      {isCaptain && (
        <button
          onClick={onOpenIssueModal}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition active:scale-98 shadow-md shadow-amber-950/40"
        >
          + Udělit pokutu hráči (Kapitán)
        </button>
      )}

      {/* ŽEBŘÍČEK DLUŽNÍKŮ - ZEĎ HANBY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">
          👑 Zeď dlužníků (Kdo dluží nejvíc)
        </h3>
        <div className="space-y-2">
          {summary.topDebtors.map((debtor, index) => (
            <div
              key={debtor.userId}
              className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    index === 0 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {index === 0 ? '👑' : index + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-200">{debtor.userName}</span>
                  {debtor.nickname && (
                    <span className="text-slate-400 ml-1">({debtor.nickname})</span>
                  )}
                  <div className="text-[10px] text-slate-500">
                    {debtor.unpaidCount} nezaplacených pokut
                  </div>
                </div>
              </div>

              <span className="font-black text-amber-400 text-sm">
                {debtor.unpaidAmount} Kč
              </span>
            </div>
          ))}

          {summary.topDebtors.length === 0 && (
            <div className="text-center py-4 text-xs text-emerald-400 font-semibold">
              🎉 Všichni mají čistý štít! Žádné dluhy v kabině.
            </div>
          )}
        </div>
      </div>

      {/* SEZNAM VŠECH POKUT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">
          Historie pokut v kabině
        </h3>
        <div className="divide-y divide-slate-800">
          {fines.map((fine) => (
            <div key={fine.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-200">{fine.user?.name || 'Hráč'}</span>
                  <span className="text-[10px] text-slate-500">• {new Date(fine.issuedAt).toLocaleDateString('cs-CZ')}</span>
                </div>
                <div className="text-slate-300 font-medium">{fine.title}</div>
                {fine.note && <div className="text-[10px] text-slate-400 italic">"{fine.note}"</div>}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-black text-slate-200">{fine.amount} Kč</span>
                {fine.isPaid ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    Zaplaceno ✓
                  </span>
                ) : isCaptain ? (
                  <button
                    onClick={() => onMarkPaid(fine.id)}
                    className="text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 px-2 py-1 rounded-lg transition"
                  >
                    Označit za zaplacené
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800/40">
                    Dluží
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
