import { Request, Response } from "express";

import { stripe } from "../../helper/stripe";
import { catchAsync } from "../../helper/catchAsync";
import { sendResponse } from "../../helper/sendResponse";
import { PaymentServices } from "./payment.service";
import { envVars } from "../../config/env";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const id = bookingId as string;

  const result = await PaymentServices.createPaymentSession(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    //error here
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = envVars.WEBHOOK_SECRET_KEY;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.error("⚠️ Webhook signature verification succeeded:");
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    const result = await PaymentServices.handleStripeWebhookEvent(event);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Webhook req send successfully",
      data: result,
    });
  }
);
export const PaymentController = {
  createPaymentSession,
  handleStripeWebhookEvent,
};
