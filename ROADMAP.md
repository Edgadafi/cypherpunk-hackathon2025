# 🛣️ PrismaFi Roadmap

> **Vision:** Build the most transparent, accessible, and feature-rich prediction market platform on Solana.

---

## ✅ Phase 1: MVP (Complete)

**Status:** ✅ **COMPLETED**

- [x] Core betting functionality (SOL-only)
- [x] Market creation & resolution
- [x] User dashboard with stats
- [x] Real-time updates
- [x] Social features (sharing, profiles)
- [x] Leaderboard & activity feed
- [x] Oracle-powered auto-resolution (Pyth Network)
- [x] AI-powered market insights (Swarms integration)

**Deployment:**
- ✅ Solana Devnet
- ✅ Vercel (Frontend)
- ✅ Live demo available

---

## 🚧 Phase 2: Enhanced UX (In Progress)

**Timeline:** Q1 2025

- [ ] Advanced charts & analytics
- [ ] Notification system (email/SMS/push)
- [ ] Mobile app (React Native)
- [ ] Portfolio tracking & analytics
- [ ] Improved error handling & user feedback
- [ ] Dark/light mode toggle
- [ ] Multi-language support (ES/EN)

---

## 🔮 Phase 3: Advanced Features

**Timeline:** Q2 2025

- [ ] **Scalar Markets** - Bet on continuous values (e.g., "What will BTC price be?")
- [ ] Liquidity pools & AMM integration
- [ ] Conditional markets ("If A then B")
- [ ] Market maker interface
- [ ] API for trading bots
- [ ] Advanced filtering & search
- [ ] Market templates

---

## 💰 Phase 4: Stablecoins & Multi-Token Support (v2)

**Timeline:** Q2-Q3 2025  
**Priority:** HIGH

### 4.1 Stablecoin Support

**USDC/USDT Integration:**
- [ ] SPL Token Program integration
- [ ] Support for USDC (Solana) and USDT (Solana)
- [ ] Token selection UI in betting interface
- [ ] Multi-token market pools
- [ ] Automatic token conversion for payouts

**Technical Requirements:**
- Anchor SPL token program integration
- Token account management
- Transfer instructions for SPL tokens
- Balance checks for multiple token types
- UI updates for token selection

### 4.2 On-Ramp Integration

**Fiat-to-Crypto:**
- [ ] Ramp Network integration
- [ ] Moonpay integration
- [ ] Transak integration (optional)
- [ ] Direct purchase flow in UI
- [ ] KYC/AML compliance (where required)

**User Flow:**
1. User clicks "Buy Crypto" button
2. Selects amount and payment method
3. Completes on-ramp flow
4. Tokens arrive in wallet
5. Can immediately bet

### 4.3 Off-Ramp Integration

**Crypto-to-Fiat:**
- [ ] Ramp Network off-ramp
- [ ] Moonpay cash-out
- [ ] Bank transfer integration
- [ ] Withdrawal flow in UI
- [ ] Compliance checks

**User Flow:**
1. User wins and has winnings in wallet
2. Clicks "Cash Out" button
3. Selects amount and destination
4. Completes KYC (if required)
5. Fiat arrives in bank account

### 4.4 Migration Path

**From SOL-Only to Multi-Token:**
- [ ] Backward compatibility for existing markets
- [ ] Gradual rollout (opt-in for new markets)
- [ ] User education & documentation
- [ ] Migration tooling for existing users
- [ ] Support for both SOL and stablecoin markets

### 4.5 Technical Architecture

**Smart Contract Changes:**
```rust
// New Market struct fields
pub struct Market {
    // ... existing fields ...
    pub accepted_tokens: Vec<Pubkey>,  // List of accepted token mints
    pub token_pools: HashMap<Pubkey, TokenPool>,  // Per-token pools
}

pub struct TokenPool {
    pub mint: Pubkey,
    pub yes_amount: u64,
    pub no_amount: u64,
}
```

**Frontend Changes:**
- Token selector component
- Multi-token balance display
- On-ramp/off-ramp modals
- Token conversion utilities

---

## 🌍 Phase 5: Mainnet & Growth

**Timeline:** Q3-Q4 2025

- [ ] Solana mainnet deployment
- [ ] Security audit (Sec3, OtterSec, or similar)
- [ ] Partnerships with data providers
- [ ] Mobile app launch (iOS & Android)
- [ ] Marketing campaign
- [ ] Governance token ($PRISMA) launch
- [ ] DAO formation
- [ ] Community grants program

---

## 🔮 Phase 6: Advanced Features (Future)

**Timeline:** 2026+

- [ ] Cross-chain support (via Wormhole)
- [ ] Layer 2 integration (Lightning, etc.)
- [ ] Institutional features
- [ ] API marketplace
- [ ] White-label solution
- [ ] Enterprise partnerships

---

## 📊 Success Metrics

### Phase 4 (Stablecoins) Goals:
- 50% of new bets use stablecoins
- 1,000+ on-ramp transactions/month
- 500+ off-ramp transactions/month
- <2% conversion friction

### Overall Platform Goals:
- 10,000+ active users
- $1M+ monthly volume
- 1,000+ active markets
- 99.9% uptime

---

## 🎯 Current Focus

**Q1 2025:**
1. ✅ Complete MVP (DONE)
2. 🚧 Enhanced UX features
3. 📋 Plan stablecoin integration

**Q2 2025:**
1. 💰 Implement stablecoin support (v2)
2. 🔗 On-ramp/off-ramp integration
3. 🧪 Testing & security audit

**Q3 2025:**
1. 🌍 Mainnet deployment
2. 📱 Mobile app launch
3. 🚀 Marketing & growth

---

## 🤝 Contributing

Want to help build PrismaFi? Check out our [Contributing Guide](./CONTRIBUTING.md) and pick a feature from the roadmap!

**High-Priority Contributions:**
- Stablecoin integration (Phase 4)
- Mobile app development (Phase 2)
- API development (Phase 3)

---

**Last Updated:** November 2024  
**Next Review:** December 2024

