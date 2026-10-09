export type Language = "en" | "hi";

export const translations = {
  en: {
    // Navigation / Sidebar
    dashboard: "Dashboard",
    bmiCalculator: "BMI Calculator",
    calories: "Calories",
    doctors: "Doctors",
    aiChat: "AI Chat",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",

    // Header & Common
    findDoctors: "Find Best Doctors",
    searchPlaceholder: "Search doctors or areas...",

    // Settings General
    settingsTitle: "Settings",
    settingsSubtitle: "Manage your app preferences",

    // Preferences Section
    preferences: "Preferences",
    darkMode: "Dark Mode",
    darkModeDesc: "Switch to dark theme",
    language: "Language",
    languageDesc: "Choose your preferred language",
    englishUS: "English (US)",
    hindiIN: "हिन्दी (Hindi)",
    change: "Change",

    // Security Section
    security: "Security",
    twoFactorAuth: "Two-Factor Authentication",
    twoFactorDesc: "Add an extra layer of security",
    mfaSetupRequired: "Setup Required",
    mfaDialogTitle: "Two-Factor Authentication Setup",
    mfaDialogDesc: "Firebase Multi-Factor Authentication (MFA) requires Google Cloud Identity Platform (Firebase Blaze Pay-as-you-go Plan). To enable 2FA:",
    mfaStep1: "Upgrade your Firebase project 'medinutri-ai' to the Blaze Plan.",
    mfaStep2: "Enable SMS or TOTP Multi-factor Authentication in the Firebase Console under Authentication > Sign-in method.",
    mfaStep3: "Implement enrollment with PhoneMultiFactorGenerator or TotpMultiFactorGenerator in the web client.",
    mfaDialogNotice: "This toggle is disabled until MFA is configured in Firebase to prevent misleading security settings.",
    close: "Close",

    // Change Password
    changePassword: "Change Password",
    changePasswordDesc: "Update your account password",
    changePasswordTitle: "Change Password",
    currentPassword: "Current Password",
    currentPasswordPlaceholder: "Enter current password",
    newPassword: "New Password",
    newPasswordPlaceholder: "Enter new password (min. 6 characters)",
    confirmPassword: "Confirm New Password",
    confirmPasswordPlaceholder: "Re-enter new password",
    updatePasswordBtn: "Update Password",
    updating: "Updating...",
    passwordUpdatedSuccess: "Password updated successfully!",
    passwordsDoNotMatch: "New passwords do not match.",
    passwordTooShort: "New password must be at least 6 characters.",
    enterCurrentPassword: "Please enter your current password.",
    wrongPassword: "The current password entered is incorrect.",
    tooManyAttempts: "Too many attempts. Please try again later.",
    notPasswordUser: "Password change is only available for accounts using email/password authentication.",
    recentLoginRequired: "This action requires recent authentication. Please verify your current password.",

    // Danger Zone / Delete Account
    dangerZone: "Danger Zone",
    dangerZoneDesc: "Once you delete your account, there is no going back. Please be certain.",
    deleteAccount: "Delete Account",
    deleteConfirmTitle: "Delete Account Permanently?",
    deleteConfirmDesc: "This action is permanent and cannot be undone. All your profile information, health metrics, and account credentials will be permanently erased.",
    deleteConfirmPrompt: "Please enter your password to confirm account deletion:",
    deletePasswordPlaceholder: "Enter your password to confirm",
    confirmDeleteBtn: "Permanently Delete Account",
    deleting: "Deleting...",
    cancel: "Cancel",
    accountDeletedSuccess: "Your account has been permanently deleted.",
    pleaseEnterPasswordToDelete: "Please enter your password to confirm account deletion.",
    userNotFound: "No authenticated user found. Please log in again."
  },
  hi: {
    // Navigation / Sidebar
    dashboard: "डैशबोर्ड",
    bmiCalculator: "बीएमआई कैलकुलेटर",
    calories: "कैलोरी",
    doctors: "डॉक्टर",
    aiChat: "एआई चैट",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",

    // Header & Common
    findDoctors: "सर्वश्रेष्ठ डॉक्टर खोजें",
    searchPlaceholder: "डॉक्टरों या क्षेत्रों की खोज करें...",

    // Settings General
    settingsTitle: "सेटिंग्स",
    settingsSubtitle: "अपनी ऐप प्राथमिकताएं प्रबंधित करें",

    // Preferences Section
    preferences: "प्राथमिकताएं",
    darkMode: "डार्क मोड",
    darkModeDesc: "डार्क थीम पर स्विच करें",
    language: "भाषा",
    languageDesc: "अपनी पसंदीदा भाषा चुनें",
    englishUS: "English (US)",
    hindiIN: "हिन्दी (Hindi)",
    change: "बदलें",

    // Security Section
    security: "सुरक्षा",
    twoFactorAuth: "दो-चरणीय प्रमाणीकरण (2FA)",
    twoFactorDesc: "सुरक्षा की एक अतिरिक्त परत जोड़ें",
    mfaSetupRequired: "सेटअप आवश्यक",
    mfaDialogTitle: "दो-चरणीय प्रमाणीकरण सेटअप",
    mfaDialogDesc: "फायरबेस मल्टी-फैक्टर ऑथेंटिकेशन (MFA) के लिए गूगल क्लाउड आइडेंटिटी प्लेटफॉर्म (फायरबेस ब्लेज़ प्लान) आवश्यक है। 2FA सक्षम करने के लिए:",
    mfaStep1: "अपने फायरबेस प्रोजेक्ट 'medinutri-ai' को ब्लेज़ प्लान में अपग्रेड करें।",
    mfaStep2: "फायरबेस कंसोल में ऑथेंटिकेशन > साइन-इन मेथड में SMS या TOTP सक्षम करें।",
    mfaStep3: "क्लाइंट पर PhoneMultiFactorGenerator या TotpMultiFactorGenerator एनरोलमेंट लागू करें।",
    mfaDialogNotice: "गलत सुरक्षा दावों से बचने के लिए यह टॉगल तब तक अक्षम है जब तक कि फायरबेस में MFA सेटअप न हो।",
    close: "बंद करें",

    // Change Password
    changePassword: "पासवर्ड बदलें",
    changePasswordDesc: "अपना खाता पासवर्ड अपडेट करें",
    changePasswordTitle: "पासवर्ड बदलें",
    currentPassword: "वर्तमान पासवर्ड",
    currentPasswordPlaceholder: "वर्तमान पासवर्ड दर्ज करें",
    newPassword: "नया पासवर्ड",
    newPasswordPlaceholder: "नया पासवर्ड दर्ज करें (न्यूनतम 6 अक्षर)",
    confirmPassword: "नए पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "नया पासवर्ड पुनः दर्ज करें",
    updatePasswordBtn: "पासवर्ड अपडेट करें",
    updating: "अपडेट हो रहा है...",
    passwordUpdatedSuccess: "पासवर्ड सफलतापूर्वक अपडेट किया गया!",
    passwordsDoNotMatch: "नए पासवर्ड मेल नहीं खाते।",
    passwordTooShort: "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    enterCurrentPassword: "कृपया अपना वर्तमान पासवर्ड दर्ज करें।",
    wrongPassword: "दर्ज किया गया वर्तमान पासवर्ड गलत है।",
    tooManyAttempts: "बहुत सारे प्रयास। कृपया बाद में पुनः प्रयास करें।",
    notPasswordUser: "पासवर्ड परिवर्तन केवल ईमेल/पासवर्ड खातों के लिए उपलब्ध है।",
    recentLoginRequired: "इस क्रिया के लिए हालिया प्रमाणीकरण आवश्यक है। कृपया अपने वर्तमान पासवर्ड की पुष्टि करें।",

    // Danger Zone / Delete Account
    dangerZone: "खतरे का क्षेत्र",
    dangerZoneDesc: "एक बार जब आप अपना खाता हटा देते हैं, तो इसे वापस नहीं पाया जा सकता। कृपया सुनिश्चित करें।",
    deleteAccount: "खाता हटाएं",
    deleteConfirmTitle: "क्या आप खाता स्थायी रूप से हटाना चाहते हैं?",
    deleteConfirmDesc: "यह क्रिया स्थायी है और इसे पूर्ववत नहीं किया जा सकता है। आपकी प्रोफ़ाइल, स्वास्थ्य मेट्रिक्स और खाता क्रेडेंशियल्स स्थायी रूप से हटा दिए जाएंगे।",
    deleteConfirmPrompt: "खाता हटाने की पुष्टि के लिए कृपया अपना पासवर्ड दर्ज करें:",
    deletePasswordPlaceholder: "पुष्टि के लिए अपना पासवर्ड दर्ज करें",
    confirmDeleteBtn: "खाता स्थायी रूप से हटाएं",
    deleting: "हटाया जा रहा है...",
    cancel: "रद्द करें",
    accountDeletedSuccess: "आपका खाता स्थायी रूप से हटा दिया गया है।",
    pleaseEnterPasswordToDelete: "खाता हटाने की पुष्टि के लिए कृपया अपना पासवर्ड दर्ज करें।",
    userNotFound: "कोई प्रमाणित उपयोगकर्ता नहीं मिला। कृपया पुनः लॉगिन करें।"
  }
};

export type TranslationKey = keyof typeof translations.en;