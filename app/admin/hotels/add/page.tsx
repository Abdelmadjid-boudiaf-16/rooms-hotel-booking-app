import HotelForm from "@/components/hotel/hotel-form";
import React from "react";

const AddHotel = () => {
  return (
    <div className="flex justify-center">
      <HotelForm title="Add Hotel" type="add" />
    </div>
  );
};

export default AddHotel;
