import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  AlertOctagon,
  Building,
  Users,
  FileText,
  Lock,
  ExternalLink,
  Archive
} from 'lucide-react';
import type { SupportedLanguage } from '../types';

interface PanicModeBannerProps {
  currentLanguage: SupportedLanguage;
  onExitPanicMode: () => void;
  onOpenBankModal: () => void;
  onScrollToFamilyAlert: () => void;
  onScrollToDocuments: () => void;
  disputedAmount?: string;
}

export const PanicModeBanner: React.FC<PanicModeBannerProps> = ({
  onExitPanicMode,
  onOpenBankModal,
  onScrollToFamilyAlert,
  onScrollToDocuments,
  disputedAmount
}) => {
  return (
    <div className="bg-[#0f0407] border-2 border-red-600 rounded-xl p-5 md:p-6 shadow-[0_0_40px_rgba(239,68,68,0.25)] text-white mb-8">
      {/* Panic Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-900/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg animate-pulse">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500 text-white uppercase tracking-wider">
                EMERGENCY RESPONSE PROTOCOL
              </span>
              {disputedAmount && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950 border border-red-600/60 text-red-200">
                  ESTIMATED LOSS: <strong className="text-white">{disputedAmount}</strong>
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-red-100 mt-0.5">
              EMERGENCY CONTAINMENT ACTIVATED
            </h2>
            <p className="text-xs text-red-300 font-sans">
              Stay calm. GoldenHour has prepared your immediate emergency response sequence.
            </p>
          </div>
        </div>

        <button
          onClick={onExitPanicMode}
          className="text-xs font-mono text-slate-400 hover:text-white bg-black/60 border border-slate-700 px-3 py-1.5 rounded transition"
        >
          Exit Emergency View
        </button>
      </div>

      {/* 5 Core Emergency Directives as specified in Section 4 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 mb-6 text-xs font-mono">
        <div className="p-3 rounded-lg bg-black/50 border border-red-900/60 flex flex-col justify-between">
          <span className="text-red-400 font-bold block mb-1">01</span>
          <span className="text-slate-100 font-semibold leading-snug">STOP CONTACT WITH THE SUSPECT</span>
          <span className="text-[10px] text-slate-400 mt-1">Disconnect phone/video call immediately.</span>
        </div>

        <div className="p-3 rounded-lg bg-black/50 border border-red-900/60 flex flex-col justify-between">
          <span className="text-red-400 font-bold block mb-1">02</span>
          <span className="text-slate-100 font-semibold leading-snug">DO NOT SHARE OTP / PIN / CVV</span>
          <span className="text-[10px] text-slate-400 mt-1">No authority asks for payment PINs.</span>
        </div>

        <div className="p-3 rounded-lg bg-black/50 border border-red-900/60 flex flex-col justify-between">
          <span className="text-red-400 font-bold block mb-1">03</span>
          <span className="text-slate-100 font-semibold leading-snug">CONTACT YOUR BANK IMMEDIATELY</span>
          <span className="text-[10px] text-slate-400 mt-1">Request UPI and netbanking freeze.</span>
        </div>

        <div className="p-3 rounded-lg bg-black/50 border border-red-900/60 flex flex-col justify-between">
          <span className="text-red-400 font-bold block mb-1">04</span>
          <span className="text-slate-100 font-semibold leading-snug">CALL 1930 FOR CYBER FRAUD</span>
          <span className="text-[10px] text-slate-400 mt-1">Alert NCRP to trigger beneficiary lien.</span>
        </div>

        <div className="p-3 rounded-lg bg-black/50 border border-red-900/60 flex flex-col justify-between">
          <span className="text-red-400 font-bold block mb-1">05</span>
          <span className="text-slate-100 font-semibold leading-snug">PRESERVE ALL EVIDENCE</span>
          <span className="text-[10px] text-slate-400 mt-1">Lock screenshots and UTR references.</span>
        </div>
      </div>

      {/* Action Buttons as specified in Section 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
        <a
          href="tel:1930"
          className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold p-3 rounded-lg text-center transition shadow-md shadow-red-950 border border-red-400"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 1930</span>
        </a>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-[#0a0f18] hover:bg-[#121928] text-slate-200 border border-slate-700 font-bold p-3 rounded-lg text-center transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          <span>NCRP Portal</span>
        </a>

        <button
          onClick={onOpenBankModal}
          className="flex items-center justify-center gap-1.5 bg-[#0a0f18] hover:bg-[#121928] text-slate-200 border border-slate-700 font-bold p-3 rounded-lg text-center transition"
        >
          <Building className="w-3.5 h-3.5 text-amber-400" />
          <span>Bank Direct Lines</span>
        </button>

        <button
          onClick={onScrollToDocuments}
          className="flex items-center justify-center gap-1.5 bg-[#0a0f18] hover:bg-[#121928] text-slate-200 border border-slate-700 font-bold p-3 rounded-lg text-center transition"
        >
          <Archive className="w-3.5 h-3.5 text-cyan-400" />
          <span>Preserve Evidence</span>
        </button>

        <button
          onClick={onScrollToFamilyAlert}
          className="flex items-center justify-center gap-1.5 bg-[#0a0f18] hover:bg-[#121928] text-slate-200 border border-slate-700 font-bold p-3 rounded-lg text-center transition"
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trusted Contact</span>
        </button>

        <button
          onClick={onScrollToDocuments}
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-lg text-center transition shadow-md border border-emerald-400"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Complaint Draft</span>
        </button>
      </div>

      <p className="text-[10px] text-slate-400 mt-4 text-center font-mono">
        *Notice: GoldenHour provides decision support and reporting preparation. Official account freeze and police action are executed by authorized banks and law enforcement agencies.
      </p>
    </div>
  );
};
