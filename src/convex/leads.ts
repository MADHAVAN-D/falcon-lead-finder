import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { leadStatusValidator } from "./schema";

/**
 * Save a new lead. Requires authentication.
 */
export const saveLead = mutation({
  args: {
    businessName: v.string(),
    category: v.optional(v.string()),
    location: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    websiteStatus: v.string(),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    leadScore: v.number(),
    scoreBreakdown: v.array(v.string()),
    placeId: v.optional(v.string()),
    searchSource: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in to save leads.");
    }

    const now = Date.now();

    // Check if already saved (by placeId)
    if (args.placeId) {
      const existing = await ctx.db
        .query("leads")
        .withIndex("by_placeId", (q) => q.eq("placeId", args.placeId!))
        .first();

      if (existing && existing.userId === userId) {
        return existing._id;
      }
    }

    const leadId = await ctx.db.insert("leads", {
      userId,
      businessName: args.businessName,
      category: args.category,
      location: args.location,
      address: args.address,
      phone: args.phone,
      website: args.website,
      websiteStatus: args.websiteStatus,
      rating: args.rating,
      reviewCount: args.reviewCount,
      leadScore: args.leadScore,
      scoreBreakdown: args.scoreBreakdown,
      placeId: args.placeId,
      status: "new",
      searchSource: args.searchSource,
      createdAt: now,
      updatedAt: now,
    });

    return leadId;
  },
});

/**
 * Update a lead's status.
 */
export const updateLeadStatus = mutation({
  args: {
    leadId: v.id("leads"),
    status: leadStatusValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in.");
    }

    const lead = await ctx.db.get(args.leadId);
    if (!lead || lead.userId !== userId) {
      throw new Error("Lead not found or not authorized.");
    }

    await ctx.db.patch(args.leadId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.leadId;
  },
});

/**
 * Delete a saved lead.
 */
export const deleteLead = mutation({
  args: {
    leadId: v.id("leads"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in.");
    }

    const lead = await ctx.db.get(args.leadId);
    if (!lead || lead.userId !== userId) {
      throw new Error("Lead not found or not authorized.");
    }

    await ctx.db.delete(args.leadId);
    return args.leadId;
  },
});

/**
 * Get all saved leads for the current user, optionally filtered by status.
 */
export const getLeads = query({
  args: {
    status: v.optional(leadStatusValidator),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    if (args.status) {
      const leads = await ctx.db
        .query("leads")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", userId).eq("status", args.status!),
        )
        .order("desc")
        .collect();
      return leads;
    }

    const leads = await ctx.db
      .query("leads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return leads;
  },
});

/**
 * Check if a business (by placeId) is already saved by the current user.
 */
export const isLeadSaved = query({
  args: {
    placeId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const existing = await ctx.db
      .query("leads")
      .withIndex("by_placeId", (q) => q.eq("placeId", args.placeId))
      .first();

    return existing !== null && existing.userId === userId;
  },
});

/**
 * Get count of saved leads by status for the current user.
 */
export const getLeadCounts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { total: 0, new: 0, researching: 0, contacted: 0, responded: 0, interested: 0, client: 0, not_interested: 0 };
    }

    const allLeads = await ctx.db
      .query("leads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const counts = {
      total: allLeads.length,
      new: 0,
      researching: 0,
      contacted: 0,
      responded: 0,
      interested: 0,
      client: 0,
      not_interested: 0,
    };

    for (const lead of allLeads) {
      counts[lead.status]++;
    }

    return counts;
  },
});

/**
 * Add a comment to a lead.
 */
export const addComment = mutation({
  args: {
    leadId: v.id("leads"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in.");
    }

    const lead = await ctx.db.get(args.leadId);
    if (!lead || lead.userId !== userId) {
      throw new Error("Lead not found or not authorized.");
    }

    const userDoc = await ctx.db.query("users").filter(q => q.eq("_id", userId as any)).first();
    const authorName = (userDoc && "name" in userDoc ? (userDoc as any).name : null) || (userDoc && "email" in userDoc ? (userDoc as any).email : null) || "Team Member";

    const commentId = await ctx.db.insert("comments", {
      userId,
      leadId: args.leadId,
      authorName,
      text: args.text,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

/**
 * Get all comments for a lead.
 */
export const getComments = query({
  args: {
    leadId: v.id("leads"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .order("asc")
      .collect();
    return comments;
  },
});

/**
 * Delete a comment.
 */
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in.");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.userId !== userId) {
      throw new Error("Comment not found or not authorized.");
    }

    await ctx.db.delete(args.commentId);
    return args.commentId;
  },
});
