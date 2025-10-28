'use client';

import { useState, useEffect } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { claimWinningsDirect } from '@/lib/program/direct';
import { fetchUserBet, calculateWinnings, lamportsToSOL, type BetAccount, type MarketAccount } from '@/lib/program/direct-read';
import type { MockMarket } from '@/lib/mock/markets';

interface ClaimWinningsProps {
  market: MockMarket;
  onClaimed?: () => void;
}

const ClaimWinnings = ({ market, onClaimed }: ClaimWinningsProps) => {
  const wallet = useAnchorWallet();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userBet, setUserBet] = useState<BetAccount | null>(null);
  const [winningsInfo, setWinningsInfo] = useState({
    hasWinnings: false,
    canClaim: false,
    winningsSOL: 0,
    multiplier: 0,
  });

  // Fetch user's bet and calculate winnings
  useEffect(() => {
    const fetchBetInfo = async () => {
      console.log('💰 ClaimWinnings: Checking for winnings...')
      console.log('  Market ID:', market.id)
      console.log('  Wallet:', wallet?.publicKey?.toString())
      console.log('  Market resolved:', market.resolved)
      
      if (!wallet || !market.resolved) {
        console.log('  ❌ No wallet or market not resolved')
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const marketPubkey = new PublicKey(market.id);
        const bet = await fetchUserBet(wallet.publicKey, marketPubkey);

        if (!bet) {
          console.log('  ❌ No bet found for user');
          setIsLoading(false);
          return;
        }
        
        console.log('  ✅ Bet found:', {
          amount: bet.amount / 1e9,
          outcome: bet.outcome ? 'YES' : 'NO',
          claimed: bet.claimed
        })

        setUserBet(bet);

        // Calculate winnings
        const winnings = calculateWinnings(bet, {
          address: market.id,
          authority: new PublicKey(market.id), // placeholder
          question: market.question,
          description: market.description || '',
          endTime: Math.floor(market.endTime.getTime() / 1000),
          createdAt: Math.floor(market.createdAt.getTime() / 1000),
          yesAmount: Math.floor(market.totalYesAmount * 1e9), // Convert SOL to lamports
          noAmount: Math.floor(market.totalNoAmount * 1e9), // Convert SOL to lamports
          resolved: market.resolved,
          winningOutcome: market.winningOutcome || false,
        });

        setWinningsInfo(winnings);
      } catch (error) {
        console.error('Error fetching bet info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBetInfo();
  }, [wallet, market]);

  const handleClaim = async () => {
    if (!wallet) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!winningsInfo.canClaim) {
      toast.error('No winnings to claim');
      return;
    }

    try {
      setIsClaiming(true);
      const marketPubkey = new PublicKey(market.id);

      const signature = await claimWinningsDirect(wallet, marketPubkey);

      toast.success(
        <div>
          <div className="font-bold">Winnings claimed!</div>
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline"
          >
            View on Explorer
          </a>
        </div>,
        { duration: 6000 }
      );

      // Update local state
      setWinningsInfo({
        hasWinnings: false,
        canClaim: false,
        winningsSOL: 0,
        multiplier: 0,
      });

      // Callback to refresh parent
      if (onClaimed) {
        onClaimed();
      }
    } catch (error: any) {
      console.error('Error claiming winnings:', error);

      let errorMessage = 'Failed to claim winnings';

      if (error.message?.includes('AlreadyClaimed')) {
        errorMessage = 'Winnings already claimed';
      } else if (error.message?.includes('WrongOutcome')) {
        errorMessage = 'You bet on the losing outcome';
      } else if (error.message?.includes('MarketNotResolved')) {
        errorMessage = 'Market not resolved yet';
      } else if (error.message?.includes('NoWinnings')) {
        errorMessage = 'No winnings available';
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled';
      }

      toast.error(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  };

  // Don't show if market is not resolved
  if (!market.resolved) {
    return null;
  }

  // Don't show if wallet not connected
  if (!wallet) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Checking for winnings...</span>
        </div>
      </div>
    );
  }

  // No bet found
  if (!userBet) {
    return null;
  }

  // Already claimed
  if (userBet.claimed) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-lg font-bold text-gray-300 mb-2">
            Winnings Already Claimed
          </div>
          <div className="text-sm text-gray-500">
            You have already claimed your winnings from this market
          </div>
        </div>
      </div>
    );
  }

  // Lost bet
  if (!winningsInfo.hasWinnings || userBet.outcome !== market.winningOutcome) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">❌</div>
          <div className="text-lg font-bold text-gray-300 mb-2">
            No Winnings Available
          </div>
          <div className="text-sm text-gray-500">
            Your bet on {userBet.outcome ? 'YES' : 'NO'} did not win
          </div>
        </div>
      </div>
    );
  }

  // Can claim winnings
  return (
    <div className="bg-gradient-to-br from-green-900/40 to-gray-800 border-2 border-green-500/50 rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🎉</div>
        <div className="text-2xl font-bold text-green-300 mb-2">
          Congratulations!
        </div>
        <div className="text-gray-400">
          You won on {userBet.outcome ? 'YES' : 'NO'}
        </div>
      </div>

      <div className="bg-black/30 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Your Bet:</span>
          <span className="font-mono text-white">
            {(userBet.amount / 1e9).toFixed(4)} SOL
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Multiplier:</span>
          <span className="font-mono text-green-400">
            {winningsInfo.multiplier.toFixed(2)}x
          </span>
        </div>
        <div className="border-t border-gray-700 pt-3"></div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-semibold">Total Winnings:</span>
          <span className="font-mono text-2xl text-green-300 font-bold">
            {winningsInfo.winningsSOL.toFixed(4)} SOL
          </span>
        </div>
      </div>

      <button
        onClick={handleClaim}
        disabled={isClaiming || !winningsInfo.canClaim}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
          isClaiming || !winningsInfo.canClaim
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105'
        }`}
      >
        {isClaiming ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Claiming Winnings...
          </div>
        ) : (
          '💰 Claim Winnings'
        )}
      </button>

      <div className="mt-4 text-xs text-center text-gray-500">
        Transaction fee: ~0.00001 SOL
      </div>
    </div>
  );
};

export default ClaimWinnings;

