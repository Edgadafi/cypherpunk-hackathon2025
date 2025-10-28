'use client';

import { useMemo, memo, lazy, Suspense } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import dynamic from 'next/dynamic';

// Lazy load Recharts (reduces initial bundle by ~50KB)
// @ts-ignore - Recharts types don't align perfectly with next/dynamic
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
// @ts-ignore
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
// @ts-ignore
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
// @ts-ignore
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
// @ts-ignore
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
// @ts-ignore
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
// @ts-ignore
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
// @ts-ignore
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

interface PricePoint {
  timestamp: number;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

interface MarketChartProps {
  data: PricePoint[];
  title?: string;
}

const MarketChartComponent = ({ data, title = "Market Probability Over Time" }: MarketChartProps) => {
  const { theme } = useTheme();
  
  // Memoize chart data transformation (expensive operation)
  const chartData = useMemo(() => {
    // Limit to max 20 points for performance
    const step = Math.max(1, Math.floor(data.length / 20));
    return data
      .filter((_, index) => index % step === 0)
      .map(point => ({
        time: new Date(point.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        Yes: (point.yesPrice * 100).toFixed(1),
        No: (point.noPrice * 100).toFixed(1),
      }));
  }, [data]);

  // Memoize colors object
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
            No data available yet. Chart will populate after the first trades.
          </p>
        </div>
      ) : (
        <Suspense fallback={
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin text-3xl">📊</div>
          </div>
        }>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="time" 
                stroke={colors.text}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={colors.text}
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
                label={{ 
                  value: 'Probability (%)', 
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Yes" 
                stroke={colors.yes} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="No" 
                stroke={colors.no} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Suspense>
      )}
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const MarketChart = memo(MarketChartComponent);

