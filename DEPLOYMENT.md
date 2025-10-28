# 🚀 Trepa - Deployment Guide

> Complete guide for deploying Trepa to Solana Devnet/Mainnet and Vercel

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)
7. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

### Required Software

```bash
# Node.js (v18 or higher)
node --version  # Should be >= 18.0.0

# npm (v9 or higher)
npm --version   # Should be >= 9.0.0

# Rust (latest stable)
rustc --version  # Should be >= 1.70.0

# Solana CLI (v1.18 or higher)
solana --version  # Should be >= 1.18.0

# Anchor CLI (v0.30.0)
anchor --version  # Should be >= 0.30.0
```

### Installation Links

- **Node.js**: https://nodejs.org/ (use LTS version)
- **Rust**: https://www.rust-lang.org/tools/install
- **Solana CLI**: https://docs.solana.com/cli/install-solana-cli-tools
- **Anchor**: https://www.anchor-lang.com/docs/installation

---

## Local Development

### 1. Clone Repository

```bash
git clone https://github.com/Edgadafi/cypherpunk-hackathon2025.git
cd cypherpunk-hackathon2025
```

### 2. Install Frontend Dependencies

```bash
cd prediction-market
npm install --legacy-peer-deps
```

> **Note**: `--legacy-peer-deps` is needed due to some peer dependency conflicts in Solana packages.

### 3. Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID_HERE
```

> **Note**: You'll get the `PROGRAM_ID` after deploying the smart contract (Step 4).

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Smart Contract Deployment

### 1. Navigate to Contract Directory

```bash
cd prediction-market-latam
```

### 2. Configure Solana CLI

#### For Devnet (Testnet)

```bash
# Set cluster to devnet
solana config set --url https://api.devnet.solana.com

# Create or import keypair
solana-keygen new --outfile ~/.config/solana/devnet.json

# Set as default keypair
solana config set --keypair ~/.config/solana/devnet.json

# Verify configuration
solana config get
```

Expected output:
```
Config File: /home/user/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /home/user/.config/solana/devnet.json
Commitment: confirmed
```

#### For Mainnet (Production)

```bash
# Set cluster to mainnet
solana config set --url https://api.mainnet-beta.solana.com

# IMPORTANT: Use a secure keypair for mainnet
solana-keygen new --outfile ~/.config/solana/mainnet.json

# Set as default keypair
solana config set --keypair ~/.config/solana/mainnet.json

# BACKUP YOUR KEYPAIR IMMEDIATELY
cp ~/.config/solana/mainnet.json ~/safe-location/mainnet-backup.json
```

### 3. Fund Your Wallet

#### Devnet (Free Test SOL)

```bash
# Request 2 SOL from faucet
solana airdrop 2

# Verify balance
solana balance
```

If airdrop fails, use the web faucet:
https://faucet.solana.com/

#### Mainnet (Real SOL Required)

```bash
# Check your wallet address
solana address

# Transfer SOL from exchange or another wallet
# You'll need ~3-5 SOL for deployment + testing
```

### 4. Build the Program

```bash
# Clean previous builds
anchor clean

# Build program
anchor build

# Verify build succeeded
ls -la target/deploy/
```

You should see:
- `prediction_market.so` (the compiled program)
- `prediction_market-keypair.json` (program keypair)

### 5. Update Program ID

```bash
# Get program ID from keypair
anchor keys list
```

Output:
```
prediction_market: <PROGRAM_ID>
```

Update `Anchor.toml`:
```toml
[programs.devnet]
prediction_market = "<PROGRAM_ID>"

[programs.mainnet]
prediction_market = "<PROGRAM_ID>"
```

Update `lib.rs`:
```rust
declare_id!("<PROGRAM_ID>");
```

### 6. Rebuild with New Program ID

```bash
anchor build
```

### 7. Deploy to Devnet/Mainnet

```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# OR deploy to mainnet
anchor deploy --provider.cluster mainnet
```

Expected output:
```
Deploying workspace: https://api.devnet.solana.com
Upgrade authority: <YOUR_WALLET_ADDRESS>
Deploying program "prediction_market"...
Program path: /path/to/target/deploy/prediction_market.so
Program Id: <PROGRAM_ID>

