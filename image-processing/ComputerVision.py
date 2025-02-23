import csv
import requests
import re

# SearchAPI
url = "https://www.searchapi.io/api/v1/search"

# Default parameters
params = {
    "engine": "google_lens",
    "search_type": "all",
    "url": "",
    "api_key": "TW4jfuXGPnQq34cT32WBVKCv"
}

csv_filename = "image_urls.csv"
items = []

# Parse through csv file containing links of images and find prices using searchAPI
with open(csv_filename, "r", newline="", encoding="utf-8") as file:
    csvreader = csv.reader(file)
    header = next(csvreader, None)
    
    for row in csvreader:
        if row:
            image_url = row[0].strip()
            params["url"] = image_url

            response = requests.get(url, params=params, timeout=15)

            s = response.text
            title_match = re.search(r'"title":\s*"([^"]*)', s)
            if title_match:
                title = title_match.group(1)
            else:
                title = None

            link_match = re.search(r'"link":\s*"([^"]*)', s)
            if link_match:
                link = link_match.group(1)
            else:
                link = None

            price_match = re.search(r'"price":\s*"([^"]*)', s)
            if price_match:
                price = price_match.group(1)
            else:
                price = None

            items = ({"title": title, "link": link, "price": price})

            print(items)

            