import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const backendOcrUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/ocr";
  try {
    // Create a FormData object and append a dummy file for testing
    const formData = new FormData();
    const dummyContent = new Blob(["dummy image content"], { type: "text/plain" });
    formData.append("image", dummyContent, "dummy.txt");

    // Call the backend OCR endpoint using POST with the dummy file
    const response = await fetch(backendOcrUrl, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error: ${response.status} - ${text}`);
    }
    const data = await response.json();
    return NextResponse.json({ message: "Backend OCR endpoint called successfully", data });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to connect to backend OCR endpoint", details: error.message });
  }
}