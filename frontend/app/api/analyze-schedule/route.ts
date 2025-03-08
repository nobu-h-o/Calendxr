import { NextRequest, NextResponse } from "next/server";

interface ScheduleEvent {
  title: string;
  start: string;
  end: string;
}

interface UserSchedule {
  name: string;
  email: string;
  eventCount: number;
  busyTimes: ScheduleEvent[];
}

interface FreeSlot {
  user: string;
  start: string;
  end: string;
  durationHours: number;
}

interface AnalyzeScheduleRequest {
  systemMessage: string;
  userPrompt: string;
  data: {
    users: UserSchedule[];
    freeSlots: FreeSlot[];
    lookAheadDays: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { systemMessage, userPrompt, data }: AnalyzeScheduleRequest = await request.json();
    
    if (!userPrompt || !data) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Format the schedule data to include in the prompt
    const userDataText = data.users.map(user => 
      `User: ${user.name} (${user.email})
      Total Events: ${user.eventCount}
      Busy Times: ${user.busyTimes.map(event => 
        `${event.title}: ${new Date(event.start).toLocaleString()} - ${new Date(event.end).toLocaleString()}`
      ).join(", ")}`
    ).join("\n\n");

    const freeSlotText = data.freeSlots.map(slot => 
      `${slot.user}: ${new Date(slot.start).toLocaleString()} - ${new Date(slot.end).toLocaleString()} (${slot.durationHours} hours)`
    ).join("\n");

    const today = new Date().toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });

    // Build the enhanced system message with schedule data
    const enhancedSystemMessage = `
      ${systemMessage}
      
      Today is ${today}. You are analyzing schedules for the next ${data.lookAheadDays} days.
      
      USER SCHEDULES:
      ${userDataText}
      
      AVAILABLE TIME SLOTS:
      ${freeSlotText}
      
      Please format your response with markdown for readability. Focus on finding overlapping free times where all users are available.
    `;

    // Construct the messages for the OpenAI API
    const messages = [
      { role: "system", content: enhancedSystemMessage },
      { role: "user", content: userPrompt }
    ];

    // Prepare the payload for OpenAI
    const payload = {
      model: "gpt-4o-mini", // Using the same model as the reference code
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
      analysis: openaiData.choices[0].message.content || "No analysis available",
      status: "success"
    });
    
  } catch (error: any) {
    console.error("Error in analyze-schedule API route:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      analysis: "Unable to generate scheduling recommendations due to an error."
    }, { status: 500 });
  }
}
