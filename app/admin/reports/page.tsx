import AdminReportsData from "@/components/admin/admin-report-data";
import { prisma } from "@/prisma";
import { Booking, Hotel, MyUser, Room } from "@/types";
import React from "react";

const ReportsPage = async () => {
  const response = await prisma.booking.findMany({
    include: {
      hotel: true,
      room: true,
      user: true,
    },
  });
  const bookings: (Booking & { user: MyUser } & { hotel: Hotel } & {
    room: Room;
  })[] = JSON.parse(JSON.stringify(response));
  return (
    <div>
      <AdminReportsData bookings={bookings} />
    </div>
  );
};

export default ReportsPage;
