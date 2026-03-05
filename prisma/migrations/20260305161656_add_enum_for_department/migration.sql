/*
  Warnings:

  - A unique constraint covering the columns `[departmentName]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `departmentName` on the `Department` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `departmentId` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DepartmentName" AS ENUM ('ADMINISTRATION', 'HR', 'FINANCE', 'ENGINEERING', 'OPERATIONS', 'SALES', 'MARKETING', 'CUSTOMER_SUPPORT');

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_departmentId_fkey";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "departmentName",
ADD COLUMN     "departmentName" "DepartmentName" NOT NULL,
ALTER COLUMN "empCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "departmentId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_departmentName_key" ON "Department"("departmentName");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
