import React from 'react';
import { ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ResponsibleAiFooterProps {
  currentLanguage: SupportedLanguage;
}

export const ResponsibleAiFooter: React.FC<ResponsibleAiFooterProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <footer className="border-t border-slate-800/80 bg-[#050810] py-8 px-4 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Core Disclaimer Box */}
        <div className="bg-[#080d17] border border-slate-800 rounded-lg p-4 text-slate-400 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>RESPONSIBLE AI & OFFICIAL CITATION NOTICE</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {t.officialDisclaimer}
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            GoldenHour does not freeze bank accounts, execute fund reversals, or replace law enforcement authorities. All emergency response procedures must be confirmed via official channels: National Cyber Crime Reporting Portal (<a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">cybercrime.gov.in</a>) or 1930 Citizen Financial Cyber Fraud Helpline.
          </p>
        </div>

        {/* Links and Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] border-t border-slate-850 pt-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>GOLDENHOUR • BHARAT AGENTIC 2026 PROTOTYPE</span>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-400">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <span>NCRP Portal (1930)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://sancharsaathi.gov.in/sfc/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <span>Chakshu DoT Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://rbi.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <span>RBI Circular 2017-18</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
