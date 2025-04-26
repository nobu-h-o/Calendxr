// app/api/calendar/auth-check/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// Define types for better type safety
type GoogleApiTestResult = 
  | { status: "not_attempted" }
  | { status: "success"; calendarCount: number }
  | { status: "api_error"; message: string; code?: number; details?: any }
  | { status: "setup_error"; message: string };

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ 
        status: "error",
        message: "No session found", 
      }, { status: 401 });
    }
    
    // Check session structure
    const sessionDetails = {
      hasUser: !!session.user,
      hasAccessToken: !!(session.user as any)?.accessToken,
      // Only show token prefix for security
      tokenPrefix: (session.user as any)?.accessToken 
        ? `${(session.user as any).accessToken.slice(0, 10)}...` 
        : 'none',
      sessionKeys: Object.keys(session),
      userKeys: session.user ? Object.keys(session.user) : [],
    };
    
    // Check environment
    const envDetails = {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    };
    
    // If we have a token, test it
    let googleApiTest: GoogleApiTestResult = { status: "not_attempted" };
    
    if ((session.user as any)?.accessToken) {
      try {
        // Setup OAuth client
        const oAuth2Client = new OAuth2Client(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        
        oAuth2Client.setCredentials({ 
          access_token: (session.user as any).accessToken 
        });
        
        // Try a simple Calendar API call (list calendars)
        const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
        
        // Use a try-catch specifically for the API call
        try {
          const calendarList = await calendar.calendarList.list({
            maxResults: 1,
          });
          
          googleApiTest = {
            status: "success",
            calendarCount: calendarList.data.items?.length || 0,
          };
        } catch (apiError: any) {
          googleApiTest = {
            status: "api_error",
            message: apiError.message,
            code: apiError.code,
            details: apiError.response?.data || "No response data",
          };
        }
      } catch (setupError) {
        googleApiTest = {
          status: "setup_error",
          message: setupError instanceof Error ? setupError.message : String(setupError),
        };
      }
    }
    
    // Return diagnostic information
    return NextResponse.json({
      status: "complete",
      session: sessionDetails,
      environment: envDetails,
      googleApiTest,
    });
    
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}