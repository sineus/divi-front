"use client";

import { RequestParticipation } from "@/types";
import { copyWalletAddress } from "@/utils/copyWalletAddress";
import { getShortWalletAddress } from "@/utils/getShortWalletAddress";
import {
  IconButton,
  Separator,
  Spacer,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useMemo } from "react";
import { LuCopy } from "react-icons/lu";
import PayRequestModal from "./PayRequestModal";
import SharePaymentRequestModal from "./ShareRequestPaymentModal";

export default function PaymentParticipationItem({
  participation,
}: {
  participation: RequestParticipation;
}) {
  const createdAt = useMemo(
    () => format(participation?.createdAt, "yyyy-MM-dd HH:mm:ss"),
    [participation?.createdAt]
  );

  return (
    <Stack p="6" borderRadius="xl" bg="whiteAlpha.50" gap="5">
      <Stack direction="row">
        <Stack>
          <Stack direction="row" alignItems="center">
            <Text>{getShortWalletAddress(participation?.requestAddress)}</Text>
            <IconButton
              size="xs"
              variant="ghost"
              onClick={() => copyWalletAddress(participation?.requestAddress)}
            >
              <LuCopy />
            </IconButton>
          </Stack>
          <Text color="whiteAlpha.600">{createdAt}</Text>
        </Stack>
        <Spacer />
        <Text>{participation.request?.amount} SOL</Text>
      </Stack>
      <Separator />
      <Stack>
        <Stack direction="row">
          <Text color="whiteAlpha.600">Participants</Text>
          <Spacer />
          <Text>{participation.request?.participants?.length}</Text>
        </Stack>

        <Stack direction="row">
          <Text color="whiteAlpha.600">Status</Text>
          <Spacer />
          <Tag.Root>
            <Tag.Label>
              {participation.hasPaid ? "Completed" : "Pending"}
            </Tag.Label>
          </Tag.Root>
        </Stack>
      </Stack>
      <Stack direction="row" gap="4">
        <SharePaymentRequestModal request={participation.request} />
        <PayRequestModal participation={participation} />
      </Stack>
    </Stack>
  );
}
