/*
  Warnings:

  - You are about to drop the column `LastNames` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `Names` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "LastNames",
DROP COLUMN "Names",
ADD COLUMN     "lastNames" TEXT,
ADD COLUMN     "names" TEXT;
