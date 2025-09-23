

## ClaimReady — How It Works and How to Run It

This document explains what ClaimReady does, the end‑to‑end flow a user goes through, the APIs involved, and how to run the app locally.

---

## What is ClaimReady?
ClaimReady streamlines insurance claim preparation by analyzing photos of damaged property and extracting items with estimated prices. Users can optionally provide an address to enrich results. The app then presents a structured list of detected items and costs to help users quickly assemble a claim.

---

## User Journey
1. Open the web app.
2. Upload one or more photos of the damaged property.
3. Optionally enter the property address.
4. Submit the photos (and address if provided).
5. The backend processes the images and returns detected items with estimated prices.
6. The UI displays a table of detected items and any address‑based matches.

---

## System Flow (High Level)
- Frontend (React): Handles image selection (multiple files), previews, and submission.
- Backend (Flask API):
  - Receives base64‑encoded images.
  - Runs detection/valuation to produce a list of items with prices.
  - Optionally processes the provided address to look up matching data.
- Response is rendered in the UI as a table of items and any address‑specific additions.

---

## API Overview

### POST `/api/upload`
Uploads the user’s images for detection/valuation.

Request body (JSON):
```json
{
  "name": "User's Upload",
  "value": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/png;base64,iVBORw0KGgoAAA..."
  ]
}
```

Typical response (JSON):
```json
{
  "detected_items": [
    { "title": "Sofa", "price": "$450" },
    { "title": "Coffee Table", "price": "$120" }
  ]
}
```

Notes:
- The frontend converts selected `File` objects to base64 strings before sending.
- The UI will append each detected item to the results table.

### POST `/api/address`
Optionally enriches results using an address string.

Request body (JSON):
```json
{ "address": "123 Main St, Springfield, USA" }
```

Typical behavior:
- If the address matches known data, the UI prepends a line item (e.g., matched street with an associated price) to the table.

---

## Frontend Behavior (Key Points)
- Users can select multiple images. Each file is previewed in the UI.
- On submit, the app:
  - Converts all selected files to base64.
  - Sends them to `/api/upload`.
  - Optionally sends the address to `/api/address` if provided.
  - Renders the combined results in a table.

---

## Run the Application

### 1) Install Docker
Ensure you have Docker Desktop installed and running.  
[Get Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2) Navigate to the project directory
Open a terminal and `cd` into the repository root.

### 3) Start services

Development (auto‑rebuild on changes):
```bash
docker-compose -f docker-compose-build-run.yml up
```

Production‑style run (no rebuild on changes):
```bash
docker-compose -f docker-compose-run.yml up
```

### 4) Access the app
- Frontend (React dev server): [`https://localhost:3000`](https://localhost:3000)
- Backend (Flask API): [`https://localhost:8080`](https://localhost:8080)

Note: If your environment uses different hosts/ports (e.g., a LAN IP or another port), update the frontend configuration/endpoints accordingly.

---

## Troubleshooting
- Ensure Docker Desktop is running before starting containers.
- If containers fail to start or dependencies change, rebuild:
```bash
docker-compose -f docker-compose-build-run.yml up --build
```
- Verify that your browser trusts the local HTTPS certificates if accessing via `https://localhost`.
- If the frontend cannot reach the API, confirm the API base URL and CORS settings match your environment.

---

## Notes for Developers
- The upload flow expects base64‑encoded images in the `value` array.
- The UI consumes `detected_items` where each item includes a `title` and `price` (e.g., `"$120"`).
- If you change API schemas, update both the backend response and the frontend mapping logic accordingly.

