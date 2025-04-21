"use client";

import { User } from "@/types";
import { Provider } from "@reown/appkit-adapter-solana";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import base58 from "bs58";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext<{ user: User; accessToken: string }>(null);

export const useUser = () => useContext(UserContext);

export default function UserProvider(props: PropsWithChildren) {
  const [user, setUser] = useState<User>();
  const [accessToken, setAccessToken] = useState<string>();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const authenticate = useCallback(async () => {
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

    setUser(res.user);
    setAccessToken(res.accessToken);
  }, [address, walletProvider]);

  useEffect(() => {
    if (!walletProvider) {
      return;
    }

    authenticate();
  }, [walletProvider, authenticate]);

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
