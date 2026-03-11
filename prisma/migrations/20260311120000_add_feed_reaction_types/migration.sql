CREATE TYPE "FeedReactionType" AS ENUM ('LIKE', 'DISLIKE', 'HEART', 'HAHA', 'SMILE');

ALTER TABLE "FeedReaction"
ADD COLUMN "type" "FeedReactionType" NOT NULL DEFAULT 'LIKE';
