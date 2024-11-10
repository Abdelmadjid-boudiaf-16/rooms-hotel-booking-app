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
import { Room, Hotel } from "@/types";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function RoomsList({
  rooms,
}: {
  rooms: (Room & { hotel: Hotel })[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const deleteroom = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rooms/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "room Deleted",
          description: "room deletion was successful.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "room Deletion Failed",
          description: errorData.message || "Failed to delete the room.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the room.",
      });
      console.error("Error deleting room:", error);
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
          <span>A list of your rooms.</span>{" "}
          <Button onClick={() => router.refresh()}>Refresh</Button>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Hotel</TableHead>
          <TableHead>Room Number</TableHead>
          <TableHead>CreatedAt</TableHead>
          <TableHead>UpdatedAt</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.name}</TableCell>
            <TableCell>{room.hotel.name}</TableCell>
            <TableCell>{room.roomNumber}</TableCell>
            <TableCell>
              {dayjs(room.createdAt).format("MMM DD,YYYY hh:mm:ss")}
            </TableCell>
            <TableCell>
              {dayjs(room.updatedAt).format("MMM DD,YYYY hh:mm:ss")}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    router.push(`/admin/rooms/edit/${room.id}`);
                  }}
                >
                  <Icons.edit size={20} className="text-yellow-500" />
                </Button>
                <Button variant={"outline"} onClick={() => deleteroom(room.id)}>
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
