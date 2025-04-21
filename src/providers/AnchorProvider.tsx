"use client";

import { Divi, IDL } from "@/solana";
import {
  AnchorProvider as NativeAnchorProvider,
  Program,
} from "@coral-xyz/anchor";
import {
  Provider,
  useAppKitConnection,
} from "@reown/appkit-adapter-solana/react";
import { useAppKitProvider } from "@reown/appkit/react";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const AnchorContext = createContext<{
  provider: NativeAnchorProvider;
  program: Program<Divi>;
}>(null);

export const useAnchor = () => useContext(AnchorContext);

export default function AnchorProvider(props: PropsWithChildren) {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const [provider, setProvider] = useState<NativeAnchorProvider>();
  const [program, setProgram] = useState<Program<Divi>>();

  useEffect(() => {
    if (!connection && !walletProvider) {
      return;
    }

    const p = new NativeAnchorProvider(
      connection,
      walletProvider as AnchorWallet,
      {}
    );

    setProvider(p);
    setProgram(new Program(IDL, p));
  }, [connection, walletProvider]);

  return (
    <AnchorContext.Provider
      value={{
        provider,
        program,
      }}
    >
      {props.children}
    </AnchorContext.Provider>
  );
}
