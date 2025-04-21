import { PaymentRequest } from "./paymentRequest";

export type RequestParticipation = {
  id: string;
  createdAt: number;
  requestAddress: string;
  request: PaymentRequest;
  payer: string;
  amount: number;
  hasPaid: boolean;
};
