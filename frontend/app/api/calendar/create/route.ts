import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// @ts-ignore: Module 'googleapis' might need to be installed with its types.
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  
  const { calendarId, eventData } = body;
  if (!calendarId || !eventData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  
  oAuth2Client.setCredentials({ access_token: (session.user as any)?.accessToken });
  
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  
  try {
    const res = await calendar.events.insert({
      calendarId,
      requestBody: eventData
    });
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}