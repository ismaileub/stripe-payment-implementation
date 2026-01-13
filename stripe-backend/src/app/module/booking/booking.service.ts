import mongoose from "mongoose";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { v4 as uuidv4 } from "uuid";
import AppError from "../../helper/AppError";

const createBooking = async (payload: {
  name: string;
  email: string;
  amount: number;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [booking] = await Booking.create(
      [
        {
          name: payload.name,
          email: payload.email,
          amount: payload.amount,
          paymentStatus: "UNPAID",
        },
      ],
      { session }
    );

    if (!booking) {
      throw new AppError(404, "Booking creation failed");
    }

    const [payment] = await Payment.create(
      [
        {
          bookingId: booking._id,
          amount: payload.amount,
          transactionId: uuidv4(),
          status: "PENDING",
        },
      ],
      { session }
    );

    if (!payment) {
      throw new AppError(404, "Payment creation failed");
    }

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const BookingServices = {
  createBooking,
};
