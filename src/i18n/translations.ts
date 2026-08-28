import { Language } from './types';

export interface Translations {
  // Brand & Header
  brand: {
    name: string;
    tagline: string;
    ecosystem: string;
    pilotBadge: string;
    syntheticDataNotice: string;
  };

  // Navigation Items
  nav: {
    civic: string;
    civicSub: string;
    ai: string;
    aiSub: string;
    map: string;
    mapSub: string;
    command: string;
    commandSub: string;
    insight: string;
    insightSub: string;
    predict: string;
    predictSub: string;
    proposalDossier: string;
    proposalShort: string;
    launchAi: string;
    activeIncidents: string;
  };

  // Common UI terms
  common: {
    reportIssue: string;
    exploreIntelligence: string;
    viewOnMap: string;
    viewAllOnMap: string;
    viewDataModel: string;
    proposalStory: string;
    inspectEvidence: string;
    viewDdlSql: string;
    cancel: string;
    save: string;
    saving: string;
    close: string;
    search: string;
    filter: string;
    all: string;
    actions: string;
    status: string;
    severity: string;
    priorityScore: string;
    confidence: string;
    category: string;
    location: string;
    date: string;
    back: string;
    next: string;
    loading: string;
    refresh: string;
    download: string;
    exportCsv: string;
    exportJson: string;
    emergencyCallout: string;
    hours: string;
    days: string;
    meters: string;
    accuracy: string;
  };

  // Categories
  categories: {
    Waste: string;
    'Road Damage': string;
    Water: string;
    Drainage: string;
    Energy: string;
    'Public Safety': string;
    Other: string;
  };

  // Severities
  severities: {
    LOW: string;
    MODERATE: string;
    HIGH: string;
    CRITICAL: string;
  };

  // Statuses
  statuses: {
    New: string;
    'Under Review': string;
    'Action Recommended': string;
    Resolved: string;
  };

  // Landing Page
  landing: {
    heroTag: string;
    heroH1Part1: string;
    heroH1Gradient: string;
    heroH1Part2: string;
    heroDesc: string;
    pillMultimodal: string;
    pillPostgis: string;
    pillPredictive: string;
    metricsHealth: string;
    metricsHealthSub: string;
    metricsCritical: string;
    metricsCriticalSub: string;
    metricsHigh: string;
    metricsHighSub: string;
    metricsActive: string;
    metricsActiveSub: string;
    metricsResolved: string;
    metricsResolvedSub: string;

    // Proposal Spec Banner
    proposalTag: string;
    proposalHeading: string;
    proposalQuote: string;
    proposalMatrixTitle: string;
    proposalFullDossier: string;

    // Ecosystem Suite
    suiteTag: string;
    suiteHeading: string;
    suiteDesc: string;

    // 6-stage workflow
    workflowTag: string;
    workflowHeading: string;
    workflowDesc: string;
    stages: {
      s1Title: string;
      s1Sub: string;
      s1Desc: string;
      s2Title: string;
      s2Sub: string;
      s2Desc: string;
      s3Title: string;
      s3Sub: string;
      s3Desc: string;
      s4Title: string;
      s4Sub: string;
      s4Desc: string;
      s5Title: string;
      s5Sub: string;
      s5Desc: string;
      s6Title: string;
      s6Sub: string;
      s6Desc: string;
    };

    // 6 Focus Domains
    domainsTag: string;
    domainsHeading: string;
    domainsDesc: string;
    domains: {
      waste: { name: string; desc: string };
      road: { name: string; desc: string };
      water: { name: string; desc: string };
      drainage: { name: string; desc: string };
      energy: { name: string; desc: string };
      safety: { name: string; desc: string };
    };

    // Command Preview
    commandTag: string;
    commandHeading: string;
    commandDesc: string;
    commandFeature1: string;
    commandFeature2: string;
    commandFeature3: string;
    commandCta1: string;
    commandCta2: string;
    hotspotDetectedBadge: string;
    hotspotAiSynthesis: string;
    hotspotAiQuote: string;
    inspectClusterMap: string;

    // Bottom CTA
    bottomHeading: string;
    bottomDesc: string;
    bottomCtaAnalyze: string;
  };

  // Report Submission Page
  reportPage: {
    heading: string;
    subheading: string;
    step1Title: string;
    step1Desc: string;
    uploadBoxTitle: string;
    uploadBoxSubtitle: string;
    orUseCamera: string;
    removePhoto: string;
    step2Title: string;
    step2Desc: string;
    selectCategory: string;
    issueDescription: string;
    issueDescriptionPlaceholder: string;
    locationLabel: string;
    locationPlaceholder: string;
    detectGps: string;
    gpsActive: string;
    presetsTitle: string;
    presetsSubtitle: string;
    analyzeButton: string;
    analyzingButton: string;
    fillRequired: string;
    preset1Title: string;
    preset1Desc: string;
    preset2Title: string;
    preset2Desc: string;
    preset3Title: string;
    preset3Desc: string;
    preset4Title: string;
    preset4Desc: string;
  };

  // AI Analysis Results Page
  analysisPage: {
    analyzingTitle: string;
    analyzingSubtitle: string;
    resultBadge: string;
    resultHeading: string;
    resultSubheading: string;
    priorityScoreHeading: string;
    priorityScoreDesc: string;
    breakdownSeverity: string;
    breakdownEnv: string;
    breakdownSafety: string;
    breakdownLocation: string;
    breakdownRecurrence: string;
    aiVisionHeading: string;
    hazardTagsHeading: string;
    detectedObjectsHeading: string;
    recommendedActionHeading: string;
    dispatcherBrief: string;
    estimatedSla: string;
    hotspotNoticeHeading: string;
    hotspotNoticeDesc: string;
    saveToDbButton: string;
    savedSuccess: string;
    viewInTable: string;
    viewOnLiveMap: string;
  };

  // GIS Map Page
  mapPage: {
    heading: string;
    subheading: string;
    tabIncidents: string;
    tabHotspots: string;
    filterCategory: string;
    filterSeverity: string;
    filterStatus: string;
    toggleHotspots: string;
    runSpatialScan: string;
    scanning: string;
    hotspotsCount: string;
    incidentsCount: string;
    radiusBuffer: string;
    riskScore: string;
    dominantCategory: string;
    systemicRecommendation: string;
    noReportsFound: string;
    viewDetails: string;
    centerMap: string;
  };

  // Operations Dashboard Page
  dashboardPage: {
    cockpitTag: string;
    heading: string;
    subheading: string;
    districtHealth: string;
    criticalQueue: string;
    highQueue: string;
    activeTelemetry: string;
    resolvedActions: string;
    priorityQueueTitle: string;
    priorityQueueDesc: string;
    categoryBreakdownTitle: string;
    hotspotWarningTitle: string;
    hotspotWarningDesc: string;
    changeStatus: string;
    viewDetailsBtn: string;
    actionRequired: string;
    slaTurnaround: string;
  };

  // Insights / Predict Page
  insightsPage: {
    predictTag: string;
    heading: string;
    subheading: string;
    generateAiBriefing: string;
    generatingBriefing: string;
    aiBriefingTitle: string;
    weatherSimTitle: string;
    weatherSimDesc: string;
    rainfallLow: string;
    rainfallMod: string;
    rainfallHeavy: string;
    riskProbability: string;
    forecastHorizon: string;
    primaryVectors: string;
    potentialImpact: string;
    proactiveMitigation: string;
    hotspotMatrixTitle: string;
    triggerScanBtn: string;
  };

  // Reports Table Page
  tablePage: {
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    colId: string;
    colCategory: string;
    colTitle: string;
    colLocation: string;
    colSeverity: string;
    colScore: string;
    colStatus: string;
    colDate: string;
    colActions: string;
    showingReports: string;
  };

  // Dashboard shortcuts
  dashboard: {
    pageTag: string;
    pageHeading: string;
    pageDesc: string;
    aiInsightTitle: string;
    aiInsightQuote: string;
    priorityDistTitle: string;
    distCritical: string;
    distHigh: string;
    distModerate: string;
    distLow: string;
    categoryBreakdownTitle: string;
    recurringHotspotsTitle: string;
    recurringHotspotsDesc: string;
    viewMapClusters: string;
    prioritizedQueueTitle: string;
    prioritizedQueueDesc: string;
    viewFullTable: string;
  };

  // Analysis shortcuts
  analysis: {
    evaluatingTelemetry: string;
    processingEvidence: string;
    pipelineComplete: string;
    heading: string;
    newAnalysis: string;
    confidence: string;
    breakdownTitle: string;
    riskClass: string;
    envRisk: string;
    pubRisk: string;
    detectedTaxonomy: string;
    explanationTitle: string;
    recommendedActionTitle: string;
    similarHotspotMatch: string;
    hotspotMatchDesc: string;
    saveToLiveDatabase: string;
    savingToDatabase: string;
    reportSavedSuccess: string;
    viewLiveMap: string;
    commandCenter: string;
    saveToQueue: string;
  };

  // Footer
  footer: {
    mission: string;
    copyright: string;
    schoolPhase: string;
    dataModelLink: string;
    proposalLink: string;
    ethicsNotice: string;
    ethicsNoticeDesc: string;
    language: string;
  };
}

