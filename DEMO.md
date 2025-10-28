# 🎬 Trepa - Demo Guide & Talking Points

> Complete guide for presenting Trepa at the Cypherpunk Hackathon 2025

---

## 🎯 Elevator Pitch (30 seconds)

"**Trepa** is a next-generation prediction market on Solana that lets you **bet on numbers, not just yes/no**. Instead of asking 'Will Bitcoin hit $100k?', we let you predict *where exactly* it will land. More accurate predictions earn bigger rewards. Think of it as **darts, not coin flips**."

---

## 📋 Demo Script (5 minutes)

### 1. Opening Hook (30s)

**"Show of hands - who here has used a prediction market like Polymarket?"**

*"Great! Now, have you ever felt frustrated that you can only bet yes or no? You *know* Bitcoin won't hit $100k, but you also think $85k is too high... What if you could bet it lands at $92k?"*

**"That's what Trepa does. Let me show you."**

---

### 2. Product Demo (3 min)

#### Part A: Browse Markets (30s)

**Action**: Navigate to `/markets` page

**Script**: 
*"Here's our live marketplace on Solana Devnet. Notice the **real-time updates** - this green indicator shows data refreshing every 10 seconds. You can search, filter by category, and see implied probabilities calculated from the betting pool."*

**Key Points to Highlight**:
- ✅ Real-time odds updating
- ✅ Search functionality
- ✅ Category filters
- ✅ Visual status indicators

---

#### Part B: Place a Bet (45s)

**Action**: Click on a market, place a bet

**Script**:
*"Let's click into a market. Here you see the full details - question, resolution criteria, end date. The odds update in real-time as people bet. I'm going to bet 0.1 SOL on Yes."*

**[Connect Phantom wallet]**

*"I connect my Phantom wallet - this is all on Solana Devnet, so it's free test SOL. Confirm the transaction... and boom, my bet is placed. Notice how the odds immediately updated."*

**Key Points**:
- ✅ Wallet integration (Phantom)
- ✅ Instant transaction confirmation
- ✅ Live odds recalculation
- ✅ Transaction cost (<0.001 SOL)

---

#### Part C: User Dashboard (30s)

**Action**: Navigate to `/dashboard`

**Script**:
*"Now let me show you my personal dashboard. Here I can see all my active bets, my win rate, profit/loss, ROI - all updating in real-time every 8 seconds. I can filter by status, claim winnings, and see which markets I'm winning."*

**Key Points**:
- ✅ Personal stats tracking
- ✅ Win rate & ROI metrics
- ✅ Active/resolved bet filtering
- ✅ One-click claim winnings

---

#### Part D: Social Features (30s)

**Action**: Navigate to `/leaderboard` and `/profile/[wallet]`

**Script**:
*"Here's the global leaderboard - showing top traders ranked by profit. You can click any trader to see their full profile, history, and even share on Twitter. This creates a competitive, social experience."*

**Key Points**:
- ✅ Global rankings
- ✅ Public profiles
- ✅ Social sharing
- ✅ Activity feed

---

#### Part E: Resolution & Claiming (30s)

**Action**: Show resolved market and claim button

**Script**:
*"When a market ends, the creator resolves it with the winning outcome. Winners then claim their proportional share of the losing pool. It's all trustless on Solana - no centralized authority."*

**Key Points**:
- ✅ Market creator resolution
- ✅ Proportional payouts
- ✅ Trustless claiming
- ✅ On-chain verification

---

### 3. Technical Highlights (1 min)

**Script**:
*"Under the hood, Trepa is built with:*
- *Rust smart contracts using Anchor framework on Solana*
- *Next.js 14 frontend with TypeScript*
- *Custom real-time system with auto-refresh on every page*
- *Direct transaction building for maximum control*
- *All open-source and ready to fork"*

**Show Architecture Diagram (optional)**

---

### 4. The Vision (30s)

**Script**:
*"Right now, Trepa is binary markets - yes or no. But our roadmap includes **scalar markets** where you bet on continuous values. Imagine predicting Bitcoin's exact price, or GDP growth, or inflation numbers. The closer you are, the more you win."*

*"We're also planning:*
- *Automated oracle resolution with Chainlink/Pyth*
- *Liquidity pools and AMMs*
- *Mobile app*
- *Mainnet launch"*

---

### 5. Closing (30s)

**Script**:
*"Trepa is live on Solana Devnet right now. You can try it, fork it, build on it. We're looking for feedback, collaborators, and early adopters. Thank you!"*

**CTA**: 
- Show QR code to live demo
- Show GitHub repo link
- Show contact info

---

## 🎤 Q&A Preparation

### Common Questions & Answers

**Q: How do you ensure fair resolution?**

