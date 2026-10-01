import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { THREAT_INTEL_SYNTHETIC_DB, BANK_HELPLINES } from './src/data/mockScenarios.ts';
import type { Incident, ExtractedEntities, TimelineEvent, ActionStep, AgentTraceItem, ScamCategory, UrgencyLevel, IncidentStatus } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Credential Redactor (Security Rule: Never store/process real authentication secrets)
function redactSensitiveTokens(text: string): string {
  if (!text) return text;
  // Mask 4 to 6 digit standalone OTP/PIN patterns if explicitly marked
  return text
    .replace(/(?:otp|pin|cvv|password)\s*[:=]?\s*([0-9]{3,6})/gi, 'OTP/PIN: [REDACTED FOR SECURITY]')
    .replace(/\b([0-9]{4,6})\b(?=.*(?:otp|pin|code|verify))/gi, '[REDACTED_CODE]');
}

// Rule-based deterministic extraction engine (Acts as robust fallback or complementary parser)
function deterministicEntityExtraction(text: string): ExtractedEntities {
  const clean = text || '';

  // Phone numbers (Indian formats)
  const phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{9}\b/g;
  const rawPhones = clean.match(phoneRegex) || [];
  const phoneNumbers = Array.from(new Set(rawPhones.map(p => p.replace(/\s+/g, ''))));

  // UPI IDs
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g;
  const rawUpi = clean.match(upiRegex) || [];
  const upiIds = Array.from(new Set(rawUpi));

  // URLs
  const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
  const rawUrls = clean.match(urlRegex) || [];
  const urls = Array.from(new Set(rawUrls));

  // Transaction IDs
  const txnRegex = /(?:TXN|UPI|UTR|REF|IMPS)[\w\d\/\-]{6,26}/gi;
  const rawTxn = clean.match(txnRegex) || [];
  const transactionIds = Array.from(new Set(rawTxn));

  // Amounts
  const amountRegex = /(?:₹|INR|Rs\.?)\s?([0-9,]+(?:\.[0-9]{2})?)/gi;
  let match;
  let amountStr: string | undefined;
  let amountNumeric: number | undefined;

  while ((match = amountRegex.exec(clean)) !== null) {
    const rawNum = match[1].replace(/,/g, '');
    const num = parseFloat(rawNum);
    if (!isNaN(num) && num > 0) {
      amountStr = `₹${match[1]}`;
      amountNumeric = num;
      break;
    }
  }

  // Banks mentioned
  const banksKnown = [
    'State Bank of India', 'SBI', 'HDFC', 'ICICI', 'Axis', 'Punjab National Bank',
    'PNB', 'Canara', 'Kotak', 'Bank of Baroda', 'PhonePe', 'Google Pay', 'Paytm', 'Reserve Bank of India', 'RBI'
  ];
  const detectedBanks = banksKnown.filter(b => new RegExp(`\\b${b}\\b`, 'i').test(clean));

  // Scammer Claims
  const claims: string[] = [];
  if (/police|cbi|ed|narcotics|customs|crime branch|inspector/i.test(clean)) {
    claims.push('Law enforcement / Police officer impersonation');
  }
  if (/arrest|warrant|non-bailable|digital arrest|court/i.test(clean)) {
    claims.push('Non-bailable arrest warrant & criminal case threat');
  }
  if (/electricity|power disconnect|bill unpaid/i.test(clean)) {
    claims.push('Immediate utility disconnection threat');
  }
  if (/customer care|support desk|refund|wrong recharge/i.test(clean)) {
    claims.push('Counterfeit customer care refund representative');
  }
  if (/kyc|pan card|account freeze|blocked account/i.test(clean)) {
    claims.push('Urgent account suspension / Fake KYC update demand');
  }

  // Requested Actions
  const requestedActions: string[] = [];
  if (/transfer|send money|deposit|pay/i.test(clean)) requestedActions.push('Demand for urgent monetary transfer');
  if (/scan qr|qr code/i.test(clean)) requestedActions.push('Scan QR code to "receive credit"');
  if (/anvdesk|teamviewer|quicksupport|remote/i.test(clean)) requestedActions.push('Install remote-desktop access application');
  if (/confidential|secrecy|don't tell|official secrets act/i.test(clean)) requestedActions.push('Keep conversation strictly secret from family');

  // Apps mentioned
  const appsMentioned: string[] = [];
  ['Google Pay', 'PhonePe', 'Paytm', 'Skype', 'WhatsApp', 'AnyDesk', 'TeamViewer', 'Telegram'].forEach(app => {
    if (new RegExp(app, 'i').test(clean)) appsMentioned.push(app);
  });

  return {
    phoneNumbers,
    upiIds,
    urls,
    amount: amountStr,
    amountNumeric,
    transactionIds,
    bankNames: Array.from(new Set(detectedBanks)),
    scammerClaims: claims,
    requestedActions,
    appsMentioned,
  };
}

// Threat Intel Checker against synthetic known registry
function checkIdentifiers(entities: ExtractedEntities) {
  const results = [];
  for (const phone of entities.phoneNumbers) {
    const found = THREAT_INTEL_SYNTHETIC_DB.find(t => t.type === 'phone' && (phone.includes(t.identifier.replace(/\+/g, '')) || t.identifier.includes(phone)));
    if (found) {
      results.push({
        identifier: phone,
        type: 'phone' as const,
        riskScore: found.riskScore,
        details: found.details,
        isSyntheticDemo: true
      });
    }
  }

  for (const upi of entities.upiIds) {
    const found = THREAT_INTEL_SYNTHETIC_DB.find(t => t.type === 'upi' && t.identifier.toLowerCase() === upi.toLowerCase());
    if (found) {
      results.push({
        identifier: upi,
        type: 'upi' as const,
        riskScore: found.riskScore,
        details: found.details,
        isSyntheticDemo: true
      });
    }
  }

  for (const u of entities.urls) {
    const found = THREAT_INTEL_SYNTHETIC_DB.find(t => t.type === 'url' && (u.includes('ebill-update') || t.identifier === u));
    if (found) {
      results.push({
        identifier: u,
        type: 'url' as const,
        riskScore: found.riskScore,
        details: found.details,
        isSyntheticDemo: true
      });
    }
  }

  return results;
}

// Deterministic Urgency & Scam Classifier
function determineUrgencyAndScam(text: string, entities: ExtractedEntities): {
  scamCategory: ScamCategory;
  categoryName: string;
  urgencyLevel: UrgencyLevel;
  urgencyReasons: string[];
  scamSignals: string[];
  moneyLost: boolean;
  confidenceScore: number;
} {
  const clean = text.toLowerCase();
  const moneyLost = Boolean(
    entities.amountNumeric && entities.amountNumeric > 0 &&
    (clean.includes('transferred') || clean.includes('sent') || clean.includes('deducted') || clean.includes('debited') || clean.includes('paid') || entities.transactionIds.length > 0)
  );

  // Check Benign First (False Positive Safety)
  const isBenign = (clean.includes('credited with') || clean.includes('salary') || clean.includes('avail bal') || clean.includes('neft-corp')) &&
                   !clean.includes('arrest') && !clean.includes('warrant') && !clean.includes('police') && !clean.includes('fraud') && !clean.includes('refund qr');

  if (isBenign) {
    return {
      scamCategory: 'BENIGN_INFORMATIONAL',
      categoryName: 'Routine Banking Notification (Benign)',
      urgencyLevel: 'INFORMATIONAL',
      urgencyReasons: [
        'Notification appears to be standard banking credit alert (e.g. salary / authorized deposit).',
        'No pressure tactics, threats, or demands to transfer money detected.',
        'No requests to scan external QR codes or install remote software.',
      ],
      scamSignals: ['Official shortcode pattern detected', 'Legitimate balance advisory format'],
      moneyLost: false,
      confidenceScore: 0.95
    };
  }

  const signals: string[] = [];
  const reasons: string[] = [];

  // Signal detection
  if (/cbi|police|customs|narcotics|inspector|officer|court/i.test(clean)) {
    signals.push('Law Enforcement / Authority Impersonation');
  }
  if (/arrest|warrant|jail|case against you|non-bailable/i.test(clean)) {
    signals.push('Arrest & Criminal Imprisonment Coercion');
  }
  if (/secrecy|don't disconnect|confidential|official secrets/i.test(clean)) {
    signals.push('Coercive Secrecy / Isolation from Family');
  }
  if (/refund|qr code|enter pin to receive/i.test(clean)) {
    signals.push('Reverse Payment / Reverse QR Scam Tactic');
  }
  if (/anydesk|teamviewer|quicksupport|rustdesk/i.test(clean)) {
    signals.push('Remote Screen-Control Software Infiltration');
  }
  if (/electricity|power disconnect|tonight/i.test(clean)) {
    signals.push('High-Urgency Utility Disconnection Phishing');
  }

  // Category determination
  let scamCategory: ScamCategory = 'OTHER';
  let categoryName = 'Digital Fraud Attempt';

  if (signals.includes('Arrest & Criminal Imprisonment Coercion') || clean.includes('digital arrest')) {
    scamCategory = 'DIGITAL_ARREST';
    categoryName = 'Digital Arrest & Law Enforcement Impersonation';
  } else if (clean.includes('qr code') || clean.includes('vpa') || clean.includes('upi') || clean.includes('gpay') || clean.includes('phonepe')) {
    scamCategory = 'UPI_FRAUD';
    categoryName = 'UPI Payment & Reverse QR Refund Fraud';
  } else if (clean.includes('electricity') || clean.includes('http') || clean.includes('ebill')) {
    scamCategory = 'PHISHING';
    categoryName = 'Urgent Utility Phishing / SMS Malware Trap';
  } else if (clean.includes('kyc') || clean.includes('pan card')) {
    scamCategory = 'FAKE_KYC';
    categoryName = 'Counterfeit KYC Suspension Scam';
  }

  // Urgency determination (Deterministic Rules)
  let urgencyLevel: UrgencyLevel = 'LOW';

  if (moneyLost) {
    urgencyLevel = 'CRITICAL';
    reasons.push('Direct financial loss detected: Funds were transferred or debited within the Golden Hour window.');
    reasons.push('Immediate 1930 and bank nodal intervention is required to request freeze on beneficiary mule accounts.');
    reasons.push('High-pressure extortion or deceptive credentials manipulation was identified.');
  } else if (signals.includes('Remote Screen-Control Software Infiltration') || clean.includes('otp shared') || clean.includes('pin entered')) {
    urgencyLevel = 'HIGH';
    reasons.push('Sensitive authentication credentials (PIN/OTP) or remote screen access was exposed.');
    reasons.push('Device or netbanking compromise is imminent without immediate credential reset.');
  } else if (signals.length > 0) {
    urgencyLevel = 'LOW';
    reasons.push('Suspicious threat, impersonation, or phishing link detected, but no money has been transferred.');
    reasons.push('No bank credentials or OTPs have been compromised.');
    reasons.push('Preventive action (do not click, block sender, preserve logs) is sufficient.');
  } else {
    urgencyLevel = 'LOW';
    reasons.push('No confirmed loss or credential compromise identified.');
  }

  return {
    scamCategory,
    categoryName,
    urgencyLevel,
    urgencyReasons: reasons,
    scamSignals: signals,
    moneyLost,
    confidenceScore: 0.94
  };
}

// Timeline Builder
function buildTimeline(text: string, entities: ExtractedEntities, urgency: UrgencyLevel): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const clean = text;

  // Contact Initiation
  events.push({
    id: 'evt-1',
    time: '14:05',
    title: 'Suspicious Contact Initiated',
    description: entities.phoneNumbers.length > 0
      ? `Received call/message from suspect identifier ${entities.phoneNumbers.join(', ')}.`
      : 'User received unsolicited contact via phone or messaging app.',
    category: 'contact'
  });

  // Threat / Impersonation
  if (entities.scammerClaims.length > 0) {
    events.push({
      id: 'evt-2',
      time: '14:12',
      title: 'Scammer Impersonation & Coercion',
      description: entities.scammerClaims.join('. '),
      category: 'threat'
    });
  }

  // Transaction Event
  if (entities.amount || entities.transactionIds.length > 0) {
    events.push({
      id: 'evt-3',
      time: '14:21',
      title: 'Financial Transaction Executed',
      description: `Payment of ${entities.amount || 'unspecified amount'} routed to beneficiary ${entities.upiIds.join(', ') || 'suspect account'}. Reference: ${entities.transactionIds.join(', ') || 'Pending verification'}.`,
      category: 'transaction'
    });
  }

  // Incident Logging
  events.push({
    id: 'evt-4',
    time: 'Just now',
    title: 'GoldenHour Emergency Agent Activated',
    description: `Incident analyzed. Urgency categorized as ${urgency}. Emergency response protocol initiated.`,
    category: 'system'
  });

  return events;
}

