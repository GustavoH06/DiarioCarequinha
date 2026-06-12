from app import db

sala_alunos = db.Table(
    'sala_alunos',
    db.Column('sala_id',  db.Integer, db.ForeignKey('salas.sid'),   primary_key=True),
    db.Column('aluno_id', db.Integer, db.ForeignKey('alunos.pid'),  primary_key=True),
)

class Competencia(db.Model):
    __tablename__ = 'competencias'

    id          = db.Column(db.Integer, primary_key=True)
    aluno_id    = db.Column(db.Integer, db.ForeignKey('alunos.pid'), nullable=False)
    item_id     = db.Column(db.Text, nullable = False)
    nota        = db.Column(db.Text)
    observacao  = db.Column(db.Text)

    def to_dict(self):
        return{
            'id':           self.id,
            'alunoId':      self.aluno_id,
            'itemId':       self.item_id,
            'nota':         self.nota,
            'observacao':   self.observacao,
        }
    
class Presenca(db.Model):
    __tablename__ = 'presencas'

    id        = db.Column(db.Integer, primary_key=True)
    aluno_id  = db.Column(db.Integer, db.ForeignKey('alunos.pid'), nullable=False)
    sala_id   = db.Column(db.Integer, db.ForeignKey('salas.sid'),  nullable=False)
    data      = db.Column(db.Text, nullable=False)
    presente  = db.Column(db.Boolean, nullable=False, default=True)
 
    __table_args__ = ( db.UniqueConstraint('aluno_id', 'sala_id', 'data', name='uq_presenca_aluno_sala_data'), )

    def to_dict(self):
        return{
            'id': self.id,
            'alunoId': self.aluno_id,
            'salaId': self.sala_id,
            'data': self.data,
            'presente': self.presente,
        }

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
    idade           = db.Column(db.Integer)
    sexo            = db.Column(db.Text)

    competencias = db.relationship('Competencia', backref='aluno', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return{
            'pid':              self.pid,
            'nome':             self.nome,
            'dataNascimento':   self.data_nascimento,
            'telefone':         self.telefone,
            'nomePai1':         self.nome_pai1,
            'nomePai2':         self.nome_pai2,
            'endereco':         self.endereco,
            'numero':           self.numero,
            'idade':            self.idade,
            'sexo':             self.sexo,
            'salas':            [{'sid': s.sid, 'nome': s.nome} for s in self.salas],
            'competencias':     [c.to_dict() for c in self.competencias],

        }
    
    def __repr__(self):
        return f'<Aluno {self.nome}>'

class Salas(db.Model):
    __tablename__ = 'salas'
 
    sid             = db.Column(db.Integer, primary_key=True)
    nome            = db.Column(db.Text, nullable=False)
    tipo            = db.Column(db.Text, nullable=False)
    turno           = db.Column(db.Text, nullable=False)
    horario_inicio  = db.Column(db.Text)
    horario_termino = db.Column(db.Text)
 
    alunos = db.relationship('Alunos', secondary=sala_alunos, backref='salas')
 
    def to_dict(self):
        return {
            'sid':            self.sid,
            'nome':           self.nome,
            'tipo':           self.tipo,
            'turno':          self.turno,
            'horarioInicio':  self.horario_inicio,
            'horarioTermino': self.horario_termino,
            'alunos':         [{'pid': a.pid, 'nome': a.nome} for a in self.alunos],
            'totalAlunos':    len(self.alunos),
        }
 
    def __repr__(self):
        return f'<Sala {self.nome}>'
    
