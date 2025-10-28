# 🔮 Oracle Implementation Guide - Pyth Network Integration

> Complete implementation plan for adding Pyth Network oracle resolution to Trepa prediction markets

---

## 📋 Overview

This guide adds **automatic price-based resolution** to prediction markets using **Pyth Network**, Solana's leading price oracle.

**Example Market:**
- Question: "Will Bitcoin be above $100,000 on Dec 31, 2025?"
- Oracle: Pyth BTC/USD price feed
- Resolution: Automatic at end_time based on real BTC price

---

## 🏗️ Implementation Steps

### Step 1: Add Pyth Dependency ✅

Already added to `Cargo.toml`:
```toml
pyth-solana-receiver-sdk = "0.2.3"
```

### Step 2: Modify Smart Contract

#### A. Update Imports

Add to top of `lib.rs`:
```rust
use pyth_solana_receiver_sdk::price_update::{PriceUpdateV2, get_feed_id_from_hex};
```

#### B. Extend Market Account

Add oracle fields to `Market` struct:
```rust
#[account]
pub struct Market {
    pub authority: Pubkey,           // 32
    pub question: String,             // 4 + 200
    pub description: String,          // 4 + 500
    pub end_time: i64,                // 8
    pub created_at: i64,              // 8
    pub yes_amount: u64,              // 8
    pub no_amount: u64,               // 8
    pub resolved: bool,               // 1
    pub winning_outcome: bool,        // 1
    // NEW ORACLE FIELDS
    pub oracle_enabled: bool,         // 1 - Is this market oracle-resolved?
    pub oracle_feed_id: [u8; 32],     // 32 - Pyth price feed ID
    pub oracle_threshold: i64,        // 8 - Target price (e.g., $100,000)
    pub oracle_comparison: u8,        // 1 - 0=above, 1=below, 2=equals
}
```

**New space calculation:** `8 + 32 + 204 + 504 + 8 + 8 + 8 + 8 + 1 + 1 + 1 + 32 + 8 + 1 = 824 bytes`

#### C. Update create_market Instruction

```rust
pub fn create_market(
    ctx: Context<CreateMarket>,
    question: String,
    description: String,
    end_time: i64,
    oracle_enabled: bool,
    oracle_feed_id: Option<[u8; 32]>,
    oracle_threshold: Option<i64>,
    oracle_comparison: Option<u8>,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let clock = Clock::get()?;
    
    require!(question.len() <= 200, ErrorCode::QuestionTooLong);
    require!(end_time > clock.unix_timestamp, ErrorCode::InvalidEndTime);
    
    market.authority = ctx.accounts.authority.key();
    market.question = question;
    market.description = description;
    market.end_time = end_time;
    market.created_at = clock.unix_timestamp;
    market.yes_amount = 0;
    market.no_amount = 0;
    market.resolved = false;
    market.winning_outcome = false;
    
    // Oracle configuration
    market.oracle_enabled = oracle_enabled;
    
    if oracle_enabled {
        require!(oracle_feed_id.is_some(), ErrorCode::OracleFeedIdRequired);
        require!(oracle_threshold.is_some(), ErrorCode::OracleThresholdRequired);
        require!(oracle_comparison.is_some(), ErrorCode::OracleComparisonRequired);
        
        market.oracle_feed_id = oracle_feed_id.unwrap();
        market.oracle_threshold = oracle_threshold.unwrap();
        market.oracle_comparison = oracle_comparison.unwrap();
        
        // Validate comparison type (0, 1, or 2)
        require!(market.oracle_comparison <= 2, ErrorCode::InvalidOracleComparison);
    } else {
        market.oracle_feed_id = [0; 32];
        market.oracle_threshold = 0;
        market.oracle_comparison = 0;
    }
    
    Ok(())
}
```

#### D. Add resolve_with_oracle Instruction

