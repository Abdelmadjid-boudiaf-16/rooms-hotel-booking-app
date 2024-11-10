import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      hotelName,
      name,
      rentPerDay,
      type,
      roomNumber,
      amenities,
      bedRooms,
      images,
    } = await req.json();


    const hotel = await prisma.hotel.findFirst({ where: { name: hotelName } })
    const id = hotel?.id as string

    const existingRoom = await prisma.room.findFirst({
      where: { name },
    });

    if (existingRoom) {
      return NextResponse.json(
        { message: "Room already exist" },
        { status: 400 },
      );
    }

    await prisma.room.create({
      data: {
        hotelId: id,
        name,
        rentPerDay,
        type,
        roomNumber,
        amenities,
        bedRooms,
        images,
      },
    });

    return NextResponse.json(
      { message: "Room added successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("add room error:", error);
    return NextResponse.json(
      { message: "An error occurred during adding room" },
      { status: 500 },
    );
  }
}
