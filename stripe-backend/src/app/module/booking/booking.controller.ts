import { Request, Response } from "express";
import { BookingServices } from "./booking.service";
import { sendResponse } from "../../helper/sendResponse";

const createBooking = async (req: Request, res: Response) => {
  const booking = await BookingServices.createBooking(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking created successfully",
    data: booking,
  });
};

export const BookingControllers = {
  createBooking,
};
