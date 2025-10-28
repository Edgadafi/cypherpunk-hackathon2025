/**
 * Simple in-memory cache for market data
 * Reduces redundant RPC calls and improves performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class MarketCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 10000; // 10 seconds default

  /**
   * Get data from cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    console.log(`📦 Cache HIT: ${key}`);
    return entry.data as T;
  }

  /**
   * Store data in cache with TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });

    console.log(`💾 Cache SET: ${key} (TTL: ${ttl || this.defaultTTL}ms)`);
  }

  /**
   * Invalidate specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ Cache INVALIDATE: ${key}`);
  }

  /**
   * Invalidate all keys matching pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    const matchingKeys = keys.filter(key => key.includes(pattern));
    
    matchingKeys.forEach(key => {
      this.cache.delete(key);
    });

    console.log(`🗑️ Cache INVALIDATE pattern: ${pattern} (${matchingKeys.length} keys)`);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache CLEARED');
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const marketCache = new MarketCache();

/**
 * Cache key generators
 */
export const CacheKeys = {
  allMarkets: () => 'markets:all',
  market: (address: string) => `market:${address}`,
  userBets: (wallet: string) => `bets:user:${wallet}`,
  marketBets: (marketAddress: string) => `bets:market:${marketAddress}`,
  leaderboard: (sortBy: string, limit: number) => `leaderboard:${sortBy}:${limit}`,
  userRank: (wallet: string, sortBy: string) => `rank:${wallet}:${sortBy}`,
  activity: () => 'activity:all',
};

/**
 * Utility to wrap async functions with caching
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try cache first
  const cached = marketCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch and cache
  const data = await fetcher();
  marketCache.set(key, data, ttl);
  return data;
}

