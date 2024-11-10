import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { role } = await request.json();
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id },
      data: {
        admin: role === "admin" ? true : false,
      },
    });

    return NextResponse.json(
      { message: "User role updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating User role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 },
    );
  }
}