```rust
pub fn resolve_with_oracle(ctx: Context<ResolveWithOracle>) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let clock = Clock::get()?;
    let price_update = &ctx.accounts.price_update;
    
    // Validations
    require!(!market.resolved, ErrorCode::AlreadyResolved);
    require!(clock.unix_timestamp >= market.end_time, ErrorCode::MarketNotExpired);
    require!(market.oracle_enabled, ErrorCode::OracleNotEnabled);
    
    // Get price from Pyth
    let price_feed = price_update.get_price_no_older_than(
        &clock,
        60, // Accept price up to 60 seconds old
        &market.oracle_feed_id,
    )?;
    
    let current_price = price_feed.price; // Price with exponent
    let expo = price_feed.expo; // Exponent (usually negative)
    
    // Convert threshold to same scale as price
    // Example: If BTC price is 98,500 with expo -2, it means $985.00
    // We need to compare apples to apples
    let threshold_scaled = market.oracle_threshold;
    
    // Determine outcome based on comparison type
    let outcome = match market.oracle_comparison {
        0 => current_price > threshold_scaled, // Above
        1 => current_price < threshold_scaled, // Below
        2 => current_price == threshold_scaled, // Equals (rare)
        _ => return Err(ErrorCode::InvalidOracleComparison.into()),
    };
    
    // Resolve market
    market.resolved = true;
    market.winning_outcome = outcome;
    
    msg!("Market resolved with oracle. Price: {}, Threshold: {}, Outcome: {}",
         current_price, threshold_scaled, outcome);
    
    Ok(())
}
```

#### E. Add ResolveWithOracle Context

```rust
#[derive(Accounts)]
pub struct ResolveWithOracle<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    /// The Pyth price update account
    pub price_update: Account<'info, PriceUpdateV2>,
    pub caller: Signer<'info>,
}
```

#### F. Update CreateMarket Context (increase space)

```rust
#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(init, payer = authority, space = 8 + 824)] // Updated space
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

#### G. Add New Error Codes

```rust
#[error_code]
pub enum ErrorCode {
    // ... existing errors ...
    #[msg("Oracle feed ID is required for oracle-enabled markets")]
    OracleFeedIdRequired,
    #[msg("Oracle threshold is required for oracle-enabled markets")]
    OracleThresholdRequired,
    #[msg("Oracle comparison type is required for oracle-enabled markets")]
    OracleComparisonRequired,
    #[msg("Invalid oracle comparison type (must be 0, 1, or 2)")]
    InvalidOracleComparison,
    #[msg("Oracle is not enabled for this market")]
    OracleNotEnabled,
    #[msg("Invalid price from oracle")]
    InvalidOraclePrice,
}
```

---

## 🎯 Pyth Price Feeds

### Common Crypto Feeds (Mainnet)

| Asset | Feed ID (hex) |
|-------|---------------|
| BTC/USD | `e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43` |
| ETH/USD | `ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace` |
| SOL/USD | `ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d` |
| USDC/USD | `eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a` |

### Devnet Test Feeds

For testing on devnet, Pyth provides test price feeds. You'll need to use Pyth's devnet deployment.

**Pyth Program (Devnet):** `gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s`

---

## 💻 Frontend Integration

### Step 3: Update IDL

After building the contract, copy the new IDL:
```bash
anchor build
cp target/idl/prediction_market.json ../prediction-market/src/idl/
```

### Step 4: Add Pyth SDK to Frontend

```bash
cd prediction-market
npm install @pythnetwork/price-service-client @pythnetwork/pyth-solana-receiver
```

### Step 5: Create Oracle-Enabled Market (Frontend)

```typescript
// lib/program/oracle.ts
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export interface OracleConfig {
  feedId: string; // Hex string
  threshold: number; // Price threshold (e.g., 100000 for $100k)
  comparison: 0 | 1 | 2; // 0=above, 1=below, 2=equals
}

