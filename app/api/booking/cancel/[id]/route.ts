import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const bookingId = params.id;
  const {paymentId} = await request.json();
  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    // refund the payment
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "Booking not found!" },
        { status: 404 },
      );
    }
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingStatus: "cancelled",
      },
    });

    if (refund.status !== "succeeded") {
      return NextResponse.json(
        {
          message:
            "your booking has been cancelled but the refund failed. Please contact support for further assictance!",
          success: false,
        },
        {
          status: 200,
        },
      );
    }
    
    return NextResponse.json(
      { message: "Booking has been cancelled successfully and refund has been processed" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}
