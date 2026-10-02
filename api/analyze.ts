type Category = 'Waste' | 'Road Damage' | 'Water' | 'Drainage' | 'Energy' | 'Public Safety' | 'Other';
type Severity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
type Risk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface AnalysisBody {
  description?: string;
  category?: Category;
  locationLabel?: string;
  imageBase64?: string;
  imageUrl?: string;
}

interface ApiRequest {
  method?: string;
  body?: AnalysisBody | string;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(data: unknown): void;
}

const categories: Category[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety', 'Other'];

function scoreFor(severity: Severity, environmentalRisk: Risk, publicRisk: Risk) {
  const severityWeight: Record<Severity, number> = { LOW: 6, MODERATE: 14, HIGH: 22, CRITICAL: 30 };
  const riskWeight: Record<Risk, number> = { LOW: 4, MEDIUM: 11, HIGH: 18, CRITICAL: 25 };
  const breakdown = {
    severityWeight: severityWeight[severity],
    environmentalWeight: riskWeight[environmentalRisk],
    publicSafetyWeight: riskWeight[publicRisk],
    locationSensitivityWeight: 10,
    recurrenceWeight: 3,
    totalScore: 0,
  };
  breakdown.totalScore = Math.min(100, Math.max(10,
    breakdown.severityWeight + breakdown.environmentalWeight + breakdown.publicSafetyWeight +
    breakdown.locationSensitivityWeight + breakdown.recurrenceWeight));
  return breakdown;
}

export default function handler(request: ApiRequest, response: ApiResponse): void {
  if ((request.method || 'POST').toUpperCase() !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body: AnalysisBody = {};
  if (typeof request.body === 'string') {
    try {
      body = JSON.parse(request.body) as AnalysisBody;
    } catch {
      response.status(400).json({ error: 'Invalid JSON request body' });
      return;
    }
  } else if (request.body && typeof request.body === 'object') {
    body = request.body;
  }

  const description = typeof body.description === 'string' ? body.description : '';
  const lowerDescription = description.toLowerCase();
  let category: Category = body.category && categories.includes(body.category) ? body.category : 'Other';
  let severity: Severity = 'MODERATE';
  let environmentalRisk: Risk = 'MEDIUM';
  let publicRisk: Risk = 'MEDIUM';
  let aiExplanation = 'This civic report requires field verification to assess its precise cause and impact.';
  let recommendedAction = 'Assign a field inspector to verify the issue and determine the appropriate municipal response.';
  let hazardTags = ['Community Report', 'Field Inspection'];
  let detectedObjects = ['reported civic issue'];
  let estimatedResolutionTime = '24-48 Hours';

  if (category === 'Waste' || /dump|trash|garbage|rubbish|debris/.test(lowerDescription)) {
    category = 'Waste'; severity = 'HIGH'; environmentalRisk = 'HIGH'; publicRisk = 'MEDIUM';
    aiExplanation = 'Accumulated waste can obstruct public access and contaminate nearby soil or stormwater. Arrange an inspection and prompt removal.';
    recommendedAction = 'Dispatch a waste collection crew and check nearby locations for recurring dumping.';
    hazardTags = ['Waste Accumulation', 'Sanitation', 'Environmental Risk'];
    detectedObjects = ['mixed debris', 'packaging', 'waste containers'];
    estimatedResolutionTime = '12-24 Hours';
  } else if (category === 'Road Damage' || /pothole|crack|asphalt|road surface|crosswalk/.test(lowerDescription)) {
    category = 'Road Damage'; severity = 'HIGH'; environmentalRisk = 'LOW'; publicRisk = 'HIGH';
    aiExplanation = 'Road surface damage can create hazards for drivers, cyclists, and pedestrians, and may worsen if water enters the damaged area.';
    recommendedAction = 'Place temporary warning markers and schedule a road-surface repair inspection.';
    hazardTags = ['Pavement Hazard', 'Traffic Safety', 'Surface Failure'];
    detectedObjects = ['damaged road surface', 'pothole or crack', 'road markings'];
    estimatedResolutionTime = '8-12 Hours';
  } else if (category === 'Water' || /leak|burst pipe|water main/.test(lowerDescription)) {
    category = 'Water'; severity = 'HIGH'; environmentalRisk = 'HIGH'; publicRisk = 'MEDIUM';
    aiExplanation = 'A water leak can waste potable water and weaken the supporting ground. Inspect the affected utility segment promptly.';
    recommendedAction = 'Dispatch a water utility crew to isolate the supply and locate the leak.';
    hazardTags = ['Water Leak', 'Utility Risk', 'Erosion Risk'];
    detectedObjects = ['standing water', 'pipe or water main'];
    estimatedResolutionTime = '6-12 Hours';
  } else if (category === 'Drainage' || /drain|flood|culvert|clog/.test(lowerDescription)) {
    category = 'Drainage'; severity = 'HIGH'; environmentalRisk = 'HIGH'; publicRisk = 'HIGH';
    aiExplanation = 'Blocked drainage infrastructure can restrict stormwater flow and raise localized flood risk. Clear it before heavy rainfall.';
    recommendedAction = 'Dispatch a drainage crew to inspect and clear the intake, culvert, and nearby screens.';
    hazardTags = ['Storm Drainage', 'Flood Risk', 'Blockage'];
    detectedObjects = ['drain grate', 'sediment', 'debris'];
    estimatedResolutionTime = '6 Hours';
  } else if (category === 'Energy' || /street.?light|lighting|power outage/.test(lowerDescription)) {
    category = 'Energy'; severity = 'MODERATE'; environmentalRisk = 'LOW'; publicRisk = 'HIGH';
    aiExplanation = 'A public lighting outage can reduce visibility and increase risks for people using the affected route after dark.';
    recommendedAction = 'Schedule an electrical maintenance technician to inspect and restore the lighting fixture.';
    hazardTags = ['Lighting Outage', 'Pedestrian Safety', 'Electrical Maintenance'];
    detectedObjects = ['street light', 'darkened walkway'];
    estimatedResolutionTime = '48 Hours';
  } else if (category === 'Public Safety') {
    severity = 'HIGH'; environmentalRisk = 'MEDIUM'; publicRisk = 'HIGH';
    aiExplanation = 'The reported public safety issue may expose pedestrians or nearby residents to harm. Verify the site and secure any immediate hazard.';
    recommendedAction = 'Dispatch a field inspector and establish a temporary safety perimeter if the hazard is confirmed.';
    hazardTags = ['Public Safety', 'Field Inspection', 'Hazard Verification'];
    detectedObjects = ['reported hazard', 'public infrastructure'];
    estimatedResolutionTime = '4-24 Hours';
  }

  response.status(200).json({
    category,
    aiConfidence: 88,
    severity,
    environmentalRisk,
    publicRisk,
    priorityScore: scoreFor(severity, environmentalRisk, publicRisk).totalScore,
    scoringBreakdown: scoreFor(severity, environmentalRisk, publicRisk),
    aiExplanation,
    recommendedAction,
    hazardTags,
    detectedObjects,
    estimatedResolutionTime,
    decisionSupportNote: 'VÉQALUNE serverless demo analysis is advisory. Municipal staff should verify reports in the field.',
    modelUsed: 'VÉQALUNE deterministic demo analyzer',
  });
}
