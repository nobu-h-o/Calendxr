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
  if (!session.accessToken || !session.refreshToken) {
    return NextResponse.json({ error: "Missing access or refresh token in session. Please sign in again." }, { status: 400 });
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
  
  // Log session data for debugging purposes
  console.log("Session data:", session);
  const credentials: { access_token: string, refresh_token?: string } = {
    access_token: session.accessToken,
  };
  if (session.refreshToken) {
    credentials.refresh_token = session.refreshToken;
  }
  oAuth2Client.setCredentials(credentials);
  oAuth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      console.log("New refresh token:", tokens.refresh_token);
    }
    console.log("New access token:", tokens.access_token);
  });
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  
  try {
    const res = await calendar.events.insert({
      calendarId,
      requestBody: eventData
    });
    return NextResponse.json(res.data);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Missing access or refresh token")) {
      errorMessage = "Authentication error: Missing access or refresh token. Please sign out and sign in again.";
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}