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
        bg: 'bg-rose-950/60',
        text: 'text-rose-400',
        border: 'border-rose-800/80',
        dot: 'bg-rose-500',
      };
    case 'HIGH':
      return {
        bg: 'bg-amber-950/60',
        text: 'text-amber-400',
        border: 'border-amber-800/80',
        dot: 'bg-amber-500',
      };
    case 'MODERATE':
      return {
        bg: 'bg-yellow-950/40',
        text: 'text-yellow-400',
        border: 'border-yellow-800/60',
        dot: 'bg-yellow-500',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-800/60',
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
        bg: 'bg-emerald-950/50',
        text: 'text-emerald-400',
        border: 'border-emerald-700/60',
      };
    case 'Action Recommended':
      return {
        bg: 'bg-sky-950/50',
        text: 'text-sky-300',
        border: 'border-sky-700/60',
      };
    case 'Under Review':
      return {
        bg: 'bg-amber-950/50',
        text: 'text-amber-300',
        border: 'border-amber-700/60',
      };
    case 'New':
    default:
      return {
        bg: 'bg-zinc-900',
        text: 'text-zinc-300',
        border: 'border-zinc-700',
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
