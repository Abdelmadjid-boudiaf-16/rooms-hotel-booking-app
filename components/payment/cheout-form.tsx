"use client";
import {
  AddressElement,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { FormEvent, useState } from "react";
import { formatAsDollar } from "../format-to-usd";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "../icons";
import { Hotel, Room } from "@/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CheckoutForm = ({
  totalAmount,
  setIsAvailable,
  setShowPayment,
  room,
  checkIn,
  checkOut,
  totaldays,
}: {
  totalAmount: number;
  setIsAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
  room: Room & { hotel: Hotel };
  checkIn: Date | null;
  checkOut: Date | null;
  totaldays: number;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession()
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Payment",
        description: "Payment failed!",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Payment",
        description: "Payment successful!",
      });
    }
    const response = await fetch("/api/booking/book-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: room.id,
        hotelId: room.hotel.id,
        amount: totalAmount,
        checkIn,
        checkOut,
        totaldays,
        userId: session?.user.id,
        paymentId: result.paymentIntent?.id,
        bookingStatus: "booked",
      }),
    });
    if (response.ok) {
      toast({
        title: "Room booking",
        description: "room booked successful",
      });
      setShowPayment(false);
      setIsLoading(false);
      setIsAvailable(false);
      router.push("/user/bookings");
    } else {
      const errorData = await response.json();
      toast({
        variant: "destructive",
        title: "Book room failed",
        description: errorData.message,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      <AddressElement options={{ mode: "billing" }} />
      <Button variant={"outline"}>Cancel</Button>
      <Button className="mt-5 w-full" disabled={!stripe}>
        {isLoading && <Icons.spinner />}
        Pay {formatAsDollar(String(totalAmount))}
      </Button>
    </form>
  );
};

export default CheckoutForm;
