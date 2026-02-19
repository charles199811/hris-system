/*
  Warnings:

  - You are about to drop the column `notes` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `workMinutes` on the `Attendance` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('OFFICE', 'REMOTE');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "notes",
DROP COLUMN "workMinutes",
ADD COLUMN     "workMode" "WorkMode" NOT NULL DEFAULT 'OFFICE',
ADD COLUMN     "workingHours" DECIMAL(6,2),
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "isActive" SET DEFAULT false;
