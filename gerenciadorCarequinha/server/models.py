from app import db

class Alunos(db.Model):

    __tablename__ = 'alunos'

    pid             = db.Column(db.Integer, primary_key=True)
    nome            = db.Column(db.Text, nullable = False)
    data_nascimento = db.Column(db.Text, nullable = False)
    telefone        = db.Column(db.Text)
    nome_pai1       = db.Column(db.Text)
    nome_pai2       = db.Column(db.Text)
    endereco        = db.Column(db.Text)
    numero          = db.Column(db.Text)
    sala            = db.Column(db.Text)
    idade           = db.Column(db.Integer)
    sexo            = db.Column(db.Text)

    def to_dict(self):
        return{
            'pid': self.pid,
            'nome': self.nome,
            'dataNascimento': self.data_nascimento,
            'telefone': self.telefone,
            'nomePai1': self.nome_pai1,
            'nomePai2': self.nome_pai2,
            'endereco': self.endereco,
            'numero': self.numero,
            'sala': self.sala,
            'idade': self.idade,
            'sexo': self.sexo,

        }
    def __repr__(self):
        return f'<Aluno {self.nome}, Sala {self.sala}>'


    