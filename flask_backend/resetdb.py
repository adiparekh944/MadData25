with app.app_context():
    db.drop_all()   # This will drop all tables (i.e., erase your data)
    db.create_all()