import RoomsData from "@/components/room/rooms-data";
import AvailableRooms from "@/components/room/available-rooms";
import { Separator } from "@/components/ui/separator";
import { Hotel, Room } from "@/types";
import { prisma } from "@/prisma";

export default async function Home() {
  const response = await prisma.room.findMany({ include: { hotel: true } });
  const rooms: (Room & { hotel: Hotel })[] = JSON.parse(
    JSON.stringify(response),
  );
  return (
    <div className="flex flex-col gap-4">
      <AvailableRooms />
      <Separator />
      <RoomsData rooms={rooms} />
    </div>
  );
}
