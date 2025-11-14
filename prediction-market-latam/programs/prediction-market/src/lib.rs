use anchor_lang::prelude::*;
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

declare_id!("GUzTP7BCgdTUTEDtguuUwZKdDbrkAKFiiRuqzpbSaQLu");

#[program]
pub mod prediction_market {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.authority = ctx.accounts.authority.key();
        global_state.total_markets = 0;
        global_state.total_volume = 0;
        Ok(())
    }

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
            
            // Validate comparison type (0=above, 1=below, 2=equals)
            require!(market.oracle_comparison <= 2, ErrorCode::InvalidOracleComparison);
        } else {
            market.oracle_feed_id = [0; 32];
            market.oracle_threshold = 0;
            market.oracle_comparison = 0;
        }
        
        Ok(())
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        amount: u64,
        bet_yes: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let bet = &mut ctx.accounts.bet;
        let clock = Clock::get()?;
        
        require!(!market.resolved, ErrorCode::MarketResolved);
        require!(clock.unix_timestamp < market.end_time, ErrorCode::MarketExpired);
        require!(amount >= 10_000_000, ErrorCode::BetTooSmall); // 0.01 SOL min
        
        // Transfer SOL to market account
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &market.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                market.to_account_info(),
            ],
        )?;
        
        // Update market totals
        if bet_yes {
            market.yes_amount = market.yes_amount.checked_add(amount).ok_or(ErrorCode::MathOverflow)?;
        } else {
            market.no_amount = market.no_amount.checked_add(amount).ok_or(ErrorCode::MathOverflow)?;
        }
        
        // Record individual bet
        bet.user = ctx.accounts.user.key();
        bet.market = market.key();
        bet.amount = amount;
        bet.outcome = bet_yes;
        bet.claimed = false;
        bet.timestamp = clock.unix_timestamp;
        
        Ok(())
    }

    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        outcome: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let clock = Clock::get()?;
        
        require!(!market.resolved, ErrorCode::AlreadyResolved);
        require!(clock.unix_timestamp >= market.end_time, ErrorCode::MarketNotExpired);
        require!(ctx.accounts.authority.key() == market.authority, ErrorCode::Unauthorized);
        
        // Cannot manually resolve oracle-enabled markets
        require!(!market.oracle_enabled, ErrorCode::MustUseOracle);
        
        market.resolved = true;
        market.winning_outcome = outcome;
        
        Ok(())
    }

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
        
        let current_price = price_feed.price;
        let threshold = market.oracle_threshold;
        
        // Determine outcome based on comparison type
        let outcome = match market.oracle_comparison {
            0 => current_price > threshold, // Above
            1 => current_price < threshold, // Below
            2 => current_price == threshold, // Equals (rare)
            _ => return Err(ErrorCode::InvalidOracleComparison.into()),
        };
        
        // Resolve market
        market.resolved = true;
        market.winning_outcome = outcome;
        
        msg!("Market resolved with oracle. Price: {}, Threshold: {}, Outcome: {}",
             current_price, threshold, outcome);
        
        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let market = &ctx.accounts.market;
        let bet = &mut ctx.accounts.bet;
        
        // Validate market is resolved
        require!(market.resolved, ErrorCode::MarketNotResolved);
        
        // Validate user bet on winning outcome
        require!(bet.outcome == market.winning_outcome, ErrorCode::WrongOutcome);
        
        // Validate not already claimed
        require!(!bet.claimed, ErrorCode::AlreadyClaimed);
        
        // Calculate winnings
        let total_pool = market.yes_amount.checked_add(market.no_amount).ok_or(ErrorCode::MathOverflow)?;
        let winning_pool = if market.winning_outcome {
            market.yes_amount
        } else {
            market.no_amount
        };
        
        // Edge case: Market resolved but no one bet on winning outcome
        require!(winning_pool > 0, ErrorCode::NoWinnings);
        
        // Edge case: Total pool is zero (shouldn't happen but safety check)
        require!(total_pool > 0, ErrorCode::NoWinnings);
        
        // Calculate user's share: (user_bet / winning_pool) * total_pool
        let winnings = (bet.amount as u128)
            .checked_mul(total_pool as u128).ok_or(ErrorCode::MathOverflow)?
            .checked_div(winning_pool as u128).ok_or(ErrorCode::MathOverflow)?
            as u64;
        
        // Edge case: Calculated winnings is zero (rounding down)
        require!(winnings > 0, ErrorCode::NoWinnings);
        
        // Validate market account has sufficient balance
        let market_balance = market.to_account_info().lamports();
        require!(market_balance >= winnings, ErrorCode::NoWinnings);
        
        // Transfer winnings from market to user
        **market.to_account_info().try_borrow_mut_lamports()? = market_balance
            .checked_sub(winnings)
            .ok_or(ErrorCode::MathOverflow)?;
        
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? = ctx
            .accounts
            .user
            .to_account_info()
            .lamports()
            .checked_add(winnings)
            .ok_or(ErrorCode::MathOverflow)?;
        
        // Mark as claimed
        bet.claimed = true;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 204 + 504 + 8 + 8 + 8 + 8 + 1 + 1 + 1 + 32 + 8 + 1)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 1 + 1 + 8,
        seeds = [b"bet", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveWithOracle<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    /// The Pyth price update account
    pub price_update: Account<'info, PriceUpdateV2>,
    pub caller: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(
        mut,
        seeds = [b"bet", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct GlobalState {
    pub authority: Pubkey,
    pub total_markets: u64,
    pub total_volume: u64,
}

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
    // Oracle fields
    pub oracle_enabled: bool,         // 1
    pub oracle_feed_id: [u8; 32],     // 32
    pub oracle_threshold: i64,        // 8
    pub oracle_comparison: u8,        // 1 (0=above, 1=below, 2=equals)
}

#[account]
pub struct Bet {
    pub user: Pubkey,                 // 32
    pub market: Pubkey,               // 32
    pub amount: u64,                  // 8
    pub outcome: bool,                // 1 (true = YES, false = NO)
    pub claimed: bool,                // 1
    pub timestamp: i64,               // 8
}

#[error_code]
pub enum ErrorCode {
    #[msg("Question too long (max 200 characters)")]
    QuestionTooLong,
    #[msg("Invalid end time")]
    InvalidEndTime,
    #[msg("Market already resolved")]
    MarketResolved,
    #[msg("Market expired")]
    MarketExpired,
    #[msg("Bet too small (min 0.01 SOL)")]
    BetTooSmall,
    #[msg("Already resolved")]
    AlreadyResolved,
    #[msg("Market not expired yet")]
    MarketNotExpired,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Market not resolved yet")]
    MarketNotResolved,
    #[msg("Wrong outcome (you bet on the losing side)")]
    WrongOutcome,
    #[msg("Already claimed")]
    AlreadyClaimed,
    #[msg("No winnings available")]
    NoWinnings,
    // Oracle errors
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
    #[msg("This market must be resolved with oracle")]
    MustUseOracle,
}
