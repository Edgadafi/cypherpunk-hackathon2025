'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { UserStats } from '@/components/profile/UserStats';
import MarketCard from '@/components/markets/MarketCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import RealTimeStatus from '@/components/common/RealTimeStatus';
import { fetchAllMarketsDirect, fetchAllUserBets, calculateUserStats, type MarketAccount } from '@/lib/program/direct-read';
import { getUserRank } from '@/lib/program/leaderboard';
import { useCallback, useState } from 'react';
import { TrendingUp, Award, Grid3x3 } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const userAddress = params.address as string;
  
  const [activeTab, setActiveTab] = useState<'bets' | 'markets'>('bets');

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      // Convert string address to PublicKey
      const userPubkey = new PublicKey(userAddress);
      
      // Fetch all data in parallel
      const [allMarkets, userBets, rank] = await Promise.all([
        fetchAllMarketsDirect(),
        fetchAllUserBets(userPubkey),
        getUserRank(userAddress),
      ]);

      // Convert markets array to Map for calculateUserStats
      const marketsMap = new Map<string, MarketAccount>();
      allMarkets.forEach(market => {
        if (market.address) {
          marketsMap.set(market.address, market);
        }
      });

      // Calculate user stats
      const stats = await calculateUserStats(userBets, marketsMap);
      
      // Get markets created by this user
      const createdMarkets = allMarkets.filter(
        m => m.authority.toString() === userAddress
      );

      // Transform to UI format
      const transformedMarkets = createdMarkets.map(m => ({
        id: m.address,
        question: m.question,
        description: m.description,
        category: 'Other' as const,
        creator: userAddress.slice(0, 4) + '...' + userAddress.slice(-4),
        createdAt: new Date(m.createdAt * 1000),
        endTime: new Date(m.endTime * 1000),
        totalYesAmount: m.yesAmount / 1e9,
        totalNoAmount: m.noAmount / 1e9,
        resolved: m.resolved,
        winningOutcome: m.resolved ? m.winningOutcome : null,
      }));

      // Transform user bets to market cards
      const userBetMarkets = userBets.map(bet => {
        const market = allMarkets.find(m => m.address === bet.market.toString());
        if (!market) return null;
        
        return {
          id: bet.market.toString(),
          question: market.question,
          description: market.description,
          category: 'Other' as const,
          creator: market.authority.toString().slice(0, 4) + '...' + market.authority.toString().slice(-4),
          createdAt: new Date(market.createdAt * 1000),
          endTime: new Date(market.endTime * 1000),
          totalYesAmount: market.yesAmount / 1e9,
          totalNoAmount: market.noAmount / 1e9,
          resolved: market.resolved,
          winningOutcome: market.resolved ? market.winningOutcome : null,
        };
      }).filter(Boolean);

      return {
        stats: {
          ...stats,
          rank,
          marketsCreated: createdMarkets.length,
        },
        createdMarkets: transformedMarkets,
        userBetMarkets: userBetMarkets as any[],
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }, [userAddress]);

  const {
    data,
    isLoading,
    error,
    isRefreshing,
    lastUpdated,
    refresh,
    toggleAutoRefresh,
    isAutoRefreshEnabled,
  } = useRealTimeData({
    fetchData: fetchUserData,
    interval: 15000, // 15 seconds
    fetchOnMount: true,
    enabled: true,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className={`min-h-screen py-20 px-4 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4 animate-spin">⏳</div>
            <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Loading Profile...
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Fetching user data from blockchain
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className={`min-h-screen py-20 px-4 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Profile Not Found
            </h1>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {error?.message || 'Could not load user profile'}
            </p>
            <Link
              href="/leaderboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#FF0080] text-white font-semibold rounded-lg transition-all"
            >
              ← Back to Leaderboard
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { stats, createdMarkets, userBetMarkets } = data;

  return (
    <Layout>
      <div className={`min-h-screen py-20 px-4 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/leaderboard"
            className={`inline-flex items-center mb-6 transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">←</span> Back to Leaderboard
          </Link>

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

          {/* User Stats */}
          <UserStats stats={stats} address={userAddress} />

          {/* Tabs */}
          <div className="mt-8 mb-6">
            <div className={`flex gap-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveTab('bets')}
                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'bets'
                    ? theme === 'dark'
                      ? 'text-[#00F0FF] border-[#00F0FF]'
                      : 'text-[#00F0FF] border-[#00F0FF]'
                    : theme === 'dark'
                      ? 'text-gray-400 border-transparent hover:text-gray-300'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                Active Bets ({userBetMarkets.length})
              </button>
              <button
                onClick={() => setActiveTab('markets')}
                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'markets'
                    ? theme === 'dark'
                      ? 'text-[#FF0080] border-[#FF0080]'
                      : 'text-[#FF0080] border-[#FF0080]'
                    : theme === 'dark'
                      ? 'text-gray-400 border-transparent hover:text-gray-300'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
                Created Markets ({createdMarkets.length})
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'bets' && (
            <div>
              {userBetMarkets.length === 0 ? (
                <div className={`text-center py-12 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
                } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="text-6xl mb-4">🎲</div>
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    No Bets Yet
                  </h3>
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    This user hasn't placed any bets yet.
                  </p>
                  <Link
                    href="/markets"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#FF0080] text-white font-semibold rounded-lg transition-all"
                  >
                    Browse Markets
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBetMarkets.map((market) => (
                    <MarketCard key={market.id} market={market} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'markets' && (
            <div>
              {createdMarkets.length === 0 ? (
                <div className={`text-center py-12 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
                } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    No Markets Created
                  </h3>
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    This user hasn't created any markets yet.
                  </p>
                  <Link
                    href="/create-market"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#FF0080] text-white font-semibold rounded-lg transition-all"
                  >
                    Create Market
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdMarkets.map((market) => (
                    <MarketCard key={market.id} market={market} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

