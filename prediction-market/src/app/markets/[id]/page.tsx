'use client'

import React, { useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import WalletInfo from '@/components/wallet/WalletInfo'
import BinaryTradingInterface from '@/components/markets/BinaryTradingInterface'
import ResolveMarketInterface from '@/components/markets/ResolveMarketInterface'
import ClaimWinnings from '@/components/markets/ClaimWinnings'
import OracleStatus from '@/components/markets/OracleStatus'
import AutoResolveButton from '@/components/markets/AutoResolveButton'
import ShareMarket from '@/components/social/ShareMarket'
import RealTimeStatus from '@/components/common/RealTimeStatus'
import { MarketChart } from '@/components/analytics/MarketChart'
import { VolumeChart } from '@/components/analytics/VolumeChart'
import { TradeHistory } from '@/components/analytics/TradeHistory'
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { fetchMarketDirect, lamportsToSOL } from '@/lib/program/direct-read'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import { getMarketById, getMarketOdds, type MockMarket } from '@/lib/mock/markets'
import Link from 'next/link'

export default function MarketDetailPage() {
  const { connected } = useWallet()
  const wallet = useAnchorWallet()
  const router = useRouter()
  const params = useParams()
  const marketId = params.id as string

  // State for raw market data (includes oracle fields)
  const [rawMarketData, setRawMarketData] = React.useState<Awaited<ReturnType<typeof fetchMarketDirect>> | null>(null)

  // Load market from blockchain with real-time updates
  const fetchMarket = useCallback(async (): Promise<MockMarket | null> => {
    try {
      // Try to fetch from blockchain using direct method
      const marketData = await fetchMarketDirect(marketId)

      if (marketData) {
        // Save raw data for oracle components
        setRawMarketData(marketData)
        
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
        console.log('✅ Market data loaded/refreshed')
        return transformed
      } else {
        throw new Error('Market not found on-chain')
      }
    } catch (err: any) {
      console.error('Error loading market:', err)
      // Fallback to mock data
      const mockMarket = getMarketById(marketId)
      return mockMarket || null
    }
  }, [marketId])

  const {
    data: market,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
    toggleAutoRefresh,
    isAutoRefreshEnabled,
  } = useRealTimeData({
    fetchData: fetchMarket,
    interval: 5000, // Refresh every 5 seconds (faster for market detail)
    fetchOnMount: true,
    enabled: true,
  })

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

  // Memoize mock analytics data generation (expensive operations)
  const mockPriceData = useMemo(() => {
    const now = Date.now();
    const startTime = market.createdAt.getTime();
    const duration = now - startTime;
    const points = 10;
    
    return Array.from({ length: points }, (_, i) => {
      const timestamp = startTime + (duration / points) * i;
      const progress = i / points;
      // Simulate price evolution towards current odds
      const yesPrice = 0.5 + (odds.yesOdds - 0.5) * progress + (Math.random() - 0.5) * 0.1;
      return {
        timestamp,
        yesPrice: Math.max(0.1, Math.min(0.9, yesPrice)),
        noPrice: Math.max(0.1, Math.min(0.9, 1 - yesPrice)),
        volume: market.totalYesAmount + market.totalNoAmount,
      };
    });
  }, [market.createdAt, market.totalYesAmount, market.totalNoAmount, odds.yesOdds]);

  const mockVolumeData = useMemo(() => {
    const now = Date.now();
    const startTime = market.createdAt.getTime();
    const duration = now - startTime;
    const days = Math.ceil(duration / (1000 * 60 * 60 * 24));
    const points = Math.min(days, 7); // Show last 7 days max
    
    return Array.from({ length: points }, (_, i) => {
      const timestamp = startTime + (duration / points) * i;
      const totalVol = market.totalYesAmount + market.totalNoAmount;
      const dayVolume = totalVol / points;
      return {
        timestamp,
        volume: dayVolume * (0.8 + Math.random() * 0.4),
        yesVolume: (dayVolume * odds.yesOdds) * (0.8 + Math.random() * 0.4),
        noVolume: (dayVolume * odds.noOdds) * (0.8 + Math.random() * 0.4),
      };
    });
  }, [market.createdAt, market.totalYesAmount, market.totalNoAmount, odds.yesOdds, odds.noOdds]);

  const mockTradeHistory = useMemo(() => {
    const trades = [];
    const tradeCount = Math.min(Math.floor((market.totalYesAmount + market.totalNoAmount) / 0.5), 20);
    
    for (let i = 0; i < tradeCount; i++) {
      const side = Math.random() > odds.yesOdds ? 'no' : 'yes';
      trades.push({
        signature: `mock_${marketId}_${i}`,
        trader: rawMarketData?.authority.toString() || `${Math.random().toString(36).substr(2, 40)}`,
        side,
        amount: 0.5 + Math.random() * 2,
        timestamp: market.createdAt.getTime() + Math.random() * (Date.now() - market.createdAt.getTime()),
        price: side === 'yes' ? odds.yesOdds : odds.noOdds,
      });
    }
    
    return trades.sort((a, b) => b.timestamp - a.timestamp);
  }, [market.createdAt, market.totalYesAmount, market.totalNoAmount, odds.yesOdds, odds.noOdds, marketId, rawMarketData?.authority]);

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
                    <p className="text-yellow-300 text-sm">{error.message || 'An error occurred'}</p>
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

                  <div className="flex items-center gap-2">
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
                    <ShareMarket market={market} />
                  </div>
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
                    <Link 
                      href={`/profile/${rawMarketData?.authority.toString() || 'unknown'}`}
                      className="text-white font-bold font-mono text-sm hover:text-[#00F0FF] transition-colors"
                    >
                      {market.creator}
                    </Link>
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

              {/* Oracle Status (if oracle-enabled) */}
              {rawMarketData?.oracleEnabled && rawMarketData?.oraclePriceFeedId && (
                <OracleStatus
                  oracleEnabled={rawMarketData.oracleEnabled}
                  oracleFeedId={rawMarketData.oraclePriceFeedId}
                  oracleThreshold={rawMarketData.oracleThreshold || 0}
                  oracleComparison={rawMarketData.oracleComparison || 0}
                  endTime={rawMarketData.endTime}
                  resolved={rawMarketData.resolved}
                />
              )}

              {/* Auto-Resolve Button (for oracle markets) */}
              {rawMarketData?.oracleEnabled && rawMarketData?.oraclePriceFeedId && !market.resolved && (
                <AutoResolveButton
                  marketId={market.id}
                  oracleEnabled={rawMarketData.oracleEnabled}
                  oracleFeedId={rawMarketData.oraclePriceFeedId}
                  endTime={rawMarketData.endTime}
                  resolved={rawMarketData.resolved}
                  onResolved={refresh}
                />
              )}

              {/* Resolution Interface (for manual resolution - only for non-oracle markets) */}
              {!rawMarketData?.oracleEnabled && (
                <ResolveMarketInterface 
                  market={market} 
                  onResolved={refresh}
                />
              )}

              {/* Oracle markets message (if user tries to resolve manually) */}
              {rawMarketData?.oracleEnabled && !market.resolved && (
                <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🤖</div>
                    <div>
                      <h3 className="text-blue-300 font-bold text-lg mb-2">
                        Oracle-Powered Market
                      </h3>
                      <p className="text-blue-200/80 text-sm mb-3">
                        This market uses Pyth Network oracle for automatic resolution.
                        Manual resolution is not available.
                      </p>
                      <p className="text-blue-300 text-sm font-semibold">
                        → Use the "Auto-Resolve with Oracle" button above after the market expires.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Claim Winnings Interface */}
              <ClaimWinnings 
                market={market} 
                onClaimed={refresh}
              />

              {/* Market Analytics - Charts (memoized data) */}
              <div className="space-y-6">
                <MarketChart 
                  data={mockPriceData} 
                  title="Probability Over Time"
                />
                
                <VolumeChart 
                  data={mockVolumeData} 
                  title="Trading Volume"
                />
                
                <TradeHistory 
                  trades={mockTradeHistory} 
                  title="Recent Trades"
                  maxItems={10}
                />
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
                    onBetPlaced={refresh}
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
