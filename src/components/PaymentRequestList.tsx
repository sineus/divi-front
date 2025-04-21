"use client";

import { useUser } from "@/providers/UserProvider";
import { PaymentRequest } from "@/types";
import { Stack } from "@chakra-ui/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";
import PaymentRequestItem from "./PaymentRequestItem";

export default function PaymentRequestList() {
  const { accessToken } = useUser();
  const { address, isConnected } = useAppKitAccount();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["requests", address],
    async queryFn() {
      const req = await fetch(`/api/request`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return (await req.json()) as PaymentRequest[];
    },
  });

  return (
    <Stack my="5" gap="3">
      {requests.map((request) => (
        <PaymentRequestItem key={request.id} request={request} />
      ))}
    </Stack>
  );
}
