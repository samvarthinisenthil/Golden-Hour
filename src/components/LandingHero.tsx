import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Zap,
  Lock,
  Radio,
  Clock
} from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../data/mockScenarios';

interface LandingHeroProps {
  onStartResponse: () => void;
  onSelectDemo: (scenario: DemoScenario) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartResponse,
  onSelectDemo
}) => {
  const supportedIncidents = [
    'UPI FRAUD',
    'DIGITAL ARREST',
    'PHISHING',
    'FAKE KYC',
    'BANK IMPERSONATION',
    'INVESTMENT SCAM',
    'REMOTE ACCESS',
    'CREDENTIAL THEFT'
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#060b14] via-[#040810] to-[#02040a] border border-emerald-950/70 p-6 md:p-10 mb-8 shadow-2xl">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Security Status Area */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono mb-6">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-500/40 text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM READY</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090e1a] border border-slate-800 text-slate-300">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>RESPONSE ENGINE ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090e1a] border border-slate-800 text-slate-300">
          <Terminal className="w-3 h-3 text-emerald-400" />
          <span>EVIDENCE ENGINE READY</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090e1a] border border-slate-800 text-slate-300">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>SAFE MODE ENABLED</span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>From suspected fraud to an organized response — in minutes.</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-mono leading-tight">
          GOLDEN<span className="text-emerald-400">HOUR</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold text-slate-200 mt-1 font-mono tracking-tight">
          Every second matters.
        </p>

        <p className="text-sm md:text-base text-slate-400 mt-3 leading-relaxed max-w-2xl font-sans">
          AI-powered emergency response agent for digital fraud victims in Bharat. When money or credentials are in jeopardy, GoldenHour understands the incident, assesses urgency, generates your action plan, and assembles official cybercrime &amp; bank reporting packages.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 mt-6">
          <button
            onClick={onStartResponse}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold px-6 py-3 rounded-lg shadow-[0_0_25px_rgba(16,185,129,0.35)] transition text-sm tracking-wider"
          >
            <span>START INCIDENT RESPONSE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectDemo(DEMO_SCENARIOS[0])}
            className="flex items-center gap-2 bg-[#090f1c] hover:bg-[#0e1628] border border-emerald-500/40 text-emerald-300 font-mono font-semibold px-5 py-3 rounded-lg transition text-sm"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>TRY DEMO (DIGITAL ARREST)</span>
          </button>
        </div>
      </div>

      {/* Supported Incident Categories Strip */}
      <div className="mt-8 pt-6 border-t border-emerald-950/60">
        <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2.5 font-bold">
          SUPPORTED INCIDENT PROFILES &amp; FORENSICS:
        </div>
        <div className="flex flex-wrap gap-2">
          {supportedIncidents.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded bg-[#060c18] border border-slate-800/90 text-slate-300 text-xs font-mono flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></span>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
