from flask import Flask, render_template, session, make_response, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import migrate

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./testtdb.db'

    db.init_app(app)

    migrate = Migrate(app, db)
    
    return app

app.secret_key = 'SOME KEY'

@app.route('/')
def index():
    return render_template('index.html', message ='Index')

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


