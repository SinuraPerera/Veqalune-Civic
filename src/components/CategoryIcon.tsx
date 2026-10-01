import React from 'react';
import {
  Trash2,
  AlertTriangle,
  Droplets,
  Waves,
  Zap,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { ReportCategory } from '../types';

interface Props {
  category: ReportCategory;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<Props> = ({
  category,
  className = 'w-4 h-4',
  size = 16,
}) => {
  switch (category) {
    case 'Waste':
      return <Trash2 className={className} size={size} />;
    case 'Road Damage':
      return <AlertTriangle className={className} size={size} />;
    case 'Water':
      return <Droplets className={className} size={size} />;
    case 'Drainage':
      return <Waves className={className} size={size} />;
    case 'Energy':
      return <Zap className={className} size={size} />;
    case 'Public Safety':
      return <ShieldAlert className={className} size={size} />;
    case 'Other':
    default:
      return <HelpCircle className={className} size={size} />;
  }
};

export function getCategoryBadgeStyle(category: ReportCategory): {
  bg: string;
  text: string;
  border: string;
} {
  switch (category) {
    case 'Waste':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'Road Damage':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'Water':
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
      };
    case 'Drainage':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      };
    case 'Energy':
      return {
        bg: 'bg-violet-50',
        text: 'text-violet-700',
        border: 'border-violet-200',
      };
    case 'Public Safety':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
      };
  }
}
