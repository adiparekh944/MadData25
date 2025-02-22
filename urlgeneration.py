import requests

def upload_to_imgur(image_path):
    """Uploads an image to Imgur and returns the public URL."""
    IMGUR_CLIENT_ID = "5fb76597242769d"  # Replace with your Client ID
    url = "https://api.imgur.com/3/upload"
    headers = {"Authorization": f"Client-ID {IMGUR_CLIENT_ID}"}
    
    with open(image_path, "rb") as img_file:
        response = requests.post(url, headers=headers, files={"image": img_file})

    if response.status_code == 200:
        return response.json()["data"]["link"]  # Get the public URL
    else:
        print("Error uploading to Imgur:", response.text)
        return None

# Example: Upload an image
image_url = upload_to_imgur("applepic2.jpg")
if image_url:
    print("Image URL:", image_url)
