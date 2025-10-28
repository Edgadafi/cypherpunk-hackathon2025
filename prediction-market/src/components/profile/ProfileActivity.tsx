'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { EnrichedBet } from '@/lib/program/direct-read';
import { lamportsToSOL } from '@/lib/program/direct-read';
import ShareBet from '@/components/social/ShareBet';

interface ProfileActivityProps {
  bets: EnrichedBet[];
  walletAddress: string;
}

const ProfileActivity = ({ bets, walletAddress }: ProfileActivityProps) => {
  const [filter, setFilter] = useState<'all' | 'won' | 'lost' | 'active'>('all');
  const [limit, setLimit] = useState(10);

  // Filter bets
  const filteredBets = bets.filter((bet) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !bet.marketData?.resolved;
    if (filter === 'won')
      return bet.marketData?.resolved && bet.outcome === bet.marketData.winningOutcome;
    if (filter === 'lost')
      return bet.marketData?.resolved && bet.outcome !== bet.marketData.winningOutcome;
    return true;
  });

  const displayedBets = filteredBets.slice(0, limit);
  const hasMore = filteredBets.length > limit;

  const getStatusBadge = (bet: EnrichedBet) => {
    if (!bet.marketData?.resolved) {
      return (
        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded border border-yellow-500/50">
          Active
        </span>
      );
    }
    if (bet.outcome === bet.marketData.winningOutcome) {
      return (
        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded border border-green-500/50">
          Won
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded border border-red-500/50">
        Lost
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Activity</h2>
        
        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All ({bets.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Active ({bets.filter((b) => !b.marketData?.resolved).length})
          </button>
          <button
            onClick={() => setFilter('won')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'won'
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Won (
            {
              bets.filter(
                (b) => b.marketData?.resolved && b.outcome === b.marketData.winningOutcome
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilter('lost')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'lost'
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Lost (
            {
              bets.filter(
                (b) => b.marketData?.resolved && b.outcome !== b.marketData.winningOutcome
              ).length
            }
            )
          </button>
        </div>
      </div>

      {/* Bets Timeline */}
      {filteredBets.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">No bets in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedBets.map((bet) => {
            const betAmount = lamportsToSOL(bet.amount);
            const betDate = new Date(bet.timestamp * 1000);
            const isWon =
              bet.marketData?.resolved && bet.outcome === bet.marketData.winningOutcome;

            return (
              <div
                key={bet.address}
                className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg p-5 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      {getStatusBadge(bet)}
                      <Link
                        href={`/markets/${bet.market.toBase58()}`}
                        className="flex-1 text-white hover:text-blue-400 transition-colors line-clamp-2"
                      >
                        {bet.marketData?.question || 'Loading market...'}
                      </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            bet.outcome
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {bet.outcome ? 'YES' : 'NO'}
                        </span>
                        <span className="text-gray-400 font-mono">
                          {betAmount.toFixed(4)} SOL
                        </span>
                      </div>

                      <span className="text-gray-500">•</span>

                      <span className="text-gray-500">
                        {betDate.toLocaleDateString()} {betDate.toLocaleTimeString()}
                      </span>

                      {bet.winnings && bet.winnings.hasWinnings && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-green-400 font-mono">
                            Won: {bet.winnings.winningsSOL.toFixed(4)} SOL
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isWon && bet.marketData && (
                      <ShareBet bet={bet} marketData={bet.marketData} />
                    )}
                    <Link
                      href={`/markets/${bet.market.toBase58()}`}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => setLimit((prev) => prev + 10)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Load More ({filteredBets.length - limit} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileActivity;





