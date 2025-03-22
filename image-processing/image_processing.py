import os
import base64
import cv2
import numpy as np
import re
import requests
from ultralytics import YOLO
from werkzeug.utils import secure_filename

# Configure folders for temporary storage
TEMP_FOLDER = "temp_crops"
os.makedirs(TEMP_FOLDER, exist_ok=True)

# Load the YOLOv8 model (load it once globally for efficiency)
model = YOLO("yolov8n.pt")

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

def upload_to_imgur(image_path):
    """
    Upload an image file to Imgur and return its public URL.
    """
    IMGUR_CLIENT_ID = "e3d0e258f76e006"
    url = "https://api.imgur.com/3/upload"
    headers = {"Authorization": f"Client-ID {IMGUR_CLIENT_ID}"}
    with open(image_path, "rb") as img_file:
        response = requests.post(url, headers=headers, files={"image": img_file})
    if response.status_code == 200:
        return response.json()["data"]["link"]
    else:
        print("Error uploading to Imgur:", response.text)
        return None

def process_detections(image, detections, base_name: str):
    """
    Process each detection: crop the detected region, upload it to Imgur,
    and query a search API to extract product details.
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
        
        # Upload cropped image to Imgur
        image_url = upload_to_imgur(crop_path)
        if not image_url:

            continue

        # Query search API (Google Lens engine) for product details
        search_api_url = "https://www.searchapi.io/api/v1/search"
        params = {
            "engine": "google_lens",
            "search_type": "all",
            "url": image_url,
            "api_key": "CDM8R5vsoLjsnTryw7MMUDJn"
        }
        try:
            response = requests.get(search_api_url, params=params, timeout=15)
            s = response.text
            title_match = re.search(r'"title":\s*"([^"]*)', s)
            title = title_match.group(1) if title_match else "N/A"
            link_match = re.search(r'"link":\s*"([^"]*)', s)
            link = link_match.group(1) if link_match else "N/A"
            price_match = re.search(r'"price":\s*"([^"]*)', s)
            price = price_match.group(1) if price_match else "N/A"
            
            detected_items.append({
                "title": title,
                "link": link,
                "price": price,
                "imgur_url": image_url
            })
        except Exception as e:
            detected_items.append({
                "title": "Error",
                "link": "",
                "price": str(e),
                "imgur_url": image_url
            })
        
        # Clean up temporary cropped image file
        os.remove(crop_path)
        
    return detected_items

def process_image(base64_image: str, base_name: str):
    image = decode_base64_image(base64_image)
    detections = detect_objects(image)
    detected_items = process_detections(image, detections, base_name)
    return detected_items
