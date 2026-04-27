from flask_login import UserMixin

from app import db


class Alunos(db.Model):
    __tablename__ = 'alunos'

    pid = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.Text, nullable = False)
    age = db.Column(db.Integer)
    job = db.Column(db.Text)

    def __repr__(self):
        return f'Aluno {self.name}, idade {self.age}, {self.job}'
    
class User(db.Model, UserMixin):
    __tablename__ = 'users'

    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable = False)
    password = db.Column(db.String, nullable = False)
    role = db.Column(db.String)
    description = db.Column(db.String)

    def __repr__(self):
        return f'<User: {self.username}, Role: {self.role}>'
    
    def get_id(self):
        return self.uid