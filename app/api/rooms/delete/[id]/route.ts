import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const roomId = params.id;
  try {
    const existingroom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!existingroom) {
      return NextResponse.json({ message: "room not found!" }, { status: 404 });
    }
    await prisma.room.delete({
      where: { id: roomId },
    });

    return NextResponse.json(
      { message: "room deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 },
    );
  }
}
