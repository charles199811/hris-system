-- DropForeignKey (safe)
ALTER TABLE "Employee" DROP CONSTRAINT IF EXISTS "Employee_userId_fkey";

-- Convert Employee.userId to uuid (this is the key fix)
ALTER TABLE "Employee"
  ALTER COLUMN "userId" TYPE uuid
  USING "userId"::uuid;

-- Recreate FK
ALTER TABLE "Employee"
  ADD CONSTRAINT "Employee_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
