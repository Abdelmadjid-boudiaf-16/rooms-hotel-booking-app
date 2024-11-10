import RoomsList from '@/components/room/rooms-list'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/prisma'
import { Hotel, Room } from '@/types'
import Link from 'next/link'
import React from 'react'

const RoomsPage = async () => {
  const response = await prisma.room.findMany({
    include: {hotel: true}
  })

  const rooms:(Room & { hotel: Hotel })[] = JSON.parse(JSON.stringify(response))
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h1>Rooms</h1>
        <Button  asChild>
          <Link href={"/admin/rooms/add"}>Add Room</Link>
        </Button>
      </div>
      <Separator />
      {rooms.length > 0 ? (
        <RoomsList rooms={rooms} />
      ) : (
        <p>There is no hotels yet!. Add some!</p>
      )}
    </div>
  );
}

export default RoomsPage