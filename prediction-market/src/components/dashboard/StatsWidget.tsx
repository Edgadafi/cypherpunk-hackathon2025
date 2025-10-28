'use client';

import type { UserStats } from '@/lib/program/direct-read';

interface StatsWidgetProps {
  stats: UserStats;
  isLoading?: boolean;
}

const StatsWidget = ({ stats, isLoading = false }: StatsWidgetProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Bets',
      value: stats.totalBets,
      icon: '🎲',
      color: 'blue',
    },
    {
      label: 'Active Bets',
      value: stats.activeBets,
      icon: '⏳',
      color: 'yellow',
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate.toFixed(1)}%`,
      icon: '🎯',
      color: stats.winRate >= 50 ? 'green' : 'red',
      subtitle: `${stats.wonBets}W / ${stats.lostBets}L`,
    },
    {
      label: 'Total Wagered',
      value: `${stats.totalWagered.toFixed(4)} SOL`,
      icon: '💰',
      color: 'purple',
    },
    {
      label: 'Total Won',
      value: `${stats.totalWon.toFixed(4)} SOL`,
      icon: '🏆',
      color: 'green',
    },
    {
      label: 'Total Claimed',
      value: `${stats.totalClaimed.toFixed(4)} SOL`,
      icon: '✅',
      color: 'green',
    },
    {
      label: 'Unclaimed',
      value: `${stats.unclaimedWinnings.toFixed(4)} SOL`,
      icon: '💎',
      color: stats.unclaimedWinnings > 0 ? 'green' : 'gray',
      highlight: stats.unclaimedWinnings > 0,
    },
    {
      label: 'Profit/Loss',
      value: `${stats.profitLoss >= 0 ? '+' : ''}${stats.profitLoss.toFixed(4)} SOL`,
      icon: stats.profitLoss >= 0 ? '📈' : '📉',
      color: stats.profitLoss >= 0 ? 'green' : 'red',
      subtitle: `ROI: ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`,
    },
  ];

  const getColorClasses = (color: string, highlight?: boolean) => {
    const colors = {
      blue: 'border-blue-500/50 bg-blue-500/10',
      yellow: 'border-yellow-500/50 bg-yellow-500/10',
      green: highlight 
        ? 'border-green-500 bg-green-500/20 ring-2 ring-green-500/50'
        : 'border-green-500/50 bg-green-500/10',
      red: 'border-red-500/50 bg-red-500/10',
      purple: 'border-purple-500/50 bg-purple-500/10',
      gray: 'border-gray-600/50 bg-gray-800',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getTextColorClass = (color: string) => {
    const colors = {
      blue: 'text-blue-300',
      yellow: 'text-yellow-300',
      green: 'text-green-300',
      red: 'text-red-300',
      purple: 'text-purple-300',
      gray: 'text-gray-300',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Statistics</h2>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`border rounded-lg p-6 transition-all ${getColorClasses(
              stat.color,
              stat.highlight
            )} ${stat.highlight ? 'transform hover:scale-105' : ''}`}
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

      {/* Quick Insights */}
      {stats.unclaimedWinnings > 0 && (
        <div className="bg-gradient-to-r from-green-900/40 to-gray-800 border-2 border-green-500/50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-3xl mr-3">💰</div>
            <div>
              <div className="font-bold text-green-300">
                You have {stats.unclaimedWinnings.toFixed(4)} SOL in unclaimed winnings!
              </div>
              <div className="text-sm text-gray-400">
                Scroll down to claim your winnings from resolved markets
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsWidget;





