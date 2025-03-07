import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request for the user's message and optional conversationId
    const { message, conversationId } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }
    const convId = conversationId || Date.now().toString();

    // Construct the URL to fetch calendar events
    const calendarUrl = new URL("/api/calendar/get", request.url);
    let eventsText = "";
    try {
      const calendarRes = await fetch(calendarUrl.toString(), {
        headers: {
          Cookie: request.headers.get("cookie") || ""
        },
        credentials: "include"
      });
      if (!calendarRes.ok) {
        throw new Error("Failed to fetch calendar events");
      }
      const events = await calendarRes.json();
      if (Array.isArray(events)) {
        eventsText = events
          .map((event: any) => 
            `Title: ${event.title}, Start: ${new Date(event.start).toLocaleString()}, End: ${new Date(event.end).toLocaleString()}`
          )
          .join("\n");
      } else {
        eventsText = "No events found.";
      }
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      eventsText = "";
    }

    // Build the system message including calendar events context
    const systemMessage = eventsText 
      ? `You are a helpful assistant specialized in calendar management. You have access to the following events from the user's calendar:\n${eventsText}\nPlease answer any calendar-related questions based solely on these events.`
      : "You are a helpful assistant specialized in calendar management. No upcoming events available.";

    // Construct the messages for the OpenAI Chat Completion API
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: message }
    ];

    // Prepare the payload for OpenAI
    const payload = {
      model: "gpt-3.5-turbo",
      messages: messages,
    };

    // Call the OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    return NextResponse.json({
      answer: openaiData.choices[0].message.content || "No response",
      conversation_id: convId,
    });
  } catch (error: any) {
    console.error("Error in chatbot route:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}