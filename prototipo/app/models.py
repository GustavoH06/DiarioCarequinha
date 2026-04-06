from app import db


class Alunos(db.Model):
    __tablename__ = 'alunos'

    pid = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.Text, nullable = False)
    age = db.Column(db.Integer)
    job = db.Column(db.Text)

    def __repr__(self):
        return f'Aluno {self.name}, idade {self.age}, {self.job}' 