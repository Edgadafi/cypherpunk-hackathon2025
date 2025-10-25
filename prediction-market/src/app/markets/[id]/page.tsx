'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import WalletInfo from '@/components/wallet/WalletInfo'
import BinaryTradingInterface from '@/components/markets/BinaryTradingInterface'
import ResolveMarketInterface from '@/components/markets/ResolveMarketInterface'
import ClaimWinnings from '@/components/markets/ClaimWinnings'
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { fetchMarketDirect, lamportsToSOL } from '@/lib/program/direct-read'
import { getMarketById, getMarketOdds, type MockMarket } from '@/lib/mock/markets'
import Link from 'next/link'

export default function MarketDetailPage() {
  const { connected } = useWallet()
  const wallet = useAnchorWallet()
  const router = useRouter()
  const params = useParams()
  const marketId = params.id as string

  const [market, setMarket] = useState<MockMarket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load market from blockchain
  const loadMarketData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true)
      else setIsRefreshing(true)
      
      setError(null)

      // Try to fetch from blockchain using direct method
      const marketPubkey = new PublicKey(marketId)
      const marketData = await fetchMarketDirect(marketPubkey)

      if (marketData) {
        // Transform to UI format
        const transformed: MockMarket = {
          id: marketId,
          question: marketData.question,
          description: marketData.description,
          category: 'Other', // Default category
          creator: marketData.authority.toString().slice(0, 4) + '...' + marketData.authority.toString().slice(-4),
          createdAt: new Date(marketData.createdAt * 1000),
          endTime: new Date(marketData.endTime * 1000),
          totalYesAmount: lamportsToSOL(marketData.yesAmount),
          totalNoAmount: lamportsToSOL(marketData.noAmount),
          resolved: marketData.resolved,
          winningOutcome: marketData.resolved ? marketData.winningOutcome : null,
        }
        setMarket(transformed)
        console.log('✅ Market data loaded/refreshed')
      } else {
        throw new Error('Market not found on-chain')
      }
    } catch (err: any) {
      console.error('Error loading market:', err)
      // Fallback to mock data
      const mockMarket = getMarketById(marketId)
      if (mockMarket) {
        setMarket(mockMarket)
        setError('Using demo data - connect wallet for live data')
      } else {
        setError('Market not found')
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefreshMarket = () => {
    console.log('🔄 Refreshing market data...')
    loadMarketData(false)
  }

  // Load market on mount
  useEffect(() => {
    loadMarketData(true)
  }, [marketId])

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-4 animate-spin">⏳</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Loading Market...
            </h1>
            <p className="text-gray-400">
              Fetching market data from blockchain
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!market) {
    return (
      <Layout>
        <div className="min-h-screen bg-black py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Market Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              The market you're looking for doesn't exist.
            </p>
            <Link
              href="/markets"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              ← Back to Markets
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const odds = getMarketOdds(market)
  const endDate = new Date(market.endTime)
  const isExpired = endDate < new Date() && !market.resolved

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/markets"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <span className="mr-2">←</span> Back to Markets
          </Link>

          {/* Wallet Info or Demo Banner */}
          {connected ? (
            <div className="mb-6">
              <WalletInfo />
              {error && (
                <div className="mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-yellow-300 text-sm">{error}</p>
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
                    DEMO MODE - Using Mock Trading
                  </p>
                  <p className="text-yellow-200/70 text-sm">
                    Connect your wallet to place real trades on Devnet
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market Header */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {market.imageUrl && (
                      <div className="text-4xl">{market.imageUrl}</div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded font-medium">
                          {market.category}
                        </span>
                      </div>
                      <h1 className="text-2xl font-bold text-white mb-2">
                        {market.question}
                      </h1>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-sm rounded font-medium whitespace-nowrap ${
                      market.resolved
                        ? 'bg-blue-500/20 text-blue-300'
                        : isExpired
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {market.resolved
                      ? '✓ Resolved'
                      : isExpired
                      ? '⏰ Expired'
                      : '🟢 Active'}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-2">
                    Resolution Criteria
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {market.description}
                  </p>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">VOLUME</p>
                    <p className="text-white font-bold">
                      {odds.totalPool.toFixed(1)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">CREATOR</p>
                    <p className="text-white font-bold font-mono text-sm">
                      {market.creator}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">ENDS</p>
                    <p className="text-white font-bold">
                      {endDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Resolved Result */}
                {market.resolved && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-blue-300 text-sm font-semibold mb-2">
                        🏆 Market Resolved
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {market.winningOutcome ? 'YES' : 'NO'} Won
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Resolution Interface (for market creator) */}
              <ResolveMarketInterface 
                market={market} 
                onResolved={handleRefreshMarket}
              />

              {/* Claim Winnings Interface */}
              <ClaimWinnings 
                market={market} 
                onClaimed={handleRefreshMarket}
              />

              {/* Activity Feed (Placeholder) */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <span className="text-purple-300 text-sm">👤</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            User {String.fromCharCode(64 + i)}x...
                            {String.fromCharCode(96 + i * 2)}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {i} hour{i > 1 ? 's' : ''} ago
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          {(Math.random() * 5).toFixed(1)} SOL
                        </p>
                        <p
                          className={`text-xs ${
                            i % 2 === 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {i % 2 === 0 ? 'YES' : 'NO'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trading Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">
                  {market.resolved ? 'Market Closed' : 'Place Your Bet'}
                </h2>

                {market.resolved || isExpired ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">
                      {market.resolved ? '🔒' : '⏰'}
                    </div>
                    <p className="text-gray-400">
                      {market.resolved
                        ? 'This market has been resolved'
                        : 'Trading has ended for this market'}
                    </p>
                  </div>
                ) : (
                  <BinaryTradingInterface 
                    market={market} 
                    onBetPlaced={handleRefreshMarket}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
