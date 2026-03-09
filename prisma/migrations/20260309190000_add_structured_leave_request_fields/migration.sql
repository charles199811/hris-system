CREATE TYPE "LeaveRequestType" AS ENUM (
    'PAID_VACATION_LEAVE',
    'SICK_LEAVE',
    'URGENT_LEAVE',
    'MATERNITY_LEAVE',
    'PATERNITY_LEAVE',
    'BEREAVEMENT_LEAVE',
    'UNPAID_LEAVE',
    'MENTAL_WELLNESS_DAY'
);

ALTER TABLE "Request"
ADD COLUMN     "leaveType" "LeaveRequestType",
ADD COLUMN     "managerEmployeeId" UUID;

CREATE INDEX "Request_leaveType_idx" ON "Request"("leaveType");
CREATE INDEX "Request_managerEmployeeId_idx" ON "Request"("managerEmployeeId");

ALTER TABLE "Request"
ADD CONSTRAINT "Request_managerEmployeeId_fkey"
FOREIGN KEY ("managerEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
