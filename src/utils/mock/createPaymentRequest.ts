import { BN } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const createMock = (address: string, amount) => ({
  publicKey: Keypair.generate().publicKey,
  account: {
    issuer: new PublicKey(address),
    amount: new BN(amount * LAMPORTS_PER_SOL),
    participants: [
      {
        address: Keypair.generate().publicKey,
        percentage: 25,
        hasPaid: true,
      },
      {
        address: Keypair.generate().publicKey,
        percentage: 25,
        hasPaid: false,
      },
    ],
    isFinalized: false,
    bump: 255,
    paymentId: "b1746363-1d3d-4735-9d07-40207feb9b08",
    createdAt: 1744920130,
  },
});
