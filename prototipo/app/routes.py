from flask import render_template, request, render_template, session, make_response, flash, redirect, url_for
from flask_login import login_user, logout_user, current_user, login_required

from models import Alunos
from models import User

def register_routes(app, db, bcrypt):
    app.secret_key = 'SOME KEY'


    @app.route('/')
    def index():
        if current_user.is_authenticated:
            return render_template('index.html')
        else:
            return render_template('index.html', message ='Index')
    
    
    @app.route('/db', methods =['GET', 'POST'])
    def database():
        if request.method == 'GET':
            alunos = Alunos.query.all()
            return render_template('form.html', alunos= alunos)
        elif request.method == 'POST':
            name = request.form.get('name')
            age = int(request.form.get('age'))
            job = request.form.get('jog')

            alunos = Alunos(name=name, age= age, job=job)

            db.session.add(alunos)
            db.session.commit()
            
            alunos = Alunos.query.all()
            return render_template('form.html', alunos= alunos)
        
    @app.route('/delete/<pid>', methods=['DELETE'])
    def delete(pid):
        Alunos.query.filter(Alunos.pid == pid).delete()

        db.session.commit()
        
        alunos = Alunos.query.all()
        return render_template('index.html', alunos=alunos)
    
    @app.route('/details/<pid>')
    def details(pid):
        alunos = Alunos.query.filter(Alunos.pid == pid).first()
        return render_template('details.html', alunos=alunos)

    @app.route('/set_data')
    def set_data():
        session['name'] = 'terez'
        session['other'] = 'hello world'
        return render_template('index.html', message='Session data set.')

    @app.route('/get_data')
    def get_data():
        if 'name' in session.keys() and 'other' in session.keys():
            name = session['name']
            other = session['other']
            return render_template('index.html', message=f'Name: {name}, Other: {other}')
        else:
            return render_template('index.html', message=f'No session found')

    @app.route('/clear_session')
    def clear_session():
        session.clear()
        return render_template('index.html', message='Session clear')

    @app.route('/set_cookie')
    def set_cookie():
        response = make_response(render_template('index.html', message='Cookie set'))
        response.set_cookie('cookie_name', 'cookie_value')
        return response

    @app.route('/get_cookie')
    def get_cookie():
        cookie_value = request.cookies['cookie_name']
        return render_template('index.html', message=f'Cookie value: {cookie_value}')

    @app.route('/remove_cookie')
    def remove_cookie():
        response = make_response(render_template('index.html', message='Cookie removed'))
        response.set_cookie('cookie_name', expires=0)
        return response

    @app.route('/signup', methods=['GET', 'POST'])
    def signup():
        if request.method == 'GET':
            return render_template('signup.html')
        elif request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')

            hashed_password = bcrypt.generate_password_hash(password)

            user = User(username=username, password=hashed_password)

            db.session.add(user)
            db.session.commit()
            return redirect(url_for('index'))

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'GET':
            return render_template('login.html')
        elif request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            
            user = User.query.filter(User.username == username).first()

            if bcrypt.check_password_hash(user.password, password):
                login_user(user)            
                return redirect(url_for('index'))
            else:
                return 'failed'
    @app.route('/logout')
    def logout():
        logout_user()
        return 'Success'
    

    @app.route('/testes')
    def outro():
        return render_template('other.html')

    ##@app.route('/redirect_endpoint')
    ##def redirect_endpoint():
    ##    return redirect(url_for('outro'))