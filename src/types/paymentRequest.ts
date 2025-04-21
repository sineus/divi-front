import { RequestParticipation } from "./requestParticipation";

export type PaymentRequest = {
  id: string;
  address: string;
  amount: number;
  currency: string;
  issuer: string;
  createdAt: number;
  participants: RequestParticipation[];
  hasFinalized: boolean;
  amountToPaid: number;
  paymentId: number;
  closeTx: string;
};
