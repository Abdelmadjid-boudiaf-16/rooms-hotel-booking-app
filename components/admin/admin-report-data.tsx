"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { roportsFormSchema } from "@/form-schemas";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, CalendarX2Icon, ImportIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking, Hotel, MyUser, Room } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import AdminBookingsList from "./admin-booking-list";
import { formatAsDollar } from "../format-to-usd";
const AdminReportsData = ({
  bookings,
}: {
  bookings: (Booking & { user: MyUser } & { hotel: Hotel } & {
    room: Room;
  })[];
}) => {
  const [getData, setGetData] = useState(false);
  const [data, setData] = useState<
    (Booking & { user: MyUser } & { hotel: Hotel } & { room: Room })[]
  >([]);
  const form = useForm<z.infer<typeof roportsFormSchema>>({
    resolver: zodResolver(roportsFormSchema),
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof roportsFormSchema>) => {
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: values.checkIn,
          checkOut: values.checkOut ? values.checkOut : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setData(data.bookings);
        setGetData(true);
      } else {
        toast({
          title: "Available Rooms",
          description: "No rooms available",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Available Rooms",
        description: `fetch available  rooms error ${error}`,
      });
    }
  };
  const filteredBooking = bookings.filter(
    (booking) => booking.bookingStatus !== "cancelled",
  );
  const bookingsData = getData ? data : filteredBooking;

  const totalRevenue = bookingsData.reduce((accumulator, bookingData) => {
    return accumulator + bookingData.amount;
  }, 0);
  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-wrap items-end gap-8"
        >
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex h-full items-center justify-between gap-8 lg:justify-normal">
            <Button
              type="button"
              onClick={() => {
                form.reset();
                setGetData(false);
              }}
            >
              <CalendarX2Icon />
              Clear
            </Button>
            <Button>
              <ImportIcon /> Get Data
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex flex-col gap-4">
        <Separator />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col rounded-md border bg-blue-600/10 p-8 font-bold text-blue-600">
            <span>Bookings</span>
            <span className="w-full text-center">
              {bookingsData.length}
            </span>{" "}
          </div>
          <div className="flex flex-col rounded-md border bg-green-600/10 p-8 font-bold text-green-600">
            <span>Revenue</span>
            <span className="w-full text-center">
              {formatAsDollar(String(totalRevenue))}
            </span>{" "}
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <AdminBookingsList bookings={bookingsData} />
      </div>
    </div>
  );
};

export default AdminReportsData;
