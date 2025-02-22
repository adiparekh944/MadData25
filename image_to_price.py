import requests
import base64
from bs4 import BeautifulSoup
import re
import concurrent.futures
import time
import random

GOOGLE_VISION_API_KEY = "AIzaSyBGunia-64tqXdPmNHu1OMWniGHGuIwF8g"  

def detect_objects(image_path):
    """
    Detects objects in an image using Google Cloud Vision API.

    Args:
        image_path: Path to the image.

    Returns:
        A list of identified objects.
    """
    url = f"https://vision.googleapis.com/v1/images:annotate?key={GOOGLE_VISION_API_KEY}"

    with open(image_path, "rb") as image_file:
        image_content = base64.b64encode(image_file.read()).decode("utf-8")  # Convert to Base64

    request_data = {
        "requests": [
            {
                "image": {"content": image_content},
                "features": [{"type": "LABEL_DETECTION", "maxResults": 5}],
            }
        ]
    }

    response = requests.post(url, json=request_data)
    
    if response.status_code == 200:
        labels = response.json().get("responses", [])[0].get("labelAnnotations", [])
        return [label["description"] for label in labels]
    else:
        print("Error with Vision API:", response.text)
        return []


def get_product_info(item_name):
    """
    Searches online retailers for product pricing.

    Args:
        item_name: The name of the product.

    Returns:
        A string with the product name and estimated price.
    """
    search_query = item_name.replace(" ", "+")
    retailers = {
        "Amazon": f"https://www.amazon.com/s?k={search_query}",
        "Walmart": f"https://www.walmart.com/search/?query={search_query}",
    }

    prices = []

    
'''def scrape_retailer(retailer_name, url):
    try:
        headers_list = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0"
        ]
        headers = {"User-Agent": random.choice(headers_list)}

        time.sleep(random.uniform(3, 6))  # Introduce a delay to avoid detection

        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")
        price_elements = soup.find_all(text=re.compile(r"\$\d+(\.\d+)?"))

        prices = []
        for price_element in price_elements:
            match = re.search(r"\$\d+(\.\d+)?", price_element)
            if match:
                try:
                    price = float(match.group(0)[1:])
                    prices.append(price)
                except ValueError:
                    pass

        return prices

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error scraping {retailer_name}: {http_err}")
    except requests.exceptions.RequestException as req_err:
        print(f"Error scraping {retailer_name}: {req_err}")

    return []'''

def get_google_price(item_name):
    search_url = f"https://www.google.com/search?q={item_name.replace(' ', '+')}+price"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(search_url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        price_elements = soup.find_all(text=re.compile(r"\$\d+(\.\d+)?"))
        if price_elements:
            return f"{item_name}: Estimated price {price_elements[0]}"
    
    return f"{item_name}: Price not found."



if __name__ == "__main__":
    items = detect_objects("/Users/smyan/Desktop/Maddata/bedroom-teen1.jpg")

    for item in items:
        print(get_product_info(item))
