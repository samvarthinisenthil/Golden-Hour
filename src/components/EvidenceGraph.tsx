import React from 'react';
import {
  Phone,
  UserX,
  CreditCard,
  Building,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  Hash,
  ExternalLink
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
  const suspectPhone = entities.phoneNumbers[0] || 'Unknown Caller / Spoofed';
  const suspectClaim = entities.scammerClaims[0] || categoryName || 'Impersonation';
  const suspectUpi = entities.upiIds[0] || 'Mule Account / VPA';
  const disputedAmount = entities.amount || 'Disputed Sum';
  const txnRef = entities.transactionIds[0] || 'UTR Pending Verification';
  const bankName = entities.bankNames[0] || 'Recipient / Sender Bank';

  const nodes = [
    {
      id: 'phone',
      icon: Phone,
      label: 'SUSPECT IDENTIFIER',
      value: suspectPhone,
      color: 'border-red-500/70 bg-red-950/40 text-red-300',
      badge: entities.identifiersChecked?.some(i => i.type === 'phone' && i.riskScore === 'HIGH')
        ? 'Flagged Threat Intel'
        : 'Origin Node'
    },
    {
      id: 'claim',
      icon: UserX,
      label: 'DECEPTIVE CLAIM',
      value: suspectClaim,
      color: 'border-amber-500/70 bg-amber-950/40 text-amber-300',
      badge: 'Social Engineering'
    },
    {
      id: 'upi',
      icon: CreditCard,
      label: 'BENEFICIARY UPI / VPA',
      value: suspectUpi,
      color: 'border-purple-500/70 bg-purple-950/40 text-purple-300',
      badge: entities.identifiersChecked?.some(i => i.type === 'upi' && i.riskScore === 'HIGH')
        ? 'Reported Mule Account'
        : 'Payment Vector'
    },
    {
      id: 'amount',
      icon: DollarSign,
      label: 'EXTORTED / DEBITED',
      value: disputedAmount,
      color: 'border-emerald-500/70 bg-emerald-950/40 text-emerald-300 font-bold',
      badge: 'Financial Impact'
    },
    {
      id: 'txn',
      icon: Hash,
      label: 'TRANSACTION REFERENCE',
      value: txnRef,
      color: 'border-cyan-500/70 bg-cyan-950/40 text-cyan-300',
      badge: 'Bank Ledger Proof'
    },
    {
      id: 'bank',
      icon: Building,
      label: 'INSTITUTION ROUTING',
      value: bankName,
      color: 'border-blue-500/70 bg-blue-950/40 text-blue-300',
      badge: 'Settlement Entity'
    }
  ];

  return (
    <div className="bg-[#080d17] border border-slate-800 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            EVIDENCE RELATIONSHIP GRAPH
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual map connecting caller, claims, financial routing, and settlement nodes for cybercrime investigation.
          </p>
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
          *Advisory Evidence Correlation • Formal proof requires bank warrant
        </div>
      </div>

      {/* Visual Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {nodes.map((node, idx) => {
          const NodeIcon = node.icon;
          return (
            <div key={node.id} className="relative flex flex-col justify-between">
              <div className={`p-3.5 rounded-lg border flex-1 flex flex-col justify-between transition hover:scale-[1.02] ${node.color}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <NodeIcon className="w-4 h-4 shrink-0" />
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/60 border border-white/10 font-bold">
                      {node.badge}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {node.label}
                  </div>
                </div>

                <div className="mt-2.5 text-xs font-mono break-all font-semibold text-white">
                  {node.value}
                </div>
              </div>

              {/* Connecting arrow for larger screens */}
              {idx < nodes.length - 1 && (
                <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
