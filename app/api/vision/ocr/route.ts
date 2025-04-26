"use server";

import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Initialize Google Cloud Vision client
const auth = new GoogleAuth({
  credentials: {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
  },
});

async function getVisionClient() {
  try {
    const credentials = await auth.getCredentials();
    if (!credentials) {
      throw new Error('Failed to get Google Cloud credentials');
    }
    return new ImageAnnotatorClient({
      credentials,
      apiEndpoint: 'vision.googleapis.com',
    });
  } catch (error) {
    console.error('Error initializing Vision client:', error);
    throw new Error('Failed to initialize Google Cloud Vision client');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert the image to a buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Process the image with Google Cloud Vision
    const client = await getVisionClient();
    const [result] = await client.textDetection({
      image: { content: buffer },
    });

    const texts = result.textAnnotations;
    const resultText = texts?.[0]?.description || 'No text found';

    return NextResponse.json({ text: resultText });
  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json;
}

// Export the sendOcrImage function for backward compatibility
export async function sendOcrImage(image: File) {
  const formData = new FormData();
  formData.append('image', image);

  try {
    // Get the base URL from environment variable or use a default
    const baseUrl = process.env.PROJECT_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/vision/ocr`, {
      method: 'POST',
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

    return await response.json();
  } catch (error) {
    console.error('Network error sending OCR image:', error);
    return { 
      error: 'Failed to connect to OCR service',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}