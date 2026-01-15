import mongoose from "mongoose";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { v4 as uuidv4 } from "uuid";
import AppError from "../../helper/AppError";
import { stripe } from "../../helper/stripe";

const createBooking = async (payload: {
  name: string;
  email: string;
  amount: number;
}) => {
  //  1. Check email first
  const existingBooking = await Booking.findOne({ email: payload.email });

  if (existingBooking) {
    throw new AppError(409, "Booking already exists with this email");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //  2. Create booking
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
      throw new AppError(500, "Booking creation failed");
    }

    //  3. Create payment
    const transactionId = uuidv4();

    const [payment] = await Payment.create(
      [
        {
          bookingId: booking._id,
          amount: payload.amount,
          transactionId,
          status: "PENDING",
        },
      ],
      { session }
    );

    if (!payment) {
      throw new AppError(500, "Payment creation failed");
    }

    //  4. Create Stripe Checkout Session
    // const stripeSession = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   mode: "payment",
    //   customer_email: payload.email,
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "usd",
    //         product_data: {
    //           name: `Booking for ${payload.name}`,
    //         },
    //         unit_amount: payload.amount * 100, // Stripe uses cents
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   metadata: {
    //     bookingId: booking._id.toString(),
    //     paymentId: payment._id.toString(),
    //     transactionId,
    //   },
    //   success_url: "https://www.programming-hero.com/",
    //   cancel_url: "https://next.programming-hero.com/",
    // });

    // if (!stripeSession.url) {
    //   throw new AppError(500, "Stripe session creation failed");
    // }

    //  5. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // console.log(stripeSession);

    // return {
    //   paymentUrl: stripeSession.url,
    //   bookingId: booking._id,
    // };
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