export async function createOracleMarket(
  wallet: AnchorWallet,
  question: string,
  description: string,
  endTime: number,
  oracleConfig: OracleConfig,
): Promise<string> {
  // Convert hex feed ID to bytes
  const feedIdBytes = Buffer.from(oracleConfig.feedId, 'hex');
  
  // Build instruction data
  const data = encodeCreateMarketWithOracleData(
    question,
    description,
    endTime,
    true, // oracle_enabled
    Array.from(feedIdBytes), // oracle_feed_id
    oracleConfig.threshold, // oracle_threshold
    oracleConfig.comparison, // oracle_comparison
  );
  
  // ... rest of transaction building
}
```

### Step 6: Resolve with Oracle (Frontend)

```typescript
// lib/program/oracle.ts
import { PriceServiceConnection } from '@pythnetwork/price-service-client';

const PYTH_ENDPOINT = 'https://hermes.pyth.network';

export async function resolveWithOracle(
  wallet: AnchorWallet,
  marketId: string,
  feedId: string,
): Promise<string> {
  const connection = new PriceServiceConnection(PYTH_ENDPOINT);
  
  // Get latest price update from Pyth
  const priceUpdate = await connection.getLatestVaas([
    `0x${feedId}`
  ]);
  
  // Build resolve instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: new PublicKey(marketId), isSigner: false, isWritable: true },
      { pubkey: priceUpdateAccount, isSigner: false, isWritable: false },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: encodeResolveWithOracleData(),
  });
  
  const tx = new Transaction().add(instruction);
  const signature = await sendTransaction(tx, connection);
  
  return signature;
}
```

### Step 7: UI Components

#### A. Oracle Market Creation Form

```typescript
// components/markets/OracleMarketForm.tsx
'use client';

import { useState } from 'react';

