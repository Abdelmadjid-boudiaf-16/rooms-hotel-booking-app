/*
  Warnings:

  - You are about to drop the column `image` on the `Hotel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
