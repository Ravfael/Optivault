use anchor_lang::prelude::*;
use super::super::state::*;
use super::super::errors::OptivaultError;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump = vault_account.bump,
        constraint = vault_account.owner == user.key() @ OptivaultError::Unauthorized
    )]
    pub vault_account: Account<'info, VaultAccount>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct WithdrawEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

pub fn handle(
    ctx: Context<Withdraw>,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, OptivaultError::InvalidAmount);
    require!(amount <= ctx.accounts.vault_account.total_deposited, OptivaultError::InsufficientFunds);

    let vault_account = &mut ctx.accounts.vault_account;
    
    vault_account.sub_lamports(amount)?;
    ctx.accounts.user.add_lamports(amount)?;

    vault_account.total_deposited = vault_account.total_deposited.checked_sub(amount).unwrap();

    let clock = Clock::get()?;
    emit!(WithdrawEvent {
        user: ctx.accounts.user.key(),
        amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
