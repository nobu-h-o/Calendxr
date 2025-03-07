export async function chatWithCalendar(userMessage: string, conversationId?: string) {
  let eventsText = "";
  try {
    const res = await fetch("/api/calendar/get");
    if (!res.ok) {
      throw new Error("Failed to fetch calendar events");
    }
    eventsText = await res.json();
  } catch (error) {
    eventsText = "Error fetching events.";
  }

  const systemMessage = `You are a helpful assistant specialized in calendar management. You have access to the following events from the user's calendar:\n${eventsText}\nPlease answer any calendar-related questions based solely on these events.`;

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage }
  ];

  const payload = {
    model: "gpt-3.5-turbo",
    messages: messages,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data.choices[0].message;
}