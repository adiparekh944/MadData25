import requests
import re

# SearchAPI URL
url = "https://www.searchapi.io/api/v1/search"

# Replace with an actual image URL to test
test_image_url = "https://i.imgur.com/nX3TI2w.jpeg"

# API Key
API_KEY = "pZx3VsZpHF4j8vQ776g2Ew56"

# Request parameters
params = {
    "engine": "google_lens",
    "search_type": "visual_matches",
    "url": test_image_url,
    "api_key": API_KEY
}

# Send request
response = requests.get(url, params=params, timeout=15)

# Check response
if response.status_code == 200:
    s = response.text
    title_match = re.search(r'"title":\s*"([^"]*)', s)
    link_match = re.search(r'"link":\s*"([^"]*)', s)
    price_match = re.search(r'"price":\s*"([^"]*)', s)

    title = title_match.group(1) if title_match else "N/A"
    link = link_match.group(1) if link_match else "N/A"
    price = price_match.group(1) if price_match else "N/A"

    print(f"✅ API Key works!\nTitle: {title}\nLink: {link}\nPrice: {price}")
else:
    print(f"❌ API Key might be invalid. Error {response.status_code}: {response.text}")