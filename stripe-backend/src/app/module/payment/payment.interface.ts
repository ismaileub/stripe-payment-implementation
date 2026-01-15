import { Types } from "mongoose";

export interface IPayment {
  bookingId: Types.ObjectId;
  amount: number;
  transactionId: string;
  status: "PENDING" | "PAID";
  paymentGatewayData?: unknown;
  createdAt?: Date;
}
