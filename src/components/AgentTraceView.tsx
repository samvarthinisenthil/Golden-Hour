import React, { useState } from 'react';
import { Terminal, CheckCircle2, ChevronDown, ChevronUp, Cpu, ArrowDown } from 'lucide-react';
import type { AgentTraceItem } from '../types';

interface AgentTraceViewProps {
  trace: AgentTraceItem[];
  executionTimeMs?: number;
  scamCategory?: string;
  urgencyLevel?: string;
  entityCount?: number;
  actionCount?: number;
}

export const AgentTraceView: React.FC<AgentTraceViewProps> = ({
  trace,
  executionTimeMs,
  scamCategory = 'UPI Fraud',
  urgencyLevel = 'CRITICAL',
  entityCount = 6,
  actionCount = 5
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!trace || trace.length === 0) return null;

  const agentWorkflow = [
    {
      step: 'INCIDENT RECEIVED',
      summary: 'Input ingested and sanitized from user reporting intake'
    },
    {
      step: 'UNDERSTANDING INCIDENT',
      summary: `✓ ${entityCount} entities extracted (phone, UPI, UTR, bank, amount)`
    },
    {
      step: 'CLASSIFYING INCIDENT',
      summary: `✓ ${scamCategory}`
    },
    {
      step: 'ASSESSING URGENCY',
      summary: `✓ ${urgencyLevel}`
    },
    {
      step: 'BUILDING RESPONSE PLAN',
      summary: `✓ ${actionCount} prioritized containment actions generated`
    },
    {
      step: 'PREPARING EVIDENCE',
      summary: '✓ Transaction + URL + phone metadata linked in forensic graph'
    },
    {
      step: 'GENERATING RESPONSE PACKAGE',
      summary: '✓ NCRP Complaint draft + Bank communication + Incident summary'
    }
  ];

  return (
    <div className="bg-[#03060f] border border-emerald-950/90 rounded-xl overflow-hidden mb-8 shadow-xl">
      {/* Top Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-[#060a14] flex items-center justify-between cursor-pointer hover:bg-[#080e1c] transition border-b border-emerald-950/60"
      >
        <div className="flex items-center gap-2.5 font-mono">
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <span className="text-emerald-400 tracking-wider">RESPONSE ENGINE TRACE</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded">
                AUTONOMOUS AGENT ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Deterministic Rules + Hybrid Gemini 3.8 Flash • {executionTimeMs ? `${executionTimeMs}ms execution time` : 'Orchestrated in real-time'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{isOpen ? 'Minimize Engine Trace' : 'View Engine Pipeline'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 md:p-5 font-mono text-xs">
          {/* Visual Step-by-Step Flow as requested in Section 3 */}
          <div className="mb-4 text-[11px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-900 pb-2 flex items-center justify-between">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              AGENTIC PIPELINE EXECUTION
            </span>
            <span className="text-slate-500 text-[10px]">No private chain-of-thought exposed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 relative">
            {agentWorkflow.map((item, idx) => (
              <div key={idx} className="flex flex-col justify-between p-2.5 rounded bg-[#060a14] border border-emerald-950/60 hover:border-emerald-500/40 transition">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
                    <span>STEP 0{idx + 1}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-200 uppercase leading-snug">
                    {item.step}
                  </h4>
                </div>
                <div className="mt-2 text-[10px] text-emerald-300/80 leading-tight">
                  {item.summary}
                </div>
              </div>
            ))}
          </div>

          {/* Granular Tool Logs */}
          <div className="mt-4 pt-3 border-t border-slate-900">
            <div className="text-[10px] text-slate-500 mb-2 font-semibold">TOOL EXECUTION RECORD:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {trace.map((item) => (
                <div key={item.id} className="p-2 rounded bg-[#040810] border border-slate-900 text-[10px] text-slate-400">
                  <div className="flex items-center justify-between font-bold text-slate-300">
                    <span className="truncate">{item.toolUsed}</span>
                    <span className="text-emerald-400 text-[9px]">{item.durationMs}ms</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
