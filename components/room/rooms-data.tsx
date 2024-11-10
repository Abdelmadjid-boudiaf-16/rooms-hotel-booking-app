import { Hotel, Room } from "@/types";
import { Card } from "../ui/card";
import { CarouselDemo } from "../image-carousel";
import { formatAsDollar } from "../format-to-usd";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";

const RoomsData = async ({ rooms }: { rooms: (Room & { hotel: Hotel })[] }) => {
  return (
    <div>
      <h1 className="text-lg font-bold">All Rooms</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((room: Room & { hotel: Hotel }) => (
          <Card
            key={room.id}
            className="mx-auto flex w-full max-w-sm flex-col gap-3 overflow-hidden shadow-lg"
          >
            <CarouselDemo
              className="h-[340px] w-full"
              imagesUrl={room.images}
            />
            <div className="flex flex-col gap-2 p-2">
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
    </div>
  );
};

export default RoomsData;
