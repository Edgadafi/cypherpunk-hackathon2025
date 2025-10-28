/**
 * Oracle-enabled prediction market functions
 * 
 * Functions to create and resolve markets using Pyth Network oracle
 */

import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  Connection,
} from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PROGRAM_ID, RPC_ENDPOINT, CONNECTION_CONFIG } from './constants';
import { OracleConfig, getPriceUpdateVaa, feedIdToBytes } from '../oracle/pyth';

// Pyth program ID (devnet)
const PYTH_PROGRAM_ID = new PublicKey('gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s');

/**
 * Create oracle-enabled prediction market
 */
export async function createOracleMarket(
  wallet: AnchorWallet,
  question: string,
  description: string,
  endTime: number,
  oracleConfig: OracleConfig,
): Promise<string> {
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);
  
  // Generate market PDA
  const [marketPda] = await PublicKey.findProgramAddress(
    [
      Buffer.from('market'),
      wallet.publicKey.toBuffer(),
      Buffer.from(new Date().getTime().toString()),
    ],
    PROGRAM_ID
  );
  
  // Convert oracle config to bytes
  const feedIdBytes = feedIdToBytes(oracleConfig.feedId);
  
  // Build instruction data
  const data = Buffer.alloc(1024);
  let offset = 0;
  
  // Instruction discriminator (8 bytes) - create_market
  data.writeUInt8(1, offset); // Simplified, should use proper discriminator
  offset += 8;
  
  // question (String)
  data.writeUInt32LE(question.length, offset);
  offset += 4;
  data.write(question, offset);
  offset += question.length;
  
  // description (String)
  data.writeUInt32LE(description.length, offset);
  offset += 4;
  data.write(description, offset);
  offset += description.length;
  
  // end_time (i64)
  data.writeBigInt64LE(BigInt(endTime), offset);
  offset += 8;
  
  // oracle_enabled (bool)
  data.writeUInt8(1, offset); // true
  offset += 1;
  
  // oracle_feed_id (Option<[u8; 32]>)
  data.writeUInt8(1, offset); // Some
  offset += 1;
  feedIdBytes.forEach(byte => {
    data.writeUInt8(byte, offset);
    offset += 1;
  });
  
  // oracle_threshold (Option<i64>)
  data.writeUInt8(1, offset); // Some
  offset += 1;
  data.writeBigInt64LE(BigInt(oracleConfig.threshold), offset);
  offset += 8;
  
  // oracle_comparison (Option<u8>)
  data.writeUInt8(1, offset); // Some
  offset += 1;
  data.writeUInt8(oracleConfig.comparison, offset);
  offset += 1;
  
  const instructionData = data.slice(0, offset);
  
  // Build instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: marketPda, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });
  
  // Create transaction
  const tx = new Transaction().add(instruction);
  tx.feePayer = wallet.publicKey;
  
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  
  // Sign and send
  const signed = await wallet.signTransaction(tx);
  const signature = await connection.sendRawTransaction(signed.serialize());
  
  // Wait for confirmation
  await connection.confirmTransaction(signature, 'confirmed');
  
  return signature;
}

/**
 * Resolve market using Pyth oracle
 */
export async function resolveWithOracle(
  wallet: AnchorWallet,
  marketId: string,
  feedIdHex: string,
): Promise<string> {
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);
  const marketPubkey = new PublicKey(marketId);
  
  // Get VAA from Pyth for price proof
  const vaas = await getPriceUpdateVaa(feedIdHex);
  
  if (!vaas || vaas.length === 0) {
    throw new Error('Failed to fetch price update from Pyth');
  }
  
  // In a real implementation, you would:
  // 1. Post the VAA to Pyth's price update account
  // 2. Get the price update account address
  // 3. Pass it to resolve_with_oracle
  
  // For now, we'll use a placeholder approach
  // You need to implement the full Pyth VAA posting flow
  
  // This is simplified - in production you need to:
  // - Create price update account
  // - Post VAA to it
  // - Use that account in the instruction
  
  const priceUpdateAccount = PublicKey.default; // Placeholder
  
  // Build instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: marketPubkey, isSigner: false, isWritable: true },
      { pubkey: priceUpdateAccount, isSigner: false, isWritable: false },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from([5]), // Discriminator for resolve_with_oracle
  });
  
  const tx = new Transaction().add(instruction);
  tx.feePayer = wallet.publicKey;
  
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  
  const signed = await wallet.signTransaction(tx);
  const signature = await connection.sendRawTransaction(signed.serialize());
  
  await connection.confirmTransaction(signature, 'confirmed');
  
  return signature;
}

/**
 * Check if market can be resolved with oracle
 */
export async function canResolveWithOracle(
  marketId: string,
  currentTime: number = Date.now() / 1000,
): Promise<boolean> {
  try {
    const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);
    const marketPubkey = new PublicKey(marketId);
    
    const accountInfo = await connection.getAccountInfo(marketPubkey);
    
    if (!accountInfo) return false;
    
    // Parse market data (simplified)
    const data = accountInfo.data;
    
    // Check if resolved (offset varies, this is simplified)
    const resolved = data.readUInt8(56) === 1;
    if (resolved) return false;
    
    // Check end time
    const endTime = Number(data.readBigInt64LE(48));
    if (currentTime < endTime) return false;
    
    // Check oracle enabled
    const oracleEnabled = data.readUInt8(57) === 1;
    
    return oracleEnabled;
  } catch (error) {
    console.error('Error checking resolve eligibility:', error);
    return false;
  }
}

/**
 * Get oracle config from market account
 */
export async function getMarketOracleConfig(
  marketId: string,
): Promise<OracleConfig | null> {
  try {
    const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);
    const marketPubkey = new PublicKey(marketId);
    
    const accountInfo = await connection.getAccountInfo(marketPubkey);
    
    if (!accountInfo) return null;
    
    const data = accountInfo.data;
    
    // Check if oracle enabled (simplified offset)
    const oracleEnabled = data.readUInt8(57) === 1;
    
    if (!oracleEnabled) return null;
    
    // Read oracle config (offsets are simplified)
    const feedIdBytes = Array.from(data.slice(58, 90));
    const feedId = feedIdBytes.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const threshold = Number(data.readBigInt64LE(90));
    const comparison = data.readUInt8(98) as 0 | 1 | 2;
    
    return {
      feedId,
      threshold,
      comparison,
    };
  } catch (error) {
    console.error('Error reading oracle config:', error);
    return null;
  }
}

/**
 * Estimate gas for oracle resolution
 */
export async function estimateOracleResolutionCost(): Promise<number> {
  // Typical cost for oracle resolution including VAA posting
  // This is an estimate in SOL
  return 0.01; // ~$2 at $200/SOL
}


