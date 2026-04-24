
use {
    anchor_lang::{solana_program::instruction::Instruction, InstructionData, ToAccountMetas, solana_program::pubkey::Pubkey, solana_program::system_program},
    litesvm::LiteSVM,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_keypair::Keypair,
    solana_transaction::versioned::VersionedTransaction,
};

#[test]
fn test_initialize() {
    let program_id = optivault::id();
    let payer = Keypair::new();
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!("../../../target/deploy/optivault.so");
    svm.add_program(program_id, bytes).unwrap();
    svm.airdrop(&payer.pubkey(), 1_000_000_000).unwrap();
    
    let (vault_account, _) = Pubkey::find_program_address(
        &[b"vault", payer.pubkey().as_ref()],
        &program_id,
    );

    let (user_config, _) = Pubkey::find_program_address(
        &[b"config", payer.pubkey().as_ref()],
        &program_id,
    );

    let instruction = Instruction::new_with_bytes(
        program_id,
        &optivault::instruction::Initialize {
            risk_level: 1,
            time_horizon: 100,
        }.data(),
        optivault::accounts::Initialize {
            user: payer.pubkey(),
            vault_account,
            user_config,
            system_program: system_program::id(),
        }.to_account_metas(None),
    );

    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[instruction], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[payer]).unwrap();

    let res = svm.send_transaction(tx);
    assert!(res.is_ok());
}
