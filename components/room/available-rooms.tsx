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
import { filterFormSchema } from "@/form-schemas";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, CalendarSearchIcon, CalendarX2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Hotel, Room } from "@/types";
import { useState } from "react";
import { Card } from "../ui/card";
import { CarouselDemo } from "../image-carousel";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { formatAsDollar } from "../format-to-usd";
import { useToast } from "@/hooks/use-toast";
const AvailableRooms = () => {
  const [rooms, setRooms] = useState<(Room & { hotel: Hotel })[]>([]);
  const [onSearch, setOnSearch] = useState(false);
  const form = useForm<z.infer<typeof filterFormSchema>>({
    resolver: zodResolver(filterFormSchema),
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof filterFormSchema>) => {
    try {
      const response = await fetch("/api/rooms/filtered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          type: values.type || null,
        }),
      });
      setOnSearch(true);
      if (response.ok) {
        const data = await response.json();
        setRooms(data.availableRooms);
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
  return (
    <div className="relative">
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
              <FormItem>
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
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Single Room">Single Room</SelectItem>
                    <SelectItem value="Double Room">Double Room</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                    <SelectItem value="Family Room">Family Room</SelectItem>
                    <SelectItem value="Deluxe Room">Deluxe Room</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex h-full items-center justify-between gap-8 lg:justify-normal">
            <Button
              type="button"
              onClick={() => {
                form.reset();
                setRooms([]);
                setOnSearch(false);
              }}
            >
              <CalendarX2Icon />
              Clear
            </Button>
            <Button>
              <CalendarSearchIcon /> Search
            </Button>
          </div>
        </form>
      </Form>
      {rooms.length > 0 ? (
        <div className="my-4 flex w-full flex-col gap-4">
          <Separator />
          <h1 className="text-lg font-bold">Available Rooms</h1>
          {rooms.map((room: Room & { hotel: Hotel }) => (
            <Card
              key={room.id}
              className="flex h-auto w-full flex-col gap-3 overflow-hidden rounded-lg sm:h-44 sm:flex-row"
            >
              <CarouselDemo
                className="h-80 w-full sm:h-full sm:w-[250px]"
                imagesUrl={room.images}
              />
              <div className="flex flex-1 flex-col gap-2 p-2">
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold">{room.name}</h1>
                  <span className="text-primary/80">{room.type}</span>
                </div>
                <span>
                  {room.hotel.name} - {room.hotel.location}
                </span>
                <Separator />
                <div className="flex items-center justify-between">
                  <span>Rent Per Day</span>{" "}
                  <span className="font-semibold text-primary/80">
                    {formatAsDollar(room.rentPerDay)}
                  </span>
                </div>
                <Separator />
                <Button asChild variant={"link"}>
                  <Link href={`/book-room/${room.id}`}>Room Details</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : onSearch ? (
        <div className="my-4 flex flex-col gap-4">
          <Separator />
          <span>No rooms available!</span>
        </div>
      ) : null}
    </div>
  );
};

export default AvailableRooms;