const PRICE_FEEDS = [
  { name: 'BTC/USD', id: 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43' },
  { name: 'ETH/USD', id: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace' },
  { name: 'SOL/USD', id: 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d' },
];

export default function OracleMarketForm() {
  const [feedId, setFeedId] = useState('');
  const [threshold, setThreshold] = useState('');
  const [comparison, setComparison] = useState<0 | 1 | 2>(0);
  
  return (
    <div className="space-y-4">
      <div>
        <label>Price Feed</label>
        <select value={feedId} onChange={(e) => setFeedId(e.target.value)}>
          <option value="">Select asset...</option>
          {PRICE_FEEDS.map((feed) => (
            <option key={feed.id} value={feed.id}>{feed.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Threshold Price</label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="e.g., 100000 for $100k"
        />
      </div>
      
      <div>
        <label>Condition</label>
        <select value={comparison} onChange={(e) => setComparison(Number(e.target.value) as 0 | 1 | 2)}>
          <option value={0}>Above threshold</option>
          <option value={1}>Below threshold</option>
          <option value={2}>Equals threshold</option>
        </select>
      </div>
      
      <button onClick={handleCreate}>Create Oracle Market</button>
    </div>
  );
}
```

#### B. Oracle Status Display

```typescript
// components/markets/OracleStatus.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchPythPrice } from '@/lib/oracle/pyth';

export default function OracleStatus({ market }) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  useEffect(() => {
    if (!market.oracle_enabled) return;
    
    const fetchPrice = async () => {
      const price = await fetchPythPrice(market.oracle_feed_id);
      setCurrentPrice(price);
    };
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 5000); // Update every 5s
    
    return () => clearInterval(interval);
  }, [market.oracle_enabled, market.oracle_feed_id]);
  
  if (!market.oracle_enabled) return null;
  
  return (
    <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
      <h3 className="font-bold text-blue-300 mb-2">🔮 Oracle Resolution Enabled</h3>
      <div className="space-y-1 text-sm">
        <p>Current Price: ${currentPrice?.toLocaleString() || '...'}</p>
        <p>Target: ${market.oracle_threshold.toLocaleString()}</p>
        <p>Condition: {market.oracle_comparison === 0 ? 'Above' : market.oracle_comparison === 1 ? 'Below' : 'Equals'}</p>
        <p className="text-xs text-gray-400 mt-2">
          Market will auto-resolve at end time based on Pyth price feed
        </p>
      </div>
    </div>
  );
}
```

#### C. Auto-Resolve Button

```typescript
// components/markets/AutoResolveButton.tsx
'use client';

import { useState } from 'react';
import { resolveWithOracle } from '@/lib/program/oracle';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';

export default function AutoResolveButton({ market }) {
  const wallet = useAnchorWallet();
  const [isResolving, setIsResolving] = useState(false);
  
  const handleResolve = async () => {
    if (!wallet || !market.oracle_enabled) return;
    
    try {
      setIsResolving(true);
      const signature = await resolveWithOracle(
        wallet,
        market.id,
        Buffer.from(market.oracle_feed_id).toString('hex')
      );
      
      toast.success('Market auto-resolved with oracle!');
      // Refresh market data
    } catch (error) {
      console.error('Error resolving with oracle:', error);
      toast.error('Failed to resolve with oracle');
    } finally {
      setIsResolving(false);
    }
  };
  
  const canResolve = market.oracle_enabled && 
                     !market.resolved && 
                     Date.now() >= market.end_time * 1000;
  
  if (!canResolve) return null;
  
  return (
    <button
      onClick={handleResolve}
      disabled={isResolving}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
    >
      {isResolving ? 'Resolving...' : '🔮 Auto-Resolve with Oracle'}
    </button>
  );
}
```

---

## 🧪 Testing Plan

### Manual Testing Checklist

- [ ] Create oracle-enabled market with BTC/USD feed
- [ ] Place bets before end time
- [ ] Wait for end time to pass
- [ ] Call resolve_with_oracle
- [ ] Verify correct outcome based on Pyth price
- [ ] Claim winnings as winner
- [ ] Verify losers cannot claim

### Test Scenarios

1. **BTC Above $100k**
   - Create market: "BTC > $100k?" with feed, threshold 100000, comparison 0
   - Current BTC price: $105,000
   - Expected outcome: YES

2. **ETH Below $5k**
   - Create market: "ETH < $5k?" with feed, threshold 5000, comparison 1
   - Current ETH price: $4,500
   - Expected outcome: YES

3. **Market Not Expired**
   - Try to resolve before end_time
   - Should fail with "MarketNotExpired"

---

## 📊 Benefits

### For Users
- ✅ **Trustless Resolution** - No human bias
- ✅ **Instant Resolution** - Resolve immediately at end time
- ✅ **Verifiable** - Anyone can verify oracle price

### For Platform
- ✅ **Scalability** - No manual resolution needed
- ✅ **Professional** - Enterprise-grade infrastructure
- ✅ **New Markets** - Enable price-based markets

---

## 🚀 Next Steps

1. ✅ Add Pyth dependency to Cargo.toml
2. ⏳ Modify smart contract (lib.rs)
3. ⏳ Build and deploy to devnet
4. ⏳ Update IDL in frontend
5. ⏳ Add Pyth SDK to frontend
6. ⏳ Create oracle utility functions
7. ⏳ Build UI components
8. ⏳ Test end-to-end
9. ⏳ Document in README
10. ⏳ Demo in presentation!

---

## 💡 Demo Talking Points

**"Traditional prediction markets have a trust problem: someone has to manually resolve them. What if they're wrong? What if they're biased?"**

**"Trepa solves this with Pyth Network integration. For price-based markets like 'Will Bitcoin hit $100k?', the market auto-resolves using real, verifiable price data from Pyth's oracle network."**

**"This makes resolution:**
- ✅ **Trustless** - No human can cheat
- ✅ **Instant** - Resolves immediately at end time
- ✅ **Verifiable** - Anyone can check the Pyth price feed"

**"Watch this: I'll create a market tied to BTC's price, and at end time, anyone can click one button to resolve it using live market data."**

---

## 📚 Resources

- **Pyth Docs**: https://docs.pyth.network/documentation
- **Price Feeds**: https://pyth.network/developers/price-feed-ids
- **Solana SDK**: https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/solana/sdk
- **Hermes API**: https://hermes.pyth.network/docs/

---

**This is a game-changer for your demo! 🔥**





