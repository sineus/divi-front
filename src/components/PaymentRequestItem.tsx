"use client";

import { useHttp } from "@/hooks/useHttp";
import { useProgram } from "@/hooks/useProgram";
import { PaymentRequest } from "@/types";
import { copyWalletAddress } from "@/utils/copyWalletAddress";
import { getShortWalletAddress } from "@/utils/getShortWalletAddress";
import {
  Button,
  IconButton,
  Separator,
  Spacer,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo } from "react";
import { LuCopy } from "react-icons/lu";
import SharePaymentRequestModal from "./ShareRequestPaymentModal";

enum RequestStatus {
  Pending = "Pending",
  Completed = "Completed",
  Closed = "Closed",
}

export default function PaymentRequestItem({
  request,
}: {
  request: PaymentRequest;
}) {
  const queryClient = useQueryClient();
  const { address } = useAppKitAccount();
  const { closeVault } = useProgram();
  const http = useHttp();

  const createdAt = useMemo(
    () => format(request?.createdAt, "yyyy-MM-dd HH:mm:ss"),
    [request?.createdAt]
  );

  const cancel = useMutation({
    async mutationFn() {
      return http.delete(`/request/${request?.address}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["requests", address],
      });
    },
    onError(err) {
      console.error(err);
    },
  });

  const status = useMemo(() => {
    if (request.closeTx) {
      return RequestStatus.Closed;
    } else if (request?.hasFinalized) {
      return RequestStatus.Completed;
    } else {
      return RequestStatus.Pending;
    }
  }, [request]);

  return (
    <Stack p="6" borderRadius="xl" bg="whiteAlpha.50" gap="5">
      <Stack direction="row">
        <Stack>
          <Stack direction="row" alignItems="center">
            <Text>{getShortWalletAddress(request?.address)}</Text>
            <IconButton
              size="xs"
              variant="ghost"
              onClick={() => copyWalletAddress(request?.address)}
            >
              <LuCopy />
            </IconButton>
          </Stack>
          <Text color="whiteAlpha.600">{createdAt}</Text>
        </Stack>
        <Spacer />
        <Text>{request?.amount} SOL</Text>
      </Stack>
      <Separator />
      <Stack>
        <Stack direction="row">
          <Text color="whiteAlpha.600">Participants</Text>
          <Spacer />
          <Text>{request?.participants?.length}</Text>
        </Stack>
        <Stack direction="row">
          <Text color="whiteAlpha.600">Amount to paid</Text>
          <Spacer />
          <Text>{request?.amountToPaid} SOL</Text>
        </Stack>
        <Stack direction="row">
          <Text color="whiteAlpha.600">Status</Text>
          <Spacer />
          <Tag.Root>
            <Tag.Label>{status}</Tag.Label>
          </Tag.Root>
        </Stack>
      </Stack>
      <Stack direction="row" gap="4">
        {status === RequestStatus.Pending && (
          <>
            <SharePaymentRequestModal request={request} />
            <Button
              rounded="full"
              onClick={() => cancel.mutate()}
              loading={cancel.isPending}
            >
              Cancel
            </Button>
          </>
        )}

        {status === RequestStatus.Completed && (
          <Button
            rounded="full"
            onClick={() => closeVault.mutate(request)}
            loading={closeVault.isPending}
          >
            Claim
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
