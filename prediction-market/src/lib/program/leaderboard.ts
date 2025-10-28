/**
 * Leaderboard utilities for ranking traders
 */

import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { PROGRAM_ID, RPC_ENDPOINT, CONNECTION_CONFIG } from './constants';
import {
  fetchAllUserBets,
  fetchMarketDirect,
  calculateUserStats,
  type UserStats,
  type BetAccount,
  type MarketAccount,
} from './direct-read';

export interface LeaderboardEntry {
  wallet: string;
  stats: UserStats;
  rank: number;
}

export type LeaderboardSortBy = 'roi' | 'winRate' | 'volume' | 'profit' | 'totalBets';

/**
 * Get all unique traders from bet accounts
 */
export async function getAllTraders(): Promise<string[]> {
  console.log('🔍 Fetching all traders...');
  
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);

  try {
    // Get all Bet accounts
    const BET_DISCRIMINATOR = Buffer.from([147, 23, 35, 59, 15, 75, 155, 32]);
    
    const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: anchor.utils.bytes.bs58.encode(BET_DISCRIMINATOR),
          },
        },
      ],
    });

    console.log(`📦 Found ${accounts.length} bet accounts`);

    // Extract unique user pubkeys
    const traders = new Set<string>();
    
    for (const { account } of accounts) {
      try {
        // User pubkey is at offset 8 (after discriminator)
        const userPubkey = new PublicKey(account.data.slice(8, 40));
        traders.add(userPubkey.toBase58());
      } catch (error) {
        console.error('Error extracting user from bet:', error);
      }
    }

    const uniqueTraders = Array.from(traders);
    console.log(`✅ Found ${uniqueTraders.length} unique traders`);
    
    return uniqueTraders;
  } catch (error) {
    console.error('❌ Error fetching traders:', error);
    return [];
  }
}

/**
 * Calculate stats for a single trader
 */
async function calculateTraderStats(walletAddress: string): Promise<LeaderboardEntry | null> {
  try {
    const userPubkey = new PublicKey(walletAddress);
    
    // Fetch user bets
    const userBets = await fetchAllUserBets(userPubkey);
    
    if (userBets.length === 0) {
      return null;
    }

    // Fetch market data
    const marketsMap = new Map<string, MarketAccount>();
    
    for (const bet of userBets) {
      const marketAddress = bet.market.toBase58();
      
      if (!marketsMap.has(marketAddress)) {
        try {
          const marketData = await fetchMarketDirect(marketAddress);
          if (marketData) {
            marketsMap.set(marketAddress, marketData);
          }
        } catch (error) {
          console.error('Error fetching market:', marketAddress, error);
        }
      }
    }

    // Calculate stats
    const stats = await calculateUserStats(userBets, marketsMap);

    return {
      wallet: walletAddress,
      stats,
      rank: 0, // Will be set later
    };
  } catch (error) {
    console.error('Error calculating stats for', walletAddress, error);
    return null;
  }
}

/**
 * Fetch and rank all traders
 */
export async function fetchLeaderboard(
  sortBy: LeaderboardSortBy = 'roi',
  limit: number = 100
): Promise<LeaderboardEntry[]> {
  console.log(`🏆 Fetching leaderboard sorted by ${sortBy}...`);

  try {
    // Get all traders
    const traders = await getAllTraders();
    
    if (traders.length === 0) {
      return [];
    }

    console.log(`📊 Calculating stats for ${traders.length} traders...`);

    // Calculate stats for each trader (batch with some parallelization)
    const entries: LeaderboardEntry[] = [];
    const batchSize = 5; // Process 5 traders at a time
    
    for (let i = 0; i < traders.length; i += batchSize) {
      const batch = traders.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(trader => calculateTraderStats(trader))
      );
      
      entries.push(...batchResults.filter((entry): entry is LeaderboardEntry => entry !== null));
      
      console.log(`Progress: ${Math.min(i + batchSize, traders.length)}/${traders.length}`);
    }

    // Filter out traders with no resolved bets
    const activeTraders = entries.filter(entry => entry.stats.resolvedBets > 0);

    console.log(`✅ ${activeTraders.length} traders with resolved bets`);

    // Sort by selected metric
    activeTraders.sort((a, b) => {
      switch (sortBy) {
        case 'roi':
          return b.stats.roi - a.stats.roi;
        case 'winRate':
          return b.stats.winRate - a.stats.winRate;
        case 'volume':
          return b.stats.totalWagered - a.stats.totalWagered;
        case 'profit':
          return b.stats.profitLoss - a.stats.profitLoss;
        case 'totalBets':
          return b.stats.totalBets - a.stats.totalBets;
        default:
          return b.stats.roi - a.stats.roi;
      }
    });

    // Assign ranks
    activeTraders.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Return top N
    return activeTraders.slice(0, limit);
  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Get user's rank
 */
export async function getUserRank(
  walletAddress: string,
  sortBy: LeaderboardSortBy = 'roi'
): Promise<number | null> {
  try {
    const leaderboard = await fetchLeaderboard(sortBy, 1000); // Get more for accurate rank
    const entry = leaderboard.find(e => e.wallet === walletAddress);
    return entry ? entry.rank : null;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
}





