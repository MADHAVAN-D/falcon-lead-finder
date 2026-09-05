import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Record a search for history tracking.
 */
export const recordSearch = mutation({
  args: {
    category: v.string(),
    location: v.string(),
    resultCount: v.number(),
    leadCount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return; // Don't fail for unauthenticated users

    await ctx.db.insert("searchHistory", {
      userId,
      category: args.category,
      location: args.location,
      resultCount: args.resultCount,
      leadCount: args.leadCount,
      searchedAt: Date.now(),
    });
  },
});

/**
 * Get recent search history for the current user.
 */
export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const history = await ctx.db
      .query("searchHistory")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);

    return history;
  },
});
