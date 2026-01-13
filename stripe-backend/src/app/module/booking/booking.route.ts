import { BookingControllers } from "./booking.controller";
import { Router } from "express";

const router = Router();

router.post("/", BookingControllers.createBooking);

export const BookingRoutes = router;
