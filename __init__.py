from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import path

db = SQLAlchemy()
db_name = 'database.db'

login_manager = LoginManager()
login_manager.login_view = 'auth.py'

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(int(user_id))



def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = ';;'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_name}'
    from models import User

    db.init_app(app)
    login_manager.init_app(app)
    create_database(app)

    from auth import auth
    from routes import routes

    app.register_blueprint(auth, url_prefix='/')  
    app.register_blueprint(routes, url_prefix='/')


    return app

def create_database(app):
    if not path.exists('database.db'):
        with app.app_context():
            db.create_all() 
    print('Created databse')