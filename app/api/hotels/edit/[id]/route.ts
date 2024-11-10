import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

// PUT request handler to update a hotel
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const hotelId = params.id;

  try {
    const { name, owner, email, phone, images, location } =
      await request.json();
    const existingHotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });
    if (!existingHotel) {
      return NextResponse.json(
        { message: "Hotel not found!" },
        { status: 404 },
      );
    }

    await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        name,
        email,
        owner,
        phone,
        location,
        images,
      },
    });

    return NextResponse.json(
      { message: "Hotel updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating hotel:", error);
    return NextResponse.json(
      { error: "Failed to update hotel" },
      { status: 500 },
    );
  }
}
