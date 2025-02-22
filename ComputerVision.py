import sys
import openai
from PIL import Image
from transformers import pipeline

# Set your OpenAI API key
openai.api_key = "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"

# Initialize local object detection model
object_detector = pipeline("object-detection", model="facebook/detr-resnet-50")

# Open and prepare the image
image_path = "maxresdefault.jpg"
image = Image.open(image_path).convert("RGB")

# Detect objects
detections = object_detector(image)

# Build a list of detected objects
objects_summary = []
for det in detections:
    objects_summary.append(f"{det['label']} ({det['score']:.2f})")
objects_text = ", ".join(objects_summary)

# Prepare prompt for GPT
prompt = (
    "You are a helpful assistant. Here is a list of objects detected in an image:\n\n"
    f"{objects_text}\n\n"
    "Please provide a brief, natural language description of what might be happening in the image."
)

# Call GPT model
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": prompt}],
    max_tokens=100,
    temperature=0.7
)

# Print results
print("=== Object Detection Results ===")
for det in detections:
    print(f"Label: {det['label']}, Confidence: {det['score']:.2f}")
print("\n=== GPT Description ===")
print(response["choices"][0]["message"]["content"].strip())