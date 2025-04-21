"use client";

import { useProgram } from "@/hooks/useProgram";
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
import { LuPlus } from "react-icons/lu";

export default function CreatePaymentRequestModal() {
  const dialog = useDialog();
  const [amount, setAmount] = useState<number>(1);
  const { createVault } = useProgram();

  async function createRequest() {
    try {
      await createVault.mutateAsync(amount);
      dialog.setOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog.RootProvider size="sm" placement="center" value={dialog}>
      <Dialog.Trigger asChild>
        <Button rounded="full">
          <LuPlus />
          Create
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create payment request</Dialog.Title>
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
              <Button onClick={createRequest} loading={createVault.isPending}>
                Create
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
