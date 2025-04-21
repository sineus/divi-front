"use client";

import { useUser } from "@/providers/UserProvider";
import { Button, Dialog, Portal, useDialog } from "@chakra-ui/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  boundingBox,
  centerText,
  outline,
  Scanner,
} from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { LuScanBarcode } from "react-icons/lu";

export default function ScanPaymentRequestModal() {
  const [deviceId] = useState<string | undefined>(undefined);
  const [tracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);
  const { address } = useAppKitAccount();
  const { accessToken } = useUser();
  const dialog = useDialog();
  const queryClient = useQueryClient();

  const handleScan = async (data: string) => {
    setPause(true);
    console.log(data);

    await fetch(data, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    queryClient.invalidateQueries({
      queryKey: ["participations", address],
    });

    dialog.setOpen(false);

    setPause(false);
  };

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  return (
    <Dialog.RootProvider size="sm" placement="center" value={dialog}>
      <Dialog.Trigger asChild>
        <Button rounded="full">
          <LuScanBarcode />
          Pay
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Scan & Pay</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Scanner
                formats={[
                  "qr_code",
                  "micro_qr_code",
                  "rm_qr_code",
                  "maxi_code",
                  "pdf417",
                  "aztec",
                  "data_matrix",
                  "matrix_codes",
                  "dx_film_edge",
                  "databar",
                  "databar_expanded",
                  "codabar",
                  "code_39",
                  "code_93",
                  "code_128",
                  "ean_8",
                  "ean_13",
                  "itf",
                  "linear_codes",
                  "upc_a",
                  "upc_e",
                ]}
                constraints={{
                  deviceId: deviceId,
                }}
                onScan={(detectedCodes) => {
                  handleScan(detectedCodes[0].rawValue);
                }}
                onError={(error) => {
                  console.log(`onError: ${error}'`);
                }}
                styles={{
                  container: { height: "400px", width: "100%" },
                }}
                components={{
                  audio: false,
                  onOff: false,
                  torch: false,
                  zoom: false,
                  finder: false,
                  tracker: getTracker(),
                }}
                allowMultiple={true}
                scanDelay={2000}
                paused={pause}
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
    </Dialog.RootProvider>
  );
}
