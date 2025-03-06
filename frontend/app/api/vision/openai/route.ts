"use server";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatGPTResponse(text: string): Promise<string> {
  const prompt = `Please extract the event date, time, and location from the following text. Ensure that your response follows the given conditions.\n
  # Conditions: \n
  - Provide a title.\n
  - The date range should be clearly specified.\n
  - The date format should be 'YYYY-MM-DD'.\n
  # Input Text: \n
  ${text}\n 
  #\n
  # The output should be in the following JSON format (Don't put it in a code block): \n
    {
      title: {Title of the input text},
      description: {Summary of the input text},
      start: YYYY-MM-DDThh:mm:ss+hh:mm,
      end: YYYY-MM-DDThh:mm:ss+hh:mm,
    }
  # \n
  `;
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 100,
    });

    return (
      completion.choices?.[0]?.message?.content ||
      "No event information was found."
    );
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error occurred.";
  }
}
