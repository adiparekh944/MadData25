from flask_sqlalchemy import SQLAlchemy
from api import app, Data  # Import your Flask app and model

with app.app_context():
    records = Data.query.all()
    for record in records:
        print(record.key, record.value)