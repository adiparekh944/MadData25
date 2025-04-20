# ephemeral_image_server.py

import os
import time
import threading
from uuid import uuid4
from io import BytesIO

from flask import Flask, request, jsonify, send_from_directory, abort
from PIL import Image

# ───── Config ────────────────────────────────────────────────────────────────
UPLOAD_FOLDER    = "temp_uploads"
TTL_SECONDS      = 300       # how long the URL stays valid
CLEANUP_INTERVAL = 1       # how often to purge expired files

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# filename → expiry timestamp
expiry = {}

# Lock so only one upload is processed at a time
upload_lock = threading.Lock()

# ───── Background cleanup ─────────────────────────────────────────────────────
def cleanup_task():
    while True:
        now = time.time()
        expired = [fn for fn, exp in expiry.items() if exp <= now]
        for fn in expired:
            path = os.path.join(UPLOAD_FOLDER, fn)
            try:
                os.remove(path)
            except FileNotFoundError:
                pass
            expiry.pop(fn, None)
        time.sleep(CLEANUP_INTERVAL)

threading.Thread(target=cleanup_task, daemon=True).start()

# ───── Helpers ────────────────────────────────────────────────────────────────
def strip_exif_and_save(stream, out_path):
    img = Image.open(stream)
    clean = Image.new(img.mode, img.size)
    clean.putdata(list(img.getdata()))
    clean.save(out_path, format="JPEG")

# ───── Endpoints ──────────────────────────────────────────────────────────────
@app.route("/upload_temp", methods=["POST"])
def upload_temp():
    # Only one upload at once; others immediately get 429
    if not upload_lock.acquire(blocking=False):
        return '', 429

    try:
        if "image" not in request.files:
            return jsonify({"error": "No 'image' part"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        # generate unique filename
        fname = f"{uuid4().hex}.jpg"
        out_path = os.path.join(app.config["UPLOAD_FOLDER"], fname)

        try:
            strip_exif_and_save(file.stream, out_path)
        except Exception as e:
            return jsonify({"error": f"Processing failed: {e}"}), 500

        # set expiry timestamp
        expiry[fname] = time.time() + TTL_SECONDS

        # return the public URL
        url = f"{request.host_url.rstrip('/')}/images/{fname}"
        return jsonify({"url": url}), 200

    finally:
        upload_lock.release()

@app.route("/images/<filename>")
def serve_image(filename):
    # only serve if still valid
    if filename not in expiry or expiry[filename] < time.time():
        abort(404)
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# ───── Run ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
