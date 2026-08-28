export type Language = 'en' | 'si' | 'ta';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
  badge: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    badge: 'EN',
  },
  {
    code: 'si',
    label: 'Sinhala',
    nativeName: 'සිංහල',
    badge: 'සිං',
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeName: 'தமிழ்',
    badge: 'த',
  },
];
