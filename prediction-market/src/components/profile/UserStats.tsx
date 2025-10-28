'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface UserStatsData {
  totalBets: number;
  totalVolume: number;
  winRate: number;
  profitLoss: number;
  totalWon: number;
  totalLost: number;
  marketsCreated: number;
  rank: number | null;
}

interface UserStatsProps {
  stats: UserStatsData;
  address: string;
}

export const UserStats = ({ stats, address }: UserStatsProps) => {
  const { theme } = useTheme();
  
  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 8) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isProfitable = stats.profitLoss >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF0080] flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatAddress(address)}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Prediction Trader
                </p>
              </div>
            </div>
          </div>
          
          {stats.rank && (
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 text-[#FF7A2F]" />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rank</span>
              </div>
              <div className="text-3xl font-bold text-[#FF7A2F]">
                #{stats.rank}
              </div>
            </div>
          )}
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Bets</div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.totalBets}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Volume</div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.totalVolume.toFixed(2)} SOL
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Win Rate</div>
            <div className={`text-2xl font-bold flex items-center gap-2 ${
              stats.winRate >= 50 ? 'text-[#00F0FF]' : 'text-[#FF0080]'
            }`}>
              {stats.winRate.toFixed(1)}%
              {stats.winRate >= 50 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Profit/Loss</div>
            <div className={`text-2xl font-bold ${
              isProfitable ? 'text-[#00F0FF]' : 'text-[#FF0080]'
            }`}>
              {isProfitable ? '+' : ''}{stats.profitLoss.toFixed(2)} SOL
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Bets Won</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalWon}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Bets Lost</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalLost}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Average Bet Size</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalBets > 0 ? (stats.totalVolume / stats.totalBets).toFixed(2) : '0.00'} SOL
              </span>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Market Creation
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Markets Created</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.marketsCreated}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Avg Volume per Market</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.marketsCreated > 0 
                  ? (stats.totalVolume / stats.marketsCreated).toFixed(2) 
                  : '0.00'} SOL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

