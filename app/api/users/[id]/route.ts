import { NextResponse } from "next/server";
import { getUserById } from "@/lib/user";
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching user: ${error}` },
      { status: 500 },
    );
  }
}
