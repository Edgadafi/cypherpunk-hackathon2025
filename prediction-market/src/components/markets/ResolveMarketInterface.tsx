'use client'

import { useState, useEffect } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import toast from 'react-hot-toast'
import { resolveMarketDirect } from '@/lib/program/direct'
import { fetchMarketDirect } from '@/lib/program/direct-read'
import type { MockMarket } from '@/lib/mock/markets'

interface ResolveMarketInterfaceProps {
  market: MockMarket
  onResolved?: () => void
}

export default function ResolveMarketInterface({
  market,
  onResolved,
}: ResolveMarketInterfaceProps) {
  const wallet = useAnchorWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null)
  const [isCheckingAuthority, setIsCheckingAuthority] = useState(true)
  const [isAuthority, setIsAuthority] = useState(false)

  // Verify authority from blockchain
  useEffect(() => {
    const checkAuthority = async () => {
      if (!wallet) {
        setIsAuthority(false)
        setIsCheckingAuthority(false)
        return
      }

      try {
        setIsCheckingAuthority(true)
        const marketPubkey = new PublicKey(market.id)
        const marketData = await fetchMarketDirect(marketPubkey)
        
        if (marketData) {
          const isMarketAuthority = marketData.authority.equals(wallet.publicKey)
          setIsAuthority(isMarketAuthority)
          console.log('Authority check:', isMarketAuthority ? '✅ User is authority' : '❌ User is not authority')
        } else {
          setIsAuthority(false)
        }
      } catch (error) {
        console.error('Error checking authority:', error)
        setIsAuthority(false)
      } finally {
        setIsCheckingAuthority(false)
      }
    }

    checkAuthority()
  }, [wallet?.publicKey, market.id])

  const handleResolve = async () => {
    if (!wallet) {
      toast.error('Please connect your wallet')
      return
    }

    if (selectedOutcome === null) {
      toast.error('Please select YES or NO as the winning outcome')
      return
    }

    const marketPubkey = new PublicKey(market.id)

    try {
      setIsSubmitting(true)

      console.log('Resolving market...')
      console.log('Market:', market.id)
      console.log('Outcome:', selectedOutcome ? 'YES' : 'NO')

      const signature = await resolveMarketDirect(
        wallet,
        marketPubkey,
        selectedOutcome
      )

      console.log('✅ Market resolved! Transaction:', signature)

      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`

      // Show success toast with transaction link
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold">Market resolved successfully!</span>
          <span className="text-sm">
            Winner: {selectedOutcome ? 'YES' : 'NO'}
          </span>
          <a 
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs underline"
          >
            View transaction →
          </a>
        </div>,
        { duration: 6000 }
      )

      // Callback to refresh market data
      if (onResolved) {
        setTimeout(() => onResolved(), 2000)
      }
    } catch (error: any) {
      console.error('Error resolving market:', error)

      let errorMessage = 'Failed to resolve market. Please try again.'

      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled by user.'
      } else if (error.message?.includes('Unauthorized') || error.message?.includes('ConstraintSigner')) {
        errorMessage = 'Only the market creator can resolve this market.'
      } else if (error.message?.includes('AlreadyResolved')) {
        errorMessage = 'This market has already been resolved.'
      } else if (error.message?.includes('MarketNotExpired')) {
        errorMessage = 'Cannot resolve: market has not expired yet.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage, { duration: 5000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Only show if wallet is connected
  if (!wallet) {
    return null
  }

  // Show loading state while checking authority
  if (isCheckingAuthority) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center gap-2">
          <span className="animate-spin">⏳</span>
          <span className="text-gray-400">Checking permissions...</span>
        </div>
      </div>
    )
  }

  // Don't show if user is not the authority
  if (!isAuthority) {
    return null
  }

  // If already resolved
  if (market.resolved) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-2">
          ✅ Market Resolved
        </h3>
        <p className="text-gray-400">
          Winner:{' '}
          <span className="text-white font-semibold">
            {market.winningOutcome ? 'YES' : 'NO'}
          </span>
        </p>
      </div>
    )
  }

  // Check if market has expired
  const now = Date.now()
  const isExpired = market.endTime.getTime() < now

  if (!isExpired) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
        <h3 className="text-yellow-300 font-bold text-lg mb-2">
          ⏳ Market Not Expired
        </h3>
        <p className="text-yellow-200/70 text-sm">
          This market cannot be resolved until after{' '}
          {market.endTime.toLocaleString()}
        </p>
      </div>
    )
  }

  // Resolution interface
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6">
      <h3 className="text-white font-bold text-lg mb-4">
        🎯 Resolve Market (Authority Only)
      </h3>

      <p className="text-gray-300 mb-6">
        As the market creator, you can now resolve this market. Select the
        winning outcome:
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setSelectedOutcome(true)}
          disabled={isSubmitting}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedOutcome === true
              ? 'border-green-500 bg-green-500/20'
              : 'border-gray-700 bg-gray-800/50 hover:border-green-500/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="text-green-400 text-xl font-bold mb-2">
            YES WINS
          </div>
          <div className="text-gray-400 text-sm">YES bettors will be paid</div>
        </button>

        <button
          onClick={() => setSelectedOutcome(false)}
          disabled={isSubmitting}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedOutcome === false
              ? 'border-red-500 bg-red-500/20'
              : 'border-gray-700 bg-gray-800/50 hover:border-red-500/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="text-red-400 text-xl font-bold mb-2">NO WINS</div>
          <div className="text-gray-400 text-sm">NO bettors will be paid</div>
        </button>
      </div>

      <button
        onClick={handleResolve}
        disabled={isSubmitting || selectedOutcome === null}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Resolving...
          </span>
        ) : (
          'Confirm and Resolve Market'
        )}
      </button>

      <p className="text-gray-400 text-xs mt-4 text-center">
        ⚠️ This action is irreversible
      </p>
    </div>
  )
}

