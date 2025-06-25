import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  usernames: defineTable({
    userId: v.string(), //clerk user id
    username: v.string(), //custom username (must be unique)
  })
    .index("by_user_id", ["userId"])
    .index("by_username", ["username"]),

  userCustomizations: defineTable({
    userId: v.string(), //clerk user id
    profilePictureStorageId: v.optional(v.id("_storage")), //convex storage id for profile picture
    description: v.optional(v.string()), // custom description
    accentColor: v.optional(v.string()), //hex color for accent (e.g., "$6366f1")
  }).index("by_user_id", ["userId"]),
});
