'use client';

import type { UserStats } from '@/lib/program/direct-read';

interface ProfileStatsProps {
  stats: UserStats;
  isOwnProfile: boolean;
}

const ProfileStats = ({ stats, isOwnProfile }: ProfileStatsProps) => {
  const statCards = [
    {
      label: 'Total Bets',
      value: stats.totalBets,
      icon: '🎲',
      color: 'blue',
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate.toFixed(1)}%`,
      icon: '🎯',
      color: stats.winRate >= 50 ? 'green' : 'red',
      subtitle: `${stats.wonBets} wins / ${stats.lostBets} losses`,
    },
    {
      label: 'Total Volume',
      value: `${stats.totalWagered.toFixed(2)} SOL`,
      icon: '💰',
      color: 'purple',
      subtitle: 'Total wagered',
    },
    {
      label: 'Profit',
      value: `${stats.profitLoss >= 0 ? '+' : ''}${stats.profitLoss.toFixed(4)} SOL`,
      icon: stats.profitLoss >= 0 ? '📈' : '📉',
      color: stats.profitLoss >= 0 ? 'green' : 'red',
      subtitle: `ROI: ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`,
      highlight: Math.abs(stats.profitLoss) > 0,
    },
  ];

  const getColorClasses = (color: string, highlight?: boolean) => {
    const colors = {
      blue: 'border-blue-500/50 bg-blue-500/10',
      green: highlight
        ? 'border-green-500 bg-green-500/20 ring-2 ring-green-500/50'
        : 'border-green-500/50 bg-green-500/10',
      red: highlight
        ? 'border-red-500 bg-red-500/20 ring-2 ring-red-500/50'
        : 'border-red-500/50 bg-red-500/10',
      purple: 'border-purple-500/50 bg-purple-500/10',
      gray: 'border-gray-600/50 bg-gray-800',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getTextColorClass = (color: string) => {
    const colors = {
      blue: 'text-blue-300',
      green: 'text-green-300',
      red: 'text-red-300',
      purple: 'text-purple-300',
      gray: 'text-gray-300',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  // Performance badge
  const getPerformanceBadge = () => {
    if (stats.roi >= 50) {
      return (
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-full">
          <span className="text-2xl mr-2">🏆</span>
          <span className="font-bold text-yellow-300">Elite Trader</span>
        </div>
      );
    }
    if (stats.roi >= 20) {
      return (
        <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border-2 border-green-500/50 rounded-full">
          <span className="text-2xl mr-2">⭐</span>
          <span className="font-bold text-green-300">Pro Trader</span>
        </div>
      );
    }
    if (stats.roi >= 0) {
      return (
        <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border-2 border-blue-500/50 rounded-full">
          <span className="text-2xl mr-2">✅</span>
          <span className="font-bold text-blue-300">Profitable</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center px-4 py-2 bg-gray-700/50 border-2 border-gray-600/50 rounded-full">
        <span className="text-2xl mr-2">📊</span>
        <span className="font-bold text-gray-300">Trader</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Performance Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Statistics</h2>
          {getPerformanceBadge()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`border rounded-lg p-6 transition-all ${getColorClasses(
              stat.color,
              stat.highlight
            )}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
            <div className={`text-2xl font-bold ${getTextColorClass(stat.color)}`}>
              {stat.value}
            </div>
            {stat.subtitle && (
              <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Active Bets</div>
          <div className="text-xl font-bold text-yellow-300">{stats.activeBets}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Resolved</div>
          <div className="text-xl font-bold text-gray-300">{stats.resolvedBets}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Total Won</div>
          <div className="text-xl font-bold text-green-300">
            {stats.totalWon.toFixed(2)} SOL
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">
            {isOwnProfile ? 'Unclaimed' : 'Total Claimed'}
          </div>
          <div className="text-xl font-bold text-blue-300">
            {isOwnProfile
              ? `${stats.unclaimedWinnings.toFixed(4)} SOL`
              : `${stats.totalClaimed.toFixed(2)} SOL`}
          </div>
        </div>
      </div>

      {/* Track Record Summary */}
      {stats.resolvedBets > 0 && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Track Record</h3>
          <div className="space-y-3">
            {/* Win Rate Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-white font-bold">{stats.winRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    stats.winRate >= 60
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : stats.winRate >= 40
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-rose-500'
                  }`}
                  style={{ width: `${stats.winRate}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalBets}</div>
                <div className="text-xs text-gray-400">Total Bets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">{stats.wonBets}</div>
                <div className="text-xs text-gray-400">Won</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-300">{stats.lostBets}</div>
                <div className="text-xs text-gray-400">Lost</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStats;





