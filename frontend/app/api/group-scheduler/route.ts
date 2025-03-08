import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestBody {
  emails: string[];
  lookAheadDays?: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

interface User {
  id: number;
  email: string;
  name: string | null;
  events: CalendarEvent[];
}

interface ApiResponse {
  users: User[];
  totalUsersFound: number;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("Trying to get emails");
    const { emails, lookAheadDays = 7 }: RequestBody = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "No valid email addresses provided" },
        { status: 400 }
      );
    }
    console.log("Got emails good");
    // Set date range for looking ahead
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + lookAheadDays);

    // Find users and their calendar events
    const usersPromises = emails.map(async (email: string) => {
      try {
        // Find user by email
        console.log("trying to find users by email");
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
          },
        });

        if (!user) {
          console.log("cannot find a user");
          return null;
        }
        console.log("found user: ", user.name);

        // Get user's events within the date range
        console.log("trying to find user's calendar event");
        const events = await prisma.calendarEvent.findMany({
          where: {
            userId: user.id,
            start: { gte: startDate },
            end: { lte: endDate },
          },
          select: {
            id: true,
            title: true,
            start: true,
            end: true,
          },
        });
        console.log("found ", user.name, " calendar events");
        return {
          ...user,
          events,
        };
      } catch (error) {
        console.error(`Error processing user ${email}:`, error);
        return null;
      }
    });

    const users = await Promise.all(usersPromises);

    // Filter out null results (users not found)
    const validUsers = users.filter((user): user is User => user !== null);

    const response: ApiResponse = {
      users: validUsers,
      totalUsersFound: validUsers.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in group scheduler API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
