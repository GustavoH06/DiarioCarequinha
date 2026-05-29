from flask import request, jsonify
from models import Alunos

def register_routes(app, db):
    @app.route('/api/alunos', methods=['GET', 'POST'])
    def alunos():
        if request.method == 'GET':
            todos = Alunos.query.all()
            return jsonify([a.to_dict() for a in todos]), 200
        
        elif request.method == 'POST':
            data = request.get_json()

            aluno = Alunos(
                nome            = data.get('nome'),
                data_nascimento = data.get('dataNascimento'),
                telefone        = data.get('telefone'),
                nome_pai1        = data.get('nomePai1'),
                nome_pai2        = data.get('nomePai2'),
                endereco        = data.get('endereco'),
                numero          = data.get('numero'),
                sala            = data.get('sala'),
                idade           = data.get('idade'),
                sexo            = data.get('sexo'),
            )

            db.session.add(aluno)
            db.session.commit()
            return jsonify(aluno.to_dict()), 201
    
    @app.route('/api/alunos/<int:pid>', methods=['GET', 'DELETE'])
    def aluno(pid):
        aluno = Alunos.query.get_or_404(pid)

        if request.method == 'GET':
            return jsonify(aluno.to_dict()), 200
        
        elif request.method == 'DELETE':
            db.sesion.delete(aluno)
            db.sesion.commit()
            return jsonify({'message': f'Aluno {pid} removido'}), 200
