import React, { useState } from 'react';
import {
  Copy,
  Check,
  Plus,
  ShieldAlert,
  Phone,
  CreditCard,
  Hash,
  Globe,
  Building,
  DollarSign,
  Tag
} from 'lucide-react';
import type { ExtractedEntities } from '../types';

interface EvidenceListProps {
  entities: ExtractedEntities;
  onAddManualEntity?: (type: 'phone' | 'upi' | 'txn' | 'bank', val: string) => void;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({
  entities,
  onAddManualEntity
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newType, setNewType] = useState<'phone' | 'upi' | 'txn' | 'bank'>('txn');
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    if (onAddManualEntity) {
      onAddManualEntity(newType, newValue.trim());
    }
    setNewValue('');
    setIsAdding(false);
  };

  return (
    <div className="bg-[#080d17] border border-slate-800 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            EXTRACTED EVIDENCE INTELLIGENCE
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key forensic markers extracted by the GoldenHour Entity Intelligence tool for bank and cybercrime reporting.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 px-3 py-1.5 rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Missing Evidence</span>
        </button>
      </div>

      {/* Manual Add Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-5 flex flex-wrap gap-2 text-xs font-mono">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            className="bg-slate-900 border border-slate-750 text-slate-200 px-2 py-1.5 rounded"
          >
            <option value="txn">Transaction ID</option>
            <option value="upi">UPI ID</option>
            <option value="phone">Phone Number</option>
            <option value="bank">Bank Name</option>
          </select>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter value (e.g. UTR 428190281920)..."
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="bg-slate-800 text-slate-400 px-3 py-1.5 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Phone Numbers */}
        {entities.phoneNumbers.map((phone, idx) => {
          const threat = entities.identifiersChecked?.find(i => i.type === 'phone' && (phone.includes(i.identifier) || i.identifier.includes(phone)));
          return (
            <div key={`phone-${idx}`} className="p-3 rounded-lg bg-[#060a12] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-red-400" />
                    SUSPECT PHONE
                  </span>
                  {threat && (
                    <span className="text-[10px] text-red-400 font-bold bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800/60">
                      FLAGGED INTEL
                    </span>
                  )}
                </div>
                <div className="text-sm font-mono font-bold text-white break-all">
                  {phone}
                </div>
                {threat && (
                  <p className="text-[10px] text-red-300/80 mt-1 font-mono leading-tight">
                    {threat.details}
                  </p>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(phone, `phone-${idx}`)}
                className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-emerald-300 bg-slate-900/60 py-1 rounded border border-slate-800 transition"
              >
                {copiedKey === `phone-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === `phone-${idx}` ? 'Copied' : 'Copy Number'}</span>
              </button>
            </div>
          );
        })}

        {/* UPI IDs */}
        {entities.upiIds.map((upi, idx) => {
          const threat = entities.identifiersChecked?.find(i => i.type === 'upi' && i.identifier.toLowerCase() === upi.toLowerCase());
          return (
            <div key={`upi-${idx}`} className="p-3 rounded-lg bg-[#060a12] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                    BENEFICIARY UPI ID
                  </span>
                  {threat && (
                    <span className="text-[10px] text-red-400 font-bold bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800/60">
                      KNOWN MULE
                    </span>
                  )}
                </div>
                <div className="text-sm font-mono font-bold text-white break-all">
                  {upi}
                </div>
                {threat && (
                  <p className="text-[10px] text-red-300/80 mt-1 font-mono leading-tight">
                    {threat.details}
                  </p>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(upi, `upi-${idx}`)}
                className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-emerald-300 bg-slate-900/60 py-1 rounded border border-slate-800 transition"
              >
                {copiedKey === `upi-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === `upi-${idx}` ? 'Copied' : 'Copy UPI ID'}</span>
              </button>
            </div>
          );
        })}

        {/* Transaction IDs */}
        {entities.transactionIds.map((txn, idx) => (
          <div key={`txn-${idx}`} className="p-3 rounded-lg bg-[#060a12] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  TRANSACTION REF / UTR
                </span>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                  CRITICAL PROOF
                </span>
              </div>
              <div className="text-sm font-mono font-bold text-white break-all">
                {txn}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(txn, `txn-${idx}`)}
              className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-emerald-300 bg-slate-900/60 py-1 rounded border border-slate-800 transition"
            >
              {copiedKey === `txn-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === `txn-${idx}` ? 'Copied' : 'Copy TXN Ref'}</span>
            </button>
          </div>
        ))}

        {/* Amount */}
        {entities.amount && (
          <div className="p-3 rounded-lg bg-[#060a12] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  FRAUDULENT LOSS AMOUNT
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                  RECALL TARGET
                </span>
              </div>
              <div className="text-xl font-mono font-black text-emerald-400">
                {entities.amount}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(entities.amount!, 'amount')}
              className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-emerald-300 bg-slate-900/60 py-1 rounded border border-slate-800 transition"
            >
              {copiedKey === 'amount' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'amount' ? 'Copied' : 'Copy Amount'}</span>
            </button>
          </div>
        )}

        {/* URLs */}
        {entities.urls.map((u, idx) => (
          <div key={`url-${idx}`} className="p-3 rounded-lg bg-[#060a12] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  SUSPECT PHISHING URL
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                  DO NOT OPEN
                </span>
              </div>
              <div className="text-xs font-mono font-semibold text-slate-200 break-all">
                {u}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(u, `url-${idx}`)}
              className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-emerald-300 bg-slate-900/60 py-1 rounded border border-slate-800 transition"
            >
              {copiedKey === `url-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === `url-${idx}` ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
        ))}

        {/* Banks */}
        {entities.bankNames.map((b, idx) => (
          <div key={`bank-${idx}`} className="p-3 rounded-lg bg-[#060a12] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  BANK INVOLVED
                </span>
              </div>
              <div className="text-sm font-mono font-bold text-white">
                {b}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(b, `bank-${idx}`)}
              className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-emerald-300 bg-slate-900/60 py-1 rounded border border-slate-800 transition"
            >
              {copiedKey === `bank-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === `bank-${idx}` ? 'Copied' : 'Copy Bank'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
