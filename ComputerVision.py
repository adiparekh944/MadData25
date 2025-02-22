
import requests

url = "https://www.searchapi.io/api/v1/search"
params = {
  "engine": "google_lens",
  "search_type": "products",
  "url": "https://www.bhg.com/thmb/dcA2PxsOahxmk2LgzWAaqOWFfxU=/6000x0/filters:no_upscale():strip_icc()/200522-EB_12-Living-Room_1267-b13debcb440a4471981d7ac637e76e7a.jpg",
  "api_key": "TW4jfuXGPnQq34cT32WBVKCv"
}

response = requests.get(url, params=params)
print(response.text)