import { NextResponse } from "next/server";

export async function GET() {
  const envDetails = {
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  };

  if (!envDetails.hasOpenAIKey) {
    return NextResponse.json({
      status: "error",
      message: "OPENAI_API_KEY is not set in the environment",
      environment: envDetails,
    }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error: ${response.status} - ${errorText}`);
    }

    const modelsData = await response.json();
    const modelCount = Array.isArray(modelsData.data) ? modelsData.data.length : 0;

    const openaiApiTest = {
      status: "success",
      modelCount,
    };

    return NextResponse.json({
      status: "complete",
      environment: envDetails,
      openaiApiTest,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Failed to connect to OpenAI API",
      details: error.message,
    }, { status: 500 });
  }
}