export const translations: Record<Language, Translations> = {
  // ==========================================
  // ENGLISH TRANSLATIONS
  // ==========================================
  en: {
    brand: {
      name: 'VÉQALUNE CIVIC',
      tagline: 'Intelligence for Better Communities',
      ecosystem: 'Ecosystem',
      pilotBadge: "CodeSplash '26 School Phase MVP",
      syntheticDataNotice: 'Colombo Pilot Community • Synthetic Demonstration Data',
    },
    nav: {
      civic: 'CIVIC',
      civicSub: 'Platform',
      ai: 'AI',
      aiSub: 'Vision & Reasoning',
      map: 'MAP',
      mapSub: 'GIS Intelligence',
      command: 'COMMAND',
      commandSub: 'Operations',
      insight: 'INSIGHT',
      insightSub: 'Patterns',
      predict: 'PREDICT',
      predictSub: 'Simulation',
      proposalDossier: 'Technical Proposal Dossier (60%)',
      proposalShort: 'Proposal Spec (60%)',
      launchAi: 'Launch VÉQALUNE AI',
      activeIncidents: 'Incidents',
    },
    common: {
      reportIssue: 'Report an Issue',
      exploreIntelligence: 'Explore Intelligence',
      viewOnMap: 'View on Map',
      viewAllOnMap: 'View All On Live Map',
      viewDataModel: 'View Data Model',
      proposalStory: 'Proposal Story (60%)',
      inspectEvidence: 'Inspect Evidence',
      viewDdlSql: 'View DDL SQL',
      cancel: 'Cancel',
      save: 'Save Report',
      saving: 'Saving to Database...',
      close: 'Close',
      search: 'Search...',
      filter: 'Filter',
      all: 'All',
      actions: 'Actions',
      status: 'Status',
      severity: 'Severity',
      priorityScore: 'Priority Score',
      confidence: 'AI Confidence',
      category: 'Category',
      location: 'Location',
      date: 'Date',
      back: 'Back',
      next: 'Next',
      loading: 'Loading...',
      refresh: 'Refresh',
      download: 'Download',
      exportCsv: 'Export CSV',
      exportJson: 'Export JSON',
      emergencyCallout: 'Emergency Callout',
      hours: 'hours',
      days: 'days',
      meters: 'm',
      accuracy: 'Accuracy',
    },
    categories: {
      Waste: 'Waste',
      'Road Damage': 'Road Damage',
      Water: 'Water',
      Drainage: 'Drainage',
      Energy: 'Energy',
      'Public Safety': 'Public Safety',
      Other: 'Other',
    },
    severities: {
      LOW: 'LOW',
      MODERATE: 'MODERATE',
      HIGH: 'HIGH',
      CRITICAL: 'CRITICAL',
    },
    statuses: {
      New: 'New',
      'Under Review': 'Under Review',
      'Action Recommended': 'Action Recommended',
      Resolved: 'Resolved',
    },
    landing: {
      heroTag: 'Colombo Pilot Community • Synthetic Demonstration Data',
      heroH1Part1: 'See the problem.',
      heroH1Gradient: 'Understand the pattern.',
      heroH1Part2: 'Improve the community.',
      heroDesc:
        'VÉQALUNE CIVIC transforms community observations into AI-powered intelligence for faster, smarter and more sustainable action.',
      pillMultimodal: 'Multimodal Vision AI',
      pillPostgis: 'PostGIS Hotspot Detection',
      pillPredictive: 'Predictive Risk Forecasting',
      metricsHealth: 'Community Health',
      metricsHealthSub: 'District Health Index',
      metricsCritical: 'Critical Issues',
      metricsCriticalSub: 'Immediate SLA',
      metricsHigh: 'High Priority',
      metricsHighSub: 'Under Review',
      metricsActive: 'Active Reports',
      metricsActiveSub: 'Telemetry Ingested',
      metricsResolved: 'Resolved',
      metricsResolvedSub: 'Mitigated Actions',

      proposalTag: 'THE CENTRAL PROPOSAL STORY • INNOVATION + RELEVANCE (60%)',
      proposalHeading: 'Transforming Scattered Complaints into Structured Civic Intelligence',
      proposalQuote:
        '"VÉQALUNE does not simply collect complaints. It transforms scattered community observations into structured, transparent and spatially connected intelligence that helps people identify what needs attention first."',
      proposalMatrixTitle: 'Technical Solution Guidelines Evidence Matrix',
      proposalFullDossier: 'Open Full Dossier (All 7 Specs)',

      suiteTag: 'The Unified Ecosystem',
      suiteHeading: 'Coherent Civic Intelligence Suite',
      suiteDesc:
        'Six purpose-built engines working in concert to transition municipal governance from reactive complaints to predictive decision support.',

      workflowTag: 'The Intelligence Architecture',
      workflowHeading: 'From Isolated Reports to Recurring Patterns',
      workflowDesc:
        'VÉQALUNE CIVIC transforms passive complaint intake into a 6-stage predictive decision-support system.',
      stages: {
        s1Title: 'SEE',
        s1Sub: 'Visual & Sensor Ingestion',
        s1Desc: 'Citizens and field agents capture raw photographs, sensor feeds, and geotagged observations across the district.',
        s2Title: 'UNDERSTAND',
        s2Sub: 'Multimodal AI Analysis',
        s2Desc: 'Gemini vision models inspect physical object taxonomy, verify hazard authenticity, and evaluate environmental & safety risks.',
        s3Title: 'PRIORITIZE',
        s3Sub: '0–100 Transparent Engine',
        s3Desc: 'Multi-factor decision-support scoring calculates priority based on severity, environmental impact, safety, and sensitivity.',
        s4Title: 'CONNECT',
        s4Sub: 'Spatial Hotspot Detection',
        s4Desc: 'PostGIS spatial clustering correlates isolated complaints into recurring geographic hotspots requiring systemic intervention.',
        s5Title: 'RECOMMEND',
        s5Sub: 'Actionable Dispatch Briefs',
        s5Desc: 'Generates structured municipal work orders, crew hazard precautions, and turnaround SLAs for field teams.',
        s6Title: 'PREDICT',
        s6Sub: 'Proactive Risk Forecasting',
        s6Desc: 'Simulates weather patterns and historical wear vectors to forecast drainage and pavement failures before they occur.',
      },

      domainsTag: 'Scope & Coverage',
      domainsHeading: '6 Critical Civic Infrastructure Focus Domains',
      domainsDesc:
        'Targeting urban environmental hazards and physical public asset failures where rapid decision support saves municipal resources and protects citizens.',
      domains: {
        waste: {
          name: 'Illegal Waste Dumping',
          desc: 'Debris clusters, hazardous materials, and nocturnal construction dumping along canal lanes.',
        },
        road: {
          name: 'Road & Pavement Damage',
          desc: 'Transverse asphalt potholes, sidewalk root heave, and cyclist lane fissures near school zones.',
        },
        water: {
          name: 'Water Leakage & Ruptures',
          desc: 'Potable water main fractures, sub-base erosion, and localized street flooding.',
        },
        drainage: {
          name: 'Blocked Storm Drainage',
          desc: 'Culvert grating clogs, canal siltation, and flood retention screen obstructions.',
        },
        energy: {
          name: 'Broken Streetlights',
          desc: 'Luminaire outages, dark corridor clusters, and pedestrian safety blindspots.',
        },
        safety: {
          name: 'Unsafe Public Infrastructure',
          desc: 'Missing sewer covers, sheared bridge railings, and exposed electrical switchgear.',
        },
      },

      commandTag: 'VÉQALUNE Command Center',
      commandHeading: 'Decision Support for Municipal Dispatchers & Field Crews',
      commandDesc:
        'Rather than an overwhelming pile of raw citizen complaints, municipal operators receive transparently prioritized work queues, live geospatial hotzones, and AI-synthesized root cause diagnoses.',
      commandFeature1: 'Real-time 0–100 Priority Scoring across environmental, safety & recurrence factors',
      commandFeature2: 'Automatic identification of 380m–500m recurrence hotspots to trigger systemic fixes',
      commandFeature3: 'Database-ready relational schema with PostGIS spatial query support',
      commandCta1: 'Launch Command Center',
      commandCta2: 'View VÉQALUNE Predict',
      hotspotDetectedBadge: 'Active Hotspot Detected',
      hotspotAiSynthesis: 'AI Synthesis',
      hotspotAiQuote:
        '"Five similar waste-related reports were detected within the same area during the last 14 days, indicating a recurring hotspot that may require a longer-term intervention."',
      inspectClusterMap: 'Inspect Cluster On Map',

      bottomHeading: 'Ready to test the civic intelligence pipeline?',
      bottomDesc:
        'Submit a sample photo or use one of our smart city scenario presets to experience real-time AI classification, 0-100 scoring, and action generation.',
      bottomCtaAnalyze: 'Analyze New Issue',
    },
    reportPage: {
      heading: 'Multimodal AI Ingestion & Inspection',
      subheading: 'Upload a geotagged civic issue or select a preset scenario for automated Gemini 3.7 vision classification and 0–100 multi-factor scoring.',
      step1Title: 'Step 1: Visual Evidence Ingestion',
      step1Desc: 'Upload a photograph or capture visual evidence of the physical municipal issue.',
      uploadBoxTitle: 'Click to upload or drag & drop photo',
      uploadBoxSubtitle: 'Supports JPG, PNG, WebP up to 10MB (EXIF telemetry auto-extracted)',
      orUseCamera: 'Use Camera Capture',
      removePhoto: 'Remove Photo',
      step2Title: 'Step 2: Observation Telemetry & Context',
      step2Desc: 'Provide district location label and brief observation notes.',
      selectCategory: 'Primary Category (Optional Pre-classification)',
      issueDescription: 'Issue Description & Observations',
      issueDescriptionPlaceholder: 'Describe the physical obstruction, extent of hazard, or public safety risk observed...',
      locationLabel: 'District Location / Landmark',
      locationPlaceholder: 'e.g. Sector 4 Canal Access Lane, Colombo Pilot Community',
      detectGps: 'Acquire Current GPS Coordinates',
      gpsActive: 'GPS Coordinates Geotagged',
      presetsTitle: 'Or Select a Pre-tested Smart City Scenario Preset',
      presetsSubtitle: 'Instantly populate high-fidelity synthetic field telemetry for instant evaluation.',
      analyzeButton: 'Process with VÉQALUNE AI',
      analyzingButton: 'Synthesizing Multimodal Evidence...',
      fillRequired: 'Please upload an image or select a preset scenario before analyzing.',
      preset1Title: 'Sector 4 Canal Waste Dumping',
      preset1Desc: 'Mixed masonry rubble, paint canisters, and discarded debris blocking stormwater runoff access.',
      preset2Title: 'School Crosswalk Pothole',
      preset2Desc: 'Deep 40cm road crater with fractured edges right at the school pedestrian crosswalk.',
      preset3Title: 'South Canal Culvert Clog',
      preset3Desc: 'Heavy plastic packaging and organic debris clogging 90% of the flood culvert intake screen.',
      preset4Title: 'Old Moor St. Water Pipe Leak',
      preset4Desc: 'Sub-surface water pipe leaking under pressure, undermining sidewalk pavers and causing street pooling.',
    },
    analysisPage: {
      analyzingTitle: 'VÉQALUNE AI Reasoning Engine Active',
      analyzingSubtitle: 'Running multimodal vision model, extracting physical taxonomy, and computing 0–100 priority weights...',
      resultBadge: 'AI Telemetry Verified',
      resultHeading: 'Multimodal AI Classification & Decision Support',
      resultSubheading: 'Synthesized inspection brief, transparent 0–100 multi-factor score, and actionable municipal dispatch order.',
      priorityScoreHeading: 'Transparent Multi-Factor Priority Score',
      priorityScoreDesc: 'Calculated using 5 weighted civic factors rather than arbitrary black-box rankings.',
      breakdownSeverity: 'Severity & Hazard Scope',
      breakdownEnv: 'Environmental Hazard',
      breakdownSafety: 'Public Safety Risk',
      breakdownLocation: 'Location & Critical Infrastructure',
      breakdownRecurrence: 'Recurrence & History',
      aiVisionHeading: 'Multimodal Vision Diagnosis & Context',
      hazardTagsHeading: 'Detected Hazard Taxonomies',
      detectedObjectsHeading: 'Physical Objects Identified',
      recommendedActionHeading: 'Actionable Municipal Dispatch Work Order',
      dispatcherBrief: 'Dispatcher Brief & Field Crew Instructions',
      estimatedSla: 'Target Resolution SLA',
      hotspotNoticeHeading: 'Spatial Correlation & Hotspot Warning',
      hotspotNoticeDesc: 'This incident falls within an active 380m proximity cluster with 5 other reports.',
      saveToDbButton: 'Commit to Municipal Database (PostgreSQL / Supabase)',
      savedSuccess: 'Report successfully saved to PostgreSQL database with assigned ID',
      viewInTable: 'View in Reports Table',
      viewOnLiveMap: 'Inspect on Live GIS Map',
    },
    mapPage: {
      heading: 'Geospatial Cartography & Hotspot Buffers',
      subheading: 'Interactive PostGIS-ready cartography plotting incident telemetry, severity contours, and autonomous 450m proximity cluster zones.',
      tabIncidents: 'Active Incidents',
      tabHotspots: 'Spatial Hotspots',
      filterCategory: 'Category Filter',
      filterSeverity: 'Severity Filter',
      filterStatus: 'Status Filter',
      toggleHotspots: 'Show Hotspot Zones (450m)',
      runSpatialScan: 'Run Dynamic Spatial Clustering Scan',
      scanning: 'Executing PostGIS Clustering Scan...',
      hotspotsCount: 'Identified Hotspots',
      incidentsCount: 'Filtered Incidents',
      radiusBuffer: 'Proximity Radius',
      riskScore: 'Aggregate Cluster Risk',
      dominantCategory: 'Dominant Category',
      systemicRecommendation: 'Systemic Intervention Recommendation',
      noReportsFound: 'No incidents match the active filter criteria.',
      viewDetails: 'Open Full Intelligence Modal',
      centerMap: 'Center on Colombo Pilot Zone',
    },
    dashboardPage: {
      cockpitTag: 'VÉQALUNE COMMAND — Colombo Pilot Operations',
      heading: 'Colombo Pilot Community Operations Cockpit',
      subheading: 'Real-time municipal dispatcher cockpit with 0–100 priority work queues, hotspot warnings, and SLA turnaround tracking.',
      districtHealth: 'Community Health Index',
      criticalQueue: 'Critical Dispatch Queue',
      highQueue: 'High Priority Queue',
      activeTelemetry: 'Total Active Reports',
      resolvedActions: 'Resolved Incidents',
      priorityQueueTitle: 'Prioritized Dispatch Response Queue',
      priorityQueueDesc: 'Live work queue ordered by transparent 0–100 decision-support score.',
      categoryBreakdownTitle: 'Incident Distribution by Civic Domain',
      hotspotWarningTitle: 'Active Hotspot Warnings Requiring Systemic Mitigation',
      hotspotWarningDesc: 'Autonomous clusters formed by spatial proximity and recurring report frequency.',
      changeStatus: 'Update Lifecycle Status',
      viewDetailsBtn: 'Inspect Incident Brief',
      actionRequired: 'Action Recommended',
      slaTurnaround: 'Estimated Turnaround SLA',
    },
    insightsPage: {
      predictTag: 'VÉQALUNE PREDICT — Scenario / Risk Simulation',
      heading: 'Systemic Risk & Climate Stress Forecasting',
      subheading: 'Forward-looking scenario simulations modeling rainfall storm surges, culvert bottlenecks, and asset failure horizons.',
      generateAiBriefing: 'Generate Real-Time AI Strategic Briefing',
      generatingBriefing: 'Consulting Gemini Strategic Model...',
      aiBriefingTitle: 'AI Strategic Municipal Briefing (Colombo Pilot Community)',
      weatherSimTitle: 'Monsoon Rainfall & Drainage Stress Simulator',
      weatherSimDesc: 'Simulate progressive precipitation intensity on Colombo canal basins and critical infrastructure.',
      rainfallLow: 'Dry Season Baseline (0–10mm/day)',
      rainfallMod: 'Moderate Monsoon Rain (25–50mm/day)',
      rainfallHeavy: 'Heavy Storm Surge (>80mm/day Precipitation)',
      riskProbability: 'Failure Probability',
      forecastHorizon: 'Forecast Horizon',
      primaryVectors: 'Primary Risk Vectors',
      potentialImpact: 'Estimated Urban Impact',
      proactiveMitigation: 'Recommended Proactive Mitigation',
      hotspotMatrixTitle: 'Proximity Clustering & Hotspot Synthesis Matrix',
      triggerScanBtn: 'Trigger PostGIS Clustering Algorithm',
    },
    tablePage: {
      heading: 'Municipal Intelligence Records & Audit Log',
      subheading: 'Tabular overview of all citizen observations, AI confidence scores, multi-factor priority indices, and dispatch states.',
      searchPlaceholder: 'Search by title, location label, report ID, or description...',
      colId: 'ID',
      colCategory: 'Category',
      colTitle: 'Observation Title',
      colLocation: 'District Location',
      colSeverity: 'Severity',
      colScore: '0–100 Score',
      colStatus: 'Status',
      colDate: 'Recorded At',
      colActions: 'Actions',
      showingReports: 'Showing',
    },
    dashboard: {
      pageTag: 'VÉQALUNE COMMAND — Colombo Pilot Operations',
      pageHeading: 'Colombo Pilot Community Operations Cockpit',
      pageDesc: 'Real-time municipal dispatcher cockpit with 0–100 priority work queues, hotspot warnings, and SLA turnaround tracking.',
      aiInsightTitle: 'Autonomous Spatial Intelligence Briefing',
      aiInsightQuote: '"Cluster detected in Sector 4: 5 recurrent waste overflow incidents near Canal Walkway. 85% probability of localized drainage backup if heavy rains materialize."',
      priorityDistTitle: '0–100 Priority Index Distribution',
      distCritical: 'Critical Triage',
      distHigh: 'High Priority',
      distModerate: 'Moderate Attention',
      distLow: 'Low/Routine',
      categoryBreakdownTitle: 'Incident Distribution by Civic Domain',
      recurringHotspotsTitle: 'Active Hotspot Warnings Requiring Systemic Mitigation',
      recurringHotspotsDesc: 'Autonomous clusters formed by spatial proximity and recurring report frequency.',
      viewMapClusters: 'Inspect in GIS Cartography',
      prioritizedQueueTitle: 'Prioritized Dispatch Response Queue',
      prioritizedQueueDesc: 'Live work queue ordered by transparent 0–100 decision-support score.',
      viewFullTable: 'View Complete Audit Table',
    },
    analysis: {
      evaluatingTelemetry: 'Evaluating Telemetry & Multimodal Visual Evidence',
      processingEvidence: 'Gemini reasoning engine is extracting taxonomy, environmental risk factors, and computing 0–100 transparent priority scoring.',
      pipelineComplete: 'Intelligence Pipeline Complete',
      heading: 'AI Multimodal Triage Assessment',
      newAnalysis: 'New Observation Analysis',
      confidence: 'Inference Confidence',
      breakdownTitle: 'Transparent Multi-Factor Priority Breakdown',
      riskClass: 'Risk & Hazard Classification',
      envRisk: 'Environmental Risk',
      pubRisk: 'Public Safety Risk',
      detectedTaxonomy: 'Detected Visual Taxonomy & Hazard Tags',
      explanationTitle: 'Multimodal AI Decision-Support Assessment',
      recommendedActionTitle: 'Recommended Field Mitigation & Intervention',
      similarHotspotMatch: 'Spatial Hotspot Proximity Match',
      hotspotMatchDesc: 'This incident falls inside an identified recurring municipal hotspot cluster.',
      saveToLiveDatabase: 'Store in Municipal Intelligence Database',
      savingToDatabase: 'Writing Telemetry to Database...',
      reportSavedSuccess: 'Observation successfully recorded and prioritized in the live municipal command queue.',
      viewLiveMap: 'Inspect on Live GIS Map',
      commandCenter: 'Open Operations Cockpit',
      saveToQueue: 'Store in Live Intelligence Queue',
    },
    footer: {
      mission: 'AI-powered community intelligence platform transforming citizen reports into structured, prioritized and actionable intelligence for smarter, more sustainable public infrastructure.',
      copyright: '© 2026 VÉQALUNE CIVIC • "Intelligence for Better Communities"',
      schoolPhase: "CodeSplash '26 School Phase MVP",
      dataModelLink: 'PostgreSQL / Supabase Schema',
      proposalLink: 'Technical Solution Dossier (60%)',
      ethicsNotice: 'Civic Decision-Support Transparency',
      ethicsNoticeDesc: "VÉQALUNE CIVIC is an intelligent decision-support software demonstration for CodeSplash '26. All priority scores (0–100), risk tiers, and classification predictions are advisory AI telemetry designed to assist authorized field workers and do not replace mandatory municipal engineering inspections.",
      language: 'Language / භාෂාව / மொழி',
    },
  },

  // ==========================================
  // SINHALA TRANSLATIONS (සිංහල)
  // ==========================================
  si: {
    brand: {
      name: 'VÉQALUNE CIVIC',
      tagline: 'වඩාත් යහපත් ප්‍රජාවක් සඳහා බුද්ධිමය විසඳුම්',
      ecosystem: 'පද්ධතිය',
      pilotBadge: "CodeSplash '26 පාසල් අදියර MVP",
      syntheticDataNotice: 'කොළඹ නියමු ප්‍රජාව • නිරූපණ දත්ත',
    },
    nav: {
      civic: 'CIVIC',
      civicSub: 'ප්‍රධාන වේදිකාව',
      ai: 'AI',
      aiSub: 'දෘශ්‍ය විශ්ලේෂණය',
      map: 'MAP',
      mapSub: 'GIS සිතියම',
      command: 'COMMAND',
      commandSub: 'මෙහෙයුම් මධ්‍යස්ථානය',
      insight: 'INSIGHT',
      insightSub: 'රටා විශ්ලේෂණය',
      predict: 'PREDICT',
      predictSub: 'අවදානම් පුරෝකථනය',
      proposalDossier: 'තාක්ෂණික යෝජනාවලිය (60%)',
      proposalShort: 'යෝජනාවලිය (60%)',
      launchAi: 'VÉQALUNE AI ආරම්භ කරන්න',
      activeIncidents: 'සිදුවීම්',
    },
    common: {
      reportIssue: 'ගැටලුවක් වාර්තා කරන්න',
      exploreIntelligence: 'දත්ත ගවේෂණය කරන්න',
      viewOnMap: 'සිතියමෙන් බලන්න',
      viewAllOnMap: 'සජීවී සිතියමෙන් සියල්ල බලන්න',
      viewDataModel: 'දත්ත ආකෘතිය බලන්න',
      proposalStory: 'යෝජනාවලියේ කතාව (60%)',
      inspectEvidence: 'සාක්ෂි පරීක්ෂා කරන්න',
      viewDdlSql: 'DDL SQL බලන්න',
      cancel: 'අවලංගු කරන්න',
      save: 'වාර්තාව සුරකින්න',
      saving: 'දත්ත ගබඩාවට සුරකිමින් පවතී...',
      close: 'වසන්න',
      search: 'සොයන්න...',
      filter: 'පෙරහන',
      all: 'සියල්ල',
      actions: 'ක්‍රියාමාර්ග',
      status: 'තත්ත්වය',
      severity: 'බරපතලකම',
      priorityScore: 'ප්‍රමුඛතා ලකුණු',
      confidence: 'AI විශ්වාසනීයත්වය',
      category: 'කාණ්ඩය',
      location: 'ස්ථානය',
      date: 'දිනය',
      back: 'ආපසු',
      next: 'ඉදිරියට',
      loading: 'පූරණය වෙමින් පවතී...',
      refresh: 'යාවත්කාලීන කරන්න',
      download: 'බාගත කරන්න',
      exportCsv: 'CSV ලෙස බාගත කරන්න',
      exportJson: 'JSON ලෙස බාගත කරන්න',
      emergencyCallout: 'හදිසි දැනුම්දීම',
      hours: 'පැය',
      days: 'දින',
      meters: 'මීටර්',
      accuracy: 'නිරවද්‍යතාව',
    },
    categories: {
      Waste: 'කසළ හා අපද්‍රව්‍ය',
      'Road Damage': 'මාර්ග හානි',
      Water: 'ජල සැපයුම් ගැටලු',
      Drainage: 'කානු හා ජලාපවහන',
      Energy: 'වීදි ලාම්පු හා බලශක්ති',
      'Public Safety': 'මහජන ආරක්ෂාව',
      Other: 'වෙනත්',
    },
    severities: {
      LOW: 'අඩු (LOW)',
      MODERATE: 'මධ්‍යස්ථ (MODERATE)',
      HIGH: 'ඉහළ (HIGH)',
      CRITICAL: 'අතිශය බරපතල (CRITICAL)',
    },
    statuses: {
      New: 'නව වාර්තාව',
      'Under Review': 'සමාලෝචනයේ පවතී',
      'Action Recommended': 'ක්‍රියාමාර්ග නිර්දේශිතයි',
      Resolved: 'විසඳා ඇත',
    },
    landing: {
      heroTag: 'කොළඹ නියමු ප්‍රජාව • නිරූපණ දත්ත',
      heroH1Part1: 'ගැටලුව දකින්න.',
      heroH1Gradient: 'රටාව තේරුම් ගන්න.',
      heroH1Part2: 'ප්‍රජාව දියුණු කරන්න.',
      heroDesc:
        'VÉQALUNE CIVIC ප්‍රජා නිරීක්ෂණ කෘතිම බුද්ධිය (AI) ඔස්සේ වඩාත් වේගවත්, බුද්ධිමත් සහ තිරසාර ක්‍රියාමාර්ග සඳහා වූ තොරතුරු බවට පරිවර්තනය කරයි.',
      pillMultimodal: 'බහුමාධ්‍ය දෘශ්‍ය AI',
      pillPostgis: 'PostGIS අවදානම් කලාප හඳුනාගැනීම',
      pillPredictive: 'කල්තියා අවදානම් පුරෝකථනය',
      metricsHealth: 'ප්‍රජා සෞඛ්‍ය දර්ශකය',
      metricsHealthSub: 'දිස්ත්‍රික් සෞඛ්‍ය මට්ටම',
      metricsCritical: 'අතිශය බරපතල ගැටලු',
      metricsCriticalSub: 'ක්ෂණික ක්‍රියාමාර්ග අවශ්‍යයි',
      metricsHigh: 'ඉහළ ප්‍රමුඛතාව',
      metricsHighSub: 'සමාලෝචනය වෙමින් පවතී',
      metricsActive: 'සක්‍රිය වාර්තා',
      metricsActiveSub: 'ඇතුළත් වූ දත්ත',
      metricsResolved: 'විසඳන ලද ගැටලු',
      metricsResolvedSub: 'සාර්ථකව නිමකළ ක්‍රියාමාර්ග',

      proposalTag: 'ප්‍රධාන යෝජනාවලියේ කතාව • නවෝත්පාදනය + අදාළත්වය (60%)',
      proposalHeading: 'විසිරුණු පැමිණිලි ක්‍රමානුකූල නාගරික බුද්ධිමය දත්ත බවට පත්කිරීම',
      proposalQuote:
        '"VÉQALUNE යනු හුදෙක් පැමිණිලි එකතු කිරීමක් පමණක් නොවේ. එය විසිරී ඇති ප්‍රජා නිරීක්ෂණ, ප්‍රමුඛතා අනුව පෙළගැසුණු, විනිවිදභාවයෙන් යුතු සහ භූගෝලීයව සම්බන්ධ වූ බුද්ධිමය තොරතුරු බවට පත්කර පළමුව අවධානය යොමුකළ යුතු දේ හඳුනාගැනීමට උපකාරී වේ."',
      proposalMatrixTitle: 'තාක්ෂණික විසඳුම් මාර්ගෝපදේශ සාක්ෂි සැසඳුම',
      proposalFullDossier: 'සම්පූර්ණ යෝජනාවලිය බලන්න (අංග 7ම)',

      suiteTag: 'ඒකාබද්ධ පද්ධතිය',
      suiteHeading: 'සුවිශේෂී නාගරික බුද්ධිමය මෙවලම් පෙළ',
      suiteDesc:
        'ප්‍රතික්‍රියාශීලී පැමිණිලි සංස්කෘතියෙන් මිදී කල්තියා පුරෝකථනය කරන බුද්ධිමත් තීරණ ගැනීමේ යාන්ත්‍රණයකට මඟපාදන ප්‍රධාන එන්ජින් 6ක්.',

      workflowTag: 'බුද්ධිමය ක්‍රියාවලිය',
      workflowHeading: 'හුදෙකලා වාර්තාවල සිට පුනරාවර්තී රටා හඳුනාගැනීම දක්වා',
      workflowDesc:
        'VÉQALUNE CIVIC සාමාන්‍ය පැමිණිලි ලබාගැනීම අදියර 6කින් යුත් බුද්ධිමත් තීරණ ගැනීමේ පද්ධතියක් බවට පත් කරයි.',
      stages: {
        s1Title: 'SEE (දකින්න)',
        s1Sub: 'දෘශ්‍ය හා සංවේදක දත්ත ලබාගැනීම',
        s1Desc: 'මහජනතාව සහ ක්ෂේත්‍ර පරීක්ෂකවරුන් විසින් ඡායාරූප, සංවේදක දත්ත සහ භූගෝලීය පිහිටීම් සහිත නිරීක්ෂණ ඇතුළත් කරයි.',
        s2Title: 'UNDERSTAND (තේරුම් ගන්න)',
        s2Sub: 'බහුමාධ්‍ය AI විශ්ලේෂණය',
        s2Desc: 'Gemini දෘශ්‍ය ආකෘති මඟින් ගැටලුවේ වර්ගීකරණය, අව්‍යාජභාවය සහ පාරිසරික හා මහජන ආරක්ෂණ අවදානම් ස්වයංක්‍රීයව විශ්ලේෂණය කරයි.',
        s3Title: 'PRIORITIZE (ප්‍රමුඛතාව දෙන්න)',
        s3Sub: '0–100 විනිවිදභාවයෙන් යුතු ලකුණු ක්‍රමය',
        s3Desc: 'බරපතලකම, පාරිසරික බලපෑම, ආරක්ෂාව සහ ස්ථානයේ වැදගත්කම මත පදනම්ව බහු-සාධක ප්‍රමුඛතා ලකුණු ගණනය කරයි.',
        s4Title: 'CONNECT (සම්බන්ධ කරන්න)',
        s4Sub: 'අවදානම් කලාප (Hotspots) හඳුනාගැනීම',
        s4Desc: 'PostGIS භූගෝලීය පොකුරුකරණය මඟින් හුදෙකලා පැමිණිලි එකිනෙක සම්බන්ධ කර නැවත නැවත සිදුවන අවදානම් කලාප හඳුනාගනී.',
        s5Title: 'RECOMMEND (නිර්දේශ කරන්න)',
        s5Sub: 'ක්ෂණික ක්‍රියාකාරී වැඩ නියෝග',
        s5Desc: 'ක්ෂේත්‍ර සේවකයන් සඳහා පැහැදිලි වැඩ නියෝග, ආරක්ෂිත පූර්වෝපායයන් සහ විසඳිය යුතු කාලරාමු (SLA) නිර්දේශ කරයි.',
        s6Title: 'PREDICT (පුරෝකථනය කරන්න)',
        s6Sub: 'කල්තියා අවදානම් පුරෝකථනය',
        s6Desc: 'කාලගුණ රටා සහ පෙර දත්ත අනුසාරයෙන් නාගරික කානු අවහිරවීම් සහ මාර්ග හානි සිදුවීමට පෙර පුරෝකථනය කරයි.',
      },

      domainsTag: 'විෂය පථය හා ආවරණය',
      domainsHeading: 'ප්‍රධාන නාගරික යටිතල පහසුකම් ක්ෂේත්‍ර 6ක්',
      domainsDesc:
        'නාගරික සම්පත් ඉතිරි කරමින් මහජනතාව ආරක්ෂා කිරීම උදෙසා අවධානය යොමුකරන ප්‍රධාන ක්ෂේත්‍ර 6.',
      domains: {
        waste: {
          name: 'නීතිවිරෝධී කසළ බැහැර කිරීම්',
          desc: 'ඇළ මාර්ග සහ පොදු ස්ථාන අසල ගොඩගසා ඇති කොන්ක්‍රීට් සුන්බුන් සහ අනතුරුදායක කසළ.',
        },
        road: {
          name: 'මාර්ග හා පදික වේදිකා හානි',
          desc: 'පාසල් සහ ප්‍රධාන මංසන්ධි ආශ්‍රිත මාර්ගවල ඇති විශාල වළවල් සහ පැළුණු පදික වේදිකා.',
        },
        water: {
          name: 'ජල නල කාන්දු සහ පිපිරීම්',
          desc: 'පිරිසිදු පානීය ජල නල පිපිරීම්, පස් ඛාදනය සහ නාගරික ජල ගැලීම්.',
        },
        drainage: {
          name: 'අවහිර වූ වැසි ජලාපවහන කානු',
          desc: 'ප්ලාස්ටික් හා රොන්මඩ නිසා අවහිර වූ කුඩා පාලම් සහ වැසි ජල බැසයන කානු පද්ධති.',
        },
        energy: {
          name: 'ක්‍රියා විරහිත වීදි ලාම්පු',
          desc: 'අඳුරු වීදි මාර්ග, කැඩුණු ලාම්පු සහ පදිකයන්ට අනාරක්ෂිත කලාප.',
        },
        safety: {
          name: 'අනාරක්ෂිත පොදු යටිතල පහසුකම්',
          desc: 'ආවරණ රහිත මෑන්හෝල් (Manholes), කැඩුණු පාලම් වැටවල් සහ අනාරක්ෂිත විදුලි රැහැන්.',
        },
      },

      commandTag: 'VÉQALUNE මෙහෙයුම් මධ්‍යස්ථානය',
      commandHeading: 'නගර සභා නිලධාරීන් සහ ක්ෂේත්‍ර සේවකයන් සඳහා තීරණ ගැනීමේ සහාය',
      commandDesc:
        'අසංවිධානාත්මක පැමිණිලි ගොඩක් වෙනුවට, නගර සභා මෙහෙයුම්කරුවන්ට ප්‍රමුඛතාව අනුව සකස් වූ වැඩ පෝලිම්, සජීවී සිතියම් අවදානම් කලාප සහ AI මඟින් විශ්ලේෂණය කළ හේතු දැක්වීම් ලැබේ.',
      commandFeature1: 'පරිසරය, ආරක්ෂාව සහ නැවත සිදුවීම මත පදනම්ව තත්‍ය කාලීන 0–100 ප්‍රමුඛතා ලකුණු',
      commandFeature2: 'දිගුකාලීන විසඳුම් සඳහා මීටර් 380–500 කලාපයේ පුනරාවර්තී අවදානම් කලාප ස්වයංක්‍රීයව හඳුනාගැනීම',
      commandFeature3: 'PostGIS භූගෝලීය විමසුම් සහාය සහිත සම්පූර්ණ දත්ත ගබඩා ආකෘතිය',
      commandCta1: 'මෙහෙයුම් මධ්‍යස්ථානය විවෘත කරන්න',
      commandCta2: 'අවදානම් පුරෝකථන බලන්න',
      hotspotDetectedBadge: 'සක්‍රිය අවදානම් කලාපයක් හඳුනාගෙන ඇත',
      hotspotAiSynthesis: 'AI සංශ්ලේෂණය',
      hotspotAiQuote:
        '"පසුගිය දින 14 තුළ මෙම ප්‍රදේශය තුළ කසළ සම්බන්ධ සමාන වාර්තා 5ක් හඳුනාගෙන ඇති අතර, මෙය දිගුකාලීන මැදිහත්වීමක් අවශ්‍ය පුනරාවර්තී ගැටලුවක් බව පෙනී යයි."',
      inspectClusterMap: 'සිතියමෙන් අවදානම් කලාපය පරීක්ෂා කරන්න',

      bottomHeading: 'නාගරික බුද්ධිමය පද්ධතිය පරීක්ෂා කිරීමට සූදානම්ද?',
      bottomDesc:
        'ඡායාරූපයක් උඩුගත කරන්න හෝ අපගේ සූදානම් කළ ආදර්ශ අවස්ථා වලින් එකක් තෝරා තත්‍ය කාලීන AI වර්ගීකරණය සහ ලකුණු ලබාදීම අත්විඳින්න.',
      bottomCtaAnalyze: 'නව ගැටලුවක් විශ්ලේෂණය කරන්න',
    },
    reportPage: {
      heading: 'බහුමාධ්‍ය AI දත්ත ලබාගැනීම සහ පරීක්ෂාව',
      subheading: 'ස්වයංක්‍රීය Gemini 3.7 දෘශ්‍ය වර්ගීකරණය සහ 0–100 බහු-සාධක ලකුණු ලබාගැනීමට ඡායාරූපයක් උඩුගත කරන්න හෝ ආදර්ශ අවස්ථාවක් තෝරන්න.',
      step1Title: 'පියවර 1: දෘශ්‍ය සාක්ෂි ඇතුළත් කිරීම',
      step1Desc: 'නගරයේ පවතින ගැටලුව පිළිබඳ ඡායාරූපයක් උඩුගත කරන්න හෝ කැමරාවෙන් ලබාගන්න.',
      uploadBoxTitle: 'ඡායාරූපය උඩුගත කිරීමට මෙහි ක්ලික් කරන්න හෝ ඇද දමන්න',
      uploadBoxSubtitle: 'JPG, PNG, WebP සහාය දක්වයි (උපරිම 10MB • EXIF දත්ත ස්වයංක්‍රීයව ලබාගනී)',
      orUseCamera: 'කැමරාව භාවිතා කරන්න',
      removePhoto: 'ඡායාරූපය ඉවත් කරන්න',
      step2Title: 'පියවර 2: ස්ථානය සහ අමතර විස්තර',
      step2Desc: 'ස්ථානය සහ නිරීක්ෂණය කළ කරුණු කෙටියෙන් සඳහන් කරන්න.',
      selectCategory: 'ප්‍රධාන කාණ්ඩය (විකල්ප පූර්ව-වර්ගීකරණය)',
      issueDescription: 'ගැටලුව පිළිබඳ විස්තරය සහ නිරීක්ෂණ',
      issueDescriptionPlaceholder: 'නිරීක්ෂණය කළ ගැටලුවේ ස්වභාවය, බරපතලකම හෝ මහජනතාවට ඇති අවදානම විස්තර කරන්න...',
      locationLabel: 'ස්ථානය / ප්‍රසිද්ධ සලකුණ',
      locationPlaceholder: 'උදා: අංශය 4 ඇළ මාර්ගය, කොළඹ නියමු ප්‍රජාව',
      detectGps: 'වත්මන් GPS පිහිටීම ලබාගන්න',
      gpsActive: 'GPS පිහිටීම සාර්ථකව සටහන් විය',
      presetsTitle: 'නැතහොත් පූර්ව-පරීක්ෂිත ආදර්ශ අවස්ථාවක් තෝරන්න',
      presetsSubtitle: 'ක්ෂණිකව පද්ධතිය පරීක්ෂා කිරීම සඳහා උසස් ක්ෂේත්‍ර ආදර්ශ දත්ත භාවිතා කරන්න.',
      analyzeButton: 'VÉQALUNE AI මඟින් විශ්ලේෂණය කරන්න',
      analyzingButton: 'දෘශ්‍ය සාක්ෂි විශ්ලේෂණය වෙමින් පවතී...',
      fillRequired: 'විශ්ලේෂණය කිරීමට පෙර කරුණාකර ඡායාරූපයක් උඩුගත කරන්න හෝ ආදර්ශ අවස්ථාවක් තෝරන්න.',
      preset1Title: 'අංශය 4 ඇළ මාර්ගයේ කසළ බැහැර කිරීම',
      preset1Desc: 'කොන්ක්‍රීට් සුන්බුන් සහ තීන්ත බඳුන් නිසා වැසි ජලය බැසයාම අවහිර වී ඇත.',
      preset2Title: 'පාසල් පදික මාරුව අසල මාර්ගයේ වළක්',
      preset2Desc: 'පාසල් පදික මාරුව අසල ඇති සෙන්ටිමීටර 40ක ගැඹුරු සහ කැඩීගිය දාර සහිත අනතුරුදායක වළක්.',
      preset3Title: 'දකුණු ඇළ කානු පද්ධතියේ අවහිරතාව',
      preset3Desc: 'ප්ලාස්ටික් හා අපද්‍රව්‍ය නිසා ජලාපවහන දැල 90% කින් පමණ අවහිර වී ඇත.',
      preset4Title: 'පැරණි මූර් වීදියේ ජල නල කාන්දුව',
      preset4Desc: 'අධික පීඩනය යටතේ ජල නලයක් කාන්දු වී පදික වේදිකාව ගිලා බැස ජලය එකතු වී ඇත.',
    },
    analysisPage: {
      analyzingTitle: 'VÉQALUNE AI තර්කණ එන්ජිම ක්‍රියාත්මකයි',
      analyzingSubtitle: 'දෘශ්‍ය ආකෘතිය ධාවනය කරමින්, භෞතික වස්තූන් හඳුනාගනිමින් සහ 0–100 ප්‍රමුඛතා ලකුණු ගණනය කරමින් පවතී...',
      resultBadge: 'AI මඟින් තහවුරු කළ දත්ත',
      resultHeading: 'බහුමාධ්‍ය AI වර්ගීකරණය සහ තීරණ ගැනීමේ සහාය',
      resultSubheading: 'ක්ෂේත්‍ර පරීක්ෂණ සාරාංශය, විනිවිදභාවයෙන් යුතු 0–100 ලකුණු සහ ක්‍රියාත්මක කළ හැකි වැඩ නියෝගය.',
      priorityScoreHeading: 'විනිවිදභාවයෙන් යුතු බහු-සාධක ප්‍රමුඛතා ලකුණු',
      priorityScoreDesc: 'අභිරුචි ඇල්ගොරිතම වෙනුවට වැදගත් නාගරික සාධක 5ක් ඔස්සේ ගණනය කරන ලදී.',
      breakdownSeverity: 'බරපතලකම සහ අනතුරුදායක බව',
      breakdownEnv: 'පාරිසරික අවදානම',
      breakdownSafety: 'මහජන ආරක්ෂණ අවදානම',
      breakdownLocation: 'ස්ථානයේ සහ යටිතල පහසුකම්වල වැදගත්කම',
      breakdownRecurrence: 'පුනරාවර්තීභාවය සහ ඉතිහාසය',
      aiVisionHeading: 'දෘශ්‍ය විශ්ලේෂණ නිගමනය සහ පසුබිම',
      hazardTagsHeading: 'හඳුනාගත් අවදානම් ලක්ෂණ',
      detectedObjectsHeading: 'හඳුනාගත් භෞතික වස්තූන්',
      recommendedActionHeading: 'නිර්දේශිත නාගරික ක්ෂේත්‍ර වැඩ නියෝගය',
      dispatcherBrief: 'මෙහෙයුම්කරු උපදෙස් සහ සේවක ආරක්ෂිත පියවර',
      estimatedSla: 'ඉලක්කගත විසඳුම් කාලරාමුව (SLA)',
      hotspotNoticeHeading: 'භූගෝලීය සබඳතාව සහ අවදානම් කලාප අනතුරු ඇඟවීම',
      hotspotNoticeDesc: 'මෙම සිදුවීම වෙනත් වාර්තා 5ක් සහිත මීටර් 380ක සක්‍රිය අවදානම් කලාපයකට අයත් වේ.',
      saveToDbButton: 'දත්ත ගබඩාවට ඇතුළත් කරන්න (PostgreSQL / Supabase)',
      savedSuccess: 'වාර්තාව නගර සභා දත්ත ගබඩාවට සාර්ථකව ඇතුළත් කර අංකයක් නිකුත් කරන ලදී',
      viewInTable: 'වාර්තා ලේඛනයෙන් බලන්න',
      viewOnLiveMap: 'සජීවී සිතියමෙන් පරීක්ෂා කරන්න',
    },
    mapPage: {
      heading: 'භූගෝලීය සිතියම්කරණය සහ අවදානම් කලාප',
      subheading: 'සිදුවීම්, බරපතලතා මට්ටම් සහ මීටර් 450ක ආසන්න අවදානම් කලාප සජීවීව පෙන්වන අන්තර්ක්‍රියාකාරී GIS සිතියම.',
      tabIncidents: 'සක්‍රිය සිදුවීම්',
      tabHotspots: 'අවදානම් කලාප (Hotspots)',
      filterCategory: 'කාණ්ඩය අනුව පෙරහන',
      filterSeverity: 'බරපතලකම අනුව පෙරහන',
      filterStatus: 'තත්ත්වය අනුව පෙරහන',
      toggleHotspots: 'අවදානම් කලාප පෙන්වන්න (මීටර් 450)',
      runSpatialScan: 'භූගෝලීය පොකුරුකරණ පරිලෝකනයක් සිදුකරන්න',
      scanning: 'PostGIS පරිලෝකනය සිදුවෙමින් පවතී...',
      hotspotsCount: 'හඳුනාගත් අවදානම් කලාප',
      incidentsCount: 'පෙරහන් කළ සිදුවීම්',
      radiusBuffer: 'අවදානම් අරය',
      riskScore: 'එකමුතු අවදානම් ලකුණු',
      dominantCategory: 'ප්‍රමුඛ කාණ්ඩය',
      systemicRecommendation: 'දිගුකාලීන පිළියම් නිර්දේශය',
      noReportsFound: 'තෝරාගත් පෙරහන් වලට අදාළ වාර්තා හමු නොවීය.',
      viewDetails: 'සම්පූර්ණ තොරතුරු බලන්න',
      centerMap: 'කොළඹ නියමු කලාපයට කේන්ද්‍රගත කරන්න',
    },
    dashboardPage: {
      cockpitTag: 'VÉQALUNE COMMAND — කොළඹ මෙහෙයුම් මැදිරිය',
      heading: 'කොළඹ නියමු ප්‍රජා මෙහෙයුම් පාලක පුවරුව',
      subheading: '0–100 ප්‍රමුඛතා පෝලිම්, අවදානම් කලාප අනතුරු ඇඟවීම් සහ SLA කාලරාමු නිරීක්ෂණය කරන සජීවී මෙහෙයුම් මැදිරිය.',
      districtHealth: 'ප්‍රජා සෞඛ්‍ය දර්ශකය',
      criticalQueue: 'අතිශය බරපතල ගැටලු පෝලිම',
      highQueue: 'ඉහළ ප්‍රමුඛතා පෝලිම',
      activeTelemetry: 'සමස්ත සක්‍රිය වාර්තා',
      resolvedActions: 'විසඳන ලද සිදුවීම්',
      priorityQueueTitle: 'ප්‍රමුඛතා අනුව පෙළගැසූ වැඩ පෝලිම',
      priorityQueueDesc: '0–100 විනිවිදභාවයෙන් යුතු ලකුණු අනුව පෙළගැසුණු සජීවී වැඩ ලැයිස්තුව.',
      categoryBreakdownTitle: 'කාණ්ඩ අනුව ගැටලු බෙදීයාම',
      hotspotWarningTitle: 'දිගුකාලීන විසඳුම් අවශ්‍ය සක්‍රිය අවදානම් කලාප',
      hotspotWarningDesc: 'භූගෝලීය සමීපත්වය සහ නිරන්තර වාර්තා වීම් මත පදනම්ව හඳුනාගත් කලාප.',
      changeStatus: 'තත්ත්වය යාවත්කාලීන කරන්න',
      viewDetailsBtn: 'විස්තර පරීක්ෂා කරන්න',
      actionRequired: 'ක්‍රියාමාර්ග නිර්දේශිතයි',
      slaTurnaround: 'අපේක්ෂිත විසඳුම් කාලය (SLA)',
    },
    insightsPage: {
      predictTag: 'VÉQALUNE PREDICT — අවදානම් පුරෝකථන අනුකරණය',
      heading: 'පද්ධතිමය අවදානම් සහ දේශගුණික පීඩන පුරෝකථනය',
      subheading: 'වැසි ජල ගැලීම්, කානු අවහිරතා සහ යටිතල පහසුකම් බිඳවැටීම් කල්තියා හඳුනාගන්නා අනුකරණ ආකෘති.',
      generateAiBriefing: 'තත්‍ය කාලීන AI උපායමාර්ගික වාර්තාවක් ජනනය කරන්න',
      generatingBriefing: 'Gemini උපායමාර්ගික ආකෘතිය විමසමින් පවතී...',
      aiBriefingTitle: 'AI උපායමාර්ගික නාගරික වාර්තාව (කොළඹ නියමු ප්‍රජාව)',
      weatherSimTitle: 'මෝසම් වර්ෂාපතන සහ ජලාපවහන පීඩන අනුකරණය',
      weatherSimDesc: 'කොළඹ ඇළ මාර්ග සහ යටිතල පහසුකම් මත විවිධ වර්ෂාපතන තත්ත්වයන්ගේ බලපෑම අනුකරණය කරන්න.',
      rainfallLow: 'වියළි කාලගුණ මට්ටම (0–10 මි.මී./දිනකට)',
      rainfallMod: 'මධ්‍යස්ථ මෝසම් වර්ෂාව (25–50 මි.මී./දිනකට)',
      rainfallHeavy: 'අධික කුණාටු වර්ෂාපතනය (>80 මි.මී./දිනකට)',
      riskProbability: 'අවදානම් සම්භාවිතාව',
      forecastHorizon: 'පුරෝකථන කාල සීමාව',
      primaryVectors: 'ප්‍රධාන අවදානම් සාධක',
      potentialImpact: 'නාගරික ප්‍රදේශයට වියහැකි බලපෑම',
      proactiveMitigation: 'කල්තියා ගතයුතු නිර්දේශිත පියවර',
      hotspotMatrixTitle: 'අවදානම් කලාප හා පොකුරුකරණ සංශ්ලේෂණ අනුකෘතිය',
      triggerScanBtn: 'PostGIS ඇල්ගොරිතමය ක්‍රියාත්මක කරන්න',
    },
    tablePage: {
      heading: 'නාගරික බුද්ධිමය වාර්තා ලේඛනය සහ විගණන සටහන',
      subheading: 'සියලුම මහජන නිරීක්ෂණ, AI විශ්වාසනීයත්ව ලකුණු, බහු-සාධක ප්‍රමුඛතා සහ වැඩ තත්ත්වයන් පිළිබඳ වගුගත දළ විශ්ලේෂණය.',
      searchPlaceholder: 'මාතෘකාව, ස්ථානය, වාර්තා අංකය හෝ විස්තරය අනුව සොයන්න...',
      colId: 'අංකය',
      colCategory: 'කාණ්ඩය',
      colTitle: 'නිරීක්ෂණ මාතෘකාව',
      colLocation: 'ස්ථානය',
      colSeverity: 'බරපතලකම',
      colScore: '0–100 ලකුණු',
      colStatus: 'තත්ත්වය',
      colDate: 'ලියාපදිංචි කළ දිනය',
      colActions: 'ක්‍රියාමාර්ග',
      showingReports: 'පෙන්වන්නේ',
    },
    dashboard: {
      pageTag: 'VÉQALUNE COMMAND — කොළඹ මෙහෙයුම් මැදිරිය',
      pageHeading: 'කොළඹ නියමු ප්‍රජා මෙහෙයුම් පාලක පුවරුව',
      pageDesc: '0–100 ප්‍රමුඛතා පෝලිම්, අවදානම් කලාප අනතුරු ඇඟවීම් සහ SLA කාලරාමු නිරීක්ෂණය කරන සජීවී මෙහෙයුම් මැදිරිය.',
      aiInsightTitle: 'ස්වයංක්‍රීය අවකාශීය බුද්ධිමය වාර්තාව',
      aiInsightQuote: '"4 වන කලාපයේ අවදානම් පොකුරක් හඳුනාගෙන ඇත: ඇළ මාර්ගය අසල නිරන්තර කසළ බැහැර කිරීම් 5ක්. අධික වර්ෂාවකදී 85%ක ජලාපවහන අවහිරතා අවදානමක් ඇත."',
      priorityDistTitle: '0–100 ප්‍රමුඛතා දර්ශක ව්‍යාප්තිය',
      distCritical: 'අතිශය බරපතල',
      distHigh: 'ඉහළ ප්‍රමුඛතාව',
      distModerate: 'මධ්‍යස්ථ අවධානය',
      distLow: 'අඩු / සාමාන්‍ය',
      categoryBreakdownTitle: 'කාණ්ඩ අනුව ගැටලු බෙදීයාම',
      recurringHotspotsTitle: 'දිගුකාලීන විසඳුම් අවශ්‍ය සක්‍රිය අවදානම් කලාප',
      recurringHotspotsDesc: 'භූගෝලීය සමීපත්වය සහ නිරන්තර වාර්තා වීම් මත පදනම්ව හඳුනාගත් කලාප.',
      viewMapClusters: 'GIS සිතියමෙන් පරීක්ෂා කරන්න',
      prioritizedQueueTitle: 'ප්‍රමුඛතා අනුව පෙළගැසූ වැඩ පෝලිම',
      prioritizedQueueDesc: '0–100 විනිවිදභාවයෙන් යුතු ලකුණු අනුව පෙළගැසුණු සජීවී වැඩ ලැයිස්තුව.',
      viewFullTable: 'සම්පූර්ණ විගණන වගුව බලන්න',
    },
    analysis: {
      evaluatingTelemetry: 'දත්ත සහ බහුමාධ්‍ය දෘශ්‍ය සාක්ෂි ඇගයීම',
      processingEvidence: 'Gemini තර්කන පද්ධතිය මගින් පාරිසරික අවදානම් සාධක විශ්ලේෂණය කර 0–100 ප්‍රමුඛතා ලකුණු ගණනය කරමින් පවතී.',
      pipelineComplete: 'බුද්ධිමය විශ්ලේෂණ ක්‍රියාවලිය සම්පූර්ණයි',
      heading: 'AI බහුමාධ්‍ය තක්සේරු වාර්තාව',
      newAnalysis: 'නව නිරීක්ෂණ විශ්ලේෂණය',
      confidence: 'AI විශ්වාසනීයත්වය',
      breakdownTitle: 'විනිවිද පෙනෙන බහු-සාධක ප්‍රමුඛතා විග්‍රහය',
      riskClass: 'අවදානම් සහ උපද්‍රව වර්ගීකරණය',
      envRisk: 'පාරිසරික අවදානම',
      pubRisk: 'මහජන ආරක්ෂණ අවදානම',
      detectedTaxonomy: 'හඳුනාගත් දෘශ්‍ය වර්ගීකරණය සහ අවදානම් ටැග්',
      explanationTitle: 'බහුමාධ්‍ය AI තීරණ ගැනීමේ සහායක තක්සේරුව',
      recommendedActionTitle: 'ක්ෂේත්‍රයට නිර්දේශිත ක්‍රියාමාර්ගය',
      similarHotspotMatch: 'අවකාශීය අවදානම් කලාප ගැලපීම',
      hotspotMatchDesc: 'මෙම සිදුවීම නාගරික පුනරාවර්තන අවදානම් කලාපයක් තුළ පිහිටා ඇත.',
      saveToLiveDatabase: 'නාගරික බුද්ධිමය දත්ත ගබඩාවට සුරකින්න',
      savingToDatabase: 'දත්ත ගබඩාවට ලියමින් පවතී...',
      reportSavedSuccess: 'නිරීක්ෂණය සාර්ථකව සටහන් කර සජීවී විධාන පෝලිමට ඇතුළත් කරන ලදී.',
      viewLiveMap: 'සජීවී GIS සිතියමෙන් බලන්න',
      commandCenter: 'මෙහෙයුම් පුවරුව විවෘත කරන්න',
      saveToQueue: 'සජීවී පෝලිමට සුරකින්න',
    },
    footer: {
      mission: 'වඩාත් බුද්ධිමත් සහ තිරසාර පොදු යටිතල පහසුකම් උදෙසා මහජන වාර්තා ප්‍රමුඛතා අනුව පෙළගැසුණු බුද්ධිමය දත්ත බවට පත්කරන AI වේදිකාව.',
      copyright: '© 2026 VÉQALUNE CIVIC • "වඩාත් යහපත් ප්‍රජාවක් සඳහා බුද්ධිමය විසඳුම්"',
      schoolPhase: "CodeSplash '26 පාසල් අදියර MVP",
      dataModelLink: 'PostgreSQL / Supabase දත්ත ආකෘතිය',
      proposalLink: 'තාක්ෂණික විසඳුම් යෝජනාවලිය (60%)',
      ethicsNotice: 'විනිවිදභාවයෙන් යුතු තීරණ ගැනීමේ සහාය',
      ethicsNoticeDesc: "VÉQALUNE CIVIC යනු CodeSplash '26 සඳහා ඉදිරිපත් කළ බුද්ධිමත් තීරණ ගැනීමේ මෘදුකාංග නිරූපණයකි. සියලුම ප්‍රමුඛතා ලකුණු (0–100) සහ වර්ගීකරණයන් ක්ෂේත්‍ර නිලධාරීන්ට උපකාරී වන AI උපදේශන දත්ත වන අතර ඒවා අනිවාර්ය ඉංජිනේරු පරීක්ෂණ වෙනුවට ආදේශ නොවේ.",
      language: 'භාෂාව / Language / மொழி',
    },
  },

  // ==========================================
  // TAMIL TRANSLATIONS (தமிழ்)
  // ==========================================
  ta: {
    brand: {
      name: 'VÉQALUNE CIVIC',
      tagline: 'சிறந்த சமூகத்திற்கான நுண்ணறிவுத் தீர்வுகள்',
      ecosystem: 'கட்டமைப்பு',
      pilotBadge: "CodeSplash '26 பள்ளி கட்ட MVP",
      syntheticDataNotice: 'கொழும்பு மாதிரி சமூகம் • செயற்கை செயல்முறைத் தரவு',
    },
    nav: {
      civic: 'CIVIC',
      civicSub: 'முதன்மை தளம்',
      ai: 'AI',
      aiSub: 'பார்வை & பகுப்பாய்வு',
      map: 'MAP',
      mapSub: 'GIS வரைபடம்',
      command: 'COMMAND',
      commandSub: 'செயல்பாட்டு மையம்',
      insight: 'INSIGHT',
      insightSub: 'வடிவமைப்புகள்',
      predict: 'PREDICT',
      predictSub: 'இடர் முன்னறிவிப்பு',
      proposalDossier: 'தொழில்நுட்ப முன்மொழிவு (60%)',
      proposalShort: 'முன்மொழிவு (60%)',
      launchAi: 'VÉQALUNE AI ஐத் தொடங்கு',
      activeIncidents: 'சம்பவங்கள்',
    },
    common: {
      reportIssue: 'சிக்கலைப் புகாரளிக்கவும்',
      exploreIntelligence: 'தரவுகளை ஆராய்க',
      viewOnMap: 'வரைபடத்தில் காண்க',
      viewAllOnMap: 'நேரடி வரைபடத்தில் அனைத்தையும் காண்க',
      viewDataModel: 'தரவு மாதிரியைக் காண்க',
      proposalStory: 'முன்மொழிவுக் கதை (60%)',
      inspectEvidence: 'ஆதாரங்களை ஆய்வு செய்க',
      viewDdlSql: 'DDL SQL காண்க',
      cancel: 'ரத்துசெய்',
      save: 'அறிக்கையைச் சேமி',
      saving: 'தரவுத்தளத்தில் சேமிக்கப்படுகிறது...',
      close: 'மூடுக',
      search: 'தேடுக...',
      filter: 'வடிகட்டி',
      all: 'அனைத்தும்',
      actions: 'நடவடிக்கைகள்',
      status: 'நிலை',
      severity: 'தீவிரம்',
      priorityScore: 'முன்னுரிமைப் புள்ளி',
      confidence: 'AI நம்பகத்தன்மை',
      category: 'வகை',
      location: 'இடம்',
      date: 'திகதி',
      back: 'பின்செல்க',
      next: 'அடுத்து',
      loading: 'ஏற்றப்படுகிறது...',
      refresh: 'புதுப்பிக்கவும்',
      download: 'பதிவிறக்கு',
      exportCsv: 'CSV பதிவிறக்கம்',
      exportJson: 'JSON பதிவிறக்கம்',
      emergencyCallout: 'அவசர அறிவிப்பு',
      hours: 'மணிநேரம்',
      days: 'நாட்கள்',
      meters: 'மீட்டர்',
      accuracy: 'துல்லியம்',
    },
    categories: {
      Waste: 'திடக்கழிவு மற்றும் குப்பைகள்',
      'Road Damage': 'சாலை சேதங்கள்',
      Water: 'குடிநீர் விநியோகக் கசிவு',
      Drainage: 'வடிகால் அடைப்புகள்',
      Energy: 'மின்சாரம் & தெருவிளக்குகள்',
      'Public Safety': 'பொதுப் பாதுகாப்பு',
      Other: 'மற்றவை',
    },
    severities: {
      LOW: 'குறைவு (LOW)',
      MODERATE: 'மிதமானது (MODERATE)',
      HIGH: 'அதிகம் (HIGH)',
      CRITICAL: 'மிகவும் தீவிரமானது (CRITICAL)',
    },
    statuses: {
      New: 'புதிய அறிக்கை',
      'Under Review': 'மறுஆய்வில் உள்ளது',
      'Action Recommended': 'நடவடிக்கை பரிந்துரைக்கப்பட்டது',
      Resolved: 'தீர்க்கப்பட்டது',
    },
    landing: {
      heroTag: 'கொழும்பு மாதிரி சமூகம் • செயற்கை செயல்முறைத் தரவு',
      heroH1Part1: 'பிரச்சினையைக் காண்க.',
      heroH1Gradient: 'முறையைப் புரிந்து கொள்க.',
      heroH1Part2: 'சமூகத்தை மேம்படுத்துக.',
      heroDesc:
        'VÉQALUNE CIVIC குடிமக்கள் அறிக்கைகளை AI-மூலம் இயங்கும் நுண்ணறிவாக மாற்றி, விரைவான மற்றும் நிலையான நடவடிக்கைகளுக்கு வழிகாட்டுகிறது.',
      pillMultimodal: 'பல்வகை பார்வை AI',
      pillPostgis: 'PostGIS அபாய மண்டலக் கண்டறிதல்',
      pillPredictive: 'முன்கூட்டியே இடர் முன்னறிவிப்பு',
      metricsHealth: 'சமூக நலக் குறியீடு',
      metricsHealthSub: 'மாவட்ட சுகாதாரக் குறியீடு',
      metricsCritical: 'தீவிரமான பிரச்சினைகள்',
      metricsCriticalSub: 'உடனடி நடவடிக்கை தேவை',
      metricsHigh: 'அதிமுக்கியத்துவம்',
      metricsHighSub: 'மறுஆய்வில் உள்ளது',
      metricsActive: 'செயலில் உள்ள அறிக்கைகள்',
      metricsActiveSub: 'பதிவுசெய்யப்பட்ட தரவுகள்',
      metricsResolved: 'தீர்க்கப்பட்ட சிக்கல்கள்',
      metricsResolvedSub: 'நிறைவேற்றப்பட்ட பணிகள்',

      proposalTag: 'முதன்மை முன்மொழிவுக் கதை • புதுமை + பொருத்தம் (60%)',
      proposalHeading: 'சிதறிய புகார்களைக் கட்டமைக்கப்பட்ட நகர்ப்புற நுண்ணறிவாக மாற்றுதல்',
      proposalQuote:
        '"VÉQALUNE என்பது வெறும் புகார்களைச் சேகரிப்பது மட்டுமல்ல. இது சிதறிக்கிடக்கும் சமூக அவதானிப்புகளைக் கட்டமைக்கப்பட்ட, வெளிப்படையான மற்றும் புவியியல் ரீதியாக இணைக்கப்பட்ட நுண்ணறிவாக மாற்றி, எதற்கு முதலில் கவனம் செலுத்த வேண்டும் என்பதை அடையாளம் காண உதவுகிறது."',
      proposalMatrixTitle: 'தொழில்நுட்ப தீர்வு வழிகாட்டுதல்கள் சான்று அட்டவணை',
      proposalFullDossier: 'முழு ஆவணத்தையும் காண்க (அனைத்து 7 விவரக்குறிப்புகளும்)',

      suiteTag: 'ஒருங்கிணைந்த கட்டமைப்பு',
      suiteHeading: 'நகர்ப்புற நுண்ணறிவுத் தொகுப்பு',
      suiteDesc:
        'செயலற்ற புகார் முறையிலிருந்து முன்கூட்டியே முடிவெடுக்கும் ஆதரவு அமைப்பிற்கு நகரங்களை வழிநடத்தும் 6 பிரத்யேக இயந்திரங்கள்.',

      workflowTag: 'நுண்ணறிவுக் கட்டமைப்பு',
      workflowHeading: 'தனிப்பட்ட அறிக்கைகளிலிருந்து தொடர் வடிவங்களை அடையாளம் காணுதல் வரை',
      workflowDesc:
        'VÉQALUNE CIVIC செயலற்ற புகார் உட்கொள்ளலை 6-நிலை முன்கணிப்பு முடிவெடுக்கும் அமைப்பாக மாற்றுகிறது.',
      stages: {
        s1Title: 'SEE (காண்க)',
        s1Sub: 'பார்வை மற்றும் உணரித் தரவு உட்கொள்ளல்',
        s1Desc: 'குடிமக்களும் கள ஆய்வாளர்களும் புகைப்படங்கள், சென்சார் தரவுகள் மற்றும் புவிசார் அவதானிப்புகளைப் பதிவு செய்கின்றனர்.',
        s2Title: 'UNDERSTAND (புரிக)',
        s2Sub: 'பல்வகை AI பகுப்பாய்வு',
        s2Desc: 'Gemini பார்வை மாதிரிகள் பொருள்களின் வகைப்பாடு, உண்மைத்தன்மை மற்றும் சுற்றுச்சூழல், பாதுகாப்பு அபாயங்களை ஆய்வு செய்கின்றன.',
        s3Title: 'PRIORITIZE (முன்னுரிமைப்படுத்துக)',
        s3Sub: '0–100 வெளிப்படையான மதிப்பீட்டு இயந்திரம்',
        s3Desc: 'தீவிரம், சுற்றுச்சூழல் தாக்கம், பாதுகாப்பு மற்றும் இடத்தின் முக்கியத்துவத்தை அடிப்படையாகக் கொண்டு முன்னுரிமைப் புள்ளிகள் கணக்கிடப்படுகின்றன.',
        s4Title: 'CONNECT (இணைக்க)',
        s4Sub: 'புவிசார் அபாய மண்டலக் கண்டறிதல்',
        s4Desc: 'PostGIS புவியியல் திரட்டல் தனிமைப்படுத்தப்பட்ட புகார்களை இணைத்து மீண்டும் மீண்டும் நிகழும் அபாய வலயங்களை அடையாளம் காண்கிறது.',
        s5Title: 'RECOMMEND (பரிந்துரைக்க)',
        s5Sub: 'நடவடிக்கைக்கான பணி ஆணைகள்',
        s5Desc: 'களக் குழுக்களுக்கான தெளிவான பணி ஆணைகள், பாதுகாப்பு முன்னெச்சரிக்கைகள் மற்றும் காலக்கெடுவை (SLA) உருவாக்குகிறது.',
        s6Title: 'PREDICT (முன்னறிவிக்க)',
        s6Sub: 'செயலூக்கமுள்ள இடர் முன்னறிவிப்பு',
        s6Desc: 'வானிலை வடிவங்கள் மற்றும் வரலாற்றுத் தரவுகளை மாதிரியாக்கி, வடிகால் மற்றும் சாலை சேதங்களை முன்கூட்டியே கணிக்கிறது.',
      },

      domainsTag: 'வரம்பு மற்றும் கவரேஜ்',
      domainsHeading: '6 முக்கியமான நகர்ப்புற உள்கட்டமைப்பு களங்கள்',
      domainsDesc:
        'நகராட்சி வளங்களைச் சேமித்து பொதுமக்களைப் பாதுகாக்கும் வகையில் விரைவான முடிவெடுக்கும் ஆதரவை வழங்கும் 6 முக்கிய துறைகள்.',
      domains: {
        waste: {
          name: 'சட்டவிரோதக் கழிவு கொட்டுதல்',
          desc: 'கால்வாய் வழிகள் மற்றும் பொது இடங்களில் கொட்டப்படும் கட்டுமான இடிபாடுகள் மற்றும் அபாயகரமான கழிவுகள்.',
        },
        road: {
          name: 'சாலை மற்றும் நடைபாதை சேதங்கள்',
          desc: 'பள்ளி மண்டலங்கள் மற்றும் முக்கிய சாலைகளில் உள்ள ஆழமான குழிகள் மற்றும் உடைந்த நடைபாதைகள்.',
        },
        water: {
          name: 'குடிநீர்க் குழாய் கசிவுகள் & வெடிப்புகள்',
          desc: 'குடிநீர்க் குழாய் வெடிப்புகள், மண் அரிப்பு மற்றும் உள்ளூர் சாலை வெள்ளப்பெருக்கு.',
        },
        drainage: {
          name: 'மழைநீர் வடிகால் அடைப்புகள்',
          desc: 'பிளாஸ்டிக் மற்றும் சேற்றினால் அடைக்கப்பட்ட பாலங்கள் மற்றும் மழைநீர் வடிகால் அமைப்புகள்.',
        },
        energy: {
          name: 'பழுதடைந்த தெருவிளக்குகள்',
          desc: 'வெளிச்சமற்ற தெருக்கள், பழுதடைந்த விளக்குகள் மற்றும் பாதசாரிகளுக்குப் பாதுகாப்பற்ற பகுதிகள்.',
        },
        safety: {
          name: 'பாதுகாப்பற்ற பொது உள்கட்டமைப்பு',
          desc: 'மூடப்படாத மேன்ஹோல்கள் (Manholes), உடைந்த பாலத் தடுப்புகள் மற்றும் பாதுகாப்பற்ற மின் கம்பிகள்.',
        },
      },

      commandTag: 'VÉQALUNE செயல்பாட்டுக் கட்டுப்பாட்டு மையம்',
      commandHeading: 'நகராட்சிப் பணியாளர்கள் மற்றும் களக் குழுக்களுக்கான முடிவெடுக்கும் ஆதரவு',
      commandDesc:
        'குழப்பமான புகார்களின் குவியலுக்குப் பதிலாக, நகராட்சி ஆபரேட்டர்கள் வெளிப்படையாக வரிசைப்படுத்தப்பட்ட பணி வரிசைகள், நேரடி வரைபட அபாய மண்டலங்கள் மற்றும் AI காரணப் பகுப்பாய்வைப் பெறுகிறார்கள்.',
      commandFeature1: 'சுற்றுச்சூழல், பாதுகாப்பு மற்றும் மறுநிகழ்வு காரணிகளின் அடிப்படையில் நிகழ்நேர 0–100 முன்னுரிமை மதிப்பீடு',
      commandFeature2: 'நீண்டகால தீர்வுகளுக்காக 380மீ–500மீ மறுநிகழ்வு அபாய மண்டலங்களை தானாக அடையாளம் காணுதல்',
      commandFeature3: 'PostGIS புவியியல் வினவல் ஆதரவுடன் கூடிய முழுமையான தரவுத்தளக் கட்டமைப்பு',
      commandCta1: 'கட்டுப்பாட்டு மையத்தைத் திறக்க',
      commandCta2: 'இடர் முன்னறிவிப்புகளைக் காண்க',
      hotspotDetectedBadge: 'செயலில் உள்ள அபாய மண்டலம் கண்டறியப்பட்டது',
      hotspotAiSynthesis: 'AI ஒருங்கிணைப்பு',
      hotspotAiQuote:
        '"கடந்த 14 நாட்களில் இந்த பகுதியில் 5 ஒத்த கழிவு அறிக்கைகள் கண்டறியப்பட்டுள்ளன, இது நீண்டகால தலையீடு தேவைப்படும் தொடர் பிரச்சினையைக் குறிக்கிறது."',
      inspectClusterMap: 'வரைபடத்தில் அபாய மண்டலத்தை ஆய்வு செய்க',

      bottomHeading: 'நகர்ப்புற நுண்ணறிவுக் கட்டமைப்பைச் சோதிக்கத் தயாரா?',
      bottomDesc:
        'ஒரு புகைப்படத்தைப் பதிவேற்றவும் அல்லது நிகழ்நேர AI வகைப்பாடு மற்றும் 0-100 மதிப்பீட்டை அனுபவிக்க எமது மாதிரி சூழ்நிலைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்.',
      bottomCtaAnalyze: 'புதிய சிக்கலைப் பகுப்பாய்வு செய்க',
    },
    reportPage: {
      heading: 'பல்வகை AI தகவல் உட்கொள்ளல் மற்றும் ஆய்வு',
      subheading: 'தானியங்கி Gemini 3.7 பார்வை வகைப்பாடு மற்றும் 0–100 பல-காரணி மதிப்பீட்டைப் பெற புகைப்படத்தைப் பதிவேற்றவும் அல்லது மாதிரியைத் தேர்ந்தெடுக்கவும்.',
      step1Title: 'படி 1: காட்சி ஆதாரப் பதிவு',
      step1Desc: 'நகர்ப்புற சிக்கலின் புகைப்படத்தைப் பதிவேற்றவும் அல்லது கேமராவைப் பயன்படுத்தவும்.',
      uploadBoxTitle: 'புகைப்படத்தைப் பதிவேற்ற கிளிக் செய்க அல்லது இழுத்து விடவும்',
      uploadBoxSubtitle: 'JPG, PNG, WebP ஆதரிக்கப்படுகிறது (அதிகபட்சம் 10MB • EXIF தரவு தானாக எடுக்கப்படும்)',
      orUseCamera: 'கேமராவைப் பயன்படுத்தவும்',
      removePhoto: 'புகைப்படத்தை அகற்று',
      step2Title: 'படி 2: இருப்பிடம் மற்றும் கூடுதல் அவதானிப்புகள்',
      step2Desc: 'இருப்பிடப் பெயர் மற்றும் சுருக்கமான குறிப்புகளை வழங்கவும்.',
      selectCategory: 'முதன்மை வகை (விருப்பத்திற்குரிய முன்-வகைப்பாடு)',
      issueDescription: 'சிக்கல் விளக்கம் & அவதானிப்புகள்',
      issueDescriptionPlaceholder: 'அவதானிக்கப்பட்ட சேதத்தின் தன்மை, அபாயத்தின் அளவு அல்லது பொதுமக்களுக்கான ஆபத்தை விவரிக்கவும்...',
      locationLabel: 'இருப்பிடம் / அடையாளக் குறி',
      locationPlaceholder: 'எ.கா: பிரிவு 4 கால்வாய் அணுகுவழி, கொழும்பு மாதிரி சமூகம்',
      detectGps: 'தற்போதைய GPS இருப்பிடத்தைப் பெறுக',
      gpsActive: 'GPS இருப்பிடம் வெற்றிகரமாகப் பெறப்பட்டது',
      presetsTitle: 'அல்லது முன்கூட்டியே சோதிக்கப்பட்ட மாதிரி சூழ்நிலையைத் தேர்ந்தெடுக்கவும்',
      presetsSubtitle: 'உடனடி மதிப்பீட்டிற்காக கள மாதிரித் தரவை உடனடியாகப் பயன்படுத்தவும்.',
      analyzeButton: 'VÉQALUNE AI மூலம் பகுப்பாய்வு செய்க',
      analyzingButton: 'காட்சி ஆதாரங்கள் பகுப்பாய்வு செய்யப்படுகின்றன...',
      fillRequired: 'பகுப்பாய்வு செய்வதற்கு முன் புகைப்படத்தைப் பதிவேற்றவும் அல்லது மாதிரியைத் தேர்ந்தெடுக்கவும்.',
      preset1Title: 'பிரிவு 4 கால்வாய்க் கழிவுக் குவியல்',
      preset1Desc: 'கட்டுமான இடிபாடுகள் மற்றும் கழிவுகளால் மழைநீர் வடிகால் அடைக்கப்பட்டுள்ளது.',
      preset2Title: 'பள்ளி பாதசாரி கடவை அருகே சாலைக்குழி',
      preset2Desc: 'பள்ளி பாதசாரி கடவை அருகே 40செ.மீ ஆழமான மற்றும் உடைந்த விளிம்புகளுடன் கூடிய ஆபத்தான குழி.',
      preset3Title: 'தெற்கு கால்வாய் வடிகால் அடைப்பு',
      preset3Desc: 'பிளாஸ்டிக் கழிவுகளால் வடிகால் திரை 90% அடைக்கப்பட்டுள்ளது.',
      preset4Title: 'பழைய மூர் தெரு குடிநீர்க் குழாய் கசிவு',
      preset4Desc: 'அதிக அழுத்தத்தில் குழாய் உடைந்து நடைபாதை மூழ்கி சாலையில் தண்ணீர் தேங்கியுள்ளது.',
    },
    analysisPage: {
      analyzingTitle: 'VÉQALUNE AI பகுப்பாய்வு இயந்திரம் இயங்குகிறது',
      analyzingSubtitle: 'பார்வை மாதிரியை இயக்கி, பொருள்களை அடையாளம் கண்டு, 0–100 முன்னுரிமைப் புள்ளிகளைக் கணக்கிடுகிறது...',
      resultBadge: 'AI சரிபார்க்கப்பட்ட தரவு',
      resultHeading: 'பல்வகை AI வகைப்பாடு & முடிவெடுக்கும் ஆதரவு',
      resultSubheading: 'கள ஆய்வுச் சுருக்கம், வெளிப்படையான 0–100 முன்னுரிமைப் புள்ளி மற்றும் செயல்முறைப் பணி ஆணை.',
      priorityScoreHeading: 'வெளிப்படையான பல-காரணி முன்னுரிமைப் புள்ளி',
      priorityScoreDesc: 'ரகசிய அல்காரிதம்களுக்குப் பதிலாக 5 முக்கிய நகர்ப்புற காரணிகளைக் கொண்டு கணக்கிடப்பட்டது.',
      breakdownSeverity: 'தீவிரம் மற்றும் அபாய வரம்பு',
      breakdownEnv: 'சுற்றுச்சூழல் அபாயம்',
      breakdownSafety: 'பொதுப் பாதுகாப்பு இடர்',
      breakdownLocation: 'இருப்பிடம் மற்றும் உள்கட்டமைப்பு முக்கியத்துவம்',
      breakdownRecurrence: 'மறுநிகழ்வு மற்றும் வரலாறு',
      aiVisionHeading: 'பார்வைப் பகுப்பாய்வு முடிவு மற்றும் சூழல்',
      hazardTagsHeading: 'கண்டறியப்பட்ட அபாயக் குறியீடுகள்',
      detectedObjectsHeading: 'அடையாளம் காணப்பட்ட இயற்பியல் பொருள்கள்',
      recommendedActionHeading: 'பரிந்துரைக்கப்பட்ட களப் பணி ஆணை',
      dispatcherBrief: 'ஆபரேட்டர் வழிமுறைகள் மற்றும் களப் பாதுகாப்புக் குறிப்புகள்',
      estimatedSla: 'இலக்குத் தீர்வுகான காலக்கெடு (SLA)',
      hotspotNoticeHeading: 'புவியியல் தொடர்பு மற்றும் அபாய மண்டல எச்சரிக்கை',
      hotspotNoticeDesc: 'இந்த சம்பவம் மற்ற 5 அறிக்கைகளைக் கொண்ட 380மீ செயலில் உள்ள அபாய மண்டலத்தைச் சார்ந்தது.',
      saveToDbButton: 'தரவுத்தளத்தில் சேமிக்க (PostgreSQL / Supabase)',
      savedSuccess: 'அறிக்கை வெற்றிகரமாக நகராட்சித் தரவுத்தளத்தில் சேமிக்கப்பட்டு இலக்கம் வழங்கப்பட்டது',
      viewInTable: 'அறிக்கைகள் அட்டவணையில் காண்க',
      viewOnLiveMap: 'நேரடி GIS வரைபடத்தில் காண்க',
    },
    mapPage: {
      heading: 'புவிசார் வரைபடவியல் மற்றும் அபாய மண்டலங்கள்',
      subheading: 'சம்பவங்கள், தீவிரத்தன்மை மற்றும் 450மீ அருகாமை அபாய மண்டலங்களை நேரடியாகக் காட்டும் ஊடாடும் GIS வரைபடம்.',
      tabIncidents: 'செயலில் உள்ள சம்பவங்கள்',
      tabHotspots: 'அபாய மண்டலங்கள் (Hotspots)',
      filterCategory: 'வகை வாரியான வடிகட்டி',
      filterSeverity: 'தீவிரம் வாரியான வடிகட்டி',
      filterStatus: 'நிலை வாரியான வடிகட்டி',
      toggleHotspots: 'அபாய மண்டலங்களைக் காட்டு (450மீ)',
      runSpatialScan: 'புவிசார் திரட்டல் ஸ்கேன் செய்க',
      scanning: 'PostGIS ஸ்கேன் செய்யப்படுகிறது...',
      hotspotsCount: 'கண்டறியப்பட்ட அபாய மண்டலங்கள்',
      incidentsCount: 'வடிகட்டப்பட்ட சம்பவங்கள்',
      radiusBuffer: 'அபாய ஆரம்',
      riskScore: 'கூட்டு இடர் மதிப்பீடு',
      dominantCategory: 'முதன்மை வகை',
      systemicRecommendation: 'நீண்டகாலத் தலையீட்டுப் பரிந்துரை',
      noReportsFound: 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டிகளுக்கு ஏற்ப எந்த அறிக்கைகளும் கிடைக்கவில்லை.',
      viewDetails: 'முழு விவரங்களையும் காண்க',
      centerMap: 'கொழும்பு மாதிரி மண்டலத்தை மையப்படுத்துக',
    },
    dashboardPage: {
      cockpitTag: 'VÉQALUNE COMMAND — கொழும்பு செயல்பாட்டு மையம்',
      heading: 'கொழும்பு மாதிரி சமூக செயல்பாட்டுக் கட்டுப்பாட்டு மையம்',
      subheading: '0–100 முன்னுரிமை வரிசைகள், அபாய மண்டல எச்சரிக்கைகள் மற்றும் SLA காலக்கெடுவைக் கண்காணிக்கும் நேரடி செயல்பாட்டு மையம்.',
      districtHealth: 'சமூக நலக் குறியீடு',
      criticalQueue: 'தீவிர பணி வரிசை',
      highQueue: 'உயர் முன்னுரிமை வரிசை',
      activeTelemetry: 'மொத்த செயலில் உள்ள அறிக்கைகள்',
      resolvedActions: 'தீர்க்கப்பட்ட சம்பவங்கள்',
      priorityQueueTitle: 'முன்னுரிமைப்படுத்தப்பட்ட பணி வரிசை',
      priorityQueueDesc: 'வெளிப்படையான 0–100 புள்ளிகளின்படி வரிசைப்படுத்தப்பட்ட நேரடிப் பணிப் பட்டியல்.',
      categoryBreakdownTitle: 'வகை வாரியான சம்பவப் பகிர்வு',
      hotspotWarningTitle: 'நீண்டகால தீர்வு தேவைப்படும் செயலில் உள்ள அபாய மண்டலங்கள்',
      hotspotWarningDesc: 'புவியியல் அருகாமை மற்றும் தொடர்ச்சியான அறிக்கைகளின் அடிப்படையில் அடையாளம் காணப்பட்ட மண்டலங்கள்.',
      changeStatus: 'நிலையைப் புதுப்பிக்கவும்',
      viewDetailsBtn: 'விவரங்களை ஆய்வு செய்க',
      actionRequired: 'நடவடிக்கை பரிந்துரைக்கப்பட்டது',
      slaTurnaround: 'எதிர்பார்க்கப்படும் தீர்வு நேரம் (SLA)',
    },
    insightsPage: {
      predictTag: 'VÉQALUNE PREDICT — இடர் முன்னறிவிப்பு உருவகப்படுத்துதல்',
      heading: 'கட்டமைப்பு இடர்கள் மற்றும் காலநிலை அழுத்த முன்னறிவிப்பு',
      subheading: 'மழை வெள்ளப்பெருக்கு, வடிகால் அடைப்புகள் மற்றும் உள்கட்டமைப்பு சேதங்களை முன்கூட்டியே கணிக்கும் உருவகப்படுத்துதல் மாதிரிகள்.',
      generateAiBriefing: 'நிகழ்நேர AI மூலோபாய அறிக்கையை உருவாக்கு',
      generatingBriefing: 'Gemini மூலோபாய மாதிரியுடன் கலந்தாலோசிக்கப்படுகிறது...',
      aiBriefingTitle: 'AI நகராட்சி மூலோபாய அறிக்கை (கொழும்பு மாதிரி சமூகம்)',
      weatherSimTitle: 'பருவமழை மற்றும் வடிகால் அழுத்த உருவகப்படுத்தி',
      weatherSimDesc: 'கொழும்பு கால்வாய்கள் மற்றும் உள்கட்டமைப்புகளில் பல்வேறு மழைப்பொழிவு நிலைகளின் தாக்கத்தை உருவகப்படுத்துங்கள்.',
      rainfallLow: 'வறண்ட காலநிலை நிலை (0–10 மி.மீ/நாள்)',
      rainfallMod: 'மிதமான பருவமழை (25–50 மி.மீ/நாள்)',
      rainfallHeavy: 'கனமழை வெள்ளப்பெருக்கு (>80 மி.மீ/நாள்)',
      riskProbability: 'இடர் நிகழ்தகவு',
      forecastHorizon: 'முன்னறிவிப்புக் கால அளவு',
      primaryVectors: 'முக்கிய இடர் காரணிகள்',
      potentialImpact: 'நகர்ப்புறத்தில் ஏற்படக்கூடிய தாக்கம்',
      proactiveMitigation: 'பரிந்துரைக்கப்பட்ட முன்கூட்டிய நடவடிக்கைகள்',
      hotspotMatrixTitle: 'அபாய மண்டலங்கள் & திரட்டல் அனலிட்டிக்ஸ் மேட்ரிக்ஸ்',
      triggerScanBtn: 'PostGIS அல்காரிதத்தை இயக்குக',
    },
    tablePage: {
      heading: 'நகராட்சி நுண்ணறிவு அறிக்கைகள் & தணிக்கைப் பதிவு',
      subheading: 'அனைத்து குடிமக்கள் அவதானிப்புகள், AI நம்பகத்தன்மைப் புள்ளிகள், பல-காரணி முன்னுரிமைகள் மற்றும் பணி நிலைகளின் அட்டவணை மேலோட்டம்.',
      searchPlaceholder: 'தலைப்பு, இடம், அறிக்கை எண் அல்லது விளக்கம் மூலம் தேடுக...',
      colId: 'எண்',
      colCategory: 'வகை',
      colTitle: 'அவதானிப்புத் தலைப்பு',
      colLocation: 'இடம்',
      colSeverity: 'தீவிரம்',
      colScore: '0–100 புள்ளி',
      colStatus: 'நிலை',
      colDate: 'பதிவு செய்யப்பட்ட திகதி',
      colActions: 'நடவடிக்கைகள்',
      showingReports: 'காண்பிக்கப்படுவது',
    },
    dashboard: {
      pageTag: 'VÉQALUNE COMMAND — கொழும்பு செயல்பாட்டு மையம்',
      pageHeading: 'கொழும்பு மாதிரி சமூக செயல்பாட்டு கட்டுப்பாட்டு அறை',
      pageDesc: '0–100 முன்னுரிமை வரிசைகள், அபாய மண்டல எச்சரிக்கைகள் மற்றும் SLA தீர்வு நேரங்களைக் கண்காணிக்கும் நிகழ்நேர கட்டுப்பாட்டு அறை.',
      aiInsightTitle: 'தானியங்கி இடஞ்சார்ந்த நுண்ணறிவு சுருக்கம்',
      aiInsightQuote: '"பகுதி 4 இல் அபாயக் கொத்து கண்டறியப்பட்டது: கால்வாய் நடைபாதை அருகே 5 தொடர் கழிவு தேக்கங்கள். கனமழை பெய்தால் 85% வடிகால் அடைப்பு அபாயம்."',
      priorityDistTitle: '0–100 முன்னுரிமை குறியீட்டு விநியோகம்',
      distCritical: 'மிகவும் தீவிரமானது',
      distHigh: 'அதி முக்கியத்துவம்',
      distModerate: 'மிதமான கவனம்',
      distLow: 'குறைந்த / சாதாரண',
      categoryBreakdownTitle: 'பிரிவு வாரியாக சிக்கல்களின் பகிர்வு',
      recurringHotspotsTitle: 'நீண்டகால தீர்வு தேவைப்படும் செயலில் உள்ள அபாய மண்டலங்கள்',
      recurringHotspotsDesc: 'புவியியல் அருகாமை மற்றும் தொடர்ச்சியான அறிக்கையிடல் அடிப்படையில் அடையாளம் காணப்பட்ட மண்டலங்கள்.',
      viewMapClusters: 'GIS வரைபடத்தில் ஆய்வு செய்க',
      prioritizedQueueTitle: 'முன்னுரிமை அடிப்படையில் வரிசைப்படுத்தப்பட்ட பணி வரிசை',
      prioritizedQueueDesc: '0–100 வெளிப்படையான முடிவெடுக்கும் புள்ளிகள் அடிப்படையில் வரிசைப்படுத்தப்பட்ட பட்டியல்.',
      viewFullTable: 'முழுமையான தணிக்கை அட்டவணையைப் பார்க்கவும்',
    },
    analysis: {
      evaluatingTelemetry: 'தரவு மற்றும் மல்டிமாடல் காட்சி ஆதாரங்களை மதிப்பீடு செய்தல்',
      processingEvidence: 'Gemini பகுத்தறிவு இயந்திரம் சுற்றுச்சூழல் இடர் காரணிகளை ஆய்வு செய்து 0–100 முன்னுரிமை புள்ளிகளை கணக்கிடுகிறது.',
      pipelineComplete: 'நுண்ணறிவு பகுப்பாய்வு செயல்முறை முடிந்தது',
      heading: 'AI மல்டிமாடல் மதிப்பீட்டு அறிக்கை',
      newAnalysis: 'புதிய அவதானிப்பு பகுப்பாய்வு',
      confidence: 'AI நம்பகத்தன்மை',
      breakdownTitle: 'வெளிப்படையான பல காரணி முன்னுரிமை விவரம்',
      riskClass: 'இடர் மற்றும் ஆபத்து வகைப்பாடு',
      envRisk: 'சுற்றுச்சூழல் இடர்',
      pubRisk: 'பொது பாதுகாப்பு இடர்',
      detectedTaxonomy: 'கண்டறியப்பட்ட காட்சி வகைப்பாடு & ஆபத்துக் குறியீடுகள்',
      explanationTitle: 'மல்டிமாடல் AI முடிவெடுக்கும் ஆதரவு மதிப்பீடு',
      recommendedActionTitle: 'பரிந்துரைக்கப்பட்ட கள நடவடிக்கை',
      similarHotspotMatch: 'இடஞ்சார்ந்த அபாய மண்டலப் பொருத்தம்',
      hotspotMatchDesc: 'இந்த சம்பவம் நகராட்சி தொடர் அபாய மண்டலத்திற்குள் அமைந்துள்ளது.',
      saveToLiveDatabase: 'நகராட்சி நுண்ணறிவு தரவுத்தளத்தில் சேமிக்கவும்',
      savingToDatabase: 'தரவுத்தளத்தில் பதிவு செய்யப்படுகிறது...',
      reportSavedSuccess: 'அவதானிப்பு வெற்றிகரமாக பதிவு செய்யப்பட்டு கட்டளைப் பணி வரிசையில் சேர்க்கப்பட்டது.',
      viewLiveMap: 'நேரலை GIS வரைபடத்தில் காண்க',
      commandCenter: 'செயல்பாட்டுக் கட்டுப்பாட்டு அறையைத் திறக்குக',
      saveToQueue: 'நேரலை வரிசையில் சேமிக்கவும்',
    },
    footer: {
      mission: 'சிறந்த மற்றும் நிலையான பொது உள்கட்டமைப்பிற்காக குடிமக்கள் அறிக்கைகளை முன்னுரிமைப்படுத்தப்பட்ட நுண்ணறிவாக மாற்றும் AI இயங்குதளம்.',
      copyright: '© 2026 VÉQALUNE CIVIC • "சிறந்த சமூகத்திற்கான நுண்ணறிவுத் தீர்வுகள்"',
      schoolPhase: "CodeSplash '26 பள்ளி கட்ட MVP",
      dataModelLink: 'PostgreSQL / Supabase தரவு மாதிரி',
      proposalLink: 'தொழில்நுட்ப தீர்வு முன்மொழிவு (60%)',
      ethicsNotice: 'வெளிப்படையான முடிவெடுக்கும் ஆதரவு',
      ethicsNoticeDesc: "VÉQALUNE CIVIC என்பது CodeSplash '26 க்கான அறிவார்ந்த முடிவெடுக்கும் மென்பொருள் செயல்விளக்கமாகும். அனைத்து முன்னுரிமைப் புள்ளிகளும் (0–100) மற்றும் வகைப்பாடுகளும் கள ஊழியர்களுக்கு உதவும் AI ஆலோசனைத் தரவுகளாகும், அவை கட்டாயப் பொறியியல் ஆய்வுகளுக்கு மாற்றாகாது.",
      language: 'மொழி / Language / භාෂාව',
    },
  },
};
