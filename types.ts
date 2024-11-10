import { Session, Account, User } from "@prisma/client";
import type {
  Hotel as PrismaHotel,
  Room as PrismaRoom,
  Booking as PrismaBooking,
} from "@prisma/client";

export type MySession = Session;
export type MyAccount = Account;
export type MyUser = User;
export type Hotel = PrismaHotel;
export type Room = PrismaRoom;
export type Booking = PrismaBooking;
