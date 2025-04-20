import requests

def test_search_api():
    # Test image URL (using a public image of an apple)
    image_url = "https://e7d6-72-33-2-67.ngrok-free.app/images/02ba01041c67469d98a186e325baf0ae.jpg"
    
    # SearchAPI.io parameters
    search_api_url = "https://www.searchapi.io/api/v1/search"
    params = {
        "engine": "google_lens",
        "search_type": "all",
        "url": image_url,
        "api_key": "pZx3VsZpHF4j8vQ776g2Ew56"
    }
    
    try:
        print("Sending request to SearchAPI.io...")
        response = requests.get(search_api_url, params=params, timeout=30)
        print(f"Status code: {response.status_code}")
        print("\nResponse:")
        print(response.text)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_search_api() 