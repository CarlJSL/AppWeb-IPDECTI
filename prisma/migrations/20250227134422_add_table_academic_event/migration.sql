/*
  Warnings:

  - Added the required column `academicEventId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMonths` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "academicEventId" TEXT NOT NULL,
ADD COLUMN     "durationMonths" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AcademicEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "evaluation" TEXT NOT NULL,

    CONSTRAINT "AcademicEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicEvent_name_key" ON "AcademicEvent"("name");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_academicEventId_fkey" FOREIGN KEY ("academicEventId") REFERENCES "AcademicEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
