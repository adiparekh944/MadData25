import os
import csv
import requests
import YOLOv8

# Function to uplooad an image to Imgur
def upload_to_imgur(image_path):
    """Uploads an image to Imgur and returns the public URL."""
    IMGUR_CLIENT_ID = "1a23edae30fd974"
    url = "https://api.imgur.com/3/upload"
    headers = {"Authorization": f"Client-ID {IMGUR_CLIENT_ID}"}

    with open(image_path, "rb") as img_file:
        response = requests.post(url, headers=headers, files={"image": img_file})

    if response.status_code == 200:
        return response.json()["data"]["link"]
    else:
        print("Error uploading to Imgur:", response.text)
        return None

folder_path = "detected_objects"
csv_filename = "image_urls.csv"

# Open the csv file in write mode
with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Image URL"])

    for filename in os.listdir(folder_path):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            image_path = os.path.join(folder_path, filename)
            image_url = upload_to_imgur(image_path)
            if image_url:
                print("Image URL:", image_url)
                # Write the URL to a neww row in the csv
                writer.writerow([image_url])

print(f"All detected image URLs have been written to '{csv_filename}'.")
