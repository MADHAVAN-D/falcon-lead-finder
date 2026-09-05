import type { BusinessResult, ScoreReason, LeadWithScore } from "../types/leads";

/**
 * Calculate a transparent potential lead score for a business.
 *
 * Scoring rules (Phase 1 — deterministic):
 *   No website listed        +40
 *   Rating ≥ 4.0             +20
 *   100+ reviews             +15
 *   50+ reviews              +10
 *   Phone available          +10
 *   Relevant category match  +5
 *
 * Capped at 100.
 */
export function calculateLeadScore(
  business: BusinessResult,
  targetCategory?: string,
): { score: number; reasons: ScoreReason[] } {
  const reasons: ScoreReason[] = [];
  let score = 0;

  // No website listed — strongest signal
  if (business.websiteStatus === "no_website") {
    reasons.push({ label: "No website listed", points: 40, met: true });
    score += 40;
  } else {
    reasons.push({ label: "No website listed", points: 40, met: false });
  }

  // Rating ≥ 4.0
  if (business.rating !== undefined && business.rating >= 4.0) {
    reasons.push({ label: `${business.rating} rating`, points: 20, met: true });
    score += 20;
  } else {
    reasons.push({ label: "Rating ≥ 4.0", points: 20, met: false });
  }

  // 100+ reviews
  if (business.reviewCount !== undefined && business.reviewCount >= 100) {
    reasons.push({
      label: `${business.reviewCount} reviews`,
      points: 15,
      met: true,
    });
    score += 15;
  } else if (
    business.reviewCount !== undefined &&
    business.reviewCount >= 50
  ) {
    // 50+ reviews
    reasons.push({
      label: `${business.reviewCount} reviews`,
      points: 10,
      met: true,
    });
    score += 10;
    reasons.push({ label: "100+ reviews", points: 15, met: false });
  } else {
    reasons.push({ label: "50+ reviews", points: 10, met: false });
    reasons.push({ label: "100+ reviews", points: 15, met: false });
  }

  // Phone available
  if (business.phone) {
    reasons.push({ label: "Phone available", points: 10, met: true });
    score += 10;
  } else {
    reasons.push({ label: "Phone available", points: 10, met: false });
  }

  // Relevant category match
  if (
    targetCategory &&
    business.category &&
    business.category.toLowerCase().includes(targetCategory.toLowerCase())
  ) {
    reasons.push({ label: "Relevant category", points: 5, met: true });
    score += 5;
  } else {
    reasons.push({ label: "Relevant category", points: 5, met: false });
  }

  // Cap at 100
  score = Math.min(score, 100);

  return { score, reasons };
}

/**
 * Add lead score to a business result.
 */
export function scoreBusiness(
  business: BusinessResult,
  targetCategory?: string,
): LeadWithScore {
  const { score, reasons } = calculateLeadScore(business, targetCategory);
  return {
    ...business,
    leadScore: score,
    scoreBreakdown: reasons,
  };
}
