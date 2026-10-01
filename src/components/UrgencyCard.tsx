import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Check,
  FileCheck2,
  HelpCircle,
  Radio,
  Lock
} from 'lucide-react';
import type { UrgencyLevel, ScamCategory, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface UrgencyCardProps {
  urgencyLevel: UrgencyLevel;
  scamCategory: ScamCategory;
  categoryName: string;
  urgencyReasons: string[];
  scamSignals: string[];
  moneyLost: boolean;
  amount?: string;
  confidenceScore: number;
  currentLanguage: SupportedLanguage;
  incidentId: string;
}

export const UrgencyCard: React.FC<UrgencyCardProps> = ({
  urgencyLevel,
  scamCategory,
  categoryName,
  urgencyReasons,
  scamSignals,
  moneyLost,
  amount,
  currentLanguage,
  incidentId
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const getSeverityStyle = () => {
    switch (urgencyLevel) {
      case 'CRITICAL':
        return {
          container: 'bg-[#080306] border-red-800/80 shadow-[0_0_30px_rgba(239,68,68,0.2)]',
          badge: 'bg-red-600 text-white font-mono shadow-[0_0_12px_rgba(239,68,68,0.5)]',
          titleColor: 'text-red-100',
          subtext: 'Immediate response recommended — funds or credentials at risk',
          icon: ShieldAlert
        };
      case 'HIGH':
        return {
          container: 'bg-[#080603] border-amber-800/80 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
          badge: 'bg-amber-500 text-black font-mono font-bold',
          titleColor: 'text-amber-100',
          subtext: 'High-risk interaction detected — potential credential compromise',
          icon: AlertTriangle
        };
      case 'INFORMATIONAL':
        return {
          container: 'bg-[#030806] border-emerald-800/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          badge: 'bg-emerald-600 text-white font-mono',
          titleColor: 'text-emerald-100',
          subtext: 'Routine legitimate communication — no suspicious threats found',
          icon: CheckCircle2
        };
      default: // LOW
        return {
          container: 'bg-[#03060c] border-emerald-950/90 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          badge: 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono',
          titleColor: 'text-slate-100',
          subtext: 'Suspicious outreach identified — no financial transfer or loss detected',
          icon: ShieldAlert
        };
    }
  };

  const style = getSeverityStyle();
  const IconComponent = style.icon;

  return (
    <div className={`border rounded-xl p-5 md:p-6 mb-8 transition-all ${style.container}`}>
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>INCIDENT STATUS:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${style.badge}`}>
                {urgencyLevel}
              </span>
              <span className="text-slate-500">• ID: {incidentId}</span>
            </div>
            <h3 className={`text-xl md:text-2xl font-black font-mono mt-0.5 ${style.titleColor}`}>
              {categoryName.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {style.subtext}
            </p>
          </div>
        </div>

        {moneyLost && amount && (
          <div className="bg-black/40 border border-red-800/60 px-4 py-2 rounded-lg text-right font-mono">
            <span className="text-[10px] text-red-300 block uppercase">FUNDS IN JEOPARDY:</span>
            <span className="text-lg md:text-xl font-bold text-red-400">{amount}</span>
          </div>
        )}
      </div>

      {/* WHY THIS WAS FLAGGED (Explainability Section) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reasons */}
        <div className="bg-[#03060c] border border-emerald-950/70 rounded-lg p-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3 tracking-wider text-xs">
            <HelpCircle className="w-4 h-4" />
            <span>WHY THIS WAS FLAGGED</span>
          </div>
          <ul className="space-y-2">
            {urgencyReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-300">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span className="leading-snug">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Signals */}
        <div className="bg-[#03060c] border border-emerald-950/70 rounded-lg p-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3 tracking-wider text-xs">
            <Radio className="w-4 h-4" />
            <span>SUSPICIOUS FORENSIC SIGNALS</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scamSignals.map((sig, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-[#060b16] border border-slate-800 text-slate-200 text-[11px] font-mono flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {sig}
              </span>
            ))}
            {scamSignals.length === 0 && (
              <span className="text-slate-500 text-xs">No deception indicators detected.</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-sans">
            *Evidence-based reasoning extracted from message contents and transaction patterns.
          </p>
        </div>
      </div>
    </div>
  );
};
