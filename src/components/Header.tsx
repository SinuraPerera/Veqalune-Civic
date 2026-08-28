import React, { useState } from 'react';
import {
  Activity,
  PlusCircle,
  MapPin,
  LayoutDashboard,
  Sparkles,
  Table,
  Home,
  Database,
  Menu,
  X,
  TrendingUp,
  BrainCircuit,
  Compass,
  FileText,
  Award,
  Globe,
} from 'lucide-react';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';

interface Props {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenDbModal: () => void;
  onOpenTechnicalDossier?: (tab?: any) => void;
  activeReportsCount?: number;
}

export const Header: React.FC<Props> = ({
  currentPath,
  onNavigate,
  onOpenDbModal,
  onOpenTechnicalDossier,
  activeReportsCount = 12,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const navItems = [
    { label: t.nav.civic, sub: t.nav.civicSub, path: '/', icon: Home, code: 'CIVIC' },
    { label: t.nav.ai, sub: t.nav.aiSub, path: '/report', icon: BrainCircuit, code: 'AI' },
    { label: t.nav.map, sub: t.nav.mapSub, path: '/map', icon: MapPin, code: 'MAP' },
    { label: t.nav.command, sub: t.nav.commandSub, path: '/dashboard', icon: LayoutDashboard, code: 'COMMAND' },
    { label: t.nav.insight, sub: t.nav.insightSub, path: '/reports', icon: Table, code: 'INSIGHT' },
    { label: t.nav.predict, sub: t.nav.predictSub, path: '/insights', icon: TrendingUp, code: 'PREDICT' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/80 group-hover:border-emerald-500/60 transition-all shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-transparent"></div>
              <img src="/logo.png" alt="VÉQALUNE CIVIC Logo" className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-zinc-100 uppercase">
                  VÉQALUNE <span className="text-emerald-400 font-semibold">CIVIC</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                  {t.brand.ecosystem}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium tracking-tight">
                {t.brand.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/70 p-1 rounded-xl border border-zinc-800/80">
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
                  title={`VÉQALUNE ${item.code} — ${item.sub}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-300 border border-zinc-700/80 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities & Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Trilingual Language Selector */}
            <LanguageSelector variant="pills" />

            {/* Competition Proposal Dossier Button */}
            {onOpenTechnicalDossier && (
              <button
                onClick={() => onOpenTechnicalDossier('story')}
                title="View Official Technical Solution & Proposal Dossier"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-800/60 text-xs font-mono font-bold transition-all hover:border-emerald-500 shadow-sm cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.nav.proposalShort}</span>
              </button>
            )}

            {/* Live Telemetry Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-mono text-zinc-300">VÉQALUNE AI</span>
              </div>
              <span className="text-zinc-600">|</span>
              <span className="text-[11px] font-mono text-emerald-400 font-medium">
                {activeReportsCount} {t.nav.activeIncidents}
              </span>
            </div>

            {/* Schema reference */}
            <button
              onClick={onOpenDbModal}
              title="View Supabase/PostgreSQL Data Schema & Architecture"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Quick Report CTA */}
            <button
              onClick={() => handleNav('/report')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {t.nav.launchAi}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector variant="compact" />

            {onOpenTechnicalDossier && (
              <button
                onClick={() => onOpenTechnicalDossier('story')}
                className="p-1.5 rounded-lg bg-zinc-900 text-emerald-400 border border-emerald-800/80 cursor-pointer"
                title={t.nav.proposalShort}
              >
                <Award className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleNav('/report')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-zinc-950 font-bold text-xs cursor-pointer"
            >
              AI
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-4 space-y-1">
          <div className="py-2 border-b border-zinc-900 flex items-center justify-between">
            <span className="text-xs text-zinc-400">{t.footer.language}</span>
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">VÉQALUNE {item.label}</span>
                </div>
                <span className="text-xs text-zinc-500 font-mono">{item.sub}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-zinc-800 space-y-2">
            {onOpenTechnicalDossier && (
              <button
                onClick={() => {
                  onOpenTechnicalDossier('story');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/80 text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{t.nav.proposalDossier}</span>
                </div>
                <span className="font-mono text-[10px]">Open →</span>
              </button>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  onOpenDbModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-emerald-400 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                {t.common.viewDataModel}
              </button>
              <span className="text-xs font-mono text-emerald-400">
                {activeReportsCount} {t.nav.activeIncidents}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
