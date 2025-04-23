"use client";

import { useHttp } from "@/hooks/useHttp";
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
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext<{
  user: User;
  accessToken: string;
  setUser: Dispatch<SetStateAction<User>>;
  setAccessToken: Dispatch<SetStateAction<string>>;
}>(null);

export const useUser = () => useContext(UserContext);

export default function UserProvider(props: PropsWithChildren) {
  const [user, setUser] = useState<User>();
  const [accessToken, setAccessToken] = useState<string>();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { disconnect } = useDisconnect();
  const http = useHttp();

  const authenticate = useCallback(async () => {
    if (localStorage.getItem("accessToken")) {
      const userFromStorage = JSON.parse(localStorage.getItem("user"));

      if (userFromStorage.address !== address) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        disconnect();
        return;
      }
      setUser(userFromStorage);
      setAccessToken(localStorage.getItem("accessToken"));
      return;
    }

    const message = "Please sign the message below to authenticate yourself";
    const signature = await walletProvider.signMessage(
      new TextEncoder().encode(message)
    );

    console.log(signature);

    const res = await http.post("/auth/signin", {
      address,
      signature: base58.encode(signature),
    });

    setUser(res.user);
    setAccessToken(res.accessToken);

    console.log(res);

    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("accessToken", res.accessToken);
  }, [address, walletProvider]);

  useEffect(() => {
    if (!walletProvider) {
      return;
    }

    walletProvider.on("accountsChanged", authenticate);

    authenticate();

    return () => {
      walletProvider?.removeListener("accountsChanged", authenticate);
    };
  }, [walletProvider, authenticate]);

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        setAccessToken,
        setUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
