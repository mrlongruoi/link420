import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Get username/slug for a user (returns custom username or falls back to clerk ID)
export const getUserSlug = query({
  args: { userId: v.string() },
  returns: v.string(),
  handler: async ({ db }, args) => {
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    // Return custom username if exists, otherwise return clerk ID as fallback
    return usernameRecord?.username || args.userId;
  },
});

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  returns: v.object({ available: v.boolean(), error: v.optional(v.string()) }),
  handler: async ({ db }, args) => {
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(args.username)) {
      return {
        available: false,
        error:
          "Tên người dùng chỉ có thể chứa chữ cái, số, dấu gạch nối và dấu gạch dưới",
      };
    }
    if (args.username.length < 3 || args.username.length > 30) {
      return {
        available: false,
        error: "Tên người dùng phải từ 3 đến 30 ký tự",
      };
    }

    // Check if username already taken
    const existingUsername = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    return { available: !existingUsername };
  },
});

export const setUsername = mutation({
  args: { username: v.string() },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Chưa được xác thực");

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(args.username)) {
      return {
        success: false,
        error:
          "Tên người dùng chỉ có thể chứa chữ cái, số, dấu gạch nối và dấu gạch dưới",
      };
    }

    if (args.username.length < 3 || args.username.length > 30) {
      return {
        success: false,
        error: "Tên người dùng phải từ 3 đến 30 ký tự",
      };
    }
    // Check if username already taken
    const existingUsername = await db
      .query("usernames")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existingUsername && existingUsername.userId !== identity.subject) {
      return {
        success: false,
        error: "Tên người dùng đã được sử dụng",
      };
    }

    // check if user allready has a username record
    const currentRecord = await db
      .query("usernames")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (currentRecord) {
      //update existing record
      await db.patch(currentRecord._id, { username: args.username });
    } else {
      //create new record
      await db.insert("usernames", {
        userId: identity.subject,
        username: args.username,
      });
    }

    return { success: true };
  },
});

// Get user ID by username/slug (for public page routing)
export const getUserIdBySlug = query({
  args: { slug: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async ({ db }, args) => {
    // First try to find a custom username
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.slug))
      .unique();

    if (usernameRecord) {
      return usernameRecord.userId;
    }

    // If no custom username found, treat slug as potential clerk ID
    // We'll need to verify this user actually exists by checking if they have links
    const links = await db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", args.slug))
      .first();

    return links ? args.slug : null;
  },
});
