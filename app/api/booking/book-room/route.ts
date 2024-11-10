import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      checkIn,
      checkOut,
      roomId,
      totaldays,
      paymentId,
      userId,
      hotelId,
      amount,
      bookingStatus,
    } = await req.json();

    // Validate required fields
    if (!roomId || !userId || !paymentId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Parse dates if they're strings
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 },
      );
    }

    // Check if room is already booked for the given dates
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gte: checkInDate } },
            ],
          },
          {
            AND: [
              { checkIn: { lte: checkOutDate } },
              { checkOut: { gte: checkOutDate } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { message: "Room is not available for the selected dates" },
        { status: 400 },
      );
    }

    // Check for existing payment
    const existingBooking = await prisma.booking.findUnique({
      where: { paymentId },
    });

    if (existingBooking) {
      return NextResponse.json(
        { message: "Room already booked with this payment ID" },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totaldays,
        paymentId,
        hotelId,
        roomId,
        userId,
        amount,
        bookingStatus,
      },
      include: {
        room: true,
        hotel: true,
        user: true,
      },
    });

    return NextResponse.json(
      {
        message: "Room booked successfully",
        booking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Book room error:", error);
    return NextResponse.json(
      { message: "An error occurred during room booking" },
      { status: 500 },
    );
  }
}
