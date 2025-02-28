/*
  Warnings:

  - You are about to drop the column `SecondName` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `firstLastName` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `secondLastName` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailPersonal]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "SecondName",
DROP COLUMN "firstLastName",
DROP COLUMN "firstName",
DROP COLUMN "secondLastName",
ADD COLUMN     "LastNames" TEXT,
ADD COLUMN     "Names" TEXT,
ADD COLUMN     "emailPersonal" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_emailPersonal_key" ON "UserProfile"("emailPersonal");
