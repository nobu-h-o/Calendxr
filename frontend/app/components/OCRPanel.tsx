"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";
import { sendOcrImage } from "@/app/api/vision/ocr/route";
import { getChatGPTResponse } from "@/app/api/vision/openai/route";

// Common styles to prevent overflow
const preventOverflowStyle = {
  overflowX: "hidden" as const,
  maxWidth: "100%" as const,
  boxSizing: "border-box" as const,
  wordWrap: "break-word" as const
};

// Define the API response format from OCR/AI
interface EventDataApiResponse {
  title: string;
  description: string;
  location?: string;
  start: string; // ISO string format: YYYY-MM-DDThh:mm:ss+hh:mm
  end: string;   // ISO string format: YYYY-MM-DDThh:mm:ss+hh:mm
}

// Define the format that the EventForm component expects
interface EventFormData {
  title: string;
  description: string;
  location: string | undefined;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  allDay: boolean;
}

interface OCRPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEventDataExtracted: (eventData: EventFormData) => void;
}

const OCRPanel: React.FC<OCRPanelProps> = ({
  isOpen,
  onClose,
  onEventDataExtracted
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [parsedEventData, setParsedEventData] = useState<EventDataApiResponse | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      // Reset previous states when a new image is selected
      setExtractedText(null);
      setAiResponse(null);
      setParsedEventData(null);
      setParseError(null);
    }
  };

  const handleOcrSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) return;
    
    setIsProcessingOcr(true);
    setParseError(null);

    try {
      // Step 1: Extract text from image - using the imported sendOcrImage
      let ocrResult;
      try {
        console.log("Sending image to OCR service...");
        ocrResult = await sendOcrImage(image);
        
        // Check if the response contains an error
        if (ocrResult.error) {
          throw new Error(ocrResult.error);
        }
        
        console.log("OCR result received:", ocrResult);
      } catch (ocrError: any) {
        console.error("OCR service error:", ocrError);
        throw new Error(`OCR service error: ${ocrError.message || ocrError}`);
      }

      // Check for proper text content
      if (ocrResult?.text) {
        setExtractedText(ocrResult.text);
        
        // Step 2: Process extracted text with AI
        try {
          // Use the server-side prompt already defined
          const aiResult = await getChatGPTResponse(ocrResult.text);
          setAiResponse(aiResult);
          
          // Step 3: Parse AI response to populate form fields
          try {
            // The AI might return text that isn't perfectly formatted JSON
            // Try to extract JSON if it's embedded in other text
            let jsonString = aiResult;
            
            // Look for JSON-like structure if not already proper JSON
            if (!jsonString.trim().startsWith('{')) {
              const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                jsonString = jsonMatch[0];
              }
            }
            
            // Try to parse the JSON
            let parsedEvent;
            try {
              parsedEvent = JSON.parse(jsonString);
            } catch (jsonError) {
              console.log("Initial JSON parse error:", jsonError);
              console.log("Attempting to fix JSON:", jsonString);
              
              // If standard parsing fails, try a more lenient approach for common formatting issues
              // Replace single quotes with double quotes, fix missing quotes around property names
              const fixedJson = jsonString
                .replace(/'/g, '"')
                .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
              
              console.log("Fixed JSON attempt:", fixedJson);
              parsedEvent = JSON.parse(fixedJson);
            }
            
            // Validate the parsed event data has the required structure
            if (!parsedEvent.title || typeof parsedEvent.title !== 'string' ||
                !parsedEvent.description || typeof parsedEvent.description !== 'string' ||
                !parsedEvent.start || typeof parsedEvent.start !== 'string' ||
                !parsedEvent.end || typeof parsedEvent.end !== 'string') {
              
              throw new Error("AI response missing required fields or has invalid format");
            }
            
            // Validate and possibly fix date formats
            try {
              // Check if dates are in the correct format - if not, try to fix them
              const validateAndFixDate = (dateStr: string) => {
                try {
                  // First try parsing as is
                  new Date(dateStr).toISOString();
                  return dateStr;
                } catch (e) {
                  // If basic format (YYYY-MM-DD) without time, add default time and timezone
                  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                    const now = new Date();
                    const timezone = now.getTimezoneOffset() * -1;
                    const tzHours = Math.floor(Math.abs(timezone) / 60).toString().padStart(2, '0');
                    const tzMinutes = (Math.abs(timezone) % 60).toString().padStart(2, '0');
                    const tzSign = timezone >= 0 ? '+' : '-';
                    
                    return `${dateStr}T00:00:00${tzSign}${tzHours}:${tzMinutes}`;
                  }
                  throw new Error(`Cannot parse date: ${dateStr}`);
                }
              };
              
              // Fix dates if needed
              parsedEvent.start = validateAndFixDate(parsedEvent.start);
              parsedEvent.end = validateAndFixDate(parsedEvent.end);
              
              // Verify they're valid by converting to ISO and back
              new Date(parsedEvent.start).toISOString();
              new Date(parsedEvent.end).toISOString();
            } catch (dateError) {
              console.error("Date validation error:", dateError);
              throw new Error("Invalid date format in AI response");
            }
            
            setParsedEventData(parsedEvent);
          } catch (parseError: any) {
            console.error("Error parsing AI response:", parseError);
            setParseError(`Failed to parse AI response: ${parseError.message || parseError}`);
          }
        } catch (aiError: any) {
          console.error("Error getting AI response:", aiError);
          setAiResponse("Failed to process the request.");
          setParseError(`AI processing error: ${aiError.message || aiError}`);
        }
      } else {
        setExtractedText("No text was extracted from the image.");
        setParseError("OCR could not extract text from the image.");
      }
    } catch (error: any) {
      console.error("Overall processing error:", error);
      setExtractedText(`Error: ${error.message || error}`);
      setParseError(`Processing error: ${error.message || error}`);
    } finally {
      setIsProcessingOcr(false);
    }
  };

  // Handler for event data extraction
  const handleApplyAndClose = () => {
    if (parsedEventData) {
      try {
        // Convert the ISO format dates into the format expected by the event form
        // The event form expects separate date and time fields
        const processDate = (isoString: string) => {
          const date = new Date(isoString);
          if (isNaN(date.getTime())) {
            throw new Error(`Invalid date: ${isoString}`);
          }
          // Format the time as HH:MM for the time input
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          
          return {
            date: date,
            time: `${hours}:${minutes}`
          };
        };
        
        // Process start and end dates
        const startDateInfo = processDate(parsedEventData.start);
        const endDateInfo = processDate(parsedEventData.end);
        
        // Create the event data in the format expected by the event form
        const formattedEvent: EventFormData = {
          title: parsedEventData.title,
          description: parsedEventData.description,
          location: parsedEventData.location,
          startDate: startDateInfo.date,
          startTime: startDateInfo.time,
          endDate: endDateInfo.date,
          endTime: endDateInfo.time,
          // Default to non-all-day event
          allDay: false
        };
        
        console.log("Original parsed event data:", parsedEventData);
        console.log("Formatted event data for form:", formattedEvent);
        
        // Pass the properly formatted event data to the event form
        onEventDataExtracted(formattedEvent);
        onClose();
      } catch (error: any) {
        console.error("Error formatting event data:", error);
        setParseError(`Failed to format event data: ${error.message || error}`);
      }
    } else {
      setParseError("No valid event data to apply");
    }
  };

  // Reset state when panel is closed
  const handleClosePanel = () => {
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClosePanel}
      style={preventOverflowStyle}
    >
      <div 
        className={`fixed right-0 top-0 bottom-0 w-[400px] max-w-full bg-white shadow-xl overflow-y-auto overflow-x-hidden z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={preventOverflowStyle}
      >
        <div className="p-6" style={preventOverflowStyle}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Scan Event Details</h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClosePanel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleOcrSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Upload an image of your event invitation, flyer, or details to automatically fill in the form.
              </p>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="mb-2 cursor-pointer file:cursor-pointer hover:file:cursor-pointer"
              />
              <Button
                type="submit"
                className="w-full"
                disabled={!image || isProcessingOcr}
              >
                {isProcessingOcr ? "Processing..." : "Scan Image"}
              </Button>
            </div>
          </form>

          {parseError && (
            <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
              <h3 className="text-sm font-medium text-red-600 mb-1">Error</h3>
              <p className="text-xs text-red-700">{parseError}</p>
            </div>
          )}

          {parsedEventData && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-1">Analyzed Event Details</h3>
              <div className="p-3 bg-gray-50 rounded border">
                <div className="grid gap-2">
                  <div>
                    <span className="text-xs font-medium">Title:</span>
                    <p className="text-sm">{parsedEventData.title}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium">Description:</span>
                    <p className="text-sm">{parsedEventData.description}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium">Location:</span>
                    <p className="text-sm">{parsedEventData.location}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium">Start:</span>
                    <p className="text-sm">{new Date(parsedEventData.start).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{parsedEventData.start}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium">End:</span>
                    <p className="text-sm">{new Date(parsedEventData.end).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{parsedEventData.end}</p>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                className="w-full mt-4"
                onClick={handleApplyAndClose}
              >
                Continue
              </Button>
            </div>
          )}

          {aiResponse && !parsedEventData && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-1">AI Response (Raw)</h3>
              <div className="p-3 bg-gray-50 rounded border">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRPanel;