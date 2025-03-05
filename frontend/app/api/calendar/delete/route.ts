import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// @ts-ignore: Module 'googleapis' might need to be installed with its types.
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export async function DELETE(request: Request) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 2. Get access token from the session
    const accessToken = session.accessToken;
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: "No Google access token found in session"
      }, { status: 401 });
    }
    
    // 3. Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    
    // 4. Validate request parameters
    const { calendarId, eventId } = body;
    if (!calendarId || !eventId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // 5. Setup Google OAuth client
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oAuth2Client.setCredentials({ access_token: accessToken });
    
    // 6. Call Google Calendar API to delete the event
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    
    try {
      await calendar.events.delete({
        calendarId,
        eventId,
      });
      
      return NextResponse.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Google Calendar API error:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}