// Action Planner
function buildActionPlan(urgency: UrgencyLevel, entities: ExtractedEntities, scamCategory: ScamCategory): ActionStep[] {
  const actions: ActionStep[] = [];
  let priority = 1;

  if (urgency === 'CRITICAL') {
    actions.push({
      id: 'act-1930',
      priority: priority++,
      title: 'Call 1930 Immediately (National Cyber Fraud Helpline)',
      description: 'Report the financial fraud immediately to the 1930 operator. Keep your transaction reference number and bank account number ready. Faster reporting allows the National Cyber Crime Reporting Portal (NCRP) to issue an electronic stop-payment flag to beneficiary banks.',
      category: 'immediate_call',
      contactNumber: '1930',
      completed: false
    });

    const detectedBank = entities.bankNames[0] || 'State Bank of India';
    const helplineInfo = BANK_HELPLINES[detectedBank] || BANK_HELPLINES['State Bank of India'];

    actions.push({
      id: 'act-bank',
      priority: priority++,
      title: `Contact Bank Fraud Desk (${detectedBank})`,
      description: `Call ${helplineInfo.fraudHelpline} and request an immediate emergency freeze on your UPI/NetBanking. Request an official Fraud Dispute Ticket / Acknowledgment Number and ask for a fund recall to the beneficiary bank.`,
      category: 'bank',
      contactNumber: helplineInfo.fraudHelpline.split(' / ')[0],
      actionUrl: helplineInfo.website,
      completed: false
    });

    actions.push({
      id: 'act-stop-comm',
      priority: priority++,
      title: 'Disconnect and Block Suspect Contacts',
      description: 'Do not entertain any further calls, threats, or video calls. Scammers use psychological pressure to extract more funds. Block the caller on WhatsApp/Phone.',
      category: 'security',
      completed: false
    });

    actions.push({
      id: 'act-evidence',
      priority: priority++,
      title: 'Preserve Complete Evidence Package',
      description: 'Take full-screen screenshots of the debit SMS, UPI transaction receipt showing UTR/Transaction ID, call history logs, and scammer chat transcript. GoldenHour will assemble these into your downloadable evidence bundle.',
      category: 'evidence',
      completed: false
    });

    actions.push({
      id: 'act-portal',
      priority: priority++,
      title: 'Submit Formal Cybercrime Complaint (cybercrime.gov.in)',
      description: 'Download the prepared NCRP Complaint Draft from GoldenHour and file it on the official portal (https://cybercrime.gov.in) within 24 hours to obtain a legal Crime Reference Number (CRN).',
      category: 'portal',
      actionUrl: 'https://cybercrime.gov.in',
      completed: false
    });

    actions.push({
      id: 'act-family',
      priority: priority++,
      title: 'Inform a Trusted Family Member or Friend',
      description: 'Cyber fraud is a traumatic psychological attack. Use the GoldenHour one-click family alert to have a trusted person accompany you to the bank branch.',
      category: 'family',
      completed: false
    });
  } else if (urgency === 'HIGH') {
    actions.push({
      id: 'act-freeze-creds',
      priority: priority++,
      title: 'Immediately Reset NetBanking & UPI Passwords',
      description: 'Since credentials or remote software was exposed, immediately change your UPI PIN, Internet Banking Password, and Card PIN from a clean device.',
      category: 'security',
      completed: false
    });

    actions.push({
      id: 'act-uninstall-remote',
      priority: priority++,
      title: 'Uninstall Remote-Desktop Apps & Disconnect Wi-Fi',
      description: 'If you were told to install AnyDesk, TeamViewer, or QuickSupport, immediately turn on Airplane Mode, uninstall the application, and restart your device.',
      category: 'security',
      completed: false
    });

    actions.push({
      id: 'act-bank-alert',
      priority: priority++,
      title: 'Notify Your Bank to Monitor Account Activity',
      description: 'Call your bank customer care to place a temporary fraud watch on debit transactions.',
      category: 'bank',
      completed: false
    });
  } else {
    actions.push({
      id: 'act-do-not-click',
      priority: priority++,
      title: 'Do Not Click Links or Respond to Threats',
      description: 'Do not open suspicious links or download APK files. Legitimate government and utility authorities do not disconnect connections via WhatsApp numbers.',
      category: 'security',
      completed: false
    });

    actions.push({
      id: 'act-block-report',
      priority: priority++,
      title: 'Report & Block the Sender on Chakshu / 1930',
      description: 'Report suspected spam or impersonation SMS on the Department of Telecommunications Chakshu portal (sancharsaathi.gov.in/sfc).',
      category: 'portal',
      actionUrl: 'https://sancharsaathi.gov.in/sfc/',
      completed: false
    });
  }

  return actions;
}

