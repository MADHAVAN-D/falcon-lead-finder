"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { searchBusinesses as searchPlacesApi } from "../lib/business-api/places";
import { scoreBusiness } from "../lib/scoring";
import type { LeadWithScore, SearchResult } from "../types/leads";

/**
 * Search for businesses and calculate lead scores.
 * Runs server-side to keep API keys secure.
 */
export const search = action({
  args: {
    category: v.string(),
    location: v.string(),
  },
  handler: async (_ctx, args): Promise<SearchResult> => {
    const { category, location } = args;

    // Validate inputs
    if (!category.trim() || !location.trim()) {
      throw new Error("Both category and location are required.");
    }

    if (category.length > 100 || location.length > 100) {
      throw new Error("Search parameters are too long.");
    }

    // Call the business API
    const { businesses, isDemoMode } = await searchPlacesApi(
      category.trim(),
      location.trim(),
    );

    // Calculate lead scores for each business
    const scored: LeadWithScore[] = businesses.map((b) =>
      scoreBusiness(b, category),
    );

    // Sort by lead score (highest first)
    scored.sort((a, b) => b.leadScore - a.leadScore);

    const leadCount = scored.filter(
      (b) => b.websiteStatus === "no_website",
    ).length;

    return {
      businesses: scored,
      totalCount: scored.length,
      leadCount,
      isDemoMode,
      searchedAt: Date.now(),
    };
  },
});
