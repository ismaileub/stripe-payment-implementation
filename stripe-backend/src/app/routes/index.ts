import express from "express";
import { BookingRoutes } from "../module/booking/booking.route";
import { PaymentRoutes } from "../module/payment/payment.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
