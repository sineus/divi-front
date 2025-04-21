"use client";

import { Button, Stack, Text } from "@chakra-ui/react";
import type { Provider } from "@reown/appkit-adapter-solana";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useDisconnect,
} from "@reown/appkit/react";
import base58 from "bs58";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();

  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  async function authenticate() {
    const message = "Please sign the message below to authenticate yourself";
    const signature = await walletProvider.signMessage(
      new TextEncoder().encode(message)
    );

    console.log(signature);

    const signinResponse = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        signature: base58.encode(signature),
      }),
    });

    const res = await signinResponse.json();

    console.log(res.user);
  }

  useEffect(() => {
    if (!walletProvider?.publicKey) {
      return;
    }

    authenticate();
  }, [walletProvider?.publicKey]);

  return (
    <Stack direction="column">
      <Stack direction="row">
        {isConnected ? (
          <>
            <Button onClick={() => disconnect()}>Disconnect</Button>
            <Text color="white">{address}</Text>
          </>
        ) : (
          <Button onClick={() => open()}>Connect</Button>
        )}
      </Stack>
      <Link href="/profile">Profile</Link>
    </Stack>
  );
}
