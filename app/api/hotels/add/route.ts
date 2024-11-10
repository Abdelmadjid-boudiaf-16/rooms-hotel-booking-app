import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, owner, email, phone, images, location } = await req.json();

    const existingHotel = await prisma.hotel.findUnique({
      where: { email },
    });

    if (existingHotel) {
      return NextResponse.json(
        { message: "Hotel already exist" },
        { status: 400 },
      );
    }

    await prisma.hotel.create({
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
      { message: "Hotel added successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("add hotel error:", error);
    return NextResponse.json(
      { message: "An error occurred during adding hotel" },
      { status: 500 },
    );
  }
}
