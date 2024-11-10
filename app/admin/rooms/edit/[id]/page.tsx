import RoomForm from "@/components/room/room-form";
import { prisma } from "@/prisma";
import { Hotel, Room } from "@/types";

const EditRoomInfo = async ({ params }: { params: { id: string } }) => {
  const roomId = params.id;
  const response = await prisma.room.findUnique({
    where: { id: roomId },
    include: { hotel: true },
  });
  const room: (Room & {hotel: Hotel}) = JSON.parse(JSON.stringify(response));
  const hotelsResponse = await prisma.hotel.findMany();
  const hotels: Hotel[] = JSON.parse(JSON.stringify(hotelsResponse));

  return (
    <div className="flex justify-center">
      <RoomForm title="Edit Room" type="edit" room={room} hotels={hotels} />
    </div>
  );
};

export default EditRoomInfo;
