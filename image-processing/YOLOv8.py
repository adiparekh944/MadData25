import os
import cv2
from ultralytics import YOLO

# Load the YOLOv8 model
model = YOLO("yolov8n.pt")
IMAGE_PATH = "maxresdefault.jpg"
results = model.predict(IMAGE_PATH)

OUTPUT_FOLDER = "detected_objects"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Read the originaal image
image = cv2.imread(IMAGE_PATH)
if image is None:
    raise ValueError(f"Could not read image: {IMAGE_PATH}")

detections = results[0].boxes
cropped_image_paths = []

for i, box in enumerate(detections):
    x1, y1, x2, y2 = box.xyxy[0]
    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
    cropped = image[y1:y2, x1:x2]

    # Convert label (class index)) and confidence to usable values
    label = int(box.cls)
    confidence = float(box.conf)
    class_name = results[0].names[label]

    out_filename = f"{class_name}_{confidence:.2f}_{i}.jpg"
    out_path = os.path.join(OUTPUT_FOLDER, out_filename)
    cv2.imwrite(out_path, cropped)
    cropped_image_paths.append(out_path)

    print(f"Saved cropped object: {out_path}")
