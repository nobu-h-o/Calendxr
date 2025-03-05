export async function getCalendarEvents() {
  const response = await fetch("/api/calendar/get");
  if (!response.ok) {
    throw new Error("Failed to fetch calendar events");
  }
  return response.json();
}

export async function updateCalendarEvent(calendarId: string, eventId: string, updateData: any) {
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

export async function createCalendarEvent(calendarId: string, eventData: any) {
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