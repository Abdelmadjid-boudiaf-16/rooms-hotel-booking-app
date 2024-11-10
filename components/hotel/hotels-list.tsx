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
import { Hotel } from "@/types";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function HotelsList({ hotels }: { hotels: Hotel[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const deleteHotel = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/hotels/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Hotel Deleted",
          description: "Hotel deletion was successful.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Hotel Deletion Failed",
          description: errorData.message || "Failed to delete the hotel.",
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
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>CreatedAt</TableHead>
          <TableHead>UpdatedAt</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hotels.map((hotel) => (
          <TableRow key={hotel.id}>
            <TableCell>{hotel.name}</TableCell>
            <TableCell>{hotel.owner}</TableCell>
            <TableCell>{hotel.email}</TableCell>
            <TableCell>{hotel.phone}</TableCell>
            <TableCell>{hotel.location}</TableCell>
            <TableCell>
              {dayjs(hotel.createdAt).format("MMM DD,YYYY hh:mm:ss")}
            </TableCell>
            <TableCell>
              {dayjs(hotel.updatedAt).format("MMM DD,YYYY hh:mm:ss")}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    router.push(`/admin/hotels/edit/${hotel.id}`);
                  }}
                >
                  <Icons.edit size={20} className="text-yellow-500" />
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => deleteHotel(hotel.id)}
                >
                  <Icons.remove size={20} className="text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
