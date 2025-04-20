import os
import sys
import time
import requests
import subprocess
import json
from PIL import Image
from io import BytesIO

def start_ngrok():
    """Start ngrok and return the public URL"""
    # Start ngrok in the background
    ngrok_process = subprocess.Popen(['ngrok', 'http', '5000'], 
                                   stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE)
    
    # Wait for ngrok to start and get the URL
    time.sleep(2)  # Give ngrok time to start
    
    # Get the ngrok URL from the API
    try:
        response = requests.get('http://localhost:4040/api/tunnels')
        data = response.json()
        public_url = data['tunnels'][0]['public_url']
        return public_url, ngrok_process
    except Exception as e:
        print(f"Error getting ngrok URL: {e}")
        ngrok_process.terminate()
        return None, None

def upload_to_ephemeral(image_path, ngrok_url):
    """Upload image to ephemeral server and get public URL"""
    url = f"{ngrok_url}/upload_temp"
    with open(image_path, 'rb') as img:
        files = {'image': img}
        response = requests.post(url, files=files)
        if response.status_code == 200:
            # Ensure we use https in the returned URL
            image_url = response.json()['url']
            return image_url.replace('http://', 'https://')
    return None

def search_with_searchapi(image_url):
    """Search for products using SearchAPI.io"""
    search_api_url = "https://www.searchapi.io/api/v1/search"
    params = {
        "engine": "google_lens",
        "search_type": "products",
        "url": image_url,
        "api_key": "pZx3VsZpHF4j8vQ776g2Ew56"
    }
    
    try:
        response = requests.get(search_api_url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error in search: {e}")
        print(f"Full error response: {response.text if 'response' in locals() else 'No response'}")
        return None

def main(image_path):
    # Start ngrok and get public URL
    print("Starting ngrok...")
    ngrok_url, ngrok_process = start_ngrok()
    if not ngrok_url:
        print("Failed to start ngrok")
        return
    
    print(f"Ngrok URL: {ngrok_url}")
    
    # Upload image to ephemeral server
    print("Uploading image to ephemeral server...")
    public_image_url = upload_to_ephemeral(image_path, ngrok_url)
    if not public_image_url:
        print("Failed to upload image")
        ngrok_process.terminate()
        return
    
    print(f"Public image URL: {public_image_url}")
    
    # Search for products
    print("Searching for products...")
    results = search_with_searchapi(public_image_url)
    if results:
        print("\nSearch Results:")
        print(json.dumps(results, indent=2))
    else:
        print("No results found")
    
    # Clean up
    ngrok_process.terminate()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python automated_search.py <path_to_image>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"Error: File '{image_path}' not found")
        sys.exit(1)
    
    main(image_path) 