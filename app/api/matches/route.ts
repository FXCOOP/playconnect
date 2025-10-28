/**
 * Matches API Route
 * GET /api/matches?childId=xxx&limit=20&offset=0
 * Returns computed matches for a child
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/client';
import { findTopMatches } from '@/lib/services/scoring';
import { z } from 'zod';

const querySchema = z.object({
  childId: z.string().cuid(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate query params
    const searchParams = request.nextUrl.searchParams;
    const query = querySchema.safeParse({
      childId: searchParams.get('childId'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    });

    if (!query.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: query.error.flatten() },
        { status: 400 }
      );
    }

    const { childId, limit, offset } = query.data;

    // 3. Verify child belongs to user
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        household: true,
        interests: {
          include: {
            interest: true,
          },
        },
        availabilitySlots: true,
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    if (child.household.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Get candidate children (same city, within radius, age-compatible)
    // Note: maxRadiusKm could be used for H3 geohash filtering in production
    const candidates = await prisma.child.findMany({
      where: {
        id: {
          not: childId,
        },
        isActive: true,
        household: {
          city: child.household.city, // Simple city filter; use H3 for production
          isActive: true,
          user: {
            isActive: true,
            isBanned: false,
          },
        },
      },
      include: {
        household: true,
        interests: {
          include: {
            interest: true,
          },
        },
        availabilitySlots: true,
      },
      take: 100, // Limit candidates for performance
    });

    // 5. Compute matches
    const matches = await findTopMatches(child, candidates, limit + offset);

    // 6. Paginate
    const paginatedMatches = matches.slice(offset, offset + limit);

    // 7. Format response
    const formattedMatches = paginatedMatches.map((match) => ({
      id: match.matchedChildId,
      score: match.overallScore,
      explanation: match.explanation,
      sharedInterests: match.sharedInterests,
      distanceKm: match.distanceKm,
      availableMinutes: match.availableMinutes,
      breakdown: match.breakdown,
    }));

    return NextResponse.json({
      matches: formattedMatches,
      total: matches.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('GET /api/matches error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
