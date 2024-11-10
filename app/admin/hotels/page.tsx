import HotelsList from "@/components/hotel/hotels-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/prisma";
import { Hotel } from "@/types";
import Link from "next/link";
import React from "react";

const HotelsPage = async () => {
  const response = await prisma.hotel.findMany();
  const hotels: Hotel[] = JSON.parse(JSON.stringify(response));
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h1>Hotels</h1>
        <Button variant={"outline"} asChild>
          <Link href={"/admin/hotels/add"}>Add Hotel</Link>
        </Button>
      </div>
      <Separator />
      {hotels.length>0 ? <HotelsList hotels={hotels} /> : <p>There is no hotels yet!. Add some!</p>}
    </div>
  );
};

export default HotelsPage;
