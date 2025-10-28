'use client';

import Link from 'next/link';
import type { EnrichedBet } from '@/lib/program/direct-read';
import { lamportsToSOL } from '@/lib/program/direct-read';

interface BetCardProps {
  bet: EnrichedBet;
}

const BetCard = ({ bet }: BetCardProps) => {
  const { marketData, winnings } = bet;

  const betAmount = lamportsToSOL(bet.amount);
  const betDate = new Date(bet.timestamp * 1000);

  // Status badge
  const getStatusBadge = () => {
    if (!marketData?.resolved) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">
          ⏳ Active
        </span>
      );
    }

    if (bet.outcome === marketData.winningOutcome) {
      if (bet.claimed) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/50">
            ✅ Claimed
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/50 animate-pulse">
          💰 Claimable
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/50">
        ❌ Lost
      </span>
    );
  };

  // Card border color based on status
  const getBorderColor = () => {
    if (!marketData?.resolved) return 'border-yellow-500/30';
    if (bet.outcome === marketData.winningOutcome) {
      if (bet.claimed) return 'border-blue-500/30';
      return 'border-green-500/50';
    }
    return 'border-red-500/30';
  };

  return (
    <div
      className={`bg-gray-800 border ${getBorderColor()} rounded-lg p-6 hover:bg-gray-750 transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-2 line-clamp-2">
            {marketData?.question || 'Loading market...'}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{betDate.toLocaleDateString()}</span>
            <span>•</span>
            <span>{betDate.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="ml-4">{getStatusBadge()}</div>
      </div>

      {/* Bet Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">Your Bet</div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                bet.outcome
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {bet.outcome ? 'YES' : 'NO'}
            </span>
            <span className="text-white font-mono">{betAmount.toFixed(4)} SOL</span>
          </div>
        </div>

        {marketData?.resolved && (
          <div>
            <div className="text-xs text-gray-400 mb-1">Outcome</div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  marketData.winningOutcome
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {marketData.winningOutcome ? 'YES' : 'NO'}
              </span>
              {bet.outcome === marketData.winningOutcome ? (
                <span className="text-green-300 text-sm">Won!</span>
              ) : (
                <span className="text-red-300 text-sm">Lost</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Winnings Info */}
      {winnings && winnings.hasWinnings && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Winnings</span>
            <span className="text-green-300 font-mono font-bold">
              {winnings.winningsSOL.toFixed(4)} SOL
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Multiplier</span>
            <span className="text-green-400 text-sm font-bold">
              {winnings.multiplier.toFixed(2)}x
            </span>
          </div>
        </div>
      )}

      {/* Market Progress (if active) */}
      {marketData && !marketData.resolved && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Current Odds</span>
            <span>
              {marketData.endTime * 1000 > Date.now()
                ? 'Ends ' + new Date(marketData.endTime * 1000).toLocaleDateString()
                : 'Awaiting resolution'}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-green-500/20 border border-green-500/30 rounded px-2 py-1 text-center">
              <div className="text-xs text-green-300">YES</div>
              <div className="text-sm font-bold text-white">
                {(
                  (marketData.yesAmount / (marketData.yesAmount + marketData.noAmount)) *
                  100
                ).toFixed(0)}
                %
              </div>
            </div>
            <div className="flex-1 bg-red-500/20 border border-red-500/30 rounded px-2 py-1 text-center">
              <div className="text-xs text-red-300">NO</div>
              <div className="text-sm font-bold text-white">
                {(
                  (marketData.noAmount / (marketData.yesAmount + marketData.noAmount)) *
                  100
                ).toFixed(0)}
                %
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/markets/${bet.market.toBase58()}`}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors"
        >
          View Market
        </Link>
        {winnings && winnings.canClaim && (
          <Link
            href={`/markets/${bet.market.toBase58()}#claim`}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors"
          >
            Claim Winnings
          </Link>
        )}
      </div>

      {/* Bet Address (for debugging) */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          Bet: {bet.address.slice(0, 8)}...{bet.address.slice(-8)}
        </div>
      </div>
    </div>
  );
};

export default BetCard;





