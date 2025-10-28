'use client';

import { useState, useCallback } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import Layout from '@/components/layout/Layout';
import WalletInfo from '@/components/wallet/WalletInfo';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import RealTimeStatus from '@/components/common/RealTimeStatus';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import {
  fetchLeaderboard,
  getUserRank,
  type LeaderboardEntry,
  type LeaderboardSortBy,
} from '@/lib/program/leaderboard';

interface LeaderboardData {
  entries: LeaderboardEntry[];
  userRank: number | null;
}

export default function LeaderboardPage() {
  const wallet = useAnchorWallet();
  
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>('roi');
  const [limit, setLimit] = useState(50);

  // Load leaderboard with real-time updates
  const fetchLeaderboardData = useCallback(async (): Promise<LeaderboardData> => {
    try {
      console.log('🏆 Loading leaderboard...');

      const leaderboardData = await fetchLeaderboard(sortBy, limit);

      // Get user's rank if wallet connected
      let rank: number | null = null;
      if (wallet) {
        rank = await getUserRank(wallet.publicKey.toBase58(), sortBy);
      }

      return {
        entries: leaderboardData,
        userRank: rank,
      };
    } catch (error) {
      console.error('❌ Error loading leaderboard:', error);
      return {
        entries: [],
        userRank: null,
      };
    }
  }, [sortBy, limit, wallet]);

  const {
    data: leaderboardData,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
    toggleAutoRefresh,
    isAutoRefreshEnabled,
  } = useRealTimeData({
    fetchData: fetchLeaderboardData,
    interval: 15000, // Refresh every 15 seconds
    fetchOnMount: true,
    enabled: true,
  });

  const sortOptions: { value: LeaderboardSortBy; label: string; icon: string }[] = [
    { value: 'roi', label: 'ROI', icon: '📈' },
    { value: 'winRate', label: 'Win Rate', icon: '🎯' },
    { value: 'volume', label: 'Volume', icon: '💰' },
    { value: 'profit', label: 'Profit', icon: '💵' },
    { value: 'totalBets', label: 'Total Bets', icon: '🎲' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <WalletInfo />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white">🏆 Leaderboard</h1>
          </div>
          <p className="text-gray-400">
            Top prediction market traders ranked by performance
          </p>
        </div>

        {/* User Rank Card */}
        {wallet && leaderboardData?.userRank && (
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Your Rank</div>
                <div className="text-3xl font-bold text-white">#{leaderboardData.userRank}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Sorted by</div>
                <div className="text-lg font-semibold text-blue-300">
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 text-sm font-medium">Sort by:</span>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  sortBy === option.value
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center mb-6">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-300 mb-2">Error al cargar</h2>
            <p className="text-red-200/80 text-sm mb-4">
              {error.message || 'No se pudo cargar el leaderboard'}
            </p>
            <button
              onClick={refresh}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading leaderboard...</p>
            <p className="text-gray-500 text-sm mt-2">
              This may take a moment while we fetch all trader data
            </p>
          </div>
        )}

        {/* Leaderboard Table */}
        {!isLoading && !error && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
              <LeaderboardTable
                entries={leaderboardData?.entries || []}
                currentUserWallet={wallet?.publicKey.toBase58()}
              />
            </div>

            {/* Load More */}
            {(leaderboardData?.entries.length || 0) >= limit && (
              <div className="text-center">
                <button
                  onClick={() => setLimit((prev) => prev + 50)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Load More Traders
                </button>
              </div>
            )}

            {/* Real-Time Status */}
            <div className="mb-6 flex justify-end">
              <RealTimeStatus
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                isAutoRefreshEnabled={isAutoRefreshEnabled}
                onRefresh={refresh}
                onToggleAutoRefresh={toggleAutoRefresh}
              />
            </div>

            {/* Stats Summary */}
            {(leaderboardData?.entries.length || 0) > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="text-sm text-gray-400 mb-1">Total Traders</div>
                  <div className="text-3xl font-bold text-white">{leaderboardData?.entries.length || 0}</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="text-sm text-gray-400 mb-1">Avg Win Rate</div>
                  <div className="text-3xl font-bold text-green-300">
                    {((leaderboardData?.entries || []).length > 0 ?
                      (leaderboardData?.entries.reduce((sum, e) => sum + e.stats.winRate, 0) || 0) /
                      (leaderboardData?.entries.length || 1)
                      : 0).toFixed(1)}
                    %
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="text-sm text-gray-400 mb-1">Total Volume</div>
                  <div className="text-3xl font-bold text-purple-300">
                    {(leaderboardData?.entries || [])
                      .reduce((sum, e) => sum + e.stats.totalWagered, 0)
                      .toFixed(2)}{' '}
                    SOL
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && (leaderboardData?.entries.length || 0) === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Traders Yet</h2>
            <p className="text-gray-400 mb-6">
              Be the first to place bets and claim the #1 spot!
            </p>
            <button
              onClick={() => (window.location.href = '/markets')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Markets
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

