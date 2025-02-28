/*
  Warnings:

  - Added the required column `SecondName` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstLastName` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondLastName` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "SecondName" TEXT NOT NULL,
ADD COLUMN     "dni" TEXT NOT NULL,
ADD COLUMN     "firstLastName" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "secondLastName" TEXT NOT NULL;
