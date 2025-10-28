"use client";

import React, { useState, useEffect } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Sparkles, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveWithOracle, canResolveWithOracle } from '@/lib/program/oracle';

interface AutoResolveButtonProps {
  marketId: string;
  oracleEnabled: boolean;
  oracleFeedId: number[] | Uint8Array;
  endTime: number;
  resolved: boolean;
  onResolved?: () => void;
}

export default function AutoResolveButton({
  marketId,
  oracleEnabled,
  oracleFeedId,
  endTime,
  resolved,
  onResolved,
}: AutoResolveButtonProps) {
  const wallet = useAnchorWallet();
  const [isResolving, setIsResolving] = useState(false);
  const [canResolve, setCanResolve] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Convert oracle feed ID to hex string
  const feedIdHex = Array.from(oracleFeedId)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  useEffect(() => {
    const checkResolution = async () => {
      if (!oracleEnabled || resolved) {
        setCanResolve(false);
        return;
      }

      const now = Date.now() / 1000;
      const timeDiff = endTime - now;
      setTimeRemaining(timeDiff);

      if (timeDiff <= 0) {
        const eligible = await canResolveWithOracle(marketId, now);
        setCanResolve(eligible);
      } else {
        setCanResolve(false);
      }
    };

    checkResolution();
    const interval = setInterval(checkResolution, 5000); // Check every 5s

    return () => clearInterval(interval);
  }, [marketId, oracleEnabled, endTime, resolved]);

  const handleResolve = async () => {
    if (!wallet) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!oracleEnabled) {
      toast.error('This market is not oracle-enabled');
      return;
    }

    if (resolved) {
      toast.error('Market is already resolved');
      return;
    }

    if (timeRemaining > 0) {
      toast.error('Market has not ended yet');
      return;
    }

    try {
      setIsResolving(true);
      
      toast.loading('Fetching price from Pyth Network...', { id: 'resolve' });
      
      const signature = await resolveWithOracle(
        wallet,
        marketId,
        feedIdHex
      );

      toast.success('Market auto-resolved with oracle! 🔮', { id: 'resolve' });

      // Callback to parent to refresh data
      if (onResolved) {
        onResolved();
      }
      
    } catch (error: any) {
      console.error('Error resolving with oracle:', error);
      toast.error(error?.message || 'Failed to resolve with oracle', { id: 'resolve' });
    } finally {
      setIsResolving(false);
    }
  };

  // Don't show if not oracle-enabled or already resolved
  if (!oracleEnabled || resolved) {
    return null;
  }

  // Show countdown if not ended yet
  if (timeRemaining > 0) {
    return (
      <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-blue-900">Auto-Resolution Pending</span>
        </div>
        <p className="text-sm text-gray-700 mb-2">
          This market will be eligible for automatic resolution after the end time.
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-blue-600">
            Time remaining: {formatTimeRemaining(timeRemaining)}
          </span>
        </div>
      </div>
    );
  }

  // Show resolution button if can resolve
  if (canResolve) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-600 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-1">
                Ready for Auto-Resolution
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                This market can now be automatically resolved using Pyth Network's price oracle.
                Anyone can trigger the resolution - the outcome is determined by verifiable on-chain price data.
              </p>
              
              <div className="bg-white border-2 border-blue-300 rounded p-3 mb-4">
                <h4 className="text-sm font-bold text-gray-800 mb-2">How it works:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Fetches current price from Pyth Network</li>
                  <li>• Compares price against threshold</li>
                  <li>• Automatically determines YES/NO outcome</li>
                  <li>• Trustless and verifiable on-chain</li>
                </ul>
              </div>

              <button
                onClick={handleResolve}
                disabled={isResolving || !wallet}
                className={`w-full py-4 font-bold text-white text-lg flex items-center justify-center gap-2 ${
                  isResolving || !wallet
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } transition-all`}
              >
                {isResolving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resolving with Oracle...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    🔮 Auto-Resolve with Oracle
                  </>
                )}
              </button>

              {!wallet && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Connect your wallet to trigger resolution
                </p>
              )}

              <p className="text-xs text-gray-500 text-center mt-2">
                Gas cost: ~0.01 SOL (~$2)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-900">
              <p className="font-bold mb-1">Note about resolution</p>
              <p>
                Anyone can trigger the resolution, but the outcome is determined entirely by
                the Pyth price feed - there's no way to manipulate it. The resolver pays
                the gas fee but doesn't influence the result.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - shouldn't normally show
  return null;
}

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Ended';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}


