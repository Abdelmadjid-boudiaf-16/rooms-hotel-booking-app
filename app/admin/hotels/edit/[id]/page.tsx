import HotelForm from "@/components/hotel/hotel-form";
import { prisma } from "@/prisma";
import React from "react";

const EditHotleInfo = async ({ params }: { params: { id: string } }) => {
  const hotelId = params.id;
  const response = await prisma.hotel.findUnique({ where: { id: hotelId } });
  const hotel = JSON.parse(JSON.stringify(response))

  return (
    <div className="flex justify-center">
      <HotelForm title="Edit Hotel" type="edit" hotel={hotel} />
    </div>
  );
};

export default EditHotleInfo;
