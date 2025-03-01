import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getCalendarEvents } from "@/lib/calendar"
import { createEmbedding, findRelevantEvents } from "@/lib/rag"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const userMessage = messages[messages.length - 1].content

  // Create embedding for the user's query
  const queryEmbedding = await createEmbedding(userMessage)

  // Get all calendar events
  const allEvents = await getCalendarEvents()

  // Find relevant events using RAG
  const relevantEvents = await findRelevantEvents(queryEmbedding, allEvents)

  // Create a context string from relevant events
  const context = relevantEvents
    .map(
      (event) =>
        `Event: ${event.title}\nDate: ${event.date.toLocaleString()}\nDuration: ${event.duration} minutes\nAttendees: ${event.attendees.map((a) => a.name).join(", ")}`,
    )
    .join("\n\n")

  // Create system message with context
  const systemMessage = `
    You are a helpful calendar assistant. 
    Use the following calendar information to answer the user's question:
    
    ${context}
    
    If the user asks about events not in the context, politely explain that you don't have information about those events.
    If the user wants to create or modify events, guide them on how to do it.
  `

  // Stream the response
  const result = streamText({
    model: openai("gpt-4o"),
    messages: [{ role: "system", content: systemMessage }, ...messages],
  })

  return result.toDataStreamResponse()
}

