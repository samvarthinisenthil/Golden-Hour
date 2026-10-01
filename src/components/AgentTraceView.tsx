import React, { useState } from 'react';
import { Activity, CheckCircle2, ChevronDown, ChevronUp, Terminal, Cpu } from 'lucide-react';
import type { AgentTraceItem } from '../types';

interface AgentTraceViewProps {
  trace: AgentTraceItem[];
  executionTimeMs?: number;
}

export const AgentTraceView: React.FC<AgentTraceViewProps> = ({
  trace,
  executionTimeMs
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="bg-[#080d17] border border-slate-800 rounded-xl overflow-hidden mb-8 shadow-lg">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-[#0a101d] flex items-center justify-between cursor-pointer hover:bg-slate-900 transition border-b border-slate-800/80"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase flex items-center gap-2">
              AGENT EXECUTION TRACE
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded">
                8/8 STEPS ORCHESTRATED
              </span>
            </span>
            <p className="text-[11px] text-slate-500 font-mono">
              Deterministic Rules + Hybrid Gemini 3.8 Flash Reasoning • {executionTimeMs ? `${executionTimeMs}ms total latency` : 'Real-time pipeline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{isOpen ? 'Collapse Trace' : 'Inspect Pipeline'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-2.5 bg-[#060a12] font-mono text-xs">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 border-b border-slate-900 pb-2 mb-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>AGENTIC PROTOCOL: UNDERSTAND ➔ REASON ➔ PLAN ➔ USE TOOLS ➔ ACT ➔ DELIVER</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {trace.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-2.5 rounded bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 hover:border-slate-700 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-200 truncate">{item.step}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">{item.durationMs}ms</span>
                  </div>
                  <div className="text-[11px] text-emerald-400/90 font-semibold mt-0.5">
                    Tool: {item.toolUsed}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
