export type ReportCategory =
  | 'Waste'
  | 'Road Damage'
  | 'Water'
  | 'Drainage'
  | 'Energy'
  | 'Public Safety'
  | 'Other';

export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReportStatus = 'New' | 'Under Review' | 'Action Recommended' | 'Resolved';

export interface PriorityBreakdown {
  severityWeight: number; // e.g. 0-30
  environmentalWeight: number; // e.g. 0-25
  publicSafetyWeight: number; // e.g. 0-25
  locationSensitivityWeight: number; // e.g. 0-10
  recurrenceWeight: number; // e.g. 0-10
  totalScore: number; // 0-100
}

export interface Report {
  id: string;
  user_id?: string;
  title: string;
  image_url?: string;
  description: string;
  category: ReportCategory;
  latitude: number;
  longitude: number;
  location_label: string;
  severity: SeverityLevel;
  environmental_risk: RiskLevel;
  public_risk: RiskLevel;
  priority_score: number;
  ai_confidence: number;
  ai_analysis: string;
  recommended_action: string;
  hazard_tags: string[];
  detected_objects?: string[];
  scoring_breakdown: PriorityBreakdown;
  status: ReportStatus;
  created_at: string;
  updated_at?: string;
  estimated_resolution_time?: string;
  is_hotspot?: boolean;
  hotspot_cluster_id?: string;
  reporter_type?: 'Citizen' | 'Field Inspector' | 'Automated Sensor';
  is_demo?: boolean;
}

export interface HotspotCluster {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  reportCount: number;
  dominantCategory: ReportCategory;
  riskScore: number;
  insightText: string;
  recommendedIntervention: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  reportIds?: string[];
  clusterStatus?: 'emerging' | 'recurring' | 'critical_cluster';
  categoryBreakdown?: Partial<Record<ReportCategory, number>>;
  lastReportDate?: string;
  isNewlyDiscovered?: boolean;
}

export interface CommunityMetrics {
  healthScore: number; // 0-100
  criticalCount: number;
  highPriorityCount: number;
  activeReportsCount: number;
  resolvedCount: number;
  totalReports: number;
  categoryBreakdown: Record<ReportCategory, number>;
  priorityDistribution: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
  };
  hotspots: HotspotCluster[];
}

export interface PredictiveScenario {
  id: string;
  zone: string;
  emergingRiskType: string;
  riskCategory: ReportCategory;
  probability: number; // percentage
  forecastHorizon: string; // e.g. "Next 7-14 Days"
  primaryFactors: string[];
  potentialImpact: string;
  proactiveAction: string;
  confidenceScore: number;
}

export interface AnalysisRequestPayload {
  imageBase64?: string;
  mimeType?: string;
  imageUrl?: string;
  description: string;
  category?: ReportCategory;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
}

export interface AnalysisResponseData {
  category: ReportCategory;
  aiConfidence: number;
  severity: SeverityLevel;
  environmentalRisk: RiskLevel;
  publicRisk: RiskLevel;
  priorityScore: number;
  scoringBreakdown: PriorityBreakdown;
  aiExplanation: string;
  recommendedAction: string;
  hazardTags: string[];
  detectedObjects: string[];
  estimatedResolutionTime: string;
  decisionSupportNote: string;
  potentialHotspotMatch?: string;
}
