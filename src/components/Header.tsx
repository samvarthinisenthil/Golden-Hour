import React from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, Globe, Sparkles } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { DEMO_SCENARIOS, DemoScenario } from '../data/mockScenarios';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  panicMode: boolean;
  onTogglePanicMode: () => void;
  onLoadScenario: (scenario: DemoScenario) => void;
  activeScenarioId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  panicMode,
  onTogglePanicMode,
  onLoadScenario,
  activeScenarioId
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="border-b border-slate-800 bg-[#060a12]/95 backdrop-blur sticky top-0 z-40">
      {/* Top Emergency Ticker */}
      <div className="bg-red-950/80 border-b border-red-900/50 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono text-red-200">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold tracking-wide text-red-100">{t.hotlineBadge}</span>
          <span className="text-red-300 hidden md:inline">• National Cyber Crime Reporting Portal (NCRP)</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-2.5 py-0.5 rounded font-bold transition shadow-sm"
          >
            <PhoneCall className="w-3 h-3" />
            <span>DIAL 1930</span>
          </a>
          <span className="text-slate-400 hidden sm:inline text-[11px]">BHARAT AGENTIC 2026</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                GOLDEN<span className="text-emerald-400">HOUR</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                AGENT v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{t.tagline}</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-xs font-medium text-slate-300">
            <Globe className="w-3.5 h-3.5 mx-1.5 text-slate-500" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded transition ${currentLanguage === 'en' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded transition ${currentLanguage === 'hi' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-white'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('ta')}
              className={`px-2 py-1 rounded transition ${currentLanguage === 'ta' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-white'}`}
            >
              தமிழ்
            </button>
          </div>

          {/* Panic Mode Toggle */}
          <button
            onClick={onTogglePanicMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition ${
              panicMode
                ? 'bg-red-600 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400'
                : 'bg-slate-900 hover:bg-slate-800 text-red-400 border border-red-900/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-300" />
            <span>{panicMode ? 'EXIT PANIC MODE' : 'PANIC MODE'}</span>
          </button>
        </div>
      </div>

      {/* Demo Scenarios Quick Bar */}
      <div className="bg-slate-950/90 border-t border-slate-900 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">DEMO CASES:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {DEMO_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => onLoadScenario(sc)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
                  activeScenarioId === sc.id
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="mr-1.5">
                  {sc.expectedUrgency === 'CRITICAL' ? '🔴' : sc.expectedUrgency === 'LOW' ? '🟡' : '🟢'}
                </span>
                {sc.name.split(':')[1]?.trim() || sc.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
