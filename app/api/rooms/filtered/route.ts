import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { checkIn, checkOut, type } = await req.json();

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const availableRooms = await prisma.room.findMany({
      where: {
        bookings: {
          none: {
            OR: [
              {
                checkIn: { lte: new Date(checkOut) },
                checkOut: { gte: new Date(checkIn) },
                bookingStatus: { not: "cancelled" },
              },
            ],
          },
        },
        ...(type ? { type } : {}),
      },
      include: {
        hotel: true,
      },
    });

    return NextResponse.json(
      { success: true, availableRooms },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
