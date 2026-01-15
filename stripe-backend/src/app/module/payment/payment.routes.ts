// payment.route.ts
import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

/**
 * Create / retry Stripe payment session
 * POST /api/payment/:bookingId
 */
router.post("/:bookingId", PaymentController.createPaymentSession);

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }), // important for signature verification
//   stripeWebhookHandler
// );

export const PaymentRoutes = router;
