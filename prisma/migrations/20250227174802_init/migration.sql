/*
  Warnings:

  - The `status` column on the `Enrollment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `durationMonths` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PENDIENTE', 'VENCIDA');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "durationMonths",
ADD COLUMN     "durationMonths" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "status",
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'PENDIENTE';
