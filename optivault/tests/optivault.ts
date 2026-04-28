import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Optivault } from "../target/types/optivault";

describe("optivault", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Optivault as Program<Optivault>;

  it("Program is deployed", async () => {
    console.log("✅ Program ID:", program.programId.toString());
    console.log("✅ Provider:", provider.wallet.publicKey.toString());
  });

  it("Can derive vault PDA", async () => {
    const [vaultPDA, bump] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), provider.wallet.publicKey.toBuffer()], program.programId);
    console.log("✅ Vault PDA:", vaultPDA.toString());
    console.log("✅ Bump:", bump);
  });
});
