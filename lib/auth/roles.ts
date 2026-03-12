export function canManageAttendance(role?: string | null) {
  return role === "ADMIN" || role === "HR";
}

export function canManageFeed(role?: string | null) {
  return canManageAttendance(role);
}

export function canCreateFeedPost(role?: string | null) {
  return canManageFeed(role);
}
