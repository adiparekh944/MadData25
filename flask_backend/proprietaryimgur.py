# image_server.py

import os
import base64
from io import BytesIO
from uuid import uuid4
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from PIL import Image

# ───── Config ────────────────────────────────────────────────────────────────
UPLOAD_FOLDER    = "uploads"
ALLOWED_EXTS     = {"png", "jpg", "jpeg", "gif"}
HOST             = "0.0.0.0"
PORT             = 5000

app = Flask(__name__)
CORS(app)  # allow public access
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ───── Helpers ───────────────────────────────────────────────────────────────
def allowed_file(fn: str) -> bool:
    return "." in fn and fn.rsplit(".",1)[1].lower() in ALLOWED_EXTS

def strip_exif_and_save_pil(img: Image.Image, out_path: str):
    clean = Image.new(img.mode, img.size)
    clean.putdata(list(img.getdata()))
    clean.save(out_path, format="JPEG")

def make_url(filename: str) -> str:
    return f"{request.host_url.rstrip('/')}/images/{filename}"

# ───── Endpoints ────────────────────────────────────────────────────────────
@app.route("/upload", methods=["POST"])
def upload_form():
    """
    Accepts multipart/form-data under field "image".
    Returns JSON: { "url": "<public‑url>" }
    """
    if "image" not in request.files:
        return jsonify({"error":"No file part"}), 400

    file = request.files["image"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error":"Invalid filename"}), 400

    fname = f"{uuid4().hex}.jpg"
    out_path = os.path.join(app.config["UPLOAD_FOLDER"], fname)
    try:
        img = Image.open(file.stream)
        strip_exif_and_save_pil(img, out_path)
    except Exception as e:
        return jsonify({"error":f"Processing failed: {e}"}), 500

    return jsonify({"url": make_url(fname)}), 200

@app.route("/upload_json", methods=["POST"])
def upload_json():
    """
    Mimics Imgur’s JSON API:
      POST { name: "...", value: [ "data:image/jpeg;base64,...", ... ] }
      → { data: [ { link: "..." }, ... ] }
    """
    payload = request.get_json(silent=True)
    if not payload or "value" not in payload:
        return jsonify({"error":"Invalid JSON"}), 400

    links = []
    for b64str in payload["value"]:
        # strip data URI header if present
        header, data = (b64str.split(",",1) if "," in b64str else (None,b64str))
        try:
            img_data = base64.b64decode(data)
            img = Image.open(BytesIO(img_data))
        except Exception:
            continue

        fname = f"{uuid4().hex}.jpg"
        out_path = os.path.join(app.config["UPLOAD_FOLDER"], fname)
        strip_exif_and_save_pil(img, out_path)
        links.append({"link": make_url(fname)})

    return jsonify({"data": links}), 200

@app.route("/images/<filename>")
def serve_image(filename):
    if not allowed_file(filename):
        abort(404)
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# ───── Runner ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host=HOST, port=PORT)
