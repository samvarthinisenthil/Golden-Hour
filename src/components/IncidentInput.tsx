import React, { useState, useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  CreditCard,
  MessageSquare,
  Mic,
  ShieldCheck,
  Send,
  Loader2,
  UploadCloud,
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<'text' | 'screenshot' | 'transaction' | 'transcript' | 'voice'>(prefillType);
  const [inputText, setInputText] = useState(prefillInput);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  // Transaction form states
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [txnId, setTxnId] = useState('');
  const [bank, setBank] = useState('HDFC Bank');
  const [transactionNotes, setTransactionNotes] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Safety detection warning
  const [credentialWarning, setCredentialWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync prefill
  React.useEffect(() => {
    if (prefillInput) {
      setInputText(prefillInput);
      setActiveTab(prefillType);
    }
  }, [prefillInput, prefillType]);

  const handleTextChange = (val: string) => {
    setInputText(val);
    // Real-time security guard check
    if (/\b(?:otp|cvv|pin|password)\s*[:=]?\s*\d{3,6}\b/i.test(val)) {
      setCredentialWarning('GoldenHour Security Alert: You appear to have entered a private OTP, PIN, or CVV. Never share this with anyone, even for reporting.');
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

  const handleSimulateVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    // Simulate recording or speech recognition
    setTimeout(() => {
      const sampleVoice = 'I received a phone call from someone claiming to be from the Cyber Crime Department headquarters. They said an illegal courier parcel with narcotics was booked using my Aadhaar number. They told me I was placed on 24-hour digital arrest and demanded ₹25,000 immediately to clear my name. I was panicked and transferred the money via UPI.';
      setVoiceTranscript(sampleVoice);
      setInputText(sampleVoice);
      setIsRecording(false);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalInput = inputText;

    if (activeTab === 'transaction') {
      finalInput = `[TRANSACTION FORM ENTRY]
Amount: ₹${amount || '25,000'}
Beneficiary UPI ID: ${upiId || 'unknown@upi'}
Transaction ID / Reference: ${txnId || 'TXN12345678'}
Bank Name: ${bank}
Incident Details: ${transactionNotes || 'Suspected fraudulent debit transaction'}`;
    } else if (activeTab === 'voice' && voiceTranscript) {
      finalInput = `[VOICE TRANSCRIPTION]: ${voiceTranscript}`;
    }

    if (!finalInput && !selectedImage) return;

    onAnalyze({
      input: finalInput,
      inputType: activeTab,
      imageBase64: selectedImage || undefined
    });
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl mb-8">
      {/* Header and Safety Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {t.inputHeader}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Provide the suspected fraud details. GoldenHour will extract evidence, determine urgency, and generate your action plan.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ZERO-SECRET STORAGE • SYNTHETIC SAFE</span>
        </div>
      </div>

      {/* Safety Guard Warning */}
      <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-2.5 text-xs text-amber-200 flex items-center gap-2 mb-4 font-mono">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{t.safetyNotice}</span>
      </div>

      {credentialWarning && (
        <div className="bg-red-950/80 border border-red-500 rounded-lg p-3 text-xs text-red-100 flex items-start gap-2 mb-4 animate-bounce font-mono">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{credentialWarning}</span>
        </div>
      )}

      {/* Input Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'text'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Describe Incident</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('screenshot')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'screenshot'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Screenshot (OCR Tool)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transaction')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'transaction'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Transaction Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transcript')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'transcript'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat / Call Transcript</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('voice')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
            activeTab === 'voice'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Voice Note</span>
        </button>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit}>
        {/* Tab 1: Describe Incident or Transcript */}
        {(activeTab === 'text' || activeTab === 'transcript') && (
          <div className="mb-4">
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={activeTab === 'transcript'
                ? "Paste caller dialogue or WhatsApp chat logs:\nCaller: 'This is Cyber Crime Branch Mumbai...'\nVictim: 'Why are you calling?'\nCaller: 'Transfer ₹25,000 immediately to govt.clearing@upi'..."
                : t.inputPlaceholder}
              className="w-full bg-[#070b14] border border-slate-700/80 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition leading-relaxed resize-y"
              required
            />
          </div>
        )}

        {/* Tab 2: Screenshot Upload with OCR */}
        {activeTab === 'screenshot' && (
          <div className="mb-4 space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-lg p-6 text-center cursor-pointer bg-[#070b14]/60 transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs md:text-sm font-medium text-slate-300">
                Click to upload screenshot of debit SMS, UPI receipt, or WhatsApp chat
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Multimodal OCR tool will automatically parse UPI IDs, phone numbers, and timestamps
              </p>
              {imageName && (
                <div className="mt-3 inline-block bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1 rounded font-mono">
                  ✓ Selected: {imageName}
                </div>
              )}
            </div>

            {selectedImage && (
              <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <img src={selectedImage} alt="Uploaded screenshot preview" className="w-16 h-16 object-cover rounded border border-slate-700" />
                <div className="text-xs text-slate-400">
                  <p className="font-semibold text-slate-200">Image loaded for Multimodal Agent Extraction</p>
                  <p>You can also provide additional notes below.</p>
                </div>
              </div>
            )}

            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Optional: Add context about what happened during or after this screenshot..."
              className="w-full bg-[#070b14] border border-slate-700/80 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        )}

        {/* Tab 3: Transaction Form */}
        {activeTab === 'transaction' && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Disputed Amount (₹)</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full bg-[#070b14] border border-slate-700 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Beneficiary UPI ID / VPA</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. suspect.pool@icici"
                className="w-full bg-[#070b14] border border-slate-700 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Transaction ID / UTR (12 digits)</label>
              <input
                type="text"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="e.g. UPI/427819028301"
                className="w-full bg-[#070b14] border border-slate-700 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Your Debited Bank / Payment App</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-700 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                <option value="PhonePe">PhonePe Wallet / UPI</option>
                <option value="Google Pay">Google Pay</option>
                <option value="Paytm">Paytm Payments Bank</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">Incident Summary</label>
              <textarea
                rows={2}
                value={transactionNotes}
                onChange={(e) => setTransactionNotes(e.target.value)}
                placeholder="Explain what the fraudster told you (e.g. claimed it was a refund QR, or police verification)..."
                className="w-full bg-[#070b14] border border-slate-700 rounded p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Voice Note */}
        {activeTab === 'voice' && (
          <div className="mb-4 bg-[#070b14] border border-slate-800 rounded-lg p-5 text-center">
            <div className="mb-3">
              <button
                type="button"
                onClick={handleSimulateVoice}
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition shadow-lg ${
                  isRecording
                    ? 'bg-red-600 animate-pulse text-white shadow-red-900/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Mic className="w-8 h-8" />
              </button>
            </div>
            <p className="text-xs md:text-sm font-semibold text-slate-200">
              {isRecording ? 'Listening & Transcribing Voice Input...' : 'Tap to Record Voice Incident Note'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports English, Hindi, and Tamil speech-to-text.
            </p>

            {voiceTranscript && (
              <div className="mt-4 p-3 bg-slate-900/90 border border-slate-800 rounded text-left text-xs font-mono text-slate-300">
                <span className="text-emerald-400 font-bold block mb-1">Transcribed Voice Note:</span>
                "{voiceTranscript}"
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-500">
            Agent pipeline: OCR ➔ Entity Extraction ➔ Risk Engine ➔ Action Plan
          </div>

          <button
            type="submit"
            disabled={isLoading || (!inputText && !selectedImage && !amount)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold px-5 py-2.5 rounded-lg transition shadow-md shadow-emerald-950 text-sm tracking-wide"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.analyzingState}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.analyzeButton}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