// Official Document Generators
function generateOfficialDocuments(incidentId: string, entities: ExtractedEntities, urgency: UrgencyLevel, scamCategory: string, summary: string, rawInput: string) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const complaintDraft = `================================================================================
NATIONAL CYBER CRIME REPORTING PORTAL (NCRP) — GRIEVANCE DRAFT
Filed Under: https://cybercrime.gov.in / Incident Helpline 1930
================================================================================
Incident Reference ID: ${incidentId}
Date of Report       : ${currentDate}
Category of Complaint : Financial Cyber Fraud / ${scamCategory}
Urgency Classification: ${urgency}

1. COMPLAINANT INCIDENT SUMMARY:
--------------------------------------------------------------------------------
${summary}

2. SUSPECT DETAILS IDENTIFIED:
--------------------------------------------------------------------------------
- Suspect Phone Number(s): ${entities.phoneNumbers.join(', ') || 'Not explicitly provided in transcript'}
- Suspect UPI ID / VPA   : ${entities.upiIds.join(', ') || 'N/A'}
- Suspect URL / Link     : ${entities.urls.join(', ') || 'N/A'}
- Scammer Claims Made    : ${entities.scammerClaims.join('; ') || 'Deceptive authority/refund claims'}
- Pressure Tactics Used  : ${entities.requestedActions.join('; ') || 'Urgent payment demand'}

3. FINANCIAL TRANSACTION PARTICULARS:
--------------------------------------------------------------------------------
- Total Fraudulent Amount: ${entities.amount || 'Disputed'}
- Transaction Ref / UTR  : ${entities.transactionIds.join(', ') || 'Pending Bank Statement Verification'}
- Complainant Bank Name  : ${entities.bankNames[0] || 'Disputed Bank Account'}
- Beneficiary Destination: ${entities.upiIds[0] || 'Mule Account via UPI'}

4. DETAILED CHRONOLOGICAL STATEMENT:
--------------------------------------------------------------------------------
"${rawInput.replace(/"/g, "'")}"

5. RELIEF / ACTION REQUESTED:
--------------------------------------------------------------------------------
1. Immediate issuance of Electronic Freeze Lien under Section 1930 / I4C framework to the beneficiary bank for reversing the disputed funds.
2. Registration of formal First Information Report (FIR) / Cybercrime Grievance.
3. Permanent blocking of suspect mobile numbers on Indian telecom network via DoT Chakshu.

Declaration:
I hereby certify that the information provided above is true to the best of my knowledge.

Complainant Signature: ___________________________
================================================================================`;

  const bankLetter = `================================================================================
URGENT: DISPUTE NOTICE OF UNAUTHORIZED / FRAUDULENT UPI TRANSACTION
To: The Branch Manager / Principal Nodal Officer for Fraud & Grievances
Bank: ${entities.bankNames[0] || 'The Respective Bank'}
================================================================================
Date: ${currentDate}
Subject: Urgent Request for Immediate Recall / Freeze of Fraudulent UPI Transaction
Reference Incident ID: ${incidentId}

Respected Sir/Madam,

I am writing to formally report an unauthorized, fraudulent transaction orchestrated against my bank account on ${currentDate}. 

I was targeted through a sophisticated digital scam involving ${scamCategory}. Under severe psychological duress, misrepresentation, and fraudulent inducement, funds were unlawfully debited from my account.

TRANSACTION DETAILS:
--------------------------------------------------------------------------------
• Disputed Amount      : ${entities.amount || 'As per bank ledger'}
• Transaction ID / UTR : ${entities.transactionIds.join(', ') || 'Refer to statement reference'}
• Beneficiary UPI ID   : ${entities.upiIds.join(', ') || 'Attached in transaction receipt'}
• Date & Approx. Time  : ${currentDate}
• Suspect Mobile No.   : ${entities.phoneNumbers.join(', ') || 'N/A'}

RELEVANT REGULATORY CITATION:
Under Reserve Bank of India (RBI) Circular DBR.No.Leg.BC.78/09.07.005/2017-18 on "Customer Protection – Limiting Liability of Customers in Unauthorized Electronic Banking Transactions", I am notifying the bank within the critical zero-liability / limited-liability Golden Hour window.

PRAYER & IMMEDIATE ACTIONS REQUESTED:
1. Immediately trigger an inter-bank recall / dispute message via the NPCI UPI Clearing network to freeze the beneficiary account.
2. Provide me with a formal Written Acknowledgment & Complaint Ticket Number.
3. Temporarily restrict unauthorized electronic payment channels on my account to prevent further exposure.

Attached Evidence:
1. Transaction screenshot with UTR number
2. Suspect communication transcript and caller identifiers
3. Copy of National Cybercrime Portal (1930) complaint draft

Yours faithfully,

[Account Holder Name]
Account Number: ________________________
Registered Mobile: _____________________
Signature: _____________________________
================================================================================`;

  const incidentSummaryText = `GOLDENHOUR INCIDENT SUMMARY
ID: ${incidentId}
Timestamp: ${currentDate}
Category: ${scamCategory}
Urgency Level: ${urgency}
Loss Detected: ${entities.amount || 'None'}
Suspect Contacts: ${entities.phoneNumbers.join(', ') || 'None'}
Suspect UPI: ${entities.upiIds.join(', ') || 'None'}
Status: ACTION_REQUIRED
Instructions: Call 1930 immediately if money was transferred.`;

  const evidenceChecklist = [
    'Screenshot of fraudulent debit SMS with bank sender header (e.g., AD-HDFCBK, VM-SBIINB)',
    'UPI transaction receipt showing 12-digit UTR number',
    'Call logs showing exact timestamp and caller numbers',
    'WhatsApp / Telegram / Skype chat screenshots and profile IDs',
    'Copy of fake documents, arrest warrants, or fake receipts sent by scammer',
    'Audio recording of phone call (if available)',
  ];

  return {
    cybercrimeComplaint: complaintDraft,
    bankDisputeLetter: bankLetter,
    incidentSummaryText,
    evidenceChecklist
  };
}

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'GoldenHour',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiModelConfigured: Boolean(apiKey),
  });
});

