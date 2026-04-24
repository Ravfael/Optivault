use anchor_lang::prelude::*;
use super::super::state::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = VaultAccount::LEN,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault_account: Account<'info, VaultAccount>,

    #[account(
        init,
        payer = user,
        space = UserConfig::LEN,
        seeds = [b"config", user.key().as_ref()],
        bump
    )]
    pub user_config: Account<'info, UserConfig>,

    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<Initialize>,
    risk_level: u8,
    time_horizon: i64,
) -> Result<()> {
    let vault_account = &mut ctx.accounts.vault_account;
    let user_config = &mut ctx.accounts.user_config;
    let clock = Clock::get()?;

    vault_account.owner = ctx.accounts.user.key();
    vault_account.bump = ctx.bumps.vault_account;
    vault_account.total_deposited = 0;
    vault_account.total_earned = 0;
    vault_account.current_protocol = Pubkey::default();
    vault_account.allocated_amount = 0;
    vault_account.last_rebalance = 0;
    vault_account.is_active = true;
    vault_account.created_at = clock.unix_timestamp;

    user_config.owner = ctx.accounts.user.key();
    user_config.risk_level = risk_level;
    user_config.time_horizon = time_horizon;
    user_config.max_allocation_per_protocol = 80;
    user_config.daily_rebalance_limit = 5;
    user_config.rebalance_count_today = 0;
    user_config.last_reset_day = clock.unix_timestamp / 86400;

    Ok(())
}
