/**
 * Activity feed utilities for fetching recent events
 */

import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { PROGRAM_ID, RPC_ENDPOINT, CONNECTION_CONFIG } from './constants';
import {
  fetchAllMarketsDirect,
  fetchMarketDirect,
  lamportsToSOL,
  type MarketAccount,
  type BetAccount,
} from './direct-read';

export type ActivityType = 'bet_placed' | 'market_created' | 'market_resolved' | 'claim_made';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  timestamp: number;
  user: string;
  data: BetActivityData | MarketActivityData | ClaimActivityData;
}

export interface BetActivityData {
  market: MarketAccount;
  amount: number; // SOL
  outcome: boolean; // true = YES, false = NO
}

export interface MarketActivityData {
  market: MarketAccount;
}

export interface ClaimActivityData {
  market: MarketAccount;
  amount: number; // SOL
}

/**
 * Fetch all bets and convert to activity events
 */
async function fetchBetActivity(limit: number = 50): Promise<ActivityEvent[]> {
  console.log('🎲 Fetching bet activity...');
  
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);

  try {
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

    // Decode bets
    const bets: Array<BetAccount & { address: string }> = [];
    
    for (const { pubkey, account } of accounts) {
      try {
        let offset = 8; // Skip discriminator

        const user = new PublicKey(account.data.slice(offset, offset + 32));
        offset += 32;

        const market = new PublicKey(account.data.slice(offset, offset + 32));
        offset += 32;

        const amountBuffer = account.data.slice(offset, offset + 8);
        const amount = new anchor.BN(amountBuffer, 'le').toNumber();
        offset += 8;

        const outcome = account.data.readUInt8(offset) !== 0;
        offset += 1;

        const claimed = account.data.readUInt8(offset) !== 0;
        offset += 1;

        const timestampBuffer = account.data.slice(offset, offset + 8);
        const timestamp = new anchor.BN(timestampBuffer, 'le').toNumber();

        bets.push({
          address: pubkey.toBase58(),
          user,
          market,
          amount,
          outcome,
          claimed,
          timestamp,
        });
      } catch (error) {
        console.error('Error decoding bet:', error);
      }
    }

    // Sort by timestamp (most recent first)
    bets.sort((a, b) => b.timestamp - a.timestamp);

    // Take top N and fetch market data
    const recentBets = bets.slice(0, limit);
    const events: ActivityEvent[] = [];

    for (const bet of recentBets) {
      try {
        const marketData = await fetchMarketDirect(bet.market.toBase58());
        
        if (marketData) {
          events.push({
            id: bet.address,
            type: 'bet_placed',
            timestamp: bet.timestamp,
            user: bet.user.toBase58(),
            data: {
              market: marketData,
              amount: lamportsToSOL(bet.amount),
              outcome: bet.outcome,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching market for bet:', error);
      }
    }

    return events;
  } catch (error) {
    console.error('❌ Error fetching bet activity:', error);
    return [];
  }
}

/**
 * Fetch market creation activity
 */
async function fetchMarketActivity(): Promise<ActivityEvent[]> {
  console.log('📊 Fetching market activity...');

  try {
    const markets = await fetchAllMarketsDirect();
    
    return markets.map((market) => ({
      id: `market-${market.address}`,
      type: 'market_created' as ActivityType,
      timestamp: market.createdAt,
      user: market.authority.toBase58(),
      data: {
        market,
      },
    }));
  } catch (error) {
    console.error('❌ Error fetching market activity:', error);
    return [];
  }
}

/**
 * Fetch all activity and merge
 */
export async function fetchRecentActivity(limit: number = 50): Promise<ActivityEvent[]> {
  console.log('📡 Fetching recent activity...');

  try {
    // Fetch different types of activity
    const [betEvents, marketEvents] = await Promise.all([
      fetchBetActivity(limit),
      fetchMarketActivity(),
    ]);

    // Merge and sort by timestamp
    const allEvents = [...betEvents, ...marketEvents];
    allEvents.sort((a, b) => b.timestamp - a.timestamp);

    // Return top N
    return allEvents.slice(0, limit);
  } catch (error) {
    console.error('❌ Error fetching recent activity:', error);
    return [];
  }
}

/**
 * Fetch activity for a specific user
 */
export async function fetchUserActivity(
  userWallet: string,
  limit: number = 50
): Promise<ActivityEvent[]> {
  console.log(`📡 Fetching activity for ${userWallet}...`);

  try {
    const allActivity = await fetchRecentActivity(200); // Get more to filter
    
    // Filter by user
    const userActivity = allActivity.filter(event => event.user === userWallet);
    
    return userActivity.slice(0, limit);
  } catch (error) {
    console.error('❌ Error fetching user activity:', error);
    return [];
  }
}





