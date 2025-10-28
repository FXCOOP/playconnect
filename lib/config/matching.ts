/**
 * Matching Algorithm Configuration
 * Tunable weights and parameters for the family matching system
 */

export interface MatchingWeights {
  interests: number;
  age: number;
  distance: number;
  availability: number;
  safety: number;
}

export interface MatchingConfig {
  weights: MatchingWeights;
  defaultRadiusKm: number;
  maxAgeDifferenceMonths: number;
  minOverallScore: number;
  cacheExpirationHours: number;
}

// Get config from environment variables with fallbacks
const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseFloat(value) : defaultValue;
};

export const MATCHING_CONFIG: MatchingConfig = {
  weights: {
    interests: getEnvNumber('MATCHING_WEIGHT_INTERESTS', 0.45),
    age: getEnvNumber('MATCHING_WEIGHT_AGE', 0.2),
    distance: getEnvNumber('MATCHING_WEIGHT_DISTANCE', 0.15),
    availability: getEnvNumber('MATCHING_WEIGHT_AVAILABILITY', 0.15),
    safety: getEnvNumber('MATCHING_WEIGHT_SAFETY', 0.05),
  },
  defaultRadiusKm: getEnvNumber('DEFAULT_MATCH_RADIUS_KM', 8),
  maxAgeDifferenceMonths: getEnvNumber('MAX_AGE_DIFFERENCE_MONTHS', 24),
  minOverallScore: getEnvNumber('MIN_OVERALL_SCORE', 30),
  cacheExpirationHours: 24,
};

// Validate weights sum to 1.0
const totalWeight = Object.values(MATCHING_CONFIG.weights).reduce((sum, w) => sum + w, 0);
if (Math.abs(totalWeight - 1.0) > 0.01) {
  console.warn(
    `⚠️  Matching weights sum to ${totalWeight.toFixed(2)}, not 1.0. Results may be skewed.`
  );
}

/**
 * Age band compatibility matrix
 * Defines which age bands can realistically play together
 */
export const AGE_BAND_COMPATIBILITY: Record<string, string[]> = {
  INFANT_0_12M: ['INFANT_0_12M', 'TODDLER_13_24M'],
  TODDLER_13_24M: ['INFANT_0_12M', 'TODDLER_13_24M', 'TODDLER_2_3Y'],
  TODDLER_2_3Y: ['TODDLER_13_24M', 'TODDLER_2_3Y', 'PRESCHOOL_4_5Y'],
  PRESCHOOL_4_5Y: ['TODDLER_2_3Y', 'PRESCHOOL_4_5Y', 'SCHOOL_AGE_6_8Y'],
  SCHOOL_AGE_6_8Y: ['PRESCHOOL_4_5Y', 'SCHOOL_AGE_6_8Y', 'SCHOOL_AGE_9_12Y'],
  SCHOOL_AGE_9_12Y: ['SCHOOL_AGE_6_8Y', 'SCHOOL_AGE_9_12Y', 'TEEN_13_PLUS'],
  TEEN_13_PLUS: ['SCHOOL_AGE_9_12Y', 'TEEN_13_PLUS'],
};

/**
 * Safety compatibility rules
 * Penalties for incompatible house rules
 */
export interface SafetyRules {
  hasPets: boolean;
  petTypes: string[];
  smokingHousehold: boolean;
  screenTimePolicy: string;
}

export const SAFETY_PENALTIES = {
  PET_ALLERGY_CONFLICT: 0.5, // 50% penalty if child allergic to pet present
  SMOKING_CONCERN: 0.3, // 30% penalty if one household smokes
  SCREEN_TIME_MISMATCH: 0.2, // 20% penalty for polar opposite policies
};
