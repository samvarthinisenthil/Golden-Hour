import React from 'react';
import {
  CheckCircle2,
  Circle,
  PhoneCall,
  ExternalLink,
  Building,
  ShieldCheck,
  ListOrdered
} from 'lucide-react';
import type { ActionStep, IncidentStatus } from '../types';

interface ActionTrackerProps {
  actions: ActionStep[];
  status: IncidentStatus;
  onToggleAction: (actionId: string) => void;
  onOpenBankModal: () => void;
}

export const ActionTracker: React.FC<ActionTrackerProps> = ({
  actions,
  status,
  onToggleAction,
  onOpenBankModal
}) => {
  const completedCount = actions.filter(a => a.completed).length;
  const progressPercent = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;

  const getStatusBadge = () => {
    switch (status) {
      case 'ACTION_REQUIRED':
        return { text: 'CONTAINMENT ACTIVE', color: 'bg-red-950/80 border-red-700 text-red-300' };
      case 'BANK_CONTACTED':
        return { text: 'BANK NOTIFIED & LIEN REQUESTED', color: 'bg-amber-950/80 border-amber-600 text-amber-300' };
      case 'EVIDENCE_LOCKED':
        return { text: 'EVIDENCE PRESERVED', color: 'bg-blue-950/80 border-blue-600 text-blue-300' };
      case 'REPORT_READY':
        return { text: 'NCRP REPORT DRAFTED', color: 'bg-emerald-950/80 border-emerald-500 text-emerald-300' };
      case 'RESOLVED':
        return { text: 'RESPONSE SEQUENCE COMPLETED', color: 'bg-emerald-900 border-emerald-400 text-white' };
      default:
        return { text: 'ANALYZING', color: 'bg-slate-900 border-slate-700 text-slate-300' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="bg-[#03060f] border border-emerald-950/80 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      {/* Header and Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/60 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold font-mono text-white">
              PERSONALIZED INCIDENT RESPONSE PLAN
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${statusBadge.color}`}>
              STATE: {statusBadge.text}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Prioritized emergency actions formulated for this specific threat vector. Check off completed items to advance agent state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400">Completed: </span>
            <span className="text-sm font-bold text-emerald-400">
              {completedCount}/{actions.length} ({progressPercent}%)
            </span>
          </div>

          <button
            onClick={onOpenBankModal}
            className="flex items-center gap-1.5 text-xs font-mono bg-[#080e1a] hover:bg-[#0e1628] border border-emerald-900/60 text-emerald-300 px-3 py-1.5 rounded transition"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bank Fraud Desk Directory</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-5 border border-slate-900">
        <div
          className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Numbered Response Steps */}
      <div className="space-y-2.5 font-mono">
        {actions.map((act, idx) => (
          <div
            key={act.id}
            onClick={() => onToggleAction(act.id)}
            className={`p-3.5 rounded-lg border cursor-pointer transition flex items-start gap-3.5 ${
              act.completed
                ? 'bg-[#020408]/60 border-slate-900 opacity-60'
                : act.category === 'immediate_call'
                ? 'bg-red-950/20 border-red-900/60 hover:border-red-600'
                : 'bg-[#040812] border-emerald-950/70 hover:border-emerald-600/50'
            }`}
          >
            <div className="mt-0.5 text-xs font-mono font-bold text-emerald-400 shrink-0 w-6">
              0{idx + 1}
            </div>

            <button
              type="button"
              className="mt-0.5 shrink-0 focus:outline-none text-slate-500 hover:text-emerald-400 transition"
            >
              {act.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className={`text-xs md:text-sm font-bold ${act.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                  {act.title}
                </h4>

                <div className="flex items-center gap-2">
                  {act.contactNumber && (
                    <a
                      href={`tel:${act.contactNumber}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[11px] font-mono bg-red-600 hover:bg-red-500 text-white px-2 py-0.5 rounded font-bold transition shadow-sm"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>CALL {act.contactNumber}</span>
                    </a>
                  )}

                  {act.actionUrl && (
                    <a
                      href={act.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 px-2 py-0.5 rounded transition"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </a>
                  )}
                </div>
              </div>

              <p className={`text-xs mt-1 leading-relaxed font-sans ${act.completed ? 'text-slate-500' : 'text-slate-300'}`}>
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
