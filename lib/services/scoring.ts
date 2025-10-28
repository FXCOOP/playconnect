/**
 * Matching Algorithm
 * Computes weighted compatibility scores between children with explainability
 */

import { Child, Household, ChildInterest, AvailabilitySlot, Interest } from '@prisma/client';
import { MATCHING_CONFIG, AGE_BAND_COMPATIBILITY, SAFETY_PENALTIES } from '../config/matching';
import { calculateDistance, distanceToScore } from './geo';
import { calculateRecurringOverlap, overlapToScore } from './availability';

/**
 * Extended types for matching
 */
export type ChildWithRelations = Child & {
  household: Household;
  interests: (ChildInterest & { interest: Interest })[];
  availabilitySlots: AvailabilitySlot[];
};

export interface ScoreBreakdown {
  factor: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
  details: string;
}

export interface MatchResult {
  childId: string;
  matchedChildId: string;
  overallScore: number;
  breakdown: ScoreBreakdown[];
  explanation: string;
  sharedInterests: string[];
  distanceKm: number;
  availableMinutes: number;
}

/**
 * Main matching function
 * Computes compatibility score between two children
 */
export function computeMatch(
  child1: ChildWithRelations,
  child2: ChildWithRelations
): MatchResult {
  const breakdown: ScoreBreakdown[] = [];

  // 1. Interest Score (Jaccard similarity)
  const interestScore = calculateInterestScore(child1, child2);
  breakdown.push({
    factor: 'Shared Interests',
    weight: MATCHING_CONFIG.weights.interests,
    rawScore: interestScore.score,
    weightedScore: interestScore.score * MATCHING_CONFIG.weights.interests,
    details: interestScore.details,
  });

  // 2. Age Score (proximity with decay)
  const ageScore = calculateAgeScore(child1, child2);
  breakdown.push({
    factor: 'Age Compatibility',
    weight: MATCHING_CONFIG.weights.age,
    rawScore: ageScore.score,
    weightedScore: ageScore.score * MATCHING_CONFIG.weights.age,
    details: ageScore.details,
  });

  // 3. Distance Score (geographic proximity)
  const distanceScore = calculateDistanceScore(child1.household, child2.household);
  breakdown.push({
    factor: 'Distance',
    weight: MATCHING_CONFIG.weights.distance,
    rawScore: distanceScore.score,
    weightedScore: distanceScore.score * MATCHING_CONFIG.weights.distance,
    details: distanceScore.details,
  });

  // 4. Availability Score (time overlap)
  const availabilityScore = calculateAvailabilityScore(child1, child2);
  breakdown.push({
    factor: 'Availability Overlap',
    weight: MATCHING_CONFIG.weights.availability,
    rawScore: availabilityScore.score,
    weightedScore: availabilityScore.score * MATCHING_CONFIG.weights.availability,
    details: availabilityScore.details,
  });

  // 5. Safety Score (house rules compatibility)
  const safetyScore = calculateSafetyScore(child1, child2);
  breakdown.push({
    factor: 'Safety Compatibility',
    weight: MATCHING_CONFIG.weights.safety,
    rawScore: safetyScore.score,
    weightedScore: safetyScore.score * MATCHING_CONFIG.weights.safety,
    details: safetyScore.details,
  });

  // Overall score
  const overallScore = breakdown.reduce((sum, item) => sum + item.weightedScore, 0);

  // Generate human-readable explanation
  const explanation = generateExplanation(breakdown, child1.firstName, child2.firstName);

  return {
    childId: child1.id,
    matchedChildId: child2.id,
    overallScore: Math.round(overallScore),
    breakdown,
    explanation,
    sharedInterests: interestScore.sharedInterestIds,
    distanceKm: distanceScore.distanceKm,
    availableMinutes: availabilityScore.overlapMinutes,
  };
}

/**
 * 1. Interest Score - Jaccard Similarity
 */
function calculateInterestScore(child1: ChildWithRelations, child2: ChildWithRelations) {
  const interests1 = new Set(child1.interests.map((i) => i.interestId));
  const interests2 = new Set(child2.interests.map((i) => i.interestId));

  const intersection = new Set([...interests1].filter((i) => interests2.has(i)));
  const union = new Set([...interests1, ...interests2]);

  const jaccardSimilarity = union.size > 0 ? intersection.size / union.size : 0;
  const score = jaccardSimilarity * 100;

  const sharedInterestNames = child1.interests
    .filter((i) => interests2.has(i.interestId))
    .map((i) => i.interest.name);

  const details =
    intersection.size > 0
      ? `${intersection.size} shared interests: ${sharedInterestNames.join(', ')}`
      : 'No shared interests';

  return {
    score,
    details,
    sharedInterestIds: Array.from(intersection),
  };
}

/**
 * 2. Age Score - Proximity with exponential decay
 */
