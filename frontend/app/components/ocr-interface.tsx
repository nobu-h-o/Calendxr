import { useState, ChangeEvent, FormEvent } from "react";
import { sendOcrImage } from "@/app/api/vision/ocr/route";
import { getChatGPTResponse } from "@/app/api/vision/openai/route";
import { Button } from "./ui/button";

const OCR = () => {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    const result = await sendOcrImage(image);

    if (result.text) {
      setText(result.text);
      try {
        const aiResult = await getChatGPTResponse(result.text);
        setAiResponse(aiResult);
      } catch (error) {
        console.error("Error:", error);
        setAiResponse("Failed to process the request.");
      }
    } else {
      setText("Failed to extract text.");
    }
  };

  return (
    <div>
      {/* Button to open the OCR panel */}
      <Button
        type="button"
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsPanelOpen(true)}
      >
        Open OCR
      </Button>

      {/* Sliding panel for OCR */}
      <div
        className={`fixed right-0 top-0 bottom-0 transition-transform transform ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        } z-40 bg-white border-l border-gray-300 shadow-xl w-[400px] overflow-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">OCR Interface</h2>
            <Button
              type="button"
              className="text-gray-500"
              onClick={() => setIsPanelOpen(false)}
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <Button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
            >
              Upload Image
            </Button>
          </form>

          {text && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Extracted Text</h2>
              <p>{text}</p>
            </div>
          )}

          {aiResponse && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Response from OpenAI</h2>
              <p>{aiResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCR;
