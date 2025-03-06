"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Send an OCR request with an image
 * @param image The image file to process
 * @returns The OCR response with extracted text or an error
 */
export async function sendOcrImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  try {
    console.log(`Sending OCR request to ${API_URL}/ocr`);
    
    const response = await fetch(`${API_URL}/ocr`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OCR API error (${response.status}):`, errorText);
      return { 
        error: `OCR service responded with status: ${response.status}`,
        details: errorText 
      };
    }
    
    // Get the raw response
    const rawText = await response.text();
    console.log("Raw OCR API response:", rawText);
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(rawText);
      return data;
    } catch (parseError) {
      console.error("Failed to parse OCR API response as JSON:", parseError);
      // Return a structured error that includes the raw text for debugging
      return { 
        error: "Invalid JSON response from OCR service",
        rawResponse: rawText.substring(0, 200) // First 200 chars for debugging
      };
    }
  } catch (error) {
    console.error("Network error sending OCR image:", error);
    return { 
      error: "Failed to connect to OCR service",
      details: error!
    };
  }
}