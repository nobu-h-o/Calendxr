export async function getCalendarEvents() {
  const response = await fetch("/api/calendar");
  if (!response.ok) {
    throw new Error("Failed to fetch calendar events");
  }
  return response.json();
}
