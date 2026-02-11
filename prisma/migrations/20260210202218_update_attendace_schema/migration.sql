/*
  Warnings:

  - You are about to drop the column `minutesLate` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `overtimeMin` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "AttendanceStatus" ADD VALUE 'PUBLIC_HOLIDAY';

-- DropIndex
DROP INDEX "Attendance_userId_date_idx";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "minutesLate",
DROP COLUMN "overtimeMin",
ADD COLUMN     "workMinutes" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE INDEX "Attendance_userId_idx" ON "Attendance"("userId");
