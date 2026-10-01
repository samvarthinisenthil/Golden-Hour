import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  tagline: string;
  subTagline: string;
  hotlineBadge: string;
  panicModeToggle: string;
  panicModeActiveTitle: string;
  panicModeActiveSub: string;
  call1930Button: string;
  contactBankButton: string;
  step1: string;
  step1Desc: string;
  step2: string;
  step2Desc: string;
  step3: string;
  step3Desc: string;
  step4: string;
  step4Desc: string;
  step5: string;
  step5Desc: string;
  step6: string;
  step6Desc: string;
  safetyNotice: string;
  inputHeader: string;
  inputPlaceholder: string;
  analyzeButton: string;
  analyzingState: string;
  urgencyCritical: string;
  urgencyHigh: string;
  urgencyLow: string;
  urgencyBenign: string;
  whyUrgency: string;
  immediateActionsTitle: string;
  timelineTitle: string;
  evidenceGraphTitle: string;
  documentsTitle: string;
  familyAlertTitle: string;
  familyAlertDesc: string;
  copyFamilyAlert: string;
  officialDisclaimer: string;
  demoHeader: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    tagline: 'AI Emergency Response Agent for Digital & UPI Fraud',
    subTagline: 'From suspected fraud to an organized response — in minutes.',
    hotlineBadge: 'NATIONAL CYBER FRAUD HELPLINE: 1930',
    panicModeToggle: '🚨 PANIC MODE',
    panicModeActiveTitle: 'CRITICAL FRAUD RESPONSE IN PROGRESS',
    panicModeActiveSub: 'Stay calm. Follow these priority emergency steps right now.',
    call1930Button: 'CALL 1930 IMMEDIATELY',
    contactBankButton: 'CONTACT BANK FRAUD DESK',
    step1: '1. Stop all communication immediately',
    step1Desc: 'Hang up the call or exit the chat. Scammers cannot arrest you through a phone or video call.',
    step2: '2. Do not send any more money',
    step2Desc: 'No government agency, court, or police department ever requests funds for "verification" or "clearing".',
    step3: '3. Never share OTP, UPI PIN, or password',
    step3Desc: 'No bank officer or authority has the legal power to ask for your UPI PIN or banking credentials.',
    step4: '4. Dial 1930 within the Golden Hour',
    step4Desc: 'Reporting within the first few hours gives banks the highest chance of freezing the fraudulent mule account.',
    step5: '5. Contact your bank to block UPI and accounts',
    step5Desc: 'Instruct your bank fraud team to lock internet banking and initiate a chargeback / recall request.',
    step6: '6. Preserve screenshots and transaction IDs',
    step6Desc: 'Do not delete chat logs, caller numbers, or SMS alerts. They are crucial legal evidence.',
    safetyNotice: '⚠️ GoldenHour Safety Guard: Never enter OTPs, PINs, passwords or CVV details into any system.',
    inputHeader: 'What happened? Describe the suspected incident',
    inputPlaceholder: 'Example: I received a call from someone claiming to be police asking for ₹25,000 to clear a digital arrest warrant...',
    analyzeButton: 'Run Emergency Agent Analysis',
    analyzingState: 'Agent Orchestration in Progress (Extracting entities, checking signals, building response)...',
    urgencyCritical: 'CRITICAL URGENCY — MONEY TRANSFER / ONGOING COMPROMISE',
    urgencyHigh: 'HIGH URGENCY — CREDENTIALS EXPOSED / ACTIVE THREAT',
    urgencyLow: 'LOW URGENCY — SUSPICIOUS ATTEMPT (NO LOSS DETECTED)',
    urgencyBenign: 'INFORMATIONAL — ROUTINE BANK TRANSACTION / NO FRAUD DETECTED',
    whyUrgency: 'Why was this urgency assigned?',
    immediateActionsTitle: 'Priority Action Checklist',
    timelineTitle: 'Incident Chronological Timeline',
    evidenceGraphTitle: 'Evidence Relationship Graph',
    documentsTitle: 'Official Reporting Deliverables',
    familyAlertTitle: 'Alert a Family Member / Trusted Friend',
    familyAlertDesc: 'Send a calm, prepared message so a trusted person can help you coordinate with your bank.',
    copyFamilyAlert: 'Copy Alert Message',
    officialDisclaimer: 'GoldenHour is an independent emergency decision-support prototype. It does not replace official police or banking channels. Actual freezing and legal recovery rests with banks and law enforcement authorities.',
    demoHeader: 'Quick Test Scenarios (BHARAT AGENTIC 2026)'
  },
  hi: {
    tagline: 'डिजिटल और यूपीआई धोखाधड़ी के लिए एआई आपातकालीन प्रतिक्रिया एजेंट',
    subTagline: 'संदिग्ध धोखाधड़ी से एक संगठित प्रतिक्रिया तक — कुछ ही मिनटों में।',
    hotlineBadge: 'राष्ट्रीय साइबर धोखाधड़ी हेल्पलाइन: 1930',
    panicModeToggle: '🚨 पैनिक मोड',
    panicModeActiveTitle: 'गंभीर धोखाधड़ी आपातकालीन प्रतिक्रिया सक्रिय',
    panicModeActiveSub: 'शांत रहें। तुरंत इन आवश्यक प्राथमिक कदमों का पालन करें।',
    call1930Button: 'तुरंत 1930 पर कॉल करें',
    contactBankButton: 'बैंक फ्रॉड डेस्क से संपर्क करें',
    step1: '1. सभी बातचीत तुरंत बंद करें',
    step1Desc: 'कॉल काट दें या चैट बंद करें। कोई भी पुलिस या अदालत फोन या वीडियो कॉल से डिजिटल अरेस्ट नहीं कर सकती।',
    step2: '2. और पैसे बिल्कुल न भेजें',
    step2Desc: 'कोई भी सरकारी एजेंसी या बैंक किसी "सत्यापन" या "जांच" के नाम पर पैसे ट्रांसफर करने को नहीं कहता।',
    step3: '3. कभी भी ओटीपी, यूपीआई पिन या पासवर्ड साझा न करें',
    step3Desc: 'कोई भी बैंक अधिकारी या पुलिसकर्मी आपका गुप्त पिन मांगने का कानूनी अधिकार नहीं रखता।',
    step4: '4. गोल्डन आवर में 1930 पर तुरंत शिकायत दर्ज करें',
    step4Desc: 'घटना के शुरुआती घंटों में शिकायत करने से बैंक को जालसाज का खाता फ्रीज करने का सबसे बड़ा मौका मिलता है।',
    step5: '5. अपने बैंक को फोन करके यूपीआई और खाता ब्लॉक कराएं',
    step5Desc: 'अपने बैंक को तुरंत अनधिकृत लेनदेन की सूचना दें और चार्ज-बैक या रिकॉल दर्ज करवाएं।',
    step6: '6. स्क्रीनशॉट और ट्रांजेक्शन आईडी सुरक्षित रखें',
    step6Desc: 'कॉल रिकॉर्ड, चैट या एसएमएस डिलीट न करें। ये शिकायत के लिए आवश्यक कानूनी साक्ष्य हैं।',
    safetyNotice: '⚠️ सुरक्षा नियम: गोल्डनऑवर में कभी भी ओटीपी, पिन, पासवर्ड या सीवीवी दर्ज न करें।',
    inputHeader: 'क्या हुआ? संदिग्ध घटना का विवरण दें',
    inputPlaceholder: 'उदाहरण: मुझे पुलिस बनकर फोन आया और डिजिटल अरेस्ट से बचने के लिए ₹25,000 ट्रांसफर करने को कहा गया...',
    analyzeButton: 'आपातकालीन एजेंट विश्लेषण शुरू करें',
    analyzingState: 'एजेंट प्रोसेसिंग जारी है (तथ्य निकालना, सिग्नल जांचना, कार्ययोजना तैयार करना)...',
    urgencyCritical: 'गंभीर आपातकाल — पैसे का नुकसान / सक्रिय धोखाधड़ी',
    urgencyHigh: 'उच्च सतर्कता — संवेदनशील जानकारी साझा हुई / सक्रिय धमकी',
    urgencyLow: 'कम सतर्कता — केवल संदिग्ध प्रयास (कोई नुकसान नहीं हुआ)',
    urgencyBenign: 'सामान्य सूचना — वैध बैंक मैसेज / कोई धोखाधड़ी नहीं',
    whyUrgency: 'यह आपातकाल स्तर क्यों निर्धारित किया गया?',
    immediateActionsTitle: 'प्राथमिक कार्य योजना',
    timelineTitle: 'घटना का समय-क्रम (टाइमलाइन)',
    evidenceGraphTitle: 'साक्ष्य संबंध ग्राफ (Evidence Graph)',
    documentsTitle: 'आधिकारिक रिपोर्टिंग दस्तावेज',
    familyAlertTitle: 'परिवार या विश्वसनीय व्यक्ति को सूचित करें',
    familyAlertDesc: 'एक स्पष्ट, शांत संदेश भेजें ताकि कोई भरोसेमंद परिजन बैंक और पुलिस संपर्क में आपकी मदद कर सके।',
    copyFamilyAlert: 'अलर्ट संदेश कॉपी करें',
    officialDisclaimer: 'गोल्डनऑवर एक स्वतंत्र आपातकालीन निर्णय-सहायक प्रणाली है। यह बैंक या पुलिस का विकल्प नहीं है। पैसे फ्रीज करना और कानूनी कार्रवाई केवल संबंधित बैंकों और कानून प्रवर्तन एजेंसियों के अधिकार क्षेत्र में है।',
    demoHeader: 'त्वरित डेमो परीक्षण (भारत एजंटिक 2026)'
  },
  ta: {
    tagline: 'டிஜிட்டல் மற்றும் யுபிஐ மோசடிகளுக்கான அவசரக்கால AI வழிகாட்டி',
    subTagline: 'மோசடி சந்தேகத்திலிருந்து உடனடி பாதுகாப்பு நடவடிக்கைக்கு — சில நிமிடங்களில்.',
    hotlineBadge: 'தேசிய சைபர் குற்ற அவசர எண்: 1930',
    panicModeToggle: '🚨 அவசர முறை (PANIC MODE)',
    panicModeActiveTitle: 'தீவிர மோசடி தடுப்பு நடவடிக்கை செயலில் உள்ளது',
    panicModeActiveSub: 'பதற்றமடைய வேண்டாம். உடனடியாக இந்த அவசர பாதுகாப்பு படிகளை பின்பற்றுங்கள்.',
    call1930Button: 'உடனடியாக 1930-ஐ அழைக்கவும்',
    contactBankButton: 'வங்கி மோசடி பிரிவை தொடர்பு கொள்ளவும்',
    step1: '1. உடனடி தொடர்பை துண்டிக்கவும்',
    step1Desc: 'தொலைபேசி அழைப்பை உடனே துண்டிக்கவும். எந்த ஒரு காவல் அதிகாரியும் வீடியோ கால் மூலம் கைது செய்ய முடியாது.',
    step2: '2. மேலும் பணம் அனுப்ப வேண்டாம்',
    step2Desc: 'எந்தவொரு அரசு நிறுவனமும் அல்லது வங்கியும் பணத்தை "சரிபார்ப்பு"க்காக அனுப்பச் சொல்லாது.',
    step3: '3. OTP அல்லது UPI PIN-ஐ யாருடனும் பகிர வேண்டாம்',
    step3Desc: 'எந்தவொரு அதிகாரியும் உங்கள் UPI PIN அல்லது ரகசிய கடவுச்சொல்லை கேட்க சட்டப்பூர்வ உரிமை இல்லை.',
    step4: '4. கோல்டன் ஹவர் நேரத்திற்குள் 1930 எண்ணை அழைக்கவும்',
    step4Desc: 'மோசடி நடந்த உடனேயே புகார் செய்வது மோசடி செய்தவரின் வங்கிக் கணக்கை முடக்க வாய்ப்பளிக்கும்.',
    step5: '5. வங்கியைத் தொடர்பு கொண்டு UPI-ஐ உடனடியாக முடக்கவும்',
    step5Desc: 'வங்கி மோசடி பிரிவிடம் புகார் செய்து இணைய வங்கி மற்றும் பணப்பரிவர்த்தனையை உடனே நிறுத்தவும்.',
    step6: '6. ஸ்கிரீன்ஷாட்கள் மற்றும் பரிவர்த்தனை எண்களை பாதுகாக்கவும்',
    step6Desc: 'மெசேஜ் அல்லது அழைப்பு எண்களை அழிக்க வேண்டாம். இவை சட்டபூர்வமான முக்கிய ஆதாரங்களாகும்.',
    safetyNotice: '⚠️ பாதுகாப்பு எச்சரிக்கை: உங்கள் OTP, PIN அல்லது கடவுச்சொல்லை எந்த நிலையிலும் பதிவிட வேண்டாம்.',
    inputHeader: 'என்ன நடந்தது? சந்தேகத்திற்குரிய சம்பவத்தை விவரிக்கவும்',
    inputPlaceholder: 'எடுத்துக்காட்டு: காவல் அதிகாரி என கூறி எனக்கு போன் வந்தது, ₹25,000 பணம் அனுப்ப சொன்னார்கள்...',
    analyzeButton: 'அவசரக்கால AI பகுப்பாய்வை தொடங்கு',
    analyzingState: 'AI முகவர் செயல்படுகிறது (ஆதாரங்களை சேகரித்தல், முக்கிய வழிகாட்டல் தயாரித்தல்)...',
    urgencyCritical: 'அதிதீவிர அவசரம் — பண இழப்பு / உடனடி நடவடிக்கை தேவை',
    urgencyHigh: 'அதிக அவசரம் — ரகசிய தகவல் பகிரப்பட்டுள்ளது / அச்சுறுத்தல் உள்ளது',
    urgencyLow: 'குறைந்த அவசரம் — சந்தேகத்திற்குரிய முயற்சி மட்டுமே (பண இழப்பு இல்லை)',
    urgencyBenign: 'வழக்கமான தகவல் — முறையான வங்கி செய்தி / எந்த ஆபத்தும் இல்லை',
    whyUrgency: 'இந்த அவசர நிலை ஏன் தீர்மானிக்கப்பட்டது?',
    immediateActionsTitle: 'உடனடி நடவடிக்கை பட்டியல்',
    timelineTitle: 'சம்பவ நிகழ்வு வரிசை (Timeline)',
    evidenceGraphTitle: 'ஆதார வரைபடம் (Evidence Graph)',
    documentsTitle: 'அதிகாரப்பூர்வ புகார் ஆவணங்கள்',
    familyAlertTitle: 'குடும்பத்தினர் அல்லது நண்பருக்கு தகவல் தெரிவிக்கவும்',
    familyAlertDesc: 'உங்களுக்கு உதவக்கூடிய குடும்பத்தினருக்கு உடனடியாக பகிரக்கூடிய அமைதியான செய்தி.',
    copyFamilyAlert: 'செய்தியை நகலெடுக்கவும்',
    officialDisclaimer: 'கோல்டன்ஹவர் ஒரு சுதந்திரமான அவசர உதவி வழிகாட்டி மட்டுமே. இது வங்கி அல்லது காவல் துறையின் மாற்று அல்ல. கணக்குகளை முடக்குவது வங்கி மற்றும் சட்ட அமலாக்க துறையினரின் கட்டுப்பாட்டில் மட்டுமே உள்ளது.',
    demoHeader: 'மாதிரி வழக்குகள் (Demo Scenarios)'
  }
};
