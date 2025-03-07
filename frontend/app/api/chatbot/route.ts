"use server";

import OpenAI from "openai";
import fs from "fs";
import FormData from "form-data";

// Initialize the OpenAI client with your API key from the environment.
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Receives a user input and returns the assistant's response.
 *
 * @param input - The user's input message.
 * @returns The assistant's reply as a string.
 */
interface ChatCompletionResponse {
    id: string;
    choices: {
      message: { role: string; content: string }
    }[];
    // 추가 속성이 필요하면 여기에 선언
  }

  
export async function sendChatMessage(input: string): Promise<ChatCompletionResponse> {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: input },
        ],
        max_tokens: 150,
      });
      
      return response;
    } catch (error) {
      console.error("Error sending chat message:", error);
      return "Error occurred.";
    }
}
/**
 * Retrieves messages for a given conversation completion ID.
 *
 * This function calls:
 * GET https://api.openai.com/v1/chat/completions/{completion_id}/messages
 * to fetch the conversation details.
 *
 * @param completionId - The unique identifier of the conversation.
 * @returns The conversation messages as returned by OpenAI.
 */
export async function getMessages(completionId: string): Promise<any> {
  try {
    const url = `https://api.openai.com/v1/chat/completions/${completionId}/messages`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return { error: "Error occurred while fetching messages." };
  }
}

// /**
//  * Uploads a file to OpenAI.
//  *
//  * This function mimics the following curl command:
//  * 
//  * curl https://api.openai.com/v1/files \
//  *   -H "Authorization: Bearer $OPENAI_API_KEY" \
//  *   -F purpose="fine-tune" \
//  *   -F file="@mydata.jsonl"
//  *
//  * @param filePath - The local file path to the file you want to upload.
//  * @param purpose - The purpose for the file (default: "fine-tune").
//  * @returns The API response after uploading the file.
//  */
// export async function uploadFile(
//   filePath: string,
//   purpose: string = "fine-tune"
// ): Promise<any> {
//   try {
//     const formData = new FormData();
//     formData.append("purpose", purpose);
//     // Append the file as a stream.
//     formData.append("file", fs.createReadStream(filePath));

//     const res = await fetch("https://api.openai.com/v1/files", {
//       method: "POST",
//       headers: {
//         // Note: Do not set the "Content-Type" header manually when using FormData.
//         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: formData as any, // Type assertion for compatibility.
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return { error: "Error occurred during file upload." };
//   }
// }
