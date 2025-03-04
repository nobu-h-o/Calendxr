const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// Create an Empty Knowledge Base

//create a Dcoument with Text ✅
export const createDocumentByText = async (datasetId: string, createData: { title: string; content: string }) => {
  const payload = {     
    name: createData.title,
    text: createData.content
  }; 
  const response = await fetch(`${API_URL}/datasets/${datasetId}/document/create-by-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error:", errorData);
    throw new Error(`Failed to create document: ${errorData.error}`);
  }
  const data = await response.json();

  return data.document?.id;
};


// Create a Document with File ✅
export const uploadDocumentFile = async (datasetId: string, file: File) => {
  const formData = new FormData();
  
  formData.append("file", file);
  formData.append("data", JSON.stringify({
    "indexing_technique": "high_quality",
    "process_rule": {
      "rules": {
        "pre_processing_rules": [
          { "id": "remove_extra_spaces", "enabled": true },
          { "id": "remove_urls_emails", "enabled": true }
        ],
        "segmentation": {
          "separator": "###",
          "max_tokens": 500
        }
      },
      "mode": "custom"
    }
  }));

  const response = await fetch(`${API_URL}/datasets/${datasetId}/document/create-by-file`, {
    method: "POST",
    body: formData, // Send FormData with file
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - Failed to upload file`);
  }

  const data = await response.json();

  return data.document?.id;

};

// Delete a Document ✅
export const deleteDocument = async (datasetId: string, documentId: string) => {
  const response = await fetch(`${API_URL}/datasets/${datasetId}/documents/${documentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error:", errorData);
    throw new Error(`Failed to delete document: ${errorData.error}`);
  }

  return await response.json();
};

//Get Document list ✅
export const getDocumentList = async (datasetId: string) => {
  const response = await fetch(`${API_URL}/datasets/${datasetId}/documents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching document list:", errorData);
    throw new Error(`Failed to get document list: ${errorData.error}`);
  }

  return await response.json();
};

//Get a chunk from document ✅
export const getDocumentSegment = async (datasetId: string, documentId: string) => {
  const response = await fetch(`${API_URL}/datasets/${datasetId}/documents/${documentId}/segments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching document segments:", errorData);
    throw new Error(`Failed to get document segments: ${errorData.error}`);
  }

  return await response.json();
};

//Send a chat message
export async function sendChatMessage(query: string, conversation_id?: string) {
  const payload: Record<string, any> = { query, conversation_id };

  if (conversation_id) {
    payload.conversation_id = conversation_id;
  }

  try {
    const response = await fetch(`${API_URL}/chat-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    return { error: "Failed to send the message" };
  }
}

//Get a chat message
export async function getConversations() {
  try {
    const response = await fetch(`${API_URL}/conversations`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { error: "Failed to fetch conversations" };
  }
}

//Get chat messages
export async function getMessages(conversationId: string) {
  try {
    const response = await fetch(`${API_URL}/messages?conversation_id=${conversationId}`);
    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages" };
  }
}
