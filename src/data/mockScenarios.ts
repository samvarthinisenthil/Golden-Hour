export interface DemoScenario {
  id: string;
  name: string;
  type: string;
  expectedUrgency: 'CRITICAL' | 'HIGH' | 'LOW' | 'INFORMATIONAL';
  description: string;
  input: string;
  inputType: 'text' | 'transcript' | 'screenshot' | 'transaction';
  metadata?: {
    amount?: string;
    upiId?: string;
    phone?: string;
    txnId?: string;
    bank?: string;
  };
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'digital-arrest',
    name: 'Case 1: Digital Arrest Scam',
    type: 'Digital Arrest / Police Impersonation',
    expectedUrgency: 'CRITICAL',
    description: 'Caller impersonates CBI/Cybercrime officer, claims victim’s Aadhaar is linked to illegal parcel in Mumbai, threatens immediate non-bailable warrant on Skype video, coerces ₹25,000 security deposit transfer.',
    inputType: 'transcript',
    input: `[CALL TRANSCRIPT - WhatsApp Video Call +919876543210]
Caller: "I am Inspector Ajay Verma from Cyber Crime Police Station, Headquarters. Your Aadhaar number has been detected in a narcotics consignment impounded at Mumbai Airport Cargo terminal."
Victim: "Sir, I have never visited Mumbai! There is some mistake!"
Caller: "A Non-Bailable Arrest Warrant is being prepared right now. You are placed under 24-hour Digital Arrest. Do not disconnect this Skype call, do not speak to family, and maintain strict confidentiality under Official Secrets Act."
Caller: "To prove your bank accounts are legitimate and avoid immediate arrest team reaching your home, you must deposit ₹25,000 into the Reserve Bank of India verification clearance pool immediately. The funds will be audited and returned in 15 minutes."
Victim: "Which account should I transfer to?"
Caller: "Send ₹25,000 via Google Pay right now to govt.rbi.clearing@icici. Transaction ID must be shared on camera."
Victim: "I have transferred ₹25,000 to govt.rbi.clearing@icici. Transaction reference TXN9812401823. When will my arrest warrant be canceled?"
Caller: "Payment received. Now you need to pay additional ₹50,000 for customs clearance..."`,
    metadata: {
      amount: '₹25,000',
      upiId: 'govt.rbi.clearing@icici',
      phone: '+919876543210',
      txnId: 'TXN9812401823',
      bank: 'ICICI / Google Pay'
    }
  },
  {
    id: 'upi-fraud',
    name: 'Case 2: UPI Refund / Customer Care Fraud',
    type: 'UPI Payment / Fake Refund Scam',
    expectedUrgency: 'CRITICAL',
    description: 'Victim attempted to resolve failed mobile recharge, searched customer care number on Google, caller claimed to issue ₹1,000 refund but sent reverse payment request via PhonePe, debited ₹12,500.',
    inputType: 'text',
    input: `I tried to contact customer support for a failed Airtel recharge of ₹999. I found a phone number +918800112233 listed on Google search as "Airtel Customer Service Desk". 
When I called, the representative told me the refund of ₹999 was processed and sent me a PhonePe QR code to "receive the refund money into my account".
He instructed me to scan the QR code and enter my UPI PIN to accept the refund credit. As soon as I entered the PIN, instead of receiving money, ₹12,500 was deducted from my HDFC bank account and sent to merchant vpa merchant.refunds99@okhdfcbank with transaction ID UPI/427819028301.
The caller then demanded I install "AnyDesk remote app" to reverse the charge. I disconnected the call immediately.`,
    metadata: {
      amount: '₹12,500',
      upiId: 'merchant.refunds99@okhdfcbank',
      phone: '+918800112233',
      txnId: 'UPI/427819028301',
      bank: 'HDFC Bank'
    }
  },
  {
    id: 'phishing-sms',
    name: 'Case 3: Electricity Bill Phishing SMS',
    type: 'Phishing / Malware Link',
    expectedUrgency: 'LOW',
    description: 'Victim received an urgent SMS threatening power disconnection tonight at 9:30 PM with a suspicious URL. No money was paid and no credentials/OTPs were entered.',
    inputType: 'text',
    input: `Received SMS from sender VK-POWERR at 18:22:
"Dear Consumer, Your Electricity power connection will be disconnected tonight at 9:30 PM from the electric office because your previous month bill was not updated. Please immediately contact Electricity Officer Mr. Sharma on +917654321098 or update your bill via portal: http://ebill-update-powergov.cc/pay"
I became nervous because the electricity bill was already paid last week. I checked the link but I DID NOT click it, did not send any money, and did not share any OTP or personal details. What should I do now?`,
    metadata: {
      phone: '+917654321098',
      bank: 'None'
    }
  },
  {
    id: 'benign-message',
    name: 'Case 4: Legitimate Bank Notification',
    type: 'Benign / Legitimate Banking Notification',
    expectedUrgency: 'INFORMATIONAL',
    description: 'Victim received a routine bank credit SMS from official bank shortcode with balance update. System correctly recognizes it as benign without triggering false panic.',
    inputType: 'text',
    input: `SMS from AD-HDFCBK at 14:02:
"Dear Customer, Your A/c XX4918 has been credited with INR 45,000.00 on 30-SEP-26 by NEFT-CORP SALARY-SEPT26. Avail Bal: INR 62,340.50. For queries, visit www.hdfcbank.com or call 18001600."
Is this SMS genuine or is it a scam? Should I be worried about my account?`,
    metadata: {
      amount: 'INR 45,000.00',
      bank: 'HDFC Bank'
    }
  }
];

