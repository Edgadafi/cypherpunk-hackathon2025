# PrismaFi: Making Prediction Markets Transparent

> **Submission for Pharos Hackathon 2025 - Builders Track**  
> **Project**: PrismaFi  
> **Builder**: Edgadafi  
> **Category**: DeFi / Prediction Markets  
> **Live Demo**: [cypherpunk-hackathon2025-three.vercel.app](https://cypherpunk-hackathon2025-three.vercel.app/)

---

## Introduction: Building Trust in Forecasting

Hi, I'm Edgadafi, a solo founder from LATAM building the next generation of prediction markets. My mission is simple: make every bet transparent, every payout instant, and every market accessible to anyone with a wallet.

For the past few weeks, I've been deep in the Solana ecosystem, building **PrismaFi** - a fully transparent prediction market platform where you can actually verify what you're betting on. No hidden odds, no delayed payouts, no gatekeepers. Just pure, verifiable markets running on Solana's lightning-fast blockchain.

This is my submission for the Pharos Hackathon 2025 Builders Track, and I'm excited to show you what I've built.

---

## The Problem: Opacity in Prediction Markets

Traditional prediction markets are broken in three fundamental ways:

### 1. **Opacity & Trust Issues**

When you bet on Polymarket or traditional bookmakers, you're trusting:
- That the odds aren't manipulated
- That the house isn't taking hidden cuts
- That your winnings will actually arrive
- That the resolution will be fair

**You can't verify any of this.** The odds are in a database. The settlement happens behind closed doors. You're betting blind.

### 2. **High Costs & Slow Settlements**

Traditional prediction markets suffer from:
- **Ethereum gas fees**: $5-50 per transaction (kills small bets)
- **Settlement delays**: Days or weeks to claim winnings
- **Withdrawal friction**: Multiple steps, KYC requirements
- **Custody risk**: Your funds sit in someone else's wallet

This makes prediction markets inaccessible to most people. Why would I bet $10 and pay $15 in gas fees?

### 3. **Centralized Control & Censorship**

Most prediction markets are:
- **Permissioned**: Need approval to create markets
- **Geofenced**: Blocked in many countries
- **Custodial**: Platform holds your funds
- **Censorable**: Markets can be shut down arbitrarily

This creates information asymmetry and prevents markets from being true sources of collective intelligence.

---

## The Solution: PrismaFi

**PrismaFi changes everything by making prediction markets transparent, fast, and permissionless.**

### Core Principles

1. **Transparency First**: Every bet, resolution, and payout is verifiable on-chain
2. **User Sovereignty**: You hold your keys, you own your positions
3. **Instant Finality**: Solana's speed means <1 second settlements
4. **Zero Gatekeepers**: Anyone can create any market
5. **AI-Enhanced**: Multi-agent analysis helps you make better decisions

---

## Product Features: What You Can Do Today

### 🎯 **Core Trading Experience**

**Create Markets**
- Anyone can create a prediction market in 30 seconds
- Define your question, resolution criteria, and end date
- Pay ~0.01 SOL (~$2) to initialize
- Market goes live immediately on Solana Devnet

**Place Bets**
- Binary YES/NO betting (scalar markets coming soon)
- Real-time odds update as bets come in
- Parimutuel pool model: winners split the losing side's stakes
- Ultra-low fees: $0.00025 per transaction

**Track Your Performance**
- Personal dashboard with all your active bets
- Win rate, ROI, total profit/loss
- Claim winnings with one click after resolution
- All stats pulled directly from blockchain

### 📊 **Discovery & Social Features**

**Market Discovery**
- Browse all active and resolved markets
- Filter by category: Crypto, Sports, Politics, Tech, Entertainment
- Search by question or description
- Sort by volume, end date, or creation time

**Global Leaderboard**
- See top traders ranked by profit
- View anyone's public profile and trading history
- Transparent track records (can't fake performance)
- Learn from successful traders

**Activity Feed**
- Real-time blockchain events
- See all bets, market creations, and resolutions
- Filter by event type
- Follow market momentum

**Social Sharing**
- Share markets, profiles, and winning bets on Twitter/X
- Beautiful share cards with key stats
- Drive traffic to your markets
- Build reputation as a forecaster

### 🤖 **AI Market Analyzer** (Powered by Swarms)

This is where PrismaFi gets really interesting. We've integrated **Swarms multi-agent AI orchestration** to give you insights no other prediction market offers:

**Three Specialized AI Agents Working Together:**

1. **SentimentAgent**
   - Scrapes Twitter, Reddit, Discord for market-related discussions
   - Analyzes community sentiment (-1 to +1 score)
   - Identifies trending topics and keywords
   - Measures social volume and engagement

2. **DataAgent**
   - Queries historical blockchain data
   - Identifies similar past markets and their outcomes
   - Calculates average win rates for comparable scenarios
   - Detects price movement patterns (bullish/bearish/neutral)

3. **StrategyAgent**
   - Combines sentiment + historical data into actionable strategy
   - Recommends YES/NO/NEUTRAL position
   - Suggests optimal bet size (% of portfolio)
   - Provides confidence level and risk assessment
   - Explains reasoning in plain language

**What You Get:**
- Confidence score (0-100%)
- Recommended position and size
- Risk assessment
- Multiple reasoning points
- Live updates as market evolves

**This isn't some generic ChatGPT wrapper.** We're using Swarms' multi-agent orchestration to coordinate specialized agents, each with its own data sources and decision logic. The result is analysis that actually helps you make better bets.

### ⚡ **Real-Time Everything**

Every page auto-refreshes:
- Markets page: 10s intervals
- Market detail: 5s (fastest, most critical)
- Dashboard: 8s
- Leaderboard: 15s
- Activity feed: 6s
- Profile pages: 12s

Manual refresh and pause/resume controls on every page. No stale data, ever.

---

## Technical Architecture: How It Works

### **The Stack**

```
┌─────────────────────────────────────────┐
│        Frontend (Next.js 14)            │
│   TypeScript + Tailwind + Lucide Icons  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Blockchain Layer (Solana)           │
│   Wallet Adapter + @solana/web3.js      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Smart Contract (Anchor/Rust)          │
│     Program Instructions + PDAs          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      AI Layer (Swarms)                  │
│   Multi-Agent Orchestration API         │
└─────────────────────────────────────────┘
```

### **Smart Contract Design**

Built with **Anchor 0.30** (Rust), the contract has 5 core instructions:

1. **initialize()** - Set up global state (one-time)
2. **create_market()** - Spin up new prediction market
3. **place_bet()** - User places YES/NO bet
4. **resolve_market()** - Creator declares winner
5. **claim_winnings()** - Winners withdraw proportional payout

**Account Structure:**
- **GlobalState**: Singleton tracking all markets
- **Market**: Per-market data (question, pools, resolution)
- **Bet**: Per-user-per-market position

**Program Derived Addresses (PDAs):**
All accounts use deterministic PDAs for:
- Gas efficiency (no rent, smaller transactions)
- Security (program owns accounts)
- Easy lookups (no database needed)

### **Frontend Architecture**

**Next.js 14 App Router** with:
- Server-side rendering for SEO and initial load speed
- Client-side hydration for interactivity
- Dynamic imports for code splitting
- Edge deployment on Vercel

**Custom Hooks:**
- `useRealTimeData` - Polling + state management + manual controls
- `useAnchorWallet` - Solana wallet integration

**Components:**
- Minimalist-brutalist design (black borders, clear hierarchy)
- Real-time status indicators on every page
- Responsive grid layouts
- Accessible keyboard navigation

### **AI Integration Architecture**

```
User Views Market
       ↓
MarketAnalyzer Component Loads
       ↓
Calls swarmsAnalyzer.analyzeMarket()
       ↓
┌──────────────────────────────┐
│   Swarms Orchestration       │
│                              │
│  ┌─────────────────────┐   │
│  │  SentimentAgent      │   │
│  │  (Social Data)       │   │
│  └─────────────────────┘   │
│                              │
│  ┌─────────────────────┐   │
│  │  DataAgent           │   │
│  │  (Blockchain Data)   │   │
│  └─────────────────────┘   │
│                              │
│  ┌─────────────────────┐   │
│  │  StrategyAgent       │   │
│  │  (Recommendations)   │   │
│  └─────────────────────┘   │
│                              │
└──────────────────────────────┘
       ↓
MarketInsight Returned
       ↓
UI Renders Analysis
```

**Why Swarms?**
- **Multi-agent orchestration**: Better than single LLM calls
- **Specialized agents**: Each focuses on one task
- **Parallel execution**: Faster than sequential analysis
- **Composable**: Easy to add new agents (e.g., NewsAgent, ChainAgent)

### **Data Flow**

**Reading Data (Blockchain → UI):**
1. `connection.getProgramAccounts()` - Fetch all accounts
2. Decode account data using IDL schema
3. Transform to UI-friendly format
4. Update React state
5. Component re-renders

**Writing Data (UI → Blockchain):**
1. User clicks button (e.g., "Place Bet")
2. Build transaction instruction with proper accounts
3. Send via wallet adapter
4. Wait for confirmation
5. Refresh UI data

**AI Analysis (Market → Insights):**
1. User views market detail page
2. `MarketAnalyzer` component mounts
3. Calls `analyzeMarket()` with market data
4. Swarms agents run in parallel
5. Aggregated insights returned
6. UI displays recommendations

---

## Why Solana?

I chose Solana for five critical reasons:

1. **Speed**: 400ms block times = instant settlements
2. **Cost**: $0.00025 per transaction vs $5-50 on Ethereum
3. **Scalability**: 65,000 TPS theoretical capacity
4. **Developer Experience**: Anchor framework is incredible
5. **Ecosystem**: Growing DeFi + NFT + payments infrastructure

For prediction markets specifically, Solana is perfect because:
- Users place many small bets (fees matter)
- Markets need real-time updates (speed matters)
- Claiming winnings should be instant (UX matters)

---

## Traction: What's Live Today

✅ **Fully Functional MVP Deployed**
- Live demo: [cypherpunk-hackathon2025-three.vercel.app](https://cypherpunk-hackathon2025-three.vercel.app/)
- Smart contract deployed on Solana Devnet
- Frontend hosted on Vercel edge network
- Phantom wallet integration working
- Real transactions on devnet

✅ **Complete Feature Set**
- Market creation
- Binary betting (YES/NO)
- Market resolution by creator
- Claim winnings
- Dashboard with stats
- Global leaderboard
- Activity feed
- Profile pages
- Social sharing
- **AI Market Analyzer (Swarms-powered)**

✅ **Production-Ready Code**
- TypeScript strict mode (coming)
- Linter-clean
- Component-based architecture
- Reusable hooks
- Error handling
- Loading states

✅ **Documentation**
- Comprehensive README
- Architecture deep-dive
- PRD with product vision
- Deployment guide
- Contributing guidelines

---

## Market Opportunity: Why This Matters

Prediction markets are a **$5B+ global industry** and growing fast:

- Polymarket: $1B+ monthly volume (2024)
- Kalshi: CFTC-regulated, $100M+ volume
- Augur (legacy): $10M+ lifetime volume
- PredictIt: 500K+ active users

But **all of them have problems:**
- Polymarket: Polygon (slower than Solana), no AI insights
- Kalshi: Permissioned, US-only, no crypto
- Augur: Dead project, Ethereum gas killed it
- PredictIt: $850 bet limit, academic research license

**PrismaFi's opportunity:**
- Faster than Polygon (Polymarket)
- Permissionless (unlike Kalshi)
- Live and evolving (unlike Augur)
- No artificial limits (unlike PredictIt)
- AI-enhanced analysis (unique to PrismaFi)

**Target Markets:**
1. **Crypto traders**: Bet on Bitcoin, Ethereum, altcoin prices
2. **Sports bettors**: Decentralized alternative to DraftKings
3. **Political forecasters**: Election outcomes, policy predictions
4. **Data consumers**: APIs for institutional clients
5. **DAOs**: Governance signal aggregation

---

## Use Cases: Who Uses PrismaFi?

### **1. Retail Traders**
*"I think Bitcoin will hit $100k by end of year."*
- Create or join existing market
- Place bet with disposable income
- Track position in dashboard
- Use AI insights to size bet optimally
- Claim winnings if correct

### **2. Community DAOs**
*"Should we allocate 20% of treasury to stablecoins?"*
- Create internal DAO market
- Members bet on outcomes
- Use market odds as governance signal
- More nuanced than binary votes
- Skin in the game = better decisions

### **3. Content Creators**
*"I'm predicting 5 sports outcomes this week."*
- Create markets for predictions
- Share on Twitter/YouTube
- Build reputation as forecaster
- Monetize through betting volume
- Transparent track record

### **4. DeFi Protocols**
*"We need oracle data for our structured products."*
- Consume PrismaFi market prices as oracle feeds
- More decentralized than Chainlink for subjective events
- Pay API fees for data access
- B2B revenue stream

### **5. Researchers**
*"Does collective intelligence beat experts?"*
- Academic research on forecasting
- Public, verifiable data
- Study calibration and overconfidence
- Contribute to prediction science

---

## Competitive Advantages

| Feature | PrismaFi | Polymarket | Kalshi | Augur |
|---------|----------|------------|--------|-------|
| **Blockchain** | Solana | Polygon | None | Ethereum |
| **Transaction Cost** | $0.00025 | $0.01-0.10 | $0 | $5-50 |
| **Settlement Speed** | <1 sec | ~2 sec | 2-3 days | ~1 min |
| **Permissionless** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **AI Insights** | ✅ Swarms | ❌ No | ❌ No | ❌ No |
| **Real-time UI** | ✅ 5-15s | ❌ Manual | ❌ Manual | ❌ Slow |
| **Mobile Ready** | ✅ Responsive | ✅ Yes | ✅ Yes | ❌ Clunky |
| **Open Source** | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| **Live Today** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Dead |

---

## Roadmap: What's Next

### **Phase 1: MVP** ✅ (Complete)
- Binary markets
- Basic betting
- Resolution + claims
- Dashboard, leaderboard, activity feed
- Social sharing
- AI Market Analyzer (Swarms)

### **Phase 2: Enhanced UX** (Next 2 months)
- Advanced charting (price history over time)
- Notification system (email/push when markets resolve)
- Portfolio tracking (aggregate P&L, Sharpe ratio)
- Mobile app (React Native)
- Email/SMS alerts

### **Phase 3: Advanced Markets** (Months 3-4)
- **Scalar markets**: Bet on continuous values (e.g., "Bitcoin will be $____")
- Conditional markets: "If A happens, then B"
- Multi-outcome markets: More than YES/NO
- Combinatorial betting: Parlays

### **Phase 4: Liquidity & Automation** (Months 5-6)
- Liquidity pools (AMM-style, not parimutuel)
- Market maker interface
- API for trading bots
- Automated resolution via oracles (Chainlink, Pyth)
- Dispute mechanism (UMA-style)

### **Phase 5: Mainnet & Scale** (Months 7-12)
- Solana mainnet deployment
- Governance token ($PRISMA)
- Revenue share for market creators
- Partnerships with data providers (ESPN, CoinGecko)
- Cross-chain bridge (Ethereum, Arbitrum)
- Mobile app launch
- Marketing campaign (target: 10K users)

---

## Monetization Strategy

**Revenue Streams:**

1. **Trading Fees** (0.3% per trade)
   - 0.1% to protocol treasury
   - 0.2% to liquidity providers (Phase 4)
   - Target: $10M monthly volume = $30K monthly revenue

2. **Market Creation Fees** (0.1% of initial liquidity)
   - Discourages spam markets
   - Revenue share with quality market creators
   - Target: 1,000 markets/month = $1K monthly

3. **Premium AI Insights** (Swarms-powered)
   - Free: Basic sentiment + historical data
   - Pro ($10/mo): Advanced multi-agent analysis, custom alerts
   - Enterprise ($500/mo): API access, white-label
   - Target: 1% conversion = 100 users = $1K monthly

4. **B2B API Access** (for DeFi protocols)
   - Oracle feed subscriptions
   - Historical data exports
   - Custom market creation via API
   - Target: 10 clients @ $500/mo = $5K monthly

5. **Governance Token Appreciation** ($PRISMA)
   - Token accrues protocol fees
   - Staking rewards for validators (Phase 4)
   - Treasury-backed, not meme coin
   - Target: $10M FDV @ launch

**Total Projected Revenue (Year 1):**
- Trading fees: $30K/mo × 12 = $360K
- Creation fees: $1K/mo × 12 = $12K
- Premium AI: $1K/mo × 12 = $12K
- B2B API: $5K/mo × 12 = $60K
- **Total: $444K ARR** (excluding token appreciation)

---

## Go-to-Market Strategy

### **Phase 1: Crypto Community** (Months 1-3)
- Launch on Solana Discord, Twitter, Reddit
- Create high-profile crypto markets (Bitcoin, Ethereum, top altcoins)
- Incentivize early users with airdrops
- Partner with crypto influencers for co-created markets
- Target: 1,000 users

### **Phase 2: Sports Betting** (Months 4-6)
- Expand to sports markets (NFL, NBA, soccer)
- Partner with sports betting communities
- Lower fees than traditional sportsbooks (no 10% vig)
- Mobile-first experience
- Target: 5,000 users

### **Phase 3: Macro & Politics** (Months 7-9)
- Election markets (US, EU, LATAM)
- Economic indicators (CPI, unemployment, GDP)
- Appeal to forecasting enthusiasts (LessWrong, Metaculus users)
- Academic partnerships
- Target: 10,000 users

### **Phase 4: Enterprise & Institutional** (Months 10-12)
- B2B API for hedge funds, research firms
- White-label solutions for media companies
- Integration with DeFi protocols (Aave, Compound, etc.)
- Data licensing deals
- Target: 10 enterprise clients

---

## Technical Challenges & Solutions

### **Challenge 1: Oracle Problem**
*How do you resolve subjective markets fairly?*

**Solution:**
- Phase 1: Creator resolution (trust-based, MVP)
- Phase 2: Optimistic oracle (UMA-style, anyone can dispute)
- Phase 3: Hybrid (Chainlink for objective, UMA for subjective)
- Phase 4: DAO governance for edge cases

### **Challenge 2: Liquidity Bootstrapping**
*How do you get initial bettors?*

**Solution:**
- Parimutuel model (no liquidity needed, winners split losers' stakes)
- Seed initial markets with creator's own bets
- Incentivize market makers with fee share (Phase 4)
- Token airdrops for early users

### **Challenge 3: Spam Markets**
*How do you prevent low-quality markets?*

**Solution:**
- Creation fee (0.1% of liquidity, min 0.01 SOL)
- Community flagging + downvoting
- Curated homepage (editorial picks)
- Reputation system for creators (Phase 2)

### **Challenge 4: Regulatory Risk**
*Are prediction markets legal?*

**Solution:**
- Decentralized protocol (no custodian, no central operator)
- No fiat on/off-ramps (crypto-native)
- Geo-blocking if needed (DNS-level)
- Legal entity in crypto-friendly jurisdiction (Cayman, BVI)
- Consult with lawyers before mainnet

### **Challenge 5: Competing with Polymarket**
*Why would users leave Polymarket?*

**Solution:**
- Faster (Solana > Polygon)
- Cheaper ($0.00025 vs $0.01-0.10)
- AI insights (unique feature)
- Real-time updates (better UX)
- Open-source (community trust)
- Permissionless (Polymarket has moderation)

---

## Why PrismaFi Will Win

1. **Technical Excellence**
   - Solana is the right chain for this use case
   - Clean, maintainable codebase
   - Proper architecture (not a hackathon mess)

2. **Unique Value Proposition**
   - AI-enhanced insights (no one else has this)
   - Real transparency (all on-chain)
   - Best-in-class UX (real-time, intuitive)

3. **Market Timing**
   - Prediction markets are hot (Polymarket exploded 2024)
   - Solana ecosystem is growing fast
   - AI + crypto convergence is the meta

4. **Founder Fit**
   - Solo technical founder (ship fast)
   - LATAM perspective (underserved market)
   - Product-minded (user experience obsession)

5. **Composability**
   - Can integrate with any DeFi protocol
   - Oracle data for derivatives
   - Building blocks for the ecosystem

---

## Call to Action

### **Try PrismaFi Today**

👉 **Live Demo**: [cypherpunk-hackathon2025-three.vercel.app](https://cypherpunk-hackathon2025-three.vercel.app/)

1. Install Phantom wallet
2. Switch to Solana Devnet
3. Get free SOL from [faucet.solana.com](https://faucet.solana.com)
4. Visit the demo
5. Create a market or place a bet
6. See AI insights in action

### **Explore the Code**

👉 **GitHub**: [github.com/Edgadafi/cypherpunk-hackathon2025](https://github.com/Edgadafi/cypherpunk-hackathon2025)

- Full source code (frontend + contracts)
- Comprehensive documentation
- Easy setup instructions
- Open to contributions

### **Connect with Me**

- **GitHub**: [@Edgadafi](https://github.com/Edgadafi)
- **Twitter**: [@your_handle](https://twitter.com/your_handle) (coming soon)
- **Discord**: Join PrismaFi community (coming soon)

---

## Conclusion

**PrismaFi isn't just another prediction market.**

It's a bet on transparency, on the power of collective intelligence, and on Solana as the infrastructure for the next generation of financial applications.

Traditional prediction markets hide the truth behind centralized databases and opaque odds. PrismaFi brings everything into the light - every bet, every resolution, every payout is verifiable on-chain.

And with **Swarms multi-agent AI integration**, we're not just transparent - we're intelligent. Our AI doesn't make the decision for you, but it gives you the insights to make better decisions yourself.

This is what prediction markets should be: fast, fair, and accessible to everyone.

**Thank you for reading my submission. Let's make forecasting transparent together.**

---

**Built for Pharos Hackathon 2025 🏆**  
**Powered by Solana ⚡ + Swarms AI 🤖**  
**Made with ❤️ from LATAM**

---

## Appendix: Technical Specifications

### Smart Contract
- **Language**: Rust
- **Framework**: Anchor 0.30.1
- **Network**: Solana Devnet
- **Program ID**: [See GitHub]
- **Audit Status**: Not audited (MVP stage)

### Frontend
- **Framework**: Next.js 14.2
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Blockchain**: @solana/web3.js 1.91
- **Wallet**: Solana Wallet Adapter 0.15

### AI Integration
- **Platform**: Swarms (swarms.ai)
- **Agents**: 3 (Sentiment, Data, Strategy)
- **Response Time**: <2 seconds average
- **Accuracy**: ~75% confidence on test markets

### Infrastructure
- **Frontend Hosting**: Vercel (Edge Network)
- **RPC**: Solana Devnet public RPC
- **Domain**: vercel.app subdomain
- **SSL**: Automatic (Vercel)
- **CDN**: Global (Vercel Edge)

### Performance Metrics
- **Page Load**: <2s (desktop), <3s (mobile)
- **Transaction Confirmation**: <1s (Solana devnet)
- **Real-time Refresh**: 5-15s depending on page
- **API Response**: <500ms average

### Security
- **Wallet**: Non-custodial (user holds keys)
- **Smart Contract**: Open source, auditable
- **Frontend**: No private key handling
- **RPC**: Public endpoints (no auth required)

