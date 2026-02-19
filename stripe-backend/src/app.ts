// ✅ CommonJS-compatible ES import (RECOMMENDED)
// Works because "esModuleInterop": true is enabled in tsconfig.json
// Clean and modern syntax
import express, { Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import router from "./app/routes";
import { PaymentController } from "./app/module/payment/payment.controller";

/*
❌ Alternative import style (NOT recommended unless esModuleInterop is false)

import * as express from "express";

This is required when:
- "esModuleInterop" is NOT enabled
- Using strict CommonJS import behavior

But it is more verbose and less readable
*/

const app = express();
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stripe-payment-nine-sigma.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
