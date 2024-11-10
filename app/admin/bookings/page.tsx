import AdminBookingsList from "@/components/admin/admin-booking-list";
import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma";
import { Booking, Hotel, MyUser, Room } from "@/types";
import Link from "next/link";

const BookingsPage = async () => {
  const response = await prisma.booking.findMany({
    include: {
      hotel: true,
      room: true,
      user: true
    },
  });
  const bookings: (Booking & { hotel: Hotel } & { room: Room } & {user: MyUser})[] = JSON.parse(
    JSON.stringify(response),
  );
  return (
    <div>
      {bookings.length > 0 ? (
        <AdminBookingsList bookings={bookings} />
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
