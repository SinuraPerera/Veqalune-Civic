import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Flame,
  CloudRain,
  RefreshCw,
  BrainCircuit,
  Calendar,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { HotspotCluster, PredictiveScenario } from '../types';
import { generateAIInsights, triggerDynamicHotspotScan } from '../services/api';
import { CategoryIcon, getCategoryBadgeStyle } from '../components/CategoryIcon';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  hotspots: HotspotCluster[];
  scenarios: PredictiveScenario[];
  onNavigate: (path: string) => void;
  onHotspotsUpdated?: (hotspots: HotspotCluster[]) => void;
}

export const InsightsPage: React.FC<Props> = ({
  hotspots,
  scenarios,
  onNavigate,
  onHotspotsUpdated,
}) => {
  const { t, formatCategory } = useLanguage();
  const [activeWeatherParam, setActiveWeatherParam] = useState<'low' | 'moderate' | 'heavy'>('heavy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customAiBriefing, setCustomAiBriefing] = useState<string | null>(null);
  const [briefingError, setBriefingError] = useState<string | null>(null);

  const [isScanningHotspots, setIsScanningHotspots] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);

  const handleScanHotspots = async () => {
    setIsScanningHotspots(true);
    setScanStatusMessage(null);
    try {
      const res = await triggerDynamicHotspotScan(450);
      if (onHotspotsUpdated && res.hotspots) {
        onHotspotsUpdated(res.hotspots);
      }
      setScanStatusMessage(
        `Dynamic scan complete: ${res.scanSummary.clustersDiscovered} clusters (${res.scanSummary.recurringHotspots} recurring) detected across ${res.scanSummary.totalReportsScanned} reports in ${res.scanSummary.executionTimeMs}ms.`
      );
    } catch (err: any) {
      setScanStatusMessage(`Scan error: ${err.message}`);
    } finally {
      setIsScanningHotspots(false);
    }
  };

  const handleGenerateBriefing = async () => {
    setIsGenerating(true);
    setBriefingError(null);
    try {
      const res = await generateAIInsights('Colombo Pilot Community (Sector 4)');
      setCustomAiBriefing(res.insightsText);
    } catch (err: any) {
      setBriefingError(err.message || 'Unable to contact AI inference service. Please check network or API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800">
              <BrainCircuit className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              {t.insightsPage.predictTag}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            {t.insightsPage.heading}
          </h1>
          <p className="text-xs text-zinc-400">
            {t.insightsPage.subheading}
          </p>
        </div>

        <button
          onClick={handleGenerateBriefing}
          disabled={isGenerating}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-zinc-100 text-xs font-bold shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? t.insightsPage.generatingBriefing : t.insightsPage.generateAiBriefing}</span>
        </button>
      </div>

      {briefingError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{briefingError}</span>
        </div>
      )}

      {/* AI Intelligence Briefing Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-950/30 border border-purple-900/50 shadow-2xl relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/80 text-xs font-mono text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            {t.insightsPage.aiBriefingTitle}
          </div>
          <span className="text-[11px] font-mono text-zinc-400">Multimodal Gemini 3.7 Flash</span>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800/80">
          {customAiBriefing || (
            <>
              <strong>Key Systemic Finding:</strong> Five similar waste-related reports were detected within the same area (Sector 4 Canal Walkway) during the last 14 days, indicating a recurring hotspot that may require a longer-term intervention.
              {'\n\n'}
              <strong>Drainage Vulnerability:</strong> The low-lying storm basin near South Intake has accumulated 80%+ debris blockage. Forecasted 35mm precipitation over the weekend creates an 85% probability of localized street flooding and basement water ingress.
              {'\n\n'}
              <strong>Recommended Interventions:</strong>
              {'\n'}• Dispatch Vac-Con hydro-excavator truck to South Intake basin prior to Friday 18:00.
              {'\n'}• Install motion-activated civic surveillance lighting along the Sector 4 canal access ramp to deter nocturnal construction dumping.
            </>
          )}
        </div>
      </div>

      {/* 3 PREDICTIVE SCENARIO CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t.insightsPage.weatherSimTitle}
            </h2>
            <p className="text-xs text-zinc-400">
              {t.insightsPage.weatherSimDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scenarios.map((sc) => {
            const category = sc.riskCategory || (sc as any).category || 'Public Safety';
            const probability = sc.probability ?? (sc as any).forecastedRiskProbability ?? 80;
            const title = sc.emergingRiskType || (sc as any).scenarioTitle || 'Emerging Civic Vulnerability';
            const proactiveAction = sc.proactiveAction || (sc as any).preventativeAction || 'Schedule municipal crew inspection.';
            const catStyle = getCategoryBadgeStyle(category);

            return (
              <div
                key={sc.id}
                className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      <CategoryIcon category={category} size={11} />
                      {formatCategory(category)}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        probability >= 85
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                      }`}
                    >
                      {probability}% {t.insightsPage.riskProbability}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-zinc-100 text-sm leading-snug">{title}</h3>
                    {sc.zone && (
                      <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-zinc-500" />
                        {sc.zone}
                      </div>
                    )}
                  </div>

                  {sc.potentialImpact && (
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/80">
                      {sc.potentialImpact}
                    </p>
                  )}

                  {sc.primaryFactors && sc.primaryFactors.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block">
                        {t.insightsPage.primaryVectors}:
                      </span>
                      <ul className="space-y-1">
                        {sc.primaryFactors.map((factor, i) => (
                          <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                  {sc.forecastHorizon && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {t.insightsPage.forecastHorizon}:
                      </span>
                      <span className="text-sky-300 font-mono text-xs font-semibold">{sc.forecastHorizon}</span>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                    <strong className="text-emerald-400 block text-[11px] uppercase tracking-wider mb-0.5 font-bold">
                      {t.insightsPage.proactiveMitigation}:
                    </strong>
                    <span className="text-zinc-300 text-xs leading-relaxed">
                      {proactiveAction}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RAINFALL & STORM DRAINAGE INTERACTIVE SIMULATOR */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-400" />
              {t.insightsPage.weatherSimTitle}
            </h3>
            <p className="text-xs text-zinc-400">
              {t.insightsPage.weatherSimDesc}
            </p>
          </div>

          {/* Weather Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveWeatherParam('low')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeWeatherParam === 'low'
                  ? 'bg-zinc-800 text-zinc-200'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.insightsPage.rainfallLow}
            </button>
            <button
              onClick={() => setActiveWeatherParam('moderate')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeWeatherParam === 'moderate'
                  ? 'bg-zinc-800 text-zinc-200'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.insightsPage.rainfallMod}
            </button>
            <button
              onClick={() => setActiveWeatherParam('heavy')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeWeatherParam === 'heavy'
                  ? 'bg-sky-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.insightsPage.rainfallHeavy}
            </button>
          </div>
        </div>

        {/* Live Simulation Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <div className="text-[11px] font-mono text-zinc-400 uppercase">South Intake Culvert</div>
            <div className="text-2xl font-mono font-extrabold text-rose-400">
              {activeWeatherParam === 'heavy' ? '92%' : activeWeatherParam === 'moderate' ? '64%' : '28%'}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {activeWeatherParam === 'heavy'
                ? 'CRITICAL overflow risk. Immediate pump pre-positioning recommended.'
                : 'Moderate runoff volume. Silt traps operating at nominal capacity.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Sector 4 Walkway Sump</div>
            <div className="text-2xl font-mono font-extrabold text-amber-400">
              {activeWeatherParam === 'heavy' ? '78%' : activeWeatherParam === 'moderate' ? '45%' : '15%'}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Debris retention causes localized pooling within 45 minutes of sustained rainfall.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Municipal Pump Readiness</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400">
              {activeWeatherParam === 'heavy' ? 'Standby' : 'Normal'}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pre-positioned with suction pumps ready for emergency drainage dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* HOTSPOTS INTERVENTION TABLE */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              {t.insightsPage.hotspotMatrixTitle}
            </h3>
            <p className="text-xs text-zinc-400">
              Clustered spatial intelligence identifying recurring civic pressure points across the pilot.
            </p>
          </div>

          <button
            onClick={handleScanHotspots}
            disabled={isScanningHotspots}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningHotspots ? 'animate-spin' : ''}`} />
            <span>{isScanningHotspots ? 'Running Haversine Scan...' : t.insightsPage.triggerScanBtn}</span>
          </button>
        </div>

        {scanStatusMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-mono">
            {scanStatusMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          {hotspots.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400 space-y-1">
              <p>No active hotspot clusters currently identified.</p>
              <p className="text-zinc-500 text-[11px]">Submit multiple reports in the same zone to observe automatic cluster formation.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase font-mono text-zinc-400 bg-zinc-950/80 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Cluster ID & Zone</th>
                  <th className="px-4 py-3">{t.tablePage.colCategory}</th>
                  <th className="px-4 py-3">Radius & Count</th>
                  <th className="px-4 py-3">Risk Index</th>
                  <th className="px-4 py-3">Recommended Intervention</th>
                  <th className="px-4 py-3 text-right">{t.tablePage.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {hotspots.map((hs) => (
                  <tr key={hs.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-zinc-200">{hs.name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-400" />
                          {hs.clusterStatus === 'critical_cluster'
                            ? 'CRITICAL CLUSTER'
                            : hs.clusterStatus === 'recurring'
                            ? 'RECURRING HOTSPOT'
                            : 'EMERGING CLUSTER'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 font-mono text-zinc-300 font-bold">
                        {formatCategory(hs.dominantCategory)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-300">
                      <div><strong className="text-emerald-400">{hs.reportCount}</strong> {t.mapPage.incidentsCount}</div>
                      <div className="text-[10px] text-zinc-500">Radius: {hs.radiusMeters}m</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-rose-400 text-sm">{hs.riskScore}</span>
                      <span className="text-zinc-600 font-mono">/100</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-300 font-medium max-w-xs">
                      {hs.recommendedIntervention}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onNavigate('/map')}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 font-mono text-xs font-semibold transition-all cursor-pointer"
                      >
                        {t.mapPage.centerMap}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
