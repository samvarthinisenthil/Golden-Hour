import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Building,
  ShieldAlert,
  CheckSquare,
  PackageCheck
} from 'lucide-react';
import type { Incident } from '../types';

interface DocumentStationProps {
  incident: Incident;
}

export const DocumentStation: React.FC<DocumentStationProps> = ({ incident }) => {
  const [activeTab, setActiveTab] = useState<'complaint' | 'bank' | 'summary' | 'checklist'>('complaint');
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
    <div className="bg-[#080d17] border border-slate-800 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            OFFICIAL REPORTING DELIVERABLES & EVIDENCE BUNDLE
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-formatted legal documentation for National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in) and Bank Nodal Officers.
          </p>
        </div>

        <button
          onClick={downloadCompleteBundle}
          className="flex items-center gap-2 text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-3.5 py-1.5 rounded transition shadow-md"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Download Complete Bundle (JSON/Docs)</span>
        </button>
      </div>

      {/* Document Tab Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-4">
        <button
          onClick={() => setActiveTab('complaint')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'complaint'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>1. Cybercrime Complaint (NCRP Draft)</span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'bank'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>2. Bank Dispute & Recall Notice</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'summary'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>3. Incident Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'checklist'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>4. Evidence Checklist</span>
        </button>
      </div>

      {/* Responsible AI Disclaimer Banner */}
      <div className="text-[11px] font-mono text-slate-400 bg-slate-950 border border-slate-800 p-2.5 rounded mb-4 flex items-center justify-between">
        <span>⚠️ Review and verify all particulars before submitting to banks or law enforcement.</span>
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
            className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-900 px-2 py-1 rounded border border-slate-700 transition"
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
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-slate-900 px-2 py-1 rounded border border-slate-700 transition"
          >
            <Download className="w-3 h-3" />
            <span>Download .TXT</span>
          </button>
        </div>
      </div>

      {/* Document View Content */}
      <div className="bg-[#050810] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[480px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
        {activeTab === 'complaint' && incident.documents.cybercrimeComplaint}
        {activeTab === 'bank' && incident.documents.bankDisputeLetter}
        {activeTab === 'summary' && incident.documents.incidentSummaryText}
        {activeTab === 'checklist' && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-300 mb-2">REQUIRED EVIDENCE CHECKLIST:</h4>
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
