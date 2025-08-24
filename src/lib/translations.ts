export type Language = 'en' | 'hi';

export const translations = {
  en: {
    app_title: "Secure File Locker",
    app_tagline: "Encrypt and decrypt your files safely with zero-knowledge security.",
    get_started: "Get Started",
    help_faq: "Help / FAQ",
    encrypt_file: "Encrypt File",
    decrypt_file: "Decrypt File",
    choose_files: "Choose Files",
    drag_drop_files: "Or drag and drop files here",
    password: "Password",
    start_encryption: "Start Encryption",
    start_decryption: "Start Decryption",
    download: "Download",
    encrypting: "Encrypting...",
    decrypting: "Decrypting...",
    success_encrypt: "File encrypted successfully!",
    success_decrypt: "File decrypted successfully!",
    guest_mode: "Guest Mode",
    guest_mode_desc: "Continue without account - full encryption available, no cloud history.",
    file_selected: "file selected",
    files_selected: "files selected",
    recent_activity: "Recent Activity",
    no_activity: "No recent activity",
    zero_knowledge_title: "Zero-Knowledge Security",
    zero_knowledge_desc: "Your passwords and files never leave your device in plaintext."
  },
  hi: {
    app_title: "सिक्योर फ़ाइल लॉकर",
    app_tagline: "शून्य-ज्ञान सुरक्षा के साथ अपनी फ़ाइलों को सुरक्षित रूप से एन्क्रिप्ट और डिक्रिप्ट करें।",
    get_started: "शुरू करें",
    help_faq: "सहायता",
    encrypt_file: "फ़ाइल एन्क्रिप्ट करें",
    decrypt_file: "फ़ाइल डिक्रिप्ट करें",
    choose_files: "फ़ाइलें चुनें",
    drag_drop_files: "या यहां फ़ाइलें खींचें और छोड़ें",
    password: "पासवर्ड",
    start_encryption: "एन्क्रिप्शन शुरू करें",
    start_decryption: "डिक्रिप्शन शुरू करें",
    download: "डाउनलोड",
    encrypting: "एन्क्रिप्ट कर रहे हैं...",
    decrypting: "डिक्रिप्ट कर रहे हैं...",
    success_encrypt: "फ़ाइल सफलतापूर्वक एन्क्रिप्ट हो गई!",
    success_decrypt: "फ़ाइल सफलतापूर्वक डिक्रिप्ट हो गई!",
    guest_mode: "अतिथि मोड",
    guest_mode_desc: "खाता बनाए बिना जारी रखें - पूर्ण एन्क्रिप्शन उपलब्ध, कोई क्लाउड इतिहास नहीं।",
    file_selected: "फ़ाइल चुनी गई",
    files_selected: "फ़ाइलें चुनी गईं",
    recent_activity: "हाल की गतिविधि",
    no_activity: "कोई हाल की गतिविधि नहीं",
    zero_knowledge_title: "शून्य-ज्ञान सुरक्षा",
    zero_knowledge_desc: "आपके पासवर्ड और फ़ाइलें कभी भी सादे टेक्स्ट में आपके डिवाइस को नहीं छोड़तीं।"
  }
};

export type TranslationKey = keyof typeof translations.en;