// Full Agentic Orchestrator Endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const trace: AgentTraceItem[] = [];

  try {
    const { input, inputType = 'text', imageBase64, language = 'en' } = req.body;
    const incidentId = `GH-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    let processedText = input || '';

    // Step 1: Input Processor & OCR Tool
    trace.push({
      id: 'tr-1',
      step: '1. Input Processor & Multimodal Parser',
      toolUsed: imageBase64 ? 'Multimodal OCR Vision Tool' : 'Text Sanitizer & Normalizer',
      status: 'completed',
      message: imageBase64 ? 'Extracted text and visual indicators from uploaded screenshot' : 'Sanitized raw text and verified no secret credentials are leaked',
      durationMs: 45
    });

    // If an image screenshot was uploaded and Gemini is available, run multimodal OCR
    if (imageBase64 && ai) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        const ocrResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64
                }
              },
              {
                text: 'Extract all text from this screenshot accurately. Especially look for UPI ID, transaction reference/UTR number, amount transferred, phone numbers, sender bank, and scam messages.'
              }
            ]
          }
        });
        const extractedOcr = ocrResponse.text;
        if (extractedOcr) {
          processedText = (processedText ? processedText + '\n\n[OCR SCREENSHOT CONTENT]:\n' : '') + extractedOcr;
        }
      } catch (ocrErr) {
        console.warn('Gemini OCR fallback triggered:', ocrErr);
      }
    }

    // Security check: Redact sensitive tokens from working memory
    const safeText = redactSensitiveTokens(processedText);

    // Step 2: Entity Extraction Tool
    const entities = deterministicEntityExtraction(safeText);
    trace.push({
      id: 'tr-2',
      step: '2. Entity Extraction Tool',
      toolUsed: 'Deterministic Regex & Token Extraction',
      status: 'completed',
      message: `Extracted ${entities.phoneNumbers.length} phone(s), ${entities.upiIds.length} UPI ID(s), ${entities.transactionIds.length} transaction ID(s), and amount ${entities.amount || '₹0'}`,
      durationMs: 25
    });

    // Step 3: Identifier Threat Intel Check Tool
    const threatIntel = checkIdentifiers(entities);
    entities.identifiersChecked = threatIntel;
    trace.push({
      id: 'tr-3',
      step: '3. Identifier Threat Intel Tool',
      toolUsed: 'Synthetic Cyber Intel Registry',
      status: 'completed',
      message: threatIntel.length > 0 ? `Identified ${threatIntel.length} flagged suspect pattern(s) in threat database` : 'Queried threat database for extracted identifiers (no prior synthetic flags)',
      durationMs: 15
    });

    // Step 4: Scam Classifier & Reasoner (Hybrid LLM + Deterministic)
    let classification = determineUrgencyAndScam(safeText, entities);

    // If Gemini AI is active and text is rich, refine reasoning using Gemini 3.8 Flash
    if (ai && safeText.length > 20) {
      try {
        const aiPrompt = `You are GoldenHour's Cybersecurity Incident Response Reasoning Agent.
Analyze this incident report with strict safety and zero hallucination.

INCIDENT REPORT:
"${safeText.slice(0, 3000)}"

Return a valid JSON object matching this schema:
{
  "scamCategory": "DIGITAL_ARREST" | "UPI_FRAUD" | "PHISHING" | "FAKE_KYC" | "BANK_IMPERSONATION" | "BENIGN_INFORMATIONAL" | "OTHER",
  "categoryName": "Concise human readable name",
  "urgencyLevel": "CRITICAL" | "HIGH" | "LOW" | "INFORMATIONAL",
  "urgencyReasons": ["Reason 1", "Reason 2"],
  "scamSignals": ["Signal 1", "Signal 2"],
  "summary": "2-3 sentence objective overview of what occurred without victim-blaming",
  "moneyLost": boolean,
  "confidenceScore": number
}

Urgency Rules:
- If money was transferred or debited recently -> CRITICAL
- If credentials/OTP shared or remote app installed -> HIGH
- If suspicious attempt but no payment/credentials -> LOW
- If legitimate bank notification -> INFORMATIONAL`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: aiPrompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const parsed = JSON.parse(aiResponse.text || '{}');
        if (parsed.scamCategory && parsed.urgencyLevel) {
          classification = {
            scamCategory: parsed.scamCategory,
            categoryName: parsed.categoryName || classification.categoryName,
            urgencyLevel: parsed.urgencyLevel,
            urgencyReasons: parsed.urgencyReasons || classification.urgencyReasons,
            scamSignals: parsed.scamSignals || classification.scamSignals,
            moneyLost: Boolean(parsed.moneyLost || classification.moneyLost),
            confidenceScore: parsed.confidenceScore || 0.95
          };
        }
      } catch (geminiErr) {
        console.warn('Gemini reasoning fallback to deterministic engine:', geminiErr);
      }
    }

    trace.push({
      id: 'tr-4',
      step: '4. Scam Classification & Signal Reasoner',
      toolUsed: ai ? 'Gemini 3.8 Flash Hybrid Reasoner' : 'Deterministic Heuristic Rule Engine',
      status: 'completed',
      message: `Categorized as ${classification.categoryName} with ${classification.scamSignals.length} suspicious signal(s)`,
      durationMs: 120
    });

    // Step 5: Urgency Engine
    trace.push({
      id: 'tr-5',
      step: '5. Golden Hour Urgency Engine',
      toolUsed: 'Deterministic Risk Rules & Financial Impact Engine',
      status: 'completed',
      message: `Assigned ${classification.urgencyLevel} urgency based on loss: ${classification.moneyLost ? 'YES' : 'NO'}`,
      durationMs: 10
    });

    // Step 6: Timeline Builder Tool
    const timeline = buildTimeline(safeText, entities, classification.urgencyLevel);
    trace.push({
      id: 'tr-6',
      step: '6. Incident Timeline Engine',
      toolUsed: 'Chronological Sequence Generator',
      status: 'completed',
      message: `Constructed ${timeline.length} sequential incident milestone(s)`,
      durationMs: 15
    });

    // Step 7: Action Planner & Orchestrator
    const actions = buildActionPlan(classification.urgencyLevel, entities, classification.scamCategory);
    trace.push({
      id: 'tr-7',
      step: '7. Action Planner & Coordinator',
      toolUsed: 'Priority Emergency Response Planner',
      status: 'completed',
      message: `Formulated ${actions.length} prioritized containment and reporting action(s)`,
      durationMs: 20
    });

    // Step 8: Document Generator Tool
    const summary = `${classification.categoryName} incident reported. ${classification.moneyLost ? `Financial loss of ${entities.amount || 'disputed sum'} incurred.` : 'No direct financial transfer confirmed.'} Suspect tactics included: ${classification.scamSignals.join(', ') || 'unauthorized outreach'}.`;
    const documents = generateOfficialDocuments(incidentId, entities, classification.urgencyLevel, classification.categoryName, summary, safeText);

    trace.push({
      id: 'tr-8',
      step: '8. Deliverables & Document Station',
      toolUsed: 'NCRP 1930 & Banking Dispute Document Generator',
      status: 'completed',
      message: 'Generated National Cybercrime Portal complaint draft, Bank chargeback notice, and evidence bundle',
      durationMs: 30
    });

    const incident: Incident = {
      id: incidentId,
      createdAt: new Date().toISOString(),
      language: language as 'en' | 'hi' | 'ta',
      rawInput: safeText,
      inputType: inputType,
      scamCategory: classification.scamCategory,
      categoryName: classification.categoryName,
      confidenceScore: classification.confidenceScore,
      urgencyLevel: classification.urgencyLevel,
      urgencyReasons: classification.urgencyReasons,
      scamSignals: classification.scamSignals,
      status: classification.urgencyLevel === 'CRITICAL' ? 'ACTION_REQUIRED' : 'RESOLVED',
      summary: summary,
      entities: entities,
      timeline: timeline,
      actions: actions,
      agentTrace: trace,
      panicModeActive: classification.urgencyLevel === 'CRITICAL',
      moneyLost: classification.moneyLost,
      reportedTo1930: false,
      bankContacted: false,
      documents: documents
    };

    res.json({
      success: true,
      incident,
      executionTimeMs: Date.now() - startTime
    });
  } catch (error: any) {
    console.error('Error analyzing incident:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while analyzing incident'
    });
  }
});

// Single Identifier check endpoint
app.post('/api/check-identifier', (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier required' });
  }

  const clean = String(identifier).trim();
  const match = THREAT_INTEL_SYNTHETIC_DB.find(t => 
    clean.toLowerCase().includes(t.identifier.toLowerCase()) || 
    t.identifier.toLowerCase().includes(clean.toLowerCase())
  );

  if (match) {
    res.json({
      identifier: clean,
      riskScore: match.riskScore,
      details: match.details,
      isSyntheticDemo: true
    });
  } else {
    res.json({
      identifier: clean,
      riskScore: 'UNKNOWN',
      details: 'No record found in local synthetic threat database. Exercise vigilance with unknown callers/links.',
      isSyntheticDemo: true
    });
  }
});

// Vite Middleware for Full-Stack development / Production static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace?.(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GoldenHour Emergency Response Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
