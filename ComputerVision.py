import openai
from PIL import Image
from transformers import pipeline

openai_client = openai.OpenAI(api_key="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")

# Initialize local object detection model
object_detector = pipeline("object-detection", model="facebook/detr-resnet-50")

# Open and prepare the image
image_path = "applepic2.jpg"
image = Image.open(image_path).convert("RGB")

# Detect objects
detections = object_detector(image)

# Build a list of detected objects
objects_summary = [f"{det['label']} ({det['score']:.2f})" for det in detections]
objects_text = ", ".join(objects_summary)

# Prepare prompt for GPT
prompt = (
    "You are a helpful assistant. Here is a list of objects detected in an image:\n\n"
    f"{objects_text}\n\n"
    "Please provide a brand name and an estimated price for each item listed."
)

# Call GPT model using OpenAI's new API format
response = openai_client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": prompt}],
    max_tokens=200,
    temperature=0.7
)

# Extract the response text
gpt_output = response.choices[0].message.content.strip()

# Print the brand name and price directly
print("=== Estimated Brand & Price ===")
print(gpt_output)
