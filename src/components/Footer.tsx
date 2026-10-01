import React from 'react';
import { ShieldAlert, Cpu, Database, Globe, Award, FileText } from 'lucide-react';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';

interface Props {
  onNavigate: (path: string) => void;
  onOpenDbModal: () => void;
  onOpenTechnicalDossier?: (tab?: any) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenDbModal, onOpenTechnicalDossier }) => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-xl text-slate-500 text-xs py-10 mt-20 shadow-[0_-1px_20px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                <img src="/logo.png?v=2" alt="" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-sm text-slate-800 tracking-wider">
                VÉQALUNE <span className="text-emerald-500">CIVIC</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs max-w-md leading-relaxed">
              {t.footer.mission}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded glass-pill text-[11px] text-slate-600 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {t.footer.schoolPhase}
              </span>
              {onOpenTechnicalDossier && (
                <button
                  onClick={() => onOpenTechnicalDossier('story')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 font-mono font-bold transition-colors cursor-pointer"
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
            <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-3">
              {t.landing.suiteHeading}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-slate-700">VÉQALUNE CIVIC</strong> — {t.nav.civicSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/report')}
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-slate-700">VÉQALUNE AI</strong> — {t.nav.aiSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/map')}
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-slate-700">VÉQALUNE MAP</strong> — {t.nav.mapSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-slate-700">VÉQALUNE COMMAND</strong> — {t.nav.commandSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/reports')}
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-slate-700">VÉQALUNE INSIGHT</strong> — {t.nav.insightSub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/insights')}
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-slate-700">VÉQALUNE PREDICT</strong> — {t.nav.predictSub}
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & AI */}
          <div>
            <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-3">
              {t.landing.proposalMatrixTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {onOpenTechnicalDossier && (
                <li>
                  <button
                    onClick={() => onOpenTechnicalDossier('story')}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-500 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    {t.footer.proposalLink}
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenDbModal}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  {t.footer.dataModelLink}
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Cpu className="w-3.5 h-3.5 text-sky-500" />
                  Multimodal Gemini 3.7 Flash
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Globe className="w-3.5 h-3.5 text-violet-500" />
                  PostGIS Spatial Clustering (ST_DWithin)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Civic Tech Ethics & Disclaimer Box */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] leading-relaxed text-amber-800 mb-6 flex items-start gap-3 backdrop-blur-sm">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-900 font-semibold">{t.footer.ethicsNotice}:</strong>{' '}
            {t.footer.ethicsNoticeDesc}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            {t.footer.copyright}
          </div>
          <div className="flex items-center gap-4">
            <span>{t.footer.schoolPhase}</span>
            <span>•</span>
            {onOpenTechnicalDossier && (
              <button onClick={() => onOpenTechnicalDossier('story')} className="hover:text-slate-600 underline cursor-pointer">
                {t.common.proposalStory}
              </button>
            )}
            <span>•</span>
            <button onClick={onOpenDbModal} className="hover:text-slate-600 underline cursor-pointer">
              {t.common.viewDataModel}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
