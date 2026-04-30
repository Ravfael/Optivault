import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import idl from "./idl.json";
import { Optivault } from "./optivault";

// Program ID dari .env atau langsung hardcode dari declare_id!
export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || "GAKRYNWn7YjHQB8ihiBYYn1QVp2g4vVt8wtTyEK65syZ");

// Fungsi untuk get program instance
export function getProgram(provider: AnchorProvider) {
  return new Program<Optivault>(idl as Optivault, provider);
}

// Fungsi untuk derive Vault PDA
export function getVaultPDA(ownerPublicKey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("vault"), ownerPublicKey.toBuffer()], PROGRAM_ID);
}

// Fungsi untuk derive UserConfig PDA
export function getUserConfigPDA(ownerPublicKey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("config"), ownerPublicKey.toBuffer()], PROGRAM_ID);
}
