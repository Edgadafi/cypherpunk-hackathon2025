'use client';

import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Trade {
  signature: string;
  trader: string;
  side: 'yes' | 'no';
  amount: number;
  timestamp: number;
  price: number;
}

interface TradeHistoryProps {
  trades: Trade[];
  title?: string;
  maxItems?: number;
}

export const TradeHistory = ({ trades, title = "Recent Trades", maxItems = 10 }: TradeHistoryProps) => {
  const { theme } = useTheme();
  
  const displayTrades = trades.slice(0, maxItems);

  const formatAddress = (address: string) => {
    if (!address || address.length < 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      
      {displayTrades.length === 0 ? (
        <div className="py-8 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            No trades yet. Be the first to bet!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header */}
          <div className={`grid grid-cols-5 gap-4 text-xs font-semibold pb-2 border-b ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'}`}>
            <div>Trader</div>
            <div>Side</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Price</div>
            <div className="text-right">Time</div>
          </div>
          
          {/* Trades */}
          {displayTrades.map((trade, idx) => (
            <div 
              key={`${trade.signature}-${idx}`}
              className={`grid grid-cols-5 gap-4 items-center py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'} rounded-lg px-2 transition-colors`}
            >
              {/* Trader */}
              <Link 
                href={`/profile/${trade.trader}`}
                className={`font-mono ${theme === 'dark' ? 'text-gray-300 hover:text-[#00F0FF]' : 'text-gray-700 hover:text-[#00F0FF]'} transition-colors`}
              >
                {formatAddress(trade.trader)}
              </Link>
              
              {/* Side */}
              <div className="flex items-center gap-1">
                {trade.side === 'yes' ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-[#00F0FF]" />
                    <span className="font-bold text-[#00F0FF]">YES</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-[#FF0080]" />
                    <span className="font-bold text-[#FF0080]">NO</span>
                  </>
                )}
              </div>
              
              {/* Amount */}
              <div className={`text-right font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {trade.amount.toFixed(2)} SOL
              </div>
              
              {/* Price */}
              <div className={`text-right ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {(trade.price * 100).toFixed(1)}%
              </div>
              
              {/* Time */}
              <div className={`text-right text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatDistanceToNow(trade.timestamp, { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* View on Explorer link */}
      {displayTrades.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <a
            href={`https://explorer.solana.com/address/${displayTrades[0]?.trader}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-[#00F0FF] hover:text-[#00F0FF]/80' : 'text-[#00F0FF] hover:text-[#00F0FF]/80'} transition-colors`}
          >
            View on Solana Explorer <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};

