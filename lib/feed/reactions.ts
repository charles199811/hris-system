export const FEED_REACTION_TYPES = [
  "LIKE",
  "DISLIKE",
  "HEART",
  "HAHA",
  "SMILE",
] as const;

export type FeedReactionType = (typeof FEED_REACTION_TYPES)[number];

export const FEED_REACTIONS: Record<
  FeedReactionType,
  { emoji: string; label: string }
> = {
  LIKE: { emoji: "👍", label: "Like" },
  DISLIKE: { emoji: "👎", label: "Dislike" },
  HEART: { emoji: "❤️", label: "Heart" },
  HAHA: { emoji: "😂", label: "Ha ha" },
  SMILE: { emoji: "😊", label: "Smile" },
};
