from flask import Blueprint, render_template, redirect, url_for, request, flash

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Add logic to check user credentials (e.g., query database)
        if email == "test@example.com" and password == "password123":  # Example check
            flash('Logged in successfully!', category='success')
            return redirect(url_for('routes.home'))
        else:
            flash('Login failed. Check your email and password.', category='error')

    return render_template('login.html')
