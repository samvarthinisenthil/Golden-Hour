import React, { useState } from 'react';
import { Users, Copy, Check, MessageCircle, Send } from 'lucide-react';
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

  const getAlertMessage = () => {
    if (currentLanguage === 'hi') {
      return `नमस्ते, मुझे लगता है कि मेरे साथ एक डिजिटल फ्रॉड/धोखाधड़ी की कोशिश हुई है (संदर्भ: ${incidentId}${disputedAmount ? `, राशि: ${disputedAmount}` : ''})। मैंने साइबर हेल्पलाइन 1930 और बैंक को सूचित करना शुरू कर दिया है। कृपया उपलब्ध रहें और बैंक व नजदीकी साइबर सेल से संपर्क में मेरी मदद करें।`;
    }
    if (currentLanguage === 'ta') {
      return `வணக்கம், என்னை இலக்காகக் கொண்டு ஒரு டிஜிட்டல் மோசடி சம்பவம் நடந்துள்ளது என சந்தேகிக்கிறேன் (குறிப்பு எண்: ${incidentId}${disputedAmount ? `, தொகை: ${disputedAmount}` : ''})। நான் தற்போது 1930 சைபர் உதவி எண் மற்றும் வங்கிக்கு புகார் செய்து வருகிறேன். தயவுசெய்து என்னுடன் தொடர்பில் இருந்து உதவவும்.`;
    }
    return `Hello, I may have been targeted by a digital fraud incident (Incident Ref: ${incidentId}${disputedAmount ? `, Disputed Sum: ${disputedAmount}` : ''}). I am currently taking the recommended safety steps with the 1930 Cyber Helpline and my bank (${bankName || 'Bank'}). Please stay available and help me coordinate with my bank branch.`;
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
    <div id="family-alert-section" className="bg-[#080d17] border border-slate-800 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {t.familyAlertTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.familyAlertDesc}
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
          User-Controlled • No automatic background dispatch
        </div>
      </div>

      <div className="bg-[#050810] border border-slate-800 rounded-lg p-3.5 mb-4 font-mono text-xs text-slate-300 leading-relaxed">
        {alertMessage}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3.5 py-2 rounded transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard' : t.copyFamilyAlert}</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-1.5 text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded transition shadow-md"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Send via WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