export interface BankHelpline {
  name: string;
  fraudHelpline: string;
  upiBlockMethod: string;
  ussdCode?: string;
  email: string;
  website: string;
}

export const BANK_HELPLINES: Record<string, BankHelpline> = {
  'State Bank of India': {
    name: 'State Bank of India (SBI)',
    fraudHelpline: '1800111109 / 18001234',
    upiBlockMethod: 'SMS "BLOCK <Account No>" to 9223966666 or disable UPI in YONO app',
    ussdCode: '*99# -> 4 (My Profile) -> 7 (Disable UPI)',
    email: 'report.phishing@sbi.co.in',
    website: 'https://bank.sbi'
  },
  'HDFC Bank': {
    name: 'HDFC Bank',
    fraudHelpline: '18002664060 / 18001600',
    upiBlockMethod: 'Call 18002664060 immediately to freeze NetBanking and UPI transactions',
    ussdCode: '*99#',
    email: 'report.phishing@hdfcbank.com',
    website: 'https://www.hdfcbank.com'
  },
  'ICICI Bank': {
    name: 'ICICI Bank',
    fraudHelpline: '18001080 / 18002008976',
    upiBlockMethod: 'iMobile app -> Services -> Card & UPI -> Block UPI ID or call 18001080',
    email: 'antiphishing@icicibank.com',
    website: 'https://www.icicibank.com'
  },
  'Axis Bank': {
    name: 'Axis Bank',
    fraudHelpline: '18604195555 / 18004190068',
    upiBlockMethod: 'SMS "BLOCKUPI <Cust ID>" to 56161600 or use Axis Mobile App',
    email: 'nodal.officer@axisbank.com',
    website: 'https://www.axisbank.com'
  },
  'Punjab National Bank': {
    name: 'Punjab National Bank (PNB)',
    fraudHelpline: '18001802222 / 18001032222',
    upiBlockMethod: 'SMS "BLOCKUPI <Mobile No>" to 5607040',
    email: 'care@pnb.co.in',
    website: 'https://www.pnbindia.in'
  },
  'PhonePe': {
    name: 'PhonePe Help Desk',
    fraudHelpline: '080-68727374 / 022-68727374',
    upiBlockMethod: 'PhonePe App -> Profile -> Security -> Block Account / Report Fraud',
    email: 'support.phonepe.com',
    website: 'https://www.phonepe.com'
  },
  'Google Pay': {
    name: 'Google Pay India Support',
    fraudHelpline: '1800-419-0157',
    upiBlockMethod: 'Google Pay App -> Tap profile icon -> Help & feedback -> Raise dispute',
    email: 'support-in@google.com',
    website: 'https://pay.google.com'
  },
  'Paytm': {
    name: 'Paytm Payments Bank',
    fraudHelpline: '0120-3888388',
    upiBlockMethod: 'Paytm App -> 24x7 Help -> Report fraud transaction',
    email: 'fraud.support@paytm.com',
    website: 'https://paytm.com'
  }
};

export const THREAT_INTEL_SYNTHETIC_DB = [
  {
    identifier: 'govt.rbi.clearing@icici',
    type: 'upi',
    riskScore: 'HIGH' as const,
    details: 'Flagged mule account impersonating Reserve Bank of India clearance pool. Multiple 1930 incident reports.',
    isSyntheticDemo: true
  },
  {
    identifier: 'merchant.refunds99@okhdfcbank',
    type: 'upi',
    riskScore: 'HIGH' as const,
    details: 'Mule VPA associated with fake customer care refund claims and reverse QR scams.',
    isSyntheticDemo: true
  },
  {
    identifier: '+919876543210',
    type: 'phone',
    riskScore: 'HIGH' as const,
    details: 'Reported 14 times in past 48 hours for impersonating Mumbai / Delhi Police & CBI officers in digital arrest scams.',
    isSyntheticDemo: true
  },
  {
    identifier: '+918800112233',
    type: 'phone',
    riskScore: 'HIGH' as const,
    details: 'Reported in search-engine spoofing as counterfeit telecom / bank customer helpline.',
    isSyntheticDemo: true
  },
  {
    identifier: 'http://ebill-update-powergov.cc/pay',
    type: 'url',
    riskScore: 'HIGH' as const,
    details: 'Unregistered top-level domain hosting malicious Android APK payload (.cc domain impersonating electricity board).',
    isSyntheticDemo: true
  }
];
