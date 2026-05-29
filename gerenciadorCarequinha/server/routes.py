from flask import request, jsonify
from models import Alunos, Salas

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

    
    @app.route('/api/salas', methods=['GET', 'POST'])
    def salas():
        if request.method == 'GET':
            todas = Salas.query.all()
            return jsonify([s.to_dict() for s in todas]), 200
 
        elif request.method == 'POST':
            data = request.get_json()
            sala = Salas(
                nome            = data.get('nome'),
                tipo            = data.get('tipo'),
                turno           = data.get('turno'),
                horario_inicio  = data.get('horarioInicio'),
                horario_termino = data.get('horarioTermino'),
            )
            for pid in data.get('alunoIds', []):
                aluno = Alunos.query.get(pid)
                if aluno:
                    sala.alunos.append(aluno)
 
            db.session.add(sala)
            db.session.commit()
            return jsonify(sala.to_dict()), 201
 
    @app.route('/api/salas/<int:sid>', methods=['GET', 'DELETE'])
    def sala(sid):
        sala = Salas.query.get_or_404(sid)
 
        if request.method == 'GET':
            return jsonify(sala.to_dict()), 200
 
        elif request.method == 'DELETE':
            db.session.delete(sala)
            db.session.commit()
            return jsonify({'message': f'Sala {sid} removida'}), 200
 
    @app.route('/api/salas/<int:sid>/alunos/<int:pid>', methods=['POST', 'DELETE'])
    def sala_aluno(sid, pid):
        sala  = Salas.query.get_or_404(sid)
        aluno = Alunos.query.get_or_404(pid)
 
        if request.method == 'POST':
            if aluno not in sala.alunos:
                sala.alunos.append(aluno)
                db.session.commit()
            return jsonify(sala.to_dict()), 200
 
        elif request.method == 'DELETE':
            if aluno in sala.alunos:
                sala.alunos.remove(aluno)
                db.session.commit()
            return jsonify(sala.to_dict()), 200
