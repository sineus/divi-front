"use client";

import { useUser } from "@/providers/UserProvider";
import { RequestParticipation } from "@/types";
import { Spinner, Stack } from "@chakra-ui/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";
import PaymentParticipationItem from "./PaymenParticipationItem";

export default function PaymentParticipationList() {
  const { accessToken } = useUser();
  const { address, isConnected } = useAppKitAccount();
  const { data: participations = [], isLoading } = useQuery({
    queryKey: ["participations", address],
    async queryFn() {
      const req = await fetch(`/api/participation`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return (await req.json()) as RequestParticipation[];
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
