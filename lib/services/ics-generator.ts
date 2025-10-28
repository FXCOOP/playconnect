/**
 * ICS Calendar File Generator
 * Creates downloadable .ics files for playdate calendar invites
 */

import { createEvent, EventAttributes, DateArray } from 'ics';

export interface PlaydateEvent {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  organizer: {
    name: string;
    email: string;
  };
  attendees: Array<{
    name: string;
    email: string;
  }>;
}

/**
 * Generate ICS file content for a playdate
 */
export function generatePlaydateICS(event: PlaydateEvent): string {
  const startArray: DateArray = [
    event.start.getFullYear(),
    event.start.getMonth() + 1,
    event.start.getDate(),
    event.start.getHours(),
    event.start.getMinutes(),
  ];

  const endArray: DateArray = [
    event.end.getFullYear(),
    event.end.getMonth() + 1,
    event.end.getDate(),
    event.end.getHours(),
    event.end.getMinutes(),
  ];

  const eventAttributes: EventAttributes = {
    start: startArray,
    end: endArray,
    title: event.title,
    description: event.description,
    location: event.location,
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: {
      name: event.organizer.name,
      email: event.organizer.email,
    },
    attendees: event.attendees.map((a) => ({
      name: a.name,
      email: a.email,
      rsvp: true,
      partstat: 'NEEDS-ACTION',
      role: 'REQ-PARTICIPANT',
    })),
    alarms: [
      {
        action: 'display',
        description: 'Playdate reminder',
        trigger: { hours: 24, before: true },
      },
      {
        action: 'display',
        description: 'Playdate starting soon',
        trigger: { hours: 2, before: true },
      },
    ],
  };

  const { error, value } = createEvent(eventAttributes);

  if (error) {
    console.error('ICS generation error:', error);
    throw new Error('Failed to generate calendar event');
  }

  return value || '';
}

/**
 * Generate filename for ICS download
 */
export function generateICSFilename(childName: string, date: Date): string {
  const dateStr = date.toISOString().split('T')[0];
  const sanitizedName = childName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `playdate_${sanitizedName}_${dateStr}.ics`;
}

/**
 * Create ICS data URL for browser download
 */
export function createICSDataURL(icsContent: string): string {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  return URL.createObjectURL(blob);
}
