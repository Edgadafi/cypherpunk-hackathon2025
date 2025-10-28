'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

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

export const VolumeChart = ({ data, title = "Trading Volume" }: VolumeChartProps) => {
  const { theme } = useTheme();
  
  // Transform data for display
  const chartData = data.map(point => ({
    time: new Date(point.timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    'YES Volume': point.yesVolume,
    'NO Volume': point.noVolume,
    Total: point.volume,
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
            No volume data available yet.
          </p>
        </div>
      ) : (
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
            <Bar dataKey="YES Volume" stackId="a" fill={colors.yes} />
            <Bar dataKey="NO Volume" stackId="a" fill={colors.no} />
          </BarChart>
        </ResponsiveContainer>
      )}
      
      {/* Summary Stats */}
      {chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Volume</div>
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {chartData.reduce((sum, d) => sum + (d.Total || 0), 0).toFixed(2)} SOL
            </div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>YES Volume</div>
            <div className="text-lg font-bold text-[#00F0FF]">
              {chartData.reduce((sum, d) => sum + (d['YES Volume'] || 0), 0).toFixed(2)} SOL
            </div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NO Volume</div>
            <div className="text-lg font-bold text-[#FF0080]">
              {chartData.reduce((sum, d) => sum + (d['NO Volume'] || 0), 0).toFixed(2)} SOL
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

