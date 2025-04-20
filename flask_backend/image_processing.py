import os
import base64
import cv2
import numpy as np
import re
import requests
from ultralytics import YOLO
from werkzeug.utils import secure_filename
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Configure folders for temporary storage
TEMP_FOLDER = "temp_crops"
os.makedirs(TEMP_FOLDER, exist_ok=True)

# Load the YOLOv8 model (load it once globally for efficiency)
model = YOLO("yolov8n.pt")

# Configure requests session with retry logic
session = requests.Session()
retries = Retry(total=3,
                backoff_factor=1,
                status_forcelist=[429, 500, 502, 503, 504])
session.mount('https://', HTTPAdapter(max_retries=retries))

def decode_base64_image(base64_image: str):
    """
    Decode a base64-encoded image string into an OpenCV image.
    """
    if "," in base64_image:
        _, base64_image = base64_image.split(",", 1)
    try:
        img_data = base64.b64decode(base64_image)
    except Exception as e:
        raise ValueError("Invalid base64 data: " + str(e))
    nparr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode image from base64 data")
    return image

def detect_objects(image):
    """
    Run YOLO detection on the image and return detected bounding boxes.
    """
    results = model.predict(image)
    detections = results[0].boxes
    return detections

def upload_to_proprietary(image_path):
    """
    Upload an image file to our local server (now accessible via ngrok) and return its public URL.
    """
    # Get the ngrok URL from the ngrok web interface
    # You'll need to replace this with the actual ngrok URL shown in the terminal
    ngrok_url = "https://YOUR_NGROK_URL"  # Replace with actual ngrok URL
    
    url = f"{ngrok_url}/upload"
    with open(image_path, "rb") as img_file:
        response = requests.post(url, files={"image": img_file})
    
    if response.status_code == 200:
        # Replace localhost with ngrok URL in the response
        local_url = response.json()["url"]
        public_url = local_url.replace("http://localhost:5000", ngrok_url)
        return public_url
    else:
        print("Error uploading to server:", response.text)
        return None

def search_product(image_path):
    """
    Query search API for product details with retry logic and increased timeout.
    """
    search_api_url = "https://www.searchapi.io/api/v1/search"
    
    # Read and encode the image in base64
    with open(image_path, "rb") as img_file:
        base64_image = base64.b64encode(img_file.read()).decode('utf-8')
    
    params = {
        "engine": "google_lens",
        "search_type": "shopping",
        "image_data": base64_image,
        "api_key": "pZx3VsZpHF4j8vQ776g2Ew56"
    }
    
    try:
        response = session.get(search_api_url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        print(f"Search API Response: {data}")  # Debug logging
        
        # Extract results from the response
        if 'shopping_results' in data:
            results = []
            for item in data['shopping_results']:
                result = {
                    'title': item.get('title', 'N/A'),
                    'link': item.get('link', 'N/A'),
                    'price': item.get('price', 'N/A'),
                    'image_url': item.get('image', 'N/A')
                }
                results.append(result)
            return results
        else:
            return [{
                'title': 'Error',
                'link': 'N/A',
                'price': 'No shopping results found',
                'image_url': 'N/A'
            }]
    except Exception as e:
        print(f"Error in search_product: {str(e)}")
        return [{
            'title': 'Error',
            'link': 'N/A',
            'price': str(e),
            'image_url': 'N/A'
        }]

def process_detections(image, detections, base_name: str):
    """
    Process each detection: crop the detected region and query search API directly.
    Returns a list of dictionaries with details.
    """
    detected_items = []
    for i, box in enumerate(detections):
        x1, y1, x2, y2 = box.xyxy[0]
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        cropped = image[y1:y2, x1:x2]

        # Save cropped image temporarily
        crop_filename = secure_filename(f"{base_name}_{i}.jpg")
        crop_path = os.path.join(TEMP_FOLDER, crop_filename)
        cv2.imwrite(crop_path, cropped)
        
        # Search for product details using the image file directly
        search_results = search_product(crop_path)
        detected_items.append({
            **search_results[0],
            "image_path": crop_path  # Store local path instead of URL
        })
        
        # Clean up temporary cropped image file
        os.remove(crop_path)
        
    return detected_items

def process_image(base64_image: str, base_name: str):
    image = decode_base64_image(base64_image)
    detections = detect_objects(image)
    detected_items = process_detections(image, detections, base_name)
    return detected_items
