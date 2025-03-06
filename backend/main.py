import os
import json
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import vision

# load API_KEY from .env
load_dotenv()
DIFY_API_KEY = os.getenv("DIFY_API_KEY")
DIFY_API_DATASET_KEY = os.getenv("DIFY_API_DATASET_KEY")
DIFY_API_URL = os.getenv("DIFY_API_URL")
PATH_TO_GCV_JSON_FILE = os.getenv("PATH_TO_GCV_JSON_FILE")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Header
headers = {"Authorization": f"Bearer {DIFY_API_KEY}"}
dataset_headers_file = {
    "Authorization": f"Bearer {DIFY_API_DATASET_KEY}",
}
dataset_headers = {
    "Authorization": f"Bearer {DIFY_API_DATASET_KEY}",
    "Content-Type": "application/json",
}


class UpdateDocumentByText(BaseModel):
    name: str
    text: str


class CreateDocumentByText(BaseModel):
    name: str
    text: str
    indexing_technique: str = "high_quality"
    process_rule: dict = {"mode": "automatic"}


class PrivateCreateDatasetRequest(BaseModel):
    name: str
    permission: str = "only_me"


class PublicCreateDatasetRequest(BaseModel):
    name: str
    permission: str = "all_team_members"


# Create an Empty Knowledge Base ✅
@app.post("/datasets")
def create_knowledge_base(create_data: PublicCreateDatasetRequest):
    url = f"{DIFY_API_URL}/datasets"
    payload = create_data.model_dump()
    response = requests.post(url, headers=dataset_headers, json=payload)

    if response.status_code == 200:
        return response.json()
    return JSONResponse(
        content={
            "error": "Failed to create dataset",
            "status_code": response.status_code,
        },
        status_code=response.status_code,
    )


# Get Knowledge Base List ✅
@app.get("/datasets")
def get_knowledge_base_list(page: int = 1, limit: int = 20):
    url = f"{DIFY_API_URL}/datasets?page={page}&limit={limit}"
    response = requests.get(url, headers=dataset_headers)
    if response.status_code == 200:
        return response.json()
    return JSONResponse(
        content={
            "error": "Failed to get knowledge base list",
            "status_code": response.status_code,
        },
        status_code=response.status_code,
    )


# Delete a Knowledge Base ✅
@app.delete("/datasets/{dataset_id}")
def delete_knowledge_base(dataset_id: str):
    url = f"{DIFY_API_URL}/datasets/{dataset_id}"
    response = requests.delete(url, headers=dataset_headers)
    if response.status_code == 200:
        return response.json()
    return JSONResponse(
        content={
            "error": "Failed to delete knowledge_base",
            "status_code": response.status_code,
        },
        status_code=response.status_code,
    )


# Create a Document from Text ✅
@app.post("/datasets/{dataset_id}/document/create-by-text")
def create_document_by_text(dataset_id: str, create_data: CreateDocumentByText):
    url = f"{DIFY_API_URL}/datasets/{dataset_id}/document/create-by-text"
    payload = create_data.model_dump()
    response = requests.post(url, headers=dataset_headers, json=payload)
    if response.status_code == 200:
        return response.json()
    print(response.json())
    return JSONResponse(
        content={
            "error": "Failed to create document",
            "status_code": response.status_code,
        },
        status_code=response.status_code,
    )


# Update a Document with Text ✅
@app.post("/datasets/{dataset_id}/documents/{document_id}/update-by-text")
def update_document_by_text(
    dataset_id: str, document_id: str, update_data: UpdateDocumentByText
):
    url = f"{DIFY_API_URL}/datasets/{dataset_id}/documents/{document_id}/update-by-text"
    payload = update_data.model_dump()

    response = requests.post(url, headers=dataset_headers, json=payload)

    if response.status_code == 200:
        return response.json()  # Return the response JSON
    else:
        print(f"Error Response - Status Code: {response.status_code}")
        print(response.json())
        return JSONResponse(
            content={
                "error": "Failed to update document",
                "status_code": response.status_code,
            },
            status_code=response.status_code,
        )


# Create a Document with File ✅
@app.post("/datasets/{dataset_id}/document/create-by-file")
async def create_document_with_file(dataset_id: str, file: UploadFile = File(...)):
    url = f"{DIFY_API_URL}/datasets/{dataset_id}/document/create-by-file"

    data = {
        "data": json.dumps(
            {
                "indexing_technique": "high_quality",
                "process_rule": {
                    "rules": {
                        "pre_processing_rules": [
                            {"id": "remove_extra_spaces", "enabled": True},
                            {"id": "remove_urls_emails", "enabled": True},
                        ],
                        "segmentation": {"separator": "###", "max_tokens": 500},
                    },
                    "mode": "custom",
                },
            }
        )
    }

    files = {"file": (file.filename, await file.read(), "text/plain")}
    try:
        response = requests.post(
            url, headers=dataset_headers_file, data=data, files=files
        )

        if response.status_code == 200:
            return response.json()  # Returning the API response back to the user
        else:
            raise HTTPException(
                status_code=response.status_code, detail="Error from Dify API"
            )

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))


