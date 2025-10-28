/**
 * Unit Tests: Matching Algorithm
 * Tests for the scoring.ts service
 */

import { describe, it, expect } from 'vitest';
import { computeMatch, findTopMatches } from '@/lib/services/scoring';
import { AgeBand } from '@prisma/client';
import type { ChildWithRelations } from '@/lib/services/scoring';

// Test fixtures
const createMockChild = (overrides: Partial<ChildWithRelations> = {}): ChildWithRelations => ({
  id: 'child-1',
  householdId: 'household-1',
  firstName: 'Alice',
  birthYear: 2019,
  birthMonth: 6,
  ageInMonths: 54,
  ageBand: AgeBand.PRESCHOOL_4_5Y,
  pronouns: 'she/her',
  photoUrl: null,
  photoBlurred: true,
  allergies: [],
  dietaryNeeds: null,
  neurodiversity: null,
  accessibilityNeeds: null,
  bio: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  household: {
    id: 'household-1',
    userId: 'user-1',
    addressLine1: null,
    addressLine2: null,
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    postalCode: '94102',
    latitude: 37.7749,
    longitude: -122.4194,
    h3Index: '872830828ffffff',
    matchRadiusKm: 8,
    languages: ['en'],
    preferredContact: 'email',
    hasPets: false,
    petTypes: [],
    smokingHousehold: false,
    screenTimePolicy: 'moderate',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  interests: [],
  availabilitySlots: [],
  ...overrides,
});

describe('Matching Algorithm - computeMatch', () => {
  it('should compute high score for very similar children', () => {
    const child1 = createMockChild({
      id: 'child-1',
      interests: [
        {
          id: '1',
          childId: 'child-1',
          interestId: 'lego',
          interest: { id: 'lego', name: 'Lego', slug: 'lego', category: 'STEM', description: null, iconName: 'Blocks', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'intermediate',
          notes: null,
          createdAt: new Date(),
        },
        {
          id: '2',
          childId: 'child-1',
          interestId: 'soccer',
          interest: { id: 'soccer', name: 'Soccer', slug: 'soccer', category: 'SPORTS', description: null, iconName: 'Trophy', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'beginner',
          notes: null,
          createdAt: new Date(),
        },
      ],
      availabilitySlots: [
        {
          id: '1',
          childId: 'child-1',
          type: 'RECURRING',
          dayOfWeek: 'SATURDAY',
          startTime: '09:00',
          endTime: '12:00',
          startDateTime: null,
          endDateTime: null,
          notes: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const child2 = createMockChild({
      id: 'child-2',
      firstName: 'Bob',
      ageInMonths: 56, // 2 months older
      household: {
        ...child1.household,
        id: 'household-2',
        userId: 'user-2',
        latitude: 37.7699,
        longitude: -122.4169, // ~1.5 km away
      },
      interests: [
        {
          id: '3',
          childId: 'child-2',
          interestId: 'lego',
          interest: { id: 'lego', name: 'Lego', slug: 'lego', category: 'STEM', description: null, iconName: 'Blocks', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'advanced',
          notes: null,
          createdAt: new Date(),
        },
        {
          id: '4',
          childId: 'child-2',
          interestId: 'soccer',
          interest: { id: 'soccer', name: 'Soccer', slug: 'soccer', category: 'SPORTS', description: null, iconName: 'Trophy', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'intermediate',
          notes: null,
          createdAt: new Date(),
        },
      ],
      availabilitySlots: [
        {
          id: '2',
          childId: 'child-2',
          type: 'RECURRING',
          dayOfWeek: 'SATURDAY',
          startTime: '09:00',
          endTime: '11:00',
          startDateTime: null,
          endDateTime: null,
          notes: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const result = computeMatch(child1, child2);

    expect(result.overallScore).toBeGreaterThan(70);
    expect(result.sharedInterests).toHaveLength(2);
    expect(result.breakdown).toHaveLength(5);
    expect(result.explanation).toContain('share interests');
  });

  it('should compute low score for incompatible age bands', () => {
    const infant = createMockChild({
      ageInMonths: 10,
      ageBand: AgeBand.INFANT_0_12M,
    });

    const schoolAge = createMockChild({
      id: 'child-2',
      ageInMonths: 96,
      ageBand: AgeBand.SCHOOL_AGE_6_8Y,
    });

    const result = computeMatch(infant, schoolAge);

    const ageBreakdown = result.breakdown.find((b) => b.factor === 'Age Compatibility');
    expect(ageBreakdown?.rawScore).toBe(0);
    expect(result.overallScore).toBeLessThan(50);
  });

  it('should penalize for pet allergies', () => {
    const childWithAllergy = createMockChild({
      allergies: ['dog', 'cat'],
    });

    const childWithPets = createMockChild({
      id: 'child-2',
      household: {
        ...childWithAllergy.household,
        id: 'household-2',
        hasPets: true,
        petTypes: ['dog'],
      },
    });

    const result = computeMatch(childWithAllergy, childWithPets);

    const safetyBreakdown = result.breakdown.find((b) => b.factor === 'Safety Compatibility');
    expect(safetyBreakdown?.rawScore).toBeLessThan(100);
    expect(safetyBreakdown?.details).toContain('Pet allergy concern');
  });

  it('should score higher for closer geographic proximity', () => {
    const child1 = createMockChild();

    const nearbyChild = createMockChild({
      id: 'child-2',
      household: {
        ...child1.household,
        id: 'household-2',
        latitude: 37.7749,
        longitude: -122.4150, // ~0.4 km away
      },
    });

    const farChild = createMockChild({
      id: 'child-3',
      household: {
        ...child1.household,
        id: 'household-3',
        latitude: 37.8000,
        longitude: -122.5000, // ~8 km away
      },
    });

    const nearMatch = computeMatch(child1, nearbyChild);
    const farMatch = computeMatch(child1, farChild);

    const nearDistance = nearMatch.breakdown.find((b) => b.factor === 'Distance')!;
    const farDistance = farMatch.breakdown.find((b) => b.factor === 'Distance')!;

    expect(nearDistance.rawScore).toBeGreaterThan(farDistance.rawScore);
  });

  it('should calculate Jaccard similarity correctly', () => {
    const child1 = createMockChild({
      interests: [
        {
          id: '1',
          childId: 'child-1',
          interestId: 'lego',
          interest: { id: 'lego', name: 'Lego', slug: 'lego', category: 'STEM', description: null, iconName: 'Blocks', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'intermediate',
          notes: null,
          createdAt: new Date(),
        },
        {
          id: '2',
          childId: 'child-1',
          interestId: 'soccer',
          interest: { id: 'soccer', name: 'Soccer', slug: 'soccer', category: 'SPORTS', description: null, iconName: 'Trophy', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'beginner',
          notes: null,
          createdAt: new Date(),
        },
        {
          id: '3',
          childId: 'child-1',
          interestId: 'reading',
          interest: { id: 'reading', name: 'Reading', slug: 'reading', category: 'READING', description: null, iconName: 'Book', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'intermediate',
          notes: null,
          createdAt: new Date(),
        },
      ],
    });

    const child2 = createMockChild({
      id: 'child-2',
      interests: [
        {
          id: '4',
          childId: 'child-2',
          interestId: 'lego',
          interest: { id: 'lego', name: 'Lego', slug: 'lego', category: 'STEM', description: null, iconName: 'Blocks', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'advanced',
          notes: null,
          createdAt: new Date(),
        },
        {
          id: '5',
          childId: 'child-2',
          interestId: 'painting',
          interest: { id: 'painting', name: 'Painting', slug: 'painting', category: 'ARTS', description: null, iconName: 'Palette', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'beginner',
          notes: null,
          createdAt: new Date(),
        },
      ],
    });

    const result = computeMatch(child1, child2);

    // Jaccard: intersection(1) / union(4) = 0.25
    // Score = 25
    const interestBreakdown = result.breakdown.find((b) => b.factor === 'Shared Interests')!;
    expect(interestBreakdown.rawScore).toBeCloseTo(25, 0);
    expect(result.sharedInterests).toHaveLength(1);
  });

  it('should generate meaningful explanations', () => {
    const child1 = createMockChild({
      firstName: 'Emma',
      interests: [
        {
          id: '1',
          childId: 'child-1',
          interestId: 'dance',
          interest: { id: 'dance', name: 'Dance', slug: 'dance', category: 'SPORTS', description: null, iconName: 'Music', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'intermediate',
          notes: null,
          createdAt: new Date(),
        },
      ],
    });

    const child2 = createMockChild({
      id: 'child-2',
      firstName: 'Olivia',
      interests: [
        {
          id: '2',
          childId: 'child-2',
          interestId: 'dance',
          interest: { id: 'dance', name: 'Dance', slug: 'dance', category: 'SPORTS', description: null, iconName: 'Music', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'beginner',
          notes: null,
          createdAt: new Date(),
        },
      ],
    });

    const result = computeMatch(child1, child2);

    expect(result.explanation).toContain('Emma');
    expect(result.explanation).toContain('Olivia');
    expect(result.explanation.toLowerCase()).toMatch(/share|interest|age|nearby|availability/);
  });
});

describe('Matching Algorithm - findTopMatches', () => {
  it('should return top N matches sorted by score', async () => {
    const targetChild = createMockChild({
      firstName: 'Target',
      interests: [
        {
          id: '1',
          childId: 'target',
          interestId: 'lego',
          interest: { id: 'lego', name: 'Lego', slug: 'lego', category: 'STEM', description: null, iconName: 'Blocks', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'intermediate',
          notes: null,
          createdAt: new Date(),
        },
      ],
    });

    const candidates = [
      createMockChild({
        id: 'child-1',
        firstName: 'High Match',
        interests: [
          {
            id: '2',
            childId: 'child-1',
            interestId: 'lego',
            interest: { id: 'lego', name: 'Lego', slug: 'lego', category: 'STEM', description: null, iconName: 'Blocks', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
            level: 'advanced',
            notes: null,
            createdAt: new Date(),
          },
        ],
      }),
      createMockChild({
        id: 'child-2',
        firstName: 'Low Match',
        interests: [],
        ageInMonths: 120, // Much older
        ageBand: AgeBand.SCHOOL_AGE_9_12Y,
      }),
      createMockChild({
        id: 'child-3',
        firstName: 'Medium Match',
        interests: [
          {
            id: '3',
            childId: 'child-3',
            interestId: 'soccer',
            interest: { id: 'soccer', name: 'Soccer', slug: 'soccer', category: 'SPORTS', description: null, iconName: 'Trophy', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
            level: 'beginner',
            notes: null,
            createdAt: new Date(),
          },
        ],
      }),
    ];

    const matches = await findTopMatches(targetChild, candidates, 3);

    expect(matches).toHaveLength(3);
    expect(matches[0].overallScore).toBeGreaterThanOrEqual(matches[1].overallScore);
    expect(matches[1].overallScore).toBeGreaterThanOrEqual(matches[2].overallScore);
    expect(matches[0].matchedChildId).toBe('child-1');
  });

  it('should exclude self from matches', async () => {
    const child = createMockChild({ id: 'me' });
    const candidates = [child, createMockChild({ id: 'other' })];

    const matches = await findTopMatches(child, candidates, 10);

    expect(matches.every((m) => m.matchedChildId !== 'me')).toBe(true);
  });

  it('should filter out matches below minimum score', async () => {
    const child1 = createMockChild({
      interests: [
        {
          id: '1',
          childId: 'child-1',
          interestId: 'lego',
          interest: { id: 'lego', name: 'Lego', slug: 'lego', category: 'STEM', description: null, iconName: 'Blocks', isApproved: true, isCustom: false, createdBy: null, createdAt: new Date() },
          level: 'intermediate',
          notes: null,
          createdAt: new Date(),
        },
      ],
    });

    const veryPoorMatch = createMockChild({
      id: 'poor',
      interests: [],
      ageInMonths: 156,
      ageBand: AgeBand.TEEN_13_PLUS,
      household: {
        ...child1.household,
        id: 'household-poor',
        latitude: 37.9000,
        longitude: -122.6000, // Far away
      },
    });

    const matches = await findTopMatches(child1, [veryPoorMatch], 10);

    // Should be filtered out if below minOverallScore (default 30)
    expect(matches.every((m) => m.overallScore >= 30)).toBe(true);
  });
});
