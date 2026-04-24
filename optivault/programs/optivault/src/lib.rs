use anchor_lang::prelude::*;

declare_id!("GAKRYNWn7YjHQB8ihiBYYn1QVp2g4vVt8wtTyEK65syZ");

pub mod errors;
pub mod instructions;
pub mod state;

pub use instructions::*;
use instructions::{
    __client_accounts_deposit,
    __client_accounts_initialize,
    __client_accounts_rebalance,
    __client_accounts_withdraw,
};

#[program]
pub mod optivault {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        risk_level: u8,
        time_horizon: i64,
    ) -> Result<()> {
        instructions::initialize::handle(ctx, risk_level, time_horizon)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::handle(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::withdraw::handle(ctx, amount)
    }

    pub fn rebalance(
        ctx: Context<Rebalance>,
        target_protocol: Pubkey,
        amount: u64,
    ) -> Result<()> {
        instructions::rebalance::handle(ctx, target_protocol, amount)
    }
}
