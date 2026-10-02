import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Search,
  Layers,
  Flame,
  RefreshCw,
  MapPin,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Report, HotspotCluster, ReportCategory, SeverityLevel } from '../types';
import { CategoryIcon, getCategoryBadgeStyle } from '../components/CategoryIcon';
import { getSeverityBadgeColor } from '../utils/scoringEngine';
import { MapSidebarSkeleton } from '../components/Skeleton';
import { EmptyHotspots, EmptySearch } from '../components/EmptyState';
import { triggerDynamicHotspotScan } from '../services/api';
import supercluster from 'supercluster';

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
  const [currentZoom, setCurrentZoom] = useState<number>(14);

  // Initialize supercluster
  const clustersRef = useRef<supercluster.Cluster<any, any> | null>(null);

  useEffect(() => {
    const index = new supercluster({
      radius: 60,
      maxZoom: 16,
      minPoints: 3,
    });
    clustersRef.current = index;
  }, []);

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

  // Convert reports to GeoJSON for clustering
  const geoJsonPoints = React.useMemo(() => {
    return filteredReports.map((report) => ({
      type: 'Feature' as const,
      properties: {
        report,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [report.longitude, report.latitude],
      },
    }));
  }, [filteredReports]);

  // Get clusters based on current zoom
  const clusters = React.useMemo(() => {
    if (!clustersRef.current) return [];
    const index = clustersRef.current;
    index.load(geoJsonPoints);
    return index.getClusters([-180, -90, 180, 90], currentZoom);
  }, [geoJsonPoints, currentZoom]);

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

    const map = L.map(mapContainerRef.current, {
      center: [6.9271, 79.8612],
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd',
        className: 'dark-tiles', // Retain dark tiles css filter
      }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    const hotspotsLayer = L.layerGroup().addTo(map);

    // Update zoom state on zoom change
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

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
          { className: 'bg-white shadow-lg rounded-xl border border-slate-200 text-slate-800 text-xs px-3 py-2', permanent: false, direction: 'top' }
        );

        hotspotsLayer.addLayer(circle);

        // Center Pulsing Marker
        const centerIcon = L.divIcon({
          className: 'custom-hotspot-pin',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 22px; height: 22px; border-radius: 9999px; background-color: #ffffff; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; color: ${color}; font-size: 11px; font-weight: 800; box-shadow: 0 4px 12px ${color}44;">
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

    // 2. Render Clustered Markers
    clusters.forEach((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const isCluster = cluster.properties.cluster;
      const pointCount = cluster.properties.point_count || 1;
      const report = cluster.properties.report;

      if (isCluster) {
        // Render cluster marker
        const clusterSize = Math.min(24 + Math.log2(pointCount) * 8, 48);
        const clusterIcon = L.divIcon({
          className: 'custom-cluster-pin',
          html: `
            <div style="
              width: ${clusterSize}px;
              height: ${clusterSize}px;
              border-radius: 9999px;
              background-color: #10b981;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: 900;
              font-size: ${Math.max(10, clusterSize / 3)}px;
              cursor: pointer;
            ">
              ${pointCount}
            </div>
          `,
          iconSize: [clusterSize, clusterSize],
          iconAnchor: [clusterSize / 2, clusterSize / 2],
        });

        const marker = L.marker([lat, lng], { icon: clusterIcon });
        marker.on('click', () => {
          const expansionZoom = clustersRef.current?.getClusterExpansionZoom(cluster.properties.cluster_id);
          if (expansionZoom !== undefined) {
            map.flyTo([lat, lng], expansionZoom, { duration: 0.5 });
          }
        });
        marker.bindTooltip(
          `${pointCount} reports`,
          { className: 'bg-white shadow-lg rounded-xl border border-slate-200 text-slate-800 text-xs px-3 py-2', direction: 'top' }
        );
        markersLayer.addLayer(marker);
      } else if (report) {
        // Render individual report marker
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
              box-shadow: 0 4px 14px rgba(15,23,42,0.22);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
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

        const marker = L.marker([lat, lng], { icon: customIcon });

        marker.on('click', () => {
          setActiveReport(report);
          setActiveCluster(null);
        });

        marker.bindTooltip(
          `<strong>${report.title}</strong><br/>Score: ${report.priority_score}/100 • ${report.severity}`,
          { className: 'bg-white shadow-lg rounded-xl border border-slate-200 text-slate-800 text-xs px-3 py-2', direction: 'top' }
        );

        markersLayer.addLayer(marker);
      }
    });
  }, [clusters, hotspots, showHotspots, activeReport, activeCluster]);

  const categories: ReportCategory[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety'];
  const severities: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden">
      {/* Collapsible Left Intelligence Sidebar */}
      <div className="w-full md:w-96 bg-white/85 backdrop-blur-xl border-r border-slate-200/60 shadow-sm flex flex-col z-20 h-72 md:h-full shrink-0">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-500">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  VÉQALUNE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">MAP</span>
                </h2>
                <div className="text-[11px] text-slate-500 font-mono">Colombo Pilot • Dynamic Spatial Intelligence</div>
              </div>
            </div>
            <button
              onClick={handleRunGeospatialScan}
              disabled={isScanning}
              title="Run Dynamic Hotspot Detection Algorithm"
              className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center gap-2 text-xs font-mono transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{t.mapPage.runSpatialScan}</span>
            </button>
          </div>

          {/* Scan Toast Message */}
          {scanMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono leading-tight backdrop-blur-sm">
              {scanMessage}
            </div>
          )}

          {/* Tab Switch: Incidents vs Dynamic Hotspots */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-sm shadow-inner">
            <button
              onClick={() => setSidebarTab('incidents')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                sidebarTab === 'incidents'
                  ? 'bg-white text-emerald-600 border border-slate-200/60 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
              aria-pressed={sidebarTab === 'incidents'}
            >
              {t.mapPage.tabIncidents}
            </button>
            <button
              onClick={() => setSidebarTab('hotspots')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                sidebarTab === 'hotspots'
                  ? 'bg-white text-rose-500 border border-slate-200/60 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
              aria-pressed={sidebarTab === 'hotspots'}
            >
              {t.mapPage.tabHotspots}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.tablePage.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all shadow-sm"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-400 transition-all shadow-sm cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{formatCategory(c)}</option>
              ))}
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-400 transition-all shadow-sm cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              {severities.map((s) => (
                <option key={s} value={s}>{formatSeverity(s)}</option>
              ))}
            </select>
          </div>

          {/* Active Cluster Filter Indicator */}
          {activeCluster && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-sm shadow-sm">
              <span className="text-rose-700 font-mono text-xs truncate font-medium">
                Filtered: {activeCluster.name}
              </span>
              <button
                onClick={() => setActiveCluster(null)}
                className="text-rose-500 hover:text-rose-700 text-xs uppercase font-bold cursor-pointer transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {/* Hotspot Toggle */}
          <div className="flex items-center justify-between pt-1 text-sm">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none font-medium">
              <input
                type="checkbox"
                checked={showHotspots}
                onChange={(e) => setShowHotspots(e.target.checked)}
                className="rounded bg-white border-slate-300 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
              />
              <span>{t.mapPage.toggleHotspots}</span>
            </label>
            <span className="text-xs font-mono font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              {hotspots.length} Discovered
            </span>
          </div>
        </div>

        {/* Scrollable Content (Incidents List or Hotspots List) */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/30">
          {!reports || reports.length === 0 ? (
            <MapSidebarSkeleton />
          ) : sidebarTab === 'hotspots' ? (
            hotspots.length === 0 ? (
              <EmptyHotspots />
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
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 shadow-md'
                        : 'glass border-slate-200 hover:bg-white/90 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Flame className={`w-4 h-4 shrink-0 ${isSelected ? 'text-rose-500' : 'text-rose-400'}`} />
                          <span className="text-sm font-bold text-slate-800 line-clamp-1">
                            {hs.name}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-1.5 font-medium">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded mr-1">{hs.reportCount} {t.mapPage.incidentsCount}</span> • {formatCategory(hs.dominantCategory)}
                        </div>
                      </div>
                      <div className="text-right bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-sm font-mono font-extrabold text-rose-500">
                          {hs.riskScore}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block -mt-1">/100</span>
                      </div>
                    </div>

                    <p className="text-[13px] text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                      {hs.insightText}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>Radius: {hs.radiusMeters}m</span>
                      <span className="text-emerald-500 font-semibold">{t.mapPage.centerMap} →</span>
                    </div>
                  </div>
                );
              })
            )
          ) : filteredReports.length === 0 ? (
            <EmptySearch />
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
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-md'
                      : 'glass border-slate-200 hover:bg-white/90 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-lg border shadow-sm ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        <CategoryIcon category={report.category} size={14} />
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-100">
                        {report.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border shadow-sm ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
                      >
                        {formatSeverity(report.severity)}
                      </span>
                      <span className={`text-sm font-mono font-extrabold ${isSelected ? 'text-emerald-600' : 'text-emerald-500'}`}>
                        {report.priority_score}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {report.location_label}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 text-xs text-slate-500">
                    <span className="font-medium">AI Confidence: <strong className="text-slate-700 font-mono">{report.ai_confidence}%</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReport(report);
                      }}
                      className="text-emerald-500 hover:text-emerald-600 font-bold flex items-center gap-1 cursor-pointer transition-colors bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm hover:shadow"
                    >
                      <span>{t.mapPage.viewDetails}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 shadow-sm text-sm space-y-3 pointer-events-auto">
          <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
            Severity Legend
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm border border-white"></span>
              <span className="text-slate-700 font-medium">{formatSeverity('CRITICAL')} <span className="text-slate-400 font-mono text-[10px]">(85+)</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm border border-white"></span>
              <span className="text-slate-700 font-medium">{formatSeverity('HIGH')} <span className="text-slate-400 font-mono text-[10px]">(70-84)</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm border border-white"></span>
              <span className="text-slate-700 font-medium">{formatSeverity('MODERATE')} <span className="text-slate-400 font-mono text-[10px]">(50-69)</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border border-white"></span>
              <span className="text-slate-700 font-medium">{formatSeverity('LOW')} <span className="text-slate-400 font-mono text-[10px]">(&lt;50)</span></span>
            </div>
          </div>
        </div>

        {/* Selected Hotspot Cluster Drawer */}
        {activeCluster && !activeReport && (
          <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-96 z-20 glass-modal border border-rose-200/60 shadow-xl rounded-3xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-rose-500 font-bold uppercase flex items-center gap-1.5 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 w-fit">
                  <Flame className="w-3.5 h-3.5" />
                  Dynamic Hotspot Cluster
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {activeCluster.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCluster(null)}
                className="bg-white/80 text-slate-500 hover:text-slate-800 hover:bg-white border border-slate-200/60 shadow-sm p-1.5 text-sm cursor-pointer transition-colors rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 my-4 text-center">
              <div className="p-3 rounded-2xl bg-white border border-rose-100 shadow-sm">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">{t.mapPage.riskScore}</div>
                <div className="text-lg font-extrabold font-mono text-rose-500 mt-0.5">
                  {activeCluster.riskScore}<span className="text-xs text-rose-300">/100</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">{t.tablePage.colStatus}</div>
                <div className="text-lg font-extrabold font-mono text-emerald-500 mt-0.5">
                  {activeCluster.reportCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-sky-100 shadow-sm">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">{t.mapPage.radiusBuffer}</div>
                <div className="text-lg font-extrabold font-mono text-sky-500 mt-0.5">
                  {activeCluster.radiusMeters}<span className="text-xs text-sky-300">m</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-white/80 p-4 rounded-2xl border border-slate-200/60 mb-4 shadow-sm">
              {activeCluster.insightText}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-sm mb-4 space-y-1.5 shadow-inner">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500">{t.mapPage.systemicRecommendation}</div>
              <p className="text-slate-800 font-medium text-sm leading-snug">
                {activeCluster.recommendedIntervention}
              </p>
            </div>

            <button
              onClick={() => {
                setSidebarTab('incidents');
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-bold text-sm transition-all shadow-md shadow-rose-500/20 cursor-pointer"
            >
              Filter {activeCluster.reportCount} Reports in Sidebar
            </button>
          </div>
        )}

        {/* Selected Incident Drawer / Card */}
        {activeReport && (
          <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-96 z-20 glass-modal border border-emerald-200/60 shadow-xl rounded-3xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                  {activeReport.id} • {activeReport.location_label}
                </span>
                <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug mt-1">
                  {activeReport.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="bg-white/80 text-slate-500 hover:text-slate-800 hover:bg-white border border-slate-200/60 shadow-sm p-1.5 text-sm cursor-pointer transition-colors rounded-xl shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-sm text-center">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">{t.common.priorityScore}</div>
                <div className="text-xl font-extrabold font-mono text-emerald-500 mt-0.5">
                  {activeReport.priority_score}<span className="text-xs text-emerald-300">/100</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-sky-100 shadow-sm text-center">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">AI Confidence</div>
                <div className="text-xl font-extrabold font-mono text-sky-500 mt-0.5">
                  {activeReport.ai_confidence}<span className="text-xs text-sky-300">%</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed bg-white/80 p-4 rounded-2xl border border-slate-200/60 mb-4 shadow-sm">
              {activeReport.ai_analysis}
            </p>

            <button
              onClick={() => onSelectReport(activeReport)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              {t.mapPage.viewDetails}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
