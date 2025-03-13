from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import base64
import os
from werkzeug.utils import secure_filename
import csv
import sys
#r -  raw string, slashs dont matter
sys.path.append(r"/Users/soham/Documents/GitHub/MadData25/image-processing")

from image_processing import process_image
app = Flask(__name__)

# Configure the SQLite database, ORM(Object Relational Mapping) to the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Configure the upload folder
app.config['UPLOAD_FOLDER'] = 'uploads'

CORS(app)
db = SQLAlchemy(app)

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Define a model for your data
class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    value = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "value": self.value}

with app.app_context():
    db.create_all()

address_csv_file = 'housedata.csv'
address_price_mapping = {}

# --- New code to load address-price data from CSV ---
if os.path.exists(address_csv_file):
    with open(address_csv_file, mode='r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # CSV file's headers.
            street = row.get("street", "").strip()
            city   = row.get("city", "").strip()
            state  = row.get("state", "").strip()
            zipcode= row.get("zipcode", "").strip()

            # Build a normalized key in a consistent format.
            key = f"{street}, {city}, {state} {zipcode}"
            # assigns the price to the key, dictionary key
            address_price_mapping[key] = row['price']
else:
    print("CSV file for addresses not found:", address_csv_file)


# Home endpoint
@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "success", "message": "Welcome to the REST API with a Database"})

# Endpoint to handle GET (all records) and POST (create new record)
@app.route('/api/data', methods=['GET', 'POST'])
def handle_data():
    if request.method == 'GET':
        all_data = Data.query.all()
        # iterate through and return all 
        return jsonify({"status": "success", "data": [item.to_dict() for item in all_data]})
   
    elif request.method == 'POST':
        req_data = request.get_json()
        # Expecting JSON (JSON.stringify does this in the fronend) with 'name' and 'value'
        if not req_data or 'name' not in req_data or 'value' not in req_data:
            return jsonify({"status": "fail", "message": "Please provide both 'name' and 'value'"}), 400
       
        # Check if the name already exists
        if Data.query.filter_by(name=req_data['name']).first():
            return jsonify({"status": "fail", "message": "Name already exists. Use PUT to update"}), 400
       
        new_record = Data(name=req_data['name'], value=req_data['value'])
        db.session.add(new_record)
        db.session.commit()
        return jsonify({"status": "success", "message": "Record created", "data": new_record.to_dict()}), 201

# Endpoint to handle GET, PUT, DELETE for a single record based on name
@app.route('/api/data/<string:key>', methods=['GET', 'PUT', 'DELETE'])
def handle_single_data(key):
    record = Data.query.filter_by(name=key).first()
   
    if request.method == 'GET':
        if record:
            return jsonify({"status": "success", "data": record.to_dict()})
        else:
            return jsonify({"status": "fail", "message": "Name not found"}), 404

    elif request.method == 'PUT':
        if not record:
            return jsonify({"status": "fail", "message": "Name not found"}), 404
        req_data = request.get_json()
        if not req_data or 'value' not in req_data:
            return jsonify({"status": "fail", "message": "Please provide a new 'value' to update"}), 400
        record.value = req_data['value']
        db.session.commit()
        return jsonify({"status": "success", "message": "Record updated", "data": record.to_dict()})
   
    elif request.method == 'DELETE':
        if not record:
            return jsonify({"status": "fail", "message": "Name not found"}), 404
        db.session.delete(record)
        db.session.commit()
        return jsonify({"status": "success", "message": "Record deleted"})

# Endpoint to handle a list of base64 image uploads
@app.route('/api/upload', methods=['POST'])
def process_image_upload():
    req_data = request.get_json()
    if not req_data or 'name' not in req_data or 'value' not in req_data:
        return jsonify({"status": "fail", "message": "Missing 'name' or 'value' (base64 image list)"}), 400
        print("1")

    image_list = req_data['value']
    if not isinstance(image_list, list) or len(image_list) == 0:
        return jsonify({"status": "fail", "message": "'value' must be a non-empty list of base64-encoded images"}), 400
        print("2")

    detected_items_all = []
    # Process all images in the list
    for base64_image in image_list:
        print("3")
        try:
            detected_items = process_image(base64_image, req_data['name'])
            detected_items_all.extend(detected_items)

        except Exception as e:
            return jsonify({"status": "fail", "message": str(e)}), 400

    return jsonify({"status": "success", "detected_items": detected_items_all}), 200

#Endpoint to handle an input address to retrieve price
@app.route('/api/address', methods=['POST'])
def get_address_price():
    req_data = request.get_json()
    if not req_data or 'address' not in req_data:
        return jsonify({"status": "fail", "message": "Missing 'address' parameter"}), 400

    user_address = req_data['address'].strip()
    price = address_price_mapping.get(user_address)
    if price:
        return jsonify({"status": "success", "address": req_data['address'], "price": price}), 200
    else:
        return jsonify({"status": "fail", "message": "Address not found"}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)