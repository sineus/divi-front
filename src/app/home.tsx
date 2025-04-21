"use client";

import ConnectButton from "@/components/ConnectButton";
import CreatePaymentRequestModal from "@/components/CreatePaymentRequestModal";
import PaymentParticipationList from "@/components/PaymentParticipationList";
import PaymentRequestList from "@/components/PaymentRequestList";
import ScanPaymentRequestModal from "@/components/ScanPaymentRequestModal";
import { useUser } from "@/providers/UserProvider";
import { Box, Container, Heading, Spacer, Stack } from "@chakra-ui/react";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Home() {
  const { address, isConnected } = useAppKitAccount();
  const { accessToken } = useUser();

  return Boolean(accessToken) ? (
    <Box>
      <Container p="11" maxW="868px">
        <Stack gap="8">
          <Box>
            <Stack direction="row" alignItems="center">
              <Heading size="2xl">Payment requests</Heading>
              <Spacer />

              <CreatePaymentRequestModal />
            </Stack>
            <PaymentRequestList />
          </Box>
          <Box>
            <Stack direction="row" alignItems="center">
              <Heading size="2xl">Payment participations</Heading>
              <Spacer />
              <ScanPaymentRequestModal />
            </Stack>
            <PaymentParticipationList />
          </Box>
        </Stack>
      </Container>
    </Box>
  ) : (
    <Stack w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <ConnectButton />
    </Stack>
  );
}
