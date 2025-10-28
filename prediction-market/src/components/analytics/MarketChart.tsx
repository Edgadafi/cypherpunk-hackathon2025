'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

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

export const MarketChart = ({ data, title = "Market Probability Over Time" }: MarketChartProps) => {
  const { theme } = useTheme();
  
  // Transform data for display
  const chartData = data.map(point => ({
    time: new Date(point.timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    Yes: (point.yesPrice * 100).toFixed(1),
    No: (point.noPrice * 100).toFixed(1),
  }));

  const colors = {
    yes: '#00F0FF', // Cyan
    no: '#FF0080',  // Magenta
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    text: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    bg: theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  };

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
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="No" 
              stroke={colors.no} 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

