# Troubleshooting Guide

Common issues and solutions for PrismaFi.

---

## 🔌 Wallet Connection Issues

### Problem: Wallet won't connect

**Symptoms:**
- "Please connect your wallet" message persists
- Wallet extension not detected
- Connection button does nothing

**Solutions:**
1. **Check wallet extension is installed**
   - Install [Phantom](https://phantom.app/) or [Solflare](https://solflare.com/)
   - Ensure extension is enabled in browser

2. **Check network settings**
   - Switch wallet to **Solana Devnet**
   - Settings → Developer Mode → Devnet

3. **Refresh the page**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Clear browser cache if needed

4. **Check browser permissions**
   - Allow wallet extension to access the site
   - Check browser console for errors

---

## 💰 Transaction Issues

### Problem: Transaction fails

**Symptoms:**
- "Transaction failed" error
- Wallet shows error
- Transaction doesn't appear on blockchain

**Solutions:**
1. **Check SOL balance**
   - Ensure you have enough SOL for transaction + fees
   - Minimum: 0.01 SOL for bet + ~0.001 SOL for fees
   - Get free SOL from [Solana Faucet](https://faucet.solana.com/)

2. **Check network**
   - Ensure wallet is on **Devnet** (not Mainnet)
   - Check RPC endpoint is accessible

3. **Check market status**
   - Market must not be resolved
   - Market must not be expired
   - Trading must be active

4. **Retry transaction**
   - Wait a few seconds and try again
   - Check Solana network status

### Problem: "You already have a bet" error

**Symptoms:**
- Error when trying to place bet
- Message says bet already exists

**Solutions:**
1. **Reload the page**
   - Your existing bet should appear
   - Check your dashboard for active bets

2. **Check market detail page**
   - Your bet should be visible
   - Current version allows only one bet per user per market

3. **Wait for market resolution**
   - You can only place one bet per market
   - Wait for market to resolve before betting again

---

## 🎯 Market Issues

### Problem: Can't create market

**Symptoms:**
- Market creation fails
- Transaction error
- Market doesn't appear

**Solutions:**
1. **Check wallet connection**
   - Ensure wallet is connected
   - Check you have SOL for fees (~0.01 SOL)

2. **Validate inputs**
   - Question: max 200 characters
   - Description: max 500 characters
   - End time: must be in the future

3. **Check network**
   - Ensure Devnet is selected
   - Check RPC endpoint

### Problem: Can't resolve market

**Symptoms:**
- Resolution button doesn't work
- "Unauthorized" error
- Market won't resolve

**Solutions:**
1. **Check you're the creator**
   - Only market creator can resolve
   - Check market authority matches your wallet

2. **Check market status**
   - Market must be expired (end time passed)
   - Market must not already be resolved

3. **Oracle markets**
   - Oracle-enabled markets must use auto-resolve
   - Use "Auto-Resolve with Oracle" button

---

## 💸 Claiming Winnings Issues

### Problem: Can't claim winnings

**Symptoms:**
- "Claim Winnings" button disabled
- Transaction fails
- No winnings received

**Solutions:**
1. **Check you won**
   - You must have bet on the winning outcome
   - Check market resolution status

2. **Check market is resolved**
   - Market must be resolved first
   - Wait for creator to resolve (or auto-resolve for oracle markets)

3. **Check you haven't claimed**
   - You can only claim once per bet
   - Check if bet is already marked as claimed

4. **Check market has funds**
   - Market must have sufficient balance
   - Edge case: if no one bet on winning side, no winnings available

---

## 🔄 Real-Time Updates Issues

### Problem: Data not updating

**Symptoms:**
- Page shows old data
- Odds don't update
- Stats are stale

**Solutions:**
1. **Check auto-refresh**
   - Auto-refresh should be enabled by default
   - Check refresh indicator (shows last update time)

2. **Manual refresh**
   - Click refresh button
   - Or reload the page

3. **Check network**
   - Ensure RPC endpoint is accessible
   - Check browser console for errors

4. **Pause/Resume**
   - Toggle pause/resume button
   - This can help reset the refresh cycle

---

## 🌐 Network Issues

### Problem: RPC errors

**Symptoms:**
- "Network error" messages
- Slow loading
- Timeout errors

**Solutions:**
1. **Check RPC endpoint**
   - Default: `https://api.devnet.solana.com`
   - Try alternative: `https://solana-devnet.g.alchemy.com/v2/YOUR_KEY`

2. **Check internet connection**
   - Ensure stable connection
   - Try different network

3. **Rate limiting**
   - Too many requests can cause rate limiting
   - Wait a few seconds and retry

4. **Use different RPC**
   - Update `.env.local` with different endpoint
   - Consider using paid RPC for better reliability

---

## 🐛 Smart Contract Issues

### Problem: Program ID mismatch

**Symptoms:**
- "Invalid program ID" error
- Transactions fail
- Can't interact with contract

**Solutions:**
1. **Check program ID**
   - Verify in `prediction-market/src/lib/program/constants.ts`
   - Should match deployed program ID

2. **Update IDL**
   - Copy latest IDL from `target/idl/prediction_market.json`
   - Place in `prediction-market/src/idl/`

3. **Redeploy if needed**
   ```bash
   cd prediction-market-latam
   anchor build
   anchor deploy --provider.cluster devnet
   ```

---

## 📱 Mobile Issues

### Problem: UI doesn't work on mobile

**Symptoms:**
- Buttons don't respond
- Layout broken
- Can't interact

**Solutions:**
1. **Use mobile wallet**
   - Install Phantom mobile app
   - Connect via WalletConnect

2. **Check responsive design**
   - Some features optimized for desktop
   - Use landscape mode if needed

3. **Clear cache**
   - Clear browser cache
   - Try incognito mode

---

## 🔍 Debugging Tips

### Check Browser Console

Open browser console (F12) and look for:
- Error messages
- Network failures
- JavaScript errors

### Check Solana Explorer

View transactions on [Solana Explorer](https://explorer.solana.com/?cluster=devnet):
- Search by transaction signature
- Check account state
- Verify program execution

### Check Wallet

In your wallet:
- View transaction history
- Check account balance
- Verify network (Devnet)

### Common Error Messages

| Error | Solution |
|-------|----------|
| "User rejected" | User cancelled transaction |
| "Insufficient funds" | Add more SOL to wallet |
| "Market expired" | Market end time has passed |
| "Market resolved" | Market already resolved |
| "PDA already exists" | Bet already placed on this market |
| "Network error" | Check RPC endpoint and connection |

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check existing issues**
   - Search [GitHub Issues](https://github.com/Edgadafi/cypherpunk-hackathon2025/issues)
   - See if others have similar problems

2. **Open a new issue**
   - Provide detailed description
   - Include error messages
   - Share steps to reproduce

3. **Get help**
   - Check documentation
   - Review code comments
   - Ask in community (when available)

---

## 📚 Additional Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework Docs](https://www.anchor-lang.com/)
- [Phantom Wallet Guide](https://phantom.app/help)
- [Solana Explorer](https://explorer.solana.com/)

---

**Last Updated:** November 2024

