export type ScamCategory =
  | 'DIGITAL_ARREST'
  | 'UPI_FRAUD'
  | 'PHISHING'
  | 'FAKE_KYC'
  | 'BANK_IMPERSONATION'
  | 'GOVERNMENT_IMPERSONATION'
  | 'INVESTMENT_SCAM'
  | 'JOB_SCAM'
  | 'LOAN_SCAM'
  | 'REMOTE_ACCESS_SCAM'
  | 'OTP_CREDENTIAL_THEFT'
  | 'ROMANCE_SCAM'
  | 'SEXTORTION'
  | 'MULE_ACCOUNT'
  | 'BENIGN_INFORMATIONAL'
  | 'OTHER';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'LOW' | 'INFORMATIONAL';

export type IncidentStatus =
  | 'ANALYZING'
  | 'ACTION_REQUIRED'
  | 'BANK_CONTACTED'
  | 'EVIDENCE_LOCKED'
  | 'REPORT_READY'
  | 'RESOLVED';

export interface ExtractedEntities {
  phoneNumbers: string[];
  upiIds: string[];
  urls: string[];
  amount?: string;
  amountNumeric?: number;
  transactionIds: string[];
  bankNames: string[];
  date?: string;
  time?: string;
  scammerClaims: string[];
  requestedActions: string[];
  appsMentioned: string[];
  identifiersChecked?: {
    identifier: string;
    type: 'phone' | 'upi' | 'url';
    riskScore: 'HIGH' | 'MEDIUM' | 'SAFE' | 'UNKNOWN';
    details: string;
    isSyntheticDemo: boolean;
  }[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'contact' | 'threat' | 'transaction' | 'action' | 'system';
  isEditable?: boolean;
}

export interface ActionStep {
  id: string;
  priority: number;
  title: string;
  description: string;
  category: 'immediate_call' | 'bank' | 'evidence' | 'portal' | 'security' | 'family';
  contactNumber?: string;
  actionUrl?: string;
  completed: boolean;
  completedAt?: string;
}

export interface AgentTraceItem {
  id: string;
  step: string;
  toolUsed: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  message: string;
  durationMs: number;
}

export interface Incident {
  id: string;
  createdAt: string;
  language: 'en' | 'hi' | 'ta';
  rawInput: string;
  inputType: 'text' | 'screenshot' | 'transaction' | 'transcript' | 'voice';
  scamCategory: ScamCategory;
  categoryName: string;
  confidenceScore: number;
  urgencyLevel: UrgencyLevel;
  urgencyReasons: string[];
  scamSignals: string[];
  status: IncidentStatus;
  summary: string;
  entities: ExtractedEntities;
  timeline: TimelineEvent[];
  actions: ActionStep[];
  agentTrace: AgentTraceItem[];
  panicModeActive: boolean;
  moneyLost: boolean;
  reportedTo1930: boolean;
  bankContacted: boolean;
  documents: {
    cybercrimeComplaint: string;
    bankDisputeLetter: string;
    incidentSummaryText: string;
    evidenceChecklist: string[];
  };
}

export type SupportedLanguage = 'en' | 'hi' | 'ta';
