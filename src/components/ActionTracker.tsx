import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Building,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import type { ActionStep, IncidentStatus } from '../types';
import { BANK_HELPLINES } from '../data/mockScenarios';

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
        return { text: 'ACTION REQUIRED', color: 'bg-red-950 border-red-700 text-red-300' };
      case 'BANK_CONTACTED':
        return { text: 'BANK NOTIFIED & FREEZE REQUESTED', color: 'bg-amber-950 border-amber-700 text-amber-300' };
      case 'EVIDENCE_LOCKED':
        return { text: 'EVIDENCE SECURED', color: 'bg-blue-950 border-blue-700 text-blue-300' };
      case 'REPORT_READY':
        return { text: 'OFFICIAL NCRP REPORT READY', color: 'bg-emerald-950 border-emerald-700 text-emerald-300' };
      case 'RESOLVED':
        return { text: 'CONTAINMENT PROTOCOL COMPLETE', color: 'bg-emerald-950 border-emerald-500 text-emerald-200' };
      default:
        return { text: 'ANALYZING', color: 'bg-slate-900 border-slate-700 text-slate-300' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="bg-[#080d17] border border-slate-800 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      {/* Header and Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h3 className="text-base font-bold text-white">
              PRIORITIZED EMERGENCY ACTION PLAN
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${statusBadge.color}`}>
              STATE: {statusBadge.text}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step coordinated response. Checking off actions updates GoldenHour agent state memory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Progress: </span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {completedCount} / {actions.length} Completed ({progressPercent}%)
            </span>
          </div>
          <button
            onClick={onOpenBankModal}
            className="flex items-center gap-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 px-3 py-1.5 rounded transition"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bank Fraud Desk Directory</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-5">
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Action Steps */}
      <div className="space-y-3">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={() => onToggleAction(act.id)}
            className={`p-4 rounded-lg border cursor-pointer transition flex items-start gap-3.5 ${
              act.completed
                ? 'bg-[#050810]/40 border-slate-800/60 opacity-70'
                : act.category === 'immediate_call'
                ? 'bg-red-950/20 border-red-800/60 hover:border-red-600'
                : 'bg-[#060a12] border-slate-800 hover:border-slate-700'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 shrink-0 focus:outline-none text-slate-500 hover:text-emerald-400 transition"
            >
              {act.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className={`text-sm font-bold ${act.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {act.title}
                </h4>

                <div className="flex items-center gap-2">
                  {act.contactNumber && (
                    <a
                      href={`tel:${act.contactNumber}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[11px] font-mono bg-red-600/90 hover:bg-red-500 text-white px-2.5 py-0.5 rounded font-bold transition shadow-sm"
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
                      className="flex items-center gap-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded transition"
                    >
                      <span>Open Portal</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>

              <p className={`text-xs mt-1 leading-relaxed ${act.completed ? 'text-slate-500' : 'text-slate-300'}`}>
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
