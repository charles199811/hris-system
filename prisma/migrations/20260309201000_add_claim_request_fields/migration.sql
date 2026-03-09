CREATE TYPE "ClaimPurpose" AS ENUM (
    'TEAM_MEAL_OR_COFFEE',
    'EMPLOYEE_ENGAGEMENT_WINNER',
    'BEST_EMPLOYEE_RECOGNITION',
    'BIRTHDAY_VOUCHER',
    'TRANSPORT',
    'OFFICE_SUPPLIES',
    'TRAINING_CERTIFICATION_COURSES',
    'OTHER'
);

CREATE TYPE "RequestAttachmentType" AS ENUM (
    'GENERAL',
    'MANAGER_APPROVAL',
    'CLAIM_RECEIPT'
);

ALTER TABLE "Request"
ADD COLUMN     "claimPurpose" "ClaimPurpose",
ADD COLUMN     "claimPurposeOther" TEXT,
ADD COLUMN     "expenseDate" TIMESTAMP(3),
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "ibanSwift" TEXT;

ALTER TABLE "Attachment"
ADD COLUMN     "attachmentType" "RequestAttachmentType" NOT NULL DEFAULT 'GENERAL';

CREATE INDEX "Request_claimPurpose_idx" ON "Request"("claimPurpose");
