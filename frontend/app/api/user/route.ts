import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, events } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Upsert user data
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    });

    if (events && Array.isArray(events)) {
      await prisma.$transaction(
        events.map((event) =>
          prisma.calendarEvent.upsert({
            where: { id: event.id, userId: user.id },
            update: { title: event.title, start: new Date(event.start), end: new Date(event.end) },
            create: { id: event.id, title: event.title, start: new Date(event.start), end: new Date(event.end), userId: user.id },
          })
        )
      );
    }

    return NextResponse.json({ user, events }, { status: 200 });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