function calculateAgeScore(child1: Child, child2: Child) {
  const ageDiffMonths = Math.abs(child1.ageInMonths - child2.ageInMonths);

  // Check age band compatibility
  const isCompatible = AGE_BAND_COMPATIBILITY[child1.ageBand]?.includes(child2.ageBand) || false;

  if (!isCompatible) {
    return {
      score: 0,
      details: `Age bands not compatible (${ageDiffMonths} months apart)`,
    };
  }

  // Exponential decay: score = 100 * e^(-k * diff)
  const maxDiff = MATCHING_CONFIG.maxAgeDifferenceMonths;
  const k = -Math.log(0.1) / maxDiff;
  const score = 100 * Math.exp(-k * ageDiffMonths);

  const years = Math.floor(ageDiffMonths / 12);
  const months = ageDiffMonths % 12;
  const ageDesc = years > 0 ? `${years}y ${months}m` : `${months}m`;

  return {
    score: Math.max(0, Math.min(100, score)),
    details: `${ageDesc} age difference`,
  };
}

/**
 * 3. Distance Score - Geographic proximity
 */
function calculateDistanceScore(household1: Household, household2: Household) {
  if (!household1.latitude || !household1.longitude || !household2.latitude || !household2.longitude) {
    return {
      score: 0,
      details: 'Location not available',
      distanceKm: 0,
    };
  }

  const distanceKm = calculateDistance(
    household1.latitude,
    household1.longitude,
    household2.latitude,
    household2.longitude
  );

  const maxRadius = Math.max(household1.matchRadiusKm, household2.matchRadiusKm);
  const score = distanceToScore(distanceKm, maxRadius);

  return {
    score,
    details: `${distanceKm.toFixed(1)} km away`,
    distanceKm,
  };
}

/**
 * 4. Availability Score - Time overlap
 */
function calculateAvailabilityScore(child1: ChildWithRelations, child2: ChildWithRelations) {
  const overlapMinutes = calculateRecurringOverlap(
    child1.availabilitySlots,
    child2.availabilitySlots
  );

  const score = overlapToScore(overlapMinutes);

  const hours = Math.floor(overlapMinutes / 60);
  const mins = overlapMinutes % 60;
  const timeDesc = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return {
    score,
    details: `${timeDesc} overlapping availability per week`,
    overlapMinutes,
  };
}

/**
 * 5. Safety Score - House rules compatibility
 */
function calculateSafetyScore(child1: ChildWithRelations, child2: ChildWithRelations) {
  let score = 100;
  const issues: string[] = [];

  const household1 = child1.household;
  const household2 = child2.household;

  // Check pet allergies
  if (household1.hasPets && child2.allergies.some((a) => household1.petTypes.includes(a.toLowerCase()))) {
    score -= SAFETY_PENALTIES.PET_ALLERGY_CONFLICT * 100;
    issues.push('Pet allergy concern');
  }
  if (household2.hasPets && child1.allergies.some((a) => household2.petTypes.includes(a.toLowerCase()))) {
    score -= SAFETY_PENALTIES.PET_ALLERGY_CONFLICT * 100;
    issues.push('Pet allergy concern');
  }

  // Check smoking
  if (household1.smokingHousehold || household2.smokingHousehold) {
    score -= SAFETY_PENALTIES.SMOKING_CONCERN * 100;
    issues.push('Smoking household');
  }

  // Check screen time policy mismatch
  const policy1 = household1.screenTimePolicy || 'moderate';
  const policy2 = household2.screenTimePolicy || 'moderate';
  if (
    (policy1 === 'limited' && policy2 === 'unrestricted') ||
    (policy1 === 'unrestricted' && policy2 === 'limited')
  ) {
    score -= SAFETY_PENALTIES.SCREEN_TIME_MISMATCH * 100;
    issues.push('Different screen time policies');
  }

  const details = issues.length > 0 ? issues.join(', ') : 'No safety concerns';

  return {
    score: Math.max(0, score),
    details,
  };
}

/**
 * Generate human-readable explanation
 */
function generateExplanation(breakdown: ScoreBreakdown[], name1: string, name2: string): string {
  const topFactors = breakdown
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .slice(0, 3)
    .filter((b) => b.rawScore > 30);

  if (topFactors.length === 0) {
    return `${name1} and ${name2} don't have strong compatibility factors.`;
  }

  const reasons = topFactors.map((f) => {
    if (f.factor === 'Shared Interests') {
      return `they share interests (${f.details})`;
    } else if (f.factor === 'Age Compatibility') {
      return `they're close in age (${f.details})`;
    } else if (f.factor === 'Distance') {
      return `they live nearby (${f.details})`;
    } else if (f.factor === 'Availability Overlap') {
      return `they have overlapping availability (${f.details})`;
    } else {
      return f.details;
    }
  });

  const conjunction = reasons.length > 1 ? ', and ' : '';
  const reasonsText =
    reasons.slice(0, -1).join(', ') + (reasons.length > 1 ? conjunction : '') + reasons.slice(-1);

  return `Great match because ${reasonsText}.`;
}

/**
 * Batch matching: find top N matches for a child
 */
export async function findTopMatches(
  child: ChildWithRelations,
  candidates: ChildWithRelations[],
  limit: number = 20
): Promise<MatchResult[]> {
  const matches = candidates
    .filter((c) => c.id !== child.id) // Exclude self
    .map((candidate) => computeMatch(child, candidate))
    .filter((match) => match.overallScore >= MATCHING_CONFIG.minOverallScore)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);

  return matches;
}
