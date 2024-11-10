/*
  Warnings:

  - You are about to drop the column `amentites` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `hotelId` on the `Room` table. All the data in the column will be lost.
  - Added the required column `amenities` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelName` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_hotelId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "amentites",
DROP COLUMN "hotelId",
ADD COLUMN     "amenities" TEXT NOT NULL,
ADD COLUMN     "hotelName" TEXT NOT NULL;
