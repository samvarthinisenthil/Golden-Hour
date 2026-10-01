import React, { useState, useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  CreditCard,
  MessageSquare,
  PenTool,
  ShieldCheck,
  Send,
  Loader2,
  UploadCloud,
  AlertCircle,
  Terminal,
  Lock
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface IncidentInputProps {
  currentLanguage: SupportedLanguage;
  onAnalyze: (payload: {
    input: string;
    inputType: 'text' | 'screenshot' | 'transaction' | 'transcript' | 'voice';
    imageBase64?: string;
  }) => Promise<void>;
  isLoading: boolean;
  prefillInput?: string;
  prefillType?: 'text' | 'screenshot' | 'transaction' | 'transcript' | 'voice';
}

export const IncidentInput: React.FC<IncidentInputProps> = ({
  currentLanguage,
  onAnalyze,
  isLoading,
  prefillInput = '',
  prefillType = 'text'
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [activeTab, setActiveTab] = useState<'text' | 'transaction' | 'screenshot' | 'transcript' | 'manual'>(
    prefillType === 'screenshot'
      ? 'screenshot'
      : prefillType === 'transaction'
      ? 'transaction'
      : prefillType === 'transcript'
      ? 'transcript'
      : 'text'
  );

  const [inputText, setInputText] = useState(prefillInput);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  // Structured fields for Manual / Transaction
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [txnId, setTxnId] = useState('');
  const [bank, setBank] = useState('HDFC Bank');
  const [phoneInput, setPhoneInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [notes, setNotes] = useState('');

  // Credential scrubber alert
  const [credentialWarning, setCredentialWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (prefillInput) {
      setInputText(prefillInput);
    }
  }, [prefillInput]);

  const handleTextChange = (val: string) => {
    setInputText(val);
    if (/\b(?:otp|cvv|pin|password)\s*[:=]?\s*\d{3,6}\b/i.test(val)) {
      setCredentialWarning('GoldenHour Security Notice: Private OTP/PIN/CVV pattern detected. Never submit secrets to any system, even for reporting.');
    } else {
      setCredentialWarning(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalInput = inputText;

    if (activeTab === 'transaction') {
      finalInput = `[TRANSACTION PARTICULARS]
Amount Debited / In Jeopardy: ₹${amount || '25,000'}
Beneficiary UPI ID / VPA: ${upiId || 'unknown@upi'}
Transaction ID / UTR Number: ${txnId || 'TXN12345678'}
Victim Bank: ${bank}
Incident Description: ${notes || 'Suspected fraudulent debit or reverse payment'}`;
    } else if (activeTab === 'manual') {
      finalInput = `[MANUAL INCIDENT LOG]
Suspect Phone: ${phoneInput || 'N/A'}
Suspect URL / Link: ${urlInput || 'N/A'}
Beneficiary UPI: ${upiId || 'N/A'}
Amount: ${amount ? `₹${amount}` : 'N/A'}
Transaction Ref: ${txnId || 'N/A'}
Bank: ${bank}
Narrative: ${notes || inputText}`;
    }

    if (!finalInput && !selectedImage) return;

    onAnalyze({
      input: finalInput,
      inputType: activeTab === 'screenshot' ? 'screenshot' : activeTab === 'transaction' ? 'transaction' : activeTab === 'transcript' ? 'transcript' : 'text',
      imageBase64: selectedImage || undefined
    });
  };

  return (
    <div id="incident-intake-section" className="bg-[#040812] border border-emerald-950/80 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/70 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg md:text-xl font-bold font-mono text-white tracking-tight">
              WHAT HAPPENED?
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Tell GoldenHour what happened. You can paste a message, transaction details, or suspicious communication.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ZERO-SECRET STORAGE • CLIENT ENCRYPTION</span>
        </div>
      </div>

      {/* Safety Guard Warning */}
      <div className="bg-[#0c0f17] border border-emerald-900/40 rounded-lg p-2.5 text-xs text-slate-300 flex items-center gap-2 mb-4 font-mono">
        <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Safety Rule: Never enter OTPs, PINs, passwords or CVV details into GoldenHour.</span>
      </div>

      {credentialWarning && (
        <div className="bg-red-950/80 border border-red-500 rounded-lg p-3 text-xs text-red-100 flex items-start gap-2 mb-4 animate-bounce font-mono">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{credentialWarning}</span>
        </div>
      )}

      {/* 5 Incident Intake Options */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-900 pb-3 mb-4 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'text'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>[ Paste Message ]</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transaction')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'transaction'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>[ Transaction Details ]</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('screenshot')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'screenshot'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>[ Upload Screenshot ]</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transcript')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'transcript'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>[ Call / Chat Transcript ]</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'manual'
              ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#070d18] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>[ Enter Manually ]</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: Paste Message */}
        {activeTab === 'text' && (
          <div className="mb-4">
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste suspicious SMS, WhatsApp message, email, or describe what happened in your own words..."
              className="w-full bg-[#02050c] border border-emerald-950/80 focus:border-emerald-500 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 font-mono focus:outline-none transition leading-relaxed"
              required
            />
          </div>
        )}

        {/* Tab 2: Transaction Details */}
        {activeTab === 'transaction' && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Debited Amount (₹)</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Beneficiary UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. suspect.merchant@upi"
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Transaction Ref / UTR (12 digits)</label>
              <input
                type="text"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="e.g. UPI/427819028301"
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Your Bank / Payment App</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Google Pay">Google Pay</option>
                <option value="Paytm">Paytm</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">Incident Description</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How were you induced to make the transfer? (e.g., claimed customer refund, police clearance deposit)..."
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Upload Screenshot */}
        {activeTab === 'screenshot' && (
          <div className="mb-4 space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500 rounded-lg p-6 text-center cursor-pointer bg-[#02050c] transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs md:text-sm font-mono text-slate-300">
                Upload screenshot of debit SMS, UPI transaction receipt, or WhatsApp chat
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Multimodal OCR tool will automatically parse phone numbers, UPI IDs, and transaction references
              </p>
              {imageName && (
                <div className="mt-3 inline-block bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1 rounded font-mono">
                  ✓ File Selected: {imageName}
                </div>
              )}
            </div>

            {selectedImage && (
              <div className="flex items-center gap-3 bg-[#070c17] p-2.5 rounded border border-slate-800">
                <img src={selectedImage} alt="Uploaded screenshot preview" className="w-14 h-14 object-cover rounded border border-slate-700" />
                <div className="text-xs text-slate-400 font-mono">
                  <p className="font-semibold text-slate-200">Screenshot Ready for Multimodal Vision OCR</p>
                  <p>GoldenHour will extract transaction metadata directly.</p>
                </div>
              </div>
            )}

            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Optional: Add any extra context about this screenshot..."
              className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Tab 4: Call / Chat Transcript */}
        {activeTab === 'transcript' && (
          <div className="mb-4">
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste dialogue between caller and victim:&#10;Caller: 'We are from Cyber Crime Department Headquarters...'&#10;Victim: 'What happened?'&#10;Caller: 'Your Aadhaar is connected to an illegal parcel, transfer ₹25,000 immediately...'&#10;Victim: 'I sent the money via UPI...'"
              className="w-full bg-[#02050c] border border-emerald-950/80 focus:border-emerald-500 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 font-mono focus:outline-none transition leading-relaxed"
              required
            />
          </div>
        )}

        {/* Tab 5: Enter Manually */}
        {activeTab === 'manual' && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Suspect Phone Number</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+919876543210"
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Suspect URL / Link</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://suspicious-link.cc"
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Beneficiary UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="mule.account@upi"
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-slate-400 mb-1">What did they instruct you to do?</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of instructions, threats, or claims made..."
                className="w-full bg-[#02050c] border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-[11px] font-mono text-slate-500">
            Pipeline: Understand ➔ Reason ➔ Plan ➔ Use Tools ➔ Act ➔ Deliver
          </span>

          <button
            type="submit"
            disabled={isLoading || (!inputText && !selectedImage && !amount && !phoneInput)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:bg-slate-900 disabled:text-slate-600 text-white font-mono font-bold px-5 py-2.5 rounded-lg transition shadow-[0_0_20px_rgba(16,185,129,0.3)] text-xs tracking-wider"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>PROCESSING INCIDENT RESPONSE...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>RUN EMERGENCY INCIDENT ANALYSIS</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
