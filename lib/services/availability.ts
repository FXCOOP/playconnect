/**
 * Availability Services
 * Calculate overlapping time slots between children's availability
 */

import { DayOfWeek, SlotType, AvailabilitySlot } from '@prisma/client';
import { addDays, startOfWeek, isWithinInterval } from 'date-fns';

/**
 * Calculate minutes of overlap per week for recurring slots
 */
export function calculateRecurringOverlap(
  slots1: AvailabilitySlot[],
  slots2: AvailabilitySlot[]
): number {
  const recurring1 = slots1.filter((s) => s.type === SlotType.RECURRING);
  const recurring2 = slots2.filter((s) => s.type === SlotType.RECURRING);

  let totalOverlapMinutes = 0;

  for (const slot1 of recurring1) {
    for (const slot2 of recurring2) {
      // Same day of week?
      if (slot1.dayOfWeek === slot2.dayOfWeek) {
        const overlap = calculateTimeOverlap(
          slot1.startTime!,
          slot1.endTime!,
          slot2.startTime!,
          slot2.endTime!
        );
        totalOverlapMinutes += overlap;
      }
    }
  }

  return totalOverlapMinutes;
}

/**
 * Calculate overlap between two time ranges (HH:MM format)
 * Returns minutes of overlap
 */
function calculateTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): number {
  const [h1Start, m1Start] = start1.split(':').map(Number);
  const [h1End, m1End] = end1.split(':').map(Number);
  const [h2Start, m2Start] = start2.split(':').map(Number);
  const [h2End, m2End] = end2.split(':').map(Number);

  const minutes1Start = h1Start * 60 + m1Start;
  const minutes1End = h1End * 60 + m1End;
  const minutes2Start = h2Start * 60 + m2Start;
  const minutes2End = h2End * 60 + m2End;

  const overlapStart = Math.max(minutes1Start, minutes2Start);
  const overlapEnd = Math.min(minutes1End, minutes2End);

  return Math.max(0, overlapEnd - overlapStart);
}

/**
 * Convert weekly overlap minutes to a 0-100 score
 * Assumes 3+ hours (180 min) of overlap is ideal
 */
export function overlapToScore(overlapMinutes: number): number {
  const idealMinutes = 180; // 3 hours
  const score = (overlapMinutes / idealMinutes) * 100;
  return Math.min(100, score);
}

/**
 * Get suggested time slots based on overlapping availability
 * Returns up to 3 suggested slots for the next 2 weeks
 */
export interface SuggestedSlot {
  start: Date;
  end: Date;
  label: string;
  dayOfWeek: DayOfWeek;
}

export function getSuggestedSlots(
  slots1: AvailabilitySlot[],
  slots2: AvailabilitySlot[]
): SuggestedSlot[] {
  const suggestions: SuggestedSlot[] = [];
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

  const recurring1 = slots1.filter((s) => s.type === SlotType.RECURRING);
  const recurring2 = slots2.filter((s) => s.type === SlotType.RECURRING);

  // Check next 2 weeks
  for (let week = 0; week < 2; week++) {
    for (const slot1 of recurring1) {
      for (const slot2 of recurring2) {
        if (slot1.dayOfWeek === slot2.dayOfWeek) {
          const overlap = calculateTimeOverlap(
            slot1.startTime!,
            slot1.endTime!,
            slot2.startTime!,
            slot2.endTime!
          );

          if (overlap >= 60) {
            // At least 1 hour
            if (!slot1.dayOfWeek) continue;
            const dayOffset = DAY_OF_WEEK_TO_NUMBER[slot1.dayOfWeek];
            const slotDate = addDays(weekStart, dayOffset + week * 7);

            // Parse start/end times
            const [hStart, mStart] = slot1.startTime!.split(':').map(Number);
            const [hEnd, mEnd] = slot1.endTime!.split(':').map(Number);

            const start = new Date(slotDate);
            start.setHours(hStart, mStart, 0, 0);

            const end = new Date(slotDate);
            end.setHours(hEnd, mEnd, 0, 0);

            // Only future slots
            if (start > today) {
              suggestions.push({
                start,
                end,
                label: `${DAY_OF_WEEK_LABELS[slot1.dayOfWeek]} ${formatTimeRange(slot1.startTime!, slot1.endTime!)}`,
                dayOfWeek: slot1.dayOfWeek,
              });
            }
          }
        }
      }
    }
  }

  // Sort by date and return top 3
  return suggestions.sort((a, b) => a.start.getTime() - b.start.getTime()).slice(0, 3);
}

/**
 * Check if two ad-hoc slots overlap
 */
export function checkAdHocOverlap(slot1: AvailabilitySlot, slot2: AvailabilitySlot): boolean {
  if (!slot1.startDateTime || !slot1.endDateTime || !slot2.startDateTime || !slot2.endDateTime) {
    return false;
  }

  const interval1 = { start: slot1.startDateTime, end: slot1.endDateTime };
  const interval2 = { start: slot2.startDateTime, end: slot2.endDateTime };

  return (
    isWithinInterval(slot2.startDateTime, interval1) ||
    isWithinInterval(slot2.endDateTime, interval1) ||
    isWithinInterval(slot1.startDateTime, interval2)
  );
}

/**
 * Format time range for display
 */
function formatTimeRange(start: string, end: string): string {
  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${m.toString().padStart(2, '0')}${period}`;
  };

  return `${formatTime(start)} - ${formatTime(end)}`;
}

/**
 * Helpers
 */
const DAY_OF_WEEK_TO_NUMBER: Record<DayOfWeek, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

/**
 * Validate time slot format (HH:MM)
 */
export function isValidTimeFormat(time: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

/**
 * Check if time slot duration is reasonable (15 min - 6 hours)
 */
export function isValidSlotDuration(start: string, end: string): boolean {
  const overlap = calculateTimeOverlap(start, end, start, end);
  return overlap >= 15 && overlap <= 360;
}
