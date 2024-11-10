/*
  Warnings:

  - You are about to drop the column `hotelId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `hotelName` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Room` table. All the data in the column will be lost.
  - Added the required column `amentites` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentPerDay` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomNumber` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "hotelId",
DROP COLUMN "hotelName",
DROP COLUMN "price",
ADD COLUMN     "amentites" TEXT NOT NULL,
ADD COLUMN     "rentPerDay" TEXT NOT NULL,
ADD COLUMN     "roomNumber" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_name_fkey" FOREIGN KEY ("name") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
