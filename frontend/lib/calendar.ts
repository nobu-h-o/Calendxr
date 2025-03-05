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

export async function createCalendarEvent(calendarId: string){
  const response = await fetch("/api/calendar/create");
  if (!response.ok) {
    throw new Error("Failed to create calendar event");
  }
  return response.json();
}