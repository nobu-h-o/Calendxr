import os
import json
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import vision
from google.oauth2 import service_account


# load environment variables from .env
load_dotenv()
DIFY_API_KEY = os.getenv("DIFY_API_KEY")
DIFY_API_DATASET_KEY = os.getenv("DIFY_API_DATASET_KEY")
DIFY_API_URL = os.getenv("DIFY_API_URL")

# Load Google Cloud credentials from environment variables
TYPE = os.getenv("TYPE")
PROJECT_ID = os.getenv("PROJECT_ID")
PRIVATE_KEY_ID = os.getenv("PRIVATE_KEY_ID")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CLIENT_EMAIL = os.getenv("CLIENT_EMAIL")
CLIENT_ID = os.getenv("CLIENT_ID")
AUTH_URI = os.getenv("AUTH_URI")
TOKEN_URI = os.getenv("TOKEN_URI")
AUTH_PROVIDER_X509_CERT_URL = os.getenv("AUTH_PROVIDER_X509_CERT_URL")
CLIENT_X509_CERT_URL = os.getenv("CLIENT_X509_CERT_URL")
UNIVERSE_DOMAIN = os.getenv("UNIVERSE_DOMAIN")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Send Texts Read from Image
@app.post("/ocr")
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Create credentials dictionary from environment variables
        credentials_info = {
            "type": TYPE,
            "project_id": PROJECT_ID,
            "private_key_id": PRIVATE_KEY_ID,
            "private_key": PRIVATE_KEY,
            "client_email": CLIENT_EMAIL,
            "client_id": CLIENT_ID,
            "auth_uri": AUTH_URI,
            "token_uri": TOKEN_URI,
            "auth_provider_x509_cert_url": AUTH_PROVIDER_X509_CERT_URL,
            "client_x509_cert_url": CLIENT_X509_CERT_URL,
            "universe_domain": UNIVERSE_DOMAIN
        }

        # Create credentials object
        credentials = service_account.Credentials.from_service_account_info(credentials_info)

        # Create Vision client
        client = vision.ImageAnnotatorClient(
            credentials=credentials,
            client_options={"api_endpoint": "vision.googleapis.com"}
        )

        # Process the image
        content = await image.read()
        vision_image = vision.Image(content=content)
        response = client.text_detection(image=vision_image, timeout=60)
        texts = response.text_annotations
        result_text = texts[0].description if texts else "No text found"
        return {"text": result_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR service error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI is running"}

@app.get("/test-json")
def test_json():
    return {"message": "This is a test JSON response", "status": "success"}
