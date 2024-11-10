
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { roomId, checkIn, checkOut } = await request.json();

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 },
      );
    }

   const conflictingBookings = await prisma.booking.findMany({
     where: {
       roomId,
       bookingStatus: { not: "cancelled" },
       OR: [
         {
           checkIn: { lte: new Date(checkOut) },
           checkOut: { gte: new Date(checkIn) },
         },
       ],
     },
   });

    const isAvailable = conflictingBookings.length === 0;

    return NextResponse.json({
      success: true,
      available: isAvailable,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
