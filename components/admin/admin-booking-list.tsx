"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking, Hotel, MyUser, Room } from "@/types";
import dayjs from "dayjs";
import { formatAsDollar } from "../format-to-usd";

export default function AdminBookingsList({
  bookings,
}: {
  bookings: (Booking & { hotel: Hotel } & { room: Room } & {user: MyUser})[];
}) {
    return (
      <Table>
          <TableCaption>
            <div className="mt-10 flex flex-col items-center gap-y-3">
              <span>A list of your bookings.</span>{" "}
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Room Number</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Booking Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>{booking.hotel.name}</TableCell>
                <TableCell>{booking.room.name}</TableCell>
                <TableCell>{booking.room.roomNumber}</TableCell>
                <TableCell>
                  {dayjs(booking.checkIn).format("MMM DD,YYYY hh:mm:ss")}
                </TableCell>
                <TableCell>
                  {dayjs(booking.checkOut).format("MMM DD,YYYY hh:mm:ss")}
                </TableCell>
                <TableCell>{formatAsDollar(String(booking.amount))}</TableCell>
                <TableCell>{booking.bookingStatus}</TableCell>
                <TableCell>
                  {dayjs(booking.createdAt).format("MMM DD,YYYY hh:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
            
          </TableBody>
      </Table>
    );
}
