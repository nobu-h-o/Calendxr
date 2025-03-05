export async function getCalendarEvents() {
  const response = await fetch("/api/calendar/get");
  if (!response.ok) {
    throw new Error("Failed to fetch calendar events");
  }
  return response.json();
}

export async function updateCalendarEvents(calendarId: string, eventId: string){
  const response = await fetch("/api/calendar/update");
  if (!response.ok) {
    throw new Error("Failed to update calendar event");
  }
  return response.json();
}

export async function createCalendarEvents(calendarId: string){
  const response = await fetch("/api/calendar/create");
  if (!response.ok) {
    throw new Error("Failed to create calendar event");
  }
  return response.json();
}