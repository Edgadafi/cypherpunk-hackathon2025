/**
 * Pyth Network Oracle Integration
 * 
 * Utilities for fetching price data from Pyth Network and
 * resolving prediction markets automatically based on real-world prices
 */

import { HermesClient } from '@pythnetwork/hermes-client';

// Pyth Hermes endpoint (mainnet and devnet)
const PYTH_ENDPOINT = process.env.NEXT_PUBLIC_PYTH_ENDPOINT || 'https://hermes.pyth.network';

// Common price feed IDs (mainnet)
export const PRICE_FEEDS = {
  'BTC/USD': 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  'ETH/USD': 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  'SOL/USD': 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  'USDC/USD': 'eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
  'USDT/USD': '2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
  'BNB/USD': '2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
  'ADA/USD': '2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d',
  'MATIC/USD': '5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52',
};

export type ComparisonType = 0 | 1 | 2; // 0=above, 1=below, 2=equals

export interface OracleConfig {
  feedId: string; // Hex string from PRICE_FEEDS
  threshold: number; // Target price (e.g., 100000 for $100k)
  comparison: ComparisonType; // How to compare price vs threshold
}

export interface PriceData {
  price: number; // Actual price (e.g., 98500.50)
  expo: number; // Price exponent (usually negative)
  conf: number; // Confidence interval
  timestamp: number; // Unix timestamp
}

/**
 * Get current price from Pyth for a given feed ID
 */
export async function fetchPythPrice(feedIdHex: string): Promise<PriceData | null> {
  try {
    const connection = new HermesClient(PYTH_ENDPOINT);
    
    // Ensure feed ID has 0x prefix
    const formattedFeedId = feedIdHex.startsWith('0x') ? feedIdHex : `0x${feedIdHex}`;
    
    // Get latest price data (HermesClient uses query parameter)
    const priceFeeds = await connection.getPriceFeeds({ 
      query: formattedFeedId,
      assetType: 'crypto'
    });
    
    if (!priceFeeds || priceFeeds.length === 0) {
      console.error('No price feeds returned');
      return null;
    }
    
    const priceFeed = priceFeeds[0];
    const price = priceFeed.price as any; // Type assertion for Pyth price object
    
    return {
      price: Number(price.price) * Math.pow(10, price.expo), // Convert to actual price
      expo: price.expo,
      conf: Number(price.conf) * Math.pow(10, price.expo), // Confidence interval
      timestamp: price.publish_time,
    };
  } catch (error) {
    console.error('Error fetching Pyth price:', error);
    return null;
  }
}

/**
 * Get multiple prices at once
 */
export async function fetchMultiplePrices(feedIdHexArray: string[]): Promise<Map<string, PriceData>> {
  try {
    const connection = new HermesClient(PYTH_ENDPOINT);
    
    const priceMap = new Map<string, PriceData>();
    
    // HermesClient doesn't support bulk queries easily, so we fetch one by one
    for (const feedIdHex of feedIdHexArray) {
      try {
        const priceData = await fetchPythPrice(feedIdHex);
        if (priceData) {
          priceMap.set(feedIdHex, priceData);
        }
      } catch (err) {
        console.error(`Error fetching price for ${feedIdHex}:`, err);
      }
    }
    
    return priceMap;
  } catch (error) {
    console.error('Error fetching multiple prices:', error);
    return new Map();
  }
}

/**
 * Get VAA (Verifiable Action Approval) for on-chain resolution
 * This is what gets passed to the smart contract
 */
export async function getPriceUpdateVaa(feedIdHex: string): Promise<string[] | null> {
  try {
    const connection = new HermesClient(PYTH_ENDPOINT);
    
    // Ensure feed ID has 0x prefix
    const formattedFeedId = feedIdHex.startsWith('0x') ? feedIdHex : `0x${feedIdHex}`;
    
    // Get latest VAAs (these are cryptographic proofs)
    // HermesClient may have different API - returning placeholder for now
    // In production, you'd use getPriceFeedUpdateData or similar
    console.warn('VAA fetching not implemented for HermesClient - placeholder');
    return null;
  } catch (error) {
    console.error('Error fetching Pyth VAA:', error);
    return null;
  }
}

/**
 * Check if current price would resolve the market as YES
 */
export async function wouldResolveAsYes(
  feedIdHex: string,
  threshold: number,
  comparison: ComparisonType
): Promise<boolean | null> {
  const priceData = await fetchPythPrice(feedIdHex);
  
  if (!priceData) return null;
  
  switch (comparison) {
    case 0: // Above
      return priceData.price > threshold;
    case 1: // Below
      return priceData.price < threshold;
    case 2: // Equals (with some tolerance)
      const tolerance = priceData.conf; // Use confidence as tolerance
      return Math.abs(priceData.price - threshold) <= tolerance;
    default:
      return null;
  }
}

/**
 * Get human-readable feed name from feed ID
 */
export function getFeedName(feedIdHex: string): string {
  const normalizedId = feedIdHex.replace('0x', '').toLowerCase();
  
  for (const [name, id] of Object.entries(PRICE_FEEDS)) {
    if (id.toLowerCase() === normalizedId) {
      return name;
    }
  }
  
  return 'Unknown Feed';
}

/**
 * Convert feed ID string to bytes array for smart contract
 */
export function feedIdToBytes(feedIdHex: string): number[] {
  const hex = feedIdHex.replace('0x', '');
  const bytes: number[] = [];
  
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  
  // Pad to 32 bytes if needed
  while (bytes.length < 32) {
    bytes.push(0);
  }
  
  return bytes.slice(0, 32);
}

/**
 * Convert bytes array to feed ID hex string
 */
export function bytesToFeedId(bytes: number[]): string {
  return bytes
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get comparison type as human-readable string
 */
export function getComparisonLabel(comparison: ComparisonType): string {
  switch (comparison) {
    case 0:
      return 'Above';
    case 1:
      return 'Below';
    case 2:
      return 'Equals';
    default:
      return 'Unknown';
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number, feedName: string): string {
  // Most crypto prices have 2 decimal places
  const decimals = feedName.includes('BTC') ? 0 : 2;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

/**
 * Calculate price with exponent (for smart contract)
 */
export function priceToScaled(price: number, expo: number): bigint {
  return BigInt(Math.floor(price * Math.pow(10, -expo)));
}

/**
 * Validate oracle config
 */
export function validateOracleConfig(config: OracleConfig): string | null {
  // Check feed ID exists
  const feedName = getFeedName(config.feedId);
  if (feedName === 'Unknown Feed') {
    return 'Invalid price feed ID';
  }
  
  // Check threshold is positive
  if (config.threshold <= 0) {
    return 'Threshold must be positive';
  }
  
  // Check comparison type is valid
  if (![0, 1, 2].includes(config.comparison)) {
    return 'Invalid comparison type';
  }
  
  return null; // Valid
}


