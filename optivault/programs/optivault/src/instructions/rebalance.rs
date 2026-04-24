use anchor_lang::prelude::*;
use super::super::state::*;
use super::super::errors::OptivaultError;

// In a real implementation we would have an AI Agent Pubkey
// For now, let's just make it the vault owner or hardcode a key.
const AI_AGENT_PUBKEY: Pubkey = Pubkey::new_from_array([0; 32]); // Placeholder

#[derive(Accounts)]
pub struct Rebalance<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", vault_account.owner.as_ref()],
        bump = vault_account.bump,
        constraint = authority.key() == vault_account.owner || authority.key() == AI_AGENT_PUBKEY @ OptivaultError::Unauthorized
    )]
    pub vault_account: Account<'info, VaultAccount>,

    #[account(
        mut,
        seeds = [b"config", vault_account.owner.as_ref()],
        bump, // assuming we want it to verify
    )]
    pub user_config: Account<'info, UserConfig>,
}

#[event]
pub struct RebalanceEvent {
    pub user: Pubkey,
    pub from_protocol: Pubkey,
    pub to_protocol: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

pub fn handle(
    ctx: Context<Rebalance>,
    target_protocol: Pubkey,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, OptivaultError::InvalidAmount);
    require!(amount <= ctx.accounts.vault_account.total_deposited, OptivaultError::InsufficientFunds);
    require!(ctx.accounts.vault_account.is_active, OptivaultError::VaultNotActive);

    let vault_account = &mut ctx.accounts.vault_account;
    let user_config = &mut ctx.accounts.user_config;
    let clock = Clock::get()?;

    let today = clock.unix_timestamp / 86400;
    
    if user_config.last_reset_day != today {
        user_config.rebalance_count_today = 0;
        user_config.last_reset_day = today;
    }

    require!(user_config.rebalance_count_today < user_config.daily_rebalance_limit, OptivaultError::RebalanceLimitReached);

    let from_protocol = vault_account.current_protocol;
    vault_account.current_protocol = target_protocol;
    vault_account.allocated_amount = amount;
    vault_account.last_rebalance = clock.unix_timestamp;

    user_config.rebalance_count_today += 1;

    emit!(RebalanceEvent {
        user: vault_account.owner,
        from_protocol,
        to_protocol: target_protocol,
        amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
