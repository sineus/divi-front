"use client";

import { useHttp } from "@/hooks/useHttp";
import { PaymentRequest } from "@/types";
import { Stack } from "@chakra-ui/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";
import PaymentRequestItem from "./PaymentRequestItem";

export default function PaymentRequestList() {
  const { address } = useAppKitAccount();
  const http = useHttp();

  const { data: requests = [] } = useQuery({
    queryKey: ["requests", address],
    async queryFn() {
      return http.get<PaymentRequest[]>("/request");
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
