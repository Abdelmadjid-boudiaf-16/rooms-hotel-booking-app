import AvailabiltyCheckout from "@/components/room/availability-checkout";
import { formatAsDollar } from "@/components/format-to-usd";
import { prisma } from "@/prisma";
import { Hotel, Room } from "@/types";
import Image from "next/image";
import React from "react";

const BookRoom = async ({ params }: { params: { id: string } }) => {
  const response = await prisma.room.findUnique({
    where: { id: params.id },
    include: { hotel: true },
  });
  const room: Room & { hotel: Hotel } = JSON.parse(JSON.stringify(response));
  return (
    <div className="grid grid-cols-1 gap-y-8 lg:gap-x-8 lg:grid-cols-3">
      <div className="col-span-2 flex flex-col gap-8">
        <h1 className="text-4xl font-bold">
          {room.name} - {room.hotel.name}
        </h1>
        <p className="text-xl font-semibold text-primary/80">
          {room.hotel.location}
        </p>
        <ul className="flex flex-wrap justify-center gap-3 lg:justify-start">
          {room.images.map((image, index) => (
            <li
              key={index}
              className="h-56 w-[420px] overflow-hidden rounded-lg sm:w-96 md:w-80"
            >
              <Image
                src={image}
                alt={"room image"}
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-normal">
            <span className="text-lg font-semibold text-primary/80">
              Room Name
            </span>
            <span>{room.name}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-normal">
            <span className="text-lg font-semibold text-primary/80">
              Room Type
            </span>
            <span>{room.type}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-normal">
            <span className="text-lg font-semibold text-primary/80">
              Room Number
            </span>
            <span>{room.roomNumber}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-normal">
            <span className="text-lg font-semibold text-primary/80">
              rent per day{" "}
            </span>
            <span>{formatAsDollar(room.rentPerDay)}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-normal">
            <span className="text-lg font-semibold text-primary/80">
              Bedrooms{" "}
            </span>
            <span>{room.bedRooms}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-normal">
            <span className="text-lg font-semibold text-primary/80">
              Owner{" "}
            </span>
            <span>{room.hotel.owner}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-normal">
            <span className="text-lg font-semibold text-primary/80">
              Emial{" "}
            </span>
            <span>{room.hotel.email}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-normal">
            <span className="text-lg font-semibold text-primary/80">
              Phone Number{" "}
            </span>
            <span>{room.hotel.phone}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-lg font-semibold text-primary/80">
            Amenities
          </span>
          <ul className="flex flex-wrap items-center gap-3">
            {room.amenities.split(" ").map((amenitie, index) => (
              <li key={index} className="rounded-full bg-secondary px-8 py-2">
                {amenitie}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-span-1 flex flex-1 w-full">
        <AvailabiltyCheckout roomId={params.id} room={room} />
      </div>
    </div>
  );
};

export default BookRoom;
