from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)


# Configure the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db = SQLAlchemy(app)

# Define a model for your data
class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    value = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "value": self.value}

with app.app_context():
    db.create_all()

# Home endpoint
@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "success", "message": "Welcome to the REST API with a Database"})

# Endpoint to handle GET (all records) and POST (create new record)
@app.route('/api/data', methods=['GET', 'POST'])
def handle_data():
    if request.method == 'GET':
        all_data = Data.query.all()
        return jsonify({"status": "success", "data": [item.to_dict() for item in all_data]})
    
    elif request.method == 'POST':
        req_data = request.get_json()
        # Expecting a JSON payload with 'name' and 'value'
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

if __name__ == '__main__':



	#This is to delete the db
	# with app.app_context():
	# 	db.drop_all()   # Drops all tables, erasing your data
	# 	db.create_all() # Creates tables based on your current model definitions
	app.run(host='0.0.0.0', port=5000, debug=True)
