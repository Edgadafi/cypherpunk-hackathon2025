'use client'

import { useState, useEffect } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import toast from 'react-hot-toast'
import { placeBetDirect } from '@/lib/program/direct'
import { RPC_ENDPOINT } from '@/lib/program/constants'
import { type MockMarket, getMarketOdds } from '@/lib/mock/markets'

interface BinaryTradingInterfaceProps {
  market: MockMarket
  onBetPlaced?: () => void
}

export default function BinaryTradingInterface({
  market,
  onBetPlaced,
}: BinaryTradingInterfaceProps) {
  const wallet = useAnchorWallet()
  const [betAmount, setBetAmount] = useState<string>('0.1')
  const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const odds = getMarketOdds(market)

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet?.publicKey) {
        setWalletBalance(null)
        return
      }

      setIsLoadingBalance(true)
      try {
        const connection = new Connection(RPC_ENDPOINT, 'confirmed')
        const balance = await connection.getBalance(wallet.publicKey)
        setWalletBalance(balance / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error('Error fetching balance:', error)
        setWalletBalance(null)
      } finally {
        setIsLoadingBalance(false)
      }
    }

    fetchBalance()
  }, [wallet?.publicKey])

  const handlePlaceBet = async () => {
    // Wallet check
    if (!wallet) {
      toast.error('Please connect your wallet first')
      return
    }

    // Outcome selection check
    if (selectedOutcome === null) {
      toast.error('Please select YES or NO')
      return
    }

    // Amount validation
    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (amount < 0.01) {
      toast.error('Minimum bet is 0.01 SOL')
      return
    }

    // Market status checks
    if (market.resolved) {
      toast.error('This market has already been resolved')
      return
    }

    const now = new Date()
    if (market.endTime < now) {
      toast.error('Trading has ended for this market')
      return
    }

    // Balance check (with buffer for transaction fees)
    if (walletBalance !== null) {
      const requiredAmount = amount + 0.001 // Add 0.001 SOL buffer for fees
      if (walletBalance < requiredAmount) {
        toast.error(
          `Insufficient balance. You have ${walletBalance.toFixed(4)} SOL but need ${requiredAmount.toFixed(4)} SOL (including fees)`
        )
        return
      }
    }

    setIsSubmitting(true)
    setSuccess(false)
    setTxSignature(null)

    try {
      const marketPubkey = new PublicKey(market.id)

      console.log('Placing bet...')
      console.log('Market:', market.id)
      console.log('Amount:', amount, 'SOL')
      console.log('Outcome:', selectedOutcome ? 'YES' : 'NO')

      const signature = await placeBetDirect(
        wallet,
        marketPubkey,
        amount,
        selectedOutcome
      )

      console.log('✅ Bet placed! Transaction:', signature)

      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`

      setTxSignature(signature)
      setSuccess(true)

      // Show success toast with transaction link
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold">Bet placed successfully!</span>
          <span className="text-sm">
            {amount} SOL on {selectedOutcome ? 'YES' : 'NO'}
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
        { duration: 5000 }
      )

      // Refresh balance after successful bet
      if (wallet?.publicKey) {
        const connection = new Connection(RPC_ENDPOINT, 'confirmed')
        const newBalance = await connection.getBalance(wallet.publicKey)
        setWalletBalance(newBalance / LAMPORTS_PER_SOL)
      }

      // Reset form after success
      setTimeout(() => {
        setSuccess(false)
        setBetAmount('0.1')
        setSelectedOutcome(null)
        setTxSignature(null)
        
        // Callback to refresh market data
        if (onBetPlaced) {
          onBetPlaced()
        }
      }, 3000)

    } catch (error: any) {
      console.error('Error placing bet:', error)

      let errorMessage = 'Failed to place bet. Please try again.'

      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled by user.'
      } else if (error.message?.includes('Insufficient funds')) {
        errorMessage = 'Insufficient SOL balance. Please fund your wallet.'
      } else if (error.message?.includes('MarketExpired')) {
        errorMessage = 'This market has expired.'
      } else if (error.message?.includes('MarketResolved')) {
        errorMessage = 'This market has already been resolved.'
      } else if (error.message?.includes('BetTooSmall')) {
        errorMessage = 'Bet amount too small. Minimum is 0.01 SOL.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage, { duration: 4000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculatePotentialWinnings = () => {
    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0 || selectedOutcome === null) return 0

    const currentOdds =
      selectedOutcome ? odds.yesPercentage : odds.noPercentage
    const multiplier = 100 / currentOdds
    return amount * multiplier
  }

  return (
    <div className="space-y-6">
      {/* Current Odds Display */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Current Odds</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedOutcome(true)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedOutcome === true
                ? 'border-green-500 bg-green-500/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-green-500/50'
            }`}
          >
            <div className="text-green-400 text-sm font-semibold mb-2">
              YES
            </div>
            <div className="text-white font-bold text-3xl mb-2">
              {odds.yesPercentage}%
            </div>
            <div className="text-gray-400 text-xs">
              {odds.yesPercentage}¢ per share
            </div>
          </button>

          <button
            onClick={() => setSelectedOutcome(false)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedOutcome === false
                ? 'border-red-500 bg-red-500/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-red-500/50'
            }`}
          >
            <div className="text-red-400 text-sm font-semibold mb-2">NO</div>
            <div className="text-white font-bold text-3xl mb-2">
              {odds.noPercentage}%
            </div>
            <div className="text-gray-400 text-xs">
              {odds.noPercentage}¢ per share
            </div>
          </button>
        </div>
      </div>

      {/* Bet Amount */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-white font-semibold">
            Amount (SOL)
          </label>
          {walletBalance !== null && (
            <span className="text-sm text-gray-400">
              Balance: {walletBalance.toFixed(4)} SOL
            </span>
          )}
          {isLoadingBalance && (
            <span className="text-sm text-gray-400">Loading balance...</span>
          )}
        </div>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          step="0.01"
          min="0.01"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {walletBalance !== null && parseFloat(betAmount) > 0 && (
          <div className="mt-2 text-sm text-gray-400">
            After bet: {(walletBalance - parseFloat(betAmount) - 0.001).toFixed(4)} SOL (est.)
          </div>
        )}
      </div>

      {/* Potential Winnings */}
      {selectedOutcome !== null && parseFloat(betAmount) > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-300 text-sm">Your Bet:</span>
            <span className="text-white font-bold">
              {parseFloat(betAmount).toFixed(2)} SOL
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-300 text-sm">
              Potential Winnings:
            </span>
            <span className="text-white font-bold">
              {calculatePotentialWinnings().toFixed(2)} SOL
            </span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-300 text-center font-semibold mb-2">
            ✓ Bet placed successfully!
          </p>
          {txSignature && (
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs text-center block underline"
            >
              View transaction →
            </a>
          )}
        </div>
      )}

      {/* Place Bet Button */}
      <button
        onClick={handlePlaceBet}
        disabled={
          isSubmitting ||
          selectedOutcome === null ||
          parseFloat(betAmount) <= 0
        }
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Placing Bet...
          </span>
        ) : (
          `Place ${selectedOutcome === true ? 'YES' : selectedOutcome === false ? 'NO' : ''} Bet`
        )}
      </button>
    </div>
  )
}


