import requests

# Imgur API details
IMGUR_CLIENT_ID = "9902583ad9db49f"
URL = "https://api.imgur.com/3/upload"

# Test image (replace with an actual file path on your machine)
TEST_IMAGE_PATH = "Screenshot20250222191110.png"  # Make sure this image exists

# Headers for Imgur API
headers = {"Authorization": f"Client-ID {IMGUR_CLIENT_ID}"}

# Upload request
with open(TEST_IMAGE_PATH, "rb") as img_file:
    response = requests.post(URL, headers=headers, files={"image": img_file})

# Check response
if response.status_code == 200:
    image_url = response.json()["data"]["link"]
    print(f"✅ API Key works! Uploaded image URL: {image_url}")
else:
    print(f"❌ API Key might be invalid. Error {response.status_code}: {response.text}")