import { useState, ChangeEvent, FormEvent } from "react";
import { sendOcrImage } from "@/app/api/vision/ocr/route";
import { getChatGPTResponse } from "@/app/api/vision/openai/route";

const OCR = () => {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

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
      <h1>OCR Example</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>
      {text && (
        <div>
          <h2>Extracted Text</h2>
          <p>{text}</p>
        </div>
      )}
      {aiResponse && (
        <div>
          <h2>Response from OpenAI</h2>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default OCR;
