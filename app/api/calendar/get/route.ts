import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Session } from "next-auth";

interface SessionWithToken extends Session {
  accessToken?: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as SessionWithToken)?.accessToken;
  
  if (!session || !session.user || !accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  try {
    // Use the accessToken from the session for Google Calendar API
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || "postmessage"
    );
    oAuth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date('2025-01-01T00:00:00Z').toISOString(),
      timeMax: new Date('2027-01-01T00:00:00Z').toISOString(),
      maxResults: 1000,
      singleEvents: true,
      orderBy: "startTime",
    });
    
    interface CalendarEvent {
      id: string;
      title: string;
      description: string;
      start: string;
      end: string;
    }
    
    const events = ((res.data.items as calendar_v3.Schema$Event[]) || []).map((item: calendar_v3.Schema$Event): CalendarEvent => ({
      id: item.id || '',
      title: item.summary || "No Title",
      description: item.description || "",
      start: item.start?.dateTime || item.start?.date || new Date().toISOString(),
      end: item.end?.dateTime || item.end?.date || new Date().toISOString(),
    }));
    
    // Turn on only while developping
    // console.log("Fetched Events:", events);
    return NextResponse.json(events);
  } catch (error: unknown) {
    console.error("Calendar API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch calendar events";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}