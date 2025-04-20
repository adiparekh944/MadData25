import base64
import requests
import sys
import os
import json

def image_to_base64(image_path):
    """Convert image file to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def test_image_search(image_path):
    """Test the full image processing and search pipeline"""
    # Convert image to base64
    base64_image = image_to_base64(image_path)
    print(f"\nImage converted to base64 (first 100 chars): {base64_image[:100]}...")
    
    # Send to our processing endpoint
    url = "http://localhost:8000/process_image"
    data = {
        "base64_image": base64_image,
        "base_name": os.path.basename(image_path)
    }
    
    try:
        print("\nSending request to processing endpoint...")
        response = requests.post(url, json=data)
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            results = response.json()
            print("\nRaw API Response:")
            print(json.dumps(results, indent=2))
            
            print("\nSearch Results:")
            print("-" * 50)
            for i, item in enumerate(results, 1):
                print(f"\nItem {i}:")
                print(f"Title: {item['title']}")
                print(f"Link: {item['link']}")
                print(f"Price: {item['price']}")
                print(f"Image URL: {item['image_url']}")
                print("-" * 50)
        else:
            print(f"Error: {response.status_code}")
            print("Response text:", response.text)
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_image_search.py <path_to_image>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"Error: File '{image_path}' not found")
        sys.exit(1)
    
    test_image_search(image_path) 