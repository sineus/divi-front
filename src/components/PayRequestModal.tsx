"use client";

import { useProgram } from "@/hooks/useProgram";
import { RequestParticipation } from "@/types";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  InputGroup,
  Portal,
  Text,
  useDialog,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

export default function PayRequestModal({
  participation,
}: {
  participation: RequestParticipation;
}) {
  const dialog = useDialog();
  const [amount, setAmount] = useState<number>(1);
  const { pay } = useProgram();

  async function payRequest() {
    try {
      await pay.mutateAsync({ participation, amount });
      dialog.setOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog.RootProvider size="sm" placement="center" value={dialog}>
      <Dialog.Trigger asChild>
        <Button rounded="full" disabled={participation.hasPaid}>
          Pay
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Pay request</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root>
                <Field.Label>Amount</Field.Label>
                <InputGroup endElement={<Text>SOL</Text>}>
                  <Input
                    placeholder="0"
                    value={amount}
                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                      setAmount(+e.target.value)
                    }
                  />
                </InputGroup>
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={payRequest} loading={pay.isPending}>
                Confirm
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