Deploy success
```

### 8. Initialize the Program

```bash
# Run initialization script (if you have one)
anchor run initialize --provider.cluster devnet

# OR manually call initialize instruction from frontend
```

### 9. Verify Deployment

```bash
# Check program account exists
solana program show <PROGRAM_ID>

# Check your wallet balance (should be reduced)
solana balance
```

---

## Frontend Deployment

### 1. Update Environment Variables

Edit `prediction-market/.env.local`:

```env
# For Devnet
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<YOUR_DEPLOYED_PROGRAM_ID>

# For Mainnet
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=<YOUR_DEPLOYED_PROGRAM_ID>
```

### 2. Update IDL

Copy the generated IDL to frontend:

```bash
# From project root
cp prediction-market-latam/target/idl/prediction_market.json \
   prediction-market/src/idl/prediction_market.json
```

### 3. Test Locally

```bash
cd prediction-market
npm run build  # Ensure no build errors
npm run start  # Test production build locally
```

### 4. Deploy to Vercel

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Project name: trepa-prediction-market
# - Framework: Next.js
# - Root directory: prediction-market
```

#### Option B: Deploy via Git Integration

1. Push code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Visit [vercel.com/new](https://vercel.com/new)

3. Import your GitHub repository

4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `prediction-market`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   - `NEXT_PUBLIC_SOLANA_NETWORK`: `devnet` or `mainnet-beta`
   - `NEXT_PUBLIC_SOLANA_RPC_URL`: RPC endpoint
   - `NEXT_PUBLIC_PROGRAM_ID`: Your deployed program ID

6. Click "Deploy"

### 5. Configure Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `trepa.finance`)
4. Update DNS records as instructed
5. Wait for SSL certificate provisioning (~1 min)

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana cluster | `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | RPC endpoint URL | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_PROGRAM_ID` | Deployed program ID | `9t6K...p9rka` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_COMMITMENT` | Transaction commitment level | `confirmed` |
| `NEXT_PUBLIC_PREFLIGHT` | Preflight checks | `true` |

### Production RPC Providers

For production, consider using dedicated RPC providers (faster, more reliable):

- **Helius**: https://helius.dev/
- **QuickNode**: https://quicknode.com/
- **Triton**: https://triton.one/
- **Alchemy**: https://alchemy.com/solana

Example with Helius:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_API_KEY
```

---

## Troubleshooting

### Smart Contract Issues

#### Error: "Insufficient funds for deployment"

**Solution**: Your wallet needs more SOL
```bash
# For devnet
solana airdrop 2

# For mainnet
# Transfer SOL from exchange
```

#### Error: "Program deploy failed: account data too small"

**Solution**: The program needs more space
```bash
# Allocate more space (devnet)
solana program extend <PROGRAM_ID> <ADDITIONAL_BYTES>

# OR redeploy with --upgrade-authority flag
```

#### Error: "Anchor build failed"

**Solution**: Check Rust version and dependencies
```bash
# Update Rust
rustup update

# Clean and rebuild
anchor clean
cargo clean
anchor build
```

### Frontend Issues

#### Error: "Module not found" during build

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### Error: "IDL mismatch" or "Invalid instruction"

**Solution**: Update IDL from smart contract
```bash
cp prediction-market-latam/target/idl/prediction_market.json \
   prediction-market/src/idl/prediction_market.json
```

#### Error: "RPC request failed"

**Solution**: Check RPC URL and network
```bash
# Test RPC connection
curl -X POST $NEXT_PUBLIC_SOLANA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

### Vercel Deployment Issues

#### Error: "Build failed" on Vercel

**Solution**: Check build logs and ensure `vercel.json` is correct
```json
{
  "version": 2,
  "buildCommand": "cd prediction-market && npm install --legacy-peer-deps && npm run build",
  "outputDirectory": "prediction-market/.next",
  "installCommand": "npm install --prefix prediction-market --legacy-peer-deps"
}
```

#### Error: "Environment variables not loading"

**Solution**: Verify env vars are set in Vercel dashboard
1. Go to Project Settings → Environment Variables
2. Ensure all variables are present
3. Redeploy

---

## Post-Deployment Checklist

### Smart Contract ✅

- [ ] Program deployed successfully
- [ ] Program ID matches across all configs
- [ ] Program initialized (GlobalState created)
- [ ] Test transactions working
- [ ] Wallet has sufficient SOL for testing

### Frontend ✅

- [ ] Environment variables set correctly
- [ ] IDL file updated and matches deployed program
- [ ] Build succeeds without errors
- [ ] All pages load correctly
- [ ] Wallet connection works
- [ ] Can create market
- [ ] Can place bet
- [ ] Can resolve market
- [ ] Can claim winnings
- [ ] Real-time refresh working

### Production Only ✅

- [ ] Smart contract audited (recommended for mainnet)
- [ ] Backup of all keypairs stored securely
- [ ] Custom RPC provider configured (Helius/QuickNode)
- [ ] Rate limiting enabled
- [ ] Error monitoring setup (Sentry/LogRocket)
- [ ] Analytics configured (Google Analytics)
- [ ] Domain configured and SSL active
- [ ] SEO meta tags added
- [ ] Social media preview images
- [ ] Terms of Service page
- [ ] Privacy Policy page

---

## Continuous Deployment

### Automatic Deploys from Git

Configure Vercel to auto-deploy on git push:

1. Connect GitHub repo to Vercel
2. Enable automatic deployments
3. Set production branch (e.g., `main`)
4. Set preview branch (e.g., `dev`)

Now every push triggers a deploy:
- `main` branch → Production
- `dev` branch → Preview
- Pull requests → Preview deployments

### CI/CD Pipeline (Advanced)

Example GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: |
          cd prediction-market
          npm install --legacy-peer-deps
      
      - name: Build
        run: |
          cd prediction-market
          npm run build
        env:
          NEXT_PUBLIC_SOLANA_NETWORK: ${{ secrets.SOLANA_NETWORK }}
          NEXT_PUBLIC_SOLANA_RPC_URL: ${{ secrets.RPC_URL }}
          NEXT_PUBLIC_PROGRAM_ID: ${{ secrets.PROGRAM_ID }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Monitoring & Maintenance

### Smart Contract

```bash
# Check program logs
solana logs <PROGRAM_ID>

# Check program account data
solana program show <PROGRAM_ID>

# Check upgrade authority
solana program show <PROGRAM_ID> | grep "Authority"
```

### Frontend

- **Vercel Dashboard**: Monitor deploys, errors, analytics
- **Vercel Analytics**: Track page views, performance
- **Sentry** (optional): Track JavaScript errors
- **LogRocket** (optional): Session replay for debugging

### Regular Updates

```bash
# Update dependencies (monthly)
npm update

# Update Solana/Anchor (quarterly)
solana-install update
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

---

## Security Best Practices

### Smart Contract

1. ✅ **Audit before mainnet** - Get professional audit
2. ✅ **Use multi-sig for upgrades** - Don't use single wallet
3. ✅ **Test thoroughly on devnet** - Minimum 2 weeks of testing
4. ✅ **Have emergency pause mechanism** - Ability to freeze contract
5. ✅ **Monitor for unusual activity** - Set up alerts

### Frontend

1. ✅ **Never expose private keys** - Use env variables
2. ✅ **Validate all inputs** - Client AND server side
3. ✅ **Use HTTPS only** - Force SSL on production
4. ✅ **Implement rate limiting** - Prevent abuse
5. ✅ **Monitor for XSS/CSRF** - Use security headers

---

## Support & Resources

### Documentation

- **Solana Docs**: https://docs.solana.com/
- **Anchor Book**: https://book.anchor-lang.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

### Community

- **Solana Discord**: https://discord.gg/solana
- **Anchor Discord**: https://discord.gg/anchor
- **Stack Overflow**: Tag `solana`, `anchor-solana`, `nextjs`

### Troubleshooting

If you encounter issues not covered here:

1. Check GitHub Issues
2. Ask in Solana Discord
3. Post on Stack Overflow
4. Create GitHub Issue in this repo

---

**Deployment complete! 🎉**

**Remember to backup all keypairs and keep them secure!**





