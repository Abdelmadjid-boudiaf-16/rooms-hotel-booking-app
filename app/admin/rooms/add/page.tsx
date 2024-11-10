import RoomForm from "@/components/room/room-form";
import { prisma } from "@/prisma";
import { Hotel } from "@/types";

const AddRoom = async () => {
  const hotelsResponse = await prisma.hotel.findMany();
  const hotels: Hotel[] = JSON.parse(JSON.stringify(hotelsResponse));
  return (
    <div className="flex justify-center">
      <RoomForm title="Add Room" type="add"  hotels={hotels} />
    </div>
  );
};

export default AddRoom;
