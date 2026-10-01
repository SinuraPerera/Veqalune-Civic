import React from 'react';
import { AlertCircle, FileText, MapPin, BarChart3, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'alert' | 'file' | 'map' | 'chart' | 'plus';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'alert',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  const icons = {
    alert: AlertCircle,
    file: FileText,
    map: MapPin,
    chart: BarChart3,
    plus: Plus,
  };

  const Icon = icons[icon];

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 max-w-sm">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Pre-built empty states for common scenarios
export const EmptyReports: React.FC<{ onReport?: () => void }> = ({ onReport }) => (
  <EmptyState
    icon="file"
    title="No reports yet"
    description="Be the first to report an issue in your community and help make a difference."
    actionLabel="Submit a Report"
    onAction={onReport}
  />
);

export const EmptyHotspots: React.FC = () => (
  <EmptyState
    icon="map"
    title="No hotspots detected"
    description="Submit 2-3 reports within 450m of each other to help VÉQALUNE discover recurring problem areas."
  />
);

export const EmptyDashboard: React.FC<{ onReport?: () => void }> = ({ onReport }) => (
  <EmptyState
    icon="chart"
    title="No data available"
    description="Start by submitting reports to populate the dashboard with community insights."
    actionLabel="Submit First Report"
    onAction={onReport}
  />
);

export const EmptySearch: React.FC = () => (
  <EmptyState
    icon="alert"
    title="No results found"
    description="Try adjusting your search terms or filters to find what you're looking for."
  />
);
