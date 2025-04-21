"use client";

import { Button } from "@chakra-ui/react";
import { useAppKit } from "@reown/appkit/react";

export default function ConnectButton() {
  const { open } = useAppKit();

  return <Button onClick={() => open()}>Connect</Button>;
}
