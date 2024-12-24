from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = ';;'

    from auth import auth
    from routes import routes

    app.register_blueprint(auth, url_prefix='/')  
    app.register_blueprint(routes, url_prefix='/')


    return app
