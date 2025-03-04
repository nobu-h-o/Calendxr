import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// Removed authOptions import since it's not exported

// @ts-ignore: Module 'googleapis' might need to be installed with its types.
import { google } from "googleapis";

export async function GET() {
  const session = await getServerSession();
  const accessToken = (session as any)?.accessToken; // Cast session as any to access accessToken

  if (!session || !session.user || !accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  try {
    // Use the accessToken from the session for Google Calendar API
    const calendar = google.calendar({ version: "v3", auth: accessToken });
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    
    const events = ((res.data.items as any[]) || []).map((item: any) => ({
      id: item.id,
      title: item.summary || "No Title",
      date: item.start?.dateTime || item.start?.date || new Date().toISOString(),
      duration: item.end && item.start
        ? (new Date(item.end.dateTime || item.end.date).getTime() - new Date(item.start.dateTime || item.start.date).getTime()) / 60000
        : 0,
      attendees: ((item.attendees as any[]) || []).map((attendee: any) => ({
        name: attendee.displayName || attendee.email,
        avatar: "" // Google Calendar API does not provide avatar info
      }))
    }));
    
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 });
  }
}