A: *"Currently, market creators resolve their own markets, similar to early Augur. We're implementing UMA's optimistic oracle pattern where anyone can dispute incorrect resolutions with a bond. Long-term, we'll integrate Chainlink/Pyth for automated resolution of price-based markets."*

---

**Q: What prevents creators from cheating?**

A: *"Great question! Right now, it's reputation-based - your profile is public, so bad actors get exposed. In our next version, we're adding a dispute mechanism where wrong resolutions can be challenged with economic incentives to be honest."*

---

**Q: Why Solana over Ethereum?**

A: *"Three reasons: speed, cost, and composability. Solana gives us sub-second finality and transaction costs under $0.001. For a betting app where users make frequent small bets, that's critical. Plus, Solana's programming model with Anchor makes it easy to build secure, auditable contracts."*

---

**Q: How is this different from Polymarket?**

A: *"Polymarket is amazing for binary markets, but limited to yes/no. Trepa's roadmap includes scalar markets where you bet on ranges and exact values. We're also fully open-source, while Polymarket is closed. And we're Solana-native, which means cheaper transactions."*

---

**Q: What's your business model?**

A: *"We're planning a small platform fee (1-2%) on winning bets, similar to how betting exchanges work. We're also exploring a governance token ($TREPA) for stakeholders who want to participate in platform decisions and earn fee revenue."*

---

**Q: How do you handle liquidity?**

A: *"Right now, it's a peer-to-pool model - all bets go into a single pool, and winners split the losers' contributions proportionally. It's simple and works for any market size. For v2, we're building an AMM (Automated Market Maker) to provide instant liquidity and tighter spreads."*

---

**Q: Can I use this on mainnet?**

A: *"Not yet - we're on Devnet for testing. Mainnet launch is planned after we've completed a smart contract audit and added dispute resolution. We expect Q2 2025 for mainnet beta."*

---

**Q: What about regulatory concerns?**

A: *"Prediction markets are legal in many jurisdictions when structured correctly. We're consulting with legal experts to ensure compliance. Some markets (like sports betting) may be restricted in certain regions, but information markets (like economic indicators) are generally allowed. Users are responsible for complying with their local laws."*

---

**Q: How do you plan to grow this?**

A: *"Three pillars:*
1. *Community - incentivize early market creators with rewards*
2. *Partnerships - integrate with data providers and other DeFi protocols*
3. *Content - create interesting markets around major events to drive engagement"*

---

## 📊 Metrics to Share

### Current Stats (Update with real numbers)
- **Markets Created**: [X] markets
- **Total Volume**: [Y] SOL wagered
- **Active Users**: [Z] unique wallets
- **Transaction Speed**: <2 seconds average
- **Transaction Cost**: <$0.001 per bet
- **Uptime**: 99.9% (Vercel + Solana)

### Technical Achievements
- ✅ 6 pages with real-time auto-refresh
- ✅ Custom React hooks for data polling
- ✅ Direct Solana program interaction
- ✅ SSR-compatible architecture
- ✅ TypeScript strict (planned)
- ✅ Open-source MIT license

---

## 🎥 Video Demo Script (2-3 minutes)

### Recording Setup
- Screen recording: OBS or Loom
- Resolution: 1920x1080
- Browser: Chrome (clean profile, no extensions visible)
- Wallet: Phantom with ~5 SOL balance
- Audio: Clear voice with minimal background noise

### Script

**[0:00-0:15] - Hook**

*"Hi, I'm [Your Name], and this is Trepa - a prediction market platform on Solana. Instead of betting yes or no, you bet on exact numbers. Let me show you how it works."*

**[0:15-0:45] - Browse & Bet**

*"Here's the marketplace. I can search, filter, and see live odds. Let's bet on this market about Bitcoin. I'll connect my Phantom wallet and bet 0.1 SOL on Yes. Transaction confirmed in under 2 seconds."*

**[0:45-1:15] - Dashboard**

*"My dashboard shows all my bets, win rate, and profit/loss. Everything updates in real-time. I can filter by status and claim winnings with one click."*

**[1:15-1:45] - Social**

*"Here's the global leaderboard showing top traders. I can view anyone's profile, see their trading history, and share on social media. This creates a competitive, engaging experience."*

**[1:45-2:15] - Vision**

*"Right now, Trepa is binary markets, but we're building scalar markets where you predict exact values - like Bitcoin's price or economic indicators. The closer you are, the more you win. Think of it as darts, not coin flips."*

**[2:15-2:30] - Call to Action**

*"Trepa is live on Solana Devnet. Try it, fork it, build on it. Links in the description. Thanks for watching!"*

**[Show end screen with:]**
- Live demo URL
- GitHub repo link
- Twitter/Discord (if available)

---

## 🖼️ Screenshots to Prepare

