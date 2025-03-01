import { openai } from "@ai-sdk/openai"
import { embed, cosineSimilarity } from "ai"

// Create embedding for text using OpenAI
export async function createEmbedding(text: string) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  })

  return embedding
}

// Find relevant events based on query embedding
export async function findRelevantEvents(queryEmbedding: number[], events: any[]) {
  // Create embeddings for all events
  const eventTexts = events.map(
    (event) => `${event.title} on ${event.date.toLocaleDateString()} at ${event.date.toLocaleTimeString()}`,
  )

  // In a real app, you would store these embeddings in a vector database
  // Here we're creating them on the fly for simplicity
  const eventEmbeddings = await Promise.all(
    eventTexts.map(async (text) => {
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: text,
      })
      return embedding
    }),
  )

  // Calculate similarity scores
  const similarities = eventEmbeddings.map((embedding) => cosineSimilarity(queryEmbedding, embedding))

  // Sort events by similarity and take top 3
  const eventWithSimilarity = events.map((event, i) => ({
    ...event,
    similarity: similarities[i],
  }))

  const relevantEvents = eventWithSimilarity.sort((a, b) => b.similarity - a.similarity).slice(0, 3)

  return relevantEvents
}

