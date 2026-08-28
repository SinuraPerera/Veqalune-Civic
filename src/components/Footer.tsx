import React from 'react';
import { Activity, ShieldAlert, Cpu, Database, Globe, Award, FileText } from 'lucide-react';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';

interface Props {
  onNavigate: (path: string) => void;
  onOpenDbModal: () => void;
  onOpenTechnicalDossier?: (tab?: any) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenDbModal, onOpenTechnicalDossier }) => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-zinc-200 tracking-wider">
                VÉQALUNE <span className="text-emerald-400">CIVIC</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs max-w-md leading-relaxed">
              {t.footer.mission}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {t.footer.schoolPhase}
              </span>
              {onOpenTechnicalDossier && (
                <button
                  onClick={() => onOpenTechnicalDossier('story')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-400 hover:text-emerald-300 font-mono font-bold transition-colors cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  {t.footer.proposalLink}
                </button>
              )}
            </div>

            {/* Language Switcher in Footer */}
            <div className="pt-2">
              <LanguageSelector variant="footer" />
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider mb-3">
              {t.landing.suiteHeading}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-zinc-300">VÉQALUNE CIVIC</strong> — {t.nav.civicSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/report')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-zinc-300">VÉQALUNE AI</strong> — {t.nav.aiSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/map')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-zinc-300">VÉQALUNE MAP</strong> — {t.nav.mapSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-zinc-300">VÉQALUNE COMMAND</strong> — {t.nav.commandSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/reports')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-zinc-300">VÉQALUNE INSIGHT</strong> — {t.nav.insightSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/insights')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-zinc-300">VÉQALUNE PREDICT</strong> — {t.nav.predictSub}
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & AI */}
          <div>
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider mb-3">
              {t.landing.proposalMatrixTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {onOpenTechnicalDossier && (
                <li>
                  <button
                    onClick={() => onOpenTechnicalDossier('story')}
                    className="flex items-center gap-1.5 text-zinc-300 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    {t.footer.proposalLink}
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenDbModal}
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  {t.footer.dataModelLink}
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  Multimodal Gemini 3.7 Flash
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  PostGIS Spatial Clustering (ST_DWithin)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Civic Tech Ethics & Disclaimer Box */}
        <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-[11px] leading-relaxed text-zinc-400 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-300 font-semibold">{t.footer.ethicsNotice}:</strong>{' '}
            {t.footer.ethicsNoticeDesc}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
          <div>
            {t.footer.copyright}
          </div>
          <div className="flex items-center gap-4">
            <span>{t.footer.schoolPhase}</span>
            <span>•</span>
            {onOpenTechnicalDossier && (
              <button onClick={() => onOpenTechnicalDossier('story')} className="hover:text-zinc-300 underline cursor-pointer">
                {t.common.proposalStory}
              </button>
            )}
            <span>•</span>
            <button onClick={onOpenDbModal} className="hover:text-zinc-300 underline cursor-pointer">
              {t.common.viewDataModel}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
