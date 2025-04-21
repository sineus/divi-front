"use client";

import { User } from "@/types";
import { Provider } from "@reown/appkit-adapter-solana";
import {
  useAppKitAccount,
  useAppKitProvider,
  useDisconnect,
} from "@reown/appkit/react";
import base58 from "bs58";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext<{ user: User; accessToken: string }>(null);

export const useUser = () => useContext(UserContext);

export default function UserProvider(props: PropsWithChildren) {
  const { disconnect } = useDisconnect();
  const [user, setUser] = useState<User>();
  const [accessToken, setAccessToken] = useState<string>();
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

    setUser(res.user);
    setAccessToken(res.accessToken);
  }

  useEffect(() => {
    if (!walletProvider) {
      return;
    }

    authenticate();
  }, [walletProvider]);

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
