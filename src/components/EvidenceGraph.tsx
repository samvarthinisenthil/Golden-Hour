import React from 'react';
import {
  Phone,
  User,
  CreditCard,
  Hash,
  Building,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Share2,
  AlertTriangle
} from 'lucide-react';
import type { ExtractedEntities } from '../types';

interface EvidenceGraphProps {
  entities: ExtractedEntities;
  categoryName: string;
}

export const EvidenceGraph: React.FC<EvidenceGraphProps> = ({
  entities,
  categoryName
}) => {
  const suspectPhone = entities.phoneNumbers[0] || '+91 98765 43210';
  const suspectUpi = entities.upiIds[0] || 'suspect.pool@icici';
  const disputedAmount = entities.amount || '₹25,000';
  const txnId = entities.transactionIds[0] || 'TXN9812401823';
  const bankName = entities.bankNames[0] || 'Victim Bank / Recipient';

  return (
    <div className="bg-[#03060f] border border-emerald-950/80 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/60 pb-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold font-mono text-white">
              EVIDENCE RELATIONSHIP VIEW
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Forensic correlation map linking caller origin, victim contact, beneficiary payment vector, and settlement ledger.
          </p>
        </div>

        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded">
          INVESTIGATION GRAPH • CRN READY
        </div>
      </div>

      {/* Cyber Relationship Tree Structure as explicitly described in Section 7 */}
      <div className="bg-[#020409] border border-slate-900 rounded-lg p-5 font-mono text-xs overflow-x-auto">
        <div className="min-w-[640px] space-y-4">
          {/* Node 1: PHONE NUMBER */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 text-red-200 flex items-center gap-2 w-72">
              <Phone className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <span className="text-[10px] text-red-400 block font-bold">SUSPECT PHONE NUMBER</span>
                <span className="font-bold text-white text-xs">{suspectPhone}</span>
              </div>
            </div>

            <div className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
              <span className="h-0.5 w-8 bg-slate-800"></span>
              <span className="text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                contacted via call/SMS
              </span>
              <span className="h-0.5 w-8 bg-slate-800"></span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Target 1: VICTIM */}
            <div className="p-3 rounded-lg bg-[#070d1a] border border-slate-800 text-slate-200 flex items-center gap-2 w-56">
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">TARGET ENTITY</span>
                <span className="font-bold text-white text-xs">Complainant / Victim</span>
              </div>
            </div>
          </div>

          {/* Branch connecting line */}
          <div className="pl-6 border-l-2 border-slate-800 ml-4 py-2 space-y-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="h-0.5 w-6 bg-slate-800"></span>
              <span className="text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/50">
                associated fraudulent destination
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
            </div>

            {/* Node 2: UPI ID */}
            <div className="pl-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/80 text-purple-200 flex items-center gap-2 w-72">
                  <CreditCard className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-purple-400 block font-bold">BENEFICIARY UPI ID / VPA</span>
                    <span className="font-bold text-white text-xs">{suspectUpi}</span>
                  </div>
                </div>

                <div className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                  <span className="h-0.5 w-8 bg-slate-800"></span>
                  <span className="text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    debited
                  </span>
                  <span className="h-0.5 w-8 bg-slate-800"></span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>

                {/* Node 3: AMOUNT */}
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/70 text-emerald-200 flex items-center gap-2 w-56 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-bold">DISPUTED SUM</span>
                    <span className="font-bold text-emerald-300 text-sm">{disputedAmount}</span>
                  </div>
                </div>
              </div>

              {/* Branch connecting line to Transaction and Bank */}
              <div className="pl-6 border-l-2 border-slate-800 ml-4 py-2 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/80 text-cyan-200 flex items-center gap-2 w-72">
                    <Hash className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-cyan-400 block font-bold">TRANSACTION REF / UTR</span>
                      <span className="font-bold text-white text-xs">{txnId}</span>
                    </div>
                  </div>

                  <div className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                    <span className="h-0.5 w-8 bg-slate-800"></span>
                    <span className="text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      settled via
                    </span>
                    <span className="h-0.5 w-8 bg-slate-800"></span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>

                  {/* Node 4: BANK */}
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/80 text-blue-200 flex items-center gap-2 w-56">
                    <Building className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-blue-400 block font-bold">SETTLEMENT BANK</span>
                      <span className="font-bold text-white text-xs">{bankName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
