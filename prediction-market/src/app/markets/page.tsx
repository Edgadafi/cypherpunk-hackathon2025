'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import WalletInfo from '@/components/wallet/WalletInfo'
import MarketCard from '@/components/markets/MarketCard'
import RealTimeStatus from '@/components/common/RealTimeStatus'
import { useWallet } from '@solana/wallet-adapter-react'
import { fetchAllMarketsDirect, calculateOdds, lamportsToSOL } from '@/lib/program/direct-read'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import {
  MOCK_MARKETS,
  CATEGORIES,
  type MockMarket,
} from '@/lib/mock/markets'

export default function MarketsPage() {
  const { connected } = useWallet()
  const [filteredMarkets, setFilteredMarkets] = useState<MockMarket[]>([])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Load markets from smart contract with real-time updates
  const fetchMarkets = useCallback(async (): Promise<MockMarket[]> => {
    try {
      // Fetch markets directly from blockchain
      const marketsData = await fetchAllMarketsDirect()

      console.log(`✅ Loaded ${marketsData.length} markets from blockchain`)

      if (marketsData.length === 0) {
        console.log("⚠️ No markets found, showing demo data")
        return MOCK_MARKETS
      }

      // Transform to UI format
      const transformed: MockMarket[] = marketsData.map((market) => {
        const odds = calculateOdds(market.yesAmount, market.noAmount);
        const totalVolume = lamportsToSOL(market.yesAmount + market.noAmount);
        
        return {
          id: market.address,
          question: market.question,
          description: market.description,
          category: 'Other', // Default category (not stored on-chain yet)
          creator: market.authority.toString().slice(0, 4) + '...' + market.authority.toString().slice(-4),
          createdAt: new Date(market.createdAt * 1000),
          endTime: new Date(market.endTime * 1000),
          totalYesAmount: lamportsToSOL(market.yesAmount),
          totalNoAmount: lamportsToSOL(market.noAmount),
          resolved: market.resolved,
          winningOutcome: market.resolved ? market.winningOutcome : null,
        };
      });

      // If no markets found, fallback to mock data for demo
      if (transformed.length === 0) {
        console.log('No on-chain markets found, using mock data')
        return MOCK_MARKETS
      }

      return transformed

    } catch (err: any) {
      console.error('Error loading markets:', err)
      // Fallback to mock data on error
      return MOCK_MARKETS
    }
  }, [])

  const {
    data: markets,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
    toggleAutoRefresh,
    isAutoRefreshEnabled,
  } = useRealTimeData({
    fetchData: fetchMarkets,
    interval: 10000, // Refresh every 10 seconds
    fetchOnMount: true,
    enabled: true,
  })

  // Debug logging
  useEffect(() => {
    console.log('📊 Markets page state:', {
      isLoading,
      marketsCount: markets?.length || 0,
      error: error?.message,
      lastUpdated: lastUpdated?.toISOString(),
    })
  }, [isLoading, markets, error, lastUpdated])

  // Apply filters
  useEffect(() => {
    if (!markets) {
      setFilteredMarkets([])
      return
    }

    let filtered = [...markets]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((m) => m.category === categoryFilter)
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((m) => !m.resolved)
    } else if (statusFilter === 'resolved') {
      filtered = filtered.filter((m) => m.resolved)
    }

    setFilteredMarkets(filtered)
  }, [markets, searchQuery, categoryFilter, statusFilter])

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Wallet Info or Demo Banner */}
          {connected ? (
            <div className="mb-6">
              <WalletInfo />
              {isLoading && !markets && (
                <div className="mt-4 bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl animate-spin">⏳</span>
                    <p className="text-blue-300 font-semibold">
                      Loading markets from blockchain...
                    </p>
                  </div>
                </div>
              )}
              {error && (
                <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="text-red-300 font-semibold">Error Loading Markets</p>
                      <p className="text-red-200/70 text-sm">{error?.message || 'Error loading markets'} - Showing demo data</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-yellow-300 font-semibold">
                    DEMO MODE - Using Mock Data
                  </p>
                  <p className="text-yellow-200/70 text-sm">
                    Connect your wallet to interact with live markets on Devnet
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Prediction Markets
                </h1>
                <p className="text-gray-400">
                  Trade on YES/NO markets about political promises, public projects,
                  and institutional commitments
                </p>
              </div>
            </div>

            {/* Real-Time Status */}
            <div className="flex justify-end">
              <RealTimeStatus
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                isAutoRefreshEnabled={isAutoRefreshEnabled}
                onRefresh={refresh}
                onToggleAutoRefresh={toggleAutoRefresh}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search markets..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Markets</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                Showing {filteredMarkets.length} of {markets?.length || 0} markets
              </p>
              <Link
                href="/create-market"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all"
              >
                + Create Market
              </Link>
            </div>
          </div>

          {/* Empty State */}
          {filteredMarkets.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Markets Found
              </h3>
              <p className="text-gray-400 mb-6">
                No markets match your filters. Try adjusting your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('All')
                  setStatusFilter('all')
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Markets Grid */}
          {filteredMarkets.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
