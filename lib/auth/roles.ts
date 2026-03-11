export function canManageFeed(role?: string | null) {
  return role === "ADMIN" || role === "HR";
}

export function canCreateFeedPost(role?: string | null) {
  return canManageFeed(role);
}
