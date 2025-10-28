'use client';

import { useMemo, memo, Suspense } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import dynamic from 'next/dynamic';

// Lazy load Recharts components
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

interface VolumePoint {
  timestamp: number;
  volume: number;
  yesVolume: number;
  noVolume: number;
}

interface VolumeChartProps {
  data: VolumePoint[];
  title?: string;
}

const VolumeChartComponent = ({ data, title = "Trading Volume" }: VolumeChartProps) => {
  const { theme } = useTheme();
  
  // Memoize chart data transformation
  const chartData = useMemo(() => {
    // Limit to last 10 data points for performance
    const limitedData = data.slice(-10);
    return limitedData.map(point => ({
      time: new Date(point.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      'YES Volume': point.yesVolume,
      'NO Volume': point.noVolume,
      Total: point.volume,
    }));
  }, [data]);

  // Memoize summary stats
  const summaryStats = useMemo(() => ({
    total: chartData.reduce((sum, d) => sum + (d.Total || 0), 0),
    yesTotal: chartData.reduce((sum, d) => sum + (d['YES Volume'] || 0), 0),
    noTotal: chartData.reduce((sum, d) => sum + (d['NO Volume'] || 0), 0),
  }), [chartData]);

  // Memoize colors
  const colors = useMemo(() => ({
    yes: '#00F0FF', // Cyan
    no: '#FF0080',  // Magenta
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    text: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    bg: theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  }), [theme]);

  return (
    <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            No volume data available yet.
          </p>
        </div>
      ) : (
        <Suspense fallback={
          <div className="h-[250px] flex items-center justify-center">
            <div className="animate-spin text-3xl">📊</div>
          </div>
        }>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="time" 
                stroke={colors.text}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={colors.text}
                style={{ fontSize: '12px' }}
                label={{ 
                  value: 'Volume (SOL)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: colors.text }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.grid}`,
                  borderRadius: '8px',
                  backdropFilter: 'blur(8px)'
                }}
                labelStyle={{ color: colors.text }}
              />
              <Bar dataKey="YES Volume" stackId="a" fill={colors.yes} isAnimationActive={false} />
              <Bar dataKey="NO Volume" stackId="a" fill={colors.no} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </Suspense>
      )}
      
      {/* Summary Stats - Memoized */}
      {chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Volume</div>
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {summaryStats.total.toFixed(2)} SOL
            </div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>YES Volume</div>
            <div className="text-lg font-bold text-[#00F0FF]">
              {summaryStats.yesTotal.toFixed(2)} SOL
            </div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NO Volume</div>
            <div className="text-lg font-bold text-[#FF0080]">
              {summaryStats.noTotal.toFixed(2)} SOL
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Memoize component
export const VolumeChart = memo(VolumeChartComponent);

