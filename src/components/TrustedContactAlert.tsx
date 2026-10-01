import React, { useState } from 'react';
import { Users, Copy, Check, MessageCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface TrustedContactAlertProps {
  currentLanguage: SupportedLanguage;
  incidentId: string;
  disputedAmount?: string;
  bankName?: string;
}

export const TrustedContactAlert: React.FC<TrustedContactAlertProps> = ({
  currentLanguage,
  incidentId,
  disputedAmount,
  bankName
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [copied, setCopied] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);

  const getAlertMessage = () => {
    if (currentLanguage === 'hi') {
      return `नमस्ते, मुझे लगता है कि मेरे साथ एक डिजिटल धोखाधड़ी की घटना हुई है (संदर्भ: ${incidentId}${disputedAmount ? `, राशि: ${disputedAmount}` : ''})। कृपया मेरे साथ रहें जब तक मैं बैंक और 1930 आपातकालीन सहायता की प्रक्रिया पूरी कर रहा हूँ।`;
    }
    if (currentLanguage === 'ta') {
      return `வணக்கம், என்னை இலக்காகக் கொண்டு ஒரு டிஜிட்டல் மோசடி சம்பவம் நடந்துள்ளது என சந்தேகிக்கிறேன் (குறிப்பு எண்: ${incidentId}${disputedAmount ? `, தொகை: ${disputedAmount}` : ''})। அவசர உதவி மற்றும் வங்கி பாதுகாப்பு நடவடிக்கைகளை முடிக்கும் வரை தயவுசெய்து என்னுடன் தொடர்பில் இருங்கள்.`;
    }
    return `I may have encountered a digital fraud incident (Incident Ref: ${incidentId}${disputedAmount ? `, Disputed Sum: ${disputedAmount}` : ''}). Please stay with me while I complete the emergency response steps with my bank (${bankName || 'Bank'}) and the 1930 Cyber Helpline.`;
  };

  const alertMessage = getAlertMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(alertMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(alertMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div id="family-alert-section" className="bg-[#03060f] border border-emerald-950/80 rounded-xl p-5 md:p-6 mb-8 shadow-xl font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              TRUSTED CONTACT ASSISTANCE (OPTIONAL)
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Send a calm, prepared advisory so a family member or trusted friend can assist you with bank coordination.
            </p>
          </div>
        </div>

        <div className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded">
          EXPLICIT USER CONFIRMATION REQUIRED
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="bg-[#02050c] border border-slate-800 rounded-lg p-3.5 mb-4">
        <label className="flex items-start gap-2.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={userConfirmed}
            onChange={(e) => setUserConfirmed(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
          />
          <span className="text-xs font-sans leading-relaxed">
            I confirm that I want to prepare and send an advisory notification to a trusted family member or friend. (GoldenHour will not dispatch messages automatically).
          </span>
        </label>
      </div>

      {userConfirmed ? (
        <>
          <div className="bg-[#020409] border border-emerald-950/80 rounded-lg p-3.5 mb-4 text-slate-200 leading-relaxed font-mono">
            {alertMessage}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3.5 py-2 rounded transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Message' : 'Copy Message'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-slate-500 text-[11px] font-sans italic">
          Check the confirmation box above to preview and generate your trusted contact advisory message.
        </div>
      )}
    </div>
  );
};
