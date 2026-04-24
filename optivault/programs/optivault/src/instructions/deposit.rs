use anchor_lang::prelude::*;
use anchor_lang::system_program;
use super::super::state::*;
use super::super::errors::OptivaultError;

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump = vault_account.bump
    )]
    pub vault_account: Account<'info, VaultAccount>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct DepositEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

pub fn handle(
    ctx: Context<Deposit>,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, OptivaultError::InvalidAmount);
    require!(ctx.accounts.vault_account.is_active, OptivaultError::VaultNotActive);

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.key(),
        system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
        },
    );
    system_program::transfer(cpi_context, amount)?;

    let vault_account = &mut ctx.accounts.vault_account;
    vault_account.total_deposited = vault_account.total_deposited.checked_add(amount).unwrap();

    let clock = Clock::get()?;
    emit!(DepositEvent {
        user: ctx.accounts.user.key(),
        amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
