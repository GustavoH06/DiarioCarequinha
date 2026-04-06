from flask import render_template, request, render_template, session, make_response, flash

from models import Alunos

def register_routes(app, db):
    app.secret_key = 'SOME KEY'

    

    @app.route('/')
    def index():
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

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'GET':
            return render_template('login.html')
        elif request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            if username == 'terez' and password == 'password':
                flash('Login')            
                return render_template('index.html', message = '')
            else:
                flash('Login failed')
                return render_template('index.html', message='')

    @app.route('/testes')
    def outro():
        return render_template('other.html')

    ##@app.route('/redirect_endpoint')
    ##def redirect_endpoint():
    ##    return redirect(url_for('outro'))