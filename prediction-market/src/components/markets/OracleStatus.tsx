"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchPythPrice, PriceData, getFeedName, getComparisonLabel, formatPrice, ComparisonType, wouldResolveAsYes } from '@/lib/oracle/pyth';

interface OracleStatusProps {
  oracleEnabled: boolean;
  oracleFeedId: number[] | Uint8Array;
  oracleThreshold: number;
  oracleComparison: number;
  endTime: number;
  resolved: boolean;
}

export default function OracleStatus({
  oracleEnabled,
  oracleFeedId,
  oracleThreshold,
  oracleComparison,
  endTime,
  resolved,
}: OracleStatusProps) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [wouldResolve, setWouldResolve] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert oracle feed ID array to hex string
  const feedIdHex = Array.from(oracleFeedId)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const feedName = getFeedName(feedIdHex);
  const comparisonLabel = getComparisonLabel(oracleComparison as ComparisonType);

  useEffect(() => {
    if (!oracleEnabled) return;

    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        const price = await fetchPythPrice(feedIdHex);
        setPriceData(price);

        if (price) {
          const result = await wouldResolveAsYes(
            feedIdHex,
            oracleThreshold,
            oracleComparison as ComparisonType
          );
          setWouldResolve(result);
        }
      } catch (error) {
        console.error('Error fetching oracle price:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000); // Update every 5s

    return () => clearInterval(interval);
  }, [oracleEnabled, feedIdHex, oracleThreshold, oracleComparison]);

  if (!oracleEnabled) return null;

  const currentPrice = priceData?.price;
  const priceMovement = currentPrice && currentPrice > oracleThreshold ? 'up' : 'down';
  const timeDiff = endTime - Date.now() / 1000;
  const hasEnded = timeDiff <= 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-600 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-900">Oracle Resolution</h3>
          <span className="text-xs bg-blue-600 text-white px-2 py-1 font-bold">
            POWERED BY PYTH
          </span>
        </div>
        
        {currentPrice && (
          <div className="flex items-center gap-2">
            {priceMovement === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-bold text-gray-600">
              Live Price
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Current Price */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-gray-600">Current Price</span>
          </div>
          {isLoading ? (
            <div className="text-lg font-bold text-gray-400">Loading...</div>
          ) : currentPrice ? (
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(currentPrice, feedName)}
            </div>
          ) : (
            <div className="text-lg font-bold text-red-600">Unavailable</div>
          )}
          <div className="text-xs text-gray-500 mt-1">{feedName}</div>
        </div>

        {/* Target Price */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-bold text-gray-600">Target Price</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(oracleThreshold, feedName)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Condition: {comparisonLabel}
          </div>
        </div>
      </div>

      {/* Resolution Preview */}
      {!resolved && wouldResolve !== null && (
        <div className={`border-2 p-4 mb-4 ${
          wouldResolve
            ? 'bg-green-50 border-green-600'
            : 'bg-red-50 border-red-600'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {wouldResolve ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-bold">
              {hasEnded
                ? 'Would Resolve As:'
                : 'Current Prediction:'}
            </span>
          </div>
          <div className={`text-2xl font-bold ${
            wouldResolve ? 'text-green-600' : 'text-red-600'
          }`}>
            {wouldResolve ? 'YES' : 'NO'}
          </div>
          <p className="text-sm text-gray-700 mt-2">
            {wouldResolve
              ? `Current price is ${comparisonLabel.toLowerCase()} threshold`
              : `Current price is NOT ${comparisonLabel.toLowerCase()} threshold`}
          </p>
        </div>
      )}

      {/* Resolution Status */}
      {!resolved && (
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-bold text-gray-600">
              Resolution Status
            </span>
          </div>
          {hasEnded ? (
            <div className="space-y-2">
              <p className="text-sm font-bold text-orange-600">
                ⏰ Market has ended - Ready for resolution
              </p>
              <p className="text-xs text-gray-600">
                Anyone can trigger automatic resolution using the button below
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Market will auto-resolve at end time using live Pyth price
              </p>
              <p className="text-xs text-gray-600">
                Time remaining: {formatTimeRemaining(timeDiff)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t-2 border-blue-300">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>Powered by Pyth Network</span>
            <span>•</span>
            <span>Updates every 5 seconds</span>
          </div>
          {priceData && (
            <span>
              Last update: {new Date(priceData.timestamp * 1000).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Ended';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}


