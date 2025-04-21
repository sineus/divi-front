"use client";

import { VAULT, VAULT_AUTHORITY } from "@/constants";
import { useAnchor } from "@/providers/AnchorProvider";
import { useUser } from "@/providers/UserProvider";
import { PaymentRequest, RequestParticipation } from "@/types";
import * as anchor from "@coral-xyz/anchor";
import { Provider } from "@reown/appkit-adapter-solana";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useProgram() {
  const { accessToken } = useUser();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const queryClient = useQueryClient();
  const { program } = useAnchor();
  const { connection } = useAppKitConnection();

  function getPdas(paymentId: number, issuer: PublicKey) {
    const paymentIdBuffer = new anchor.BN(paymentId).toArrayLike(
      Buffer,
      "le",
      4
    );

    const [vault] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(VAULT),
        issuer.toBuffer(),
        paymentIdBuffer,
      ],
      program.programId
    );

    const [vaultAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(VAULT_AUTHORITY),
        issuer.toBuffer(),
        paymentIdBuffer,
      ],
      program.programId
    );

    return {
      vault,
      vaultAuthority,
    };
  }

  const createVault = useMutation({
    async mutationFn(amount: number) {
      const paymentId = Math.floor(Math.random() * 100000);
      const totalAmount = new anchor.BN(amount * anchor.web3.LAMPORTS_PER_SOL);
      const pdas = getPdas(paymentId, walletProvider.publicKey);

      const ix = await program.methods
        .initializeVault(paymentId, totalAmount)
        .accountsStrict({
          issuer: walletProvider.publicKey,
          vault: pdas.vault,
          vaultAuthority: pdas.vaultAuthority,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();

      const { blockhash } = await connection.getLatestBlockhash();

      const messageV0 = new TransactionMessage({
        payerKey: walletProvider.publicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      const signature = await walletProvider.signAndSendTransaction(
        transaction
      );

      console.log(signature);

      const req = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          address: pdas.vault.toBase58(),
          amount,
          currency: "SOL",
          issuer: walletProvider.publicKey.toBase58(),
          paymentId,
          tx: signature,
        }),
      });

      await req.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["requests", address],
      });
    },
    onError(err) {
      console.error(err);
    },
  });

  const pay = useMutation({
    async mutationFn(payload: {
      participation: RequestParticipation;
      amount: number;
    }) {
      const issuer = new PublicKey(payload.participation.request.issuer);
      const pdas = getPdas(payload.participation.request.paymentId, issuer);

      const ix = await program.methods
        .pay(
          payload.participation.request.paymentId,
          new anchor.BN(payload.amount)
        )
        .accountsStrict({
          payer: walletProvider.publicKey,
          issuer,
          vault: pdas.vault,
          vaultAuthority: pdas.vaultAuthority,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();

      const { blockhash } = await connection.getLatestBlockhash();

      const messageV0 = new TransactionMessage({
        payerKey: walletProvider.publicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      const signature = await walletProvider.signAndSendTransaction(
        transaction
      );

      await fetch(
        `/api/request/${payload.participation.request?.address}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount: payload.amount,
          }),
        }
      );
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["participations", address],
      });
    },
    onError(err) {
      console.error(err);
    },
  });

  const closeVault = useMutation({
    async mutationFn(request: PaymentRequest) {
      const pdas = getPdas(request.paymentId, walletProvider.publicKey);

      const ix = await program.methods
        .closeVault(request.paymentId)
        .accountsStrict({
          issuer: walletProvider.publicKey,
          vault: pdas.vault,
          vaultAuthority: pdas.vaultAuthority,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();

      const { blockhash } = await connection.getLatestBlockhash();

      const messageV0 = new TransactionMessage({
        payerKey: walletProvider.publicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      const signature = await walletProvider.signAndSendTransaction(
        transaction,
        {
          skipPreflight: true,
        }
      );

      await fetch(`/api/request/${request?.address}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          tx: signature,
        }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["requests", address],
      });
    },
    onError(err) {
      console.error(err);
    },
  });

  return {
    createVault,
    pay,
    closeVault,
  };
}