# Update a Document with File ✅
@app.post("/datasets/{dataset_id}/documents/{document_id}/update-by-file")
async def update_document_with_file(
    dataset_id: str, document_id: str, file: UploadFile = File(...)
):
    url = f"{DIFY_API_URL}/datasets/{dataset_id}/documents/{document_id}/update-by-file"

    data = {
        "data": json.dumps(
            {
                "name": "Updated file",
                "indexing_technique": "high_quality",
                "process_rule": {
                    "rules": {
                        "pre_processing_rules": [
                            {"id": "remove_extra_spaces", "enabled": True},
                            {"id": "remove_urls_emails", "enabled": True},
                        ],
                        "segmentation": {"separator": "###", "max_tokens": 500},
                    },
                    "mode": "custom",
                },
            }
        )
    }

    files = {"file": (file.filename, await file.read(), "text/plain")}

    try:
        # Making the POST request to Dify API
        response = requests.post(
            url, headers=dataset_headers_file, data=data, files=files
        )

        if response.status_code == 200:
            return response.json()  # Returning the API response back to the user
        else:
            raise HTTPException(
                status_code=response.status_code, detail="Error from Dify API"
            )

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))


# Delete a Document ✅
@app.delete("/datasets/{dataset_id}/documents/{document_id}")
def delete_document(dataset_id: str, document_id: str):
    url = f"{DIFY_API_URL}/datasets/{dataset_id}/documents/{document_id}"
    response = requests.delete(url, headers=dataset_headers)
    if response.status_code == 200:
        return response.json()
    return JSONResponse(
        content={
            "error": "Failed to delete document",
            "status_code": response.status_code,
        },
        status_code=response.status_code,
    )


# Get the Document List of a Knowledge Base ✅
@app.get("/datasets/{dataset_id}/documents")
def get_document_list(dataset_id: str):
    url = f"{DIFY_API_URL}/datasets/{dataset_id}/documents"
    response = requests.get(url, headers=dataset_headers)
    if response.status_code == 200:
        return response.json()
    return JSONResponse(
        content={
            "error": "Failed to get document list",
            "status_code": response.status_code,
        },
        status_code=response.status_code,
    )


class ChatMessage(BaseModel):
    query: str
    conversation_id: str


# Send Chat Message ✅
@app.post("/chat-message")
def send_chat_message(chat: ChatMessage):
    query = chat.query
    conversation_id = chat.conversation_id
    url = "https://api.dify.ai/v1/chat-messages"

    conv_headers = {
        "Authorization": f"Bearer {DIFY_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "inputs": {},
        "query": query,
        "response_mode": "blocking",
        "conversation_id": conversation_id,
        "user": "abc-123",
    }
    print(f"URL: {url}")
    print(f"Headers: {conv_headers}")
    print(f"Data: {data}")

    response = requests.post(url, headers=conv_headers, json=data)

    print(f"Status Code: {response.status_code}")
    print(f"Response Text: {response.text}")

    if response.status_code == 200:
        return response.json()
    else:
        return {
            "error": "Failed to send the message",
            "status_code": response.status_code,
            "message": response.text,
        }


# Get Conversation ✅
@app.get("/conversations")
def get_conversations():
    url = f"{DIFY_API_URL}/conversations?user=abc-123&last_id=&limit=20"

    response = requests.get(url, headers=headers)

    print(f"Making request to: {url}")
    print(f"Headers: {headers}")
    print(f"Status Code: {response.status_code}")
    print(f"Response Text: {response.text}")

    if response.status_code == 200:
        return response.json()
    else:
        return {
            "error": "Failed to fetch conversations",
            "status_code": response.status_code,
        }


# Get Conversation History ✅
@app.get("/messages")
def get_messages(conversation_id: str):
    url = f"{DIFY_API_URL}/messages?user=abc-123&conversation_id={conversation_id}"

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return {
            "error": "Failed to fetch messages",
            "status_code": response.status_code,
        }


# Send Texts Read from Image
@app.post("/ocr")
async def ocr_image(image: UploadFile = File(...)):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = PATH_TO_GCV_JSON_FILE
    client = vision.ImageAnnotatorClient()
    content = await image.read()
    vision_image = vision.Image(content=content)

    response = client.text_detection(image=vision_image)
    texts = response.text_annotations
    result_text = texts[0].description if texts else "No text found"

    return {"text": result_text}
