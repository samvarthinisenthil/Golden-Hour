import React from 'react';
import { PhoneCall, AlertTriangle, Globe, Sparkles, Shield, Clock, Activity } from 'lucide-react';
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
  onStartNewIncident: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  panicMode,
  onTogglePanicMode,
  onLoadScenario,
  activeScenarioId,
  onStartNewIncident
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="border-b border-emerald-950/60 bg-[#02040a]/95 backdrop-blur sticky top-0 z-40">
      {/* Top 1930 Emergency Notification Ticker */}
      <div className="bg-[#120407] border-b border-red-900/60 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono text-red-200">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold tracking-wider text-red-200 uppercase">NATIONAL CYBER FRAUD HELPLINE: 1930</span>
          <span className="text-red-400/80 hidden md:inline text-[11px]">• Indian Cyber Crime Coordination Centre (I4C / MHA)</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-2.5 py-0.5 rounded font-bold transition shadow-[0_0_12px_rgba(239,68,68,0.4)]"
          >
            <PhoneCall className="w-3 h-3" />
            <span>DIAL 1930 NOW</span>
          </a>
          <span className="text-slate-500 hidden sm:inline text-[10px]">BHARAT AGENTIC 2026</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand: Logo Combining Shield + Clock + Pulse */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onStartNewIncident}>
          <div className="relative w-10 h-10 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.25)]">
            {/* Minimal shield + clock + pulse composite symbol */}
            <Shield className="w-6 h-6 text-emerald-400" />
            <Clock className="w-3 h-3 text-emerald-200 absolute top-2 right-2" />
            <Activity className="w-3.5 h-3.5 text-emerald-300 absolute -bottom-1 -right-1 bg-[#02040a] rounded-full p-0.5 border border-emerald-500/60" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white font-mono">
                GOLDEN<span className="text-emerald-400">HOUR</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold tracking-wider">
                EMERGENCY AGENT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide">
              Every second matters.
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* New Incident Button */}
          <button
            onClick={onStartNewIncident}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
          >
            + New Incident
          </button>

          {/* Multilingual Selector */}
          <div className="flex items-center bg-[#070b14] border border-slate-800 rounded p-0.5 text-xs font-mono text-slate-300">
            <Globe className="w-3.5 h-3.5 mx-1.5 text-emerald-500/80" />
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

          {/* Signature Panic Mode Toggle */}
          <button
            onClick={onTogglePanicMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition ${
              panicMode
                ? 'bg-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)] border border-red-400 animate-pulse'
                : 'bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-300" />
            <span>{panicMode ? 'EXIT PANIC MODE' : '🚨 PANIC MODE'}</span>
          </button>
        </div>
      </div>

      {/* Demo Selector Bar */}
      <div className="bg-[#050810]/95 border-t border-slate-900 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold text-slate-300">DEMO CASES (2-MIN REVIEW):</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {DEMO_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => onLoadScenario(sc)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition border ${
                  activeScenarioId === sc.id
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-[#090e1a] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="mr-1">
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
