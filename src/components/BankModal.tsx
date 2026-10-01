import React from 'react';
import { X, PhoneCall, Globe, Mail, ShieldAlert, Building } from 'lucide-react';
import { BANK_HELPLINES } from '../data/mockScenarios';

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankModal: React.FC<BankModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#090e1a] border border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#060a12] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                INDIAN BANKS & UPI APPS FRAUD EMERGENCY DIRECTORY
              </h3>
              <p className="text-xs text-slate-400">
                Official 24x7 emergency response numbers for blocking NetBanking and freezing UPI accounts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bank Directory List */}
        <div className="p-5 overflow-y-auto space-y-3 font-mono text-xs">
          {Object.entries(BANK_HELPLINES).map(([key, item]) => (
            <div
              key={key}
              className="p-3.5 rounded-lg bg-[#050810] border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-bold text-white text-sm">{item.name}</span>
                <a
                  href={`tel:${item.fraudHelpline.split(' / ')[0].replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold px-2.5 py-1 rounded transition text-xs"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call {item.fraudHelpline.split(' / ')[0]}</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[11px]">All Fraud Helplines:</span>
                  <span className="text-amber-300">{item.fraudHelpline}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Official Fraud Email:</span>
                  <span className="text-cyan-400">{item.email}</span>
                </div>

                <div className="sm:col-span-2 mt-1">
                  <span className="text-slate-500 block text-[11px]">Instant UPI Block Method:</span>
                  <span className="text-slate-200">{item.upiBlockMethod}</span>
                  {item.ussdCode && (
                    <span className="text-emerald-400 block text-[11px] mt-0.5">
                      USSD Offline Code: {item.ussdCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#060a12] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono rounded transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
