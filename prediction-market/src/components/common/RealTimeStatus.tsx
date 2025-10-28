'use client';

import { RefreshCw, Pause, Play } from 'lucide-react';
import { formatLastUpdated } from '@/hooks/useRealTimeData';

interface RealTimeStatusProps {
  lastUpdated: Date | null;
  isRefreshing: boolean;
  isAutoRefreshEnabled: boolean;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
}

export default function RealTimeStatus({
  lastUpdated,
  isRefreshing,
  isAutoRefreshEnabled,
  onRefresh,
  onToggleAutoRefresh,
}: RealTimeStatusProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Last Updated */}
      <div className="flex items-center gap-2 text-gray-400">
        <RefreshCw
          className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`}
        />
        <span>
          {isRefreshing ? 'Updating...' : `Updated ${formatLastUpdated(lastUpdated)}`}
        </span>
      </div>

      {/* Manual Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Refresh now"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="hidden sm:inline">Refresh</span>
      </button>

      {/* Toggle Auto-Refresh */}
      <button
        onClick={onToggleAutoRefresh}
        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
          isAutoRefreshEnabled
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
        }`}
        title={isAutoRefreshEnabled ? 'Pause auto-refresh' : 'Resume auto-refresh'}
      >
        {isAutoRefreshEnabled ? (
          <>
            <Pause className="w-4 h-4" />
            <span className="hidden sm:inline">Live</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Paused</span>
          </>
        )}
      </button>

      {/* Live Indicator */}
      {isAutoRefreshEnabled && (
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <span className="text-green-400 font-medium hidden md:inline">LIVE</span>
        </div>
      )}
    </div>
  );
}





