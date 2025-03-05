"use server";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Send an OCR request with an image
export async function sendOcrImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await fetch(`${API_URL}/ocr`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending OCR image:", error);
    return { error: "Failed to process the image" };
  }
}
