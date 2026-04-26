import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  // RPC Connection
  RPC_URL: process.env.RPC_URL || "https://api.devnet.solana.com",

  // AI Agent wallet (private key dari .env)
  AGENT_PRIVATE_KEY: process.env.AGENT_PRIVATE_KEY || "",

  // Optivault Program ID (dari declare_id! di lib.rs)
  PROGRAM_ID: process.env.PROGRAM_ID || "",

  // Seberapa sering agent check APY (dalam milidetik)
  // Default: setiap 60 detik
  POLLING_INTERVAL_MS: 60_000,

  // Minimum perbedaan APY sebelum AI memutuskan rebalance
  // Contoh: 1.5 artinya hanya rebalance kalau ada protokol
  // yang APY-nya lebih tinggi minimal 1.5%
  MIN_APY_DIFFERENCE: 1.5,

  // Protokol yang didukung (placeholder pubkeys untuk sekarang)
  PROTOCOLS: {
    KAMINO: {
      name: "Kamino Finance",
      address: "6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc",
    },
    MARGINFI: {
      name: "MarginFi",
      address: "MFv2hWf31Z9kbCa1snEPdcgp7NtmVRKZAGDsQzLJrFU",
    },
    MARINADE: {
      name: "Marinade Finance",
      address: "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD",
    },
  },
};
