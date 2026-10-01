/**
 * VÉQALUNE CIVIC Design System Tokens — Liquid Glass Light
 *
 * Updated for the Liquid Glass + Light theme.
 * All colors, spacing, typography, and glass-effect decisions centralized here.
 *
 * Usage:
 * - Import tokens and use in Tailwind classes via CSS custom properties
 * - Example: className="bg-[var(--color-primary)] text-[var(--font-size-lg)]"
 */

export const designTokens = {
  // Brand Colors (unchanged — vivid on light surfaces)
  colors: {
    primary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Primary brand color (emerald)
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Secondary brand color (sky)
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      rose: '#f43f5e',
      amber: '#f59e0b',
      violet: '#8b5cf6',
    },
  },

  // Semantic Colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Neutral Colors — Light Mode
  neutral: {
    50:  '#f8fafc', // page background
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Spacing Scale (4px base unit)
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: "'Plus Jakarta Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows — Light glass-optimized
  shadow: {
    sm: '0 1px 3px rgba(15, 23, 42, 0.06)',
    base: '0 2px 6px rgba(15, 23, 42, 0.08)',
    md: '0 4px 12px rgba(15, 23, 42, 0.08)',
    lg: '0 8px 24px rgba(15, 23, 42, 0.1)',
    xl: '0 16px 40px rgba(15, 23, 42, 0.12)',
    '2xl': '0 24px 64px rgba(15, 23, 42, 0.14)',
    glass: '0 8px 32px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
    glow: '0 0 20px rgb(16 185 129 / 0.2)',
    'glow-sm': '0 0 10px rgb(16 185 129 / 0.15)',
  },

  // Liquid Glass Surface Tokens
  glass: {
    bg: 'rgba(255, 255, 255, 0.65)',
    bgHover: 'rgba(255, 255, 255, 0.80)',
    bgDeep: 'rgba(248, 250, 252, 0.75)',
    bgModal: 'rgba(255, 255, 255, 0.88)',
    border: 'rgba(255, 255, 255, 0.75)',
    borderSubtle: 'rgba(226, 232, 240, 0.6)',
    blur: 'blur(20px) saturate(180%)',
    blurHeavy: 'blur(32px) saturate(200%)',
  },

  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// CSS Custom Properties for use in Tailwind
export const cssVariables = {
  '--color-primary-500': designTokens.colors.primary[500],
  '--color-primary-600': designTokens.colors.primary[600],
  '--color-secondary-500': designTokens.colors.secondary[500],
  '--color-secondary-600': designTokens.colors.secondary[600],
  '--color-neutral-950': designTokens.neutral[50],   // remapped: 950 = page bg in light mode
  '--color-neutral-900': designTokens.neutral[100],
  '--color-neutral-800': designTokens.neutral[200],
  '--color-neutral-700': designTokens.neutral[300],
  '--color-neutral-600': designTokens.neutral[400],
  '--color-neutral-500': designTokens.neutral[500],
  '--color-neutral-400': designTokens.neutral[600],
  '--color-neutral-300': designTokens.neutral[700],
  '--color-neutral-200': designTokens.neutral[800],
  '--color-neutral-100': designTokens.neutral[900],
  '--color-success': designTokens.semantic.success,
  '--color-warning': designTokens.semantic.warning,
  '--color-error': designTokens.semantic.error,
  '--color-info': designTokens.semantic.info,
  '--font-sans': designTokens.typography.fontFamily.sans,
  '--font-mono': designTokens.typography.fontFamily.mono,
  '--radius-sm': designTokens.borderRadius.sm,
  '--radius-base': designTokens.borderRadius.base,
  '--radius-md': designTokens.borderRadius.md,
  '--radius-lg': designTokens.borderRadius.lg,
  '--radius-xl': designTokens.borderRadius.xl,
  '--radius-2xl': designTokens.borderRadius['2xl'],
  '--radius-3xl': designTokens.borderRadius['3xl'],
  '--shadow-glow': designTokens.shadow.glow,
} as const;
