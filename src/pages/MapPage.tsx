import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Flame,
  Filter,
  Search,
  ChevronRight,
  Sparkles,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { Report, HotspotCluster, ReportCategory, SeverityLevel, ReportStatus } from '../types';
import { CategoryIcon, getCategoryBadgeStyle } from '../components/CategoryIcon';
import { getSeverityBadgeColor } from '../utils/scoringEngine';
import { triggerDynamicHotspotScan } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  reports: Report[];
  hotspots: HotspotCluster[];
  onSelectReport: (report: Report) => void;
  onHotspotsUpdated?: (hotspots: HotspotCluster[]) => void;
}

export const MapPage: React.FC<Props> = ({
  reports,
  hotspots,
  onSelectReport,
  onHotspotsUpdated,
}) => {
  const { t, formatCategory, formatSeverity, formatStatus } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [activeCluster, setActiveCluster] = useState<HotspotCluster | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'incidents' | 'hotspots'>('incidents');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleRunGeospatialScan = async () => {
    setIsScanning(true);
    setScanMessage(null);
    try {
      const res = await triggerDynamicHotspotScan(450);
      if (onHotspotsUpdated && res.hotspots) {
        onHotspotsUpdated(res.hotspots);
      }
      setScanMessage(
        `Dynamic scan complete: ${res.scanSummary.clustersDiscovered} clusters (${res.scanSummary.recurringHotspots} recurring) detected across ${res.scanSummary.totalReportsScanned} reports in ${res.scanSummary.executionTimeMs}ms.`
      );
    } catch (err: any) {
      setScanMessage(`Scan error: ${err.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    if (selectedSeverity !== 'ALL' && r.severity !== selectedSeverity) return false;
    if (activeCluster) {
      const dist = calculateDistance(activeCluster.latitude, activeCluster.longitude, r.latitude, r.longitude);
      if (dist > activeCluster.radiusMeters + 50) return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        r.title.toLowerCase().includes(q) ||
        r.location_label.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Haversine distance helper
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Dark styled OSM tile layer
    const map = L.map(mapContainerRef.current, {
      center: [6.9271, 79.8612],
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // CartoDB Dark Matter tiles
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    const hotspotsLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    hotspotsLayerRef.current = hotspotsLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Hotspots
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const hotspotsLayer = hotspotsLayerRef.current;

    if (!map || !markersLayer || !hotspotsLayer) return;

    markersLayer.clearLayers();
    hotspotsLayer.clearLayers();

    // 1. Render Hotspot Buffer Polygons / Circles
    if (showHotspots) {
      hotspots.forEach((hs) => {
        const isClusterSelected = activeCluster?.id === hs.id;
        const color = hs.clusterStatus === 'critical_cluster' ? '#f43f5e' : '#fb923c';

        // Outer Buffer Circle
        const circle = L.circle([hs.latitude, hs.longitude], {
          radius: hs.radiusMeters,
          color: color,
          weight: isClusterSelected ? 3 : 1.5,
          opacity: 0.8,
          fillColor: color,
          fillOpacity: isClusterSelected ? 0.25 : 0.12,
          dashArray: hs.clusterStatus === 'recurring' ? '4, 6' : undefined,
        });

        circle.on('click', () => {
          setActiveCluster(hs);
          setActiveReport(null);
          setSidebarTab('hotspots');
          map.flyTo([hs.latitude, hs.longitude], 15.5, { duration: 0.8 });
        });

        circle.bindTooltip(
          `<strong>🔥 ${hs.name}</strong><br/>${hs.reportCount} incidents | Risk: ${hs.riskScore}/100`,
          { className: 'leaflet-custom-tooltip', permanent: false, direction: 'top' }
        );

        hotspotsLayer.addLayer(circle);

        // Center Pulsing Marker
        const centerIcon = L.divIcon({
          className: 'custom-hotspot-pin',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 22px; height: 22px; border-radius: 9999px; background-color: #09090b; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; color: ${color}; font-size: 11px; font-weight: 800; box-shadow: 0 0 12px ${color}88;">
                ${hs.reportCount}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const hotspotMarker = L.marker([hs.latitude, hs.longitude], { icon: centerIcon });
        hotspotMarker.on('click', () => {
          setActiveCluster(hs);
          setActiveReport(null);
          setSidebarTab('hotspots');
        });
        hotspotsLayer.addLayer(hotspotMarker);
      });
    }

    // 2. Render Individual Incident Markers
    filteredReports.forEach((report) => {
      const isSelected = activeReport?.id === report.id;
      let markerColor = '#10b981'; // LOW
      if (report.severity === 'CRITICAL') markerColor = '#f43f5e';
      else if (report.severity === 'HIGH') markerColor = '#fb923c';
      else if (report.severity === 'MODERATE') markerColor = '#eab308';

      const customIcon = L.divIcon({
        className: 'custom-incident-pin',
        html: `
          <div style="
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            border-radius: 9999px;
            background-color: ${markerColor};
            border: 2px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #09090b;
            font-weight: 900;
            font-size: ${isSelected ? '12px' : '10px'};
            transition: all 0.2s ease;
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          ">
            ${report.priority_score}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: customIcon });

      marker.on('click', () => {
        setActiveReport(report);
        setActiveCluster(null);
      });

      marker.bindTooltip(
        `<strong>${report.title}</strong><br/>Score: ${report.priority_score}/100 • ${report.severity}`,
        { className: 'leaflet-custom-tooltip', direction: 'top' }
      );

      markersLayer.addLayer(marker);
    });
  }, [filteredReports, hotspots, showHotspots, activeReport, activeCluster]);

  const categories: ReportCategory[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety'];
  const severities: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden">
      {/* Collapsible Left Intelligence Sidebar */}
      <div className="w-full md:w-96 bg-zinc-950/95 backdrop-blur-md border-r border-zinc-800 flex flex-col z-20 h-72 md:h-full shrink-0 shadow-2xl">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  VÉQALUNE <span className="text-emerald-400">MAP</span>
                </h2>
                <div className="text-[10px] text-zinc-400 font-mono">Colombo Pilot • Dynamic Spatial Intelligence</div>
              </div>
            </div>
            <button
              onClick={handleRunGeospatialScan}
              disabled={isScanning}
              title="Run Dynamic Hotspot Detection Algorithm"
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-700/80 flex items-center gap-1 text-[11px] font-mono transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{t.mapPage.runSpatialScan}</span>
            </button>
          </div>

          {/* Scan Toast Message */}
          {scanMessage && (
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-mono leading-tight">
              {scanMessage}
            </div>
          )}

          {/* Tab Switch: Incidents vs Dynamic Hotspots */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <button
              onClick={() => {
                setSidebarTab('incidents');
                setActiveCluster(null);
              }}
              className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                sidebarTab === 'incidents'
                  ? 'bg-emerald-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.mapPage.tabIncidents} ({filteredReports.length})
            </button>
            <button
              onClick={() => setSidebarTab('hotspots')}
              className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                sidebarTab === 'hotspots'
                  ? 'bg-rose-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Flame className="w-3 h-3" />
              {t.mapPage.tabHotspots} ({hotspots.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.tablePage.searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{formatCategory(c)}</option>
              ))}
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Severities</option>
              {severities.map((s) => (
                <option key={s} value={s}>{formatSeverity(s)}</option>
              ))}
            </select>
          </div>

          {/* Active Cluster Filter Indicator */}
          {activeCluster && (
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800 flex items-center justify-between text-xs">
              <span className="text-rose-300 font-mono text-[11px] truncate">
                Filtered: {activeCluster.name}
              </span>
              <button
                onClick={() => setActiveCluster(null)}
                className="text-rose-400 hover:text-rose-200 text-[10px] uppercase font-bold underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Hotspot Toggle */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showHotspots}
                onChange={(e) => setShowHotspots(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span>{t.mapPage.toggleHotspots}</span>
            </label>
            <span className="text-[10px] font-mono text-rose-400">
              {hotspots.length} Discovered
            </span>
          </div>
        </div>

        {/* Scrollable Content (Incidents List or Hotspots List) */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2">
          {sidebarTab === 'hotspots' ? (
            hotspots.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400 space-y-2">
                <div>No recurring hotspots formed yet.</div>
                <p className="text-[11px] text-zinc-500">
                  Submit 2-3 reports within 450m of each other to watch VÉQALUNE discover a new hotspot in real time!
                </p>
              </div>
            ) : (
              hotspots.map((hs) => {
                const isSelected = activeCluster?.id === hs.id;
                return (
                  <div
                    key={hs.id}
                    onClick={() => {
                      setActiveCluster(hs);
                      setActiveReport(null);
                      mapInstanceRef.current?.flyTo([hs.latitude, hs.longitude], 15.5, {
                        duration: 0.8,
                      });
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-600 shadow-md shadow-rose-950/30'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="text-xs font-bold text-zinc-100 line-clamp-1">
                            {hs.name}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                          {hs.reportCount} {t.mapPage.incidentsCount} • {formatCategory(hs.dominantCategory)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-rose-400">
                          {hs.riskScore}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">/100</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-300 line-clamp-2 mt-2 leading-relaxed">
                      {hs.insightText}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>Radius: {hs.radiusMeters}m</span>
                      <span className="text-emerald-400 font-semibold">{t.mapPage.centerMap} →</span>
                    </div>
                  </div>
                );
              })
            )
          ) : filteredReports.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-400 space-y-1">
              <div>{t.mapPage.noReportsFound}</div>
              <p className="text-[11px] text-zinc-500">Try adjusting your category or severity filters.</p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isSelected = activeReport?.id === report.id;
              const catStyle = getCategoryBadgeStyle(report.category);
              const sevStyle = getSeverityBadgeColor(report.severity);

              return (
                <div
                  key={report.id}
                  onClick={() => {
                    setActiveReport(report);
                    mapInstanceRef.current?.flyTo([report.latitude, report.longitude], 16, {
                      duration: 0.8,
                    });
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-zinc-900 border-emerald-500 shadow-md shadow-emerald-950/40'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`p-1 rounded-md border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        <CategoryIcon category={report.category} size={12} />
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400 font-semibold">
                        {report.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
                      >
                        {formatSeverity(report.severity)}
                      </span>
                      <span className="text-xs font-mono font-extrabold text-emerald-400">
                        {report.priority_score}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 line-clamp-1">
                      {report.title}
                    </h3>
                    <p className="text-[10px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                      {report.location_label}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[10px] text-zinc-400">
                    <span>AI Confidence: <strong className="text-zinc-300 font-mono">{report.ai_confidence}%</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReport(report);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{t.mapPage.viewDetails}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Leaflet Map Stage */}
      <div className="relative flex-1 h-full">
        <div ref={mapContainerRef} className="w-full h-full"></div>

        {/* Map Legend Overlay */}
        <div className="absolute top-4 right-4 z-20 bg-zinc-950/85 backdrop-blur-md border border-zinc-800 p-3 rounded-xl shadow-xl text-xs space-y-2 pointer-events-auto">
          <div className="font-bold text-[11px] text-zinc-300 uppercase tracking-wider">
            Severity Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-zinc-300">{formatSeverity('CRITICAL')} (85+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-zinc-300">{formatSeverity('HIGH')} (70-84)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="text-zinc-300">{formatSeverity('MODERATE')} (50-69)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-zinc-300">{formatSeverity('LOW')} (&lt;50)</span>
            </div>
          </div>
        </div>

        {/* Selected Hotspot Cluster Drawer */}
        {activeCluster && !activeReport && (
          <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-96 z-20 bg-zinc-950/95 backdrop-blur-md border border-rose-700/80 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Dynamic Hotspot Cluster
                </span>
                <h3 className="text-sm font-extrabold text-zinc-100">
                  {activeCluster.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCluster(null)}
                className="text-zinc-400 hover:text-zinc-200 p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 my-2.5 text-center">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] text-zinc-400">{t.mapPage.riskScore}</div>
                <div className="text-base font-extrabold font-mono text-rose-400">
                  {activeCluster.riskScore}/100
                </div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] text-zinc-400">{t.tablePage.colStatus}</div>
                <div className="text-base font-extrabold font-mono text-emerald-400">
                  {activeCluster.reportCount}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] text-zinc-400">{t.mapPage.radiusBuffer}</div>
                <div className="text-base font-extrabold font-mono text-sky-400">
                  {activeCluster.radiusMeters}m
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/70 p-2.5 rounded-lg border border-zinc-800/80 mb-2">
              {activeCluster.insightText}
            </p>

            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs mb-3 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-400">{t.mapPage.systemicRecommendation}</div>
              <p className="text-zinc-200 font-medium text-[11px]">
                {activeCluster.recommendedIntervention}
              </p>
            </div>

            <button
              onClick={() => {
                setSidebarTab('incidents');
              }}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-all border border-zinc-700 cursor-pointer"
            >
              Filter {activeCluster.reportCount} Reports in Sidebar
            </button>
          </div>
        )}

        {/* Selected Incident Drawer / Card */}
        {activeReport && (
          <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-96 z-20 bg-zinc-950/95 backdrop-blur-md border border-zinc-700/80 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {activeReport.id} • {activeReport.location_label}
                </span>
                <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">
                  {activeReport.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="text-zinc-400 hover:text-zinc-200 p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2.5">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                <div className="text-[10px] text-zinc-400">{t.common.priorityScore}</div>
                <div className="text-lg font-extrabold font-mono text-emerald-400">
                  {activeReport.priority_score}/100
                </div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                <div className="text-[10px] text-zinc-400">AI Confidence</div>
                <div className="text-lg font-extrabold font-mono text-sky-400">
                  {activeReport.ai_confidence}%
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80 mb-3">
              {activeReport.ai_analysis}
            </p>

            <button
              onClick={() => onSelectReport(activeReport)}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.mapPage.viewDetails}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
