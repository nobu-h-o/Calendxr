interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  colorId?: string;
  visibility?: 'default' | 'public' | 'private';
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
}

// Type for the update operations
interface EventUpdateData {
  summary?: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  colorId?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  visibility?: 'default' | 'public' | 'private';
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const response = await fetch("/api/calendar/get");
  if (!response.ok) {
    throw new Error("Failed to fetch calendar events");
  }
  return response.json();
}

export async function updateCalendarEvent(
  calendarId: string, 
  eventId: string, 
  updateData: EventUpdateData
) {
  const response = await fetch("/api/calendar/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarId,
      eventId,
      updateData,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update calendar event");
  }
  return response.json();
}

export async function createCalendarEvent(
  calendarId: string, 
  eventData: CalendarEvent
) {
  const response = await fetch("/api/calendar/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarId,
      eventData,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create calendar event");
  }
  return response.json();
}

export async function deleteCalendarEvent(calendarId: string, eventId: string) {
  const response = await fetch("/api/calendar/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarId,
      eventId,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete calendar event");
  }
  return response.json();
}