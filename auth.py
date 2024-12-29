from flask import Blueprint, render_template, redirect, url_for, request, flash
from __init__ import db
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, current_user, logout_user

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email'] # access from the name field
        password = request.form['password']

        user = User.query.filter_by(email = email).first()

        if user:
            if check_password_hash(user.password, password):
                login_user(user)
                flash("log in successful")
                return redirect(url_for("routes.home"))
            else:
                flash("Incorrect password")
        else:
            flash("No account found with that email")
        

    return render_template('login.html')

@auth.route('/logout')
def logout():
    logout_user()
    flash("You have been logged out")
    return redirect(url_for('routes.home'))

@auth.route('/register', methods = ['GET', 'POST'])

def register():
    if request.method == "POST":

        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        user = User.query.filter_by(email = email).first()

        if user:
            flash("That user already exists, please log in")
            return render_template('login.html',user=current_user)

        if password != confirm_password:
            flash("Passwords are not the same")
            return render_template('register.html',user=current_user)

        new_user = User(email = email, password = generate_password_hash(password, method= 'pbkdf2:sha256', salt_length=8))
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user, remember= True)
        flash("Account created" )
        return redirect(url_for('routes.home'))


    
    return render_template('register.html',user=current_user)
