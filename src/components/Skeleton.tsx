import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const baseClasses = 'animate-pulse bg-slate-200/80 rounded';

  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Pre-built skeleton components for common patterns
export const CardSkeleton: React.FC = () => (
  <div className="p-6 rounded-3xl glass-card space-y-4">
    <Skeleton variant="circular" width={48} height={48} className="mb-4" />
    <Skeleton width="60%" height={20} />
    <Skeleton width="100%" height={16} />
    <Skeleton width="80%" height={16} />
  </div>
);

export const MetricCardSkeleton: React.FC = () => (
  <div className="p-6 rounded-3xl glass-card space-y-3">
    <Skeleton width="40%" height={14} />
    <Skeleton width="60%" height={32} />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="p-4 rounded-xl glass-card flex items-center gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="40%" height={16} />
          <Skeleton width="60%" height={14} />
        </div>
        <Skeleton width={80} height={24} />
      </div>
    ))}
  </div>
);

export const MapSidebarSkeleton: React.FC = () => (
  <div className="p-4 space-y-4">
    <div className="space-y-3">
      <Skeleton width="40%" height={16} />
      <Skeleton width="100%" height={40} />
    </div>
    <div className="space-y-2">
      <Skeleton width="30%" height={14} />
      <Skeleton width="45%" height={36} />
      <Skeleton width="45%" height={36} />
    </div>
    <div className="space-y-3 pt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl glass-card space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="40%" height={14} />
        </div>
      ))}
    </div>
  </div>
);
