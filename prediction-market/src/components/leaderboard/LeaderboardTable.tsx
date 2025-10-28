'use client';

import Link from 'next/link';
import type { LeaderboardEntry } from '@/lib/program/leaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserWallet?: string;
}

const LeaderboardTable = ({ entries, currentUserWallet }: LeaderboardTableProps) => {
  const formatWallet = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full text-white font-bold text-lg shadow-lg">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full text-white font-bold text-lg shadow-lg">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full text-white font-bold text-lg shadow-lg">
          🥉
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full text-gray-300 font-bold">
        #{rank}
      </div>
    );
  };

  const getPerformanceBadge = (roi: number) => {
    if (roi >= 50) return { text: '🏆 Elite', color: 'text-yellow-300' };
    if (roi >= 20) return { text: '⭐ Pro', color: 'text-green-300' };
    if (roi >= 0) return { text: '✅ Profitable', color: 'text-blue-300' };
    return { text: '📊 Trader', color: 'text-gray-400' };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-4 text-gray-400 font-medium">Rank</th>
            <th className="text-left p-4 text-gray-400 font-medium">Trader</th>
            <th className="text-right p-4 text-gray-400 font-medium">Bets</th>
            <th className="text-right p-4 text-gray-400 font-medium">Win Rate</th>
            <th className="text-right p-4 text-gray-400 font-medium">Volume</th>
            <th className="text-right p-4 text-gray-400 font-medium">Profit</th>
            <th className="text-right p-4 text-gray-400 font-medium">ROI</th>
            <th className="text-left p-4 text-gray-400 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isCurrentUser = currentUserWallet === entry.wallet;
            const badge = getPerformanceBadge(entry.stats.roi);

            return (
              <tr
                key={entry.wallet}
                className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                  isCurrentUser ? 'bg-blue-500/10 border-blue-500/30' : ''
                }`}
              >
                {/* Rank */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {getRankBadge(entry.rank)}
                  </div>
                </td>

                {/* Trader */}
                <td className="p-4">
                  <Link
                    href={`/profile/${entry.wallet}`}
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors group"
                  >
                    <span className="font-mono text-white group-hover:text-blue-400">
                      {formatWallet(entry.wallet)}
                    </span>
                    {isCurrentUser && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/50">
                        You
                      </span>
                    )}
                  </Link>
                </td>

                {/* Bets */}
                <td className="p-4 text-right">
                  <div className="text-white font-medium">{entry.stats.totalBets}</div>
                  <div className="text-xs text-gray-500">
                    {entry.stats.wonBets}W / {entry.stats.lostBets}L
                  </div>
                </td>

                {/* Win Rate */}
                <td className="p-4 text-right">
                  <div
                    className={`text-lg font-bold ${
                      entry.stats.winRate >= 60
                        ? 'text-green-400'
                        : entry.stats.winRate >= 40
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {entry.stats.winRate.toFixed(1)}%
                  </div>
                </td>

                {/* Volume */}
                <td className="p-4 text-right">
                  <div className="text-white font-mono">
                    {entry.stats.totalWagered.toFixed(2)} SOL
                  </div>
                </td>

                {/* Profit */}
                <td className="p-4 text-right">
                  <div
                    className={`font-mono font-bold ${
                      entry.stats.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {entry.stats.profitLoss >= 0 ? '+' : ''}
                    {entry.stats.profitLoss.toFixed(4)} SOL
                  </div>
                </td>

                {/* ROI */}
                <td className="p-4 text-right">
                  <div
                    className={`text-xl font-bold ${
                      entry.stats.roi >= 50
                        ? 'text-yellow-400'
                        : entry.stats.roi >= 20
                        ? 'text-green-400'
                        : entry.stats.roi >= 0
                        ? 'text-blue-400'
                        : 'text-red-400'
                    }`}
                  >
                    {entry.stats.roi >= 0 ? '+' : ''}
                    {entry.stats.roi.toFixed(1)}%
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className={`text-sm ${badge.color}`}>{badge.text}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No traders found
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;





