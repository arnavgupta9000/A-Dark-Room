from __init__ import db
from flask_login import UserMixin

class User (db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(100), unique = True)
    password = db.Column(db.String())
    has_played = db.Column(db.Boolean, default = False)