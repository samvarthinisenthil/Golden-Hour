import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle,
  HelpCircle,
  Radio,
  FileCheck2,
  DollarSign
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
  confidenceScore,
  currentLanguage,
  incidentId
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const getUrgencyConfig = () => {
    switch (urgencyLevel) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/40 border-red-600',
          badgeBg: 'bg-red-600 text-white',
          textColor: 'text-red-400',
          label: t.urgencyCritical,
          glow: 'shadow-[0_0_25px_rgba(239,68,68,0.2)]',
          icon: ShieldAlert
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/40 border-amber-500',
          badgeBg: 'bg-amber-500 text-black',
          textColor: 'text-amber-400',
          label: t.urgencyHigh,
          glow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
          icon: AlertTriangle
        };
      case 'INFORMATIONAL':
        return {
          bg: 'bg-emerald-950/30 border-emerald-600/70',
          badgeBg: 'bg-emerald-600 text-white',
          textColor: 'text-emerald-400',
          label: t.urgencyBenign,
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          icon: CheckCircle
        };
      default:
        return {
          bg: 'bg-blue-950/30 border-blue-500/70',
          badgeBg: 'bg-blue-600 text-white',
          textColor: 'text-blue-400',
          label: t.urgencyLow,
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
          icon: AlertTriangle
        };
    }
  };

  const config = getUrgencyConfig();
  const IconComponent = config.icon;

  return (
    <div className={`border rounded-xl p-5 md:p-6 mb-8 transition-all ${config.bg} ${config.glow}`}>
      {/* Header with Incident ID & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${config.badgeBg}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400 font-semibold tracking-wider">
                INCIDENT ID: <span className="text-white font-bold">{incidentId}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Confidence: {(confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white mt-0.5">
              {categoryName}
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded text-xs font-mono font-black uppercase tracking-wider ${config.badgeBg}`}>
            {urgencyLevel} URGENCY
          </span>
          {moneyLost && amount && (
            <span className="text-xs font-mono text-red-300 mt-1 font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              FINANCIAL JEOPARDY: {amount}
            </span>
          )}
        </div>
      </div>

      {/* The Golden Hour Countdown / Urgency Explainer Box */}
      {urgencyLevel === 'CRITICAL' && (
        <div className="bg-red-950/70 border border-red-700/80 rounded-lg p-3.5 mb-5 flex items-start gap-3 text-xs font-sans">
          <Clock className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-spin" />
          <div>
            <h4 className="font-bold text-red-100 flex items-center gap-2">
              <span>THE GOLDEN HOUR WINDOW IS ACTIVE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-red-600 text-white rounded">
                CRITICAL INTERVENTION
              </span>
            </h4>
            <p className="text-red-200 mt-1 leading-relaxed">
              When financial fraud occurs, reporting immediately to <strong>1930 (National Cyber Crime Reporting Portal)</strong> enables law enforcement and the Indian Cyber Crime Coordination Centre (I4C) to trigger an electronic freeze request to the recipient bank before the mule syndicate can withdraw the cash from ATMs.
            </p>
            <p className="text-red-300/80 text-[11px] mt-1 font-mono">
              *Reporting speed significantly increases recovery odds, though judicial and bank clearance timelines vary.
            </p>
          </div>
        </div>
      )}

      {/* Why Urgency Assigned & Warning Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reasons */}
        <div className="bg-[#050810]/70 border border-slate-800 rounded-lg p-3.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 mb-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>{t.whyUrgency}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {urgencyReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warning Signals Detected */}
        <div className="bg-[#050810]/70 border border-slate-800 rounded-lg p-3.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 mb-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>IMPERSONATION & THREAT SIGNALS DETECTED:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scamSignals.map((signal, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-700/80 text-amber-200 text-[11px] font-mono flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                {signal}
              </span>
            ))}
            {scamSignals.length === 0 && (
              <span className="text-xs text-slate-500 font-mono">No deceptive extortion patterns detected.</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">
            *Signals are algorithmic warning indicators for decision support, not proof of individual criminal liability.
          </p>
        </div>
      </div>
    </div>
  );
};
