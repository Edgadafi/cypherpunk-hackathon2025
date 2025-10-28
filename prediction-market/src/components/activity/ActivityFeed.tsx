'use client';

import Link from 'next/link';
import type { ActivityEvent } from '@/lib/program/activity';

interface ActivityFeedProps {
  events: ActivityEvent[];
}

const ActivityFeed = ({ events }: ActivityFeedProps) => {
  const formatWallet = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const renderEvent = (event: ActivityEvent) => {
    const timeAgo = formatTimeAgo(event.timestamp);

    switch (event.type) {
      case 'bet_placed': {
        const data = event.data as any;
        const outcome = data.outcome ? 'YES' : 'NO';
        const outcomeColor = data.outcome
          ? 'bg-green-500/20 text-green-300 border-green-500/50'
          : 'bg-red-500/20 text-red-300 border-red-500/50';

        return (
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">
              🎲
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Link
                  href={`/profile/${event.user}`}
                  className="font-mono text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {formatWallet(event.user)}
                </Link>
                <span className="text-gray-400">placed</span>
                <span className="text-white font-bold">{data.amount.toFixed(4)} SOL</span>
                <span className="text-gray-400">on</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold border ${outcomeColor}`}
                >
                  {outcome}
                </span>
              </div>

              <Link
                href={`/markets/${data.market.address}`}
                className="text-white hover:text-blue-400 transition-colors line-clamp-1"
              >
                "{data.market.question}"
              </Link>

              <div className="text-xs text-gray-500 mt-1">{timeAgo}</div>
            </div>
          </div>
        );
      }

      case 'market_created': {
        const data = event.data as any;

        return (
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl">
              📊
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Link
                  href={`/profile/${event.user}`}
                  className="font-mono text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {formatWallet(event.user)}
                </Link>
                <span className="text-gray-400">created a new market</span>
              </div>

              <Link
                href={`/markets/${data.market.address}`}
                className="text-white hover:text-blue-400 transition-colors line-clamp-1"
              >
                "{data.market.question}"
              </Link>

              <div className="text-xs text-gray-500 mt-1">{timeAgo}</div>
            </div>
          </div>
        );
      }

      case 'market_resolved': {
        const data = event.data as any;
        const outcome = data.market.winningOutcome ? 'YES' : 'NO';
        const outcomeColor = data.market.winningOutcome
          ? 'text-green-400'
          : 'text-red-400';

        return (
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl">
              ✅
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Link
                  href={`/profile/${event.user}`}
                  className="font-mono text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {formatWallet(event.user)}
                </Link>
                <span className="text-gray-400">resolved market →</span>
                <span className={`font-bold ${outcomeColor}`}>{outcome}</span>
              </div>

              <Link
                href={`/markets/${data.market.address}`}
                className="text-white hover:text-blue-400 transition-colors line-clamp-1"
              >
                "{data.market.question}"
              </Link>

              <div className="text-xs text-gray-500 mt-1">{timeAgo}</div>
            </div>
          </div>
        );
      }

      case 'claim_made': {
        const data = event.data as any;

        return (
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl">
              💰
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Link
                  href={`/profile/${event.user}`}
                  className="font-mono text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {formatWallet(event.user)}
                </Link>
                <span className="text-gray-400">claimed</span>
                <span className="text-green-400 font-bold">
                  {data.amount.toFixed(4)} SOL
                </span>
              </div>

              <Link
                href={`/markets/${data.market.address}`}
                className="text-white hover:text-blue-400 transition-colors line-clamp-1"
              >
                "{data.market.question}"
              </Link>

              <div className="text-xs text-gray-500 mt-1">{timeAgo}</div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg p-5 transition-all"
        >
          {renderEvent(event)}
        </div>
      ))}

      {events.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📡</div>
          <p className="text-gray-400">No activity yet</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;





