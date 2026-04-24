use anchor_lang::prelude::*;

#[account]
pub struct VaultAccount {
    pub owner: Pubkey,
    pub bump: u8,
    pub total_deposited: u64,
    pub total_earned: u64,
    pub current_protocol: Pubkey,
    pub allocated_amount: u64,
    pub last_rebalance: i64,
    pub is_active: bool,
    pub created_at: i64,
}

impl VaultAccount {
    pub const LEN: usize = 8 + 32 + 1 + 8 + 8 + 32 + 8 + 8 + 1 + 8;
}
