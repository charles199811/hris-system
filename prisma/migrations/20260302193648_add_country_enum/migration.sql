/*
  Warnings:

  - The `gender` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `country` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('UNITED_KINGDOM', 'PAKISTAN', 'MALAYSIA', 'INDIA', 'SRI_LANKA', 'BANGLADESH', 'USA', 'CANADA', 'AUSTRALIA');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender",
ALTER COLUMN "address" SET DATA TYPE JSONB,
DROP COLUMN "country",
ADD COLUMN     "country" "Country";
