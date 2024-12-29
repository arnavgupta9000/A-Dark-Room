from flask import Blueprint, render_template, jsonify
from flask_login import current_user
from models import User


routes = Blueprint('routes', __name__)

@routes.route('/')
def home():
    return render_template('home.html')  

@routes.route('/has_played')
def has_played():
    if current_user.is_authenticated:
        
        user = User.query.get(current_user.id)
        return jsonify({'played': user.has_played})
    else:
        return jsonify({'played': False})
