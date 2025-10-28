# 🔮 Oracle Feature - Demo Script

> **Duration:** 3-5 minutes  
> **Goal:** Showcase trustless, automatic market resolution using Pyth Network  
> **Wow Factor:** ⭐⭐⭐⭐⭐

---

## 🎯 Demo Flow

### Pre-Demo Setup (Do this before presenting)
1. Have wallet with ~1 SOL ready
2. Open app in browser: https://cypherpunk-hackathon2025-three.vercel.app
3. Have [Pyth Network website](https://pyth.network) open in another tab for reference
4. Pre-check current BTC/SOL/ETH prices for talking points

---

## 📝 Script

### 1. **Introduction** (30 seconds)

**Say:**
> "Let me show you something that makes PrismaFi different from every other prediction market out there. Traditional prediction markets have a trust problem: someone has to manually resolve the outcome. What if they're biased? What if they disappear? What if they just don't feel like resolving?
>
> We solved this with **Oracle-powered automatic resolution** using Pyth Network."

**Show:** Homepage briefly, then click "Create Market"

---

### 2. **Create Oracle Market** (60-90 seconds)

**Say:**
> "Watch how easy it is to create a trustless market. I'm clicking on the **Oracle Market** tab here..."

**Do:**
- Click "🔮 Oracle Market" tab
- Show the beautiful gradient UI

**Say:**
> "I can choose from multiple price feeds - BTC, ETH, SOL, stablecoins. Let's create a market for Bitcoin. I'll set a threshold..."

**Do:**
- Select "BTC/USD" from dropdown
- Set threshold: Use current BTC price + $1000 (e.g., if BTC is $98,500, set $99,500)
- Select "Above" comparison
- Set end time: 2 minutes from now (for quick demo)
- Question: "Will BTC reach $[threshold] in next 2 minutes?"
- Description: "Market resolves using Pyth Network BTC/USD price feed at expiration."

**Say:**
> "Notice the key difference here: I'm setting a **mathematical condition** that will be checked automatically. No human judgment needed. When the timer expires, the smart contract will fetch the Bitcoin price directly from Pyth Network and resolve YES or NO. Completely trustless."

**Do:**
- Click "Create Market"
- Sign transaction
- Wait for confirmation

**Say while waiting:**
> "This market is now being deployed to Solana blockchain. The oracle configuration is stored immutably on-chain..."

---

### 3. **Show Market Detail** (30 seconds)

**Say:**
> "Here's our market. Notice this **Oracle Status** panel..."

**Do:**
- Navigate to created market
- Highlight the OracleStatus component showing:
  - Current BTC price (live from Pyth)
  - Threshold price
  - "Would Resolve As: YES/NO" indicator
  - Time remaining

**Say:**
> "This price is updating in real-time from Pyth Network. It's the same price feed that powers multi-billion dollar DeFi protocols like Kamino, Drift, and Mango Markets. When our timer hits zero, anyone - literally anyone - can click a button and the market resolves automatically."

---

### 4. **Place a Bet** (20 seconds)

**Say:**
> "Let me place a bet to show this is real money..."

**Do:**
- Bet 0.05 SOL on the outcome you think will win based on current price trend
- Sign transaction

**Say:**
> "Done. Now we wait for the market to expire..."

---

### 5. **Wait & Fill Time** (Adjust based on how much time remains)

**Say (while waiting):**
> "Think about what this enables:
> - **Weather markets** - Will temperature exceed 30°C? (with Pyth weather feeds)
> - **Commodity markets** - Will gold reach $2,500? (with Pyth commodity feeds)
> - **Index markets** - Will S&P 500 hit 6000? (once available)
> 
> All resolving automatically, trustlessly, instantly. No human intervention. No manipulation. Just pure mathematics and cryptographic proofs."

**Optional:** Navigate to Pyth Network website to show their validator network and explain Wormhole integration

---

### 6. **Auto-Resolution** (30-45 seconds)

**When timer expires:**

**Say:**
> "Alright, market has expired! Watch this..."

**Do:**
- Click "Auto-Resolve with Oracle" button
- Sign transaction

**Say while processing:**
> "The smart contract is now:
> 1. Fetching the latest BTC/USD price from Pyth
> 2. Verifying the cryptographic price proof
> 3. Comparing price vs our threshold
> 4. Resolving YES or NO based on pure math
> 
> No trust needed. No waiting for humans. Instant."

**Transaction confirms:**

**Say:**
> "Done! Market resolved in seconds. If I won, I can claim my winnings immediately."

---

### 7. **Show Result & Claim** (20 seconds)

**Do:**
- Show resolved outcome
- If won, click "Claim Winnings"
- Sign transaction

**Say:**
> "And that's it. Winnings claimed. The entire flow - create, bet, resolve, claim - all trustless and automatic."

---

### 8. **Closing** (20 seconds)

**Say:**
> "This is just the beginning. We're building a prediction market platform where:
> - Resolution is trustless by default
> - Anyone can create markets for real-world events
> - Outcomes are verifiable by anyone
> - Settlement is instant
> 
> Traditional prediction markets solved the problem of aggregating information. We're solving the problem of trust. That's PrismaFi."

**Show:** Dashboard with stats, or leaderboard, or go back to homepage

---

## 🎯 Key Talking Points

### Why This Matters
- **Trust Problem:** Traditional markets rely on centralized resolution
- **Manipulation Risk:** Humans can be biased, bribed, or simply wrong
- **Scalability:** Manual resolution doesn't scale to millions of markets
- **Speed:** Instant vs waiting hours/days for human resolution

### Technical Highlights
- **Pyth Network:** Powers $8B+ in DeFi, 350+ price feeds
- **Wormhole Bridge:** Cross-chain price data aggregation
- **Smart Contract:** Immutable logic, zero human intervention
- **Solana:** Sub-second finality, $0.00025 transaction cost

### Competitive Advantage
- **vs Polymarket:** They use UMA (human dispute resolution)
- **vs Augur:** Expensive on Ethereum, slow resolution
- **vs Kalshi:** Regulated, limited markets, manual settlement
- **PrismaFi:** Trustless, instant, unlimited markets, pennies in fees

---

## 🚨 Troubleshooting

### If Demo Market Doesn't Work
**Backup Plan:**
1. Show a pre-created oracle market that's already resolved
2. Walk through the oracle status UI components
3. Show the smart contract code on Solana Explorer
4. Emphasize the **concept** over the live demo

### If Price Doesn't Move Much
**Say:**
> "Notice the price isn't moving much right now - that's actually perfect for testing. In production, you'd set markets for bigger moves (e.g., 'Will BTC hit $100k by end of year'). The mechanism works the same regardless of timeframe."

### If Transaction Fails
**Say:**
> "Ah, Devnet is being slow. But look at the code - the logic is there, the smart contract is deployed. In production on Mainnet, this would be instant."

---

## 📊 Success Metrics

After the demo, judges/audience should be able to answer:
- ✅ What problem does Oracle solve? (Trust in resolution)
- ✅ How does it work? (Pyth Network price feeds)
- ✅ Why is it better? (Trustless, instant, scalable)
- ✅ What's possible? (Any price-based market)

---

## 🎬 Alternative Demo Flows

### Quick Demo (1-2 minutes)
1. Show pre-created resolved oracle market
2. Highlight OracleStatus panel
3. Show auto-resolve button
4. Explain benefits
5. Show Pyth Network integration

### Technical Deep Dive (10+ minutes)
1. Show smart contract code
2. Explain Pyth price verification
3. Walk through resolution logic
4. Show test transactions on Solana Explorer
5. Discuss security model
6. Q&A

### Business Focus (5 minutes)
1. Quick demo (1-2 min)
2. Market opportunity size
3. Monetization strategy
4. Competitive landscape
5. Roadmap & vision

---

## 🔗 Helpful Links to Have Ready

- **Live Demo:** https://cypherpunk-hackathon2025-three.vercel.app
- **Solana Explorer (Devnet):** https://explorer.solana.com?cluster=devnet
- **Program ID:** `GUzTP7BCgdTUTEDtguuUwZKdDbrkAKFiiRuqzpbSaQLu`
- **GitHub:** https://github.com/Edgadafi/cypherpunk-hackathon2025
- **Pyth Network:** https://pyth.network
- **Pyth Price Feeds:** https://pyth.network/developers/price-feed-ids

---

## ✨ Bonus Talking Points

### For Technical Judges
- "We're using Pyth's Hermes client for latest price data"
- "Smart contract validates price age and confidence intervals"
- "Fallback resolution if oracle temporarily unavailable"
- "Gas-optimized price proof verification"

### For Business Judges
- "Oracle enables 10x more market types"
- "Reduces operational overhead to near-zero"
- "Unlocks commodity, weather, macro markets"
- "Makes us the only truly trustless prediction platform"

### For Users
- "You never have to trust the market creator"
- "Resolution happens instantly when market expires"
- "Anyone can verify the outcome on-chain"
- "Same price feeds that power $8B+ in DeFi"

---

## 🎭 Practice Runs

### Before Demo:
1. **Run through 3x times** with different markets
2. **Time yourself** - should be 3-5 minutes max
3. **Record yourself** - watch for filler words
4. **Test on slow internet** - know how UI behaves
5. **Have backup plan** ready if live demo fails

### Day Of:
1. **Test demo flow** 30 minutes before
2. **Pre-create market** if needed
3. **Check Devnet** is operational
4. **Clear browser cache** for fresh start
5. **Have backup slides** just in case

---

**Remember:** The Oracle feature is your killer differentiator. Make it shine! 🌟

