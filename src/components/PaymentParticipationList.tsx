"use client";

import { useHttp } from "@/hooks/useHttp";
import { RequestParticipation } from "@/types";
import { Spinner, Stack } from "@chakra-ui/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";
import PaymentParticipationItem from "./PaymenParticipationItem";

export default function PaymentParticipationList() {
  const { address } = useAppKitAccount();
  const http = useHttp();

  const { data: participations = [], isLoading } = useQuery({
    queryKey: ["participations", address],
    async queryFn() {
      return http.get<RequestParticipation[]>("/participation");
    },
  });

  return (
    <Stack my="5" gap="3">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {participations.map((participation) => (
            <PaymentParticipationItem
              key={participation.id}
              participation={participation}
            />
          ))}
        </>
      )}
    </Stack>
  );
}
