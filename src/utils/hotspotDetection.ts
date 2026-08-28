import { Report, HotspotCluster, ReportCategory } from '../types';

/**
 * Calculates geodesic distance between two latitude/longitude points in meters using the Haversine formula.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface HotspotDetectionOptions {
  /** Distance threshold in meters to group reports into the same spatial cluster (default: 450m) */
  distanceThresholdMeters?: number;
  /** Minimum number of clustered reports required to form an emerging/active hotspot (default: 2) */
  minReportsPerCluster?: number;
}

/**
 * Algorithmic Dynamic Hotspot Detection Engine
 * Geospatial clustering pipeline:
 * Reports -> Distance Calculation (Haversine) -> Spatial Grouping -> Centroid & Bounding Radius -> Dominant Category -> Cluster Risk -> Hotspot Cluster
 */
export function detectDynamicHotspots(
  reports: Report[],
  options: HotspotDetectionOptions = {}
): {
  hotspots: HotspotCluster[];
  taggedReports: Report[];
  newlyDiscoveredCount: number;
} {
  const threshold = options.distanceThresholdMeters ?? 450;
  const minReports = options.minReportsPerCluster ?? 2;

  // Filter only active / non-dismissed reports (or include all valid reports with coordinates)
  const validReports = reports.filter(
    (r) => typeof r.latitude === 'number' && typeof r.longitude === 'number' && !isNaN(r.latitude) && !isNaN(r.longitude)
  );

  if (validReports.length === 0) {
    return { hotspots: [], taggedReports: reports, newlyDiscoveredCount: 0 };
  }

  const visited = new Set<string>();
  const rawClusters: Report[][] = [];

  // Density-based clustering (graph connectivity within threshold distance)
  for (let i = 0; i < validReports.length; i++) {
    const current = validReports[i];
    if (visited.has(current.id)) continue;

    const cluster: Report[] = [current];
    visited.add(current.id);

    const queue: Report[] = [current];

    while (queue.length > 0) {
      const node = queue.shift()!;
      for (let j = 0; j < validReports.length; j++) {
        const candidate = validReports[j];
        if (visited.has(candidate.id)) continue;

        const distance = calculateHaversineDistanceMeters(
          node.latitude,
          node.longitude,
          candidate.latitude,
          candidate.longitude
        );

        if (distance <= threshold) {
          visited.add(candidate.id);
          cluster.push(candidate);
          queue.push(candidate);
        }
      }
    }

    if (cluster.length >= minReports) {
      rawClusters.push(cluster);
    }
  }

  const hotspots: HotspotCluster[] = [];
  const reportToClusterMap = new Map<string, string>();

  // Process raw clusters into fully evaluated HotspotCluster objects
  rawClusters.forEach((clusterReports, index) => {
    const clusterId = `hotspot-cluster-${index + 1}`;
    const reportIds = clusterReports.map((r) => r.id);

    // 1. Centroid Calculation
    const totalLat = clusterReports.reduce((sum, r) => sum + r.latitude, 0);
    const totalLng = clusterReports.reduce((sum, r) => sum + r.longitude, 0);
    const centroidLat = totalLat / clusterReports.length;
    const centroidLng = totalLng / clusterReports.length;

    // 2. Bounding Radius Calculation (furthest report + 60m buffer, constrained between 250m and 550m)
    let maxDistance = 0;
    clusterReports.forEach((r) => {
      const d = calculateHaversineDistanceMeters(centroidLat, centroidLng, r.latitude, r.longitude);
      if (d > maxDistance) maxDistance = d;
    });
    const radiusMeters = Math.min(550, Math.max(250, Math.round(maxDistance + 60)));

    // 3. Category Frequency & Dominant Category
    const categoryCounts: Partial<Record<ReportCategory, number>> = {};
    clusterReports.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    let dominantCategory: ReportCategory = clusterReports[0].category;
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if ((count as number) > maxCount) {
        maxCount = count as number;
        dominantCategory = cat as ReportCategory;
      }
    });

    // 4. Cluster Risk Score Calculation
    // Base score = average priority score of member reports
    const avgPriority =
      clusterReports.reduce((sum, r) => sum + (r.priority_score || 50), 0) / clusterReports.length;
    // Volume bonus: +3 pts per report above 2 (up to +15)
    const volumeBonus = Math.min(15, (clusterReports.length - 2) * 3.5);
    // Critical hazard multiplier: +5 pts if any critical report is present
    const hasCritical = clusterReports.some((r) => r.severity === 'CRITICAL');
    const criticalBonus = hasCritical ? 6 : 0;

    const riskScore = Math.min(99, Math.round(avgPriority * 0.75 + volumeBonus + criticalBonus + 12));

    // 5. Cluster Status & Trend
    const clusterStatus: 'emerging' | 'recurring' | 'critical_cluster' =
      clusterReports.length >= 5 || riskScore >= 90
        ? 'critical_cluster'
        : clusterReports.length >= 3
        ? 'recurring'
        : 'emerging';

    const recentReports = clusterReports.filter((r) => {
      const reportTime = new Date(r.created_at).getTime();
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return !isNaN(reportTime) && reportTime >= sevenDaysAgo;
    });
    const trend: 'increasing' | 'stable' | 'decreasing' =
      recentReports.length >= clusterReports.length * 0.5 ? 'increasing' : 'stable';

    // 6. Cluster Name Formulation
    const clusterName = generateClusterName(clusterReports, dominantCategory, index + 1);

    // 7. Dynamic AI Insight & Recommended Intervention
    const insightText = generateClusterInsight(
      clusterReports.length,
      dominantCategory,
      radiusMeters,
      clusterName,
      clusterStatus
    );
    const recommendedIntervention = generateClusterIntervention(
      dominantCategory,
      clusterReports.length,
      riskScore
    );

    const hotspotObj: HotspotCluster = {
      id: clusterId,
      name: clusterName,
      latitude: Number(centroidLat.toFixed(5)),
      longitude: Number(centroidLng.toFixed(5)),
      radiusMeters,
      reportCount: clusterReports.length,
      dominantCategory,
      riskScore,
      insightText,
      recommendedIntervention,
      trend,
      reportIds,
      clusterStatus,
      categoryBreakdown: categoryCounts,
      lastReportDate: clusterReports[0]?.created_at || new Date().toISOString(),
      isNewlyDiscovered: clusterReports.length >= 3,
    };

    hotspots.push(hotspotObj);

    // Map report IDs to cluster
    reportIds.forEach((id) => {
      reportToClusterMap.set(id, clusterId);
    });
  });

  // Sort hotspots by risk score descending
  hotspots.sort((a, b) => b.riskScore - a.riskScore);

  // Update tagged reports
  const taggedReports = reports.map((r) => {
    const clusterId = reportToClusterMap.get(r.id);
    if (clusterId) {
      return {
        ...r,
        is_hotspot: true,
        hotspot_cluster_id: clusterId,
      };
    }
    return {
      ...r,
      is_hotspot: false,
      hotspot_cluster_id: undefined,
    };
  });

  return {
    hotspots,
    taggedReports,
    newlyDiscoveredCount: hotspots.filter((h) => h.clusterStatus !== 'emerging').length,
  };
}

