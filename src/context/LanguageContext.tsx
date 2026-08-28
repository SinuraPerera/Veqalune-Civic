import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, LanguageOption } from '../i18n/types';
import { translations, Translations } from '../i18n/translations';
import { ReportCategory, SeverityLevel, ReportStatus } from '../types';
import { Globe, Check } from 'lucide-react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentOption: LanguageOption;
  formatCategory: (category: ReportCategory | string) => string;
  formatSeverity: (severity: SeverityLevel | string) => string;
  formatStatus: (status: ReportStatus | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'veqalune_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'si' || saved === 'ta') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const currentTranslations = translations[language] || translations.en;
  const currentOption =
    SUPPORTED_LANGUAGES.find((opt) => opt.code === language) || SUPPORTED_LANGUAGES[0];

  const formatCategory = (category: ReportCategory | string): string => {
    const key = category as keyof typeof currentTranslations.categories;
    return currentTranslations.categories[key] || category;
  };

  const formatSeverity = (severity: SeverityLevel | string): string => {
    const key = severity as keyof typeof currentTranslations.severities;
    return currentTranslations.severities[key] || severity;
  };

  const formatStatus = (status: ReportStatus | string): string => {
    const key = status as keyof typeof currentTranslations.statuses;
    return currentTranslations.statuses[key] || status;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslations,
        currentOption,
        formatCategory,
        formatSeverity,
        formatStatus,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface SelectorProps {
  variant?: 'pills' | 'dropdown' | 'compact' | 'footer';
  className?: string;
}

export const LanguageSelector: React.FC<SelectorProps> = ({ variant = 'pills', className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              title={`${lang.label} (${lang.nativeName})`}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              {lang.badge}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-inner ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <span>{lang.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Globe className="w-3.5 h-3.5 text-zinc-400 mr-1" />
        {SUPPORTED_LANGUAGES.map((lang, idx) => {
          const isActive = language === lang.code;
          return (
            <React.Fragment key={lang.code}>
              {idx > 0 && <span className="text-zinc-600 px-0.5">•</span>}
              <button
                onClick={() => setLanguage(lang.code)}
                className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                  isActive
                    ? 'text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lang.nativeName}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold">{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-zinc-900 border border-zinc-700 shadow-xl z-50 py-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-emerald-950/60 text-emerald-400 font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span>{lang.nativeName}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
