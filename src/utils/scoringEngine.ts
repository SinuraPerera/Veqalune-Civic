import { PriorityBreakdown, ReportCategory, RiskLevel, SeverityLevel } from '../types';

export interface ScoreInputs {
  severity: SeverityLevel;
  environmentalRisk: RiskLevel;
  publicRisk: RiskLevel;
  category: ReportCategory;
  isHotspot?: boolean;
  locationSensitivity?: 'High' | 'Medium' | 'Standard';
}

export function calculatePriorityScore(inputs: ScoreInputs): PriorityBreakdown {
  // 1. Severity Weight (Max 30)
  let severityWeight = 6;
  if (inputs.severity === 'CRITICAL') severityWeight = 30;
  else if (inputs.severity === 'HIGH') severityWeight = 22;
  else if (inputs.severity === 'MODERATE') severityWeight = 14;
  else if (inputs.severity === 'LOW') severityWeight = 6;

  // 2. Environmental Risk Weight (Max 25)
  let environmentalWeight = 4;
  if (inputs.environmentalRisk === 'CRITICAL') environmentalWeight = 25;
  else if (inputs.environmentalRisk === 'HIGH') environmentalWeight = 18;
  else if (inputs.environmentalRisk === 'MEDIUM') environmentalWeight = 11;
  else if (inputs.environmentalRisk === 'LOW') environmentalWeight = 4;

  // 3. Public Safety Risk Weight (Max 25)
  let publicSafetyWeight = 4;
  if (inputs.publicRisk === 'CRITICAL') publicSafetyWeight = 25;
  else if (inputs.publicRisk === 'HIGH') publicSafetyWeight = 18;
  else if (inputs.publicRisk === 'MEDIUM') publicSafetyWeight = 11;
  else if (inputs.publicRisk === 'LOW') publicSafetyWeight = 4;

  // 4. Location Sensitivity Weight (Max 10)
  let locationSensitivityWeight = 5;
  if (inputs.locationSensitivity === 'High') {
    locationSensitivityWeight = 10;
  } else if (inputs.locationSensitivity === 'Medium') {
    locationSensitivityWeight = 7;
  } else {
    locationSensitivityWeight = 4;
  }

  // 5. Recurrence / Cluster Multiplier (Max 10)
  let recurrenceWeight = inputs.isHotspot ? 10 : 3;

  const rawTotal =
    severityWeight +
    environmentalWeight +
    publicSafetyWeight +
    locationSensitivityWeight +
    recurrenceWeight;

  const totalScore = Math.min(100, Math.max(10, Math.round(rawTotal)));

  return {
    severityWeight,
    environmentalWeight,
    publicSafetyWeight,
    locationSensitivityWeight,
    recurrenceWeight,
    totalScore,
  };
}

export function getSeverityBadgeColor(severity: SeverityLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (severity) {
    case 'CRITICAL':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'HIGH':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'MODERATE':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        dot: 'bg-yellow-500',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
  }
}

export function getStatusBadgeColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'Resolved':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
      };
    case 'Action Recommended':
      return {
        bg: 'bg-sky-50',
        text: 'text-sky-600',
        border: 'border-sky-200',
      };
    case 'Under Review':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
      };
    case 'New':
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
      };
  }
}

export function getCategoryIconName(category: ReportCategory): string {
  switch (category) {
    case 'Waste':
      return 'Trash2';
    case 'Road Damage':
      return 'AlertTriangle';
    case 'Water':
      return 'Droplets';
    case 'Drainage':
      return 'Waves';
    case 'Energy':
      return 'Zap';
    case 'Public Safety':
      return 'ShieldAlert';
    default:
      return 'HelpCircle';
  }
}
