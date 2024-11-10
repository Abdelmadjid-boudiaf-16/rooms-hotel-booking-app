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
import { Booking, Hotel, Room } from "@/types";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { formatAsDollar } from "../format-to-usd";

export default function UserBookingsList({
  bookings,
}: {
  bookings: (Booking & { hotel: Hotel } & { room: Room })[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const cancelBooking = async (id: string, paymentId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/booking/cancel/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      if (response.ok) {
        toast({
          title: "Cancel booking",
          description: "Room Bookings has been cancelled successfully.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Cancel Booking Failed",
          description:
            errorData.message || "Failed to cancel the room booking.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the hotel.",
      });
      console.error("Error deleting hotel:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
      </div>
    );

  return (
    <Table>
      <TableCaption>
        <div className="mt-10 flex flex-col items-center gap-y-3">
          <span>A list of your hotels.</span>{" "}
          <Button onClick={() => router.refresh()}>Refresh</Button>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Hotel</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Room Number</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Booking Status</TableHead>
          <TableHead>Booking Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
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
            <TableCell>
              {booking.bookingStatus === "booked" && (
                <Button
                  variant={"destructive"}
                  onClick={() => cancelBooking(booking.id, booking.paymentId)}
                >
                  Cancel
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
