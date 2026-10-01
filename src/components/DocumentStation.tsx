import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Building,
  ShieldAlert,
  CheckSquare,
  PackageCheck,
  Archive
} from 'lucide-react';
import type { Incident } from '../types';

interface DocumentStationProps {
  incident: Incident;
}

export const DocumentStation: React.FC<DocumentStationProps> = ({ incident }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'complaint' | 'bank' | 'bundle'>('complaint');
  const [copied, setCopied] = useState(false);

  const copyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTextFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadCompleteBundle = () => {
    const bundleData = {
      incidentId: incident.id,
      timestamp: incident.createdAt,
      scamCategory: incident.scamCategory,
      categoryName: incident.categoryName,
      urgencyLevel: incident.urgencyLevel,
      urgencyReasons: incident.urgencyReasons,
      scamSignals: incident.scamSignals,
      status: incident.status,
      entities: incident.entities,
      timeline: incident.timeline,
      actions: incident.actions,
      documents: incident.documents
    };

    const bundleString = JSON.stringify(bundleData, null, 2);
    downloadTextFile(`goldenhour_bundle_${incident.id}.json`, bundleString);
  };

  return (
    <div id="documents-section" className="bg-[#03060f] border border-emerald-950/80 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/60 pb-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold font-mono text-white">
              INCIDENT REPORTING DELIVERABLES &amp; EVIDENCE BUNDLE
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Structured legal reporting materials generated for National Cyber Crime Portal (1930 / cybercrime.gov.in) and Bank Fraud Nodal Officers.
          </p>
        </div>

        <button
          onClick={downloadCompleteBundle}
          className="flex items-center gap-2 text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <PackageCheck className="w-4 h-4" />
          <span>[ Download Evidence Bundle (.JSON) ]</span>
        </button>
      </div>

      {/* 4 Document Options as specified in Section 6 & 15 */}
      <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-3 mb-4 font-mono text-xs">
        <button
          onClick={() => setActiveTab('complaint')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'complaint'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>[ Complaint Draft (NCRP) ]</span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'bank'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>[ Bank Communication (RBI Notice) ]</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'summary'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>[ Incident Summary ]</span>
        </button>

        <button
          onClick={() => setActiveTab('bundle')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'bundle'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>[ Evidence Checklist ]</span>
        </button>
      </div>

      {/* Action Bar */}
      <div className="text-[11px] font-mono text-slate-400 bg-[#02050c] border border-slate-850 p-2.5 rounded mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-slate-400">Notice: Review and verify all particulars before submitting to banks or law enforcement.</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const currentContent = activeTab === 'complaint'
                ? incident.documents.cybercrimeComplaint
                : activeTab === 'bank'
                ? incident.documents.bankDisputeLetter
                : activeTab === 'summary'
                ? incident.documents.incidentSummaryText
                : incident.documents.evidenceChecklist.join('\n');
              copyText(currentContent);
            }}
            className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-700 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={() => {
              const currentContent = activeTab === 'complaint'
                ? incident.documents.cybercrimeComplaint
                : activeTab === 'bank'
                ? incident.documents.bankDisputeLetter
                : activeTab === 'summary'
                ? incident.documents.incidentSummaryText
                : incident.documents.evidenceChecklist.join('\n');
              downloadTextFile(`${incident.id}_${activeTab}.txt`, currentContent);
            }}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-700 transition"
          >
            <Download className="w-3 h-3" />
            <span>Download .TXT</span>
          </button>
        </div>
      </div>

      {/* Document View Content */}
      <div className="bg-[#020409] border border-slate-850 rounded-lg p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[480px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
        {activeTab === 'complaint' && incident.documents.cybercrimeComplaint}
        {activeTab === 'bank' && incident.documents.bankDisputeLetter}
        {activeTab === 'summary' && incident.documents.incidentSummaryText}
        {activeTab === 'bundle' && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-300 mb-2">EVIDENCE CHECKLIST FOR 1930 / BANK INVESTIGATION:</h4>
            {incident.documents.evidenceChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">[✓]</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
