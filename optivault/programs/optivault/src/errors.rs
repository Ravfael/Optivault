use anchor_lang::prelude::*;

#[error_code]
pub enum OptivaultError {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Insufficient funds in vault")]
    InsufficientFunds,
    #[msg("Vault is not active")]
    VaultNotActive,
    #[msg("Unauthorized: only vault owner or AI agent can perform this action")]
    Unauthorized,
    #[msg("Daily rebalance limit reached")]
    RebalanceLimitReached,
    #[msg("Allocation exceeds maximum allowed per protocol")]
    AllocationExceedsLimit,
    #[msg("Time horizon has not been reached yet")]
    TimeHorizonNotReached,
}
