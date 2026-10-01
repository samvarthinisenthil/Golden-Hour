import React from 'react';
import { PhoneCall, ShieldAlert, CheckCircle2, AlertOctagon, Building, Users } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface PanicModeBannerProps {
  currentLanguage: SupportedLanguage;
  onExitPanicMode: () => void;
  onOpenBankModal: () => void;
  onScrollToFamilyAlert: () => void;
  disputedAmount?: string;
}

export const PanicModeBanner: React.FC<PanicModeBannerProps> = ({
  currentLanguage,
  onExitPanicMode,
  onOpenBankModal,
  onScrollToFamilyAlert,
  disputedAmount
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="bg-gradient-to-b from-red-950/90 via-red-950/60 to-slate-950 border-2 border-red-600 rounded-xl p-5 md:p-6 shadow-[0_0_40px_rgba(239,68,68,0.25)] text-white mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-800/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg animate-pulse">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500 text-white uppercase tracking-wider">
                EMERGENCY ACTIVATED
              </span>
              {disputedAmount && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-900/80 border border-red-600/60 text-red-200">
                  ESTIMATED JEOPARDY: <strong className="text-white">{disputedAmount}</strong>
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-red-100 mt-0.5">
              {t.panicModeActiveTitle}
            </h2>
            <p className="text-xs md:text-sm text-red-300 font-medium">
              {t.panicModeActiveSub}
            </p>
          </div>
        </div>

        <button
          onClick={onExitPanicMode}
          className="text-xs font-mono text-slate-400 hover:text-white bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded transition"
        >
          Dismiss Emergency View
        </button>
      </div>

      {/* Emergency Fast Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <a
          href="tel:1930"
          className="flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black py-3.5 px-4 rounded-lg shadow-lg shadow-red-900/40 text-center transition tracking-wide text-sm md:text-base border border-red-400"
        >
          <PhoneCall className="w-5 h-5 animate-bounce" />
          <span>{t.call1930Button}</span>
        </a>

        <button
          onClick={onOpenBankModal}
          className="flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold py-3.5 px-4 rounded-lg border border-amber-500/40 text-center transition text-sm md:text-base"
        >
          <Building className="w-5 h-5 text-amber-400" />
          <span>{t.contactBankButton}</span>
        </button>

        <button
          onClick={onScrollToFamilyAlert}
          className="flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold py-3.5 px-4 rounded-lg border border-emerald-500/40 text-center transition text-sm md:text-base"
        >
          <Users className="w-5 h-5 text-emerald-400" />
          <span>ALERT TRUSTED FAMILY</span>
        </button>
      </div>

      {/* 6 Immediate Emergency Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm font-sans">
        <div className="p-3.5 rounded-lg bg-black/40 border border-red-900/50 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-100">{t.step1}</h4>
            <p className="text-slate-300 text-xs mt-0.5">{t.step1Desc}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-black/40 border border-red-900/50 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-100">{t.step2}</h4>
            <p className="text-slate-300 text-xs mt-0.5">{t.step2Desc}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-black/40 border border-red-900/50 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-100">{t.step3}</h4>
            <p className="text-slate-300 text-xs mt-0.5">{t.step3Desc}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-black/40 border border-red-900/50 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-200">{t.step4}</h4>
            <p className="text-slate-300 text-xs mt-0.5">{t.step4Desc}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-black/40 border border-red-900/50 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-200">{t.step5}</h4>
            <p className="text-slate-300 text-xs mt-0.5">{t.step5Desc}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-black/40 border border-red-900/50 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-200">{t.step6}</h4>
            <p className="text-slate-300 text-xs mt-0.5">{t.step6Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
