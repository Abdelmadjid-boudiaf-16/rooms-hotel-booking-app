import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import UserBookingsList from "@/components/user/user-bookings-list";
import { prisma } from "@/prisma";
import { Booking, Hotel, Room } from "@/types";
import Link from "next/link";
import React from "react";

const BookingsPage = async () => {
  const session = await auth();
  const response = await prisma.booking.findMany({
    where: { userId: session?.user.id },
    include: {
      hotel: true,
      room: true,
    },
  });
  const bookings: (Booking & { hotel: Hotel } & { room: Room })[] = JSON.parse(
    JSON.stringify(response),
  );
  return (
    <div>
      {bookings.length > 0 ? (
        <UserBookingsList bookings={bookings} />
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center gap-8">
          <p className="text-lg">Empty. See our available rooms</p>
          <div>
            <Button asChild>
              <Link href={"/"} className="capitalize">
                check availabel rooms
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
