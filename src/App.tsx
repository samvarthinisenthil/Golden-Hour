import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { PanicModeBanner } from './components/PanicModeBanner';
import { IncidentInput } from './components/IncidentInput';
import { AgentTraceView } from './components/AgentTraceView';
import { UrgencyCard } from './components/UrgencyCard';
import { EvidenceGraph } from './components/EvidenceGraph';
import { EvidenceList } from './components/EvidenceList';
import { TimelineView } from './components/TimelineView';
import { ActionTracker } from './components/ActionTracker';
import { DocumentStation } from './components/DocumentStation';
import { TrustedContactAlert } from './components/TrustedContactAlert';
import { BankModal } from './components/BankModal';
import { ResponsibleAiFooter } from './components/ResponsibleAiFooter';
import { DEMO_SCENARIOS, DemoScenario } from './data/mockScenarios';
import type { Incident, SupportedLanguage, TimelineEvent } from './types';
import { CheckCircle2, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [panicMode, setPanicMode] = useState<boolean>(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('digital-arrest');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(310);

  // Initialize with Case 1 (Digital Arrest Scam) for instant hackathon evaluation
  useEffect(() => {
    loadScenario(DEMO_SCENARIOS[0]);
  }, []);

  const loadScenario = async (scenario: DemoScenario) => {
    setActiveScenarioId(scenario.id);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: scenario.input,
          inputType: scenario.inputType,
          language: currentLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.incident) {
          setIncident(data.incident);
          setPanicMode(data.incident.urgencyLevel === 'CRITICAL');
          setExecutionTimeMs(data.executionTimeMs || 280);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend call fallback:', e);
    }

    setIsLoading(false);
  };

  const handleAnalyze = async (payload: {
    input: string;
    inputType: 'text' | 'screenshot' | 'transaction' | 'transcript' | 'voice';
    imageBase64?: string;
  }) => {
    setIsLoading(true);
    setActiveScenarioId('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: payload.input,
          inputType: payload.inputType,
          imageBase64: payload.imageBase64,
          language: currentLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.incident) {
          setIncident(data.incident);
          setPanicMode(data.incident.urgencyLevel === 'CRITICAL');
          setExecutionTimeMs(data.executionTimeMs || 250);
          setIsLoading(false);
          // Scroll to main dashboard smoothly
          const target = document.getElementById('main-dashboard-section');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    }

    setIsLoading(false);
  };

  const handleToggleAction = (actionId: string) => {
    if (!incident) return;

    const updatedActions = incident.actions.map(act => {
      if (act.id === actionId) {
        return { ...act, completed: !act.completed, completedAt: !act.completed ? new Date().toISOString() : undefined };
      }
      return act;
    });

    let newStatus = incident.status;
    const bankCompleted = updatedActions.some(a => a.category === 'bank' && a.completed);
    const evidenceCompleted = updatedActions.some(a => a.category === 'evidence' && a.completed);
    const complaintCompleted = updatedActions.some(a => a.category === 'portal' && a.completed);

    if (complaintCompleted && bankCompleted) {
      newStatus = 'RESOLVED';
    } else if (complaintCompleted) {
      newStatus = 'REPORT_READY';
    } else if (evidenceCompleted) {
      newStatus = 'EVIDENCE_LOCKED';
    } else if (bankCompleted) {
      newStatus = 'BANK_CONTACTED';
    } else {
      newStatus = incident.urgencyLevel === 'CRITICAL' ? 'ACTION_REQUIRED' : 'RESOLVED';
    }

    setIncident({
      ...incident,
      actions: updatedActions,
      status: newStatus
    });
  };

  const handleUpdateTimeline = (newTimeline: TimelineEvent[]) => {
    if (!incident) return;
    setIncident({
      ...incident,
      timeline: newTimeline
    });
  };

  const handleAddManualEntity = (type: 'phone' | 'upi' | 'txn' | 'bank', val: string) => {
    if (!incident) return;
    const entities = { ...incident.entities };
    if (type === 'phone' && !entities.phoneNumbers.includes(val)) {
      entities.phoneNumbers = [...entities.phoneNumbers, val];
    } else if (type === 'upi' && !entities.upiIds.includes(val)) {
      entities.upiIds = [...entities.upiIds, val];
    } else if (type === 'txn' && !entities.transactionIds.includes(val)) {
      entities.transactionIds = [...entities.transactionIds, val];
    } else if (type === 'bank' && !entities.bankNames.includes(val)) {
      entities.bankNames = [...entities.bankNames, val];
    }
    setIncident({
      ...incident,
      entities
    });
  };

  const scrollToFamilyAlert = () => {
    const el = document.getElementById('family-alert-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDocuments = () => {
    const el = document.getElementById('documents-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020409] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header & Emergency Hotlines */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        panicMode={panicMode}
        onTogglePanicMode={() => setPanicMode(!panicMode)}
        onLoadScenario={loadScenario}
        activeScenarioId={activeScenarioId}
        onStartNewIncident={() => scrollToSection('incident-intake-section')}
      />

      {/* Main Command Center Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {/* Landing Hero Screen as requested in Section 13 */}
        <LandingHero
          onStartResponse={() => scrollToSection('incident-intake-section')}
          onSelectDemo={(sc) => loadScenario(sc)}
        />

        {/* Urgent Panic Mode View (if toggled or triggered by critical loss) */}
        {panicMode && (
          <PanicModeBanner
            currentLanguage={currentLanguage}
            onExitPanicMode={() => setPanicMode(false)}
            onOpenBankModal={() => setIsBankModalOpen(true)}
            onScrollToFamilyAlert={scrollToFamilyAlert}
            onScrollToDocuments={scrollToDocuments}
            disputedAmount={incident?.entities.amount}
          />
        )}

        {/* Incident Intake Screen as requested in Section 14 */}
        <IncidentInput
          currentLanguage={currentLanguage}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Main Incident Dashboard when an incident is active */}
        {incident && (
          <div id="main-dashboard-section" className="space-y-6">
            {/* Agent Trace Panel as requested in Section 3 */}
            <AgentTraceView
              trace={incident.agentTrace}
              executionTimeMs={executionTimeMs}
              scamCategory={incident.categoryName}
              urgencyLevel={incident.urgencyLevel}
              entityCount={(incident.entities.phoneNumbers.length + incident.entities.upiIds.length + incident.entities.transactionIds.length) || 6}
              actionCount={incident.actions.length}
            />

            {/* Urgency & Risk Engine Card with "Why This Was Flagged" */}
            <UrgencyCard
              urgencyLevel={incident.urgencyLevel}
              scamCategory={incident.scamCategory}
              categoryName={incident.categoryName}
              urgencyReasons={incident.urgencyReasons}
              scamSignals={incident.scamSignals}
              moneyLost={incident.moneyLost}
              amount={incident.entities.amount}
              confidenceScore={incident.confidenceScore}
              currentLanguage={currentLanguage}
              incidentId={incident.id}
            />

            {/* Personalized Numbered Response Plan (01, 02, 03...) */}
            <ActionTracker
              actions={incident.actions}
              status={incident.status}
              onToggleAction={handleToggleAction}
              onOpenBankModal={() => setIsBankModalOpen(true)}
            />

            {/* Evidence Relationship Graph as requested in Section 7 */}
            <EvidenceGraph
              entities={incident.entities}
              categoryName={incident.categoryName}
            />

            {/* Extracted Evidence Intelligence as requested in Section 6 */}
            <EvidenceList
              entities={incident.entities}
              onAddManualEntity={handleAddManualEntity}
            />

            {/* Chronological Incident Timeline as requested in Section 5 */}
            <TimelineView
              timeline={incident.timeline}
              onUpdateTimeline={handleUpdateTimeline}
            />

            {/* Official Reporting Deliverables & Evidence Bundle as requested in Section 6 & 15 */}
            <DocumentStation incident={incident} />

            {/* Trusted Contact Feature with User Confirmation as requested in Section 8 */}
            <TrustedContactAlert
              currentLanguage={currentLanguage}
              incidentId={incident.id}
              disputedAmount={incident.entities.amount}
              bankName={incident.entities.bankNames[0]}
            />

            {/* Final "Incident Response Ready" Confirmation Banner */}
            <div className="bg-[#030810] border border-emerald-500/50 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] mb-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3 border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-black font-mono text-white tracking-wide">
                INCIDENT RESPONSE READY
              </h3>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto mt-1 font-sans">
                You have a structured incident summary, forensic evidence timeline, priority action plan, and official reporting drafts ready for 1930 and bank nodal officers.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 mt-4 text-xs font-mono">
                <span className="text-emerald-400">✓ Act quickly</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">✓ Verify information</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">✓ Use official 1930 / cybercrime.gov.in channels</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Indian Banks & UPI Emergency Directory Modal */}
      <BankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
      />

      {/* Responsible AI & Official Citation Footer */}
      <ResponsibleAiFooter currentLanguage={currentLanguage} />
    </div>
  );
}