/**
 * Synthesizes a clean, localized cluster name based on location labels and category.
 */
function generateClusterName(
  reports: Report[],
  dominantCategory: ReportCategory,
  clusterIndex: number
): string {
  // Try to find common location tokens in labels
  const locationLabels = reports.map((r) => r.location_label).filter(Boolean);

  if (locationLabels.length > 0) {
    const firstLabel = locationLabels[0];
    const cleanLabel = firstLabel.split(',')[0].trim();
    if (cleanLabel.length > 3 && cleanLabel.length < 35) {
      return `${cleanLabel} (${dominantCategory} Cluster)`;
    }
  }

  return `Spatial Cluster ${clusterIndex}: ${dominantCategory} Corridor`;
}

/**
 * Generates dynamic insight text based on calculated cluster characteristics.
 */
function generateClusterInsight(
  count: number,
  category: ReportCategory,
  radiusMeters: number,
  clusterName: string,
  status: 'emerging' | 'recurring' | 'critical_cluster'
): string {
  const prefix =
    status === 'critical_cluster'
      ? 'CRITICAL RECURRING HOTSPOT:'
      : status === 'recurring'
      ? 'RECURRING HOTSPOT DETECTED:'
      : 'EMERGING INCIDENT CLUSTER:';

  switch (category) {
    case 'Waste':
      return `${prefix} ${count} waste-related reports clustered within ${radiusMeters}m radius. Spatial pattern indicates persistent illegal dumping activity along access lanes requiring structural prevention.`;
    case 'Road Damage':
      return `${prefix} ${count} road and pavement degradation reports within ${radiusMeters}m. High vehicular transit volume and sub-base moisture stress are creating compounding pothole clusters.`;
    case 'Drainage':
      return `${prefix} ${count} drainage and culvert obstruction reports clustered within ${radiusMeters}m. Silt accumulation threatens stormwater overflow during upcoming rainfall events.`;
    case 'Water':
      return `${prefix} ${count} water line leakage observations within ${radiusMeters}m. Sub-surface pipeline pressure anomalies risk undermining pavement sub-base.`;
    case 'Energy':
      return `${prefix} ${count} lighting or power fixture anomalies within ${radiusMeters}m, causing localized darkness along primary pedestrian corridors.`;
    case 'Public Safety':
      return `${prefix} ${count} safety and infrastructure hazard reports within ${radiusMeters}m, requiring prioritized barrier reinforcement.`;
    default:
      return `${prefix} ${count} civic incidents clustered within ${radiusMeters}m radius, indicating a localized systemic recurrence pattern.`;
  }
}

/**
 * Generates actionable municipal intervention recommendation.
 */
function generateClusterIntervention(
  category: ReportCategory,
  count: number,
  riskScore: number
): string {
  switch (category) {
    case 'Waste':
      return count >= 4
        ? 'Deploy autonomous solar-powered CCTV surveillance unit, install heavy-duty vehicle restriction bollards, and schedule bi-weekly enforcement sweeps.'
        : 'Increase evening community vigilance patrols and deploy mobile waste compactor units.';
    case 'Road Damage':
      return riskScore > 85
        ? 'Dispatch road rehabilitation crew for full-depth asphalt mill-and-fill patching and regrade roadside storm runoffs.'
        : 'Execute emergency cold-mix patching and install high-visibility hazard warning signage.';
    case 'Drainage':
      return 'Deploy hydro-vacuum desilting equipment, clear intake screen debris, and reinforce retention basin grates before monsoon surge.';
    case 'Water':
      return 'Coordinate acoustic leak detection with water distribution utility and isolate sub-surface branch lines for joint replacement.';
    case 'Energy':
      return 'Inspect local microgrid distribution breaker boxes, replace faulty photocell drivers, and restore continuous corridor illumination.';
    case 'Public Safety':
      return 'Erect interlocking safety perimeter barricades immediately and dispatch municipal structural maintenance crew for anchor re-welding.';
    default:
      return 'Dispatch municipal rapid-response inspection unit to assess localized structural factors.';
  }
}
