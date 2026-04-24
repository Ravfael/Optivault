use anchor_lang::prelude::*;

#[account]
pub struct UserConfig {
    pub owner: Pubkey,
    pub risk_level: u8,
    pub time_horizon: i64,
    pub max_allocation_per_protocol: u8,
    pub daily_rebalance_limit: u8,
    pub rebalance_count_today: u8,
    pub last_reset_day: i64,
}

impl UserConfig {
    pub const LEN: usize = 8 + 32 + 1 + 8 + 1 + 1 + 1 + 8;
}
