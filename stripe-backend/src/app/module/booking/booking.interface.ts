import { Types } from "mongoose";

export interface IBooking {
  name: string;
  email: string;
  amount: number;
  paymentStatus: "UNPAID" | "PAID";
  createdAt?: Date;
  updatedAt?: Date;
}
