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

interface OCRPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEventDataExtracted: (eventData: any) => void;
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
  const [parsedEventData, setParsedEventData] = useState<any | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleOcrSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) return;
    
    setIsProcessingOcr(true);

    try {
      const result = await sendOcrImage(image);

      if (result.text) {
        setExtractedText(result.text);
        try {
          const aiResult = await getChatGPTResponse(result.text);
          setAiResponse(aiResult);
          
          // Parse AI response to populate form fields
          try {
            const parsedEvent = JSON.parse(aiResult);
            setParsedEventData(parsedEvent);
          } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
          }
        } catch (aiError) {
          console.error("Error getting AI response:", aiError);
          setAiResponse("Failed to process the request.");
        }
      } else {
        setExtractedText("Failed to extract text.");
      }
    } catch (ocrError) {
      console.error("OCR processing error:", ocrError);
      setExtractedText("Error processing image.");
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const handleApplyAndClose = () => {
    if (parsedEventData) {
      onEventDataExtracted(parsedEventData);
    }
    onClose();
  };

  // Reset state when panel is closed
  const handleClosePanel = () => {
    onClose();
    // Optional: uncomment if you want to reset state when panel closes
    // setImage(null);
    // setExtractedText(null);
    // setAiResponse(null);
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
                className="mb-2"
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

          {extractedText && (
            <div className="mt-4 p-3 bg-gray-50 rounded border">
              <h3 className="text-sm font-medium mb-1">Extracted Text</h3>
              <p className="text-xs text-gray-700 whitespace-pre-line">{extractedText}</p>
            </div>
          )}

          {aiResponse && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-1">Analyzed Event Details</h3>
              <div className="p-3 bg-gray-50 rounded border">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse, null, 2)}
                </pre>
              </div>
              <Button
                type="button"
                className="w-full mt-4"
                onClick={handleApplyAndClose}
              >
                Apply & Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRPanel;