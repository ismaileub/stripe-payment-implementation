import Stripe from "stripe";
import { Booking } from "../booking/booking.model";
import { Payment } from "./payment.model";
import AppError from "../../helper/AppError";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../../helper/stripe";
import { envVars } from "../../config/env";

const createPaymentSession = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.paymentStatus === "PAID") {
    throw new AppError(409, "Booking already paid");
  }

  // Reuse existing pending payment OR create new one
  let payment = await Payment.findOne({
    bookingId,
    status: "PENDING",
  });

  if (!payment) {
    payment = await Payment.create({
      bookingId,
      amount: booking.amount,
      transactionId: uuidv4(),
      status: "PENDING",
    });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: booking.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Booking of ${booking.name}`,
          },
          unit_amount: booking.amount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking._id.toString(),
      paymentId: payment._id.toString(),
    },
    // success_url: envVars.SUCCESS_URL,
    // cancel_url: envVars.CANCEL_URL,
    success_url: "https://www.programming-hero.com/",
    cancel_url: "https://next.programming-hero.com/",
  });

  return { paymentUrl: stripeSession.url };
};

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const bookingId = session.metadata?.bookingId;
      const paymentId = session.metadata?.paymentId;

      if (!bookingId || !paymentId) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Missing bookingId or paymentId in Stripe metadata",
        );
      }

      const isPaid = session.payment_status === "paid";

      //  Update  payment status
      if (isPaid) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: "PAID",
        });

        await Payment.findByIdAndUpdate(paymentId, {
          status: "PAID",
          paymentGatewayData: session,
        });
      }

      console.log(
        ` Payment ${session.payment_status} for appointment ${bookingId}`,
      );

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as any;
      console.log(`⚠️ Checkout session expired: ${session.id}`);
      // Appointment will be cleaned up by cron job
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as any;
      console.log(`❌ Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`ℹ️ Unhandled Stripe event type: ${event.type}`);
  }
};

export const PaymentServices = {
  createPaymentSession,
  handleStripeWebhookEvent,
};

// stripe listen --forward-to localhost:5000/webhook
