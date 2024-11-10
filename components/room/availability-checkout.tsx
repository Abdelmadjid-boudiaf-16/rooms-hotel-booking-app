"use client";
import { useState } from "react";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { availablityCheckFormSchema } from "../../form-schemas";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import { Room, Hotel } from "@/types";
import { formatAsDollar } from "../format-to-usd";
import { Icons } from "../icons";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../payment/cheout-form";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const AvailabiltyCheckout = ({
  roomId,
  room,
}: {
  roomId: string;
  room: Room & { hotel: Hotel };
}) => {
  const form = useForm<z.infer<typeof availablityCheckFormSchema>>({
    resolver: zodResolver(availablityCheckFormSchema),
  });
  const [isAvailable, setIsAvailable] = useState(false);
  const { toast } = useToast();
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const onSubmit = async (
    values: z.infer<typeof availablityCheckFormSchema>,
  ) => {
    const { checkIn, checkOut } = values;
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    const result = await checkAvailability({
      roomId,
      checkIn,
      checkOut,
    });
    if (result.success && result.available) {
      setIsAvailable(result.available);
      const totDays = dayjs(checkOut).diff(dayjs(checkIn), "day");
      setTotalDays(totDays);
      setTotalAmount(totDays * +room.rentPerDay);
      toast({
        title: "Room Availabilty",
        description: "This Room is available",
      });
    } else {
      setIsAvailable(result.availabel);
      toast({
        variant: "destructive",
        title: "Room Availabilty",
        description: "This Room isn't available",
      });
    }
  };
  const onBooking = async () => {
    try {
      setIsLoading(true);
      const result = await createPaymentIntent(totalAmount);
      if (result?.success) {
        setClientSecret(result.data);
        setShowPayment(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-fit w-full flex-col space-y-6 p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-6"
        >
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
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
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Check Availabitly
          </Button>
        </form>
      </Form>
      {isAvailable && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span>Total Days</span>
            <span>{totalDays}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Ammount</span>
            <span>{formatAsDollar(String(totalAmount))}</span>
          </div>
          <Button
            className="w-full"
            variant={"outline"}
            type="button"
            onClick={onBooking}
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner />}
            Book the room
          </Button>
        </div>
      )}

      {showPayment && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
          }}
        >
          <CheckoutForm
            totalAmount={totalAmount}
            setIsAvailable={setIsAvailable}
            totaldays={totalDays}
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            setShowPayment={setShowPayment}
          />
        </Elements>
      )}
    </Card>
  );
};

export default AvailabiltyCheckout;

const checkAvailability = async ({
  roomId,
  checkIn,
  checkOut,
}: {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
}) => {
  try {
    const response = await fetch("/api/booking/check-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, checkIn, checkOut }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Error checking availability");
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, available: false };
  }
};

const createPaymentIntent = async (amount: number) => {
  try {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, data: data.clientSecret };
    } else {
      console.error("Failed to retrieve client secret:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return null;
  }
};
