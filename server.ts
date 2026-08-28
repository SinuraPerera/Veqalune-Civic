import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_SAMPLE_REPORTS, SAMPLE_HOTSPOTS, PREDICTIVE_SCENARIOS } from './src/data/sampleReports';
import { calculatePriorityScore } from './src/utils/scoringEngine';
import { detectDynamicHotspots, calculateHaversineDistanceMeters } from './src/utils/hotspotDetection';
import { Report, ReportCategory, SeverityLevel, RiskLevel, ReportStatus, HotspotCluster } from './src/types';

dotenv.config();

// In-memory reports store initialized with sample reports and dynamically clustered
let reportsStore: Report[] = [...INITIAL_SAMPLE_REPORTS];
const initialClusterResult = detectDynamicHotspots(reportsStore);
let hotspotsStore: HotspotCluster[] = initialClusterResult.hotspots.length > 0 ? initialClusterResult.hotspots : [...SAMPLE_HOTSPOTS];
reportsStore = initialClusterResult.taggedReports;

// Lazy/Safe Gemini AI initialization on server
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Gemini AI client:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON bodies with sufficient size for image uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Health Endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'VÉQALUNE CIVIC Intelligence Platform',
      version: '1.0.0-MVP',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      reportsCount: reportsStore.length,
    });
  });

  // GET /api/reports - Get all reports with optional filtering
  app.get('/api/reports', (req: Request, res: Response) => {
    const { category, severity, status, search } = req.query;
    let filtered = [...reportsStore];

    if (category && category !== 'ALL') {
      filtered = filtered.filter((r) => r.category === category);
    }
    if (severity && severity !== 'ALL') {
      filtered = filtered.filter((r) => r.severity === severity);
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location_label.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.hazard_tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({
      reports: filtered,
      total: filtered.length,
    });
  });

  // POST /api/reports - Save a newly analyzed report and dynamically evaluate geospatial clusters
  app.post('/api/reports', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.title || !body.category) {
      return res.status(400).json({ error: 'Missing required report fields' });
    }

    const reportLat = Number(body.latitude) || 6.9271;
    const reportLng = Number(body.longitude) || 79.8612;

    const newReport: Report = {
      id: `REP-${new Date().getFullYear()}-${String(reportsStore.length + 1).padStart(4, '0')}`,
      title: body.title,
      description: body.description || '',
      category: body.category,
      latitude: reportLat,
      longitude: reportLng,
      location_label: body.location_label || 'Colombo Pilot Community, Sector 4',
      image_url: body.image_url,
      severity: body.severity || 'MODERATE',
      environmental_risk: body.environmental_risk || 'MEDIUM',
      public_risk: body.public_risk || 'MEDIUM',
      priority_score: Number(body.priority_score) || 65,
      ai_confidence: Number(body.ai_confidence) || 92,
      ai_analysis: body.ai_analysis || 'AI evaluation completed with standard civic decision support parameters.',
      recommended_action: body.recommended_action || 'Inspect location and assign to appropriate department.',
      hazard_tags: Array.isArray(body.hazard_tags) ? body.hazard_tags : ['Community Report', body.category],
      detected_objects: Array.isArray(body.detected_objects) ? body.detected_objects : [],
      scoring_breakdown: body.scoring_breakdown || calculatePriorityScore({
        severity: body.severity || 'MODERATE',
        environmentalRisk: body.environmental_risk || 'MEDIUM',
        publicRisk: body.public_risk || 'MEDIUM',
        category: body.category,
      }),
      status: (body.status as ReportStatus) || 'New',
      created_at: new Date().toISOString(),
      estimated_resolution_time: body.estimated_resolution_time || '24-48 Hours',
      reporter_type: 'Citizen',
      is_demo: false,
    };

    // Track previous hotspot IDs and report counts
    const prevClusterIds = new Set(hotspotsStore.map((h) => h.id));
    const prevClusterCounts = new Map(hotspotsStore.map((h) => [h.id, h.reportCount]));

    // Add report to store
    reportsStore.unshift(newReport);

    // Re-run Geospatial Clustering Pipeline (Haversine 450m grouping -> Centroid -> Dominant Category -> Cluster Risk)
    const clusterResult = detectDynamicHotspots(reportsStore, { distanceThresholdMeters: 450, minReportsPerCluster: 2 });
    hotspotsStore = clusterResult.hotspots;
    reportsStore = clusterResult.taggedReports;

    // Locate matching cluster for the newly added report
    const matchedCluster = hotspotsStore.find((hs) => hs.reportIds?.includes(newReport.id));
    const isNewHotspotFormed = Boolean(matchedCluster && !prevClusterIds.has(matchedCluster.id) && matchedCluster.reportCount >= 3);
    const isHotspotExpanded = Boolean(matchedCluster && !isNewHotspotFormed && matchedCluster.reportCount > (prevClusterCounts.get(matchedCluster.id) || 0));

    // Get the updated instance of the report with tagged hotspot id
    const savedReport = reportsStore.find((r) => r.id === newReport.id) || newReport;

    res.status(201).json({
      report: savedReport,
      hotspots: hotspotsStore,
      matchedHotspot: matchedCluster || null,
      isNewHotspotFormed,
      isHotspotExpanded,
      message: isNewHotspotFormed
        ? `🚨 RECURRING HOTSPOT DETECTED: Clustered reports exceeded threshold! (${matchedCluster?.name})`
        : isHotspotExpanded
        ? `Report linked to spatial cluster (${matchedCluster?.reportCount} total incidents)`
        : 'Report saved to intelligence database',
    });
  });

  // PATCH /api/reports/:id/status - Update report status
  app.patch('/api/reports/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: ReportStatus[] = ['New', 'Under Review', 'Action Recommended', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const reportIndex = reportsStore.findIndex((r) => r.id === id);
    if (reportIndex === -1) {
      return res.status(404).json({ error: 'Report not found' });
    }

    reportsStore[reportIndex] = {
      ...reportsStore[reportIndex],
      status: status as ReportStatus,
      updated_at: new Date().toISOString(),
    };

    res.json({ report: reportsStore[reportIndex], message: 'Status updated' });
  });

  // POST /api/analyze - AI Analysis pipeline using Gemini or intelligent fallback
  app.post('/api/analyze', async (req: Request, res: Response) => {
    const { imageBase64, mimeType, description = '', category = 'Waste', locationLabel = '', latitude, longitude } = req.body;

    const ai = getGeminiClient();

    // Check proximity to existing hotspots using Haversine calculation
    let matchedHotspot: HotspotCluster | undefined;
    if (latitude && longitude) {
      const latNum = Number(latitude);
      const lngNum = Number(longitude);
      matchedHotspot = hotspotsStore.find((hs) => {
        const distance = calculateHaversineDistanceMeters(latNum, lngNum, hs.latitude, hs.longitude);
        return distance <= (hs.radiusMeters || 450);
      });
    }

    if (ai) {
      try {
        const prompt = `You are VÉQALUNE CIVIC, an advanced AI Community Intelligence & Civic Decision-Support Engine for smart cities and sustainable communities.
Analyze this civic issue report.
User Description: "${description}"
User-selected Category Hint: "${category}"
Location: "${locationLabel}"

Evaluate:
1. Exact Category: Must be one of ["Waste", "Road Damage", "Water", "Drainage", "Energy", "Public Safety", "Other"].
2. Confidence (integer 80-99).
3. Severity: Must be one of ["LOW", "MODERATE", "HIGH", "CRITICAL"].
4. Environmental Risk: Must be one of ["LOW", "MEDIUM", "HIGH", "CRITICAL"].
5. Public Risk: Must be one of ["LOW", "MEDIUM", "HIGH", "CRITICAL"].
6. Clear, objective AI explanation (2-3 concise sentences explaining the physical issue, environmental/safety impact, and context).
7. Actionable recommended municipal response (1-2 sentences).
8. 3 to 5 concise hazard tags.
9. 2 to 4 key detected visual/physical objects.
10. Estimated resolution timeframe (e.g., "4 Hours", "24 Hours", "3-5 Days").

Return JSON strictly adhering to schema.`;

        const contents: any = [];
        if (imageBase64 && mimeType) {
          contents.push({
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
                },
              },
              { text: prompt },
            ],
          });
        } else {
          contents.push({
            parts: [{ text: prompt }],
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  description: 'Category: Waste, Road Damage, Water, Drainage, Energy, Public Safety, Other',
                },
                aiConfidence: { type: Type.INTEGER, description: 'Confidence percentage (80-99)' },
                severity: { type: Type.STRING, description: 'LOW, MODERATE, HIGH, or CRITICAL' },
                environmentalRisk: { type: Type.STRING, description: 'LOW, MEDIUM, HIGH, or CRITICAL' },
                publicRisk: { type: Type.STRING, description: 'LOW, MEDIUM, HIGH, or CRITICAL' },
                aiExplanation: { type: Type.STRING, description: 'Concise civic analysis explanation' },
                recommendedAction: { type: Type.STRING, description: 'Recommended municipal intervention' },
                hazardTags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Key risk tags',
                },
                detectedObjects: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Detected physical elements',
                },
                estimatedResolutionTime: { type: Type.STRING, description: 'Estimated resolution timeframe' },
              },
              required: [
                'category',
                'aiConfidence',
                'severity',
                'environmentalRisk',
                'publicRisk',
                'aiExplanation',
                'recommendedAction',
                'hazardTags',
                'detectedObjects',
                'estimatedResolutionTime',
              ],
            },
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText.trim());

        const validSeverity: SeverityLevel = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(parsed.severity)
          ? parsed.severity
          : 'MODERATE';
        const validEnvRisk: RiskLevel = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(parsed.environmentalRisk)
          ? parsed.environmentalRisk
          : 'MEDIUM';
        const validPubRisk: RiskLevel = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(parsed.publicRisk)
          ? parsed.publicRisk
          : 'MEDIUM';
        const validCategory: ReportCategory = [
          'Waste',
          'Road Damage',
          'Water',
          'Drainage',
          'Energy',
          'Public Safety',
          'Other',
        ].includes(parsed.category)
          ? parsed.category
          : (category as ReportCategory);

        const scoring = calculatePriorityScore({
          severity: validSeverity,
          environmentalRisk: validEnvRisk,
          publicRisk: validPubRisk,
          category: validCategory,
          isHotspot: Boolean(matchedHotspot),
          locationSensitivity: 'High',
        });

        return res.json({
          category: validCategory,
          aiConfidence: parsed.aiConfidence || 94,
          severity: validSeverity,
          environmentalRisk: validEnvRisk,
          publicRisk: validPubRisk,
          priorityScore: scoring.totalScore,
          scoringBreakdown: scoring,
          aiExplanation: parsed.aiExplanation,
          recommendedAction: parsed.recommendedAction,
          hazardTags: parsed.hazardTags || ['Urban Report', validCategory],
          detectedObjects: parsed.detectedObjects || ['reported hazard'],
          estimatedResolutionTime: parsed.estimatedResolutionTime || '24 Hours',
          decisionSupportNote:
            'VÉQALUNE Decision-Support Framework: This score and classification are advisory AI outputs to prioritize municipal field inspection.',
          potentialHotspotMatch: matchedHotspot ? matchedHotspot.name : undefined,
          modelUsed: 'gemini-3.7-flash (Live)',
        });
      } catch (err: any) {
        console.warn('Gemini API call failed, using intelligent deterministic rule fallback:', err.message);
      }
    }

    // Heuristic deterministic fallback engine for seamless demo mode
    const lowerDesc = (description || '').toLowerCase();
    let detectedCategory: ReportCategory = (category as ReportCategory) || 'Waste';
    let severity: SeverityLevel = 'MODERATE';
    let envRisk: RiskLevel = 'MEDIUM';
    let pubRisk: RiskLevel = 'MEDIUM';
    let confidence = 94;
    let explanation = '';
    let action = '';
    let tags: string[] = [];
    let objects: string[] = [];
    let estTime = '24 Hours';

    if (detectedCategory === 'Waste' || lowerDesc.includes('dump') || lowerDesc.includes('trash') || lowerDesc.includes('garbage')) {
      detectedCategory = 'Waste';
      severity = lowerDesc.includes('chemical') || lowerDesc.includes('canal') || lowerDesc.includes('hazardous') ? 'CRITICAL' : 'HIGH';
      envRisk = 'HIGH';
      pubRisk = 'MEDIUM';
      confidence = 95;
      explanation = 'Visible accumulation of mixed waste and refuse detected near a public access route. Threatens stormwater runoff quality and local soil health if not cleared rapidly.';
      action = 'Dispatch municipal waste management vehicle and inspect perimeter for recurring illegal dumping.';
      tags = ['Illegal Dumping', 'Soil Impact', 'Sanitation', 'Vector Risk'];
      objects = ['mixed debris', 'plastic packaging', 'canister containers'];
      estTime = '12-24 Hours';
    } else if (detectedCategory === 'Road Damage' || lowerDesc.includes('pothole') || lowerDesc.includes('crack') || lowerDesc.includes('asphalt')) {
      detectedCategory = 'Road Damage';
      severity = lowerDesc.includes('school') || lowerDesc.includes('deep') || lowerDesc.includes('crater') ? 'HIGH' : 'MODERATE';
      envRisk = 'LOW';
      pubRisk = 'HIGH';
      confidence = 93;
      explanation = 'Severe surface asphalt degradation with fractured sub-base observed. Poses immediate vehicular suspension damage and cyclist safety risk.';
      action = 'Deploy rapid-curing asphalt cold patch and place temporary high-visibility warning markers.';
      tags = ['Pavement Hazard', 'Cyclist Safety', 'Traffic Disruption', 'Sub-base Failure'];
      objects = ['pothole crater', 'fractured asphalt', 'road marking'];
      estTime = '8-12 Hours';
    } else if (detectedCategory === 'Water' || lowerDesc.includes('leak') || lowerDesc.includes('burst') || lowerDesc.includes('pipe')) {
      detectedCategory = 'Water';
      severity = 'HIGH';
      envRisk = 'HIGH';
      pubRisk = 'MEDIUM';
      confidence = 96;
      explanation = 'Sub-surface water pressure anomaly causing active localized surface flooding. Continuous water loss risks eroding supporting soil substrate.';
      action = 'Dispatch water utility repair crew to isolate distribution segment and perform ultrasonic leak pinpointing.';
      tags = ['Potable Water Loss', 'Sub-grade Erosion', 'Erosion Risk', 'Utility Priority'];
      objects = ['surface water pooling', 'saturated pavement', 'curb line'];
      estTime = '6-12 Hours';
    } else if (detectedCategory === 'Drainage' || lowerDesc.includes('clog') || lowerDesc.includes('drain') || lowerDesc.includes('flood')) {
      detectedCategory = 'Drainage';
      severity = 'CRITICAL';
      envRisk = 'CRITICAL';
      pubRisk = 'HIGH';
      confidence = 97;
      explanation = 'Primary stormwater culvert and intake grating obstructed by debris and sediment. High vulnerability to localized flash flooding during upcoming rain events.';
      action = 'Deploy hydro-excavation desilting truck and clear grating screens before next rainfall cycle.';
      tags = ['Storm Drainage', 'Culvert Blockage', 'Flood Mitigation', 'Sediment Load'];
      objects = ['drain grate', 'sediment buildup', 'trapped debris'];
      estTime = '6 Hours';
    } else if (detectedCategory === 'Energy' || lowerDesc.includes('light') || lowerDesc.includes('dark') || lowerDesc.includes('power')) {
      detectedCategory = 'Energy';
      severity = 'MODERATE';
      envRisk = 'LOW';
      pubRisk = 'HIGH';
      confidence = 91;
      explanation = 'Outage of public illumination fixtures detected along pedestrian corridor, reducing visibility and elevating public safety vulnerability.';
      action = 'Schedule electrical maintenance technician to inspect photocell sensors and replace ballast/driver units.';
      tags = ['Lighting Outage', 'Pedestrian Corridor', 'Night Safety', 'Grid Maintenance'];
      objects = ['street luminaire', 'pole assembly', 'darkened sidewalk'];
      estTime = '48 Hours';
    } else {
      detectedCategory = 'Public Safety';
      severity = 'CRITICAL';
      envRisk = 'MEDIUM';
      pubRisk = 'CRITICAL';
      confidence = 96;
      explanation = 'Structural compromise detected on public infrastructure fixture. Creates high immediate hazard for pedestrians and commuters.';
      action = 'Erect safety perimeter barricades immediately and dispatch structural engineering assessment team.';
      tags = ['Public Safety', 'Structural Failure', 'Immediate Hazard', 'Emergency Action'];
      objects = ['damaged barrier', 'structural element', 'walkway'];
      estTime = '4 Hours';
    }

    const scoring = calculatePriorityScore({
      severity,
      environmentalRisk: envRisk,
      publicRisk: pubRisk,
      category: detectedCategory,
      isHotspot: Boolean(matchedHotspot),
      locationSensitivity: 'High',
    });

    res.json({
      category: detectedCategory,
      aiConfidence: confidence,
      severity,
      environmentalRisk: envRisk,
      publicRisk: pubRisk,
      priorityScore: scoring.totalScore,
      scoringBreakdown: scoring,
      aiExplanation: explanation,
      recommendedAction: action,
      hazardTags: tags,
      detectedObjects: objects,
      estimatedResolutionTime: estTime,
      decisionSupportNote:
        'VÉQALUNE Decision-Support Framework: This score and classification are advisory AI outputs to prioritize municipal field inspection.',
      potentialHotspotMatch: matchedHotspot ? matchedHotspot.name : undefined,
      modelUsed: 'VÉQALUNE Intelligence Rules Engine (Deterministic MVP Fallback)',
    });
  });

  // GET /api/hotspots - Get dynamically evaluated hotspot clusters
  app.get('/api/hotspots', (req: Request, res: Response) => {
    const clusterResult = detectDynamicHotspots(reportsStore);
    hotspotsStore = clusterResult.hotspots;
    res.json({
      hotspots: hotspotsStore,
      totalClusters: hotspotsStore.length,
      newlyDiscoveredCount: clusterResult.newlyDiscoveredCount,
    });
  });

  // POST /api/hotspots/scan - Trigger on-demand dynamic geospatial scan with pipeline telemetry
  app.post('/api/hotspots/scan', (req: Request, res: Response) => {
    const { distanceThreshold = 450 } = req.body;
    const startTime = Date.now();
    const clusterResult = detectDynamicHotspots(reportsStore, { distanceThresholdMeters: Number(distanceThreshold) });
    hotspotsStore = clusterResult.hotspots;
    reportsStore = clusterResult.taggedReports;
    const durationMs = Date.now() - startTime;

    res.json({
      status: 'success',
      scanSummary: {
        totalReportsScanned: reportsStore.length,
        clustersDiscovered: hotspotsStore.length,
        recurringHotspots: hotspotsStore.filter((h) => h.clusterStatus === 'recurring' || h.clusterStatus === 'critical_cluster').length,
        emergingClusters: hotspotsStore.filter((h) => h.clusterStatus === 'emerging').length,
        distanceThresholdMeters: distanceThreshold,
        executionTimeMs: durationMs,
      },
      hotspots: hotspotsStore,
    });
  });

  // GET /api/insights - Community intelligence metrics, hotspots, and predictive models
  app.get('/api/insights', (req: Request, res: Response) => {
    // Dynamic recalculation of hotspots across active reports
    const clusterResult = detectDynamicHotspots(reportsStore);
    hotspotsStore = clusterResult.hotspots;
    reportsStore = clusterResult.taggedReports;

    const total = reportsStore.length;
    const criticalCount = reportsStore.filter((r) => r.severity === 'CRITICAL' && r.status !== 'Resolved').length;
    const highCount = reportsStore.filter((r) => r.severity === 'HIGH' && r.status !== 'Resolved').length;
    const resolvedCount = reportsStore.filter((r) => r.status === 'Resolved').length;
    const activeCount = reportsStore.filter((r) => r.status !== 'Resolved').length;

    // Calculate Community Health Score: 100 - (critical * 3.5 + high * 1.5 + active * 0.4) + (resolved * 0.8)
    const rawHealth = 100 - criticalCount * 3.5 - highCount * 1.5 - activeCount * 0.2 + resolvedCount * 0.5;
    const healthScore = Math.max(30, Math.min(98, Math.round(rawHealth)));

    const categoryBreakdown: Record<ReportCategory, number> = {
      Waste: reportsStore.filter((r) => r.category === 'Waste').length,
      'Road Damage': reportsStore.filter((r) => r.category === 'Road Damage').length,
      Water: reportsStore.filter((r) => r.category === 'Water').length,
      Drainage: reportsStore.filter((r) => r.category === 'Drainage').length,
      Energy: reportsStore.filter((r) => r.category === 'Energy').length,
      'Public Safety': reportsStore.filter((r) => r.category === 'Public Safety').length,
      Other: reportsStore.filter((r) => r.category === 'Other').length,
    };

    const priorityDistribution = {
      critical: reportsStore.filter((r) => r.priority_score >= 85).length,
      high: reportsStore.filter((r) => r.priority_score >= 70 && r.priority_score < 85).length,
      moderate: reportsStore.filter((r) => r.priority_score >= 50 && r.priority_score < 70).length,
      low: reportsStore.filter((r) => r.priority_score < 50).length,
    };

    // Synthesize top AI insight text dynamically based on the highest-risk active cluster
    const topCluster = hotspotsStore[0];
    const topInsightText = topCluster
      ? `${topCluster.reportCount} similar ${topCluster.dominantCategory.toLowerCase()} reports were clustered within ${topCluster.radiusMeters}m (${topCluster.name}), indicating a recurring hotspot that requires targeted municipal intervention.`
      : 'No critical spatial clusters currently active in this operational cycle.';

    res.json({
      metrics: {
        healthScore,
        criticalCount,
        highPriorityCount: highCount,
        activeReportsCount: activeCount,
        resolvedCount,
        totalReports: total,
        categoryBreakdown,
        priorityDistribution,
        hotspots: hotspotsStore,
      },
      hotspots: hotspotsStore,
      predictiveScenarios: PREDICTIVE_SCENARIOS,
      topAiInsight: topInsightText,
    });
  });

  // POST /api/generate-insights - Dynamic Gemini-powered intelligence briefing
  app.post('/api/generate-insights', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    const activeReportsSummary = reportsStore
      .slice(0, 10)
      .map((r) => `[${r.category}] ${r.title} at ${r.location_label} (Priority ${r.priority_score}/100, Status: ${r.status})`)
      .join('\n');

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `You are VÉQALUNE CIVIC, an AI Community Decision-Support Engine for Smart Cities & Sustainable Communities.
Analyze the following batch of active community incident reports:

${activeReportsSummary}

Generate a concise, professional civic intelligence synthesis:
1. Executive Summary (1-2 sentences identifying the primary systemic risk)
2. Spatial Hotspot Insight (1-2 sentences on geographic cluster vulnerability)
3. Top 3 Prioritized Strategic Interventions
4. 1 Predictive Prevention Opportunity (how to prevent recurrence before next cycle)

Keep tone objective, authoritative, and actionable. Return in structured JSON.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                executiveSummary: { type: Type.STRING },
                spatialHotspotInsight: { type: Type.STRING },
                strategicInterventions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                predictiveOpportunity: { type: Type.STRING },
              },
              required: [
                'executiveSummary',
                'spatialHotspotInsight',
                'strategicInterventions',
                'predictiveOpportunity',
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({
          insight: parsed,
          generatedAt: new Date().toISOString(),
          source: 'gemini-3.7-flash (Live Synthesis)',
        });
      } catch (err: any) {
        console.warn('Gemini insight generation failed, using fallback:', err.message);
      }
    }

    // Default synthesis fallback
    res.json({
      insight: {
        executiveSummary:
          'Community infrastructure load is currently elevated by drainage obstructions in the Lowland Basin and concentrated construction dumping along Sector 4 green corridors.',
        spatialHotspotInsight:
          'Spatial clustering demonstrates an acute vulnerability in Sector 4 Canal Lane, where repeated unpermitted waste dumping correlates with lack of evening illumination.',
        strategicInterventions: [
          'Pre-emptively desilt South Creek storm culverts before the 48-hour precipitation window.',
          'Install rapid-deploy solar mobile surveillance at Sector 4 Canal Access point.',
          'Dispatch cold-mix patch crew to Market & 4th Avenue school crossing before morning peak.',
        ],
        predictiveOpportunity:
          'Combining localized rainfall telemetry with hydraulic culvert siltation trends indicates a 88% probability of localized flash flooding if culvert screens are not cleared within 36 hours.',
      },
      generatedAt: new Date().toISOString(),
      source: 'VÉQALUNE Civic Rules Synthesis Engine (Fallback)',
    });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VÉQALUNE CIVIC Intelligence Platform running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting VÉQALUNE CIVIC server:', err);
});