1. **Markets Page** - Showing multiple markets with real-time status
2. **Market Detail** - Betting interface with odds
3. **Dashboard** - User stats and bet history
4. **Leaderboard** - Top 10 traders
5. **Profile Page** - Public user profile
6. **Activity Feed** - Recent blockchain events
7. **Mobile View** - Responsive design

Save as PNG in `docs/screenshots/` folder.

---

## 📝 Presentation Deck Outline

### Slide 1: Title
- **Trepa**
- Prediction Markets on Solana
- [Your Name / Team]
- Cypherpunk Hackathon 2025

### Slide 2: The Problem
- Current prediction markets are binary (yes/no)
- Limited expressiveness for beliefs
- Can't express confidence levels or ranges

### Slide 3: The Solution
- Trepa: Bet on numbers, not just outcomes
- Scalar markets (coming soon)
- Real-time, social, competitive

### Slide 4: Demo
- [Live demo or video recording]

### Slide 5: How It Works
- Solana smart contracts (Rust + Anchor)
- Next.js frontend with real-time updates
- Proportional payouts from betting pools

### Slide 6: Key Features
- Real-time odds & data
- User dashboard & stats
- Global leaderboard
- Social sharing
- Fast & cheap (Solana)

### Slide 7: Tech Stack
- Frontend: Next.js 14, TypeScript, Tailwind
- Blockchain: Solana, Anchor, Rust
- Deployment: Vercel (frontend), Devnet (contract)

### Slide 8: Roadmap
- Q1 2025: MVP (Done ✅)
- Q2 2025: Scalar markets + Audit
- Q3 2025: Mainnet launch + Mobile app
- Q4 2025: Governance token + Partnerships

### Slide 9: Market Opportunity
- Prediction markets growing rapidly
- Polymarket: $1B+ volume in 2024
- Total addressable market: $XXB

### Slide 10: Ask
- Feedback from community
- Looking for co-founders/developers
- Partnerships with data providers
- Investor interest

### Slide 11: Thank You
- Live Demo: [URL]
- GitHub: [URL]
- Contact: [Email/Twitter]
- QR Code to demo

---

## ✅ Pre-Demo Checklist

### 24 Hours Before
- [ ] Test all functionality on Devnet
- [ ] Ensure wallet has sufficient SOL (5+ SOL)
- [ ] Create 2-3 interesting test markets
- [ ] Place bets on those markets (to show activity)
- [ ] Clear browser cache and cookies
- [ ] Test on different browsers (Chrome, Firefox)
- [ ] Record backup video demo (in case live demo fails)

### 1 Hour Before
- [ ] Close all unnecessary browser tabs
- [ ] Disable browser notifications
- [ ] Set browser zoom to 100%
- [ ] Test internet connection
- [ ] Have backup hotspot ready
- [ ] Open demo in new incognito window
- [ ] Wallet connected and unlocked
- [ ] Mute Slack/Discord/email notifications

### During Demo
- [ ] Speak slowly and clearly
- [ ] Point out key features explicitly
- [ ] Show real transactions (don't fake it)
- [ ] Mention Solana speed/cost
- [ ] Be ready for questions
- [ ] Have backup video if live fails

---

## 🚀 Post-Demo Follow-Up

### Immediately After
1. Share live demo link in chat
2. Share GitHub repo link
3. Offer to answer questions via DM/email
4. Thank organizers and judges

### Within 24 Hours
1. Send follow-up email with:
   - Demo recording link
   - GitHub repo
   - Technical docs
   - Contact info
2. Post on Twitter/X with demo
3. Engage with feedback on Discord/Telegram

### Within 1 Week
1. Implement any critical feedback
2. Write blog post about experience
3. Reach out to interested parties
4. Plan next steps based on feedback

---

## 💡 Pro Tips

### Demo Do's ✅
- Show real transactions (builds trust)
- Explain WHY Solana (speed/cost)
- Mention open-source (community-friendly)
- Be enthusiastic (energy is contagious)
- Know your numbers (volume, users, etc.)

### Demo Don'ts ❌
- Don't apologize for bugs (say "known issue, fixing")
- Don't bash competitors (compliment + differentiate)
- Don't over-promise (under-promise, over-deliver)
- Don't rush (better to show less, clearly)
- Don't go over time (respect the schedule)

---

## 🎯 Success Metrics

### You Nailed It If:
- [ ] Judges understood the value prop
- [ ] Audience asked smart questions
- [ ] Someone wants to try it live
- [ ] Someone asks about collaboration
- [ ] Someone asks about investment
- [ ] Positive feedback on technical execution
- [ ] Mentions on Twitter/Discord
- [ ] GitHub stars increase

---

**Good luck! You've got this! 🚀**

**Remember: Confidence + Clarity + Enthusiasm = Winning Demo**





