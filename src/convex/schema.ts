import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Lead status enum
export const LEAD_STATUS = {
  NEW: "new",
  RESEARCHING: "researching",
  CONTACTED: "contacted",
  RESPONDED: "responded",
  INTERESTED: "interested",
  CLIENT: "client",
  NOT_INTERESTED: "not_interested",
} as const;

export const leadStatusValidator = v.union(
  v.literal(LEAD_STATUS.NEW),
  v.literal(LEAD_STATUS.RESEARCHING),
  v.literal(LEAD_STATUS.CONTACTED),
  v.literal(LEAD_STATUS.RESPONDED),
  v.literal(LEAD_STATUS.INTERESTED),
  v.literal(LEAD_STATUS.CLIENT),
  v.literal(LEAD_STATUS.NOT_INTERESTED),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Saved leads — businesses the user has bookmarked for outreach
    leads: defineTable({
      userId: v.string(),
      businessName: v.string(),
      category: v.optional(v.string()),
      location: v.optional(v.string()),
      address: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      websiteStatus: v.string(), // "no_website" | "website_found"
      rating: v.optional(v.number()),
      reviewCount: v.optional(v.number()),
      leadScore: v.number(),
      scoreBreakdown: v.array(v.string()),
      placeId: v.optional(v.string()),
      status: leadStatusValidator,
      searchSource: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_status", ["userId", "status"])
      .index("by_placeId", ["placeId"]),

    // Search history — keeps track of previous searches for quick access
    searchHistory: defineTable({
      userId: v.string(),
      category: v.string(),
      location: v.string(),
      resultCount: v.number(),
      leadCount: v.number(),
      searchedAt: v.number(),
    }).index("by_user", ["userId", "searchedAt"]),

    // Comments on leads — team communication
    comments: defineTable({
      userId: v.string(),
      leadId: v.id("leads"),
      authorName: v.string(),
      text: v.string(),
      createdAt: v.number(),
    }).index("by_lead", ["leadId", "createdAt"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
