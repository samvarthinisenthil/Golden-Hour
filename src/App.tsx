import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
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

    // Fallback if network/offline
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
          // Scroll to urgency assessment
          window.scrollTo({ top: 320, behavior: 'smooth' });
          return;
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    }

    setIsLoading(false);
  };

  // Toggle Action item and update Incident Memory State
  const handleToggleAction = (actionId: string) => {
    if (!incident) return;

    const updatedActions = incident.actions.map(act => {
      if (act.id === actionId) {
        return { ...act, completed: !act.completed, completedAt: !act.completed ? new Date().toISOString() : undefined };
      }
      return act;
    });

    // Compute updated state
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
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header & Emergency Hotlines */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        panicMode={panicMode}
        onTogglePanicMode={() => setPanicMode(!panicMode)}
        onLoadScenario={loadScenario}
        activeScenarioId={activeScenarioId}
      />

      {/* Main Command Center Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {/* Urgent Panic Mode Banner (if toggled or triggered by critical loss) */}
        {panicMode && (
          <PanicModeBanner
            currentLanguage={currentLanguage}
            onExitPanicMode={() => setPanicMode(false)}
            onOpenBankModal={() => setIsBankModalOpen(true)}
            onScrollToFamilyAlert={scrollToFamilyAlert}
            disputedAmount={incident?.entities.amount}
          />
        )}

        {/* Multi-modal Incident Intake Section */}
        <IncidentInput
          currentLanguage={currentLanguage}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* If an Incident is Analyzed, display the complete response orchestration */}
        {incident && (
          <>
            {/* Agent Observability Trace */}
            <AgentTraceView
              trace={incident.agentTrace}
              executionTimeMs={executionTimeMs}
            />

            {/* Urgency & Risk Engine Card */}
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

            {/* Interactive Prioritized Actions & State Tracker */}
            <ActionTracker
              actions={incident.actions}
              status={incident.status}
              onToggleAction={handleToggleAction}
              onOpenBankModal={() => setIsBankModalOpen(true)}
            />

            {/* Visual Evidence Relationship Graph */}
            <EvidenceGraph
              entities={incident.entities}
              categoryName={incident.categoryName}
            />

            {/* Extracted Evidence Intelligence */}
            <EvidenceList
              entities={incident.entities}
              onAddManualEntity={handleAddManualEntity}
            />

            {/* Incident Chronological Timeline */}
            <TimelineView
              timeline={incident.timeline}
              onUpdateTimeline={handleUpdateTimeline}
            />

            {/* Official Reporting Deliverables (NCRP Complaint, Bank Letter, Evidence Bundle) */}
            <DocumentStation incident={incident} />

            {/* Family & Trusted Friend Alert Station */}
            <TrustedContactAlert
              currentLanguage={currentLanguage}
              incidentId={incident.id}
              disputedAmount={incident.entities.amount}
              bankName={incident.entities.bankNames[0]}
            />
          </>
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
