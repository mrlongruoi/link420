import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// Get customizations by slug (for public pages)
export const getCustomizationsBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("userCustomizations"),
      _creationTime: v.number(),
      userId: v.string(),
      profilePictureStorageId: v.optional(v.id("_storage")),
      profilePictureUrl: v.optional(v.string()), // Computed field for the actual URL
      description: v.optional(v.string()),
      accentColor: v.optional(v.string()),
    }),
  ),
  handler: async ({ db, storage }, args) => {
    // First try to find a custom username
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.slug))
      .unique();

    let userId: string;
    if (usernameRecord) {
      userId = usernameRecord.userId;
    } else {
      // Treat slug as potential clerk ID
      userId = args.slug;
    }

    const customizations = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (!customizations) return null;

    // Get the profile picture URL if storage ID exists
    let profilePictureUrl: string | undefined;
    if (customizations.profilePictureStorageId) {
      const url = await storage.getUrl(customizations.profilePictureStorageId);
      profilePictureUrl = url || undefined;
    }

    return {
        ...customizations,
        profilePictureUrl
    }
  },
});
