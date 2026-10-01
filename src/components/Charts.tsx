import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Report, ReportCategory } from '../types';

interface ReportTrendChartProps {
  reports: Report[];
}

export const ReportTrendChart: React.FC<ReportTrendChartProps> = ({ reports }) => {
  // Group reports by date (last 7 days)
  const data = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        day: days[date.getDay()],
        date: date.toISOString().split('T')[0],
        count: 0,
      };
    });

    reports.forEach((report) => {
      const reportDate = new Date(report.created_at || Date.now()).toISOString().split('T')[0];
      const dayData = last7Days.find((d) => d.date === reportDate);
      if (dayData) {
        dayData.count++;
      }
    });

    return last7Days;
  }, [reports]);

  return (
    <div className="w-full h-48 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '12px',
              padding: '8px 12px',
            }}
          />
          <Bar
            dataKey="count"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CategoryDistributionChartProps {
  reports: Report[];
}

const CATEGORY_COLORS: Record<ReportCategory, string> = {
  'Waste': '#10b981',
  'Road Damage': '#f59e0b',
  'Water': '#3b82f6',
  'Drainage': '#8b5cf6',
  'Energy': '#ef4444',
  'Public Safety': '#ec4899',
  'Other': '#6b7280',
};

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ reports }) => {
  const data = React.useMemo(() => {
    const categories: ReportCategory[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety', 'Other'];
    return categories.map((cat) => ({
      name: cat,
      value: reports.filter((r) => r.category === cat).length,
      color: CATEGORY_COLORS[cat],
    })).filter((d) => d.value > 0);
  }, [reports]);

  if (data.length === 0) {
    return (
      <div className="w-full h-48 sm:h-64 flex items-center justify-center text-slate-400 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-48 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '12px',
              padding: '8px 12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface SeverityDistributionChartProps {
  reports: Report[];
}

const SEVERITY_COLORS: Record<string, string> = {
  'CRITICAL': '#f43f5e',
  'HIGH': '#fb923c',
  'MODERATE': '#eab308',
  'LOW': '#10b981',
};

export const SeverityDistributionChart: React.FC<SeverityDistributionChartProps> = ({ reports }) => {
  const data = React.useMemo(() => {
    const severities = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];
    return severities.map((sev) => ({
      name: sev,
      value: reports.filter((r) => r.severity === sev).length,
      color: SEVERITY_COLORS[sev],
    })).filter((d) => d.value > 0);
  }, [reports]);

  if (data.length === 0) {
    return (
      <div className="w-full h-48 sm:h-64 flex items-center justify-center text-slate-400 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-48 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '12px',
              padding: '8px 12px',
            }}
          />
          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
