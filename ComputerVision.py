#search api
import requests

url = "https://www.searchapi.io/api/v1/search"
params = {
  "engine": "google_lens",
  "search_type": "products",
  "url": "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/25718390/247372_MacBook_Pro_M4_ADiBenedetto_0029.jpg?quality=90&strip=all&crop=0,0,100,100",
  "api_key": "TW4jfuXGPnQq34cT32WBVKCv"
}

response = requests.get(url, params=params)
print(response.text)
