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
        bg: 'bg-emerald-950/60',
        text: 'text-emerald-300',
        border: 'border-emerald-800/60',
      };
    case 'Road Damage':
      return {
        bg: 'bg-amber-950/60',
        text: 'text-amber-300',
        border: 'border-amber-800/60',
      };
    case 'Water':
      return {
        bg: 'bg-cyan-950/60',
        text: 'text-cyan-300',
        border: 'border-cyan-800/60',
      };
    case 'Drainage':
      return {
        bg: 'bg-blue-950/60',
        text: 'text-blue-300',
        border: 'border-blue-800/60',
      };
    case 'Energy':
      return {
        bg: 'bg-purple-950/60',
        text: 'text-purple-300',
        border: 'border-purple-800/60',
      };
    case 'Public Safety':
      return {
        bg: 'bg-rose-950/60',
        text: 'text-rose-300',
        border: 'border-rose-800/60',
      };
    default:
      return {
        bg: 'bg-zinc-900',
        text: 'text-zinc-300',
        border: 'border-zinc-700',
      };
  }
}
