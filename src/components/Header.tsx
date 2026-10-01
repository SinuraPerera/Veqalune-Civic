import React, { useEffect, useState, memo } from 'react';
import { Home, MapPin, LayoutDashboard, Menu, X, PlusCircle, Search, FileText, BrainCircuit, Activity, User } from 'lucide-react';
import { LanguageSelector, useLanguage } from '../context/LanguageContext';
import { CommandPalette } from './CommandPalette';
import { SystemHealth } from '../types';

interface Props {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenDbModal: () => void;
  onOpenTechnicalDossier?: (tab?: any) => void;
  activeReportsCount?: number;
  systemHealth?: SystemHealth | null;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<Props> = memo(({
  currentPath,
  onNavigate,
  onOpenDbModal,
  onOpenTechnicalDossier,
  activeReportsCount = 12,
  systemHealth,
  onOpenProfileModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Map', path: '/map', icon: MapPin },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Insights', path: '/insights', icon: BrainCircuit },
  ];

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-xl p-1"
            aria-label="Navigate to Home"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-400/60 group-hover:shadow-md group-hover:shadow-emerald-500/15 transition-all overflow-hidden">
              <img src="/logo.png?v=2" alt="VÉQALUNE CIVIC logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-slate-800 uppercase">
                VÉQALUNE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold">CIVIC</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 glass-pill p-1.5 rounded-2xl" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    isActive
                      ? 'bg-white/90 text-emerald-700 border border-emerald-200/80 shadow-sm shadow-emerald-100'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 hover:bg-white/90 shadow-sm min-h-[44px]"
              aria-label="Open command palette"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Command</span>
              <kbd className="rounded border border-slate-200 bg-slate-100/80 px-2 py-1 font-mono text-xs text-slate-400">Ctrl K</kbd>
            </button>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400" title={systemHealth?.aiConfigured ? 'AI provider connected' : 'Demo intelligence mode'}>
              <Activity className={`h-4 w-4 ${systemHealth?.aiConfigured ? 'text-emerald-500' : 'text-amber-500'}`} aria-hidden="true" />
              <span className="hidden xl:inline">{systemHealth?.aiConfigured ? 'AI online' : 'Demo mode'}</span>
            </div>
            <LanguageSelector variant="pills" />
            <button
              onClick={onOpenProfileModal}
              className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer shadow-sm min-h-[44px] min-w-[44px]"
              aria-label="View citizen profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNav('/report')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
              aria-label="Submit a new report"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              Report Issue
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSelector variant="compact" />
            <button
              onClick={() => handleNav('/report')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
              aria-label="Submit a new report"
            >
              Report
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-xl bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-white cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px] min-w-[44px] shadow-sm"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200/70 bg-white/85 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1 shadow-lg" role="navigation" aria-label="Mobile navigation">
          <div className="py-4 border-b border-slate-200/60 flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Language</span>
            <LanguageSelector variant="pills" />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[48px] ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                    : 'text-slate-600 hover:bg-slate-50/80'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} aria-hidden="true" />
                <span className="font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} onNavigate={handleNav} />
    </header>
  );
});
