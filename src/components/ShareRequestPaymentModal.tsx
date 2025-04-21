"use client";

import { PaymentRequest } from "@/types";
import { Button, Dialog, Portal } from "@chakra-ui/react";
import { useQRCode } from "next-qrcode";

export default function SharePaymentRequestModal({
  request,
}: {
  request: PaymentRequest;
}) {
  const { Canvas } = useQRCode();

  return (
    <Dialog.Root size="sm" placement="center">
      <Dialog.Trigger asChild>
        <Button rounded="full">Share</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Share payment request</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Canvas
                text={`${window.location.origin}/api/request/${request?.address}/share`}
                options={{
                  errorCorrectionLevel: "M",
                  margin: 3,
                  scale: 4,
                  width: 200,
                  color: {
                    dark: "#000",
                    light: "#fff",
                  },
                }}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
